import { ObservableSpyAssertionError } from '../../../errors';
import { expectedSignalActualError, formatMessage } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createAwaitSingleStep<T>(
	stepName: string,
	observableName?: string,
): VerificationStep<T> {
	return {
		next: (_, index) => {
			if (index > 0) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						stepName,
						'received multiple values, when single one was expected',
						observableName,
					),
					{
						expectedEvent: EventType.Complete,
						receivedEvent: EventType.Next,
					},
				);
			}

			return false;
		},
		error: (error, spy) => {
			const hasAnyValue = spy.getValuesLength() === 0;
			const errorMessage = hasAnyValue
				? expectedSignalActualError(
						stepName,
						EventType.Next,
						EventType.Error,
						error,
						observableName,
				  )
				: expectedSignalActualError(
						stepName,
						EventType.Complete,
						EventType.Error,
						error,
						observableName,
				  );
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: hasAnyValue ? EventType.Next : EventType.Complete,
				receivedEvent: EventType.Error,
			});
		},
		complete: (spy) => {
			if (spy.getValuesLength() > 1) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						stepName,
						'received multiple values, when single one was expected',
						observableName,
					),
					{
						receivedEvent: EventType.Complete,
					},
				);
			}

			if (spy.getValuesLength() < 1) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						stepName,
						'expected to receive a single value, but received zero',
					),
					{
						expectedEvent: EventType.Next,
						receivedEvent: EventType.Complete,
					},
				);
			}
		},
	};
}

