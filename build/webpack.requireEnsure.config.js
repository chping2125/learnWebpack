const path = require('path');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    requireEnsure: path.resolve(__dirname, '../src/requireEnsure/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    filename: '[name].[chunkhash].js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HTMLPlugin(
      {
        template: 'src/requireEnsure/index.html'
      }
    )
  ]
};
