import { Observable } from 'rxjs';
import { EventType } from '@maklja/rxjs-observable-spy';
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
		next: (value, index) => {
			expectedCallback(value, index);
			return true;
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'consumeNext',
				EventType.Next,
				EventType.Error,
				error,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Next, EventType.Error);

			return true;
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				'consumeNext',
				EventType.Next,
				EventType.Complete,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Next, EventType.Complete);

			return true;
		},
	});
}
