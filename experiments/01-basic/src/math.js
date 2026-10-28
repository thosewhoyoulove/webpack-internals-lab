/**
 * 简单数学模块 —— 观察它如何被包装进 bundle 的模块函数里。
 */
console.log('math evaluated')
export function add(a, b) {
  console.log('[math] add called', a, b);
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;
