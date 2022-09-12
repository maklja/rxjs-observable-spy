import chai, { expect } from 'chai';
import { from, throwError } from 'rxjs';
import createChaiObservableSpyPlugin from './chaiPlugin';

chai.use(createChaiObservableSpyPlugin());

describe('ChaiJS expect observable spy plugin test', function () {
	it('should receive all values in proper order', async function () {
		const string$ = from(['Tom', 'Tina', 'Ana']);

		const values = await expect(string$)
			.emit.next('Tom')
			.next('Tina')
			.next('Ana')
			.verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if value does not match', async function () {
		const string$ = from(['Tom', 'Ana']);

		try {
			await expect(string$).emit.next('Tom').next('Tina').next('Ana').verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.string("Expected next value: 'Tina', actual value 'Ana'");
		}
	});

	it('should fail if value does not exists', async function () {
		const string$ = from(['Tom', 'Tina', 'Ana']);

		try {
			await expect(string$)
				.emit.next('Tom')
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

	it('should receive proper values count', async function () {
		const string$ = from(['Tom', 'Ana']);

		const values = await expect(string$).emit.nextCount(2).verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Ana']);
	});

	it('should skip proper values count', async function () {
		const string$ = from(['Tom', 'Ana']);

		const values = await expect(string$).emit.skipCount(2).verifyComplete();
		expect(values).to.deep.equals(['Tom', 'Ana']);
	});

	it('should fail if values count mismatch', async function () {
		const string$ = from(['Tom', 'Ana']);

		try {
			await expect(string$).emit.nextCount(3).verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.string(
				'[nextCount] - expected signal: next, actual signal: complete, expected value: 3',
			);
		}
	});

	it('should catch expected error', async function () {
		const error$ = throwError(() => new Error('This is an error'));

		await expect(error$).emit.error(Error, 'This is an error').verify();
		await expect(error$).emit.errorMessage('This is an error').verify();
		await expect(error$).emit.errorType(Error).verify();
	});

	it('should fail when unexpected error is thrown', async function () {
		class CustomError extends Error {
			constructor() {
				super('This is my custom error');
			}
		}

		const error$ = throwError(() => new CustomError());

		try {
			await expect(error$).emit.error(CustomError, 'This is an error').verify();
		} catch (e) {
			const error = e as Chai.AssertionError;
			expect(error.message).to.be.string(
				"Expected error type: 'CustomError', actual error type 'Error'",
			);
		}
	});

	it('should next value match a condition', async function () {
		const numbers$ = from([2, 2, 3]);

		const conditionMatch = (val: number): boolean => val > 1;

		const values = await expect(numbers$)
			.emit.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.verifyComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should next value match a condition until', async function () {
		const sourceNumbers = [2, 2, 3];
		const numbers$ = from(sourceNumbers);

		const conditionMatch = (val: number): boolean => val > 1;

		const values = await expect(numbers$)
			.emit.nextMatchesUntil(conditionMatch, (_, index) => index < sourceNumbers.length - 1)
			.verifyComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should fail if next value does not satisfies match condition', async function () {
		const numbers$ = from([2, 2, 3]);

		const conditionMatch = (val: number) => val >= 2;

		const values = await expect(numbers$)
			.emit.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.verifyComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should consume next value', async function () {
		const numbers$ = from([2, 2, 3]);

		const values = await expect(numbers$)
			.emit.consumeNext<number>((val) => expect(val).to.be.a('number').and.to.be.equal(2))
			.consumeNext<number>((val) => expect(val).to.be.a('number').and.to.be.equal(2))
			.consumeNext<number>((val) => expect(val).to.be.a('number').and.to.be.equal(3))
			.verifyComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should consume next value until satisfies condition', async function () {
		const sourceValues = [2, 2, 3];
		const numbers$ = from(sourceValues);

		const values = await expect(numbers$)
			.emit.consumeNextUntil<number>((val, index) => {
				expect(val).to.be.a('number').and.to.be.equal(sourceValues[index]);
				return index < 2;
			})
			.verifyComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should ignore all next values and await complete', async function () {
		const numbers$ = from([2, 2, 3]);

		const values = await expect(numbers$).emit.awaitComplete();
		expect(values).to.deep.equals([2, 2, 3]);
	});
});

