import { EventType, ObservableSpyAssertionError } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import '../../register';

describe('Chai observable spy consumeError keyword', function () {
	it('should catch expected error', async function () {
		const error$ = throwError(() => new Error('This is an error'));

		await expect(error$)
			.emit.consumeError<Error>((e: Error) => {
				expect(e).to.be.instanceOf(Error);
				expect(e.message).to.be.equal('This is an error');
			})
			.verify();
	});

	it('should fail if expect assert fails', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await expect(error$)
				.emit.consumeError<Error>((e: Error) => {
					expect(e).to.be.instanceOf(String);
				})
				.verify();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.equal(
				'expected Error: Unexpected error to be an instance of String',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if receives next event instead of error event', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await expect(strings$)
				.emit.consumeError<Error>((e: Error) => {
					expect(e).to.be.instanceOf(Error);
					expect(e.message).to.be.equal('This is an error');
				}, 'errorOnNext')
				.verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[errorOnNext] - expected signal: error, actual signal: next, actual value: Tom',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of error event', async function () {
		try {
			await expect(EMPTY)
				.emit.consumeError<Error>((e: Error) => {
					expect(e).to.be.instanceOf(Error);
				})
				.verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[consumeError] - expected signal: error, actual signal: complete',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

