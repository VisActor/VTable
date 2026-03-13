# VTableSheet 工作簿撤销/恢复（Undo/Redo）机制设计与 HistoryPlugin 融合

本文档描述 vtable-sheet（电子表格/工作簿层）撤销恢复机制的设计目标、数据结构、回放语义，以及与 `@visactor/vtable-plugins` 的 `HistoryPlugin`（表格层历史）如何融合。

## 设计目标

- **跨工作表**：新增/删除/重命名/排序工作表等操作可撤销/恢复
- **单工作表编辑**：单元格值、合并、增删行列、排序、调整行高列宽等可撤销/恢复
- **事务语义稳定**：一次用户意图对应一次 history transaction（例如“粘贴一块区域”是一次 transaction）
- **回放不回流**：undo/redo 回放时不产生新的历史记录
- **与公式系统一致**：撤销后公式关系可恢复，避免“公式变值”或“值变公式”的错误回退

## 分层方案（Workbook vs Table）

vtable-sheet 的撤销恢复采用两层结构：

1) **工作簿层（WorkbookHistoryManager）**
- 负责记录：工作表结构变更 + 将单表的 table transaction 作为命令纳入工作簿事务
- 数据结构：`WorkbookHistoryTx = { commands: WorkbookHistoryCommand[] }`
- 入口：`packages/vtable-sheet/src/managers/workbook-history-manager.ts`

2) **表格层（HistoryPlugin / HistoryTransaction）**
- 负责记录：单个 ListTable 里的用户编辑行为，并能回放（replay）
- 数据结构：`HistoryTransaction = { commands: HistoryCommand[] }`
- 入口：`packages/vtable-plugins/src/history/history-plugin.ts`
- 回放：`packages/vtable-plugins/src/history/replay.ts`

工作簿层把“表格层 transaction”包装成 `table_tx` 命令存入 undo/redo 栈，从而实现：

- `sheet_add / sheet_remove / sheet_rename / sheet_reorder` 等命令与单表编辑命令可以在同一个 transaction 中组合
- 跨 sheet 的回放顺序可控（例如先恢复 sheet，再回放 sheet 内 table_tx）

## WorkbookHistoryManager 的命令模型

`WorkbookHistoryCommand` 支持以下命令类型：

- `table_tx`：单工作表的 table transaction（来自 HistoryPlugin）
- `sheet_add`：新增工作表
- `sheet_remove`：删除工作表
- `sheet_rename`：重命名工作表
- `sheet_reorder`：调整工作表顺序

每个命令需要包含能够完成 undo/redo 的最小信息。例如：

- `sheet_add` / `sheet_remove` 会保存 `sheet define`（用于恢复）以及 `orderBefore/orderAfter`、`activeBefore/activeAfter`
- `table_tx` 会保存 `sheetKey` 和 `HistoryTransaction`

相关定义见：

- `packages/vtable-sheet/src/managers/workbook-history-manager.ts`

## 事务（Transaction）边界

工作簿层支持显式事务：

- `startTransaction()`：开启事务，后续命令会追加到当前 transaction
- `endTransaction()`：若当前 transaction 非空则入栈，并清空 redoStack

表格层 HistoryPlugin 本身也有 transaction 语义，但在 vtable-sheet 场景推荐做法是：

- 保持 HistoryPlugin 的 “transaction 粒度” 与用户动作对齐（例如一次 paste/drag fill）
- 通过 `onTransactionPushed` 把 transaction 上抛给 WorkbookHistoryManager
- 由 WorkbookHistoryManager 决定是否与“sheet 级命令”合并在同一个 workbook transaction 中

## 回放屏蔽（避免回放回流）

回放期间必须保证：

- 工作簿层：`WorkbookHistoryManager.isReplaying = true`
- 同时写入宿主标记：`sheet.__workbookHistoryReplaying = true`

