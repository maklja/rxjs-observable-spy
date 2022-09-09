import { Observable } from 'rxjs';
import { verifyObservable } from '../spy';
import { expectedSignalActualError } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';
import { EventType } from '../spy';

export default function chaiAwaitComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	verificationSteps.push({
		next: () => false,
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

