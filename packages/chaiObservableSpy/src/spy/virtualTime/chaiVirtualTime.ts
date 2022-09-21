import { refreshInvokeTimeout } from '../utils';

export const VIRTUAL_TIME_KEY = '__observable_spy_virtual_time__';

export const VIRTUAL_TIME_KEYWORD = 'virtualTime';

export function chaiVirtualTime(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
) {
	utils.flag(this, VIRTUAL_TIME_KEY, true);
	refreshInvokeTimeout(this, chai, utils);
}

