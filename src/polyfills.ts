class Polyfills {
	static init() {
		this.promisePoly();
		this.findPoly();
	}

	static promisePoly() {
		if (typeof Promise === 'undefined') {
			let promise = require('es6-promise');
			promise.polyfill();
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find?v=control#Polyfill
	static findPoly() {
		if (!Array.prototype.find) {
			Object.defineProperty(Array.prototype, 'find', {
				value: function(predicate) {
					if (this == null) {
						throw new TypeError('"this" is null or not defined');
					}

					var o = Object(this);
					var len = o.length >>> 0;

					if (typeof predicate !== 'function') {
						throw new TypeError('predicate must be a function');
					}

					var thisArg = arguments[1];

					var k = 0;

					while (k < len) {
						var kValue = o[k];
						if (predicate.call(thisArg, kValue, k, o)) {
							return kValue;
						}
						k++;
					}

					return undefined;
				}
			});
		}
	}
}

Polyfills.init();
