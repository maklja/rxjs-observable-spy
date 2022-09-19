import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedNextActualOther, formatMessage } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps, clearInvokedTimeout, refreshInvokeTimeout } from '../utils';

export const SKIP_COUNT_KEYWORD = 'skipCount';

export function chaiSkipCount<T>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCount: number,
) {
	if (expectedCount <= 0) {
		clearInvokedTimeout(this, utils);
		throw new ObservableSpyAssertionError(
			formatMessage(
				SKIP_COUNT_KEYWORD,
				`skip number should be > 0, received value ${expectedCount}`,
			),
		);
	}

	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	let currentCount = 0;
	verificationSteps.push({
		next: () => !(++currentCount < expectedCount),
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				SKIP_COUNT_KEYWORD,
				EventType.Next,
				EventType.Error,
				expectedCount,
				error,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Error,
			});
		},
		complete: () => {
			const errorMessage = expectedNextActualOther(
				SKIP_COUNT_KEYWORD,
				EventType.Next,
				EventType.Complete,
				expectedCount,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Complete,
			});
		},
	});
}

