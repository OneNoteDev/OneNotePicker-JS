const wallabyWebpack = require('wallaby-webpack');

const webpackConfig = {};
webpackConfig.externals = webpackConfig.externals || {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

const wallabyPostprocessor = wallabyWebpack(webpackConfig);

module.exports = function (wallaby) {
	return {
		testFramework: 'jasmine',

		files: [
			{pattern: 'src/**/*.ts', load: false},
			{pattern: 'src/**/*.tsx', load: false},
		],
		tests: [
			{pattern: 'test/**/*.ts', load: false},
			{pattern: 'test/**/*.tsx', load: false}
		],

		postprocessor: wallabyPostprocessor,

		setup: function () {
			// required to trigger test loading
			window.__moduleBundler.loadTests();
		}
	};
};
