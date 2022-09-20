import { Observable } from 'rxjs';
import { verifyObservable, createAwaitCompleteStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, clearInvokedTimeout, retrieveObservableName } from '../utils';

export const AWAIT_COMPLETE_KEYWORD = 'awaitComplete';

export function chaiAwaitComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	expectedCallback?: (value: T, index: number) => void,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	clearInvokedTimeout(this, utils);

	verificationSteps.push(
		createAwaitCompleteStep(
			AWAIT_COMPLETE_KEYWORD,
			expectedCallback,
			retrieveObservableName(this, utils),
		),
	);

	return verifyObservable(observable, verificationSteps);
}

