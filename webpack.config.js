const webpack = require('webpack');
const path = require('path');

// variables
const IS_PROD = process.env.NODE_ENV === "production";
const OUT_DIR = path.join(__dirname, './dist');

// plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMerge = require('webpack-merge');

const extractSass = new ExtractTextPlugin({
	filename: "[name].css",
	allChunks: true
});

const base = {
	entry: {
		sample: './sampleApp/sample.tsx',
		onenotepicker: './src/oneNotePicker.tsx'
	},
	output: {
		path: OUT_DIR,
		publicPath: '/dist/',
		filename: '[name].js',
	},
	target: 'web',
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
	},
	devtool: 'cheap-module-eval-source-map',
	module: {
		loaders: [
			// .ts, .tsx
			{
				test: /\.tsx?$/,
				use: IS_PROD ? 'awesome-typescript-loader' : ['react-hot-loader', 'awesome-typescript-loader']
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
			// static assets
			{test: /\.html$/, use: 'html-loader'},
			{test: /\.png$/, use: 'url-loader?limit=10000'},
			{test: /\.jpg$/, use: 'file-loader'},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			Promise: 'es6-promise'
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		extractSass
	],
	devServer: {
		contentBase: './sampleApp',
		hot: true,
		stats: {
			warnings: false
		},
	},
	node: {
		// workaround for webpack-dev-server issue
		// https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
		fs: 'empty',
		net: 'empty'
	}
};

const prod = {
	devtool: 'source-map',
	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	]
};

let webpackConfiguration = base;

if(IS_PROD) {
	webpackConfiguration = WebpackMerge(base, prod);
}

module.exports = webpackConfiguration;
