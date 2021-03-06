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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new FaviconsWebpackPlugin('./public/assets/favicon.png'),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
}
