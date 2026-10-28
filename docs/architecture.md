# Webpack 架构总览（对照本实验室）

本文服务根 README 列出的 14 个核心问题，并标明：

- ✅ **可验证**：本仓库命令能直接看到
- 📘 **官方机制**：Webpack 公开架构
- 🔶 **教学简化**：本仓库为讲解做的取舍

## 1. 为什么需要打包？vs 原生 ESM

- ✅ 实验 01：多文件变成单（或少）bundle，浏览器一次加载 + 统一 Runtime
- 📘 原生 ESM：按需请求、有 CORS/路径/旧浏览器/无统一转换管线等问题；构建工具还负责资源、兼容、优化
- 🔶 未演示 HTTP/2 多模块瀑布与 import-maps 的完整对比

## 2–3. 递归解析与 Module Graph

- ✅ 实验 02：钻石依赖 + Stats reasons + shared 单次求值
- 📘 `NormalModuleFactory` 解析 → `Module` 入图 → `Dependency` 连边；Webpack 5 `ModuleGraph`
- 🔶 Mini Webpack 用 Map + 递归模拟同一思想

## 4. Loader

- ✅ 实验 03：pitch/normal 日志、右到左、异步 `this.async`
- 📘 Loader Runner；结果视为模块源码
- 🔶 自定义 Markdown 非生产级

## 5. Plugin / Tapable

- ✅ 实验 04：真实 hooks 顺序 + `processAssets` 写文件
- 📘 Compiler / Compilation 双层；`tap` / `tapAsync` / `tapPromise`
- 🔶 仅覆盖部分 hooks

## 6–7. Module / Chunk / Bundle 与可执行代码

- ✅ 实验 01 + 05：模块工厂、chunk 文件、runtime 加载
- 📘 Module 是图节点；Chunk 是输出分组；Bundle 是生成的文件
- 🔶 未覆盖全部 chunk 类型命名细节

## 8. Tree Shaking

- ✅ 实验 06：dev 标记 vs prod 删除；ESM vs CJS；sideEffects
- 📘 usedExports + sideEffects + minifier
- 🔶 样例体积小，观察靠字符串搜索

## 9. Code Splitting / dynamic import

- ✅ 实验 05：异步 chunk 文件与 splitChunks
- 📘 `import()` → async chunk；runtime `ensure`
- 🔶 浏览器 Network 需本机打开 HTML

## 10. 模块缓存与 Runtime

- ✅ 实验 01 / Mini Webpack：`__webpack_require__` / `__require` + cache
- 📘 Runtime 随特性（HMR、公钥路径、模块联邦）变化
- 🔶 Mini 仅最小 require

## 11. Source Map

- ✅ 实验 01 / 08：不同 `devtool`；08 有真实耗时
- 📘 SourceMapDevToolPlugin；eval 系与独立 `.map` 权衡
- 🔶 未手写 VLQ 编码讲解

## 12. Dev Server / HMR

- ✅ 配置与构建可跑；浏览器 HMR **需本机验证**（见实验 07 README 声明）
- 📘 WS 通知 + hot-update + `module.hot.apply`
- 🔶 box 环境未宣称已验证浏览器行为

## 13. 增量编译与持久化缓存

- ✅ 实验 08：filesystem cache 首次/再次真实计时
- 📘 `cache.type='filesystem'`；watch 增量
- 🔶 模块数少，加速比仅供感性认识

## 14. Webpack vs Vite（开发态）

- 📘 Webpack Dev：打包（或惰性编译）进中间产物 + HMR Runtime  
  Vite Dev：原生 ESM + 按需转换（esbuild）+ 依赖预构建；生产仍用 Rollup
- 🔶 本仓库不内嵌 Vite 项目；对比以文档与你的既有 Vite 经验为主
- ✅ 可用实验 01/07 感受「先成 bundle / 有 WDS」与 Vite 体验的差异

## 推荐阅读路径

1. 实验 01 → Mini Webpack → 实验 02  
2. Loader 03 → Plugin 04  
3. Chunks 05 → Tree Shaking 06  
4. HMR 07（本机浏览器）→ Performance 08  
