/**
 * 依次构建可在 CI/无浏览器环境下验证的实验（不含长时间挂起的 webpack serve）
 */
const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const webpackBin = path.join(root, 'node_modules/webpack/bin/webpack.js');

const jobs = [
  { name: '01-basic:dev', cwd: 'experiments/01-basic', cmd: `node "${webpackBin}" --mode=development` },
  { name: '01-basic:prod', cwd: 'experiments/01-basic', cmd: `node "${webpackBin}" --mode=production` },
  { name: '02-module-graph', cwd: 'experiments/02-module-graph', cmd: `node "${webpackBin}" --mode=development` },
  { name: '03-loader', cwd: 'experiments/03-loader', cmd: `node "${webpackBin}" --mode=development` },
  { name: '04-plugin', cwd: 'experiments/04-plugin', cmd: `node "${webpackBin}" --mode=development` },
  { name: '05-chunks', cwd: 'experiments/05-chunks', cmd: `node "${webpackBin}" --mode=development` },
  { name: '06-tree-shaking:dev', cwd: 'experiments/06-tree-shaking', cmd: `node "${webpackBin}" --mode=development` },
  { name: '06-tree-shaking:prod', cwd: 'experiments/06-tree-shaking', cmd: `node "${webpackBin}" --mode=production` },
  { name: '07-hmr:build', cwd: 'experiments/07-hmr', cmd: `node "${webpackBin}" --mode=development` },
];

const results = [];
for (const job of jobs) {
  process.stdout.write(`\n>>> ${job.name} … `);
  try {
    execSync(job.cmd, {
      cwd: path.join(root, job.cwd),
      stdio: 'pipe',
      env: process.env,
    });
    console.log('OK');
    results.push({ name: job.name, ok: true });
  } catch (e) {
    console.log('FAIL');
    console.error(e.stdout?.toString?.() || e.message);
    console.error(e.stderr?.toString?.() || '');
    results.push({ name: job.name, ok: false });
  }
}

console.log('\n=== Summary ===');
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}`);
const failed = results.filter((r) => !r.ok).length;
process.exit(failed ? 1 : 0);
