import { Observable } from 'rxjs';
import { refreshInvokeTimeout } from './subscribeInvokedTimeout';

export default function chaiSubscriberSpy(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
) {
	this.assert(
		this._obj instanceof Observable,
		'expected #{this} to be a Observable',
		'',
		Observable.name,
	);

	refreshInvokeTimeout.call(this, chai, this._obj, utils);
}
