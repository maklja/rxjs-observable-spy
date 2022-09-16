import { VerificationStep } from '@maklja90/rxjs-observable-spy';

const VERIFICATION_STEP_FLAG_KEY = 'verificationSteps';

export function retrieveVerificationSteps<T>(
	assertionStatic: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
): VerificationStep<T>[] {
	let verificationSteps: VerificationStep<T>[] | undefined = utils.flag(
		assertionStatic,
		VERIFICATION_STEP_FLAG_KEY,
	);

	if (!verificationSteps) {
		verificationSteps = [];
		utils.flag(assertionStatic, VERIFICATION_STEP_FLAG_KEY, verificationSteps);
	}

	return verificationSteps;
}
