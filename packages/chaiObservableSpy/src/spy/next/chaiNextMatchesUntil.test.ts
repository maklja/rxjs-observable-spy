import { EventType } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, from, throwError } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy nextMatchesUntil keyword', function () {
	it('should match received values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const condition = (_: string, index: number) => index < sourceValues.length - 1;

		const values = await expect(strings$)
			.emit.nextMatchesUntil((val, i) => sourceValues[i] === val, condition)
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if any mismatch', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const condition = (_: string, index: number) => index < sourceValues.length - 1;

		try {
			await expect(strings$)
				.emit.nextMatchesUntil(
					(val, i) => (i < 1 ? sourceValues[i] === val : 'John' === val),
					condition,
				)
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal('[nextMatchesUntil] - match failed for value Tina');
		}
	});

	it('should fail if error event is received instead of next event', async function () {
		const error$ = throwError(() => new Error('Unexpected error'));

		try {
			await expect(error$)
				.emit.nextMatchesUntil(
					(x) => x != null,
					() => true,
				)
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[nextMatchesUntil] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
		}
	});

	it('should fail if complete event is received instead of next event', async function () {
		const empty$ = EMPTY;

		try {
			await expect(empty$)
				.emit.nextMatchesUntil(
					(x) => x != null,
					() => true,
				)
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextMatchesUntil] - expected signal: next, actual signal: complete',
			);
		}
	});
});

