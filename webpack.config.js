const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const IS_PRODUCTION = JSON.parse(process.env.NODE_ENV || '0') === 'production';

module.exports = {
  devtool: 'source-map',
  entry: './client/index.js',
  output: {
    path: path.join(path.resolve('public'), 'assets'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  plugins:
    IS_PRODUCTION ? [
      new HtmlWebpackPlugin({
        template: './client/index.html',
        filename: 'index.html',
        inject: 'body',
      }),
      new FaviconsWebpackPlugin('./public/assets/favicon.png'),
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
      }),
    ] : [
      new HtmlWebpackPlugin({
        template: './client/index.html',
        filename: 'index.html',
        inject: 'body',
      }),
      new FaviconsWebpackPlugin('./public/assets/favicon.png'),
    ],
};
