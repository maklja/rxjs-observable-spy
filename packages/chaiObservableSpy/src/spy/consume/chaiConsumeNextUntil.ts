import { createNextUntilStep } from '@maklja90/rxjs-observable-spy';
import { refreshInvokeTimeout, retrieveObservableName, retrieveVerificationSteps } from '../utils';

export const CONSUME_NEXT_UNTIL_KEYWORD = 'consumeNextUntil';

export function chaiConsumeNextUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
	stepName?: string,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createNextUntilStep(
			stepName ?? CONSUME_NEXT_UNTIL_KEYWORD,
			expectedCallback,
			retrieveObservableName(this, utils),
		),
	);

	refreshInvokeTimeout(this, chai, utils);
}

