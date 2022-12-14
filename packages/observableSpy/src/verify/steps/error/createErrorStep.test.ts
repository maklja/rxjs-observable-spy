import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';
import { verifyObservable } from '../../verifyObservable';
import createErrorStep from './createErrorStep';

describe('Observable spy - createErrorStep', function () {
	it('should catch expected error', async function () {
		const error$ = throwError(() => new Error('This is an error'));

		await verifyObservable(error$, [createErrorStep('error', Error, 'This is an error')]);
		await verifyObservable(error$, [
			createErrorStep<string, Error>('error', undefined, 'This is an error'),
		]);
		await verifyObservable(error$, [createErrorStep('error', Error)]);
	});

	it('should fail if receives next event instead of error event', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await verifyObservable(strings$, [createErrorStep('errorType', Error)]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[errorType] - expected signal: error, actual signal: next, actual value: Tom',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if type does not match', async function () {
		try {
			const error$ = throwError(() => 'Unexpected error');

			await verifyObservable(error$, [createErrorStep('errorType', Error)]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				"[errorType] - expected error type: Error, actual error type: string with message 'Unexpected error'",
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if instance does not match', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [createErrorStep('errorType', TypeError)]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				"[errorType] - expected error type: TypeError, actual error type: Error with message 'Unexpected error'",
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error instance message does not match', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [createErrorStep('errorMessage', undefined, 'Error')]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[errorMessage] - expected error message: Error, actual error message: Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error message does not match', async function () {
		try {
			const error$ = throwError(() => 'Unexpected error');

			await verifyObservable(error$, [createErrorStep('errorMessage', undefined, 'Error')]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[errorMessage] - expected error message: Error, actual error message: Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of error event', async function () {
		try {
			await verifyObservable(EMPTY, [createErrorStep('errorType', Error)]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[errorType] - expected signal: error, actual signal: complete',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

