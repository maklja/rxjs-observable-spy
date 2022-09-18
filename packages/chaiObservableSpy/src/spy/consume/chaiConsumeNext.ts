import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalMessage } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { refreshInvokeTimeout } from '../subscribeInvokedTimeout';

export default function chaiConsumeNext<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => void,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	verificationSteps.push({
		next: (value, index) => expectedCallback(value, index),
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'consumeNext',
				EventType.Next,
				EventType.Error,
				error,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Error,
			});
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				'consumeNext',
				EventType.Next,
				EventType.Complete,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Complete,
			});
		},
	});
}
