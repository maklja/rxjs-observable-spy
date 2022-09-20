const OBSERVABLE_NAME = '__observable_spy_name__';

export function retrieveObservableName(
	assertionStatic: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
): string | undefined {
	return utils.flag(assertionStatic, OBSERVABLE_NAME);
}

export function createObservableName(
	assertionStatic: Chai.AssertionStatic,
	utils: Chai.ChaiUtils,
	name?: string,
) {
	if (name) {
		utils.flag(assertionStatic, OBSERVABLE_NAME, name);
	}
}

