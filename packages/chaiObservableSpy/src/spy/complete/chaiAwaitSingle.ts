import { Observable } from 'rxjs';
import { verifyObservable, EventType } from '@maklja90/rxjs-observable-spy';
import { expectedSignalActualError, formatMessage } from '../../messages';
import { retrieveVerificationSteps, clearInvokedTimeout } from '../utils';
import { ObservableSpyAssertionError } from '../common/error';

export const AWAIT_SINGLE = 'awaitSingle';

export async function chaiAwaitSingle<T = unknown>(
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
					formatMessage(
						AWAIT_SINGLE,
						'received multiple values, when single one was expected',
					),
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
				? expectedSignalActualError(AWAIT_SINGLE, EventType.Next, EventType.Error, error)
				: expectedSignalActualError(
						AWAIT_SINGLE,
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
					formatMessage(
						AWAIT_SINGLE,
						'received multiple values, when single one was expected',
					),
					{
						receivedEvent: EventType.Complete,
					},
				);
			}

			if (spy.getValuesLength() < 1) {
				throw new ObservableSpyAssertionError(
					formatMessage(
						AWAIT_SINGLE,
						'expected to receive a single value, but received zero',
					),
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

