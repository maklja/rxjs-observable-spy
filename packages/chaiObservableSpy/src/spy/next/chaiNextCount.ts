import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedNextActualOther } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { refreshInvokeTimeout } from '../subscribeInvokedTimeout';

export default function chaiNextCount<T>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCount: number,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, this._obj, utils);

	let currentCount = 0;
	verificationSteps.push({
		next: () => {
			currentCount++;
			return false;
		},
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				'nextCount',
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
					`[nextCount] - missing next values, expected count ${expectedCount}, actual count ${currentCount}`,
					{
						receivedEvent: EventType.Complete,
					},
				);
			}

			if (currentCount > expectedCount) {
				throw new ObservableSpyAssertionError(
					`[nextCount] - too many next values, expected count ${expectedCount}, actual count ${currentCount}`,
					{
						receivedEvent: EventType.Complete,
					},
				);
			}
		},
	});
}
