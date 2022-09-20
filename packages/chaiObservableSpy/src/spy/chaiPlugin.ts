import { CONSUME_NEXT_KEYWORD, chaiConsumeNext } from './consume/chaiConsumeNext';
import { CONSUME_NEXT_UNTIL_KEYWORD, chaiConsumeNextUntil } from './consume/chaiConsumeNextUntil';
import {
	ERROR_KEYWORD,
	ERROR_MESSAGE_KEYWORD,
	ERROR_TYPE_KEYWORD,
	chaiError,
} from './error/chaiError';
import { NEXT_KEYWORD, chaiNext } from './next/chaiNext';
import { NEXT_COUNT_KEYWORD, chaiNextCount } from './next/chaiNextCount';
import { NEXT_MATCHES_KEYWORD, chaiNextMatches } from './next/chaiNextMatches';
import { NEXT_MATCHES_UNTIL_KEYWORD, chaiNextMatchesUntil } from './next/chaiNextMatchesUntil';
import { SKIP_COUNT_KEYWORD, chaiSkipCount } from './skip/chaiSkipCount';
import { SKIP_UNTIL_KEYWORD, chaiSkipUntil } from './skip/chaiSkipUntil';
import { COMPLETE_KEYWORD, chaiComplete } from './complete/chaiComplete';
import { VERIFY_KEYWORD, chaiVerify } from './verify/chaiVerify';
import { VERIFY_COMPLETE_KEYWORD, chaiVerifyComplete } from './complete/chaiVerifyComplete';
import { AWAIT_COMPLETE_KEYWORD, chaiAwaitComplete } from './complete/chaiAwaitComplete';
import { AWAIT_SINGLE, chaiAwaitSingle } from './complete/chaiAwaitSingle';
import { EMIT_KEYWORD, chaiEmit } from './emit/chaiEmit';
import { OBSERVABLE_SPY_KEYWORD, O_SPY_KEYWORD, chaiObservableSpy } from './emit/chaiObservableSpy';

export const OBSERVABLE_SPY_CONFIG_KEY = '_observableSpyPluginConfig';

export interface ChaiObservableSpyPluginConfig {
	forgottenSubscriptionError: boolean;
	forgottenSubscriptionTimeout: number;
}

export default (
		config: ChaiObservableSpyPluginConfig = {
			forgottenSubscriptionError: true,
			forgottenSubscriptionTimeout: 2_000,
		},
	): Chai.ChaiPlugin =>
	(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void => {
		const Assertion = chai.Assertion;

		utils.flag(chai, OBSERVABLE_SPY_CONFIG_KEY, { ...config });

		Assertion.addMethod(NEXT_KEYWORD, function (expectedNextValue: unknown) {
			chaiNext.call(this, chai, utils, expectedNextValue);
		});

		Assertion.addMethod(NEXT_COUNT_KEYWORD, function (expectedCount: number) {
			chaiNextCount.call(this, chai, utils, expectedCount);
		});

		Assertion.addMethod(SKIP_COUNT_KEYWORD, function (expectedCount: number) {
			chaiSkipCount.call(this, chai, utils, expectedCount);
		});

		Assertion.addMethod(
			SKIP_UNTIL_KEYWORD,
			function (conditionCallback: (value: unknown, index: number) => boolean) {
				chaiSkipUntil.call(this, chai, utils, conditionCallback);
			},
		);

		Assertion.addMethod(
			NEXT_MATCHES_KEYWORD,
			function (assertCallback: (value: unknown, index: number) => boolean) {
				chaiNextMatches.call(this, chai, utils, assertCallback);
			},
		);

		Assertion.addMethod(
			NEXT_MATCHES_UNTIL_KEYWORD,
			function (
				assertCallback: (value: unknown, index: number) => boolean,
				untilCondition: (value: unknown, index: number) => boolean,
			) {
				chaiNextMatchesUntil.call(this, chai, utils, assertCallback, untilCondition);
			},
		);

		Assertion.addMethod(
			CONSUME_NEXT_KEYWORD,
			function (assertCallback: (value: unknown, index: number) => void) {
				chaiConsumeNext.call(this, chai, utils, assertCallback);
			},
		);

		Assertion.addMethod(
			CONSUME_NEXT_UNTIL_KEYWORD,
			function (assertCallback: (value: unknown, index: number) => boolean) {
				chaiConsumeNextUntil.call(this, chai, utils, assertCallback);
			},
		);

		Assertion.addMethod(
			ERROR_KEYWORD,
			function (expectedErrorType: new (...args: unknown[]) => Error, errorMessage: string) {
				chaiError.call(this, ERROR_KEYWORD, chai, utils, expectedErrorType, errorMessage);
			},
		);

		Assertion.addMethod(
			ERROR_TYPE_KEYWORD,
			function (expectedErrorType: new (...args: unknown[]) => Error) {
				chaiError.call(this, ERROR_TYPE_KEYWORD, chai, utils, expectedErrorType);
			},
		);

		Assertion.addMethod(ERROR_MESSAGE_KEYWORD, function (errorMessage: string) {
			chaiError.call(this, ERROR_MESSAGE_KEYWORD, chai, utils, undefined, errorMessage);
		});

		Assertion.addMethod(VERIFY_COMPLETE_KEYWORD, function () {
			return chaiVerifyComplete.call(this, utils);
		});

		Assertion.addMethod(COMPLETE_KEYWORD, function () {
			chaiComplete.call(this, utils);
		});

		Assertion.addMethod(VERIFY_KEYWORD, function () {
			return chaiVerify.call(this, utils);
		});

		Assertion.addMethod(
			AWAIT_COMPLETE_KEYWORD,
			function (callback?: (value: unknown, index: number) => void) {
				return chaiAwaitComplete.call(this, utils, callback);
			},
		);

		Assertion.addMethod(AWAIT_SINGLE, function () {
			return chaiAwaitSingle.call(this, utils);
		});

		Assertion.addMethod(O_SPY_KEYWORD, function (name?: string) {
			chaiObservableSpy.call(this, O_SPY_KEYWORD, chai, utils, name);
		});

		Assertion.addMethod(OBSERVABLE_SPY_KEYWORD, function (name?: string) {
			chaiObservableSpy.call(this, OBSERVABLE_SPY_KEYWORD, chai, utils, name);
		});

		Assertion.addProperty(EMIT_KEYWORD, function () {
			chaiEmit.call(this, chai, utils);
		});
	};
