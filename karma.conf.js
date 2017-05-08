module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "src/**/*.ts" }, // *.tsx for React Jsx ,
            { pattern: "src/**/*.tsx" }, // *.tsx for React Jsx ,
            { pattern: "test/**/*.ts" }, // *.tsx for React Jsx
            { pattern: "test/**/*.tsx" }, // *.tsx for React Jsx
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"], // *.tsx for React Jsx
            "**/*.tsx": ["karma-typescript"], // *.tsx for React Jsx
        },
        reporters: ["spec", "karma-typescript"],
        browsers: ["PhantomJS"],
        karmaTypescriptConfig: {
            bundlerOptions: {
                exclude: ["react/addons", "react/lib/ExecutionEnvironment", "react/lib/ReactContext"],
                entrypoints: /\.spec\.tsx?$/,
                compilerOptions: {
                    jsx: "react",
                    module: "commonjs",
                    sourceMap: true,
                    target: "ES5",
                    lib: ["DOM", "ES2015"]
                },
                include: [
                	"src/**/*.ts",
                	"src/**/*.tsx",
                ],
                reports:
                    {
                        "html": "coverage",
                        "text-summary": "",
                    }
            }
        }
    });
};