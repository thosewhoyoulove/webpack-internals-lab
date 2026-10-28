# Mini Webpack（教学版 Bundler）

用约三百行核心代码演示：入口 → AST → 依赖图 → 模块函数 → `__require` + 缓存 → `bundle.js`。

## 运行

在仓库根目录（已安装依赖）：

```bash
npm run mini:build
npm run mini:build:debug
npm run mini:circular
npm run mini:test
npm run mini:inspect   # node --inspect-brk，用 chrome://inspect 连接
```

运行产物：

```bash
node mini-webpack/examples/basic/dist/bundle.js
```

## 核心步骤（对照 `src/bundler.js`）

1. `bundle(entry)` 接收入口
2. `parseFile` 读文件 + `@babel/parser`
3. `collectDependencies` 识别静态 `import`
4. `createModule` 解析真实路径并递归
5. `transformEsmToCjs` 把 ESM 改成 `exports` / `__require(id)`
6. `generateBundle` 输出带 `cache` 的 IIFE
7. Node 执行验证（见 `tests/run.js`）

## Debug 模式

`--debug` 会打印：AST 摘要、每模块依赖、模块表、bundle 预览。

## 循环依赖

`examples/circular`：教学实现用「先放空 `exports` 再执行」策略，可能读到 `undefined`。  
这与完整 ESM 的 TDZ / 真实 Webpack 的和谐导出绑定并不完全相同——见下方「不支持」。

## 与真实 Webpack 的区别 / 不支持的能力

| 能力 | Mini | Webpack 5 |
|------|------|-----------|
| 静态 ESM import/export | 部分 | 完整 |
| 动态 `import()` | ❌ | ✅ |
| Loader / Plugin | ❌ | ✅ |
| CSS/图片等资源 | ❌ | ✅ |
| Tree Shaking / SplitChunks | ❌ | ✅ |
| Source Map | ❌ | ✅ |
| 完整循环依赖语义 | 弱 | 更完整 |
| HMR / 持久缓存 | ❌ | ✅ |
| re-export (`export ... from`) | ❌ 显式报错 | ✅ |

## 断点建议

```bash
npm run mini:inspect
```

在 `createModule`、`transformEsmToCjs`、`__require` 生成模板处下断点。
