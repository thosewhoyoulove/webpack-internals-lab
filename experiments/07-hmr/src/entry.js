import './style.css';
import { increment, render, getCount } from './counter.js';

const app = document.getElementById('app');
const status = document.getElementById('status');

function paint() {
  render(app);
  if (status) {
    status.textContent = `last paint @ ${new Date().toLocaleTimeString()} | count=${getCount()}`;
  }
}

document.getElementById('inc').addEventListener('click', () => {
  increment();
  paint();
});

paint();
console.log('[entry] boot');

if (module.hot) {
  // 接受 counter 更新；样式通常由 style-loader 自己 accept
  module.hot.accept('./counter.js', () => {
    console.log('[HMR] entry accepted counter.js update');
    paint();
  });
}
