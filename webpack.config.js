const path = require('path')
const webpack = require('webpack')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

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
  plugins: [
    new FaviconsWebpackPlugin('./public/assets/favicon.png'),
  ],
}
