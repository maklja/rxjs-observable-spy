import { Observable } from 'rxjs';
import { SignalType } from '../verification';
import { expectedNextActualOther } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';

export default function chaiNextCount<T>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	expectedCount: number,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	let currentCount = 0;
	verificationSteps.push({
		next: () => (++currentCount < expectedCount ? false : true),
		error: (errorValue) => {
			const errorMessage = expectedNextActualOther(
				'nextCount',
				SignalType.Next,
				SignalType.Error,
				currentCount + 1,
				errorValue.error,
			);
			this.assert(false, errorMessage, 'Not supported', SignalType.Next, SignalType.Error);

			return true;
		},
		complete: () => {
			const errorMessage = expectedNextActualOther(
				'nextCount',
				SignalType.Next,
				SignalType.Complete,
				currentCount + 1,
			);
			this.assert(false, errorMessage, 'Not supported', SignalType.Next, SignalType.Complete);

			return true;
		},
	});
}
