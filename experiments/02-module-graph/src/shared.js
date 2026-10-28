let evalCount = 0;
evalCount += 1;
console.log('[shared.js] evaluated, count =', evalCount);

export function sharedFn(from) {
  return `sharedFn called from ${from}, evalCount=${evalCount}`;
}

export const sharedToken = 'SHARED_TOKEN';
