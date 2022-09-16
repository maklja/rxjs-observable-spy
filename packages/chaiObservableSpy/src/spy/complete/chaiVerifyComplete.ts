import { Observable } from 'rxjs';
import { verifyObservable, EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalActualNext } from '../../messages';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { clearInvokedTimeout } from '../subscribeInvokedTimeout';
import { ObservableSpyAssertionError } from '../common/error';

export default function chaiVerifyComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	clearInvokedTimeout(observable, utils);

	verificationSteps.push({
		next: (value) => {
			const errorMessage = expectedSignalActualNext(
				'complete',
				EventType.Complete,
				EventType.Next,
				value,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Complete,
				receivedEvent: EventType.Next,
			});
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'complete',
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
