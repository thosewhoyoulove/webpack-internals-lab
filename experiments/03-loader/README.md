# 实验 03：Loader 原理

## 1. 本实验要解决的问题

- Loader 如何把非 JS / 需转换的资源变成模块？
- 为什么配置里 `use: [A,B,C]` 的 **normal** 执行顺序是 **C→B→A**？
- pitch 阶段是什么？同步 / 异步 Loader 有何不同？

## 2. 运行命令

```bash
npm run build:03
```

仔细看构建时的控制台日志（pitch / normal / async）。

## 3. 预期现象

- 先看到若干 `[logger:*:pitch]`，再看到 normal / markdown async
- `message.js` 中 `LAB_PLACEHOLDER` 变成 `REPLACED_BY_LOADER`
- `note.md` 变成导出 HTML 字符串的 JS 模块

## 4. 观察哪些文件、日志、构建产物

- 终端 Loader 日志顺序
- `dist/bundle.js` 搜索 `REPLACED_BY_LOADER`、`loader:msg`
- `loaders/*.js` 源码中的 `this.async`、`pitch`

## 5. 背后的 Webpack 原理

**可验证**：pitch 左→右，normal 右→左；异步 Loader 用 `this.async()`。

**官方机制**：Loader runner 组成请求字符串；结果进入模块图。

**教学简化**：Markdown Loader 非完整实现；未演示 `pitch` 短路返回。

## 6. 如何设置断点

在三个自定义 loader 文件里下断点，用：

```bash
node --inspect-brk ../../node_modules/webpack/bin/webpack.js --mode=development
```

## 7. 改动什么代码可以验证结论

- 调换 `use` 数组顺序，观察日志变化
- 在某个 `pitch` 里 `return 'export default 1'`，观察是否跳过后续

## 8. 三个常见面试追问

1. 为何 Loader 默认从右到左？
2. pitch 短路的典型用例？
3. Loader 与 Plugin 职责边界？

## 9. 与真实 Webpack 实现的区别

未实现 caching / 可组合的官方 markdown 生态；生产应用请用成熟 Loader。
