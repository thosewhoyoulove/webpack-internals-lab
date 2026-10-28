import { add } from './math.js';

export function greet(name) {
  const n = add(1, 1);
  return `Hello, ${name}! (1+1=${n})`;
}
