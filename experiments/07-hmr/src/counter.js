/**
 * 带本地状态的模块 —— 配合 module.hot.accept 可在热更新后保留状态。
 */
let count = 0;

export function getCount() {
  return count;
}

export function increment() {
  count += 1;
  return count;
}

export function render(el) {
  if (!el) return;
  el.textContent = `count = ${count} (edit counter.js or style.css to see HMR)`;
}

if (module.hot) {
  module.hot.dispose((data) => {
    // 卸载前把状态交给下一次模块
    data.count = count;
    console.log('[HMR] counter dispose, save count=', count);
  });
  module.hot.accept();
  if (module.hot.data && typeof module.hot.data.count === 'number') {
    count = module.hot.data.count;
    console.log('[HMR] counter restore count=', count);
  }
}
