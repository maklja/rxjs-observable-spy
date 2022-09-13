/// <reference types="@types/chai" />

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Chai {
	export interface ObservableVarifyLanguageChains {
		/**
		 * Starts a verification process of the tested observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @returns promise with received next values from the observable.
		 */
		verify: <T = unknown>() => Promise<T[]>;
	}

	export interface ObservableLanguageChains {
		/**
		 * Next expected values from the observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param expectedValue - Expected next value.
		 *
		 * @returns observable language chains for testing.
		 */
		next: <T = unknown>(expectedValue: T) => ObservableLanguageChains;

		/**
		 * Expected next count to be received from the observable.
		 *
		 * @param expectedCount - Expected next count number.
		 *
		 * @returns observable language chains for testing.
		 */
		nextCount: (expectedCount: number) => ObservableLanguageChains;

		/**
		 * Skip next n values received from the observable.
		 *
		 * @param expectedCount - Expected next count number.
		 *
		 * @returns observable language chains for testing.
		 */
		skipCount: (skipCount: number) => ObservableLanguageChains;

		/**
		 * Match the next value with a condition from the observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will validate next value.
		 *
		 * @returns observable language chains for testing.
		 */
		nextMatches: <T = unknown>(
			callback: (value: T, index: number) => boolean,
		) => ObservableLanguageChains;

		/**
		 * Match the next value with a condition until the condition is satisfied from the observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will validate next value.
		 * @param untilCondition - Condition callback that indicates that validation is completed.
		 *
		 * @returns observable language chains for testing.
		 */
		nextMatchesUntil: <T = unknown>(
			callback: (value: T, index: number) => boolean,
			untilCondition: (value: T, index: number) => boolean,
		) => ObservableLanguageChains;

		/**
		 * Consume the next value from the observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will consume next value.
		 *
		 * @returns observable language chains for testing.
		 */
		consumeNext: <T = unknown>(
			callback: (value: T, index: number) => void,
		) => ObservableLanguageChains;

		/**
		 * Consume the next value from the observable until the true flag is returned by callback.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @param callback - Callback that will consume next value.
		 *
		 * @returns observable language chains for testing.
		 */
		consumeNextUntil: <T = unknown>(
			callback: (value: T, index: number) => boolean,
		) => ObservableLanguageChains;

		/**
		 * Expects observable to throw an error.
		 *
		 * @typeParam E - Type of error that will be thrown by the observable.
		 *
		 * @param expectedErrorType - Type of error.
		 * @param errorMessage - Error message.
		 *
		 * @returns observable language chains for testing.
		 */
		error: <E = unknown>(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expectedErrorType: new (...args: any[]) => E,
			errorMessage: string,
		) => ObservableVarifyLanguageChains;

		/**
		 * Expects observable to throw an error.
		 *
		 * @typeParam E - Type of error that will be thrown by the observable.
		 *
		 * @param expectedErrorType - Type of error.
		 *
		 * @returns observable language chains for testing.
		 */
		errorType: <E = unknown>(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expectedErrorType: new (...args: any[]) => E,
		) => ObservableVarifyLanguageChains;

		/**
		 * Expects observable to throw an error.
		 *
		 * @param errorMessage - Error message.
		 *
		 * @returns observable language chains for testing.
		 */
		errorMessage: (errorMessage: string) => ObservableVarifyLanguageChains;

		/**
		 * Check if the observable will end with a complete event.
		 *
		 * @returns observable language chains for testing.
		 */
		complete: () => ObservableVarifyLanguageChains;

		/**
		 * Check if the observable will end with a complete event and
		 * start a verification process of the tested observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @returns promise with received next values from the observable.
		 */
		verifyComplete: <T = unknown>() => Promise<T[]>;

		/**
		 * Ignores all next values received from the observable.
		 * Check if the observable will end with a complete event and
		 * start a verification process of the tested observable.
		 *
		 * @typeParam T - Type of values that are generated by the observable.
		 *
		 * @returns promise with received next values from the observable.
		 */
		awaitComplete: <T = unknown>() => Promise<T[]>;
	}

	export interface Assertion {
		/**
		 * Usable only on RxJS Observables.
		 * This property contains a language chain keywords that are required in order to test observables.
		 *
		 * @returns observable language chains for testing.
		 */
		observableSpy: ObservableLanguageChains;
		/**
		 * Usable only on RxJS Observables.
		 * This property contains a language chain keywords that are required in order to test observables.
		 *
		 * @returns observable language chains for testing.
		 */
		emit: ObservableLanguageChains;
	}
}

