import { EventType } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy nextCount keyword', function () {
	it('should receive proper values count', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await expect(strings$).emit.nextCount(3).verify();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if received less values then expected', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');
		try {
			await expect(strings$).emit.nextCount(4).verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextCount] - missing next values, expected count 4, actual count 3',
			);
		}
	});

	it('should fail if received more values then expected', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');
		try {
			await expect(strings$).emit.nextCount(2).verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextCount] - too many next values, expected count 2, actual count 3',
			);
		}
	});

	it('should work with zero count number', async function () {
		const empty$ = EMPTY;

		const values = await expect(empty$).emit.nextCount(0).verify();
		expect(values).to.be.empty;
	});

	it('should fail if error event is received instead of next event', async function () {
		const error$ = throwError(() => new Error('Unexpected error'));

		try {
			await expect(error$).emit.nextCount(3).verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[nextCount] - expected signal: next, actual signal: error, expected value: 1, actual error: Error - Unexpected error',
			);
		}
	});

	it('should fail if complete event is received instead of next event', async function () {
		const empty$ = EMPTY;

		try {
			await expect(empty$).emit.nextCount(1).verify();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextCount] - missing next values, expected count 1, actual count 0',
			);
		}
	});
});

