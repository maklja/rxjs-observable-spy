import { ObservableSpyAssertionError } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import '../../register';

describe('Chai observable spy emit keyword', function () {
	it('should fail if tested object is not instance of Observable', async function () {
		try {
			await expect('Not observable')
				.emit.consumeNext((val) => expect(val).to.be.equal('John'))
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.null;
			expect(error.message).to.be.equal('[emit] - expected string to be a Observable');
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if named tested object is not instance of Observable', async function () {
		try {
			await expect('Not observable')
				.oSpy('notObservable')
				.consumeNext((val) => expect(val).to.be.equal('John'))
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.null;
			expect(error.message).to.be.equal(
				'[oSpy(notObservable)] - expected string to be a Observable',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});
});

