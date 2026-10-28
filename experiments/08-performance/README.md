# 实验 08：性能与缓存

## 1. 本实验要解决的问题

- 首次构建 vs 再次构建差在哪？
- filesystem cache 缓存了什么？何时失效？
- 不同 `devtool` 对耗时的影响？

## 2. 运行命令

```bash
npm run build:08
```

会真实跑多次 webpack 并把结果写入 `RESULTS.md`。

## 3. 预期现象

- 终端打印各场景毫秒数
- 生成 `RESULTS.md`（**数字来自本次机器，非虚构**）
- `fs-cache SECOND` 通常快于 `FIRST`

## 4. 观察哪些文件、日志、构建产物

- `RESULTS.md`
- `.webpack-cache/` 目录是否生成
- `bench.js` 中的场景定义

## 5. 背后的 Webpack 原理

**可验证**：本机计时对比；cache 目录出现。

**官方机制**：Webpack 5 `cache.type = 'filesystem'` 持久化模块构建结果；配置/文件/版本变化导致失效。

**教学简化**：样例模块很少，加速比在大项目中通常更明显。

## 6. 如何设置断点

一般看计时即可；若要研究缓存，可在 Webpack 的 `Cache` 相关类下断点（进阶）。

## 7. 改动什么代码可以验证结论

- 改 `entry.js` 后再跑 SECOND，观察是否仍命中大部分缓存
- 改 `webpack.config.js` 结构，观察 FIRST 变慢（失效）

## 8. 三个常见面试追问

1. 持久化缓存的关键失效条件有哪些？
2. `eval` 与 `source-map` 为何性能差很多？
3. 增量编译与 filesystem cache 关系？

## 9. 与真实 Webpack 实现的区别

未演示 `cache.buildDependencies`、远程缓存、线程池 loader 等。

## 环境说明

请在 **Node >= 18**（推荐 18/20 LTS）下运行。`RESULTS.md` 会记录 Node 版本与 OS。
