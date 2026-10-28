import { usedEsm } from './esm-lib.js';
import { usedCjs } from './cjs-lib.js';
// 故意不 import unusedEsm / unusedCjs
import './side-effect-mod.js';

console.log('=== Tree Shaking Lab ===');
console.log(usedEsm(), usedCjs());
