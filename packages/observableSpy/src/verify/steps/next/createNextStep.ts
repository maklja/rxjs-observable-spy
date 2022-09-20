import { ObservableSpyAssertionError } from '../../../errors';
import { expectedNextActualOther, formatMessage } from '../../../messages';
import { EventType } from '../../../spy';
import { VerificationStep } from '../../verifyObservable';

export default function createNextStep<T>(
	stepName: string,
	expectedNextValue: T,
	assertEquals = (obj1: T, obj2: T) => obj1 === obj2,
	observableName?: string,
): VerificationStep<T> {
	return {
		next: (value) => {
			if (!assertEquals(expectedNextValue, value)) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						stepName,
						`expected next value: ${expectedNextValue}, actual value ${value}`,
						observableName,
					),
					{
						expectedEvent: EventType.Next,
						receivedEvent: EventType.Next,
					},
				);
			}
		},
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				stepName,
				EventType.Next,
				EventType.Error,
				expectedNextValue,
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
				expectedNextValue,
				observableName,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Complete,
			});
		},
	};
}

