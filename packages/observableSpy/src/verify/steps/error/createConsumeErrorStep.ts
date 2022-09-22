import { ObservableSpyAssertionError } from '../../../errors';
import { expectedSignalActualNext, expectedSignalMessage } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createConsumeErrorStep<T, E>(
	stepName: string,
	consume: (error: E) => void,
	observableName?: string,
): VerificationStep<T> {
	return {
		next: (value) => {
			const errorMessage = expectedSignalActualNext(
				stepName,
				EventType.Error,
				EventType.Next,
				value,
				observableName,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Error,
				receivedEvent: EventType.Next,
			});
		},
		error: (error) => consume(error as E),
		complete: () => {
			const errorMessage = expectedSignalMessage(
				stepName,
				EventType.Error,
				EventType.Complete,
				observableName,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Error,
				receivedEvent: EventType.Complete,
			});
		},
	};
}

