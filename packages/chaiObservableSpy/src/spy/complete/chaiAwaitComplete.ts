import { createAwaitCompleteStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, clearInvokedTimeout, retrieveObservableName } from '../utils';
import { chaiVerify } from '../verify/chaiVerify';

export const AWAIT_COMPLETE_KEYWORD = 'awaitComplete';

export function chaiAwaitComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	expectedCallback?: (value: T, index: number) => void,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createAwaitCompleteStep(
			AWAIT_COMPLETE_KEYWORD,
			expectedCallback,
			retrieveObservableName(this, utils),
		),
	);

	clearInvokedTimeout(this, utils);

	return chaiVerify.call<Chai.AssertionStatic, Chai.ChaiUtils[], Promise<T[]>>(this, utils);
}

