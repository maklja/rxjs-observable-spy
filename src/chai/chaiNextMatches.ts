import { Observable } from 'rxjs';
import { SignalType } from '../spy';
import { expectedSignalActualError, expectedSignalMessage } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';

export default function chaiNextMatches<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, count: number) => boolean,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	verificationSteps.push({
		next: ({ value, count }) => {
			const matchResult = expectedCallback(value, count);
			const errorMessage = `[nextMatches] - match failed for value ${value}`;
			this.assert(matchResult, errorMessage, errorMessage, null);

			return true;
		},
		error: (errorValue) => {
			const errorMessage = expectedSignalActualError(
				'nextMatches',
				SignalType.Next,
				SignalType.Error,
				errorValue.error,
			);
			this.assert(false, errorMessage, 'Not supported', SignalType.Next, SignalType.Error);

			return true;
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				'nextMatches',
				SignalType.Next,
				SignalType.Complete,
			);
			this.assert(false, errorMessage, 'Not supported', SignalType.Next, SignalType.Complete);

			return true;
		},
	});
}
