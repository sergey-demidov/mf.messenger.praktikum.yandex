const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
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
    // new StylelintWebpackPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    writeToDisk: true,
    hot: true,
    port: 9000,
  },
};
