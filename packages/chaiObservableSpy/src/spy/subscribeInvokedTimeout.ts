import { Observable } from 'rxjs';
import { OBSERVABLE_SPY_CONFIG_KEY, ChaiObservableSpyPluginConfig } from './chaiPluginConfig';

const TIMEOUT_ID_KEY = '_timeoutId';

export function refreshInvokeTimeout(
	assertionStatic: Chai.AssertionStatic,
	chai: Chai.ChaiStatic,
	observable: Observable<unknown>,
	utils: Chai.ChaiUtils,
): void {
	const spyConfig: ChaiObservableSpyPluginConfig = utils.flag(chai, OBSERVABLE_SPY_CONFIG_KEY);

	if (!spyConfig.forgottenSubscriptionError) {
		return;
	}

	clearInvokedTimeout(observable, utils);

	const newTimeout = setTimeout(() => {
		assertionStatic.assert(
			false,
			'You need to invoke verify, verifyComplete or awaitComplete in order to subscribe to observable',
			'',
			null,
		);
	}, spyConfig.forgottenSubscriptionTimeout);

	utils.flag(observable, TIMEOUT_ID_KEY, newTimeout);
}

export function clearInvokedTimeout(observable: Observable<unknown>, utils: Chai.ChaiUtils): void {
	const timeout: NodeJS.Timeout | undefined = utils.flag(observable, TIMEOUT_ID_KEY);

	if (timeout) {
		clearTimeout(timeout);
	}
}

