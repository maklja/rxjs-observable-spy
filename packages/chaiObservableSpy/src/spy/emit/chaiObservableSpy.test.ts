import { expect } from 'chai';
import { from } from 'rxjs';
import '../../register';
import { ObservableSpyAssertionError } from '../common/error';

describe('Chai observable spy observableSpy keyword', function () {
	it('should fail if tested object is not instance of Observable', async function () {
		try {
			const enotObservable$ = 'Not observable';
			await expect(enotObservable$)
				.observableSpy.consumeNext((val) => expect(val).to.be.equal('John'))
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.null;
			expect(error.message).to.be.equal(
				'[observableSpy] - expected string to be a Observable',
			);
		}
	});

	it('should consume received values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await expect(strings$)
			.observableSpy.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});
});
