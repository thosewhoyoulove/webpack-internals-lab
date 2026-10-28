# 实验 02：Module Graph

## 1. 本实验要解决的问题

- Webpack 如何递归解析依赖并构建 Module Graph？
- 为什么 `shared.js` 不会被执行两次？
- Stats API 能看到哪些模块信息？

## 2. 运行命令

```bash
npm run build:02
npm run lab:02-graph
# 或
cd experiments/02-module-graph && npx webpack --mode=development && node dist/bundle.js && npm run graph
```

## 3. 预期现象

- 构建日志里能看到 `a.js` / `b.js` / `shared.js`
- `node dist/bundle.js` 只打印一次 `[shared.js] evaluated, count = 1`
- `npm run graph` 输出模块 reasons 与 Mermaid 图

## 4. 观察哪些文件、日志、构建产物

- 控制台：`[shared.js] evaluated` 次数
- `scripts/print-graph.js` 的 Stats 输出
- `dist/bundle.js` 中 shared 模块只出现一份工厂函数

## 5. 背后的 Webpack 原理

**可验证**：同一模块路径只求值一次；entry→a/b→shared 的钻石依赖。

**官方机制**：`Compilation` 维护模块图；`Dependencies` 描述边；`ModuleGraph`（Webpack 5）连接模块与导出使用信息。

**教学简化**：脚本打印的 Mermaid 来自 Stats reasons，不是完整 ModuleGraph API dump。

## 6. 如何设置断点

- 源码：`shared.js` 顶层
- Webpack：`node --inspect-brk` 跑 `scripts/print-graph.js`，在 callback 里查看 `stats.toJson()`

## 7. 改动什么代码可以验证结论

- 再增加 `c.js` 依赖 `shared.js`，确认仍求值一次
- 去掉对 `shared` 的 import，图中边消失

## 8. 三个常见面试追问

1. Module Graph 和 Chunk Graph 区别？
2. 循环依赖时模块缓存如何表现？
3. `reasons` 字段对分析包体积有何帮助？

## 9. 与真实 Webpack 实现的区别

未展示 Harmony 导出分析、`ModuleGraph.getExportsInfo` 等高级 API；Stats 是构建后快照。
