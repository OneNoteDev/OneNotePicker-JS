/// <binding BeforeBuild='build' />
"use strict";
var require;

var browserify = require("browserify");
var del = require("del");
var globby = require("globby");
var gulp = require("gulp");
var less = require("gulp-less");
var merge = require("merge-stream");
var minifyCSS = require("gulp-cssnano");
var msx = require("gulp-msx");
var plumber = require("gulp-plumber");
var qunit = require("node-qunit-phantomjs");
var rename = require("gulp-rename");
var runSequence = require("run-sequence");
var shell = require("gulp-shell");
var source = require("vinyl-source-stream");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var typings = require("gulp-typings");

var PATHS = {
	SRCROOT: "src/",
	BUILDROOT: "build/",
	BUNDLEROOT: "build/bundles/",
	LIBROOT: "lib/",
	DEFINITIONS: "typings/",
	TARGET: {
		ROOT: "target/"
	},
	NODE_MODULES: "node_modules/"
};

// Used for debugging glob declarations
function printGlobResults(glob) {
	globby.sync(glob).map(function (filePath) {
		console.log(filePath);
	});
}

////////////////////////////////////////
// SETUP
////////////////////////////////////////
gulp.task("cleanDefinitions", function (callback) {
	return del([
		PATHS.DEFINITIONS
	], callback);
});

gulp.task("definitions", function () {
	return gulp.src("./typings.json")
		.pipe(typings());
});

gulp.task("setup", function (callback) {
	runSequence(
		"cleanDefinitions",
		"definitions",
		callback);
});

////////////////////////////////////////
// CLEAN
////////////////////////////////////////
gulp.task("clean", function (callback) {
	return del([
		PATHS.BUILDROOT,
		PATHS.BUNDLEROOT,
		PATHS.TARGET.ROOT
	], callback);
});


////////////////////////////////////////
// LESS
////////////////////////////////////////
gulp.task("less", function () {
	return gulp.src(PATHS.SRCROOT + "styles/*.less")
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(gulp.dest(PATHS.BUILDROOT + "css"));
});


////////////////////////////////////////
// COMPILE
////////////////////////////////////////
gulp.task("compileTypeScript", function () {
	return gulp.src([PATHS.SRCROOT + "**/*.+(ts|tsx)", PATHS.DEFINITIONS + "main/**/*.d.ts"])
		.pipe(ts({
			jsx: "preserve",
			module: "commonjs"
		}))
		.pipe(gulp.dest(PATHS.BUILDROOT));
});

gulp.task("mithrilify", function () {
	return gulp.src(PATHS.BUILDROOT + "**/*.jsx")
		.pipe(msx())
		.pipe(gulp.dest(PATHS.BUILDROOT));
});

gulp.task("compile", function (callback) {
	runSequence(
		"compileTypeScript",
		"mithrilify",
		callback);
});


////////////////////////////////////////
// TSLINT
////////////////////////////////////////
//The actual task to run
gulp.task("tslint", function () {
	var tsErrorReport = tslint.report("prose", {
		emitError: false,
		reportLimit: 50
	});

	var tsFiles = [PATHS.SRCROOT + "**/*.ts", PATHS.SRCROOT + "**/*.tsx", "!" + PATHS.SRCROOT + "**/*.d.ts"];

	return gulp.src(tsFiles)
		.pipe(plumber())
		.pipe(tslint())
		.pipe(tsErrorReport);
});


////////////////////////////////////////
// BUNDLE
////////////////////////////////////////
gulp.task("bundlePicker", function() {
	return browserify(PATHS.BUILDROOT + "scripts/oneNotePicker.js", { standalone: "OneNotePicker" })
		.bundle()
		.pipe(source("oneNotePicker.js"))
		.pipe(gulp.dest(PATHS.BUNDLEROOT));
});

