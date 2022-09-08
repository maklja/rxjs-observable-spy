import { Observable, Subscription } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
	AlreadySubscribedError,
	NotSubscribedError,
	UnexpectedObservableCompleteError,
} from './errors';

export type NextListener<T> = (val: T, index: number, observableSpy: ObservableSpy<T>) => void;

export type ErrorListener<T> = (error: unknown, observableSpy: ObservableSpy<T>) => void;

export type CompleteListener<T> = (observableSpy: ObservableSpy<T>) => void;

export interface ObserverSpyConfig {
	useTestScheduler: boolean;
}

export interface SubscribeSpy<T> {
	/**
	 * Returns current values received from the next event from the tested observable.
	 * If the tested observable didn't yield the error or complete event then values may
	 * contain only partial values. In order to receive all values from tested observable
	 * user {@link onComplete} method, in case of error user {@link onError} method.
	 *
	 * @returns Currently received values from observable.
	 */
	getValues(): T[];

	/**
	 * Returns current values number received from the next event from the tested observable.
	 * If the tested observable didn't yield the error or complete event then values number may
	 * not represent the number of all values that will be produced from the tested observable.
	 * In order to receive the exact values number from tested observable user {@link onComplete} method,
	 * in case of error user {@link onError} method.
	 *
	 * @returns The current number of received values from the observable.
	 */
	getValuesLength(): number;

	/**
	 * Awaits complete event from observable after which the returning promise will be resolved.
	 *
	 * @throws {@link NotSubscribedError}
	 * This exception is thrown if spy is not subscribed to the observable.
	 *
	 * @returns All received values from observable.
	 */
	onComplete(): Promise<T[]>;

	/**
	 * Awaits error event from observable after which the returning promise will be resolved.
	 *
	 * @throws {@link NotSubscribedError}
	 * This exception is thrown if spy is not subscribed to the observable.
	 *
	 * @returns The error that is received from observable.
	 */
	onError<E = unknown>(): Promise<E>;

	/**
	 * @returns True if the spy received a complete event from observable, otherwise false.
	 */
	receivedComplete(): boolean;

	/**
	 * @returns True if the spy received an error event from observable, otherwise false.
	 */
	receivedError(): boolean;

	/**
	 * @returns The error spy received from observable, otherwise null.
	 */
	getError<E = unknown>(): E | null;

	/**
	 * Disposes the resources held by the tested observable and all resources created by observable spy.
	 *
	 * @returns
	 */
	unsubscribe(): void;

	addNextListener(listener: NextListener<T>): void;

	removeNextListener(listener: NextListener<T>): void;

	addErrorListener(listener: ErrorListener<T>): void;

	removeErrorListener(listener: ErrorListener<T>): void;

	addCompleteListener(listener: CompleteListener<T>): void;

	removeCompleteListener(listener: CompleteListener<T>): void;
}

export class ObservableSpy<T> implements SubscribeSpy<T> {
	private readonly nextListeners: NextListener<T>[] = [];
	private readonly errorListeners: ErrorListener<T>[] = [];
	private readonly completeListeners: CompleteListener<T>[] = [];
	private readonly values: T[] = [];
	private error: unknown | null = null;
	private subscription: Subscription | null = null;
	private isCompleted = false;

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

	public addNextListener(listener: NextListener<T>) {
		if (this.nextListeners.includes(listener)) {
			return;
		}

		if (this.receivedComplete() || this.receivedError()) {
			return;
		}

		this.nextListeners.push(listener);
	}

	public removeNextListener(listener: NextListener<T>) {
		const listenerIndex = this.nextListeners.indexOf(listener);
		if (listenerIndex === -1) {
			return;
		}

		this.nextListeners.splice(listenerIndex, 1);
	}

	public addErrorListener(listener: ErrorListener<T>) {
		if (this.errorListeners.includes(listener)) {
			return;
		}

		if (this.receivedError()) {
			return listener(this.getError<T>(), this);
		}

		this.errorListeners.push(listener);
	}

	public removeErrorListener(listener: ErrorListener<T>) {
		const listenerIndex = this.errorListeners.indexOf(listener);
		if (listenerIndex === -1) {
			return;
		}

		this.errorListeners.splice(listenerIndex, 1);
	}

	public addCompleteListener(listener: CompleteListener<T>) {
		if (this.completeListeners.includes(listener)) {
			return;
		}

		if (this.receivedComplete()) {
			return listener(this);
		}

		this.completeListeners.push(listener);
	}

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

export function subscribeSpyTo<T>(
	observable: Observable<T>,
	config?: ObserverSpyConfig,
): SubscribeSpy<T> {
	const observableSpy = new ObservableSpy(observable, config);
	observableSpy.subscribe();

	return observableSpy;
}

