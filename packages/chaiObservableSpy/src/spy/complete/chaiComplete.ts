import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, expectedSignalActualNext } from '../../messages';
import { retrieveVerificationSteps, clearInvokedTimeout } from '../utils';
import { ObservableSpyAssertionError } from '../common/error';

export const COMPLETE_KEYWORD = 'complete';

export function chaiComplete<T = unknown>(this: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	clearInvokedTimeout(this, utils);

	verificationSteps.push({
		next: (value) => {
			const errorMessage = expectedSignalActualNext(
				COMPLETE_KEYWORD,
				EventType.Complete,
				EventType.Next,
				value,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Complete,
				receivedEvent: EventType.Next,
			});
		},
		error: (error) => {
			const errorMessage = expectedSignalActualError(
				COMPLETE_KEYWORD,
				EventType.Complete,
				EventType.Error,
				error,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: EventType.Complete,
				receivedEvent: EventType.Error,
			});
		},
	});
}

