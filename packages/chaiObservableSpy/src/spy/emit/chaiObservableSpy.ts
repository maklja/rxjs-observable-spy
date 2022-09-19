import observableAssertion from '../common/observableAssertion';
import { createObservableName, refreshInvokeTimeout } from '../utils';

export const OBSERVABLE_SPY_KEYWORD = 'observableSpy';

export function chaiObservableSpy(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	name?: string,
) {
	observableAssertion(OBSERVABLE_SPY_KEYWORD, this._obj);
	createObservableName(name ?? null, this, utils);
	refreshInvokeTimeout(this, chai, utils);
}

