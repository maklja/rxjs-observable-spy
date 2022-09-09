import { Observable, Subscription } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
} from './errors';
import { CompleteListener, ErrorListener, NextListener, SubscribedSpy } from './SubscribedSpy';

export interface ObserverSpyConfig {
	useTestScheduler: boolean;
}

export class ObservableSpy<T> implements SubscribedSpy<T> {
	private readonly nextListeners: NextListener<T>[] = [];
	private readonly errorListeners: ErrorListener<T>[] = [];
	private readonly completeListeners: CompleteListener<T>[] = [];
	private readonly values: T[] = [];
	private error: unknown | null = null;
	private subscription: Subscription | null = null;
	private isCompleted = false;

	/**
	 * Simple spy class that is used to test observables.
	 * This spy is immutable and once complete or error event is received there is no way to resubscribe spy to the observable.
	 * Instead create a new instance of observable spy.
	 *
	 * @typeParam T - Type of values that are generated by the observable.
	 *
	 * @param observable - Rxjs observable that will be tested by spy.
	 * @param config - Spy configuration.
	 */
	constructor(private observable: Observable<T>, private config?: ObserverSpyConfig) {}

	/**
	 * Subscribes spy to the observable that is being tested.
	 *
	 * @throws {@link AlreadySubscribedError}
	 * This exception is thrown if spy is already subscribed to the observable.
	 *
	 * @returns Subscription from the tested observable.
	 */
	public subscribe(): Subscription {
		if (this.subscription) {
			throw new AlreadySubscribedError();
		}

		return this.config?.useTestScheduler
			? this.subcribeSpyWithTestScheduler()
			: this.subcribeSpy();
	}

	public getValues(): T[] {
		return [...this.values];
	}

	public getValuesLength() {
		return this.values.length;
	}

	public receivedComplete() {
		return this.isCompleted;
	}

	public receivedError() {
		return this.error != null;
	}

	public getError<T = unknown>() {
		return this.receivedError() ? (this.error as T) : null;
	}

	public unsubscribe() {
		this.dispose();
	}

	/**
	 * Register a listener that will be invoked when the next event is received from a tested observable.
	 *
	 * @param listener - Listener function to register.
	 *
	 * @returns
	 */
	public addNextListener(listener: NextListener<T>) {
		if (this.nextListeners.includes(listener)) {
			return;
		}

		if (this.receivedComplete() || this.receivedError()) {
			return;
		}

		this.nextListeners.push(listener);
	}

	/**
	 * Removes registered next listener from the spy.
	 * Note that listeners are compared by reference.
	 *
	 * @param listener - Listener function to unregister.
	 *
	 * @returns
	 */
	public removeNextListener(listener: NextListener<T>) {
		const listenerIndex = this.nextListeners.indexOf(listener);
		if (listenerIndex === -1) {
			return;
		}

		this.nextListeners.splice(listenerIndex, 1);
	}

	/**
	 * Register a listener that will be invoked when the error event is received from a tested observable.
	 *
	 * @param listener - Listener function to register.
	 *
	 * @returns
	 */
	public addErrorListener(listener: ErrorListener<T>) {
		if (this.errorListeners.includes(listener)) {
			return;
		}

		if (this.receivedError()) {
			return listener(this.getError<T>(), this);
		}

		this.errorListeners.push(listener);
	}

	/**
	 * Removes registered error listener from the spy.
	 * Note that listeners are compared by reference.
	 *
	 * @param listener - Listener function to unregister.
	 *
	 * @returns
	 */
	public removeErrorListener(listener: ErrorListener<T>) {
		const listenerIndex = this.errorListeners.indexOf(listener);
		if (listenerIndex === -1) {
			return;
		}

		this.errorListeners.splice(listenerIndex, 1);
	}

	/**
	 * Register a listener that will be invoked when the complete event is received from a tested observable.
	 *
	 * @param listener - Listener function to register.
	 *
	 * @returns
	 */
	public addCompleteListener(listener: CompleteListener<T>) {
		if (this.completeListeners.includes(listener)) {
			return;
		}

		if (this.receivedComplete()) {
			return listener(this);
		}

		this.completeListeners.push(listener);
	}

	/**
	 * Removes registered complete listener from the spy.
	 * Note that listeners are compared by reference.
	 *
	 * @param listener - Listener function to unregister.
	 *
	 * @returns
	 */
	public removeCompleteListener(listener: CompleteListener<T>) {
		const listenerIndex = this.completeListeners.indexOf(listener);
		if (listenerIndex === -1) {
			return;
		}

		this.completeListeners.splice(listenerIndex, 1);
	}

	public onComplete(): Promise<T[]> {
		if (!this.subscription) {
			throw new NotSubscribedError();
		}

		return new Promise((resolve, reject) => {
			this.addCompleteListener(() => resolve(this.getValues()));
			this.addErrorListener((e) => reject(e));
		});
	}

	public onError<T = unknown>(): Promise<T> {
		if (!this.subscription) {
			throw new NotSubscribedError();
		}

		return new Promise((resolve, reject) => {
			this.addCompleteListener(() => reject(new UnexpectedObservableCompleteError()));
			this.addErrorListener((e) => resolve(e as T));
		});
	}

	private dispose() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		this.nextListeners.splice(0, this.nextListeners.length);
		this.errorListeners.splice(0, this.errorListeners.length);
		this.completeListeners.splice(0, this.completeListeners.length);
	}

	private subcribeSpyWithTestScheduler() {
		const testScheduler = new TestScheduler(() => {
			return;
		});

		return testScheduler.run(() => this.subcribeSpy());
	}

	private subcribeSpy() {
		this.subscription = this.observable.subscribe({
			next: (val) => {
				this.values.push(val);
				this.notifyNext(val, this.values.length - 1);
			},
			error: (e: unknown) => {
				this.error = e;
				this.notifyError(e);
				this.dispose();
			},
			complete: () => {
				this.isCompleted = true;
				this.notifyCompleted();
				this.dispose();
			},
		});

		return this.subscription;
	}

	private notifyNext(val: T, index: number) {
		this.nextListeners.forEach((l) => l(val, index, this));
	}

	private notifyError(e: unknown) {
		this.errorListeners.forEach((l) => l(e, this));
	}

	private notifyCompleted() {
		this.completeListeners.forEach((l) => l(this));
	}
}

/**
 * Helper function that will create an observable spy and subscribe a spy to the tested observable.
 *
 * @typeParam T - Type of values that are generated by the observable.
 *
 * @param observable - Rxjs observable that will be tested by spy.
 * @param config - Spy configuration.
 */
export function subscribeSpyTo<T>(
	observable: Observable<T>,
	config?: ObserverSpyConfig,
): SubscribedSpy<T> {
	const observableSpy = new ObservableSpy(observable, config);
	observableSpy.subscribe();

	return observableSpy;
}
