import { greet } from './greet.js';
import { add } from './math.js';

const msg = greet('Mini Webpack');
console.log(msg);
console.log('add(10, 20) =', add(10, 20));
