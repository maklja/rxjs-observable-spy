import { Observable } from 'rxjs';
import { MissingVerificationStepError } from '../errors';
import { ObservableSpy, ObserverSpyConfig, SubscribedSpy, EventType } from '../spy';

/**
 * Verification step signature that is used to verify received values from the tested observable.
 * Verification steps are used to create reusable assertions for observables.
 *
 * @typeParam T - Type of values that are generated by the observable.
 */
export interface VerificationStep<T> {
	/**
	 * If a function is defined, the function is invoked on the next event received from the observable.
	 *
	 * @param val - Received value on the next event.
	 * @param index - Index of the received next value.
	 * @param observableSpy - Spy that is subscribed to the tested observable.
	 *
	 * @returns True if this step is completed and should proceed the check of the next verification step, otherwise false.
	 * If no value is returned from function, this step by default is considered completed.
	 */
	next?: (val: T, index: number, observableSpy: SubscribedSpy<T>) => boolean | void;

	/**
	 * If a function is defined, the function is invoked on the error event received from the observable.
	 *
	 * @param error - Received error on the error event.
	 * @param observableSpy - Spy that is subscribed to the tested observable.
	 *
	 * @returns
	 */
	error?: (e: unknown, observableSpy: SubscribedSpy<T>) => void;

	/**
	 * If a function is defined, the function is invoked on the complete event received from the observable.
	 *
	 * @param observableSpy - Spy that is subscribed to the tested observable.
	 *
	 * @returns
	 */
	complete?: (observableSpy: SubscribedSpy<T>) => void;
}

const failAssertVerificationStep: VerificationStep<unknown> = {
	next(): boolean {
		throw new MissingVerificationStepError(EventType.Next);
	},
	error(): boolean {
		throw new MissingVerificationStepError(EventType.Error);
	},
	complete(): boolean {
		throw new MissingVerificationStepError(EventType.Complete);
	},
};

/**
 * Helper function that is used to verify if observables behave as expected.
 *
 * @typeParam T - Type of values that are generated by the observable.
 *
 * @param observable - Observable that is tested.
 * @param steps - Verification  steps that will be used to verify behavior of the tested observable.
 * @param config - Spy configuration.
 *
 * @returns Promise with received values from observable if it's complete successfully, otherwise it returns an error.
 */
export function verifyObservable<T>(
	observable: Observable<T>,
	steps: VerificationStep<T>[],
	config?: ObserverSpyConfig,
): Promise<T[]> {
	return new Promise((resolve, reject) => {
		const observableSpy = new ObservableSpy(observable, config);
		observableSpy.addNextListener((value, index, o) => {
			try {
				const { next } = steps[0] ?? failAssertVerificationStep;
				if (!next) {
					steps.splice(0, 1);
					return;
				}

				const result = next(value, index, o);
				const isDone = result === undefined ? true : result;
				isDone && steps.splice(0, 1);
			} catch (e) {
				o.unsubscribe();
				reject(e);
			}
		});

		observableSpy.addErrorListener((e, o) => {
			try {
				const { error } = steps[0] ?? failAssertVerificationStep;
				error && error(e, o);
				steps.splice(0, 1);
				resolve(o.getValues());
			} catch (assertError) {
				o.unsubscribe();
				reject(assertError);
			}
		});

		observableSpy.addCompleteListener((o) => {
			try {
				const { complete } = steps[0] ?? failAssertVerificationStep;
				complete && complete(o);
				steps.splice(0, 1);
				resolve(o.getValues());
			} catch (e) {
				o.unsubscribe();
				reject(e);
			}
		});

		observableSpy.subscribe();
	});
}

