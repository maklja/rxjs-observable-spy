import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualNext, expectedSignalMessage, formatMessage } from '../../messages';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveVerificationSteps, refreshInvokeTimeout } from '../utils';

export const ERROR_KEYWORD = 'error';

export const ERROR_TYPE_KEYWORD = 'errorType';

export const ERROR_MESSAGE_KEYWORD = 'errorMessage';

export function chaiError<T = unknown, E extends Error = Error>(
	this: Chai.AssertionStatic,
	name: string,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedErrorType: (new (...args: unknown[]) => E) | undefined,
	expectedMessage?: string,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	verificationSteps.push({
		next: (value) => {
			const errorMessage = expectedSignalActualNext(
				name,
				EventType.Error,
				EventType.Next,
				value,
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
						name,
						`expected error type: ${expectedErrorType.name}, actual error type: ${
							error instanceof Error ? error.name : typeof error
						}`,
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
							name,
							`expected error message: ${expectedMessage}, actual error message: ${message}`,
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
			const errorMessage = expectedSignalMessage(name, EventType.Error, EventType.Complete);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Error,
				receivedEvent: EventType.Complete,
			});
		},
	});
}
