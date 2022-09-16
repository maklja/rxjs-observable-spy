import { EventType } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, from, throwError } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy consumeNextUntil keyword', function () {
	it('should consume all next values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await expect(strings$)
			.emit.consumeNextUntil((val, i) => {
				expect(val).to.be.equal(sourceValues[i]);

				return i < sourceValues.length - 1;
			})
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if any error occurs in consume callback', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		try {
			await expect(strings$)
				.emit.consumeNextUntil((val, i) => {
					expect(val).to.be.equal(sourceValues[i]);

					if (i < 1) {
						expect(val).to.be.equal(sourceValues[i]);
					} else {
						expect(val).to.be.equal('John');
					}

					return i < sourceValues.length - 1;
				})
				.verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.equal("expected 'Tina' to equal 'John'");
		}
	});

	it('should fail if error event is received instead of next event', async function () {
		const error$ = throwError(() => new Error('Unexpected error'));

		try {
			await expect(error$)
				.emit.consumeNextUntil((x) => x != null)
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[consumeNextUntil] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
		}
	});

	it('should fail if complete event is received instead of next event', async function () {
		const empty$ = EMPTY;

		try {
			await expect(empty$)
				.emit.consumeNextUntil((x) => x != null)
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[consumeNextUntil] - expected signal: next, actual signal: complete',
			);
		}
	});
});

