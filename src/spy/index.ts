import { verifyObservable, VerificationStep } from './verifyObservable';
import { ObservableSpy, ObserverSpyConfig, subscribeSpyTo } from './observableSpy';
import {
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
	MissingVerificationStepError,
} from './errors';
import {
	CompleteListener,
	ErrorListener,
	NextListener,
	SubscribedSpy,
	EventType,
} from './SubscribedSpy';

export {
	verifyObservable,
	subscribeSpyTo,
	ObservableSpy,
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
	MissingVerificationStepError,
	EventType,
};

export type {
	VerificationStep,
	CompleteListener,
	ErrorListener,
	NextListener,
	ObserverSpyConfig,
	SubscribedSpy as SubscribeSpy,
};
