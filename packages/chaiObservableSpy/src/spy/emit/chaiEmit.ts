import { observableAssertion } from '@maklja90/rxjs-observable-spy';
import { refreshInvokeTimeout, retrieveObservableName } from '../utils';

export const EMIT_KEYWORD = 'emit';

export function chaiEmit(this: Chai.AssertionStatic, chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
	observableAssertion(EMIT_KEYWORD, this._obj, retrieveObservableName(this, utils));
	refreshInvokeTimeout(this, chai, utils);
}

