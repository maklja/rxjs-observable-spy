import { createErrorStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, refreshInvokeTimeout, retrieveObservableName } from '../utils';

export const ERROR_KEYWORD = 'error';

export const ERROR_TYPE_KEYWORD = 'errorType';

export const ERROR_MESSAGE_KEYWORD = 'errorMessage';

export function chaiError<T = unknown, E = unknown>(
	this: Chai.AssertionStatic,
	name: string,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedErrorType?: new (...args: unknown[]) => E,
	expectedMessage?: string,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createErrorStep(
			name,
			expectedErrorType,
			expectedMessage,
			retrieveObservableName(this, utils),
		),
	);

	refreshInvokeTimeout(this, chai, utils);
}
