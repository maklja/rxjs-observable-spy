import observableAssertion from '../common/observableAssertion';
import { createObservableName, refreshInvokeTimeout } from '../utils';

export const EMIT_KEYWORD = 'emit';

export function chaiEmit(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	name?: string,
) {
	observableAssertion(EMIT_KEYWORD, this._obj);
	createObservableName(name ?? null, this, utils);
	refreshInvokeTimeout(this, chai, utils);
}

