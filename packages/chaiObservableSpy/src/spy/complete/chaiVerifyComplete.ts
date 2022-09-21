import { chaiComplete } from './chaiComplete';
import { chaiVerify } from '../verify/chaiVerify';

export const VERIFY_COMPLETE_KEYWORD = 'verifyComplete';

export function chaiVerifyComplete<T = unknown>(this: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
	chaiComplete.call<Chai.AssertionStatic, Chai.ChaiUtils[], void>(this, utils);

	return chaiVerify.call<Chai.AssertionStatic, Chai.ChaiUtils[], Promise<T[]>>(this, utils);
}
