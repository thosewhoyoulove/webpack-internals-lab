/**
 * 真实计时：首次 / 再次构建，filesystem cache，不同 source-map
 * 在本机（或 box）跑，把结果写到 RESULTS.md —— 不虚构数字。
 */
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = __dirname;
const webpackBin = path.resolve(ROOT, '../../node_modules/webpack/bin/webpack.js');

function runOnce(label, env) {
  const start = performance.now();
  execSync(`node "${webpackBin}" --mode=development --config webpack.config.js`, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: 'pipe',
  });
  const ms = performance.now() - start;
  return { label, ms: Math.round(ms) };
}

function rmCache() {
  const cacheDir = path.join(ROOT, '.webpack-cache');
  const dist = path.join(ROOT, 'dist');
  fs.rmSync(cacheDir, { recursive: true, force: true });
  fs.rmSync(dist, { recursive: true, force: true });
}

const results = [];
const meta = {
  when: new Date().toISOString(),
  platform: `${os.platform()} ${os.release()}`,
  arch: os.arch(),
  node: process.version,
  cpus: os.cpus()[0] && os.cpus()[0].model,
  cpuCount: os.cpus().length,
};

console.log('Benchmark environment:', meta);
console.log('Running… (this may take a minute)\n');

// 1) no cache, cold
rmCache();
results.push(runOnce('no-cache cold (devtool=eval)', { LAB_CACHE: 'false', LAB_DEVTOOL: 'eval' }));
results.push(runOnce('no-cache warm-ish (devtool=eval)', { LAB_CACHE: 'false', LAB_DEVTOOL: 'eval' }));

// 2) filesystem cache
rmCache();
results.push(runOnce('fs-cache FIRST (devtool=eval)', { LAB_CACHE: 'fs', LAB_DEVTOOL: 'eval' }));
results.push(runOnce('fs-cache SECOND (devtool=eval)', { LAB_CACHE: 'fs', LAB_DEVTOOL: 'eval' }));

// 3) source-map modes with fs cache cleared between
rmCache();
results.push(runOnce('devtool=false (fs first)', { LAB_CACHE: 'fs', LAB_DEVTOOL: 'false' }));
rmCache();
results.push(runOnce('devtool=eval (fs first)', { LAB_CACHE: 'fs', LAB_DEVTOOL: 'eval' }));
rmCache();
results.push(runOnce('devtool=source-map (fs first)', { LAB_CACHE: 'fs', LAB_DEVTOOL: 'source-map' }));

console.log('\nResults (ms):');
for (const r of results) {
  console.log(`  ${r.ms}\t${r.label}`);
}

const md = `# 实验 08 性能测试结果（真实跑分）

> 生成时间：${meta.when}
> 环境：Node ${meta.node} · ${meta.platform} · ${meta.arch}
> CPU：${meta.cpus || 'unknown'} × ${meta.cpuCount}
>
> **这些数字只代表本次运行环境，换机器会不同。不要当作绝对性能结论。**

| 场景 | 耗时 (ms) |
|------|-----------|
${results.map((r) => `| ${r.label} | ${r.ms} |`).join('\n')}

## 如何解读

- **filesystem cache SECOND** 通常明显快于 FIRST：模块解析与转换结果命中磁盘缓存。
- **source-map** 通常慢于 **eval** / **false**：要生成独立 map 或更重的映射。
- 改 \`webpack.config.js\`、loader 选项、或依赖版本 → 缓存失效。
- 只改某个 \`src/*.js\` → 理想情况下只失效相关模块条目。

重新跑分：\`npm run bench\`（在本目录或根目录 \`npm run build:08\`）。
`;

fs.writeFileSync(path.join(ROOT, 'RESULTS.md'), md, 'utf-8');
console.log('\nWrote RESULTS.md');
