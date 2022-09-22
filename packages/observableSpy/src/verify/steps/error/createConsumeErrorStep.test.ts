import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';
import { verifyObservable } from '../../verifyObservable';
import createConsumeErrorStep from './createConsumeErrorStep';

describe('Observable spy - createConsumeErrorStep', function () {
	it('should catch expected error', async function () {
		const error$ = throwError(() => new Error('This is an error'));

		await verifyObservable(error$, [
			createConsumeErrorStep<never, Error>('consumeError', (error) => {
				expect(error).to.be.instanceOf(Error);
				expect(error.message).to.be.equal('This is an error');
			}),
		]);
	});

	it('should fail if receives next event instead of error event', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await verifyObservable(strings$, [
				createConsumeErrorStep<string, Error>('consumeError', (error) => {
					expect(error).to.be.instanceOf(Error);
					expect(error.message).to.be.equal('This is an error');
				}),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Error);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[consumeError] - expected signal: error, actual signal: next, actual value: Tom',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if expect assert fails', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [
				createConsumeErrorStep<never, Error>('consumeError', (error) => {
					expect(error).to.be.instanceOf(String);
				}),
			]);
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.equal(
				'expected Error: Unexpected error to be an instance of String',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of error event', async function () {
		try {
			await verifyObservable(EMPTY, [
				createConsumeErrorStep<never, Error>('consumeError', (error) => {
					expect(error).to.be.instanceOf(Error);
					expect(error.message).to.be.equal('This is an error');
				}),
			]);
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

