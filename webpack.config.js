const path = require('path');
const webpack = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    allChunks: true
});

// this is probably not needed.
function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

let webpackConfiguration = {
    entry: {
        main: './sampleApp/main.ts',
        oneNotePicker: './src/oneNotePicker.sass'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules|vue\/src/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    esModule: true
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: 'css-loader?sourceMap'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [path.join(__dirname, 'node-modules')],
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.sass$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: 'css-loader?sourceMap'
                        },
                        {
                            loader: 'sass-loader?indentedSyntax',
                            options: {
                                includePaths: [path.join(__dirname, 'node-modules')],
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                })
            },
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        open: true
    },
    performance: {
        hints: false
    },
    devtool: '#cheap-module-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            OneNoteApi: 'onenoteapi/target/oneNoteApi.js',
            Promise: 'es6-promise'
        }),
        new HtmlWebpackPlugin({
            template: "sampleApp/index.html"
        }),
        extractSass
    ]
};

if (process.env.NODE_ENV === 'production') {
    webpackConfiguration.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    webpackConfiguration.plugins = (webpackConfiguration.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
        //,
        // new webpack.optimize.UglifyJsPlugin({
        //   sourceMap: true,
        //   compress: {
        //     warnings: false
        //   }
        // }),
        // new webpack.LoaderOptionsPlugin({
        //   minimize: true
        // })
    ])
}

if (process.env.NODE_ENV === 'analyze') {
    webpackConfiguration.plugins = (webpackConfiguration.plugins || []).concat([
        new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerPort: 8989,
            openAnalyzer: true,
            generateStatsFile: true,
            statsFilename: "build.stats.json",
            statsOptions: null,
            logLevel: "info"
        })
    ]);
}

if (process.env.NODE_ENV === 'test') {
    webpackConfiguration.devtool = "#inline-source-map";
    delete webpackConfiguration.entry;
}

module.exports = webpackConfiguration;
