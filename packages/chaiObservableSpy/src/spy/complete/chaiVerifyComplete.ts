import { chaiComplete } from './chaiComplete';
import { chaiVerify } from '../verify/chaiVerify';

export const VERIFY_COMPLETE_KEYWORD = 'verifyComplete';

export function chaiVerifyComplete<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	stepName?: string,
) {
	chaiComplete.call(this, utils, stepName);

	return chaiVerify.call<Chai.AssertionStatic, Chai.ChaiUtils[], Promise<T[]>>(this, utils);
}
