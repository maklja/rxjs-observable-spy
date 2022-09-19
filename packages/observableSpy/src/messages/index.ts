import { EventType } from '../spy';

const formatMessage = (name: string, message: string, observableName?: string) => {
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

const expectedSignalMessage = (
	name: string,
	expectedSignal: EventType,
	actualSignal: EventType,
	observableName?: string,
) =>
	formatMessage(
		name,
		`expected signal: ${expectedSignal}, actual signal: ${actualSignal}`,
		observableName,
	);

const expectedSignalActualNext = <T>(
	name: string,
	expectedSignal: EventType,
	actualSignal: EventType,
	actualValue: T,
	observableName?: string,
) =>
	`${expectedSignalMessage(
		name,
		expectedSignal,
		actualSignal,
		observableName,
	)}, actual value: ${actualValue}`;

const expectedSignalActualError = (
	name: string,
	expectedSignal: EventType,
	actualSignal: EventType,
	e: unknown,
	observableName?: string,
) =>
	`${expectedSignalMessage(
		name,
		expectedSignal,
		actualSignal,
		observableName,
	)}, actual error: ${errorFormatMessage(e)}`;

const expectedNextActualOther = <T>(
	name: string,
	expectedSignal: EventType,
	actualSignal: EventType,
	expectedValue: T,
	e?: unknown,
	observableName?: string,
) => {
	const errorMessage = e ? `, actual error: ${errorFormatMessage(e)}` : '';
	return `${expectedSignalMessage(
		name,
		expectedSignal,
		actualSignal,
		observableName,
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
