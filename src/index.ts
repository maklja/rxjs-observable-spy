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
};

export type {
	SubscribeSpy,
	ObserverSpyConfig,
	VerificationStep,
	CompleteListener,
	ErrorListener,
	NextListener,
};

