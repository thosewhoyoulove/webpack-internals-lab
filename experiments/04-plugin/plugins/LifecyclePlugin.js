/**
 * 教学 Plugin：打印生命周期、统计 module/chunk、在 processAssets 写出报告文件
 *
 * Compiler  = 长期存活的构建「机器」（一次 webpack() 一个）
 * Compilation = 一次编译过程的「上下文」（watch 模式下会多次创建）
 *
 * 使用 Webpack 5 Compilation.PROCESS_ASSETS_STAGE_* ，避免已废弃的 emit 钩子写法。
 */
const { Compilation } = require('webpack');

class LifecyclePlugin {
  constructor(options = {}) {
    this.name = options.name || 'LifecyclePlugin';
  }

  apply(compiler) {
    const tag = this.name;
    const order = [];
    const log = (hook, extra = '') => {
      const line = `${hook}${extra ? ' ' + extra : ''}`;
      order.push(line);
      console.log(`[${tag}] ${line}`);
    };

    // —— Compiler 级 hooks ——
    compiler.hooks.environment.tap(tag, () => log('compiler.environment'));
    compiler.hooks.afterEnvironment.tap(tag, () => log('compiler.afterEnvironment'));
    compiler.hooks.entryOption.tap(tag, (context, entry) => {
      log('compiler.entryOption', `context=${context}`);
      // BailHook: 返回 truthy 会中断；此处不 return
    });
    compiler.hooks.afterPlugins.tap(tag, () => log('compiler.afterPlugins'));
    compiler.hooks.compile.tap(tag, () => log('compiler.compile'));

    // thisCompilation：每次新 Compilation 创建时同步触发（推荐挂 Compilation hooks）
    compiler.hooks.thisCompilation.tap(tag, (compilation) => {
      log('compiler.thisCompilation');

      compilation.hooks.buildModule.tap(tag, (module) => {
        // 太吵，只记次数
        compilation.__labModuleBuildCount =
          (compilation.__labModuleBuildCount || 0) + 1;
      });

      compilation.hooks.succeedModule.tap(tag, () => {
        compilation.__labModuleSucceedCount =
          (compilation.__labModuleSucceedCount || 0) + 1;
      });

      compilation.hooks.finishModules.tap(tag, (modules) => {
        const arr = Array.from(modules);
        log(
          'compilation.finishModules',
          `count=${arr.length}, built=${compilation.__labModuleBuildCount || 0}`
        );
      });

      compilation.hooks.seal.tap(tag, () => log('compilation.seal'));

      compilation.hooks.afterOptimizeChunks.tap(tag, (chunks) => {
        log('compilation.afterOptimizeChunks', `chunks=${chunks.size}`);
      });

      // Webpack 5 推荐：processAssets 生成自定义文件（替代已不推荐的随意改 assets）
      compilation.hooks.processAssets.tap(
        {
          name: tag,
          stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        (assets) => {
          const moduleCount = compilation.modules.size;
          const chunkCount = compilation.chunks.size;
          const assetNames = Object.keys(assets);

          log(
            'compilation.processAssets',
            `modules=${moduleCount} chunks=${chunkCount} assets=${assetNames.length}`
          );

          const report = {
            plugin: tag,
            modules: moduleCount,
            chunks: chunkCount,
            assets: assetNames.concat(['lab-lifecycle-report.json']),
            hookOrder: order.slice(), // 此时尚未到 emit/done；done 时会再打印完整顺序
            note:
              'Compiler 长期存在；Compilation 代表本轮编译。本文件在 processAssets 阶段写入。',
          };

          compilation.emitAsset(
            'lab-lifecycle-report.json',
            new compiler.webpack.sources.RawSource(JSON.stringify(report, null, 2))
          );
        }
      );
    });

    // 异步 hook 示例：tapAsync
    compiler.hooks.make.tapAsync(tag, (compilation, callback) => {
      log('compiler.make (tapAsync)');
      setImmediate(callback);
    });

    // Promise hook 示例：tapPromise
    compiler.hooks.emit.tapPromise(tag, async () => {
      log('compiler.emit (tapPromise)');
    });

    compiler.hooks.done.tap(tag, () => {
      log('compiler.done');
      console.log(`\n[${tag}] Hook 触发顺序（完整）:`);
      order.forEach((h, i) => console.log(`  ${i + 1}. ${h}`));
    });
  }
}

module.exports = LifecyclePlugin;
