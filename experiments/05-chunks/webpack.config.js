const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    clean: true,
    // 浏览器里动态 import 需要 publicPath
    publicPath: 'auto',
  },
  devtool: false,
  optimization: {
    // 演示 splitChunks：把被多 chunk 共享的模块抽到单独 chunk
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        shared: {
          test: /shared-lib\.js$/,
          name: 'shared',
          enforce: true,
        },
      },
    },
    runtimeChunk: 'single',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],
  stats: {
    chunks: true,
    modules: true,
    chunkModules: true,
  },
};
