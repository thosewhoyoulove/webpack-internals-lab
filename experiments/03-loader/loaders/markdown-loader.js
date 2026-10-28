/**
 * 简易 Markdown → HTML 字符串模块（异步演示）
 * 只做标题/粗体/换行，教学用，非完整 Markdown。
 */
module.exports = function markdownLoader(source) {
  const callback = this.async(); // 标记为异步 Loader
  console.log(`[markdown-loader] async start, resource=${this.resourcePath}`);
  console.log(`[markdown-loader] context: async=${typeof this.async}, resourceQuery=${this.resourceQuery}`);

  // 模拟异步 IO
  setImmediate(() => {
    let html = String(source)
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    const js = `export default ${JSON.stringify(html)};`;
    console.log(`[markdown-loader] async done, html length=${html.length}`);
    callback(null, js);
  });
};
