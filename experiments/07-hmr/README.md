# 实验 07：Dev Server 与 HMR

## 1. 本实验要解决的问题

- webpack-dev-server 与 HMR 如何工作？
- `module.hot.accept` 何时保留状态？何时整页刷新？
- HMR 与 Live Reload 的差别？

## 2. 运行命令

```bash
npm run dev:07
# 浏览器打开 http://localhost:8087
```

仅验证配置可构建（无浏览器）：

```bash
npm run build --prefix experiments/07-hmr
```

## 3. 预期现象

- 开发服务器启动并编译成功
- 修改 `counter.js` 文案：页面不整刷新，count 尽量保留（依赖 dispose/accept）
- 修改 CSS：样式热替换
- DevTools → Network → WS 可见 websocket 帧

## 4. 观察哪些文件、日志、构建产物

- 浏览器控制台 `[HMR]` 日志
- WS 消息（hash、ok、warnings）
- `src/counter.js` 的 `module.hot.dispose` / `accept`

## 5. 背后的 Webpack 原理

**可验证（需浏览器）**：热更新、状态保留/丢失、WS 通道。

**官方机制**：编译 → 通知客户端 → 请求 `*.hot-update.js(on)` → `module.hot.check/apply` → 替换模块。

**教学简化 / 未验证声明**：
> **在自动化 box 环境中，本实验已验证 `webpack` 生产构建配置可编译通过；未在真实浏览器中验证 HMR / WebSocket 行为。请在你的本机 Node 18/20 上运行 `npm run dev:07` 自行观察。**

## 6. 如何设置断点

浏览器 Sources 里对 `counter.js` 下断点；在 `module.hot.accept` 回调处观察。

## 7. 改动什么代码可以验证结论

- 删掉 `module.hot.accept`，再改文件，通常变成 Live Reload
- 在 `dispose` 里不保存 `count`，热更新后状态归零

## 8. 三个常见面试追问

1. HMR 更新失败时为什么会 fallback 到整页刷新？
2. 为何有的框架要写专用 HMR bridge？
3. devServer 的内存文件系统与磁盘 `dist` 关系？

## 9. 与真实 Webpack 实现的区别

未演示 React Fast Refresh 等框架层方案；仅原生 JS + css-loader/style-loader。
