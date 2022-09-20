import { ObservableSpyAssertionError } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { EMPTY } from 'rxjs';
import '../../register';

describe('Chai observable spy observable keyword', function () {
	it('should fail if tested object is not instance of Observable', function () {
		try {
			expect('Not observable').to.be.an.observable();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.null;
			expect(error.message).to.be.equal('[observable] - expected string to be a Observable');
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should not throw an error if it is an instance of Observable', function () {
		expect(EMPTY).to.be.an.observable();
	});
});

