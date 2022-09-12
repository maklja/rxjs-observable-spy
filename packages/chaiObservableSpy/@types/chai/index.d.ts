/// <reference types="@types/chai" />

declare namespace Chai {
	interface ObservableVarifyLanguageChains {
		verify: <T = unknown>() => Promise<T[]>;
	}

	interface ObservableLanguageChains {
		next: <T = unknown>(val: T) => ObservableLanguageChains;
		nextCount: (expectedCount: number) => ObservableLanguageChains;
		skipCount: (skipCount: number) => ObservableLanguageChains;
		nextMatches: <T = unknown>(
			callback: (value: T, index: number) => boolean,
		) => ObservableLanguageChains;
		nextMatchesUntil: <T = unknown>(
			callback: (value: T, index: number) => boolean,
			untilCondition: (value: T, index: number) => boolean,
		) => ObservableLanguageChains;
		consumeNext: <T = unknown>(
			callback: (value: T, index: number) => void,
		) => ObservableLanguageChains;
		consumeNextUntil: <T = unknown>(
			callback: (value: T, index: number) => boolean,
		) => ObservableLanguageChains;
		error: <E extends Error = Error>(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expectedErrorType: new (...args: any[]) => E,
			errorMessage: string,
		) => ObservableVarifyLanguageChains;
		errorType: <E extends Error = Error>(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expectedErrorType: new (...args: any[]) => E,
		) => ObservableVarifyLanguageChains;
		errorMessage: (errorMessage: string) => ObservableVarifyLanguageChains;
		verifyComplete: <T = unknown>() => Promise<T[]>;
		awaitComplete: <T = unknown>() => Promise<T[]>;
	}

	interface Assertion {
		observableSpy: ObservableLanguageChains;
		emit: ObservableLanguageChains;
	}
}

