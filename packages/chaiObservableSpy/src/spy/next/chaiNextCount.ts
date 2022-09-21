import { createNextCountStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, refreshInvokeTimeout, retrieveObservableName } from '../utils';

export const NEXT_COUNT_KEYWORD = 'nextCount';

export function chaiNextCount<T>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCount: number,
	stepName?: string,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createNextCountStep(
			stepName ?? NEXT_COUNT_KEYWORD,
			expectedCount,
			retrieveObservableName(this, utils),
		),
	);

	refreshInvokeTimeout(this, chai, utils);
}
