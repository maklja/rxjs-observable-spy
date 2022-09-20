import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import createNextCountStep from './createNextCountStep';
import { verifyObservable } from '../../verifyObservable';
import createCompleteStep from '../complete/createCompleteStep';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';

describe('Observable spy - createNextCountStep', function () {
	it('should receive proper values count', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await verifyObservable(strings$, [
			createNextCountStep('nextCount', 3),
			createCompleteStep('complete'),
		]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if received less values then expected', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await verifyObservable(strings$, [
				createNextCountStep('nextCount', 4),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextCount] - missing next values, expected count 4, actual count 3',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if received more values then expected', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await verifyObservable(strings$, [
				createNextCountStep('nextCount', 2),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextCount] - too many next values, expected count 2, actual count 3',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should work with zero count number', async function () {
		const values = await verifyObservable(EMPTY, [
			createNextCountStep('nextCount', 0),
			createCompleteStep('complete'),
		]);
		expect(values).to.be.empty;
	});

	it('should fail if error event is received instead of next event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [
				createNextCountStep('nextCount', 3),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[nextCount] - expected signal: next, actual signal: error, expected value: 1, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of next event', async function () {
		try {
			await verifyObservable(EMPTY, [
				createNextCountStep('nextCount', 1),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextCount] - missing next values, expected count 1, actual count 0',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

