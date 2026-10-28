import { sharedUtil } from './shared-lib.js';
export function syncHello() {
  return 'sync: ' + sharedUtil();
}
