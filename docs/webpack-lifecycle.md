# Webpack 编译生命周期（对照实验 04）

## Compiler vs Compilation

| | Compiler | Compilation |
|--|----------|-------------|
| 寿命 | 一次 `webpack()` / watch 进程内长期存在 | 每次编译新建 |
| 职责 | 配置、插件注册、文件系统、产出写入 | 模块构建、优化、生成 chunk/asset |
| 典型 hooks | `environment`, `make`, `emit`, `done` | `buildModule`, `seal`, `processAssets` |

## 简化顺序（development 单次构建）

1. `environment` / `afterEnvironment`
2. `entryOption` / `afterPlugins` / `afterResolvers`
3. `initialize`
4. `beforeRun` / `run`
5. `compile` → 创建 Compilation
6. `thisCompilation` / `compilation`
7. `make`（工厂创建入口模块并递归依赖）
8. `finishMake`
9. Compilation: `finishModules` → `seal` → 优化（含 chunks）→ `processAssets`（多 stage）
10. `emit` / `afterEmit`
11. `done`

实验 04 的 `LifecyclePlugin` 会打印它挂上的子集，并在 `PROCESS_ASSETS_STAGE_REPORT` 写出 `lab-lifecycle-report.json`。

## tap / tapAsync / tapPromise

- `tap`：同步
- `tapAsync`：(…args, callback) 完成后调用 callback
- `tapPromise`：返回 Promise

异步 hooks 必须用匹配的注册方式，否则时序错乱。

## 与 Vite 开发的差异（概念）

Webpack 生命周期围绕「整次 Compilation」。Vite 开发期更多是「按 URL 请求转换单模块」，没有同等的 seal/emit 整包阶段（生产 Rollup 另当别论）。
