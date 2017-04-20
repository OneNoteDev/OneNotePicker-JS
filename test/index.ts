import Vue from "vue";
declare var require: any;

Vue.config.productionTip = false;

// require all test files (files that ends with .spec.js)
const testsContext = require.context(".", true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context("../src", true, /\.ts$/);
srcContext.keys().forEach(srcContext);
