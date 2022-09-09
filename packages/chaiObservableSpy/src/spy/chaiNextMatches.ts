import { Observable } from 'rxjs';
import { EventType } from '@maklja/rxjs-observable-spy';
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
		next: (value, index) => {
			const matchResult = expectedCallback(value, index);
			const errorMessage = `[nextMatches] - match failed for value ${value}`;
			this.assert(matchResult, errorMessage, errorMessage, null);

			return true;
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'nextMatches',
				EventType.Next,
				EventType.Error,
				error,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Next, EventType.Error);

			return true;
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				'nextMatches',
				EventType.Next,
				EventType.Complete,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Next, EventType.Complete);

			return true;
		},
	});
}
