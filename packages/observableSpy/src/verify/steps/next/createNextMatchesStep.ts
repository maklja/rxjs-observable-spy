import { ObservableSpyAssertionError } from '../../../errors';
import { expectedSignalActualError, expectedSignalMessage, formatMessage } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createNextMatchesStep<T>(
	stepName: string,
	expectedCallback: (value: T, index: number) => boolean,
	observableName?: string,
): VerificationStep<T> {
	return {
		next: (value, index) => {
			const matchResult = expectedCallback(value, index);
			if (!matchResult) {
				throw new ObservableSpyAssertionError(
					formatMessage(stepName, `match failed for value ${value}`, observableName),
					{
						receivedEvent: EventType.Next,
					},
				);
			}
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				stepName,
				EventType.Next,
				EventType.Error,
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
			const errorMessage = expectedSignalMessage(
				stepName,
				EventType.Next,
				EventType.Complete,
				observableName,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Complete,
			});
		},
	};
}
