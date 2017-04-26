const path = require("path");

/// Start Webpack Configuration
let webpackConfig = require('./webpack.config.js');

// inline source map is needed for instrumentation to work properly
webpackConfig.devtool = '#inline-source-map';

// Entry file is not needed anymore
delete webpackConfig.entry;

// Add instrumentation for JS / TS under /src
webpackConfig.module.rules.unshift(
	{
		test: /\.ts$/,
		include: path.resolve('src/'),
		loader: 'istanbul-instrumenter-loader'
	});

webpackConfig.module.rules.unshift(
	{
		test: /\.js$/,
		include: path.resolve('src/'),
		loader: 'istanbul-instrumenter-loader'
	});


/// End Webpack Configuration

let karmaConfig = function (config) {
	config.set({
		browsers: ['PhantomJS'],
		frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
		webpack: webpackConfig,
		files: ['./test/index.ts'],
		preprocessors: {
			'./test/index.ts': ['webpack', 'sourcemap']
		},
		webpackMiddleware: {
			noInfo: true
		},
		reporters: ['spec', 'coverage-istanbul'],
		coverageIstanbulReporter: {
			reports: ['html', 'lcovonly', 'text-summary'],
			dir: path.join(__dirname, 'coverage'),
			fixWebpackSourcePaths: true,
			skipFilesWithNoCoverage: true,
			'report-config': {
				html: {
					subdir: 'html'
				}
			}
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		singleRun: false,
		concurrency: Infinity
	})
};

module.exports = karmaConfig;
