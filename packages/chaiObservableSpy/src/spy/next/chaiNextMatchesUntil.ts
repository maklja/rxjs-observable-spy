import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalMessage, formatMessage } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps, refreshInvokeTimeout } from '../utils';

export const NEXT_MATCHES_UNTIL_KEYWORD = 'nextMatchesUntil';

export function chaiNextMatchesUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
	untilCondition: (value: T, index: number) => boolean,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	verificationSteps.push({
		next: (value, index) => {
			const matchResult = expectedCallback(value, index);
			if (!matchResult) {
				throw new ObservableSpyAssertionError(
					formatMessage(NEXT_MATCHES_UNTIL_KEYWORD, `match failed for value ${value}`),
					{
						receivedEvent: EventType.Next,
					},
				);
			}

			return !untilCondition(value, index);
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				NEXT_MATCHES_UNTIL_KEYWORD,
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
				NEXT_MATCHES_UNTIL_KEYWORD,
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
