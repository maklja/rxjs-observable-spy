import { Observable } from 'rxjs';
import { EventType } from '@maklja/rxjs-observable-spy';
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
		next: (value) => {
			this.assert(
				expectedNextValue === value,
				'Expected next value: #{exp}, actual value #{act}',
				'Not supported',
				expectedNextValue,
				value,
			);
			return true;
		},
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				'next',
				EventType.Next,
				EventType.Error,
				expectedNextValue,
				error,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Next, EventType.Error);
			return true;
		},
		complete: () => {
			const errorMessage = expectedNextActualOther(
				'next',
				EventType.Next,
				EventType.Complete,
				expectedNextValue,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Next, EventType.Complete);
			return true;
		},
	});
}
