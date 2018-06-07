const webpack = require('webpack');
const path = require('path');

// variables
const IS_PROD_MIN = process.env.NODE_ENV === "minify";
const IS_PROD = process.env.NODE_ENV === "production" || IS_PROD_MIN;

const IS_ANALYZE = process.env.NODE_ENV === "analyze";
const OUT_DIR = path.join(__dirname, './dist');

// plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackMerge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DtsBundlePlugin = require('./dtsBundlePlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ENTRYPOINTS = {
	OneNotePicker: `exports/oneNotePicker.index`,
	OneNoteApiDataProvider: `exports/oneNoteApiDataProvider.index`,
	OneNoteItemUtils: `exports/oneNoteItemUtils.index`,
}

function generateWebpackEntries() {
	const entries = {};

	for(const key of Object.keys(ENTRYPOINTS)) {
		entries[key] = `${path.resolve(__dirname)}/${ENTRYPOINTS[key]}`;
	}

	return entries;
}

function generateDtsBundlePlugins() {
	const entries = [];

	for(const key of Object.keys(ENTRYPOINTS)) {
		const plugin = new DtsBundlePlugin({
			name: key,
			main: `${path.resolve(__dirname)}/dist/types/${ENTRYPOINTS[key]}.d.ts`,
			out: `${path.resolve(__dirname)}/dist/${key}.d.ts`,
			removeSource: false,
			outputAsModuleFolder: true,
			emitOnIncludedFileNotFound: true,
			headerText: `TypeScript Definition for ${key}`
		});

		entries.push(plugin)
	}

	return entries;
}

const base = {
	entry: generateWebpackEntries(),
	output: {
		path: OUT_DIR,
		publicPath: '/dist/',
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
				test: /\.sass$/,
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
			filename: '[name].css',
		})
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
	devtool: 'source-map',
	mode: 'production',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		...generateDtsBundlePlugins()
	],
	externals: {
		'react': { root: 'React', amd: 'react', commonjs2: 'react', commonjs: 'react' },
		'react-dom': { root: 'ReactDOM', amd: 'react-dom', commonjs2: 'react-dom', commonjs: 'react-dom' }
	}
};

const prodMinified = {
	output: {
		filename: '[name].min.js'
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true // set to true if you want JS source maps
			}),
			new OptimizeCSSAssetsPlugin({})
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].min.css',
		}),
	]
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

if (IS_PROD_MIN) {
	webpackConfiguration = WebpackMerge(webpackConfiguration, prodMinified);
}

if (IS_ANALYZE) {
	webpackConfiguration = WebpackMerge(webpackConfiguration, prod);
	webpackConfiguration = WebpackMerge(webpackConfiguration, analyze);
}

module.exports = webpackConfiguration;

