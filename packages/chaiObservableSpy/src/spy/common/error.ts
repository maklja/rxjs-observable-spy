import { EventType } from '@maklja90/rxjs-observable-spy';

export interface ObservableSpyAssertionProps {
	error?: unknown;
	expectedEvent?: EventType;
	receivedEvent?: EventType;
}

export class ObservableSpyAssertionError extends Error {
	public readonly expectedEvent: EventType | null;
	public readonly receivedEvent: EventType | null;

	constructor(message: string, props?: ObservableSpyAssertionProps) {
		super(message);

		this.name = ObservableSpyAssertionError.name;
		this.expectedEvent = props?.expectedEvent ?? null;
		this.receivedEvent = props?.receivedEvent ?? null;

		if (props?.error instanceof Error) {
			this.stack = props?.error?.stack;
		}
	}
}

