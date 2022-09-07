import { Observable, Subscription } from 'rxjs';

export type NextListener<T> = (val: T, observableSpy: ObservableSpy<T>) => void;

export type ErrorListener<T> = (error: unknown, observableSpy: ObservableSpy<T>) => void;

export type CompleteListener<T> = (observableSpy: ObservableSpy<T>) => void;

export interface ObserverSpyConfig {
	autoUnsubscribe: boolean;
}

export interface SubscribeSpy<T> {
	getValues(): T[];

	getValuesLength(): number;

	receivedComplete(): boolean;

	receivedError(): boolean;

	getError(): unknown;

	unsubscribe(): void;
}

export class ObservableSpy<T> implements SubscribeSpy<T> {
	private readonly nextListeners: NextListener<T>[] = [];
	private readonly errorListeners: ErrorListener<T>[] = [];
	private readonly completeListeners: CompleteListener<T>[] = [];
	private readonly values: T[] = [];
	private error: unknown | null;
	private subscription: Subscription | null = null;
	private isCompleted = false;

	constructor(private observable: Observable<T>, private config?: ObserverSpyConfig) {}

	public subscribe(): Subscription {
		this.subscription = this.observable.subscribe({
			next: (val) => {
				this.values.push(val);
				this.onNext(val);
			},
			error: (e: unknown) => {
				this.error = e;
				this.onError(e);
				this.dispose();
			},
			complete: () => {
				this.isCompleted = true;
				this.onCompleted();
				this.dispose();
			},
		});

		return this.subscription;
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

	public getError() {
		return this.error;
	}

	public unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	public addNextListener(listener: NextListener<T>) {
		if (this.nextListeners.includes(listener)) {
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

		this.completeListeners.push(listener);
	}

	public removeCompleteListener(listener: CompleteListener<T>) {
		const listenerIndex = this.completeListeners.indexOf(listener);
		if (listenerIndex === -1) {
			return;
		}

		this.completeListeners.splice(listenerIndex, 1);
	}

	public dispose() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		this.nextListeners.splice(0, this.nextListeners.length);
		this.errorListeners.splice(0, this.errorListeners.length);
		this.completeListeners.splice(0, this.completeListeners.length);
	}

	private onNext(val: T) {
		this.nextListeners.forEach((l) => l(val, this));
	}

	private onError(e: unknown) {
		this.errorListeners.forEach((l) => l(e, this));
	}

	private onCompleted() {
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

