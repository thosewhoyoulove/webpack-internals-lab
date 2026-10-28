# Webpack Internals Lab

可在本地运行、打断点、观察产物的 **Webpack 5 原理实验室**（不是普通配置教程）。

面向：有约 3 年经验、用过 Webpack/Vite，想搞清内部机制的前端工程师。

## 环境要求

| 项 | 要求 |
|----|------|
| Node.js | **>= 18**（`package.json` `engines`）；**推荐 18 或 20 LTS** |
| 包管理 | npm |
| OS | macOS / Linux / Windows 均可 |

> 若本机默认是 Node 14，请先用 nvm-windows / fnm / nvs 切换到 18+，再 `npm install`。  
> Webpack 5.x + webpack-dev-server 5.x 需要现代 Node。

```bash
node -v   # 应 >= v18
npm -v
```

## 快速开始

```bash
cd webpack-internals-lab
npm install

# 优先验证这两项
npm run build:01:dev
npm run mini:test

# 构建其余可自动化实验
npm run build:all

# 性能真实计时（会写 RESULTS.md）
npm run build:08

# HMR（需本机浏览器）
npm run dev:07
```

## 实验导航

| # | 目录 | 主题 | 根脚本 |
|---|------|------|--------|
| 01 | `experiments/01-basic` | 最小构建、Runtime、模块缓存 | `npm run build:01:dev` / `build:01:prod` |
| 02 | `experiments/02-module-graph` | Module Graph、Stats、shared 单次求值 | `npm run build:02` / `lab:02-graph` |
| 03 | `experiments/03-loader` | 自定义 Loader、pitch/normal、顺序 | `npm run build:03` |
| 04 | `experiments/04-plugin` | Tapable、Compiler/Compilation | `npm run build:04` |
| 05 | `experiments/05-chunks` | Code Splitting、splitChunks | `npm run build:05` |
| 06 | `experiments/06-tree-shaking` | usedExports、sideEffects、ESM/CJS | `npm run build:06:dev` / `build:06:prod` |
| 07 | `experiments/07-hmr` | dev-server、HMR | `npm run dev:07` |
| 08 | `experiments/08-performance` | filesystem cache、source-map 耗时 | `npm run build:08` |
| — | `mini-webpack/` | 手写教学 Bundler | `npm run mini:build` / `mini:test` |

每个实验目录内都有 `README.md`（问题 / 命令 / 现象 / 观察点 / 原理 / 断点 / 验证改动 / 面试追问 / 与真实实现区别）。

## 文档

- [docs/architecture.md](docs/architecture.md) — 14 个核心问题对照表  
- [docs/webpack-lifecycle.md](docs/webpack-lifecycle.md) — 编译生命周期  
- [docs/interview-questions.md](docs/interview-questions.md) — 面试追问索引  

## 建议学习路径：从 entry.js 到 bundle.js

1. 打开 `experiments/01-basic/src/entry.js` 与 `math.js`  
2. 运行 `npm run build:01:dev`，打开 `experiments/01-basic/dist/bundle.js`  
3. 搜索：`Hello Webpack Internals Lab`、`__webpack_require__`、`__webpack_module_cache__`  
4. 用 Mini Webpack 对照同一思想：`npm run mini:build:debug`  
5. 再进入实验 02 看依赖图与缓存  

详细断点位置见各实验 README；根目录完成安装后可由助手按阶段带练。

## npm scripts 一览

```
build:01 / build:01:dev / build:01:prod
build:02 / lab:02-graph
build:03  build:04  build:05
build:06 / build:06:dev / build:06:prod
dev:07
build:08
build:all
mini:build / mini:build:debug / mini:circular / mini:test / mini:inspect
```

## 验证说明

- 构建类实验与 Mini Webpack 测试应在 `npm install` 后于本机或 CI 跑通。  
- **实验 07 的浏览器 HMR / WebSocket**：请在本机浏览器验证；无头或远程环境可能只验证了 `webpack` 编译，**不会假装已验证 HMR**。  
- **实验 08**：`RESULTS.md` 必须来自真实 `bench.js` 跑分，换机器数字会变。

## 许可证

MIT
