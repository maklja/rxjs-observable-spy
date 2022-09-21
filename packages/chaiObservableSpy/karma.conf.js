module.exports = function (config) {
	config.set({
		frameworks: ['mocha', 'chai', 'karma-typescript'],
		reporters: ['progress', 'html'],
		port: 9877,
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ['ChromeHeadless'],
		singleRun: true,
		concurrency: Infinity,
		files: ['src/**/*.ts'],
		preprocessors: {
			'**/*.ts': 'karma-typescript',
		},
		karmaTypescriptConfig: {
			compilerOptions: {
				esModuleInterop: true,
				isolatedModules: false,
				module: 'CommonJS',
				target: 'ES5',
				lib: ['es2015', 'es2016'],
				allowJs: false,
				strict: true,
				noFallthroughCasesInSwitch: true,
				allowSyntheticDefaultImports: true,
				skipLibCheck: true,
				forceConsistentCasingInFileNames: true,
				declaration: true,
				declarationMap: true,
				sourceMap: false,
			},
		},
	});
};

