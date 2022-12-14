import { createCompleteStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, clearInvokedTimeout, retrieveObservableName } from '../utils';

export const COMPLETE_KEYWORD = 'complete';

export function chaiComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	stepName?: string,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createCompleteStep(stepName ?? COMPLETE_KEYWORD, retrieveObservableName(this, utils)),
	);

	clearInvokedTimeout(this, utils);
}

