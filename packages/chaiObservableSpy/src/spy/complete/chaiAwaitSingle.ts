import { Observable } from 'rxjs';
import { verifyObservable, createAwaitSingleStep } from '@maklja90/rxjs-observable-spy';

import { retrieveVerificationSteps, clearInvokedTimeout, retrieveObservableName } from '../utils';

export const AWAIT_SINGLE = 'awaitSingle';

export async function chaiAwaitSingle<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
): Promise<T> {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	clearInvokedTimeout(this, utils);

	verificationSteps.push(
		createAwaitSingleStep(AWAIT_SINGLE, retrieveObservableName(this, utils)),
	);

	return (await verifyObservable(observable, verificationSteps))[0];
}

