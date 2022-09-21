import { createSkipCountStep } from '@maklja90/rxjs-observable-spy';
import {
	retrieveVerificationSteps,
	clearInvokedTimeout,
	refreshInvokeTimeout,
	retrieveObservableName,
} from '../utils';

export const SKIP_COUNT_KEYWORD = 'skipCount';

export function chaiSkipCount<T>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCount: number,
	stepName?: string,
) {
	if (expectedCount <= 0) {
		clearInvokedTimeout(this, utils);
	}

	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createSkipCountStep(
			stepName ?? SKIP_COUNT_KEYWORD,
			expectedCount,
			retrieveObservableName(this, utils),
		),
	);

	refreshInvokeTimeout(this, chai, utils);
}

