import { Observable } from 'rxjs';
import { verifyObservable, EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalActualNext } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';
import { clearInvokedTimeout } from './subscribeInvokedTimeout';

export default function chaiVerifyComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	clearInvokedTimeout(observable, utils);

	verificationSteps.push({
		next: (value) => {
			const errorMessage = expectedSignalActualNext(
				'complete',
				EventType.Complete,
				EventType.Error,
				value,
			);
			this.assert(false, errorMessage, '', EventType.Complete, EventType.Next);
			return true;
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'complete',
				EventType.Complete,
				EventType.Error,
				error,
			);
			this.assert(false, errorMessage, '', EventType.Complete, EventType.Error);
			return true;
		},
		complete: () => true,
	});

	return verifyObservable(observable, verificationSteps);
}
