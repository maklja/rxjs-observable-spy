import { expect } from 'chai';
import { filter, from, interval, map, Observable, tap, throwError } from 'rxjs';
import { subscribeSpyTo } from './subscribeSpyTo';

class MockError extends Error {
	constructor() {
		super('Mock error message');
		this.name = MockError.name;
	}
}

describe('subscribeSpyTo test', function () {
	describe('Test numbers sequence with observable spy', function () {
		const sourceValues = [1, 2, 3, 4, 5];
		const targetValues = [2, 6, 10];
		const observableSpy = subscribeSpyTo(
			from(sourceValues).pipe(
				filter((val) => val % 2 != 0),
				map((val) => val * 2),
			),
		);

		before(async function () {
			const receivedValues = await observableSpy.onComplete();
			expect(receivedValues).to.be.deep.equal(targetValues);
		});

		it('will receive all number in expected sequence', function () {
			expect(observableSpy.getValues()).to.be.deep.equal(targetValues);
		});

		it('will have expected number of elements as target values', function () {
			expect(observableSpy.getValuesLength()).to.be.equal(targetValues.length);
		});

		it('will not have any error', function () {
			expect(observableSpy.getError()).to.be.null;
		});

		it('will not have received error flag set', function () {
			expect(observableSpy.receivedError()).to.be.false;
		});

		it('will have received complete flag set', function () {
			expect(observableSpy.receivedComplete()).to.be.true;
		});

		it('will throw and error if we try to await onError', async function () {
			try {
				await observableSpy.onError();
			} catch (e) {
				const error = e as Error;
				expect(error).to.be.instanceOf(Error);
				expect(error.message).to.be.equal('Unexpected observable complete event received');
			}
		});
	});

	describe('Test error sequence with observable spy', function () {
		const observableSpy = subscribeSpyTo(throwError(() => new MockError()));

		before(async function () {
			const receivedError = await observableSpy.onError<MockError>();
			expect(receivedError.name).to.be.equal(MockError.name);
			expect(receivedError.message).to.be.equal('Mock error message');
		});

		it('will receive error', function () {
			expect(observableSpy.getError<MockError>()?.name).to.be.equal(MockError.name);
			expect(observableSpy.getError<MockError>()?.message).to.be.equal('Mock error message');
		});

		it('will not have any next values', function () {
			expect(observableSpy.getValues()).to.be.empty;
			expect(observableSpy.getValuesLength()).to.be.equal(0);
		});

		it('will have received error flag set', function () {
			expect(observableSpy.receivedError()).to.be.true;
		});

		it('will not have received complete flag set', function () {
			expect(observableSpy.receivedComplete()).to.be.false;
		});

		it('will throw and error if we try to await onComplete', async function () {
			try {
				await observableSpy.onComplete();
			} catch (e) {
				const error = e as Error;
				expect(error).to.be.instanceOf(Error);
				expect(error.message).to.be.equal('Mock error message');
			}
		});
	});

	describe('Test cold observable sequence with observable spy', function () {
		const targetValues = [0, 1, 2];
		const observable$ = new Observable<number>((observer) => {
			let value = 0;
			return interval(5_000)
				.pipe(
					tap(() => {
						observer.next(value++);
						if (value > 2) {
							observer.error(new MockError());
						}
					}),
				)
				.subscribe();
		});
		const observableSpy = subscribeSpyTo(observable$, { useTestScheduler: true });

		before(async function () {
			const receivedError = await observableSpy.onError<MockError>();
			expect(receivedError.name).to.be.equal(MockError.name);
			expect(receivedError.message).to.be.equal('Mock error message');
		});

		it('will receive error', function () {
			expect(observableSpy.getError<MockError>()?.name).to.be.equal(MockError.name);
			expect(observableSpy.getError<MockError>()?.message).to.be.equal('Mock error message');
		});

		it('will have values before error occurred', function () {
			expect(observableSpy.getValues()).to.be.deep.equal(targetValues);
			expect(observableSpy.getValuesLength()).to.be.equal(targetValues.length);
		});

		it('will have received error flag set', function () {
			expect(observableSpy.receivedError()).to.be.true;
		});

		it('will not have received complete flag set', function () {
			expect(observableSpy.receivedComplete()).to.be.false;
		});

		it('will throw and error if we try to await onComplete', async function () {
			try {
				await observableSpy.onComplete();
			} catch (e) {
				const error = e as Error;
				expect(error).to.be.instanceOf(Error);
				expect(error.message).to.be.equal('Mock error message');
			}
		});
	});
});

