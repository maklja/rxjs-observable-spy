import { Observable } from 'rxjs';
import { verifyObservable } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { clearInvokedTimeout } from '../subscribeInvokedTimeout';

export default function chaiVerify<T = unknown>(this: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(this, utils);

	clearInvokedTimeout(this, utils);

	return verifyObservable(observable, verificationSteps);
}
