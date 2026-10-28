const path = require('path');

/**
 * 通过环境变量切换（Node 脚本传入，避免 Windows cmd 的 VAR= 语法）：
 *   LAB_CACHE=fs|false
 *   LAB_DEVTOOL=eval|source-map|false
 */
module.exports = (env, argv) => {
  const mode = (argv && argv.mode) || 'development';
  const useFsCache = process.env.LAB_CACHE === 'fs';
  const devtoolEnv = process.env.LAB_DEVTOOL; // 'eval' | 'source-map' | 'false'
  let devtool = false;
  if (devtoolEnv === 'eval') devtool = 'eval';
  else if (devtoolEnv === 'source-map') devtool = 'source-map';
  else if (devtoolEnv === 'false' || devtoolEnv === '') devtool = false;
  else devtool = mode === 'development' ? 'eval' : false;

  return {
    context: __dirname,
    mode,
    entry: './src/entry.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true,
    },
    devtool,
    cache: useFsCache
      ? {
          type: 'filesystem',
          cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
        }
      : false,
    infrastructureLogging: {
      level: 'warn',
    },
    stats: 'errors-warnings',
  };
};
