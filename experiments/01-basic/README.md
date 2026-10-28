# 实验 01：最小 Webpack 构建

## 1. 本实验要解决的问题

- Webpack 为什么需要打包？与浏览器原生 ESM 有何不同？
- 从 `entry.js` 到 `dist/bundle.js` 发生了什么？
- Runtime、模块包装函数、模块缓存长什么样？

## 2. 运行命令

在仓库根目录（已 `npm install`）：

```bash
npm run build:01:dev
npm run build:01:prod
```

或在本目录：

```bash
npx webpack --mode=development
npx webpack --mode=production
node dist/bundle.js
```

**推荐 Node 18 或 20**（见根 `engines`）。Windows 请用 `--mode=`，不要写 `MODE=development`。

## 3. 预期现象

- `dist/bundle.js` 生成成功
- development 产物可读，含 `__webpack_require__`、模块函数
- production 产物被压缩，体积更小
- `node dist/bundle.js` 打印 `Hello Webpack Internals Lab` 与 `2 + 3 = 5`

## 4. 观察哪些文件、日志、构建产物

| 观察点 | 怎么找 |
|--------|--------|
| 入口模块 | 在 `bundle.js` 搜索 `Hello Webpack Internals Lab` |
| math 模块 | 搜索 `add called` 或 `PI` |
| 模块包装 | 搜索 `function(__unused_webpack_module, __webpack_exports__` 或 `__webpack_require__` |
| 模块缓存 | 搜索 `var __webpack_module_cache__` 与 `installedModules`（版本不同命名略异） |
| Runtime | 搜索 `__webpack_require__` 函数定义本体 |

dev / prod 分别构建后对比文件大小与可读性。

## 5. 背后的 Webpack 原理

**可验证现象**：多个源文件变成一个 IIFE/闭包里的模块表；`__webpack_require__` 先查缓存再执行工厂函数。

**官方机制**：Compiler 从 entry 解析依赖 → 构建 Module Graph → 封成 Chunk → 交给 Template 生成代码。

**教学简化**：本实验未开 `splitChunks` / 多入口；真实项目还有大量优化与 Runtime 变体。

## 6. 如何设置断点

1. 在 `src/entry.js`、`src/math.js` 打断点（配合 source map：dev 模式 `eval-source-map`）
2. 调试 Webpack 本身：`node --inspect-brk node_modules/webpack/bin/webpack.js --mode=development`
3. 在 Chrome `chrome://inspect` 连接后，可在 Webpack 源码的 `Compilation` / `NormalModule` 处下断点

## 7. 改动什么代码可以验证结论

- 在 `math.js` 顶层加 `console.log('math evaluated')`，运行 bundle，应只打印一次
- 把 `entry` 改成数组或对象多入口，观察 `output.filename` 是否需 `[name]`
- 关掉 `optimization.minimize`，对比 production 是否仍难读

## 8. 三个常见面试追问

1. 浏览器原生 ESM 已经能用，为什么还要 Webpack？
2. `__webpack_require__` 和 Node 的 `require` 有何异同？
3. development 与 production 的 `mode` 分别默认开了哪些优化？

## 9. 与真实 Webpack 实现的区别

本实验用默认 JS parser/generator，没有自定义 Loader/Plugin。真实构建常含 Babel、CSS、代码分割、持久化缓存等。
