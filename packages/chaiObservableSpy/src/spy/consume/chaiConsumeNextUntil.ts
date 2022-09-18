import nextUntil from '../common/nextUntil';

export default function chaiConsumeNextUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
) {
	nextUntil('consumeNextUntil', this, chai, utils, expectedCallback);
}
