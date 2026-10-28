/**
 * 使用 Webpack Node API + Stats 输出模块依赖图
 */
const path = require('path');
const webpack = require('webpack');

const config = require('../webpack.config.js');

webpack(config, (err, stats) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  if (stats.hasErrors()) {
    console.error(stats.toString({ colors: true }));
    process.exit(1);
  }

  const info = stats.toJson({
    modules: true,
    reasons: true,
    chunks: true,
  });

  console.log('\n=== Modules ===');
  for (const m of info.modules || []) {
    if (!m.name || m.name.includes('node_modules')) continue;
    console.log(`\n- ${m.name} (id=${m.id}, size=${m.size})`);
    if (m.reasons && m.reasons.length) {
      for (const r of m.reasons) {
        console.log(
          `    ← ${r.moduleName || r.module || '(entry)'} [${r.type}] ${r.userRequest || ''}`
        );
      }
    }
  }

  // Mermaid 风格依赖图（便于贴进文档）
  console.log('\n=== Mermaid graph ===');
  console.log('```mermaid');
  console.log('graph LR');
  const seen = new Set();
  for (const m of info.modules || []) {
    if (!m.name || m.name.includes('node_modules')) continue;
    const short = m.name.replace(/^\.?\//, '');
    for (const r of m.reasons || []) {
      const from = (r.moduleName || 'entry').replace(/^\.?\//, '');
      if (from.includes('node_modules')) continue;
      const key = `${from}->${short}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  ${JSON.stringify(from)} --> ${JSON.stringify(short)}`);
    }
  }
  console.log('```');

  console.log('\n提示: 运行 node dist/bundle.js，应只看到一次 [shared.js] evaluated');
});
