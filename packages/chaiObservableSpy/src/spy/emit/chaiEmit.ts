import observableAssertion from '../common/observableAssertion';
import { refreshInvokeTimeout } from '../subscribeInvokedTimeout';

export const EMIT_KEYWORD = 'emit';

export function chaiEmit(this: Chai.AssertionStatic, chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
	observableAssertion(EMIT_KEYWORD, this._obj);
	refreshInvokeTimeout(this, chai, utils);
}
