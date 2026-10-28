const path = require('path');

module.exports = (env, argv) => {
  const mode = (argv && argv.mode) || 'production';
  return {
    context: __dirname,
    mode,
    entry: './src/entry.js',
    output: {
      path: path.resolve(__dirname, 'dist', mode),
      filename: 'bundle.js',
      clean: true,
    },
    devtool: false,
    optimization: {
      usedExports: true, // 标记未使用导出（development 也能在 bundle 里看到 /* unused harmony export */）
      minimize: mode === 'production', // 真正删除通常靠 Terser
      sideEffects: true, // 尊重 package.json sideEffects
    },
  };
};
