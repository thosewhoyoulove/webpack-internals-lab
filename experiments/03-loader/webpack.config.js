const path = require('path');

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          // use 数组从右到左执行 normal；pitch 从左到右
          {
            loader: path.resolve(__dirname, 'loaders/logger-loader.js'),
            options: { name: 'A-after-md' },
          },
          {
            loader: path.resolve(__dirname, 'loaders/markdown-loader.js'),
          },
          {
            loader: path.resolve(__dirname, 'loaders/logger-loader.js'),
            options: { name: 'C-before-md' },
          },
        ],
      },
      {
        test: /message\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, 'loaders/logger-loader.js'),
            options: { name: 'msg-left' },
          },
          {
            loader: path.resolve(__dirname, 'loaders/string-replace-loader.js'),
            options: { from: 'LAB_PLACEHOLDER', to: 'REPLACED_BY_LOADER' },
          },
          {
            loader: path.resolve(__dirname, 'loaders/logger-loader.js'),
            options: { name: 'msg-right' },
          },
        ],
      },
    ],
  },
};
