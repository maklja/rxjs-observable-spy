import { Observable } from 'rxjs';
import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalMessage } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';
import { refreshInvokeTimeout } from './subscribeInvokedTimeout';

export default function chaiConsumeNextUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	refreshInvokeTimeout.call(this, chai, this._obj, utils);

	verificationSteps.push({
		next: (value, index) => !expectedCallback(value, index),
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'consumeNextUntil',
				EventType.Next,
				EventType.Error,
				error,
			);
			this.assert(false, errorMessage, '', EventType.Next, EventType.Error);
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				'consumeNextUntil',
				EventType.Next,
				EventType.Complete,
			);
			this.assert(false, errorMessage, '', EventType.Next, EventType.Complete);
		},
	});
}

