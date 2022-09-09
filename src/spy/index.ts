import { verifyObservable, VerificationStep } from './verifyObservable';
import { ObservableSpy, ObserverSpyConfig, subscribeSpyTo } from './observableSpy';
import {
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
} from './errors';
import { CompleteListener, ErrorListener, NextListener, SubscribedSpy } from './SubscribedSpy';

export {
	verifyObservable,
	subscribeSpyTo,
	ObservableSpy,
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
};

export type {
	VerificationStep,
	CompleteListener,
	ErrorListener,
	NextListener,
	ObserverSpyConfig,
	SubscribedSpy as SubscribeSpy,
};
