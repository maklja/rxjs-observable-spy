module.exports = function (config) {
	config.set({
		frameworks: ['mocha', 'chai', 'karma-typescript'],
		reporters: ['progress', 'html'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ['ChromeHeadless'],
		singleRun: true,
		concurrency: Infinity,
		files: ['src/**/*.ts'],
		preprocessors: {
			'**/*.ts': 'karma-typescript',
		},
	});
};

