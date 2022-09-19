import nextUntil from '../common/nextUntil';

export const SKIP_UNTIL_KEYWORD = 'skipUntil';

export function chaiSkipUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
) {
	nextUntil(SKIP_UNTIL_KEYWORD, this, chai, utils, expectedCallback);
}

