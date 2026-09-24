# VTable 视觉用例

`index.mjs` 是唯一可执行清单；一份用例一个模块，按主要验证目的归类。用 `--list` 查看实际 ID、目的和文件路径；已覆盖的条件与缺口见 [覆盖清单](./COVERAGE.md)。下表用于选择相关范围，交互动作仍放在所属功能目录。

| 目录 | 主要覆盖 |
| --- | --- |
| `table`、`header`、`cells` | 列表基础、表头层级、单元格类型与格式 |
| `pivot`、`pivot-chart` | 透视维度、虚拟节点、透视图 |
| `gantt`、`sheet`、`plugins` | 扩展包的图形与 API |
| `layout`、`frozen`、`scroll`、`empty`、`theme` | 尺寸、冻结、滚动、空状态、主题 |
| `interaction`、`keyboard`、`edit`、`sort`、`menu` | 选择、编辑、排序 |
| `analysis`、`records`、`transpose` | 聚合、过滤、记录更新、转置 |
| `components`、`custom`、`language`、`tree`、`data`、`group`、`style`、`api` | 标题、自定义布局、多语言 |

新增用例先查找已有近邻，优先在一个明确场景中补强必要条件。模块默认导出 `mount(container)`、`verify(page)` 和可选 `exercise(page)`；`mount` 返回待测实例。输入必须固定、公开、无外网依赖。`exercise` 需要执行真实动作，`verify` 需要检查目标状态；截图负责外观，不能替代语义断言。模块和核心方法写中文目的注释。登记唯一短 ID、目的、文件及所需 `bundles`；未登记模块不会执行。

迁移模块头部使用 `BugServer case IDs: <真实ID>`；合并时列出全部真实来源 ID，改写时仍保留原 ID。该 ID 仅用于追溯，不表示与线上内容实时同步。开发者新建的本地用例不填空值或占位 ID，待后续反向同步成功后再写入服务返回的真实 ID。不得复制业务原文、内部地址、凭证、原始数据或截图到公开仓库；来源不明时先放在私有复核目录。

BugServer 未提供 `interactions` 字段时，仅表示没有附加录制动作。仍须检查源码中的事件、定时器、异步调用、构建后的 API 更新及资源。迁移时保留目标配置、数据边界、动作顺序和最终状态；只改写无关宿主与业务内容。本目录只保存脱敏的 [候选去向台账](./BUGSERVER_CANDIDATE_TRIAGE.json)；原始 BugServer 来源、完整筛选台账和待审记录保存在仓库外私有目录。

新增或修改后先运行单例 `--self-compare --case <id>`，再运行对应目录；提交前运行默认全量比较。若用例在官方基线不支持，报告为执行错误，应如实说明，不能把自比较当作双侧通过。
