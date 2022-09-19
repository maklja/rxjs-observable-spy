import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedNextActualOther, formatMessage } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps, refreshInvokeTimeout } from '../utils';

export const NEXT_COUNT_KEYWORD = 'nextCount';

export function chaiNextCount<T>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCount: number,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	let currentCount = 0;
	verificationSteps.push({
		next: () => {
			currentCount++;
			return false;
		},
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				NEXT_COUNT_KEYWORD,
				EventType.Next,
				EventType.Error,
				currentCount + 1,
				error,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Error,
			});
		},
		complete: () => {
			if (currentCount < expectedCount) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						NEXT_COUNT_KEYWORD,
						`missing next values, expected count ${expectedCount}, actual count ${currentCount}`,
					),
					{
						receivedEvent: EventType.Complete,
					},
				);
			}

			if (currentCount > expectedCount) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						NEXT_COUNT_KEYWORD,
						`too many next values, expected count ${expectedCount}, actual count ${currentCount}`,
					),
					{
						receivedEvent: EventType.Complete,
					},
				);
			}
		},
	});
}
