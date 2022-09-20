import { Observable } from 'rxjs';
import { ObservableSpyAssertionError } from '../../errors';
import { formatMessage } from '../../messages';

export default function observableAssertion(
	stepName: string,
	observable: unknown,
	observableName?: string,
) {
	if (!(observable instanceof Observable)) {
		throw new ObservableSpyAssertionError(
			formatMessage(
				stepName,
				`expected ${typeof observable} to be a Observable`,
				observableName,
			),
		);
	}
}

