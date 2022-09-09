/**
 * Function signature for the listener that will be invoked when the next event is received from the observable.
 *
 * @typeParam T - Type of values that are generated by the observable.
 *
 * @param val - Received value on the next event.
 * @param index - Index of the received next value.
 * @param observableSpy - Spy that is subscribed to the tested observable.
 * 
 * @returns
 */
export type NextListener<T> = (val: T, index: number, observableSpy: SubscribedSpy<T>) => void;

/**
 * Function signature for the listener that will be invoked when the error event is received from the observable.
 *
 * @typeParam T - Type of values that are generated by the observable.
 *
 * @param error - Received error on the error event.
 * @param observableSpy - Spy that is subscribed to the tested observable.
 * 
 * @returns
 */
export type ErrorListener<T> = (error: unknown, observableSpy: SubscribedSpy<T>) => void;

/**
 * Function signature for the listener that will be invoked when the complete event is received from the observable.
 *
 * @typeParam T - Type of values that are generated by the observable.
 *
 * @param observableSpy - Spy that is subscribed to the tested observable.
 * 
 * @returns
 */
export type CompleteListener<T> = (observableSpy: SubscribedSpy<T>) => void;

export interface SubscribedSpy<T> {
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
	 * @typeParam E - Type of error that is received from the observable.
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

	/**
	 * Register a listener that will be invoked when the next event is received from a tested observable.
	 *
	 * @param listener - Listener function to register.
	 *
	 * @returns
	 */
	addNextListener(listener: NextListener<T>): void;

	/**
	 * Removes registered next listener from the spy.
	 * Note that listeners are compared by reference.
	 *
	 * @param listener - Listener function to unregister.
	 *
	 * @returns
	 */
	removeNextListener(listener: NextListener<T>): void;

	/**
	 * Register a listener that will be invoked when the error event is received from a tested observable.
	 *
	 * @param listener - Listener function to register.
     * 
     * @returns
	 */
	addErrorListener(listener: ErrorListener<T>): void;

	/**
	 * Removes registered error listener from the spy.
	 * Note that listeners are compared by reference.
	 *
	 * @param listener - Listener function to unregister.
     * 
     * @returns
	 */
	removeErrorListener(listener: ErrorListener<T>): void;

	/**
	 * Register a listener that will be invoked when the complete event is received from a tested observable.
	 *
	 * @param listener - Listener function to register.
     * 
     * @returns
	 */
	addCompleteListener(listener: CompleteListener<T>): void;

	/**
	 * Removes registered complete listener from the spy.
	 * Note that listeners are compared by reference.
	 *
	 * @param listener - Listener function to unregister.
     * 
     * @returns
	 */
	removeCompleteListener(listener: CompleteListener<T>): void;
}

