import { Observable } from 'rxjs';
import { ObservableSpy } from './observableSpy';

interface VerificationStepValue {
	count: number;
}

export interface NextValue<T> extends VerificationStepValue {
	value: T;
}

export interface ErrorValue extends VerificationStepValue {
	error: unknown;
}

export type CompleteValue = VerificationStepValue;

export interface VerificationStep<T> {
	next(nextValue: NextValue<T>): boolean;
	error(errorValue: ErrorValue): boolean;
	complete(completeValue: CompleteValue): boolean;
}

export function verifyObservable<T>(
	observable: Observable<T>,
	steps: VerificationStep<T>[],
): Promise<T[]> {
	return new Promise((resolve, reject) => {
		const observableSpy = new ObservableSpy(observable, { autoUnsubscribe: true });
		observableSpy.addNextListener((value: T) => {
			try {
				const { next } = steps[0];
				const isDone = next({
					value,
					count: observableSpy.getValuesLength() - 1,
				});
				isDone && steps.splice(0, 1);
			} catch (e) {
				observableSpy.unsubscribe();
				reject(e);
			}
		});

		observableSpy.addErrorListener((e: unknown) => {
			try {
				const { error } = steps[0];
				const isDone = error({
					error: e,
					count: observableSpy.getValuesLength() - 1,
				});
				isDone && steps.splice(0, 1);
				resolve(observableSpy.getValues());
			} catch (assertError) {
				observableSpy.unsubscribe();
				reject(assertError);
			}
		});

		observableSpy.addCompleteListener(() => {
			try {
				const { complete } = steps[0];
				const isDone = complete({ count: observableSpy.getValuesLength() - 1 });
				isDone && steps.splice(0, 1);
				resolve(observableSpy.getValues());
			} catch (e) {
				observableSpy.unsubscribe();
				reject(e);
			}
		});

		observableSpy.subscribe();
	});
}
