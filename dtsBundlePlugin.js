const dts = require('dts-bundle');

class DtsBundlePlugin {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		compiler.plugin('done', () => {
			dts.bundle(this.options);
		});
	}
}

module.exports = DtsBundlePlugin;
