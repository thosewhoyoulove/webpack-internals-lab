/**
 * 静态 import → 进入主 Chunk
 * 动态 import() → 额外异步 Chunk，Runtime 用 JSONP/importScripts 加载
 */
import { syncHello } from './sync-mod.js';

console.log('=== Chunks Lab ===');
console.log(syncHello());

async function loadHeavy() {
  // webpackChunkName 方便在 dist 文件名里辨认
  const mod = await import(
    /* webpackChunkName: "heavy" */ './async-heavy.js'
  );
  console.log(mod.heavyWork());
  if (typeof document !== 'undefined') {
    const el = document.getElementById('result');
    if (el) el.textContent = mod.heavyWork();
  }
}

if (typeof document !== 'undefined') {
  const btn = document.getElementById('load');
  if (btn) btn.addEventListener('click', loadHeavy);
} else {
  // Node 下直接触发，便于验证构建产物可执行
  loadHeavy();
}

export { loadHeavy };
