import { createNextMatchesUntilStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, refreshInvokeTimeout, retrieveObservableName } from '../utils';

export const NEXT_MATCHES_UNTIL_KEYWORD = 'nextMatchesUntil';

export function chaiNextMatchesUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
	untilCondition: (value: T, index: number) => boolean,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);
	verificationSteps.push(
		createNextMatchesUntilStep(
			NEXT_MATCHES_UNTIL_KEYWORD,
			expectedCallback,
			untilCondition,
			retrieveObservableName(this, utils),
		),
	);

	refreshInvokeTimeout(this, chai, utils);
}
