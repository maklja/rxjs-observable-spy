import { Observable } from 'rxjs';

export default function chaiSubscriberSpy(this: Chai.AssertionStatic) {
	this.assert(
		this._obj instanceof Observable,
		'expected #{this} to be a Observable',
		'expected #{this} to not be a Observable',
		Observable.name,
	);
}
