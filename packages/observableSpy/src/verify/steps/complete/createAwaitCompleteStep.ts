import { ObservableSpyAssertionError } from '../../../errors';
import { expectedSignalActualError } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createAwaitCompleteStep<T>(
	stepName: string,
	expectedCallback?: null | ((value: T, index: number) => void),
	observableName?: string,
): VerificationStep<T> {
	return {
		next: (val, index) => {
			expectedCallback && expectedCallback(val, index);
			return false;
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

