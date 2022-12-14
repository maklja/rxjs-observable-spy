import { EventType, ObservableSpyAssertionError } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import '../../register';

describe('Chai observable spy skipCount keyword', function () {
	it('should skip next two values in proper order', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await expect(strings$).emit.skipCount(2).next('Ana').verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if received less values then expected', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await expect(strings$).emit.skipCount(10, 'skip10').verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[skip10] - expected signal: next, actual signal: complete, expected value: 10',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should not work with values <= 0', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await expect(strings$).emit.skipCount(0).verifyComplete();
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

			await expect(error$).emit.skipCount(3).verifyComplete();
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
			await expect(EMPTY).emit.skipCount(1).verifyComplete();
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

