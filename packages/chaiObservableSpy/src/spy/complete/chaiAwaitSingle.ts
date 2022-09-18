import { Observable } from 'rxjs';
import { verifyObservable, EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError } from '../../messages';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { clearInvokedTimeout } from '../subscribeInvokedTimeout';
import { ObservableSpyAssertionError } from '../common/error';

export default async function chaiAwaitSingle<T = unknown>(
	this: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
): Promise<T> {
	const observable: Observable<T> = this._obj;
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	clearInvokedTimeout(this, utils);

	verificationSteps.push({
		next: (_, index) => {
			if (index > 0) {
				throw new ObservableSpyAssertionError(
					'[awaitSingle] - received multiple values, when single one was expected',
					{
						expectedEvent: EventType.Complete,
						receivedEvent: EventType.Next,
					},
				);
			}

			return false;
		},
		error: (error, spy) => {
			const hasAnyValue = spy.getValuesLength() === 0;
			const errorMessage = hasAnyValue
				? expectedSignalActualError('awaitSingle', EventType.Next, EventType.Error, error)
				: expectedSignalActualError(
						'awaitSingle',
						EventType.Complete,
						EventType.Error,
						error,
				  );
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: hasAnyValue ? EventType.Next : EventType.Complete,
				receivedEvent: EventType.Error,
			});
		},
		complete: (spy) => {
			if (spy.getValuesLength() > 1) {
				throw new ObservableSpyAssertionError(
					'[awaitSingle] - received multiple values, when single one was expected',
					{
						receivedEvent: EventType.Complete,
					},
				);
			}

			if (spy.getValuesLength() < 1) {
				throw new ObservableSpyAssertionError(
					'[awaitSingle] - expected to receive a single value, but received zero',
					{
						expectedEvent: EventType.Next,
						receivedEvent: EventType.Complete,
					},
				);
			}
		},
	});

	return (await verifyObservable(observable, verificationSteps))[0];
}
