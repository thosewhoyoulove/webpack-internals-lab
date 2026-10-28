/**
 * 带副作用的模块：即使没人 import 其导出，顶层代码也会跑。
 * package.json sideEffects 可告知打包器「哪些文件无副作用」。
 */
console.log('[side-effect-mod] TOP-LEVEL SIDE EFFECT');
export function maybeUsed() {
  return 1;
}
