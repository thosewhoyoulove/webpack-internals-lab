# 实验 08 性能测试结果（真实跑分）

> 生成时间：2026-10-28T02:38:43.756Z
> 环境：Node v20.19.2 · linux 6.12.94+ · x64
> CPU：Intel(R) Xeon(R) Processor × 8
>
> **这些数字只代表本次运行环境，换机器会不同。不要当作绝对性能结论。**

| 场景 | 耗时 (ms) |
|------|-----------|
| no-cache cold (devtool=eval) | 483 |
| no-cache warm-ish (devtool=eval) | 651 |
| fs-cache FIRST (devtool=eval) | 610 |
| fs-cache SECOND (devtool=eval) | 470 |
| devtool=false (fs first) | 635 |
| devtool=eval (fs first) | 565 |
| devtool=source-map (fs first) | 608 |

## 如何解读

- **filesystem cache SECOND** 通常明显快于 FIRST：模块解析与转换结果命中磁盘缓存。
- **source-map** 通常慢于 **eval** / **false**：要生成独立 map 或更重的映射。
- 改 `webpack.config.js`、loader 选项、或依赖版本 → 缓存失效。
- 只改某个 `src/*.js` → 理想情况下只失效相关模块条目。

> 文档本地标注时间：2026-10-28 10:39:19 UTC+8 (Asia/Shanghai)
>
> **说明**：本实验模块极少，filesystem cache 加速比在大项目中通常更明显；上表 SECOND(470ms) 相对 FIRST(610ms) 已可见收益，但幅度受冷启动/进程开销影响。

重新跑分：`npm run bench`（在本目录或根目录 `npm run build:08`）。
