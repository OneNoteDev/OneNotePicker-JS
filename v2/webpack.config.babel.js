import path from 'path'
import webpack from 'webpack'

let webpackConfiguration = {
    entry: './src/main.ts',
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
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#cheap-module-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            OneNoteApi: 'onenoteapi/target/oneNoteApi.js'
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

export default webpackConfiguration;