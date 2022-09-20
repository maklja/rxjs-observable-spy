import { expect } from 'chai';
import { EMPTY, of, throwError } from 'rxjs';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';

import { verifyObservable } from '../../verifyObservable';
import createCompleteStep from '../complete/createCompleteStep';
import createNextStep from './createNextStep';

describe('Observable spy - createNextStep', function () {
	it('should receive values in proper order', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await verifyObservable(strings$, [
			createNextStep('next', 'Tom'),
			createNextStep('next', 'Tina'),
			createNextStep('next', 'Ana'),
			createCompleteStep('complete'),
		]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if receive unexpected next value', async function () {
		try {
			const strings$ = of('Tom', 'Tina', 'Ana');

			await verifyObservable(strings$, [
				createNextStep('next', 'Tom'),
				createNextStep('next', 'Mike'),
				createNextStep('next', 'Ana'),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal(
				'[next] - expected next value: Mike, actual value Tina',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of next event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [
				createNextStep('next', 'Tom'),
				createNextStep('next', 'Tina'),
				createNextStep('next', 'Ana'),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[next] - expected signal: next, actual signal: error, expected value: Tom, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of next event', async function () {
		try {
			await verifyObservable(EMPTY, [
				createNextStep('next', 'Tom'),
				createNextStep('next', 'Tina'),
				createNextStep('next', 'Ana'),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[next] - expected signal: next, actual signal: complete, expected value: Tom',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

