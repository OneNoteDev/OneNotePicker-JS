var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "[name].css",
  allChunks: true
});

module.exports = {
  entry: {
    sample: './sampleApp/sample.tsx',
    pickerStyles: './src/oneNotePicker.scss',
    oneNotePicker: './src/oneNotePicker.tsx',
  },
  output: {
    path: outPath,
    publicPath: '/dist/',
    filename: '[name].js',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    // mainFields: ['main']
  },
  module: {
    loaders: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction
          ? 'awesome-typescript-loader?module=es6'
          : [
            'react-hot-loader',
            'awesome-typescript-loader'
          ]
      },
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
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
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.png$/, use: 'url-loader?limit=10000' },
      { test: /\.jpg$/, use: 'file-loader' },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'es6-promise'
    }),
    // new webpack.LoaderOptionsPlugin({
    //   options: {
    //     context: sourcePath,
    //     postcss: [
    //       require('postcss-import')({ addDependencyTo: webpack }),
    //       require('postcss-url')(),
    //       require('postcss-cssnext')(),
    //       require('postcss-reporter')(),
    //       require('postcss-browser-reporter')({ disabled: isProduction }),
    //     ]
    //   }
    // }),
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
