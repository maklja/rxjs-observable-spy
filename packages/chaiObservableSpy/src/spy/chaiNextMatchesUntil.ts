import { Observable } from 'rxjs';
import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalMessage } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';
import { refreshInvokeTimeout } from './subscribeInvokedTimeout';

export default function chaiNextMatchesUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
	untilCondition: (value: T, index: number) => boolean,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	refreshInvokeTimeout.call(this, chai, this._obj, utils);

	verificationSteps.push({
		next: (value, index) => {
			const matchResult = expectedCallback(value, index);
			const errorMessage = `[nextMatches] - match failed for value ${value}`;
			this.assert(matchResult, errorMessage, errorMessage, null);

			return !untilCondition(value, index);
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'nextMatches',
				EventType.Next,
				EventType.Error,
				error,
			);
			this.assert(false, errorMessage, '', EventType.Next, EventType.Error);
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				'nextMatches',
				EventType.Next,
				EventType.Complete,
			);
			this.assert(false, errorMessage, '', EventType.Next, EventType.Complete);
		},
	});
}
