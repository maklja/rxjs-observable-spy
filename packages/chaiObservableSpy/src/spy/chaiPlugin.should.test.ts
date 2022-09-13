import chai from 'chai';
import { EMPTY, from, of, throwError } from 'rxjs';
import createChaiObservableSpyPlugin from './chaiPlugin';

chai.should();

chai.use(createChaiObservableSpyPlugin());

describe('ChaiJS should observable spy plugin test', function () {
	it('should throw error if type is not Observable', function () {
		try {
			const obj = {};
			obj.should.emit;
		} catch (e) {
			const error = e as Chai.AssertionError;
			error.message.should.be.string('expected {} to be a Observable');
		}
	});

	it('should be deep equal on next', async function () {
		const string$ = of({ username: 'test@test.com', firstName: 'Test', lastName: 'Test' });

		const values = await string$.should.emit
			.next({ username: 'test@test.com', firstName: 'Test', lastName: 'Test' })
			.verifyComplete();
		values.should.to.deep.equals([
			{ username: 'test@test.com', firstName: 'Test', lastName: 'Test' },
		]);
	});

	it('should receive all values in proper order', async function () {
		const string$ = from(['Tom', 'Tina', 'Ana']);

		const values = await string$.should.emit
			.next('Tom')
			.next('Tina')
			.next('Ana')
			.verifyComplete();
		values.should.be.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should fail if value does not match', async function () {
		const string$ = from(['Tom', 'Ana']);

		try {
			await string$.should.emit.next('Tom').next('Tina').next('Ana').verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			error.message.should.be.string("Expected next value: 'Tina', actual value 'Ana'");
		}
	});

	it('should fail if value does not exists', async function () {
		const string$ = from(['Tom', 'Tina', 'Ana']);

		try {
			await string$.should.emit
				.next('Tom')
				.next('Tina')
				.next('Ana')
				.next('Jonh')
				.verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			error.message.should.be.string(
				'[next] - expected signal: next, actual signal: complete, expected value: Jonh',
			);
		}
	});

	it('should receive proper values count', async function () {
		const string$ = from(['Tom', 'Ana']);

		const values = await string$.should.emit.nextCount(2).verifyComplete();
		values.should.be.deep.equals(['Tom', 'Ana']);
	});

	it('should skip proper values count', async function () {
		const string$ = from(['Tom', 'Ana']);

		const values = await string$.should.emit.skipCount(2).verifyComplete();
		values.should.be.deep.equals(['Tom', 'Ana']);
	});

	it('should fail if values count mismatch', async function () {
		const string$ = from(['Tom', 'Ana']);

		try {
			await string$.should.emit.nextCount(3).verifyComplete();
		} catch (e) {
			const error = e as Chai.AssertionError;
			error.message.should.be.string(
				'[nextCount] - expected signal: next, actual signal: complete, expected value: 3',
			);
		}
	});

	it('should catch expected error', async function () {
		const error$ = throwError(() => new Error('This is an error'));

		await error$.should.emit.error(Error, 'This is an error').verify();
		await error$.should.emit.errorMessage('This is an error').verify();
		await error$.should.emit.errorType(Error).verify();
	});

	it('should fail when unexpected error is thrown', async function () {
		class CustomError extends Error {
			constructor() {
				super('This is my custom error');
			}
		}

		const error$ = throwError(() => new CustomError());

		try {
			await error$.should.emit.error(CustomError, 'This is an error').verify();
		} catch (e) {
			const error = e as Chai.AssertionError;
			error.message.should.to.be.string(
				"Expected error type: 'CustomError', actual error type 'Error'",
			);
		}
	});

	it('should next value match a condition', async function () {
		const numbers$ = from([2, 2, 3]);

		const conditionMatch = (val: number): boolean => val > 1;

		const values = await numbers$.should.emit
			.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.verifyComplete();
		values.should.be.deep.equals([2, 2, 3]);
	});

	it('should next value match a condition until', async function () {
		const sourceNumbers = [2, 2, 3];
		const numbers$ = from(sourceNumbers);

		const conditionMatch = (val: number): boolean => val > 1;

		const values = await numbers$.should.emit
			.nextMatchesUntil(conditionMatch, (_, index) => index < sourceNumbers.length - 1)
			.verifyComplete();
		values.should.be.deep.equals([2, 2, 3]);
	});

	it('should fail if next value does not satisfies match condition', async function () {
		const numbers$ = from([2, 2, 3]);

		const conditionMatch = (val: number) => val >= 2;

		const values = await numbers$.should.emit
			.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.nextMatches(conditionMatch)
			.verifyComplete();
		values.should.be.deep.equals([2, 2, 3]);
	});

	it('should consume next value', async function () {
		const numbers$ = from([2, 2, 3]);

		const values = await numbers$.should.emit
			.consumeNext<number>((val) => val.should.be.a('number').and.to.be.equal(2))
			.consumeNext<number>((val) => val.should.be.a('number').and.to.be.equal(2))
			.consumeNext<number>((val) => val.should.be.a('number').and.to.be.equal(3))
			.verifyComplete();
		values.should.deep.equals([2, 2, 3]);
	});

	it('should consume next value until satisfies condition', async function () {
		const sourceValues = [2, 2, 3];
		const numbers$ = from(sourceValues);

		const values = await numbers$.should.emit
			.consumeNextUntil<number>((val, index) => {
				val.should.be.a('number').and.to.be.equal(sourceValues[index]);
				return index < 2;
			})
			.verifyComplete();
		values.should.be.deep.equals([2, 2, 3]);
	});

	it('should ignore all next values and await complete', async function () {
		const numbers$ = from([2, 2, 3]);

		const values = await numbers$.should.emit.awaitComplete();
		values.should.be.deep.equals([2, 2, 3]);
	});

	it('should receive a single next value and complete', async function () {
		const string$ = of('John');

		const singleString = await string$.should.emit.awaitSingle<string>();
		singleString.should.be.equals('John');
	});

	it('should throw an error in case of more then one next value', async function () {
		const string$ = of('John', 'Ana');

		try {
			await string$.should.emit.awaitSingle();
		} catch (e) {
			const error = e as Chai.AssertionError;
			error.message.should.be.string(
				'Received multiple values, when single one was expected.',
			);
		}
	});

	it('should throw an error in case no next values are received', async function () {
		try {
			await EMPTY.should.emit.awaitSingle();
		} catch (e) {
			const error = e as Chai.AssertionError;
			error.message.should.be.string(
				'Expected to receive a single value, but received zero.',
			);
		}
	});
});

