import { Observable, Subscription } from 'rxjs';
import { VerificationStep } from './VerificationStep';

export default function verify<T>(observable: Observable<T>, steps: VerificationStep<T>[]) {
	const values: T[] = [];
	let count = 0;
	const onNext = (reject: (reason?: unknown) => void) => (value: T) => {
		try {
			const { next } = steps[0];
			const isDone = next({
				value,
				count,
			});
			count++;

			isDone && steps.splice(0, 1);
			values.push(value);
		} catch (e) {
			reject(e);
		}
	};

	const onError =
		(resolve: (value: T[]) => void, reject: (reason?: unknown) => void) => (e: Error) => {
			try {
				const { error } = steps[0];
				const isDone = error({
					error: e,
					count,
				});
				isDone && steps.splice(0, 1);
				resolve(values);
			} catch (assertError) {
				reject(assertError);
			}
		};

	const onComplete =
		(resolve: (value: T[]) => void, reject: (reason?: unknown) => void) => () => {
			try {
				const { complete } = steps[0];
				const isDone = complete({ count });
				isDone && steps.splice(0, 1);
				resolve(values);
			} catch (e) {
				reject(e);
			}
		};

	return new Promise<T[]>((resolve, reject) => {
		let subscription: Subscription | null = null;

		const unsubscribe = () => {
			if (subscription) {
				subscription.unsubscribe();
				subscription = null;
			}
		};

		const onCompleted = (value: T[]) => {
			resolve(value);
			unsubscribe();
		};

		const onException = (reason?: unknown) => {
			reject(reason);
			unsubscribe();
		};

		subscription = observable.subscribe({
			next: onNext(onException),
			error: onError(onCompleted, onException),
			complete: onComplete(onCompleted, onException),
		});
	});
}
