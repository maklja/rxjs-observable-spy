import chai, { expect } from 'chai';
import { from, of, throwError } from 'rxjs';
import createChaiObservableSpyPlugin from './chaiPlugin';

chai.should();

chai.use(createChaiObservableSpyPlugin());

describe('ChaiJS observable spy example test', function () {
	it('should receive ordered strings with the complete event', async () => {
		const strings$ = of('Tom', 'Tina', 'Ana');

		// verifyComplete will return Promise that will resolve with
		// received values from observable
		const values = await expect(strings$)
			// alternative to 'emit' is to use word 'observableSpy'
			.emit.next('Tom')
			.next('Tina')
			.next('Ana')
			// start a verification and
			// expect to observable ends with complete event
			// alternative is to call complete and then verify
			.verifyComplete();

		expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should receive proper values count', async () => {
		const strings$ = of('Tom', 'Ana');

		// expect to receive 2 values and then the complete event
		const values = await expect(strings$).emit.nextCount(2).verify();
		expect(values).to.deep.equals(['Tom', 'Ana']);
	});

	it('should next value match a condition', async function () {
		const numbers$ = of(2, 2, 3);

		// assert that verifies a value
		// if false is returned the assertion inside a library will throw an error
		const customAssertation = (val: number): boolean => val > 1;

		const values = await expect(numbers$)
			.emit.nextMatches(customAssertation)
			.nextMatches(customAssertation)
			.nextMatches(customAssertation)
			.verifyComplete();

		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should next value match a condition until', async () => {
		const sourceNumbers = [2, 2, 3];
		const numbers$ = from(sourceNumbers);

		// assert that verifies a value
		// if false is returned the assertion inside a library will throw an error
		const conditionMatch = (val: number): boolean => val > 1;

		const values = await expect(numbers$)
			.emit.nextMatchesUntil<number>(
				conditionMatch,
				// condition that indicates if the current verification step is over
				// when a false is returned, the library will proceed
				// with the next verification step.
				(_, index) => index < sourceNumbers.length - 1,
			)
			.verifyComplete();

		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should consume next value', async () => {
		const numbers$ = of(2, 2, 3);

		// if you are using typescript you can specify generic types '<number>'
		const values = await expect(numbers$)
			.emit.consumeNext<number>((val) => expect(val).to.be.a('number').and.to.be.equal(2))
			.consumeNext<number>((val) => expect(val).to.be.a('number').and.to.be.equal(2))
			.consumeNext<number>((val) => expect(val).to.be.a('number').and.to.be.equal(3))
			.verifyComplete();

		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should consume next value until satisfies condition', async () => {
		const sourceValues = [2, 2, 3];
		const numbers$ = from(sourceValues);

		const values = await expect(numbers$)
			.emit.consumeNextUntil<number>((val, index) => {
				expect(val).to.be.a('number').and.to.be.equal(sourceValues[index]);
				// if true is returned the verification step is still not over,
				// otherwise the next verification step will start with execution
				return index < sourceValues.length - 1;
			})
			.verifyComplete();

		expect(values).to.deep.equals([2, 2, 3]);
	});

	it('should skip values', async () => {
		const strings$ = of('Tom', 'Ana', 'John');

		const values = await expect(strings$)
			.emit.skipCount(2) // skip next 2 values
			.next('John')
			.verifyComplete();

		expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
	});

	it('should skip values until condition', async () => {
		const strings$ = of('Tom', 'Ana', 'John');

		const values = await expect(strings$)
			.emit.skipUntil((_, index) => index < 1) // skip while index < 1
			.next('John')
			.verifyComplete();

		expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
	});

	it('should catch an error from observable', async () => {
		const error$ = throwError(() => new Error('Upss'));

		await expect(error$).emit.error(Error, 'Upss').verify();
		await expect(error$).emit.errorType(Error).verify();
		await expect(error$).emit.errorMessage('Upss').verify();
	});

	it('should receive values in proper order with complete event', async () => {
		const strings$ = from(['Tom', 'Tina', 'Ana']);

		const values = await strings$.should.emit
			.next('Tom')
			.next('Tina')
			.next('Ana')
			.verifyComplete<string>();

		values.should.be.deep.equals(['Tom', 'Tina', 'Ana']);
	});

	it('should receive a single next value and complete', async () => {
		const string$ = of('John');

		// result will be a single value instead of array of values
		const singleString = await expect(string$).emit.awaitSingle<string>();
		expect(singleString).to.be.equals('John');
	});

	it('should just await complete event and ignore next values', async () => {
		const strings$ = of('Tom', 'Ana', 'John');

		const values = await expect(strings$).emit.awaitComplete();
		expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
	});

	it('should just await complete event and assert next values', async () => {
		const sourceValues = ['Tom', 'Ana', 'John'];
		const strings$ = from(sourceValues);

		const values = await expect(strings$).emit.awaitComplete((val, index) =>
			expect(val).to.be.equal(sourceValues[index]),
		);
		expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
	});
});

