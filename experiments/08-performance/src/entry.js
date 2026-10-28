import { a } from './mod-a.js';
import { b } from './mod-b.js';
import { c } from './mod-c.js';

console.log('perf', a().length, b().length, c().length);
