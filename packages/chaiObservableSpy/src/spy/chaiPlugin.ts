import chaiConsumeNext from './consume/chaiConsumeNext';
import chaiConsumeNextUntil from './consume/chaiConsumeNextUntil';
import chaiError from './error/chaiError';
import chaiNext from './next/chaiNext';
import chaiNextCount from './next/chaiNextCount';
import chaiNextMatches from './next/chaiNextMatches';
import chaiNextMatchesUntil from './next/chaiNextMatchesUntil';
import chaiSkipCount from './skip/chaiSkipCount';
import chaiSkipUntil from './skip/chaiSkipUntil';
import chaiComplete from './complete/chaiComplete';
import chaiVerify from './verify/chaiVerify';
import chaiVerifyComplete from './complete/chaiVerifyComplete';
import chaiAwaitComplete from './complete/chaiAwaitComplete';
import chaiAwaitSingle from './complete/chaiAwaitSingle';
import { EMIT_KEYWORD, chaiEmit } from './emit/chaiEmit';
import { OBSERVABLE_SPY_KEYWORD, chaiObservableSpy } from './emit/chaiObservableSpy';
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
			chaiSkipCount.call(this, chai, utils, expectedCount);
		});

		Assertion.addMethod(
			'skipUntil',
			function (conditionCallback: (value: unknown, index: number) => boolean) {
				chaiSkipUntil.call(this, chai, utils, conditionCallback);
			},
		);

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
				chaiError.call(this, 'error', chai, utils, expectedErrorType, errorMessage);
			},
		);

		Assertion.addMethod(
			'errorType',
			function (expectedErrorType: new (...args: unknown[]) => Error) {
				chaiError.call(this, 'errorType', chai, utils, expectedErrorType);
			},
		);

		Assertion.addMethod('errorMessage', function (errorMessage: string) {
			chaiError.call(this, 'errorMessage', chai, utils, undefined, errorMessage);
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

		Assertion.addProperty(OBSERVABLE_SPY_KEYWORD, function () {
			chaiObservableSpy.call(this, chai, utils);
		});

		Assertion.addProperty(EMIT_KEYWORD, function () {
			chaiEmit.call(this, chai, utils);
		});
	};
