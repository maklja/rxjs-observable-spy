import nextUntil from '../common/nextUntil';

export const CONSUME_NEXT_UNTIL_KEYWORD = 'consumeNextUntil';

export function chaiConsumeNextUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
) {
	nextUntil(CONSUME_NEXT_UNTIL_KEYWORD, this, chai, utils, expectedCallback);
}

