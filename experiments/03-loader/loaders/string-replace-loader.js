/**
 * 自定义字符串转换 Loader（同步）
 * 把 options.from 替换为 options.to
 */
module.exports = function stringReplaceLoader(source) {
  const options = this.getOptions ? this.getOptions() : {};
  const from = options.from || 'LAB_PLACEHOLDER';
  const to = options.to || 'REPLACED_BY_LOADER';
  console.log(`[string-replace-loader] resource=${this.resourcePath}`);
  console.log(`[string-replace-loader] input length=${source.length}, replace "${from}" → "${to}"`);
  const out = String(source).split(from).join(to);
  console.log(`[string-replace-loader] output length=${out.length}`);
  return out;
};
