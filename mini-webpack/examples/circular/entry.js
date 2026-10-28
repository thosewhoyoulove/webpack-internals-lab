/**
 * 循环依赖实验：entry → a → b → a
 * 教学版用部分 exports 对象，可能得到 undefined（与真实 ESM TDZ / Webpack 行为不同）。
 */
import { aValue } from './a.js';
import { bValue } from './b.js';

console.log('result: aValue=', aValue, 'bValue=', bValue);
