# VTable 本地视觉覆盖

[`index.mjs`](./index.mjs) 是唯一可执行清单；在仓库根目录运行 `node packages/vtable/scripts/visual-test.mjs --list` 可查看所有用例的 ID、目的和路径。每个用例只验证其固定输入、动作与断言，不能代表相邻配置或 BugServer 全部用例都已覆盖。

| 用例目录 | 已有代表场景 |
| --- | --- |
| `table`、`header`、`cells` | 列表与多级表头、合并单元格、行序号、文本/复选框/开关/按钮/图片/链接等单元格类型 |
| `pivot`、`pivot-chart` | 维度、聚合与汇总、指标隐藏、排序、冻结、图例，以及面积图、玫瑰图、箱线图、热力图、散点图、旭日图等图表和交互 |
| `gantt`、`sheet`、`plugins` | 任务条与基线、公式及行列插入、筛选/填充柄/主从表/Excel 键盘插件 |
| `layout`、`frozen`、`scroll`、`theme`、`style`、`language`、`empty` | 自动尺寸、冻结区与阴影、滚动、主题和样式、多语言及空状态 |
| `interaction`、`keyboard`、`edit`、`sort`、`menu` | 悬停与选择、拖动和尺寸调整、复制粘贴、编辑、排序及菜单 |
| `analysis`、`records`、`tree`、`group`、`transpose`、`api`、`data`、`components`、`custom` | 过滤与聚合、记录更新、树/分组、转置、异步数据、API 更新和自定义布局 |

## 当前边界

- Sheet 公式复制填充目前断言邻格显示值，未验证公式引用随位置平移。
- 远程媒体资源、大规模数据的性能，以及透视树扩展标题路径与懒加载、多级分组的大规模动态更新，不属于当前本地视觉用例的已验证范围。
- 官方基线无法正常执行的来源不登记为通过用例。新增功能或修复缺陷时，优先增加对应触发条件和结果断言；不要以用例数量或配置关键词推断覆盖率。

运行方式、报告和失败含义见[视觉测试说明](../README.md)，新增用例与真实 BugServer 来源 ID 规则见[用例指南](./README.md)。
