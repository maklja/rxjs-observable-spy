import { EventType } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy next keyword', function () {
	it('should receive values in proper order', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await expect(strings$)
			.emit.next('Tom')
			.next('Tina')
			.next('Ana')
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if receive unexpected next value', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		try {
			await expect(strings$).emit.next('Tom').next('Mike').next('Ana').verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[next] - expected next value: Mike, actual value Tina',
			);
		}
	});

	it('should fail if error event is received instead of next event', async function () {
		const error$ = throwError(() => new Error('Unexpected error'));

		try {
			await expect(error$).emit.next('Tom').next('Tina').next('Ana').verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[next] - expected signal: next, actual signal: error, expected value: Tom, actual error: Error - Unexpected error',
			);
		}
	});

	it('should fail if complete event is received instead of next event', async function () {
		const empty$ = EMPTY;

		try {
			await expect(empty$).emit.next('Tom').next('Tina').next('Ana').verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[next] - expected signal: next, actual signal: complete, expected value: Tom',
			);
		}
	});
});

