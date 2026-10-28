import { message } from './message.js';
import html from './note.md';

console.log('=== Loader Lab ===');
console.log('message:', message);
console.log('markdown html:', html);

if (typeof document !== 'undefined') {
  const el = document.getElementById('app');
  if (el) el.innerHTML = `<p>${message}</p>${html}`;
}
