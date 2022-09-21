import { expect } from 'chai';
import { filter, interval, take } from 'rxjs';
import '../../register';

describe('Chai observable spy virtualTime keyword', function () {
	it('should use virtual time and receive values in proper order', async function () {
		const interval$ = interval(1_000).pipe(
			filter((val) => val % 2 === 1),
			take(2),
		);

		const values = await expect(interval$).emit.virtualTime.next(1).next(3).verifyComplete();
		expect(values).to.deep.equals([1, 3]);
	});
});

