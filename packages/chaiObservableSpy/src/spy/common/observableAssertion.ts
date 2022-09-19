import { Observable } from 'rxjs';
import { ObservableSpyAssertionError } from './error';

export default function observableAssertion(name: string, observable: unknown) {
	if (!(observable instanceof Observable)) {
		throw new ObservableSpyAssertionError(
			`[${name}] - expected ${typeof observable} to be a Observable`,
		);
	}
}
