import { ObservableSpyAssertionError } from '../../../errors';
import { expectedSignalActualNext, expectedSignalMessage, formatMessage } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createErrorStep<T, E>(
	stepName: string,
	expectedErrorType: (new (...args: unknown[]) => E) | undefined,
	expectedMessage?: string,
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
		error: (error) => {
			if (expectedErrorType !== undefined && !(error instanceof expectedErrorType)) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						stepName,
						`expected error type: ${expectedErrorType.name}, actual error type: ${
							error instanceof Error ? error.name : typeof error
						}`,
						observableName,
					),
					{
						expectedEvent: EventType.Error,
						receivedEvent: EventType.Error,
					},
				);
			}

			if (expectedMessage !== undefined) {
				const message = error instanceof Error ? error.message : error;

				if (expectedMessage !== message) {
					throw new ObservableSpyAssertionError(
						formatMessage(
							stepName,
							`expected error message: ${expectedMessage}, actual error message: ${message}`,
							observableName,
						),
						{
							expectedEvent: EventType.Error,
							receivedEvent: EventType.Error,
						},
					);
				}
			}
		},
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

