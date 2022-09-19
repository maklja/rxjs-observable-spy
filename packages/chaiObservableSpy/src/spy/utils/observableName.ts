const OBSERVABLE_NAME = '__observable_spy_name__';

export function retrieveObservableName(
	assertionStatic: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
): string | null {
	return utils.flag(assertionStatic, OBSERVABLE_NAME);
}

export function createObservableName(
	name: string | null,
	assertionStatic: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
) {
	utils.flag(assertionStatic, OBSERVABLE_NAME, name);
}

