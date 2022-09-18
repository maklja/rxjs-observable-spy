import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedNextActualOther } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { clearInvokedTimeout, refreshInvokeTimeout } from '../subscribeInvokedTimeout';

export default function chaiSkipCount<T>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCount: number,
) {
	if (expectedCount <= 0) {
		clearInvokedTimeout(this, utils);
		throw new ObservableSpyAssertionError(
			`[skipCount] - Skip number should be > 0, received value ${expectedCount}`,
		);
	}

	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	let currentCount = 0;
	verificationSteps.push({
		next: () => !(++currentCount < expectedCount),
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				'skipCount',
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
				'skipCount',
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
