import { formatMessage } from '../../messages';
import { OBSERVABLE_SPY_CONFIG_KEY, ChaiObservableSpyPluginConfig } from '../chaiPlugin';
import { ObservableSpyAssertionError } from '../common/error';
import { retrieveObservableName } from './observableName';

const TIMEOUT_ID_KEY = '__observable_spy_timeoutId__';

const GUARD_NAME = 'observableSpyGuard';

export function refreshInvokeTimeout(
	assertionStatic: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	utils: Chai.ChaiUtils,
): void {
	const spyConfig: ChaiObservableSpyPluginConfig = utils.flag(chai, OBSERVABLE_SPY_CONFIG_KEY);

	if (!spyConfig.forgottenSubscriptionError) {
		return;
	}

	clearInvokedTimeout(assertionStatic, utils);

	const newTimeout = setTimeout(() => {
		throw new ObservableSpyAssertionError(
			formatMessage(
				GUARD_NAME,
				'found not subscribed observable in test',
				retrieveObservableName(assertionStatic, utils),
			),
		);
	}, spyConfig.forgottenSubscriptionTimeout);

	utils.flag(assertionStatic, TIMEOUT_ID_KEY, newTimeout);
}

export function clearInvokedTimeout(
	assertionStatic: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
): void {
	const timeout: NodeJS.Timeout = utils.flag(assertionStatic, TIMEOUT_ID_KEY);

	if (timeout) {
		clearTimeout(timeout);
		utils.flag(assertionStatic, TIMEOUT_ID_KEY, null);
	}
}

