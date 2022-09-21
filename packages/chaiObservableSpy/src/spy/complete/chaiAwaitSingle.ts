import { createAwaitSingleStep } from '@maklja90/rxjs-observable-spy';

import { retrieveVerificationSteps, clearInvokedTimeout, retrieveObservableName } from '../utils';
import { chaiVerify } from '../verify/chaiVerify';

export const AWAIT_SINGLE = 'awaitSingle';

export async function chaiAwaitSingle<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	stepName?: string,
): Promise<T> {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createAwaitSingleStep(stepName ?? AWAIT_SINGLE, retrieveObservableName(this, utils)),
	);

	clearInvokedTimeout(this, utils);

	return (
		await chaiVerify.call<Chai.AssertionStatic, Chai.ChaiUtils[], Promise<T[]>>(this, utils)
	)[0];
}

