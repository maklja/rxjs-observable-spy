import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalMessage } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps, refreshInvokeTimeout } from '../utils';

export const CONSUME_NEXT_KEYWORD = 'consumeNext';

export function chaiConsumeNext<T = unknown>(
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
				CONSUME_NEXT_KEYWORD,
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
				CONSUME_NEXT_KEYWORD,
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
