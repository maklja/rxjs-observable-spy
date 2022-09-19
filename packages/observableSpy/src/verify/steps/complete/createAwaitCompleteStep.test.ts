import { expect } from 'chai';
import { from, of, throwError } from 'rxjs';
import createNextStep from '../next/createNextStep';
import createAwaitCompleteStep from './createAwaitCompleteStep';
import { verifyObservable } from '../../verifyObservable';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';

describe('Observable spy - createAwaitCompleteStep', function () {
	it('should verify that observable has completed', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await verifyObservable(strings$, [
			createNextStep('next', 'Tom'),
			createNextStep('next', 'Tina'),
			createAwaitCompleteStep('awaitComplete'),
		]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should receive next values and verify that observable has completed', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await verifyObservable(strings$, [
			createAwaitCompleteStep('awaitComplete', (val, i) =>
				expect(val).to.be.equal(sourceValues[i]),
			),
		]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should skip all next values and await complete', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await verifyObservable(strings$, [createAwaitCompleteStep('awaitComplete')]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if error event is received instead of next or complete event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [createAwaitCompleteStep('awaitComplete')]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Complete);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[awaitComplete] - expected signal: complete, actual signal: error, actual error: Error - Unexpected error',
			);
			return;
		}
		throw new Error('Error should be thrown from the observable');
	});
});

