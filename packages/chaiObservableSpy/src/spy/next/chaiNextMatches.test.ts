import { EventType, ObservableSpyAssertionError } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, from, throwError } from 'rxjs';
import '../../register';

describe('Chai observable spy nextMatches keyword', function () {
	it('should match received values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await expect(strings$)
			.emit.nextMatches((val, i) => sourceValues[i] === val)
			.nextMatches((val, i) => sourceValues[i] === val)
			.nextMatches((val, i) => sourceValues[i] === val)
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if any mismatch', async function () {
		try {
			const sourceValues = ['Tom', 'Tina', 'Ana'];
			const strings$ = from(sourceValues);

			await expect(strings$)
				.emit.nextMatches((val, i) => sourceValues[i] === val)
				.nextMatches((val) => val === 'John', 'nextMatchJohn')
				.nextMatches((val, i) => sourceValues[i] === val)
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal('[nextMatchJohn] - match failed for value Tina');

			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of next event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await expect(error$)
				.emit.nextMatches((val) => val === 'John')
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[nextMatches] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of next event', async function () {
		try {
			await expect(EMPTY)
				.emit.nextMatches((val) => val === 'John')
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextMatches] - expected signal: next, actual signal: complete',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

