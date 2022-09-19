import observableAssertion from '../common/observableAssertion';
import { refreshInvokeTimeout } from '../subscribeInvokedTimeout';

export const OBSERVABLE_SPY_KEYWORD = 'observableSpy';

export function chaiObservableSpy(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
) {
	observableAssertion(OBSERVABLE_SPY_KEYWORD, this._obj);
	refreshInvokeTimeout(this, chai, utils);
}
