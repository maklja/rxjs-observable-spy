import { CONSUME_NEXT_KEYWORD, chaiConsumeNext } from './consume/chaiConsumeNext';
import { CONSUME_NEXT_UNTIL_KEYWORD, chaiConsumeNextUntil } from './consume/chaiConsumeNextUntil';
import {
	ERROR_KEYWORD,
	ERROR_MESSAGE_KEYWORD,
	ERROR_TYPE_KEYWORD,
	chaiError,
} from './error/chaiError';
import { CONSUME_ERROR_KEYWORD, chaiConsumeError } from './error/chaiConsumeError';
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
import { OBSERVABLE_KEYWORD, chaiObservable } from './observable/isObservable';
import { VIRTUAL_TIME_KEYWORD, chaiVirtualTime } from './virtualTime/chaiVirtualTime';

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

		Assertion.addMethod(NEXT_KEYWORD, function (expectedNextValue: unknown, stepName?: string) {
			chaiNext.call(this, chai, utils, expectedNextValue, stepName);
		});

		Assertion.addMethod(
			NEXT_COUNT_KEYWORD,
			function (expectedCount: number, stepName?: string) {
				chaiNextCount.call(this, chai, utils, expectedCount, stepName);
			},
		);

		Assertion.addMethod(
			SKIP_COUNT_KEYWORD,
			function (expectedCount: number, stepName?: string) {
				chaiSkipCount.call(this, chai, utils, expectedCount, stepName);
			},
		);

		Assertion.addMethod(
			SKIP_UNTIL_KEYWORD,
			function (
				conditionCallback: (value: unknown, index: number) => boolean,
				stepName?: string,
			) {
				chaiSkipUntil.call(this, chai, utils, conditionCallback, stepName);
			},
		);

		Assertion.addMethod(
			NEXT_MATCHES_KEYWORD,
			function (
				assertCallback: (value: unknown, index: number) => boolean,
				stepName?: string,
			) {
				chaiNextMatches.call(this, chai, utils, assertCallback, stepName);
			},
		);

		Assertion.addMethod(
			NEXT_MATCHES_UNTIL_KEYWORD,
			function (
				assertCallback: (value: unknown, index: number) => boolean,
				untilCondition: (value: unknown, index: number) => boolean,
				stepName?: string,
			) {
				chaiNextMatchesUntil.call(
					this,
					chai,
					utils,
					assertCallback,
					untilCondition,
					stepName,
				);
			},
		);

		Assertion.addMethod(
			CONSUME_NEXT_KEYWORD,
			function (assertCallback: (value: unknown, index: number) => void, stepName?: string) {
				chaiConsumeNext.call(this, chai, utils, assertCallback, stepName);
			},
		);

		Assertion.addMethod(
			CONSUME_NEXT_UNTIL_KEYWORD,
			function (
				assertCallback: (value: unknown, index: number) => boolean,
				stepName?: string,
			) {
				chaiConsumeNextUntil.call(this, chai, utils, assertCallback, stepName);
			},
		);

		Assertion.addMethod(
			ERROR_KEYWORD,
			function (
				expectedErrorType: new (...args: unknown[]) => Error,
				errorMessage: string,
				stepName?: string,
			) {
				chaiError.call(
					this,
					stepName ?? ERROR_KEYWORD,
					chai,
					utils,
					expectedErrorType,
					errorMessage,
				);
			},
		);

		Assertion.addMethod(
			ERROR_TYPE_KEYWORD,
			function (expectedErrorType: new (...args: unknown[]) => Error, stepName?: string) {
				chaiError.call(
					this,
					stepName ?? ERROR_TYPE_KEYWORD,
					chai,
					utils,
					expectedErrorType,
				);
			},
		);

		Assertion.addMethod(
			ERROR_MESSAGE_KEYWORD,
			function (errorMessage: string, stepName?: string) {
				chaiError.call(
					this,
					stepName ?? ERROR_MESSAGE_KEYWORD,
					chai,
					utils,
					undefined,
					errorMessage,
				);
			},
		);

		Assertion.addMethod(
			CONSUME_ERROR_KEYWORD,
			function (consumeErrorCallback: (error: unknown) => void, stepName?: string) {
				chaiConsumeError.call(this, chai, utils, consumeErrorCallback, stepName);
			},
		);

		Assertion.addMethod(VERIFY_COMPLETE_KEYWORD, function (stepName?: string) {
			return chaiVerifyComplete.call(this, utils, stepName);
		});

		Assertion.addMethod(COMPLETE_KEYWORD, function (stepName?: string) {
			chaiComplete.call(this, utils, stepName);
		});

		Assertion.addMethod(VERIFY_KEYWORD, function () {
			return chaiVerify.call(this, utils);
		});

		Assertion.addMethod(
			AWAIT_COMPLETE_KEYWORD,
			function (callback?: (value: unknown, index: number) => void, stepName?: string) {
				return chaiAwaitComplete.call(this, utils, callback, stepName);
			},
		);

		Assertion.addMethod(AWAIT_SINGLE, function (stepName?: string) {
			return chaiAwaitSingle.call(this, utils, stepName);
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

		Assertion.addProperty('then', function () {
			// not functional
		});

		Assertion.addProperty(VIRTUAL_TIME_KEYWORD, function () {
			chaiVirtualTime.call(this, chai, utils);
		});

		Assertion.addMethod(OBSERVABLE_KEYWORD, function () {
			chaiObservable.call(this);
		});
	};
