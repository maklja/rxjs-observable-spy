import deepEql from 'deep-eql';
import { EventType } from '@maklja90/rxjs-observable-spy';
import { expectedNextActualOther, formatMessage } from '../../messages';
import { retrieveVerificationSteps, refreshInvokeTimeout } from '../utils';
import { ObservableSpyAssertionError } from '../common/error';

export const NEXT_KEYWORD = 'next';

export function chaiNext<T = unknown>(
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
					formatMessage(
						NEXT_KEYWORD,
						`expected next value: ${expectedNextValue}, actual value ${value}`,
					),
					{
						expectedEvent: EventType.Next,
						receivedEvent: EventType.Next,
					},
				);
			}
		},
		error: (error) => {
			const errorMessage = expectedNextActualOther(
				NEXT_KEYWORD,
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
				NEXT_KEYWORD,
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
