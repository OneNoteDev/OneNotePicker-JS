import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

let webpackConfiguration = {
    entry: './sampleApp/main.ts',
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
            }
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
        })
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
