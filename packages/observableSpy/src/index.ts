import {
	ObservableSpy,
	SubscribeSpy,
	verifyObservable,
	VerificationStep,
	subscribeSpyTo,
	ObserverSpyConfig,
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
	MissingVerificationStepError,
	CompleteListener,
	ErrorListener,
	NextListener,
	EventType,
} from './spy';

export const a = 10;

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
	SubscribeSpy,
	ObserverSpyConfig,
	VerificationStep,
	CompleteListener,
	ErrorListener,
	NextListener,
};
