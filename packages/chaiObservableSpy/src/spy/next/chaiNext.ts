import deepEql from 'deep-eql';
import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedNextActualOther } from '../../messages';
import { retrieveVerificationSteps } from '../retrieveVerificationSteps';
import { refreshInvokeTimeout } from '../subscribeInvokedTimeout';
import { ObservableSpyAssertionError } from '../common/error';

export default function chaiNext<T = unknown>(
	this: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
	expectedNextValue: T,
) {
	const verificationSteps = retrieveVerificationSteps<T>(this, utils);

	refreshInvokeTimeout(this, chai, utils);

	verificationSteps.push({
		next: (value) => {
			if (!deepEql(expectedNextValue, value)) {
				throw new ObservableSpyAssertionError(
					`[next] - expected next value: ${expectedNextValue}, actual value ${value}`,
					{
						expectedEvent: EventType.Next,
						receivedEvent: EventType.Next,
					},
				);
			}
		},
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				'next',
				EventType.Next,
				EventType.Error,
				expectedNextValue,
				error,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				error,
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Error,
			});
		},
		complete: () => {
			const errorMessage = expectedNextActualOther(
				'next',
				EventType.Next,
				EventType.Complete,
				expectedNextValue,
			);
			throw new ObservableSpyAssertionError(errorMessage, {
				expectedEvent: EventType.Next,
				receivedEvent: EventType.Complete,
			});
		},
	});
}
