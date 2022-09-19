import { EventType } from '../spy';

/**
 * This error is thrown in case an observable spy is already subscribed to the tested observable.
 * Because an observable spy is immutable there is no way to subscribe a spy to the tested observable again,
 * if this is required create a new observable spy.
 */
export class AlreadySubscribedError extends Error {
	constructor() {
		super('Observable spy already subscribed');

		this.name = AlreadySubscribedError.name;
	}
}

/**
 * This error is thrown in case method on the spy is invoked that requires a spy to be subscribed to the tested observable.
 * In order to resolve this error make sure that the subscribe method is invoked.
 */
export class NotSubscribedError extends Error {
	constructor() {
		super('Observable spy is not subscribed to the target observable');

		this.name = NotSubscribedError.name;
	}
}

/**
 * This error is thrown when it is expected to receive an event error but
 * instead a completed event is received by an observable spy.
 */
export class UnexpectedObservableCompleteError extends Error {
	constructor() {
		super('Unexpected observable complete event received');

		this.name = UnexpectedObservableCompleteError.name;
	}
}

/**
 * This error is thrown when an event is received but there aren't any
 * user defined verifications steps to process it.
 */
export class MissingVerificationStepError extends Error {
	constructor(eventType: EventType) {
		super(`Missing verification step to process received event: '${eventType}'`);

		this.name = MissingVerificationStepError.name;
	}
}
