import { createConsumeNextStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, refreshInvokeTimeout, retrieveObservableName } from '../utils';

export const CONSUME_NEXT_KEYWORD = 'consumeNext';

export function chaiConsumeNext<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => void,
	stepName?: string,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createConsumeNextStep(
			stepName ?? CONSUME_NEXT_KEYWORD,
			expectedCallback,
			retrieveObservableName(this, utils),
		),
	);

	refreshInvokeTimeout(this, chai, utils);
}
