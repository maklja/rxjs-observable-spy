import { Observable } from 'rxjs';
import { verifyObservable } from '@maklja90/rxjs-observable-spy';
import { clearInvokedTimeout, retrieveVerificationSteps } from '../utils';

import { chaiComplete } from './chaiComplete';

export const VERIFY_COMPLETE_KEYWORD = 'verifyComplete';

export function chaiVerifyComplete<T = unknown>(this: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
	chaiComplete.call(this, utils);

	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	clearInvokedTimeout(this, utils);

	return verifyObservable(observable, verificationSteps);
}
