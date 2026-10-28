export function usedEsm() {
  return 'usedEsm';
}

export function unusedEsm() {
  console.log('unusedEsm — should be dropped in production + minify');
  return 'unusedEsm';
}

export const SIDE_EFFECT_FLAG = 'esm';
