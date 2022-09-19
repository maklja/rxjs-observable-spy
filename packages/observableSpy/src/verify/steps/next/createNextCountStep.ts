import { ObservableSpyAssertionError } from '../../../errors';
import { expectedNextActualOther, formatMessage } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createNextCountStep<T>(
	stepName: string,
	expectedCount: number,
	observableName?: string,
): VerificationStep<T> {
	let currentCount = 0;
	return {
		next: () => {
			currentCount++;
			return false;
		},
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				stepName,
				EventType.Next,
				EventType.Error,
				currentCount + 1,
				error,
				observableName,
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
						stepName,
						`missing next values, expected count ${expectedCount}, actual count ${currentCount}`,
						observableName,
					),
					{
						receivedEvent: EventType.Complete,
					},
				);
			}

			if (currentCount > expectedCount) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						stepName,
						`too many next values, expected count ${expectedCount}, actual count ${currentCount}`,
						observableName,
					),
					{
						receivedEvent: EventType.Complete,
					},
				);
			}
		},
	};
}
