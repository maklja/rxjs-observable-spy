import { Observable } from 'rxjs';
import { EventType } from '@maklja/rxjs-observable-spy';
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
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				'nextCount',
				EventType.Next,
				EventType.Error,
				currentCount + 1,
				error,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Next, EventType.Error);

			return true;
		},
		complete: () => {
			const errorMessage = expectedNextActualOther(
				'nextCount',
				EventType.Next,
				EventType.Complete,
				currentCount + 1,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Next, EventType.Complete);

			return true;
		},
	});
}
