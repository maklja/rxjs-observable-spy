import { Observable } from 'rxjs';
import { VerificationStep } from '../verification';

const VERIFICATION_STEP_FLAG_KEY = 'verificationSteps';

export function retrieveVerificationSteps<T>(
	observable: Observable<T>,
	utils: Chai.ChaiUtils,
): VerificationStep<T>[] {
	let verificationSteps: VerificationStep<T>[] | undefined = utils.flag(
		observable,
		VERIFICATION_STEP_FLAG_KEY,
	);

	if (!verificationSteps) {
		verificationSteps = [];
		utils.flag(observable, VERIFICATION_STEP_FLAG_KEY, verificationSteps);
	}

	return verificationSteps;
}
