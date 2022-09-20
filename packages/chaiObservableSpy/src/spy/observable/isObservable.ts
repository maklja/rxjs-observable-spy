import { observableAssertion } from '@maklja90/rxjs-observable-spy';

export const OBSERVABLE_KEYWORD = 'observable';

export function chaiObservable(this: Chai.AssertionStatic) {
	observableAssertion(OBSERVABLE_KEYWORD, this._obj);
}

