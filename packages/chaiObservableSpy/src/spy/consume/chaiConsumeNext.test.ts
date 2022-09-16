import { EventType } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, from, throwError } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy consumeNext keyword', function () {
	it('should consume received values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await expect(strings$)
			.emit.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if any error occurs in consume callback', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		try {
			await expect(strings$)
				.emit.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
				.consumeNext((val) => expect(val).to.be.equal('John'))
				.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
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
				.emit.consumeNext((val) => expect(val).to.be.equal('John'))
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[consumeNext] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
		}
	});

	it('should fail if complete event is received instead of next event', async function () {
		const empty$ = EMPTY;

		try {
			await expect(empty$)
				.emit.consumeNext((val) => expect(val).to.be.equal('John'))
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[consumeNext] - expected signal: next, actual signal: complete',
			);
		}
	});
});

