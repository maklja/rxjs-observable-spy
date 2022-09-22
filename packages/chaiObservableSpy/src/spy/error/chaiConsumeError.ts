import { createConsumeErrorStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, refreshInvokeTimeout, retrieveObservableName } from '../utils';

export const CONSUME_ERROR_KEYWORD = 'consumeError';

export function chaiConsumeError<T = unknown, E = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	consumeErrorCallback: (error: E) => void,
	stepName?: string,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createConsumeErrorStep(
			stepName ?? CONSUME_ERROR_KEYWORD,
			consumeErrorCallback,
			retrieveObservableName(this, utils),
		),
	);

	refreshInvokeTimeout(this, chai, utils);
}

