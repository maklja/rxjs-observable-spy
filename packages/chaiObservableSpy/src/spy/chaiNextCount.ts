import { Observable } from 'rxjs';
import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedNextActualOther } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';
import { refreshInvokeTimeout } from './subscribeInvokedTimeout';

export default function chaiNextCount<T>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCount: number,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	refreshInvokeTimeout.call(this, chai, this._obj, utils);

	let currentCount = 0;
	verificationSteps.push({
		next: () => !(++currentCount < expectedCount),
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				'nextCount',
				EventType.Next,
				EventType.Error,
				currentCount + 1,
				error,
			);
			this.assert(false, errorMessage, '', EventType.Next, EventType.Error);
		},
		complete: () => {
			const errorMessage = expectedNextActualOther(
				'nextCount',
				EventType.Next,
				EventType.Complete,
				currentCount + 1,
			);
			this.assert(false, errorMessage, '', EventType.Next, EventType.Complete);
		},
	});
}
