import { chaiObservableSpyPlugin } from './chai';
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
} from './spy';

export {
	chaiObservableSpyPlugin,
	ObservableSpy,
	verifyObservable,
	subscribeSpyTo,
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
	MissingVerificationStepError,
};

export type {
	SubscribeSpy,
	ObserverSpyConfig,
	VerificationStep,
	CompleteListener,
	ErrorListener,
	NextListener,
};

