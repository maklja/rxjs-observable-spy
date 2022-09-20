import { expect } from 'chai';
import { EMPTY } from 'rxjs';
import { ObservableSpyAssertionError } from '../../errors';
import observableAssertion from './observableAssertion';

describe('Observable spy - observableAssertion', function () {
	it('should not throw error if tested object is instance of Observable', async function () {
		observableAssertion('observable', EMPTY);
	});

	it('should fail if tested object is not instance of Observable', async function () {
		try {
			observableAssertion('observable', 'Not observable');
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.null;
			expect(error.message).to.be.equal('[observable] - expected string to be a Observable');
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

