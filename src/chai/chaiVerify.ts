import { Observable } from 'rxjs';
import { verify } from '../verification';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';

export default function chaiVerify<T = unknown>(this: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);
	return verify(observable, verificationSteps);
}
