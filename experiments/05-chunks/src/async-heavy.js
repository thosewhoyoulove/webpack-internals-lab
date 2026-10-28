import { sharedUtil } from './shared-lib.js';

export function heavyWork() {
  return 'async-heavy loaded + ' + sharedUtil();
}

console.log('[async-heavy] module evaluated (should be after click / dynamic import)');
