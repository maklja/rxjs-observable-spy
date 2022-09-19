import nextUntil from '../common/nextUntil';

export default function chaiSkipUntil<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedCallback: (value: T, index: number) => boolean,
) {
	nextUntil('skipUntil', this, chai, utils, expectedCallback);
}

