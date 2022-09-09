import { Observable } from 'rxjs';
import { verifyObservable } from '@maklja/rxjs-observable-spy';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';

export default function chaiVerify<T = unknown>(this: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);
	return verifyObservable(observable, verificationSteps);
}
