import { Observable } from 'rxjs';
import { EventType } from './EventType';
import { expectedSignalActualNext, expectedSignalMessage } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';

export default function chaiError<T = unknown, E extends Error = Error>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	expectedErrorType: (new (...args: unknown[]) => E) | undefined,
	message?: string,
) {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	verificationSteps.push({
		next: (value) => {
			const errorMessage = expectedSignalActualNext(
				'error',
				EventType.Error,
				EventType.Next,
				value,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Error, EventType.Next);
			return true;
		},
		error: (error) => {
			if (expectedErrorType !== undefined) {
				this.assert(
					error instanceof expectedErrorType,
					'Expected error type: #{exp}, actual error type #{act}',
					'Not supported',
					expectedErrorType.name,
					error instanceof Error ? error.name : error,
				);
			}

			if (message !== undefined && error instanceof Error) {
				this.assert(
					error.message === message,
					'Expected error message: #{exp}, actual error message #{act}',
					'Not supported',
					message,
					error.message,
				);
			} else if (message !== undefined) {
				this.assert(
					error === message,
					'Expected error message: #{exp}, actual error message #{act}',
					'Not supported',
					message,
					error,
				);
			}

			return true;
		},
		complete: () => {
			const errorMessage = expectedSignalMessage(
				'error',
				EventType.Error,
				EventType.Complete,
			);
			this.assert(false, errorMessage, 'Not supported', EventType.Error, EventType.Next);
			return true;
		},
	});
}
