import { Observable } from 'rxjs';
import { SignalType, verifyObservable } from '../spy';
import { expectedSignalActualError } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';

export default function chaiAwaitComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	verificationSteps.push({
		next: () => false,
		error: (errorValue) => {
			const errorMessage = expectedSignalActualError(
				'complete',
				SignalType.Complete,
				SignalType.Error,
				errorValue.error,
			);
			this.assert(
				false,
				errorMessage,
				'Not supported',
				SignalType.Complete,
				SignalType.Error,
			);
			return true;
		},
		complete: () => true,
	});

	return verifyObservable(observable, verificationSteps);
}

