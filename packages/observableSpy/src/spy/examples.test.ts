import { expect } from 'chai';
import { filter, from, interval, of, throwError } from 'rxjs';
import {
	subscribeSpyTo,
	ObservableSpy,
	NextListener,
	verifyObservable,
	VerificationStep,
} from '..';

describe('ObservableSpy example test', function () {
	it('should immediately subscribe and spy on Observable', () => {
		const expectedCities = ['San Francisco', 'Berlin', 'London'];
		const cityObservable = of(...expectedCities);

		// the function will return an instance of SubscribedSpy
		// and the “under a hood” function will automatically
		// subscribe to the provided observable.
		const observableSpy = subscribeSpyTo(cityObservable);

		expect(observableSpy.getValues()).to.be.deep.equal(expectedCities);
		expect(observableSpy.getValuesLength()).to.be.equal(3);
		expect(observableSpy.receivedComplete()).to.be.true;
		expect(observableSpy.receivedError()).to.be.false;
		expect(observableSpy.getError()).to.be.null;

		// you can manually unsubscribe if you need to
		observableSpy.unsubscribe();
	});

	it('should async/await complete event', async () => {
		const expectedCities = ['San Francisco', 'Berlin', 'London'];
		const cityObservable = of(...expectedCities);

		const observableSpy = subscribeSpyTo(cityObservable);

		// onComplete method will return an array of all values
		// received from the next event
		const receivedCityValues = await observableSpy.onComplete();

		expect(receivedCityValues).to.be.deep.equal(expectedCities);
		expect(observableSpy.receivedComplete()).to.be.true;
	});

	it('should check values when onComplete callback is invoked', (done) => {
		const expectedCities = ['San Francisco', 'Berlin', 'London'];
		const cityObservable = of(...expectedCities);
		const observableSpy = subscribeSpyTo(cityObservable);

		observableSpy
			.onComplete()
			.then((receivedCityValues) => {
				expect(receivedCityValues).to.be.deep.equal(expectedCities);
				expect(observableSpy.receivedComplete()).to.be.true;
				done();
			})
			.catch((e) => done(e));
	});

	it('should catch an error from observable', async () => {
		const errorObservable = throwError(() => new Error('Unexpected error'));

		const observableSpy = subscribeSpyTo(errorObservable);

		// onError method will return an error received from the error event
		// if we are using a typescript we can set expected type of error
		const receivedError = await observableSpy.onError<Error>();

		expect(receivedError).to.be.instanceof(Error);
		expect(receivedError.message).to.be.equal('Unexpected error');
	});

	it('should spy on Observable', async () => {
		const expectedCities = ['San Francisco', 'Berlin', 'London'];
		const cityObservable = of(...expectedCities);

		// observable spy is immutable, so there is no way of
		// using same instance observable spy for different observables
		const observableSpy = new ObservableSpy<string>(cityObservable);

		// we need to "tell" spy to subscribe to observable
		// it will return an observable subscription if we need it in the tests
		// const subscription = observableSpy.subscribe();
		observableSpy.subscribe();

		// we can use the subscription to unsubscribe
		// subscription.unsubscribe();
		// or we can use observableSpy to do the same
		// observableSpy.unsubscribe();

		const receivedCityValues = await observableSpy.onComplete();

		expect(receivedCityValues).to.be.deep.equal(expectedCities);
		expect(observableSpy.getValuesLength()).to.be.equal(3);
		expect(observableSpy.receivedComplete()).to.be.true;
		expect(observableSpy.receivedError()).to.be.false;
		expect(observableSpy.getError()).to.be.null;
	});

	describe('Test ObservableSpy listeners', function () {
		const targetValues = [1, 3, 5, 7];
		const observableSpy = new ObservableSpy(
			interval(1_000).pipe(filter((val) => val % 2 === 1)),
			{
				useTestScheduler: true, // tell spy to use TestScheduler from 'rxjs/testing' to "speed up" interval
			},
		);

		before(function (done) {
			const nextListener: NextListener<number> = (val, index) => {
				// after we receive 4 numbers from interval
				if (index > 2) {
					// unsubscribe spy and begin with tests
					observableSpy.unsubscribe();
					done();
				}
			};

			// register listener on next event
			observableSpy.addNextListener(nextListener);
			// to unregister a listener use
			// observableSpy.removeNextListener(awaitNValuesListener);

			observableSpy.subscribe();
		});

		it('will receive first n interval numbers in expected sequence', function () {
			expect(observableSpy.getValues()).to.be.deep.equal(targetValues);
		});
	});

	describe('ObservableSpy test', function () {
		const allNumbersVerificationStep: VerificationStep<number> = {
			next(val) {
				if (isNaN(val)) {
					throw new Error(`Value ${val} is not a number`);
				}

				// false value indicates that this verification step is not done
				// when we return true, the next verification step will be able to proceed
				return false;
			},
			error(e) {
				throw e;
			},
			complete() {
				// we received complete event from observable, so this verification step is finished
			},
		};

		it('will verify that all observable values are numbers', async function () {
			const numbersObservable = from([1, 2, 3, 4]);
			const receivedValues = await verifyObservable(numbersObservable, [
				// register a single verification step that will check
				// if all incoming values are numbers
				allNumbersVerificationStep,
			]);

			expect(receivedValues).to.be.deep.equal([1, 2, 3, 4]);
		});

		it('will fail with error if any value is not a number', async function () {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const numbersObservable = from<any>([1, 2, 'three', 4]);

			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				await verifyObservable<any>(numbersObservable, [allNumbersVerificationStep]);
			} catch (e) {
				const error = e as Error;
				expect(error).to.be.instanceof(Error);
				expect(error.message).to.be.equal('Value three is not a number');
			}
		});
	});
});

