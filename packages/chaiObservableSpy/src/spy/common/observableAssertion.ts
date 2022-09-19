import { Observable } from 'rxjs';
import { formatMessage } from '../../messages';
import { ObservableSpyAssertionError } from './error';

export default function observableAssertion(name: string, observable: unknown) {
	if (!(observable instanceof Observable)) {
		throw new ObservableSpyAssertionError(
			formatMessage(name, `expected ${typeof observable} to be a Observable`),
		);
	}
}

