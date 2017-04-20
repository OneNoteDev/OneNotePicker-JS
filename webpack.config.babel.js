import path from 'path'
import webpack from 'webpack'

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    allChunks: true
});

let webpackConfiguration = {
    entry: {
        main: './sampleApp/main.ts',
        oneNoteSectionPicker: './src/oneNoteSectionPicker.sass'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].js'
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
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
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
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.ts', '.js']
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
            OneNoteApi: 'onenoteapi/target/oneNoteApi.js'
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

export default webpackConfiguration;
