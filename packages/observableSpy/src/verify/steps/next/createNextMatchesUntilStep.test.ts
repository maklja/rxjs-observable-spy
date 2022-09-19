import { expect } from 'chai';
import { EMPTY, from, throwError } from 'rxjs';
import createNextMatchesUntilStep from './createNextMatchesUntilStep';
import { verifyObservable } from '../../verifyObservable';
import createCompleteStep from '../complete/createCompleteStep';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';

describe('Observable spy - createNextMatchesUntilStep', function () {
	it('should match received values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const condition = (_: string, index: number) => index < sourceValues.length - 1;

		const values = await verifyObservable(strings$, [
			createNextMatchesUntilStep(
				'nextMatchesUntil',
				(val, i) => sourceValues[i] === val,
				condition,
			),
			createCompleteStep('complete'),
		]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if any mismatch', async function () {
		try {
			const sourceValues = ['Tom', 'Tina', 'Ana'];
			const strings$ = from(sourceValues);

			const condition = (_: string, index: number) => index < sourceValues.length - 1;

			await verifyObservable(strings$, [
				createNextMatchesUntilStep(
					'nextMatchesUntil',
					(val, i) => (i < 1 ? sourceValues[i] === val : 'John' === val),
					condition,
					'buggedObservable',
				),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[nextMatchesUntil(buggedObservable)] - match failed for value Tina',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of next event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [
				createNextMatchesUntilStep(
					'nextMatchesUntil',
					(x) => x != null,
					() => true,
				),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[nextMatchesUntil] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of next event', async function () {
		try {
			await verifyObservable(EMPTY, [
				createNextMatchesUntilStep(
					'nextMatchesUntil',
					(x) => x != null,
					() => true,
				),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextMatchesUntil] - expected signal: next, actual signal: complete',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

