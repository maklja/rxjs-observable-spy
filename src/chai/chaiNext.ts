import { Observable } from 'rxjs';
import { SignalType } from '../spy';
import { expectedNextActualOther } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';

export default function chaiNext<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	expectedNextValue: T,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	verificationSteps.push({
		next: (nextValue) => {
			this.assert(
				expectedNextValue === nextValue.value,
				'Expected next value: #{exp}, actual value #{act}',
				'Not supported',
				expectedNextValue,
				nextValue.value,
			);
			return true;
		},
		error: (errorValue) => {
			const errorMessage = expectedNextActualOther(
				'next',
				SignalType.Next,
				SignalType.Error,
				expectedNextValue,
				errorValue.error,
			);
			this.assert(false, errorMessage, 'Not supported', SignalType.Next, SignalType.Error);
			return true;
		},
		complete: () => {
			const errorMessage = expectedNextActualOther(
				'next',
				SignalType.Next,
				SignalType.Complete,
				expectedNextValue,
			);
			this.assert(false, errorMessage, 'Not supported', SignalType.Next, SignalType.Complete);
			return true;
		},
	});
}
