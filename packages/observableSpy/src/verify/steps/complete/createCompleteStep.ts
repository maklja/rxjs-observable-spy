import { ObservableSpyAssertionError } from '../../../errors';
import { expectedSignalActualError, expectedSignalActualNext } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createCompleteStep<T>(
	stepName: string,
	observableName?: string,
): VerificationStep<T> {
	return {
		next: (value) => {
			const errorMessage = expectedSignalActualNext(
				stepName,
				EventType.Complete,
				EventType.Next,
				value,
				observableName,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Complete,
				receivedEvent: EventType.Next,
			});
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				stepName,
				EventType.Complete,
				EventType.Error,
				error,
				observableName,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: EventType.Complete,
				receivedEvent: EventType.Error,
			});
		},
	};
}

