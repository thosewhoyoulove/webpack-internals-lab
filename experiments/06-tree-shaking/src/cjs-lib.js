/** CommonJS：Webpack 默认更难做可靠的 tree-shaking */
exports.usedCjs = function usedCjs() {
  return 'usedCjs';
};
exports.unusedCjs = function unusedCjs() {
  console.log('unusedCjs — often kept because CJS exports are dynamic');
  return 'unusedCjs';
};
