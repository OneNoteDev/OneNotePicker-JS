const webpack = require('webpack');
const path = require('path');

// variables
const IS_PROD = process.env.NODE_ENV === "production";

const IS_ANALYZE = process.env.NODE_ENV === "analyze";
const OUT_DIR = path.join(__dirname, './dist');

// plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackMerge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

const base = {
	entry: {
		index: './src/index.ts'
	},
	output: {
		path: OUT_DIR,
		filename: '[name].js',
		library: 'OneNotePicker',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	target: 'web',
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	devtool: 'cheap-module-eval-source-map',
	module: {
		rules: [
			// .ts, .tsx
			{
				test: /\.tsx?$/,
				use: IS_PROD ? 'ts-loader' : ['react-hot-loader', 'ts-loader']
			},
			{
				test: /\.css/,
				use: [
					!IS_PROD ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { importLoaders: 1 }
					},
					'postcss-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					!IS_PROD ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { importLoaders: 1 }
					},
					'postcss-loader',
					'sass-loader',
				]
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
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new CopyWebpackPlugin([{
			// The js files compiled by tsc reference images in this folder and expect it in the output path
			from: path.resolve(__dirname, './src/images'),
			to: './images/[name].[ext]',
			toType: 'template'
		}]),
	],
	devServer: {
		contentBase: path.join(__dirname, './sampleApp'),
		publicPath: '../dist/',
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
	mode: 'none',
	plugins: [
	],
	externals: {
		'react': { root: 'React', amd: 'react', commonjs2: 'react', commonjs: 'react' },
		'react-dom': { root: 'ReactDOM', amd: 'react-dom', commonjs2: 'react-dom', commonjs: 'react-dom' }
	}
};

const analyze = {
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: 'static'
		})
	]
};

let webpackConfiguration = base;

if (IS_PROD) {
	webpackConfiguration = WebpackMerge(webpackConfiguration, prod);
}

if (IS_ANALYZE) {
	webpackConfiguration = WebpackMerge(webpackConfiguration, prod);
	webpackConfiguration = WebpackMerge(webpackConfiguration, analyze);
}

module.exports = webpackConfiguration;

