export module Polyfills {
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find?v=control
	export function find() {
		// https://tc39.github.io/ecma262/#sec-array.prototype.find
		if (!Array.prototype.find) {
			Object.defineProperty(Array.prototype, 'find', {
				value: function (predicate) {
					// 1. const O be ? ToObject(this value).
					if (this == null) {
						throw new TypeError('"this" is null or not defined');
					}

					var o = Object(this);

					// 2. const len be ? ToLength(? Get(O, "length")).
					// tslint:disable-next-line:no-bitwise
					var len = o.length >>> 0;

					// 3. If IsCallable(predicate) is false, throw a TypeError exception.
					if (typeof predicate !== 'function') {
						throw new TypeError('predicate must be a function');
					}

					// 4. If thisArg was supplied, const T be thisArg; else const T be undefined.
					var thisArg = arguments[1];

					// 5. const k be 0.
					var k = 0;

					// 6. Repeat, while k < len
					while (k < len) {
						// a. const Pk be ! ToString(k).
						// b. const kValue be ? Get(O, Pk).
						// c. const testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
						// d. If testResult is true, return kValue.
						var kValue = o[k];
						if (predicate.call(thisArg, kValue, k, o)) {
							return kValue;
						}
						// e. Increase k by 1.
						k++;
					}

					// 7. Return undefined.
					return undefined;
				}
			});
		}
	}
}
