import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import createSkipCountStep from './createSkipCountStep';
import { verifyObservable } from '../../verifyObservable';
import createNextStep from '../next/createNextStep';
import createCompleteStep from '../complete/createCompleteStep';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';

describe('Observable spy - createSkipCountStep', function () {
	it('should skip next two values in proper order', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await verifyObservable(strings$, [
			createSkipCountStep('skipCount', 2),
			createNextStep('next', 'Ana'),
			createCompleteStep('complete'),
		]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if received less values then expected', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await verifyObservable(strings$, [
				createSkipCountStep('skipCount', 10),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[skipCount] - expected signal: next, actual signal: complete, expected value: 10',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should not work with values <= 0', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await verifyObservable(strings$, [
				createSkipCountStep('skipCount', 0),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.message).to.be.equal(
				'[skipCount] - skip number should be > 0, received value 0',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of next event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [
				createSkipCountStep('skipCount', 3),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[skipCount] - expected signal: next, actual signal: error, expected value: 3, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of next event', async function () {
		try {
			await verifyObservable(EMPTY, [
				createSkipCountStep('skipCount', 1),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[skipCount] - expected signal: next, actual signal: complete, expected value: 1',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

