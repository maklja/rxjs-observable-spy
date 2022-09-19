import { expect } from 'chai';
import { delay, filter, from, interval, map, Observable, of, tap, throwError } from 'rxjs';
import { ObservableSpy } from './observableSpy';
import { NotSubscribedError, UnexpectedObservableCompleteError } from '../errors';
import { CompleteListener, ErrorListener, NextListener } from './SubscribedSpy';

class MockError extends Error {
	constructor() {
		super('Mock error message');
		this.name = MockError.name;
	}
}

describe('ObservableSpy test', function () {
	describe('Test unsubscribed observable spy', function () {
		const observableSpy = new ObservableSpy(of(1, 2, 3, 4));

		it('will throw not subscribed error when calling onComplete', async function () {
			try {
				await observableSpy.onComplete();
			} catch (e) {
				const error = e as NotSubscribedError;
				expect(error).to.be.an.instanceOf(Error);
				expect(error.name).to.be.equal(NotSubscribedError.name);
				expect(error.message).to.be.equal(
					'Observable spy is not subscribed to the target observable',
				);
			}
		});

		it('will throw not subscribed error when calling onError', async function () {
			try {
				await observableSpy.onError();
			} catch (e) {
				const error = e as NotSubscribedError;
				expect(error).to.be.an.instanceOf(Error);
				expect(error.name).to.be.equal(NotSubscribedError.name);
				expect(error.message).to.be.equal(
					'Observable spy is not subscribed to the target observable',
				);
			}
		});
	});

	describe('Test observable spy event listeners', function () {
		it('will notify listener about next values', function (done) {
			const sourceValues = [1, 2, 3, 4];
			const observableSpy = new ObservableSpy(from(sourceValues));

			observableSpy.addNextListener((val, index) => {
				expect(val).to.be.equal(sourceValues[index]);
			});

			observableSpy.addCompleteListener(() => done());
			observableSpy.addErrorListener((error) => done(error));

			observableSpy.subscribe();
			observableSpy.onComplete();
		});

		it('will notify listener about error', function (done) {
			const observableSpy = new ObservableSpy(
				throwError(() => new Error('Unexpected error')),
			);

			observableSpy.addCompleteListener(() => done('Should not receive complete event'));
			observableSpy.addErrorListener((e) => {
				const error = e as Error;
				expect(error).to.be.an.instanceOf(Error);
				expect(error.message).to.be.equal('Unexpected error');
				done();
			});

			observableSpy.subscribe();
			observableSpy.onComplete();
		});

		it('will register and unregister next listener function', function () {
			const observableSpy = new ObservableSpy(of(1));

			const nextListener: NextListener<number> = () => {
				// for testing
			};

			expect(observableSpy.addNextListener(nextListener)).to.be.true;
			expect(observableSpy.addNextListener(nextListener)).to.be.false;
			expect(observableSpy.removeNextListener(nextListener)).to.be.true;
			expect(observableSpy.removeNextListener(nextListener)).to.be.false;
		});

		it('will register and unregister error listener function', function () {
			const observableSpy = new ObservableSpy(of(1));

			const errorListener: ErrorListener<number> = () => {
				// for testing
			};

			expect(observableSpy.addErrorListener(errorListener)).to.be.true;
			expect(observableSpy.addErrorListener(errorListener)).to.be.false;
			expect(observableSpy.removeErrorListener(errorListener)).to.be.true;
			expect(observableSpy.removeErrorListener(errorListener)).to.be.false;
		});

		it('will register and unregister complete listener function', function () {
			const observableSpy = new ObservableSpy(of(1));

			const completeListener: CompleteListener<number> = () => {
				// for testing
			};

			expect(observableSpy.addCompleteListener(completeListener)).to.be.true;
			expect(observableSpy.addCompleteListener(completeListener)).to.be.false;
			expect(observableSpy.removeCompleteListener(completeListener)).to.be.true;
			expect(observableSpy.removeCompleteListener(completeListener)).to.be.false;
		});
	});

	describe('Test numbers sequence with observable spy', function () {
		const sourceValues = [1, 2, 3, 4, 5];
		const targetValues = [2, 6, 10];
		const observableSpy = new ObservableSpy(
			from(sourceValues).pipe(
				delay(10),
				filter((val) => val % 2 != 0),
				map((val) => val * 2),
			),
		);

		before(async function () {
			observableSpy.subscribe();
			const receivedValues = await observableSpy.onComplete();
			expect(receivedValues).to.be.deep.equal(targetValues);
		});

		it('will receive number values in expected sequence', function () {
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

		it('will throw and error if subscribed second time', function () {
			expect(() => observableSpy.subscribe()).to.throw(
				Error,
				'Observable spy already subscribed',
			);
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
		const observableSpy = new ObservableSpy(throwError(() => new MockError()));

		before(async function () {
			observableSpy.subscribe();
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

		it('will throw and error if subscribed second time', function () {
			expect(() => observableSpy.subscribe()).to.throw(
				Error,
				'Observable spy already subscribed',
			);
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

	describe('Test interval sequence with observable spy', function () {
		const targetValues = [1, 3, 5, 7];
		const observableSpy = new ObservableSpy(
			interval(1_000).pipe(filter((val) => val % 2 === 1)),
			{ useTestScheduler: true },
		);

		before(function (done) {
			observableSpy.addNextListener((_, index) => {
				if (index > 2) {
					observableSpy.unsubscribe();
					done();
				}
			});

			observableSpy.subscribe();
		});

		it('will receive all interval number in expected sequence', function () {
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

		it('will not have received complete flag set', function () {
			expect(observableSpy.receivedComplete()).to.be.false;
		});

		it('will throw and error if subscribed second time', function () {
			expect(() => observableSpy.subscribe()).to.throw(
				Error,
				'Observable spy already subscribed',
			);
		});
	});

	describe('Test cold observable sequence with observable spy', function () {
		const targetValues = [0, 1, 2];
		const observable$ = new Observable<number>((observer) => {
			let value = 0;
			return interval(20)
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
		const observableSpy = new ObservableSpy(observable$);

		before(async function () {
			observableSpy.subscribe();
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

		it('will throw and error if subscribed second time', function () {
			expect(() => observableSpy.subscribe()).to.throw(
				Error,
				'Observable spy already subscribed',
			);
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

	describe('Test unexpected event from observable', function () {
		it('will throw an error if received complete instead of error', async function () {
			const observable$ = new Observable<number>((observer) => {
				let value = 0;
				return interval(20)
					.pipe(
						tap(() => {
							observer.next(value++);
							if (value > 2) {
								observer.complete();
							}
						}),
					)
					.subscribe();
			});
			const observableSpy = new ObservableSpy(observable$);

			try {
				observableSpy.subscribe();
				await observableSpy.onError();
			} catch (e) {
				const error = e as UnexpectedObservableCompleteError;
				expect(error).to.be.an.instanceOf(Error);
				expect(error.name).to.be.equal(UnexpectedObservableCompleteError.name);
				expect(error.message).to.be.equal('Unexpected observable complete event received');
			}
		});

		it('will throw an error if received error instead of complete', async function () {
			const observable$ = new Observable<number>((observer) => {
				let value = 0;
				return interval(20)
					.pipe(
						tap(() => {
							observer.next(value++);
							if (value > 2) {
								observer.error(new Error('Unexpected error'));
							}
						}),
					)
					.subscribe();
			});
			const observableSpy = new ObservableSpy(observable$);

			try {
				observableSpy.subscribe();
				await observableSpy.onComplete();
			} catch (e) {
				const error = e as Error;
				expect(error).to.be.an.instanceOf(Error);
				expect(error.message).to.be.equal('Unexpected error');
			}
		});
	});
});
