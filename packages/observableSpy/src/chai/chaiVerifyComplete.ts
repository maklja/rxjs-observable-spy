import { Observable } from 'rxjs';
import { verifyObservable } from '../spy';
import { expectedSignalActualError, expectedSignalActualNext } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';
import { EventType } from '../spy';

export default function chaiVerifyComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	verificationSteps.push({
		next: (value) => {
			const errorMessage = expectedSignalActualNext(
				'complete',
				EventType.Complete,
				EventType.Error,
				value,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Complete, EventType.Next);
			return true;
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'complete',
				EventType.Complete,
				EventType.Error,
				error,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Complete, EventType.Error);
			return true;
		},
		complete: () => true,
	});

	return verifyObservable(observable, verificationSteps);
}