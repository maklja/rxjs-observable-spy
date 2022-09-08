import { chaiObservableSpyPlugin } from './chai';
import {
	ObservableSpy,
	SubscribeSpy,
	subscribeSpyTo,
	ObserverSpyConfig,
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
} from './spy';

export {
	chaiObservableSpyPlugin,
	ObservableSpy,
	subscribeSpyTo,
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
};

export type { SubscribeSpy, ObserverSpyConfig };

