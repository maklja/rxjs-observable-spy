/// <reference types="@types/chai" />

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Chai {
	export interface ObservableVerifyLanguageChains {
		/**
		 * Starts a verification process of the tested observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @returns promise with received next values from the observable.
		 */
		verify: <T = unknown>() => Promise<T[]>;
	}

	export interface ObservableSingleLanguageChains {
		/**
		 * Expects to receive a single value from observable,
		 * then checks if the observable will end with a complete
		 * event and starts a verification process of the tested observable.
		 *
		 * @typeParam T - Type of value that is generated by the observable.
		 *
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns promise with received single next value from the observable.
		 */
		awaitSingle: <T = unknown>(stepName?: string) => Promise<T>;
	}

	export interface ObservableLanguageChains {
		/**
		 * Then the keyword has no functional purpose, it is just there for readability.
		 *
		 * @returns observable language chains for testing.
		 */
		then: ObservableLanguageChains;

		/**
		 * Setup a flag for the library to use TestScheduler from 'rxjs/testing'.
		 * This is useful when we want to use virtual time instead of real time.
		 * Useful when using interval, delay...
		 *
		 * @returns observable language chains for testing.
		 */
		virtualTime: ObservableLanguageChains;

		/**
		 * Next expected values from the observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param expectedValue - Expected next value.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		next: <T = unknown>(expectedValue: T, stepName?: string) => ObservableLanguageChains;

		/**
		 * Expected next count to be received from the observable.
		 *
		 * @param expectedCount - Expected next count number.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for verification.
		 */
		nextCount: (expectedCount: number, stepName?: string) => ObservableVerifyLanguageChains;

		/**
		 * Skip next n values received from the observable.
		 *
		 * @param expectedCount - Expected next count number.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		skipCount: (skipCount: number, stepName?: string) => ObservableLanguageChains;

		/**
		 * Skip next values until the result of function {@link callback} is true.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will check if the current next values should be skipped.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		skipUntil: <T = unknown>(
			callback: (value: T, index: number) => boolean,
			stepName?: string,
		) => ObservableLanguageChains;

		/**
		 * Match the next value with a condition from the observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will validate next value.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		nextMatches: <T = unknown>(
			callback: (value: T, index: number) => boolean,
			stepName?: string,
		) => ObservableLanguageChains;

		/**
		 * Match the next value with a condition until the condition is satisfied from the observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will validate next value.
		 * @param untilCondition - Condition callback that indicates that validation is completed.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		nextMatchesUntil: <T = unknown>(
			callback: (value: T, index: number) => boolean,
			untilCondition: (value: T, index: number) => boolean,
			stepName?: string,
		) => ObservableLanguageChains;

		/**
		 * Consume the next value from the observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will consume next value.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		consumeNext: <T = unknown>(
			callback: (value: T, index: number) => void,
			stepName?: string,
		) => ObservableLanguageChains;

		/**
		 * Consume the next value from the observable until the true flag is returned by callback.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will consume next value.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		consumeNextUntil: <T = unknown>(
			callback: (value: T, index: number) => boolean,
			stepName?: string,
		) => ObservableLanguageChains;

		/**
		 * Expects observable to throw an error.
		 *
		 * @typeParam E - Type of error that will be thrown by the observable.
		 *
		 * @param expectedErrorType - Type of error.
		 * @param errorMessage - Error message.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		error: <E = unknown>(
			expectedErrorType: new (...args: never[]) => E,
			errorMessage: string,
			stepName?: string,
		) => ObservableVerifyLanguageChains;

		/**
		 * Consume error from the observable.
		 *
		 * @typeParam E - Type of error that will be thrown by the observable.
		 *
		 * @param consumeErrorCallback - Callback for error handling.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		consumeError: <E = unknown>(
			consumeErrorCallback: (error: E) => void,
			stepName?: string,
		) => ObservableVerifyLanguageChains;

		/**
		 * Expects observable to throw an error.
		 *
		 * @typeParam E - Type of error that will be thrown by the observable.
		 *
		 * @param expectedErrorType - Type of error.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		errorType: <E = unknown>(
			expectedErrorType: new (...args: never[]) => E,
			stepName?: string,
		) => ObservableVerifyLanguageChains;

		/**
		 * Expects observable to throw an error.
		 *
		 * @param errorMessage - Error message.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		errorMessage: (errorMessage: string, stepName?: string) => ObservableVerifyLanguageChains;

		/**
		 * Check if the observable will end with a complete event.
		 *
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns observable language chains for testing.
		 */
		complete: (stepName?: string) => ObservableVerifyLanguageChains;

		/**
		 * Check if the observable will end with a complete event and
		 * start a verification process of the tested observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns promise with received next values from the observable.
		 */
		verifyComplete: <T = unknown>(stepName?: string) => Promise<T[]>;

		/**
		 * Ignores all next values received from the observable.
		 * Check if the observable will end with a complete event and
		 * start a verification process of the tested observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Optional callback that will receive next values.
		 * @param stepName - Optional parameter for customizing a step name.
		 * Useful for debugging purposes because it is going to be included in the error message.
		 *
		 * @returns promise with received next values from the observable.
		 */
		awaitComplete: <T = unknown>(
			callback?: null | ((value: T, index: number) => void),
			stepName?: string,
		) => Promise<T[]>;
	}

	export interface Assertion {
		/**
		 * Usable only on RxJS Observables.
		 * This property contains a language chain keywords that are required in order to test observables.
		 *
		 * @param name - Optional name of the tested observable.
		 *
		 * @returns observable language chains for testing.
		 */
		observableSpy: (name?: string) => ObservableLanguageChains & ObservableSingleLanguageChains;

		/**
		 * Usable only on RxJS Observables.
		 * This property contains a language chain keywords that are required in order to test observables.
		 *
		 * @param name - Optional name of the tested observable.
		 *
		 * @returns observable language chains for testing.
		 */
		oSpy: (name?: string) => ObservableLanguageChains & ObservableSingleLanguageChains;

		/**
		 * Usable only on RxJS Observables.
		 * This property contains a language chain keywords that are required in order to test observables.
		 *
		 * @returns observable language chains for testing.
		 */
		emit: ObservableLanguageChains & ObservableSingleLanguageChains;

		/**
		 * Check if the tested object is an instance of RxJS observable.
		 */
		observable: () => Assertion;
	}
}

