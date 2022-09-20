import { observableAssertion } from '@maklja90/rxjs-observable-spy';
import { createObservableName, refreshInvokeTimeout, retrieveObservableName } from '../utils';

export const OBSERVABLE_SPY_KEYWORD = 'observableSpy';

export const O_SPY_KEYWORD = 'oSpy';

export function chaiObservableSpy(
	this: Chai.AssertionStatic,
	assertionName: string,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	observableName?: string,
) {
	createObservableName(this, utils, observableName);
	observableAssertion(assertionName, this._obj, retrieveObservableName(this, utils));
	refreshInvokeTimeout(this, chai, utils);
}

