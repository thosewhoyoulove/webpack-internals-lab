/**
 * 依赖关系：
 *   entry → a → shared
 *   entry → b → shared
 * shared 只应被求值一次（模块缓存）。
 */
import { runA } from './a.js';
import { runB } from './b.js';

console.log('=== Module Graph Lab ===');
const ta = runA();
const tb = runB();
console.log('tokens equal?', ta === tb, ta, tb);
