import { expect } from 'chai';
import { EMPTY, from, throwError } from 'rxjs';
import createNextMatchesStep from './createNextMatchesStep';
import { verifyObservable } from '../../verifyObservable';
import createCompleteStep from '../complete/createCompleteStep';
import { ObservableSpyAssertionError } from '../../../errors';
import { EventType } from '../../../spy';

describe('Observable spy - createNextMatchesStep', function () {
	it('should match received values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await verifyObservable(strings$, [
			createNextMatchesStep('nextMatches', (val, i) => sourceValues[i] === val),
			createNextMatchesStep('nextMatches', (val, i) => sourceValues[i] === val),
			createNextMatchesStep('nextMatches', (val, i) => sourceValues[i] === val),
			createCompleteStep('complete'),
		]);
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if any mismatch', async function () {
		try {
			const sourceValues = ['Tom', 'Tina', 'Ana'];
			const strings$ = from(sourceValues);

			await verifyObservable(strings$, [
				createNextMatchesStep('nextMatches', (val, i) => sourceValues[i] === val),
				createNextMatchesStep('nextMatches', (val) => val === 'Mike'),
				createNextMatchesStep('nextMatches', (val, i) => sourceValues[i] === val),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.receivedEvent).to.be.equal(EventType.Next);
			expect(error.message).to.be.equal('[nextMatches] - match failed for value Tina');

			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if error event is received instead of next event', async function () {
		try {
			const error$ = throwError(() => new Error('Unexpected error'));

			await verifyObservable(error$, [
				createNextMatchesStep('nextMatches', (val) => val === 'Mike'),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Error);
			expect(error.message).to.be.equal(
				'[nextMatches] - expected signal: next, actual signal: error, actual error: Error - Unexpected error',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if complete event is received instead of next event', async function () {
		try {
			await verifyObservable(EMPTY, [
				createNextMatchesStep('nextMatches', (val) => val === 'Mike'),
				createCompleteStep('complete'),
			]);
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.equal(EventType.Next);
			expect(error.receivedEvent).to.be.equal(EventType.Complete);
			expect(error.message).to.be.equal(
				'[nextMatches] - expected signal: next, actual signal: complete',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

