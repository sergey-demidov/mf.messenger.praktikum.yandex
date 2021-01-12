const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  devtool: false,
  mode: 'production',

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
  ],
};
