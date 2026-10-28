# Webpack 面试追问（结合本实验室）

每题给出「可指向的实验」与简要要点。

## 基础

1. **为何还需要打包？** → 实验 01；兼容、资源管线、优化、统一运行时。  
2. **`__webpack_require__` 做什么？** → 01 / Mini；查缓存、执行工厂、返回 exports。  
3. **Module / Chunk / Bundle？** → 05；图节点 / 输出分组 / 文件。

## 依赖图

4. **同一模块为何不执行两次？** → 02；模块缓存。  
5. **循环依赖？** → Mini circular；部分 exports / 与 ESM TDZ 差异。

## Loader / Plugin

6. **Loader 顺序？** → 03；normal 右→左，pitch 左→右。  
7. **Plugin 如何介入？** → 04；Tapable hooks。  
8. **Compiler vs Compilation？** → 04 / lifecycle 文档。

## 优化

9. **Tree Shaking 条件？** → 06；ESM、sideEffects、usedExports、minify。  
10. **标记未使用却仍在包里？** → 06；未 minify 或 CJS/副作用。  
11. **splitChunks 用途？** → 05；抽公共、缓存优化。

## 开发体验

12. **HMR 流程？** → 07；编译→WS→hot-update→apply。  
13. **Source Map 选型？** → 08；速度 vs 精度。  
14. **持久化缓存失效？** → 08；配置、文件、loader、版本。

## 对比

15. **Webpack 与 Vite 开发架构差异？** → architecture.md §14；捆绑式 Dev Server vs 原生 ESM 按需编译。

答题时尽量说：**我用某某实验验证过某某现象**，比背定义更有说服力。
