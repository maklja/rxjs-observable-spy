declare namespace Chai {
	export interface ObservableVarifyLanguageChains {
		verify: <T = unknown>() => Promise<T[]>;
	}

	export interface ObservableLanguageChains extends ObservableVarifyLanguageChains {
		next: <T = unknown>(val: T) => ObservableLanguageChains;
		nextCount: (expectedCount: number) => ObservableLanguageChains;
		nextMatches: <T = unknown>(
			callback: (value: T, count: number) => boolean,
		) => ObservableLanguageChains;
		consumeNext: <T = unknown>(
			callback: (value: T, count: number) => void,
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

	export interface Deep {
		subscriber: ObservableLanguageChains;
	}

	export interface LanguageChains {
		subscriber: ObservableLanguageChains;
	}
}

