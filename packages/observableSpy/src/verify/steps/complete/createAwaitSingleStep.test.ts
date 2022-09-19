import { expect } from 'chai';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';
import { verifyObservable } from '../../verifyObservable';
import createNextStep from '../next/createNextStep';
import createAwaitSingleStep from './createAwaitSingleStep';

describe('Observable spy - createAwaitSingleStep', function () {
	it('should await single value and verify complete event', async function () {
		const string$ = of('Tom');

		const values = await verifyObservable(string$, [createAwaitSingleStep('awaitSingle')]);
		expect(values).to.be.deep.equal(['Tom']);
	});

	it('should fail if receive multiple next values', async function () {
		try {
			const strings$ = of('Tom', 'Ana');

			await verifyObservable(strings$, [createAwaitSingleStep('awaitSingle')]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Complete);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[awaitSingle] - received multiple values, when single one was expected',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if no values are received', async function () {
		try {
			await verifyObservable(EMPTY, [createAwaitSingleStep('awaitSingle')]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[awaitSingle] - expected to receive a single value, but received zero',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if receive multiple next values and then complete', async function () {
		try {
			const strings$ = of('Tom', 'Ana');
			await verifyObservable(strings$, [
				createNextStep('next', 'Tom'),
				createNextStep('next', 'Ana'),
				createAwaitSingleStep('awaitSingle'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[awaitSingle] - received multiple values, when single one was expected',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of next event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));
			await verifyObservable(error$, [createAwaitSingleStep('awaitSingle')]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[awaitSingle] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of complete event', async function () {
		try {
			const error$ = new Observable((observer) => {
				observer.next('Tom');
				observer.error(new Error('Unexpected error'));
			});
			await verifyObservable(error$, [createAwaitSingleStep('awaitSingle')]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Complete);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[awaitSingle] - expected signal: complete, actual signal: error, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

