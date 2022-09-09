import chai, { expect } from 'chai';
import { from, throwError } from 'rxjs';
import { chaiObservableSpyPlugin } from '..';

chai.use(chaiObservableSpyPlugin);

describe('ChaiJS observable spy plugin test', function () {
	it('Test sequence should success if all received values are as expected', async function () {
		const string$ = from(['Tom', 'Tina', 'Ana']);

		const values = await expect(string$)
			.subscriber.next('Tom')
			.next('Tina')
			.next('Ana')
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('Test sequence should fail if value does not match', async function () {
		const string$ = from(['Tom', 'Ana']);

		try {
			await expect(string$)
				.to.subscriber.next('Tom')
				.next('Tina')
				.next('Ana')
				.verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.string("Expected next value: 'Tina', actual value 'Ana'");
		}
	});

	it('Test sequence should fail if value does not exists', async function () {
		const string$ = from(['Tom', 'Tina', 'Ana']);

		try {
			await expect(string$)
				.to.subscriber.next('Tom')
				.next('Tina')
				.next('Ana')
				.next('Jonh')
				.verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.string(
				'[next] - expected signal: next, actual signal: complete, expected value: Jonh',
			);
		}
	});

	it('Test sequence should success if values count match', async function () {
		const string$ = from(['Tom', 'Ana']);

		const values = await expect(string$).to.subscriber.nextCount(2).verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Ana']);
	});

	it('Test sequence should fail if values count mismatch', async function () {
		const string$ = from(['Tom', 'Ana']);

		try {
			await expect(string$).to.subscriber.nextCount(3).verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.string(
				'[nextCount] - expected signal: next, actual signal: complete, expected value: 3',
			);
		}
	});

	it('Test sequence should success when expected error is thrown', async function () {
		const error$ = throwError(() => new Error('This is an error'));

		await expect(error$).to.subscriber.error(Error, 'This is an error').verify();
		await expect(error$).to.subscriber.errorMessage('This is an error').verify();
		await expect(error$).to.subscriber.errorType(Error).verify();
	});

	it('Test sequence should fail when unexpected error is thrown', async function () {
		class CustomError extends Error {
			constructor() {
				super('This is my custom error');
			}
		}

		const error$ = throwError(() => new CustomError());

		try {
			await expect(error$).to.subscriber.error(CustomError, 'This is an error').verify();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.string(
				"Expected error type: 'CustomError', actual error type 'Error'",
			);
		}
	});

	it('Test sequence should success if all values satisfies match condition', async function () {
		const numbers$ = from([2, 2, 3]);

		const conditionMatch = (val: number) => val > 1;

		const values = await expect(numbers$)
			.subscriber.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.verifyComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('Test sequence should fail if some value does not satisfies match condition', async function () {
		const numbers$ = from([2, 2, 3]);

		const conditionMatch = (val: number) => val >= 2;

		const values = await expect(numbers$)
			.subscriber.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.verifyComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('Test sequence should success when consume next value', async function () {
		const numbers$ = from([2, 2, 3]);

		const values = await expect(numbers$)
			.subscriber.consumeNext<number>((val) =>
				expect(val).to.be.a('number').and.to.be.equal(2),
			)
			.consumeNext<number>((val) => expect(val).to.be.a('number').and.to.be.equal(2))
			.consumeNext<number>((val) => expect(val).to.be.a('number').and.to.be.equal(3))
			.verifyComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('Test sequence should complete with success', async function () {
		const numbers$ = from([2, 2, 3]);

		const values = await expect(numbers$).subscriber.awaitComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});
});

