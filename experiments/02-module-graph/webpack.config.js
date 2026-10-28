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
  stats: {
    modules: true,
    reasons: true,
    moduleTrace: true,
  },
};
