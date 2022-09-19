import { Observable } from 'rxjs';
import { verifyObservable } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, clearInvokedTimeout } from '../utils';

export const VERIFY_KEYWORD = 'verify';

export function chaiVerify<T = unknown>(this: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(this, utils);

	clearInvokedTimeout(this, utils);

	return verifyObservable(observable, verificationSteps);
}
