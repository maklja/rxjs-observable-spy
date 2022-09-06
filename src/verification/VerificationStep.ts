interface VerificationStepValue {
	count: number;
}

export interface NextValue<T> extends VerificationStepValue {
	value: T;
}

export interface ErrorValue extends VerificationStepValue {
	error: Error;
}

export type CompleteValue = VerificationStepValue;

export interface VerificationStep<T> {
	next(nextValue: NextValue<T>): boolean;
	error(errorValue: ErrorValue): boolean;
	complete(completeValue: CompleteValue): boolean;
}
