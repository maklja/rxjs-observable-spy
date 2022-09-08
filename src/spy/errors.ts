export class AlreadySubscribedError extends Error {
	constructor() {
		super('Observable spy already subscribed');
		this.name = AlreadySubscribedError.name;
	}
}

export class NotSubscribedError extends Error {
	constructor() {
		super('Observable spy is not subscribed to the target observable');
		this.name = NotSubscribedError.name;
	}
}

export class UnexpectedObservableCompleteError extends Error {
	constructor() {
		super('Unexpected observable complete signal received');
		this.name = UnexpectedObservableCompleteError.name;
	}
}

