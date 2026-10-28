/**
 * 展示执行顺序与 pitch / normal 阶段的 Loader
 *
 * Webpack Loader 管道：
 *  1) 从左到右执行 pitch（若 pitch 返回值则短路）
 *  2) 读文件
 *  3) 从右到左执行 normal
 *
 * 配置 use: [A, B, C] 时 normal 顺序是 C → B → A。
 */
function loggerLoader(source) {
  const name = (this.getOptions && this.getOptions().name) || 'logger';
  console.log(`[logger:${name}:normal] IN  len=${String(source).length}`);
  console.log(`[logger:${name}:normal] resource=${this.resourcePath}`);
  // 在输出前加注释标记，方便在产物里搜索
  const tagged = `/* loader:${name}:normal */\n` + source;
  console.log(`[logger:${name}:normal] OUT len=${tagged.length}`);
  return tagged;
}

loggerLoader.pitch = function pitch(remainingRequest, precedingRequest, data) {
  const name = (this.getOptions && this.getOptions().name) || 'logger';
  console.log(
    `[logger:${name}:pitch] remaining=${remainingRequest.slice(0, 80)}...`
  );
  console.log(`[logger:${name}:pitch] preceding=${precedingRequest || '(none)'}`);
  // 不 return → 继续后续 pitch / 读文件 / normal
};

module.exports = loggerLoader;
