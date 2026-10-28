import { sharedFn, sharedToken } from './shared.js';

console.log('[b.js] loading');
export function runB() {
  console.log(sharedFn('b'));
  return sharedToken;
}
