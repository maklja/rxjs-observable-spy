import { EventType } from '@maklja90/rxjs-observable-spy';

const formatMessage = (name: string, message: string, observableName?: string | null) => {
	if (!observableName) {
		return `[${name}] - ${message}`;
	}

	return `[${name}(${observableName})] - ${message}`;
};

const errorFormatMessage = (e: unknown) => {
	if (e instanceof Error) {
		return `${e.name} - ${e.message}`;
	}

	return `${e}`;
};

const expectedSignalMessage = (name: string, expectedSignal: EventType, actualSignal: EventType) =>
	formatMessage(name, `expected signal: ${expectedSignal}, actual signal: ${actualSignal}`);

const expectedSignalActualNext = <T>(
	name: string,
	expectedSignal: EventType,
	actualSignal: EventType,
	actualValue: T,
) => `${expectedSignalMessage(name, expectedSignal, actualSignal)}, actual value: ${actualValue}`;

const expectedSignalActualError = (
	name: string,
	expectedSignal: EventType,
	actualSignal: EventType,
	e: unknown,
) =>
	`${expectedSignalMessage(
		name,
		expectedSignal,
		actualSignal,
	)}, actual error: ${errorFormatMessage(e)}`;

const expectedNextActualOther = <T>(
	name: string,
	expectedSignal: EventType,
	actualSignal: EventType,
	expectedValue: T,
	e?: unknown,
) => {
	const errorMessage = e ? `, actual error: ${errorFormatMessage(e)}` : '';
	return `${expectedSignalMessage(
		name,
		expectedSignal,
		actualSignal,
	)}, expected value: ${expectedValue}${errorMessage}`;
};

export {
	formatMessage,
	errorFormatMessage,
	expectedSignalActualError,
	expectedSignalActualNext,
	expectedSignalMessage,
	expectedNextActualOther,
};
