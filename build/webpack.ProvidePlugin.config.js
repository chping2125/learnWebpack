const path = require('path');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    ProvidePlugin: path.resolve(__dirname, '../src/ProvidePlugin/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    filename: '[name].[chunkhash].js',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      utilsTest: path.resolve(__dirname, '../src/ProvidePlugin/utilsTest')
    }
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
    new webpack.ProvidePlugin({
      utils: 'utilsTest'
    }),
    new HTMLPlugin(
      {
        template: 'src/externals/index.html'
      }
    )
  ]
};
