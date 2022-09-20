import { EventType, ObservableSpyAssertionError } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { from, of, throwError } from 'rxjs';
import '../../register';

describe('Chai observable spy awaitComplete keyword', function () {
	it('should verify that observable has completed', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await expect(strings$).emit.next('Tom').next('Tina').awaitComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should receive next values and verify that observable has completed', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await expect(strings$).emit.awaitComplete((val, i) =>
			expect(val).to.be.equal(sourceValues[i]),
		);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should skip all next values and await complete', async function () {
		const strings$ = of('Tom', 'Tina', 'Ana');

		const values = await expect(strings$).emit.awaitComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if error event is received instead of next or complete event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await expect(error$).emit.awaitComplete();
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

