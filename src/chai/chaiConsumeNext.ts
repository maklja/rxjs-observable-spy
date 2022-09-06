import { Observable } from 'rxjs';
import { SignalType } from '../verification';
import { expectedSignalActualError, expectedSignalMessage } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';

export default function chaiConsumeNext<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, count: number) => void,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	verificationSteps.push({
		next: ({ value, count }) => {
			expectedCallback(value, count);
			return true;
		},
		error: (errorValue) => {
			const errorMessage = expectedSignalActualError(
				'consumeNext',
				SignalType.Next,
				SignalType.Error,
				errorValue.error,
			);
			this.assert(false, errorMessage, 'Not supported', SignalType.Next, SignalType.Error);

			return true;
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				'consumeNext',
				SignalType.Next,
				SignalType.Complete,
			);
			this.assert(false, errorMessage, 'Not supported', SignalType.Next, SignalType.Complete);

			return true;
		},
	});
}
