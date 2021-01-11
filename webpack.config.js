const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  // devtool: 'eval',
  devtool: 'inline-source-map',
  // mode: process.env.WEBPACK_MODE === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader', 'eslint-loader'],
        exclude: [/node_modules/, /static/, /tests/],
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './static/index.html',
    // }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './static/favicon.ico' },
        { from: './static/index.html' },
      ],
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
    }),
    // new StylelintWebpackPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    historyApiFallback: true,
    writeToDisk: true,
    hot: true,
    port: 9000,
  },
};
