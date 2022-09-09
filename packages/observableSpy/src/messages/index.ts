import { EventType } from '../spy';

const errorFormatMessage = (e: unknown) => {
	if (e instanceof Error) {
		return `${e.name} - ${e.message} \n${e.stack}\n`;
	}

	return `${e}`;
};

const expectedSignalMessage = (name: string, expectedSignal: EventType, actualSignal: EventType) =>
	`[${name}] - expected signal: ${expectedSignal}, actual signal: ${actualSignal}`;

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

const expectedNextValueActualOther = <T>(
	name: string,
	expectedSignal: EventType,
	actualSignal: EventType,
	expectedValue: T,
	actualValue: T,
) => {
	return `${expectedSignalMessage(
		name,
		expectedSignal,
		actualSignal,
	)}, expected value: ${expectedValue}, actual value: ${actualValue}`;
};

export {
	errorFormatMessage,
	expectedSignalActualError,
	expectedSignalActualNext,
	expectedSignalMessage,
	expectedNextActualOther,
	expectedNextValueActualOther,
};
