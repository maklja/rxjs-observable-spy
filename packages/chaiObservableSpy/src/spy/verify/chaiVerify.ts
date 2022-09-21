import { Observable } from 'rxjs';
import { verifyObservable } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, clearInvokedTimeout } from '../utils';
import { VIRTUAL_TIME_KEY } from '../virtualTime/chaiVirtualTime';

export const VERIFY_KEYWORD = 'verify';

export function chaiVerify<T = unknown>(this: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(this, utils);

	clearInvokedTimeout(this, utils);

	const useTestScheduler: boolean = utils.flag(this, VIRTUAL_TIME_KEY) ?? false;
	return verifyObservable(observable, verificationSteps, {
		useTestScheduler,
	});
}
