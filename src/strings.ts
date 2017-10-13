export class Strings {
	private static defaults: {} = {
		'Shared': 'Shared',
		'Error.4XX': 'You no longer have access to this notebook.',
		'Error.5XX': 'Something went wrong on our end.',
		'Error.Fallback': 'Something went wrong.'
	};

	static get(key: string, overrides?: {}) {
		overrides = overrides || {};
		return overrides[key] || this.defaults[key] || '';
	}

	static getError(responseCode: number, overrides?: {}) {
		let responseStr = responseCode + '';
		if (responseStr.indexOf('4') === 0) {
			return this.get('Error.4XX', overrides);
		}
		if (responseStr.indexOf('5') === 0) {
			return this.get('Error.5XX', overrides);
		}
		return this.get('Error.Fallback', overrides);
	}
}
