const path = require('path');
const LifecyclePlugin = require('./plugins/LifecyclePlugin');

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
  plugins: [new LifecyclePlugin({ name: 'LabLifecycle' })],
};