gulp.task("bundleTests", function() {
	var tasks = globby.sync(["**/*.js"], { cwd: PATHS.BUILDROOT + "tests" }).map(function(filePath) {
		return browserify(PATHS.BUILDROOT + "tests/" + filePath, { debug: true })
			.bundle()
			.pipe(source(filePath))
			.pipe(gulp.dest(PATHS.BUNDLEROOT + "tests"));
	});

	return merge(tasks);
});

gulp.task("bundle", function(callback) {
	runSequence(
		"bundlePicker",
		"bundleTests",
		callback);
});

////////////////////////////////////////
// EXPORT - HELPER FUNCTIONS
////////////////////////////////////////
function lowerCasePathName() {
	return rename(function (path) {
		path.dirname = path.dirname.toLowerCase();
		path.basename = path.basename.toLowerCase();
		path.extname = path.extname.toLowerCase();
	});
}

function exportCommonFiles(targetDir) {
	var imagesTask = gulp.src(PATHS.SRCROOT + "images/*", { base: PATHS.SRCROOT })
		.pipe(lowerCasePathName())
		.pipe(gulp.dest(targetDir));

	var cssTask = gulp.src(PATHS.BUILDROOT + "css/*", { base: PATHS.BUILDROOT }).
		pipe(gulp.dest(targetDir));

	return merge(imagesTask, cssTask);
}

function exportTestJS() {
	var targetDir = PATHS.TARGET.ROOT + "tests/";
	return gulp.src(PATHS.BUNDLEROOT + "tests/**/*", { base: PATHS.BUNDLEROOT + "tests/" })
		.pipe(gulp.dest(targetDir));
}

function exportTestSrcFiles() {
	var targetDir = PATHS.TARGET.ROOT + "tests/";
	return gulp.src(PATHS.SRCROOT + "tests/tests.html")
		.pipe(rename("index.html"))
		.pipe(gulp.dest(targetDir));
}

function exportTestLibFiles() {
	var targetDir = PATHS.TARGET.ROOT + "tests/";
	return gulp.src([
		PATHS.NODE_MODULES + "qunitjs/qunit/qunit.+(css|js)",
		PATHS.NODE_MODULES + "mithril/mithril.js",
		PATHS.NODE_MODULES + "onenoteapi/target/oneNoteApi.js",
		PATHS.LIBROOT + "tests/bind_polyfill.js"
	]).pipe(gulp.dest(targetDir + "libs"));
}

////////////////////////////////////////
// EXPORT - TASKS
////////////////////////////////////////

gulp.task("exportPicker", function() {
	var modulesTask = gulp.src(PATHS.BUILDROOT + "scripts/**/*.js", { base: PATHS.BUILDROOT + "/scripts" })
		.pipe(gulp.dest(PATHS.TARGET.ROOT + "modules/"));

	var commonTask = exportCommonFiles(PATHS.TARGET.ROOT);
	var copyTask = gulp.src([
			PATHS.BUNDLEROOT + "oneNotePicker.js",
			PATHS.SRCROOT + "oneNotePicker.d.ts"
		])
		.pipe(gulp.dest(PATHS.TARGET.ROOT));

	return merge(modulesTask, copyTask, commonTask);
});

gulp.task("exportTests", function() {
	var jsTask = exportTestJS();
	var srcTask = exportTestSrcFiles();
	var libTask = exportTestLibFiles();
	return merge(jsTask, srcTask, libTask);
});

gulp.task("export", function (callback) {
	runSequence(
		"exportPicker",
		"exportTests",
		callback);
});

////////////////////////////////////////
// RUN
////////////////////////////////////////
gulp.task("runTests", function () {
	return qunit(PATHS.TARGET.ROOT + "tests/index.html");
});


////////////////////////////////////////
// SHORTCUT TASKS
////////////////////////////////////////
gulp.task("build", function (callback) {
	runSequence(
		"less",
		"compile",
		"bundle",
		"export",
		"tslint",
		"runTests",
		callback);
});

gulp.task("full", function (callback) {
	runSequence(
		"clean",
		"build",
		callback);
});

gulp.task("default", ["build"]);
