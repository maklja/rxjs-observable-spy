import { expect } from 'chai';
import { EMPTY, from, throwError } from 'rxjs';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';
import { verifyObservable } from '../../verifyObservable';
import createCompleteStep from '../complete/createCompleteStep';
import createConsumeNextStep from './createConsumeNextStep';

describe('Observable spy - createConsumeNextStep', function () {
	it('should consume received values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await verifyObservable(strings$, [
			createConsumeNextStep('consumeNext', (val, i) =>
				expect(val).to.be.equal(sourceValues[i]),
			),
			createConsumeNextStep('consumeNext', (val, i) =>
				expect(val).to.be.equal(sourceValues[i]),
			),
			createConsumeNextStep('consumeNext', (val, i) =>
				expect(val).to.be.equal(sourceValues[i]),
			),
			createCompleteStep('complete'),
		]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if any error occurs in consume callback', async function () {
		try {
			const sourceValues = ['Tom', 'Tina', 'Ana'];
			const strings$ = from(sourceValues);

			await verifyObservable(strings$, [
				createConsumeNextStep('consumeNext', (val, i) =>
					expect(val).to.be.equal(sourceValues[i]),
				),
				createConsumeNextStep('consumeNext', (val) => expect(val).to.be.equal('John')),
				createConsumeNextStep('consumeNext', (val, i) =>
					expect(val).to.be.equal(sourceValues[i]),
				),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.equal("expected 'Tina' to equal 'John'");
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of next event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [
				createConsumeNextStep('consumeNext', (val) => expect(val).to.be.equal('John')),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[consumeNext] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of next event', async function () {
		try {
			await verifyObservable(EMPTY, [
				createConsumeNextStep('consumeNext', (val) => expect(val).to.be.equal('John')),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[consumeNext] - expected signal: next, actual signal: complete',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

