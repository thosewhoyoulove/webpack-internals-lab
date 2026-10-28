const path = require('path');

/**
 * 实验 01：最小 Webpack 构建
 * 使用: webpack --mode=development|production
 * （避免 MODE= 环境变量，Windows cmd 不兼容）
 */
module.exports = (env, argv) => {
  const mode = (argv && argv.mode) || 'development';

  return {
    context: __dirname,
    mode,
    entry: './src/entry.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true,
    },
    // development 保留可读代码；production 会压缩
    devtool: mode === 'development' ? 'eval-source-map' : false,
    optimization: {
      runtimeChunk: false,
      minimize: mode === 'production',
    },
    stats: {
      modules: true,
      reasons: true,
    },
  };
};
