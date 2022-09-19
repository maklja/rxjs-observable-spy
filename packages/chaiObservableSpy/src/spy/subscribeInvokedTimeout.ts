import { OBSERVABLE_SPY_CONFIG_KEY, ChaiObservableSpyPluginConfig } from './chaiPluginConfig';

const TIMEOUT_ID_KEY = '__observable_spy_timeoutId__';

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
		assertionStatic.assert(
			false,
			'You need to invoke verify, verifyComplete or awaitComplete in order to subscribe to observable',
			'',
			null,
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
