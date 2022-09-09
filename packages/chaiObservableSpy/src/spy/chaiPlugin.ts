import chaiConsumeNext from './chaiConsumeNext';
import chaiError from './chaiError';
import chaiNext from './chaiNext';
import chaiNextCount from './chaiNextCount';
import chaiNextMatches from './chaiNextMatches';
import chaiSubscriberSpy from './chaiSubscriberSpy';
import chaiVerify from './chaiVerify';
import chaiVerifyComplete from './chaiVerifyComplete';
import chaiAwaitComplete from './chaiAwaitComplete';

const chaiPlugin: Chai.ChaiPlugin = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void => {
	const Assertion = chai.Assertion;

	Assertion.addMethod('next', function (expectedNextValue: unknown) {
		chaiNext.call(this, utils, expectedNextValue);
	});

	Assertion.addMethod('nextCount', function (expectedCount: number) {
		chaiNextCount.call(this, utils, expectedCount);
	});

	Assertion.addMethod(
		'nextMatches',
		function (assertCallback: (value: unknown, count: number) => boolean) {
			chaiNextMatches.call(this, utils, assertCallback);
		},
	);

	Assertion.addMethod(
		'consumeNext',
		function (assertCallback: (value: unknown, count: number) => void) {
			chaiConsumeNext.call(this, utils, assertCallback);
		},
	);

	Assertion.addMethod(
		'error',
		function (expectedErrorType: new (...args: unknown[]) => Error, errorMessage: string) {
			chaiError.call(this, utils, expectedErrorType, errorMessage);
		},
	);

	Assertion.addMethod(
		'errorType',
		function (expectedErrorType: new (...args: unknown[]) => Error) {
			chaiError.call(this, utils, expectedErrorType);
		},
	);

	Assertion.addMethod('errorMessage', function (errorMessage: string) {
		chaiError.call(this, utils, undefined, errorMessage);
	});

	Assertion.addMethod('verifyComplete', function () {
		return chaiVerifyComplete.call(this, utils);
	});

	Assertion.addMethod('verify', function () {
		return chaiVerify.call(this, utils);
	});

	Assertion.addMethod('awaitComplete', function () {
		return chaiAwaitComplete.call(this, utils);
	});

	Assertion.addProperty('subscriber', function () {
		chaiSubscriberSpy.call(this);
	});
};

export default chaiPlugin;
