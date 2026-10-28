/**
 * Mini Webpack 自动化测试（纯 Node，无测试框架）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { bundle } = require('../src/bundler');

const ROOT = path.join(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
}

function runBundleInNode(code) {
  const tmp = path.join(__dirname, '_tmp_bundle.js');
  // wrap to capture console.log
  const wrapped = `
    const __logs = [];
    const __orig = console.log;
    console.log = (...args) => { __logs.push(args.map(String).join(' ')); __orig(...args); };
    ${code}
    console.log = __orig;
    if (typeof module !== 'undefined') module.exports = __logs;
  `;
  fs.writeFileSync(tmp, wrapped, 'utf-8');
  try {
    delete require.cache[require.resolve(tmp)];
    return require(tmp);
  } finally {
    try { fs.unlinkSync(tmp); } catch (_) {}
  }
}

console.log('\n=== Mini Webpack Tests ===\n');

// Test 1: basic bundle builds
console.log('1. basic example builds and runs');
{
  const entry = path.join(ROOT, 'examples/basic/entry.js');
  const out = path.join(ROOT, 'examples/basic/dist/bundle.js');
  const { code, graph } = bundle(entry, { output: out, debug: false });
  assert(fs.existsSync(out), 'bundle.js written');
  assert(graph.modules.length === 3, `3 modules (got ${graph.modules.length})`);
  assert(code.includes('__require'), 'contains __require');
  assert(code.includes('cache'), 'contains module cache');
  const logs = runBundleInNode(code);
  assert(
    logs.some((l) => l.includes('Hello, Mini Webpack')),
    'greet output present'
  );
  assert(
    logs.some((l) => l.includes('add(10, 20) = 30')),
    'add output present'
  );
}

// Test 2: dependency graph ids
console.log('\n2. dependency graph structure');
{
  const entry = path.join(ROOT, 'examples/basic/entry.js');
  const { graph } = bundle(entry, { debug: false });
  const byPath = {};
  for (const m of graph.modules) {
    byPath[path.basename(m.absolutePath)] = m;
  }
  assert(byPath['entry.js'] && byPath['greet.js'] && byPath['math.js'], 'all files present');
  assert(
    Object.values(byPath['entry.js'].depIdMap).length === 2,
    'entry has 2 deps'
  );
}

// Test 3: module cache — shared module evaluated once
console.log('\n3. module cache (shared math evaluated once)');
{
  // Create a counter module scenario via inline temp files
  const tmpDir = path.join(__dirname, '_cache_fixture');
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(
    path.join(tmpDir, 'shared.js'),
    `console.log('SHARED_EVAL'); export const x = 1;\n`
  );
  fs.writeFileSync(
    path.join(tmpDir, 'a.js'),
    `import { x } from './shared.js'; export const a = x;\n`
  );
  fs.writeFileSync(
    path.join(tmpDir, 'b.js'),
    `import { x } from './shared.js'; export const b = x;\n`
  );
  fs.writeFileSync(
    path.join(tmpDir, 'entry.js'),
    `import { a } from './a.js'; import { b } from './b.js'; console.log('a+b', a + b);\n`
  );
  const { code } = bundle(path.join(tmpDir, 'entry.js'), { debug: false });
  const logs = runBundleInNode(code);
  const evalCount = logs.filter((l) => l.includes('SHARED_EVAL')).length;
  assert(evalCount === 1, `shared evaluated once (got ${evalCount})`);
  // cleanup
  for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f));
  fs.rmdirSync(tmpDir);
}

// Test 4: circular dependency does not crash (may log undefined)
console.log('\n4. circular dependency does not throw');
{
  const entry = path.join(ROOT, 'examples/circular/entry.js');
  let threw = false;
  let logs = [];
  try {
    const { code } = bundle(entry, {
      output: path.join(ROOT, 'examples/circular/dist/bundle.js'),
      debug: false,
    });
    logs = runBundleInNode(code);
  } catch (e) {
    threw = true;
    console.error(e);
  }
  assert(!threw, 'circular build+run did not throw');
  assert(logs.length > 0, 'produced some logs');
}

// Test 5: debug mode does not break
console.log('\n5. debug mode');
{
  const entry = path.join(ROOT, 'examples/basic/entry.js');
  const { code } = bundle(entry, { debug: true });
  assert(code.length > 100, 'debug still produces bundle');
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);
