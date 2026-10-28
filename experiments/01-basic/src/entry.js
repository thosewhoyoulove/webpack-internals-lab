/**
 * 入口文件 —— Webpack 从这里开始递归解析依赖。
 * 构建后在 dist/bundle.js 里搜索本文件路径或 "Hello Webpack Internals Lab"。
 */
import { add, PI } from './math.js';

const result = add(2, 3);
console.log('Hello Webpack Internals Lab');
console.log('2 + 3 =', result);
console.log('PI =', PI);

// 浏览器页面展示
if (typeof document !== 'undefined') {
  const el = document.getElementById('app');
  if (el) {
    el.textContent = `2 + 3 = ${result}, PI = ${PI}`;
  }
}
