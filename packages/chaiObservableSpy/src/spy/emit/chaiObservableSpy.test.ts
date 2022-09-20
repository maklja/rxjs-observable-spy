import { ObservableSpyAssertionError } from '@maklja90/rxjs-observable-spy';
import { expect } from 'chai';
import { from } from 'rxjs';
import '../../register';

describe('Chai observable spy observableSpy keyword', function () {
	it('should fail if tested object is not instance of Observable', async function () {
		try {
			await expect('Not observable')
				.observableSpy('notObservable')
				.consumeNext((val) => expect(val).to.be.equal('John'))
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.null;
			expect(error.message).to.be.equal(
				'[observableSpy(notObservable)] - expected string to be a Observable',
			);
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should fail if tested object is not instance of Observable, but without name', async function () {
		try {
			await expect('Not observable')
				.oSpy()
				.consumeNext((val) => expect(val).to.be.equal('John'))
				.verifyComplete();
		} catch (e) {
			const error = e as ObservableSpyAssertionError;
			expect(error.expectedEvent).to.be.null;
			expect(error.receivedEvent).to.be.null;
			expect(error.message).to.be.equal('[oSpy] - expected string to be a Observable');
			return;
		}

		throw new Error('Error should be thrown from the observable');
	});

	it('should consume received values in proper order', async function () {
		const sourceValues = ['Tom', 'Tina', 'Ana'];
		const strings$ = from(sourceValues);

		const values = await expect(strings$)
			.observableSpy('stringObservable')
			.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.consumeNext((val, i) => expect(val).to.be.equal(sourceValues[i]))
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});
});

