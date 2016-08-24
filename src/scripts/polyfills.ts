declare var require;

let promise = require("es6-promise");

export module Polyfills {
	export function init() {
		objectAssignPoly();
		promisePoly();
		requestAnimationFramePoly();
		trimPoly();
	}

	// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	function objectAssignPoly() {
		if (typeof (<any>Object).assign !== "function") {
			(<any>Object).assign = function(target: Object) {
				if (!target) {
					throw new TypeError("Cannot convert undefined to object");
				}

				let output = Object(target);
				for (let index = 1; index < arguments.length; index++) {
					let source = arguments[index];
					if (source) {
						for (let nextKey in source) {
							if (source.hasOwnProperty(nextKey)) {
								output[nextKey] = source[nextKey];
							}
						}
					}
				}
				return output;
			};
		}
	}

	function promisePoly() {
		if (typeof Promise === "undefined") {
			promise.polyfill();
		}
	}

	function requestAnimationFramePoly() {
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = window.msRequestAnimationFrame || (<any>window).mozRequestAnimationFrame
				|| (<any>window).webkitRequestAnimationFrame || (<any>window).oRequestAnimationFrame || ((callback: FrameRequestCallback) => {
					setTimeout(() => {
						callback(Date.now());
					}, 16);
				});
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	function trimPoly() {
		if (!String.prototype.trim) {
			String.prototype.trim = function () {
				return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
			};
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	if (!Array.prototype.filter) {
		Array.prototype.filter = function(fun) {
			"use strict";

			if (this === void 0 || this === null) {
				throw new TypeError();
			}

			let t = Object(this);
			let len = t.length >>> 0;
			if (typeof fun !== "function") {
				throw new TypeError();
			}

			let res = [];
			let thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (let i = 0; i < len; i++) {
				if (i in t) {
					let val = t[i];
					if (fun.call(thisArg, val, i, t)) {
						res.push(val);
					}
				}
			}
			return res;
		};
	}
}
