require('babel-core/register');

let webpackConfig = require('./webpack.config.babel').default;
delete webpackConfig.entry;

let karmaConfig = function(config) {
	config.set({
		browsers: ['PhantomJS'],
		frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
		webpack: webpackConfig,
		files: [
			{pattern: 'test/**/*.spec.ts'}
		],
		preprocessors: {
			'**/*.spec.ts': ['webpack', 'sourcemap']
		},
		webpackMiddleware: {
			noInfo: true
		},
		reporters: ['spec'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		singleRun: false,
		concurrency: Infinity
	})
};

module.exports = karmaConfig;
