import { EventType } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { of, throwError } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy complete keyword', function () {
	it('should verify that observable has completed', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await expect(strings$)
			.emit.next('Tom')
			.next('Tina')
			.next('Ana')
			.complete()
			.verify();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if receive unexpected next value', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await expect(strings$).emit.complete().verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Complete);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[complete] - expected signal: complete, actual signal: next, actual value: Tom',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of complete event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await expect(error$).emit.complete().verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Complete);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[complete] - expected signal: complete, actual signal: error, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

