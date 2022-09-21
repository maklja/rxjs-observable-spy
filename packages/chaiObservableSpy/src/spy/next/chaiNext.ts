import deepEql from 'deep-eql';
import { createNextStep } from '@maklja90/rxjs-observable-spy';
import { retrieveVerificationSteps, refreshInvokeTimeout, retrieveObservableName } from '../utils';

export const NEXT_KEYWORD = 'next';

export function chaiNext<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedNextValue: T,
	stepName?: string,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	verificationSteps.push(
		createNextStep(
			stepName ?? NEXT_KEYWORD,
			expectedNextValue,
			deepEql,
			retrieveObservableName(this, utils),
		),
	);
}
