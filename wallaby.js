let wallabyWebpack = require('wallaby-webpack');
let wallabyPostprocessor = wallabyWebpack({});

module.exports = function (wallaby) {
	return {
		testFramework: 'mocha',

		files: [
			{pattern: 'src/**/*.ts', load: false},
		],
		tests: [
			{pattern: 'test/**/*.ts', load: false}
		],

		postprocessor: wallabyPostprocessor,

		setup: function () {
			// required to trigger test loading
			window.__moduleBundler.loadTests();
		}
	};
};
