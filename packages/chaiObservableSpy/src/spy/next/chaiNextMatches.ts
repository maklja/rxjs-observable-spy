import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalMessage } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { refreshInvokeTimeout } from '../subscribeInvokedTimeout';

export default function chaiNextMatches<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	verificationSteps.push({
		next: (value, index) => {
			const matchResult = expectedCallback(value, index);
			if (!matchResult) {
				const errorMessage = `[nextMatches] - match failed for value ${value}`;
				throw new ObservableSpyAssertionError(errorMessage, {
					receivedEvent: EventType.Next,
				});
			}
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				'nextMatches',
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
				'nextMatches',
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
