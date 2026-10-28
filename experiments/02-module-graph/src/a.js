import { sharedFn, sharedToken } from './shared.js';

console.log('[a.js] loading');
export function runA() {
  console.log(sharedFn('a'));
  return sharedToken;
}
