import chaiConsumeNext from './chaiConsumeNext';
import chaiConsumeNextUntil from './chaiConsumeNextUntil';
import chaiError from './chaiError';
import chaiNext from './chaiNext';
import chaiNextCount from './chaiNextCount';
import chaiNextMatches from './chaiNextMatches';
import chaiNextMatchesUntil from './chaiNextMatchesUntil';
import chaiSubscriberSpy from './chaiObservableSpy';
import chaiComplete from './chaiComplete';
import chaiVerify from './chaiVerify';
import chaiVerifyComplete from './chaiVerifyComplete';
import chaiAwaitComplete from './chaiAwaitComplete';
import chaiAwaitSingle from './chaiAwaitSingle';
import { OBSERVABLE_SPY_CONFIG_KEY, ChaiObservableSpyPluginConfig } from './chaiPluginConfig';

const defaultConfiguration: ChaiObservableSpyPluginConfig = {
	forgottenSubscriptionError: true,
	forgottenSubscriptionTimeout: 2_000,
};

export default (config: ChaiObservableSpyPluginConfig = defaultConfiguration): Chai.ChaiPlugin =>
	(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void => {
		const Assertion = chai.Assertion;

		utils.flag(chai, OBSERVABLE_SPY_CONFIG_KEY, config);

		Assertion.addMethod('next', function (expectedNextValue: unknown) {
			chaiNext.call(this, chai, utils, expectedNextValue);
		});

		Assertion.addMethod('nextCount', function (expectedCount: number) {
			chaiNextCount.call(this, chai, utils, expectedCount);
		});

		Assertion.addMethod('skipCount', function (expectedCount: number) {
			chaiNextCount.call(this, chai, utils, expectedCount);
		});

		Assertion.addMethod(
			'nextMatches',
			function (assertCallback: (value: unknown, index: number) => boolean) {
				chaiNextMatches.call(this, chai, utils, assertCallback);
			},
		);

		Assertion.addMethod(
			'nextMatchesUntil',
			function (
				assertCallback: (value: unknown, index: number) => boolean,
				untilCondition: (value: unknown, index: number) => boolean,
			) {
				chaiNextMatchesUntil.call(this, chai, utils, assertCallback, untilCondition);
			},
		);

		Assertion.addMethod(
			'consumeNext',
			function (assertCallback: (value: unknown, index: number) => void) {
				chaiConsumeNext.call(this, chai, utils, assertCallback);
			},
		);

		Assertion.addMethod(
			'consumeNextUntil',
			function (assertCallback: (value: unknown, index: number) => boolean) {
				chaiConsumeNextUntil.call(this, chai, utils, assertCallback);
			},
		);

		Assertion.addMethod(
			'error',
			function (expectedErrorType: new (...args: unknown[]) => Error, errorMessage: string) {
				chaiError.call(this, chai, utils, expectedErrorType, errorMessage);
			},
		);

		Assertion.addMethod(
			'errorType',
			function (expectedErrorType: new (...args: unknown[]) => Error) {
				chaiError.call(this, chai, utils, expectedErrorType);
			},
		);

		Assertion.addMethod('errorMessage', function (errorMessage: string) {
			chaiError.call(this, chai, utils, undefined, errorMessage);
		});

		Assertion.addMethod('verifyComplete', function () {
			return chaiVerifyComplete.call(this, utils);
		});

		Assertion.addMethod('complete', function () {
			chaiComplete.call(this, utils);
		});

		Assertion.addMethod('verify', function () {
			return chaiVerify.call(this, utils);
		});

		Assertion.addMethod('awaitComplete', function () {
			return chaiAwaitComplete.call(this, utils);
		});

		Assertion.addMethod('awaitSingle', function () {
			return chaiAwaitSingle.call(this, utils);
		});

		Assertion.addProperty('observableSpy', function () {
			chaiSubscriberSpy.call(this, chai, utils);
		});

		Assertion.addProperty('emit', function () {
			chaiSubscriberSpy.call(this, chai, utils);
		});
	};
