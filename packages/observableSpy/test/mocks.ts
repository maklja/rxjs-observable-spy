export class MockError extends Error {
	constructor() {
		super('Mock error message');
		this.name = MockError.name;
	}
}
