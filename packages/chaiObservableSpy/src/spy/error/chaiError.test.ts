import { EventType } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy error, errorType and errorMessage keyword', function () {
	it('should catch expected error', async function () {
		const error$ = throwError(() => new Error('This is an error'));

		await expect(error$).emit.error(Error, 'This is an error').verify();
		await expect(error$).emit.errorMessage('This is an error').verify();
		await expect(error$).emit.errorType(Error).verify();
	});

	it('should fail if receives next event instead of error event', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		try {
			await expect(strings$).emit.errorType(Error).verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[errorType] - expected signal: error, actual signal: next, actual value: Tom',
			);
		}
	});

	it('should fail if type does not match', async function () {
		const error$ = throwError(() => 'Unexpected error');

		try {
			await expect(error$).emit.errorType(Error).verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[errorType] - expected error type: Error, actual error type: string',
			);
		}
	});

	it('should fail if instance does not match', async function () {
		const error$ = throwError(() => new Error('Unexpected error'));

		try {
			await expect(error$).emit.errorType(TypeError).verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[errorType] - expected error type: TypeError, actual error type: Error',
			);
		}
	});

	it('should fail if error instance message does not match', async function () {
		const error$ = throwError(() => new Error('Unexpected error'));

		try {
			await expect(error$).emit.errorMessage('Error').verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[errorMessage] - expected error message: Error, actual error message: Unexpected error',
			);
		}
	});

	it('should fail if error message does not match', async function () {
		const error$ = throwError(() => 'Unexpected error');

		try {
			await expect(error$).emit.errorMessage('Error').verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[errorMessage] - expected error message: Error, actual error message: Unexpected error',
			);
		}
	});

	it('should fail if complete event is received instead of error event', async function () {
		const empty$ = EMPTY;

		try {
			await expect(empty$).emit.errorType(Error).verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[errorType] - expected signal: error, actual signal: complete',
			);
		}
	});
});

