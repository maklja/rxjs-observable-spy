import { Observable } from 'rxjs';
import { verifyObservable, EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError } from '../messages';
import { retrieveVerificationSteps } from './retrieveVerificationSteps';
import { clearInvokedTimeout } from './subscribeInvokedTimeout';

export default async function chaiAwaitSingle<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
): Promise<T> {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps(observable, utils);

	clearInvokedTimeout(observable, utils);

	verificationSteps.push({
		next: (_, index) => {
			this.assert(
				index < 1,
				'Received multiple values, when single one was expected.',
				'',
				EventType.Next,
				EventType.Error,
			);

			return false;
		},
		error: (error, spy) => {
			const errorMessage =
				spy.getValuesLength() === 0
					? expectedSignalActualError(
							'awaitSingle',
							EventType.Next,
							EventType.Error,
							error,
					  )
					: expectedSignalActualError(
							'awaitSingle',
							EventType.Complete,
							EventType.Error,
							error,
					  );
			this.assert(false, errorMessage, '', EventType.Complete, EventType.Error);
			return true;
		},
		complete: (spy) => {
			this.assert(
				spy.getValuesLength() <= 1,
				'Received multiple values, when single one was expected.',
				'',
				EventType.Complete,
				EventType.Complete,
			);

			this.assert(
				spy.getValuesLength() >= 1,
				'Expected to receive a single value, but received zero.',
				'',
				EventType.Complete,
				EventType.Next,
			);

			return true;
		},
	});

	return (await verifyObservable(observable, verificationSteps))[0];
}

