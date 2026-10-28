# 实验 04：Plugin 与 Tapable

## 1. 本实验要解决的问题

- Plugin 如何通过 Tapable Hooks 参与编译？
- Compiler 与 Compilation 的区别？
- `tap` / `tapAsync` / `tapPromise` 怎么用？

## 2. 运行命令

```bash
npm run build:04
# 查看产物
cat experiments/04-plugin/dist/lab-lifecycle-report.json
```

## 3. 预期现象

- 控制台打印有序的 hook 名称列表
- `dist/lab-lifecycle-report.json` 含 modules/chunks/assets 统计

## 4. 观察哪些文件、日志、构建产物

- `plugins/LifecyclePlugin.js`
- 终端 Hook 顺序
- `lab-lifecycle-report.json`

## 5. 背后的 Webpack 原理

**可验证**：hooks 按生命周期触发；`processAssets` 可 `emitAsset`。

**官方机制**：Tapable；Webpack 5 用 `compilation.hooks.processAssets` + stage 常量。

**教学简化**：只挂了部分 hooks；真实插件更关注特定 stage 与依赖其它插件。

## 6. 如何设置断点

在 `LifecyclePlugin.apply` 及各 `tap` 回调处下断点。

## 7. 改动什么代码可以验证结论

- 把 `tapAsync` 的 `callback` 拖慢，观察后续 hook 是否延后
- 改 `PROCESS_ASSETS_STAGE_*`，看报告文件相对其它资产的时机

## 8. 三个常见面试追问

1. Compiler 和 Compilation 谁生命周期更长？
2. 为什么 Webpack 5 弃用某些直接改 `compilation.assets` 的写法？
3. `thisCompilation` 与 `compilation` hook 的区别？

## 9. 与真实 Webpack 实现的区别

未使用 `webpack-sources` 做复杂变换；未演示 HookMap / 熔断等高级特性。
