import { ObservableSpyAssertionError } from '../../../errors';
import { expectedSignalActualError, expectedSignalMessage } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createNextUntilStep<T>(
	stepName: string,
	expectedCallback: (value: T, index: number) => boolean,
	observableName?: string,
): VerificationStep<T> {
	return {
		next: (value, index) => !expectedCallback(value, index),
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

