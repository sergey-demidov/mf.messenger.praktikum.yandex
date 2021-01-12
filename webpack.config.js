const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  devtool: 'source-map',
  mode: 'development',
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
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './static/favicon.ico' },
        { from: './static/index.html' },
      ],
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   test: [/\.js$/, /\.jsx$/],
    //   exclude: 'vendor',
    //   filename: 'app.[hash].js.map',
    //   append: '//# sourceMappingURL=[url]',
    //   moduleFilenameTemplate: '[resource-path]',
    //   fallbackModuleFilenameTemplate: '[resource-path]',
    // }),
  ],
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    // writeToDisk: true,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 500,
    },
    historyApiFallback: true,
    hot: true,
    port: 9000,
  },
};