HistoryPlugin 在 `run()` 里会检测该标记并直接跳过采集，避免出现：

- undo/redo 回放触发 CHANGE_CELL_VALUES 再次入栈
- redoStack 异常清空或事务被重复记录

对应逻辑见：

- `packages/vtable-sheet/src/managers/workbook-history-manager.ts`（undo/redo 时设置 `__workbookHistoryReplaying`）
- `packages/vtable-plugins/src/history/history-plugin.ts`（run() 中检测 `__workbookHistoryReplaying`）

## 与 HistoryPlugin 的融合方式

### 1) 由 HistoryPlugin 采集 table transaction

在 vtable-sheet 的表格插件注入逻辑中（`packages/vtable-sheet/src/core/table-plugins.ts`），通过向 HistoryPlugin 传入 `onTransactionPushed`：

- 每次 HistoryPlugin 产生并 push 一个 `HistoryTransaction` 时调用回调
- 回调里将该 transaction 包装为 workbook 的 `table_tx` 命令并记录

推荐的默认策略：

- **快捷键由 workbook 接管**：Ctrl/Cmd+Z/Y 触发 `WorkbookHistoryManager.undo/redo`
- **HistoryPlugin 关闭压缩**：避免“连续编辑同一格”被合并导致 workbook 侧只能看到 1 次变更
- **table_tx 深拷贝**：避免 table 内部对象被后续修改污染历史

### 2) WorkbookHistoryManager 回放 table_tx

`table_tx` 命令在回放时会调用 `replayCommand(sheetInstance, tx, direction)`（来自 `@visactor/vtable-plugins`），由插件层执行具体回放逻辑，包括：

- 单元格值恢复
- 合并/取消合并恢复
- 增删行列、调整尺寸等结构性操作恢复
- vtable-sheet 场景下的公式恢复（依赖 HistoryPlugin 在命令中记录公式字符串/快照）

对应实现见：

- `packages/vtable-sheet/src/managers/workbook-history-manager.ts`（`applyTableTransaction`）
- `packages/vtable-plugins/src/history/replay.ts`

## 与公式系统的一致性要求

在 vtable-sheet 中，公式系统会把计算结果写回表格显示，这些“显示值同步”不应污染历史栈。

推荐规则：

- 公式字符串的变更以 `formula_added` 等 worksheet 事件为准（记录 `=SUM(...)` 这种字符串）
- 公式引擎导致的 display 值写回不入栈
- 结构变更（如 delete_column）撤销时，需要同步公式引擎的 sheetData，再恢复公式字符串，避免出现“公式计算为 0”

具体细节参见：

- `packages/vtable-plugins/src/history/formula.ts`
- `packages/vtable-plugins/src/history/replay.ts`

## 扩展建议（面向电子表格产品化）

如果要扩展到更完整的电子表格编辑体验，建议在工作簿层增加以下能力，并与 table_tx 协同：

- **跨 sheet 的引用修正事务**：移动/重命名 sheet 时，对公式中的 `Sheet1!A1` 进行一致性更新
- **大事务压缩**：对“拖拽填充 1w 行”场景，支持把多个 table_tx 合并或以增量编码存储
- **持久化/协作**：为 WorkbookHistoryTx 提供可序列化格式，并支持与协作操作日志（OT/CRDT）做桥接

## 常见问题

### 1) 为什么看起来 redoStack 为空，但页面已经 undo 了？

通常是“页面回放走的是 workbookHistory”，但你查看的是 “HistoryPlugin 的内部栈”。在 vtable-sheet 场景应以 `sheet.getWorkbookHistoryManager()` 的 undoStack/redoStack 为准。

### 2) 为什么连续编辑两次同一格只记录了一次？

优先检查 HistoryPlugin 的 `enableCompression` 是否开启；开启会把连续编辑合并为一次命令。vtable-sheet 建议默认关闭压缩，以保证用户对撤销粒度的直觉一致。

