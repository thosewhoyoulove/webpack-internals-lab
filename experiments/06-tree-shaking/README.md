# 实验 06：Tree Shaking

## 1. 本实验要解决的问题

- 如何识别未使用导出？为何有时删不掉？
- ESM vs CommonJS 优化差异？
- `usedExports` / `sideEffects` / 压缩器各自做什么？

## 2. 运行命令

```bash
npm run build:06:dev
npm run build:06:prod
```

对比：

```bash
# 在 dist/development/bundle.js 搜索 unused
# 在 dist/production/bundle.js 搜索 unusedEsm / unusedCjs
rg -n "unusedEsm|unusedCjs|SIDE EFFECT|usedEsm" experiments/06-tree-shaking/dist -S
```

## 3. 预期现象

- development：常能看到 `/* unused harmony export unusedEsm */` 一类标记，但函数体可能仍在
- production + minimize：`unusedEsm` 更可能被删除；`unusedCjs` 更容易残留
- 控制台仍有 `[side-effect-mod] TOP-LEVEL SIDE EFFECT`（被 sideEffects 保留）

## 4. 观察哪些文件、日志、构建产物

- `dist/development/bundle.js` vs `dist/production/bundle.js`
- 本目录 `package.json` 的 `sideEffects` 字段

## 5. 背后的 Webpack 原理

**可验证**：标记 ≠ 删除；压缩器负责删；CJS 更难摇；sideEffects 影响模块级删除。

**官方机制**：Harmony export 分析 + `optimization.usedExports` + Terser + `sideEffects`。

**教学简化**：未演示 `/*#__PURE__*/`、包级复杂 sideEffects 数组边界情况。

## 6. 如何设置断点

对产物用 source-map（可临时打开）回源；或直接读标记注释。

## 7. 改动什么代码可以验证结论

- 把 `sideEffects` 设为 `false` 并去掉对 side-effect-mod 的 import，看顶层日志是否消失
- 给 CJS 改写成 ESM，再比 production 产物

## 8. 三个常见面试追问

1. 为什么说 Tree Shaking 依赖 ESM？
2. `sideEffects: false` 声明错误会怎样？
3. usedExports 和 minify 谁真正删代码？

## 9. 与真实 Webpack 实现的区别

未接入 Babel 把 ESM 转 CJS（那会破坏 shaking）；真实项目需保证对 library 的 ESM 路径。
