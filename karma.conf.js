module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            './node_modules/phantomjs-polyfill-find/find-polyfill.js',
            { pattern: "src/**/*.ts" },
            { pattern: "src/**/*.tsx" },
            { pattern: "test/**/*.ts" },
            { pattern: "test/**/*.tsx" },
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"],
            "**/*.tsx": ["karma-typescript"],
        },
        reporters: ["spec", "karma-typescript"],
        browsers: ["PhantomJS"],
        karmaTypescriptConfig: {
            bundlerOptions: {
                exclude: ["react/addons", "react/lib/ExecutionEnvironment", "react/lib/ReactContext"],
                entrypoints: /\.spec\.tsx?$/,
                compilerOptions: {
                    sourceMap: true,
                },
                include: [
                    "src/**/*.ts",
                    "src/**/*.tsx",
                    "src/**/*.css",
                ],
                reports: {
                    "html": "coverage",
                    "text-summary": "",
                },
                tsconfig: "./tsconfig.json"
            }
        }
    });
};