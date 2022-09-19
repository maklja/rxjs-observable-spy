import { ObservableSpyAssertionError } from '../../../errors';
import { expectedNextActualOther, formatMessage } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createSkipCountStep<T>(
	stepName: string,
	expectedCount: number,
	observableName?: string,
): VerificationStep<T> {
	if (expectedCount <= 0) {
		throw new ObservableSpyAssertionError(
			formatMessage(
				stepName,
				`skip number should be > 0, received value ${expectedCount}`,
				observableName,
			),
		);
	}
	let currentCount = 0;
	return {
		next: () => !(++currentCount < expectedCount),
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				stepName,
				EventType.Next,
				EventType.Error,
				expectedCount,
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
			const errorMessage = expectedNextActualOther(
				stepName,
				EventType.Next,
				EventType.Complete,
				expectedCount,
				observableName,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Complete,
			});
		},
	};
}

