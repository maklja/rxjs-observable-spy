import { expect } from 'chai';
import { of, throwError } from 'rxjs';
import { MissingVerificationStepError } from '../errors';
import { verifyObservable } from './verifyObservable';

describe('Test verifyObservable function', function () {
	it('will fall back to default verification step if next step is not found', async function () {
		try {
			await verifyObservable(of(1, 2, 3, 4), []);
		} catch (e) {
			const error = e as MissingVerificationStepError;
			expect(error).to.be.instanceOf(Error);
			expect(error.name).to.be.equal(MissingVerificationStepError.name);
			expect(error.message).to.be.equal(
				"Missing verification step to process received event: 'next'",
			);
		}
	});

	it('will fall back to default verification step if error step is not found', async function () {
		try {
			await verifyObservable(
				throwError(() => new Error('Unexpected error')),
				[],
			);
		} catch (e) {
			const error = e as MissingVerificationStepError;
			expect(error).to.be.instanceOf(Error);
			expect(error.name).to.be.equal(MissingVerificationStepError.name);
			expect(error.message).to.be.equal(
				"Missing verification step to process received event: 'error'",
			);
		}
	});

	it('will fall back to default verification step if complete step is not found', async function () {
		try {
			await verifyObservable(of(1), [{}]);
		} catch (e) {
			const error = e as MissingVerificationStepError;
			expect(error).to.be.instanceOf(Error);
			expect(error.name).to.be.equal(MissingVerificationStepError.name);
			expect(error.message).to.be.equal(
				"Missing verification step to process received event: 'complete'",
			);
		}
	});

	it('will behave as next step if done if flag is not returned', async function () {
		const values = await verifyObservable(of(1), [
			{
				next() {
					// test return of undefined
				},
			},
			{
				complete() {
					// test complete
				},
			},
		]);

		expect(values).to.be.deep.equal([1]);
	});

	it('will properly verify error step', async function () {
		const values = await verifyObservable(
			throwError(() => new Error('Unexpected error')),
			[
				{
					error(e) {
						const error = e as Error;
						expect(error).to.be.an.instanceOf(Error);
						expect(error.message).to.be.equal('Unexpected error');
					},
				},
			],
		);

		expect(values).to.be.empty;
	});
});
