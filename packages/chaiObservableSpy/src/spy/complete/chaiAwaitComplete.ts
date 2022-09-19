import { Observable } from 'rxjs';
import { verifyObservable, EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError } from '../../messages';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { clearInvokedTimeout } from '../subscribeInvokedTimeout';
import { ObservableSpyAssertionError } from '../common/error';

export default function chaiAwaitComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	expectedCallback?: (value: T, index: number) => void,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	clearInvokedTimeout(this, utils);

	verificationSteps.push({
		next: (val, index) => {
			expectedCallback && expectedCallback(val, index);
			return false;
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'awaitComplete',
				EventType.Complete,
				EventType.Error,
				error,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: EventType.Complete,
				receivedEvent: EventType.Error,
			});
		},
	});

	return verifyObservable(observable, verificationSteps);
}
