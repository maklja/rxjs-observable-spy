import { EventType } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy awaitSingle keyword', function () {
	it('should await single value and verify complete event', async function () {
		const string$ = of('Tom');

		const value = await expect(string$).emit.awaitSingle();
		expect(value).to.be.equal('Tom');
	});

	it('should fail if receive multiple next values', async function () {
		const strings$ = of('Tom', 'Ana');

		try {
			await expect(strings$).emit.awaitSingle();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Complete);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[awaitSingle] - received multiple values, when single one was expected',
			);
		}
	});

	it('should fail if no values are received', async function () {
		try {
			await expect(EMPTY).emit.awaitSingle();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[awaitSingle] - expected to receive a single value, but received zero',
			);
		}
	});

	it('should fail if receive multiple next values and then complete', async function () {
		const strings$ = of('Tom', 'Ana');

		try {
			await (
				expect(strings$)
					.emit.next('Tom')
					// hack to force call to the awaitSingle, because TS will not allowed this
					// but plain JS will
					.next('Ana') as unknown as Chai.ObservableSingleLanguageChains
			).awaitSingle();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[awaitSingle] - received multiple values, when single one was expected',
			);
		}
	});

	it('should fail if error event is received instead of next event', async function () {
		const error$ = throwError(() => new Error('Unexpected error'));

		try {
			await expect(error$).emit.awaitSingle();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[awaitSingle] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
		}
	});

	it('should fail if error event is received instead of complete event', async function () {
		const error$ = new Observable((observer) => {
			observer.next('Tom');
			observer.error(new Error('Unexpected error'));
		});

		try {
			await expect(error$).emit.awaitSingle();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Complete);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[awaitSingle] - expected signal: complete, actual signal: error, actual error: Error - Unexpected error',
			);
		}
	});
});
