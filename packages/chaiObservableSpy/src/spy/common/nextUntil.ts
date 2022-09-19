import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalMessage } from '../../messages';
import { retrieveVerificationSteps, refreshInvokeTimeout } from '../utils';
import { ObservableSpyAssertionError } from './error';

export default function nextUntil<T = unknown>(
	assertionName: string,
	assertionStatic: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
) {
	const verificationSteps = retrieveVerificationSteps<T>(assertionStatic, utils);

	refreshInvokeTimeout(assertionStatic, chai, utils);

	verificationSteps.push({
		next: (value, index) => !expectedCallback(value, index),
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				assertionName,
				EventType.Next,
				EventType.Error,
				error,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Error,
			});
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				assertionName,
				EventType.Next,
				EventType.Complete,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Complete,
			});
		},
	});
}

