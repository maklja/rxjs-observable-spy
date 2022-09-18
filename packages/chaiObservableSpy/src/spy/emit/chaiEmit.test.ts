import { expect } from 'chai';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy emit keyword', function () {
	it('should fail if tested object is not instance of Observable', async function () {
		try {
			const enotObservable$ = 'Not observable';
			await expect(enotObservable$)
				.emit.consumeNext((val) => expect(val).to.be.equal('John'))
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.null;
			expect(error.message).to.be.equal('[emit] - expected string to be a Observable');
		}
	});
});
