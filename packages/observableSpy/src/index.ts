import {
	ObservableSpy,
	SubscribedSpy,
	subscribeSpyTo,
	ObserverSpyConfig,
	CompleteListener,
	ErrorListener,
	NextListener,
	EventType,
} from './spy';
import {
	verifyObservable,
	VerificationStep,
	createAwaitCompleteStep,
	createAwaitSingleStep,
	createCompleteStep,
	createConsumeNextStep,
	createErrorStep,
	createConsumeErrorStep,
	createNextCountStep,
	createNextMatchesStep,
	createNextMatchesUntilStep,
	createNextStep,
	createNextUntilStep,
	createSkipCountStep,
	observableAssertion,
} from './verify';
import { ObservableSpyAssertionError, ObservableSpyAssertionProps } from './errors';
import { formatMessage } from './messages';

export {
	ObservableSpy,
	verifyObservable,
	subscribeSpyTo,
	EventType,
	ObservableSpyAssertionError,
	createAwaitCompleteStep,
	createAwaitSingleStep,
	createCompleteStep,
	createConsumeNextStep,
	createErrorStep,
	createConsumeErrorStep,
	createNextCountStep,
	createNextMatchesStep,
	createNextMatchesUntilStep,
	createNextStep,
	createNextUntilStep,
	createSkipCountStep,
	observableAssertion,
	formatMessage,
};

export type {
	SubscribedSpy,
	ObserverSpyConfig,
	VerificationStep,
	CompleteListener,
	ErrorListener,
	NextListener,
	ObservableSpyAssertionProps,
};

