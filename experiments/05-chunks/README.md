# 实验 05：Chunk 与 Code Splitting

## 1. 本实验要解决的问题

- Module / Chunk / Bundle 分别是什么？
- 动态 `import()` 如何产生异步 Chunk？
- Runtime 如何加载异步 Chunk？`splitChunks` 有何效果？

## 2. 运行命令

```bash
npm run build:05
ls experiments/05-chunks/dist
```

用任意静态服务器打开 `dist/index.html`（或 `npx serve dist`）点击按钮观察 Network。

## 3. 预期现象

- `dist/` 出现多个 JS：主包、`heavy` chunk、`shared`、`runtime` 等
- 点击按钮后 Network 出现额外 chunk 请求（浏览器中验证）

## 4. 观察哪些文件、日志、构建产物

- `dist/*.js` 文件名与体积
- 构建 stats 中的 chunks 列表
- bundle 内 `__webpack_require__.e` / `ensure` 相关 runtime

## 5. 背后的 Webpack 原理

**可验证**：静态 import 进初始 chunk；动态 import 单独 chunk；shared 被 splitChunks 抽出。

**官方机制**：Chunk Graph；`SplitChunksPlugin`；JSONP / `import()` loading runtime。

**教学简化**：`minSize: 0` 仅为演示，生产勿照搬。

## 6. 如何设置断点

浏览器中在 `entry.js` 的 `import()` 后下断点；或在生成的 runtime 里搜 `ensure`。

## 7. 改动什么代码可以验证结论

- 去掉 `splitChunks`，看 shared 是否打进多个 chunk
- 去掉 `runtimeChunk`，看 runtime 是否内联进主包

## 8. 三个常见面试追问

1. Module Graph 与 Chunk Graph 的关系？
2. `prefetch` / `preload` magic comment 做什么？
3. 为何需要单独的 runtime chunk？

## 9. 与真实 Webpack 实现的区别

未覆盖 Module Federation、多 runtime 共存等高级场景。
