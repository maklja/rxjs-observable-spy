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
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
	MissingVerificationStepError,
} from './errors';
import { verifyObservable, VerificationStep } from './verify';

export {
	ObservableSpy,
	verifyObservable,
	subscribeSpyTo,
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
	MissingVerificationStepError,
	EventType,
};

export type {
	SubscribedSpy,
	ObserverSpyConfig,
	VerificationStep,
	CompleteListener,
	ErrorListener,
	NextListener,
};
