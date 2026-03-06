# History Plugin（vtable-plugins/src/history）

本文档描述 `HistoryPlugin` 当前的核心逻辑、事件到命令的映射、与 vtable-sheet 公式系统的交互点，以及已知的边界与排查路径。

## 目标

- 将用户操作转成可回放的命令（commands），以 transaction 为单位进行 undo/redo
- 支持结构性操作（增删行/列、调整尺寸、表头拖拽）与单元格内容变更
- 在 vtable-sheet 场景下，尽可能保留“公式关系”（而不是仅保留显示值）

## 核心概念

- **Command**：最小回放单元，见 [types.ts](./packages/src/history/types.ts)
- **Transaction**：一次 undo/redo 的原子操作；内部包含多个 commands
- **Snapshot**：用于结构性操作的“变更前快照”，见 [snapshot.ts](./packages/vtable-plugins/src/history/snapshot.ts)
- **Formula event**：vtable-sheet 的 `formula_added` 事件，用于记录公式编辑

## 事件与命令映射

入口在 [history-plugin.ts](./packages/vtable-plugins/src/history/history-plugin.ts) 的 `run()`：

- `CHANGE_CELL_VALUE`：仅做 pre-change 捕获（不入栈）
- `CHANGE_CELL_VALUES`：生成 `cells` 命令入栈（负责记录“普通值变更”，公式相关的变更主要靠 formula_added 记录；公式引擎同步出来的显示值不记历史 。）
- `formula_added`（worksheet.eventManager）：生成 `cells` 命令入栈（记录公式字符串变化）
- `ADD_RECORD`：`add_record`
- `DELETE_RECORD`：`delete_record`
- `UPDATE_RECORD`：`update_record`
- `ADD_COLUMN`：`add_column`
- `DELETE_COLUMN`：`delete_column`
- `CHANGE_HEADER_POSITION`：`change_header_position`
- `RESIZE_ROW_END`：`resize_row`
- `RESIZE_COLUMN_END`：`resize_column`
- `BEFORE_KEYDOWN`：拦截 `Ctrl/Cmd+Z/Y` 调用 `undo/redo`

回放入口在 [replay.ts](/packages/vtable-plugins/src/history/replay.ts) 的 `replayCommand()`。

## Snapshot（为什么需要）

VTable 在处理列/行结构变更时，可能会复用对象或进行原地修改。若 History 仅保存对 `table.options.columns` 的引用或浅拷贝，撤销时可能恢复到被污染的列定义。

因此 `captureSnapshot()` 在每次事件处理后会对：

- `columns`
- `customMergeCell`
- `records`
-（可选）`exportFormulas(sheetKey)` 返回的公式表

做快照存入插件状态，供下一次事件作为“变更前状态”来源。

## 公式相关逻辑（vtable-sheet）

### 1) oldContent/newContent 的来源

对单元格变更，History 会尽量把“公式字符串”作为内容记录，而不是显示值：

- `captureCellPreChangeContent()`：若单元格是公式，则记录 `=SUM(...)` 这类字符串
- 否则记录普通值

这样撤销可以恢复公式关系，而不只是恢复一个计算结果。

相关实现见 [formula.ts](./packages/vtable-plugins/src/history/formula.ts)。

### 2) 为什么 `CHANGE_CELL_VALUES` 会过滤一部分变更

在 vtable-sheet 场景，公式引擎计算完成后会把显示值写回表格，触发 `CHANGE_CELL_VALUES`。

这些写回如果被入栈，会导致：

- 历史栈充满“显示值同步”噪音
- 撤销时出现“公式 -> 值”的错误回退

因此 `handleChangeCellValues()` 会：

- 跳过公式字符串（`=...`）本体变更（由 `formula_added` 记录）
- 如果单元格是公式且 `changedValue` 等于当前公式计算 display，则跳过

### 3) 删除列撤销时如何恢复公式

删除列会导致：

- 列定义被移除
- 二维数组 records 中该列值被 `splice` 掉
- formula engine 中该列上的公式关系被移除/失效

因此 `delete_column` 命令里可能包含：

- `columns`：被删列定义快照
- `deletedRecordValues`：每行被删列的值（二维数组 records 场景）
- `deletedFormulas`：A1 -> formula（vtable-sheet 场景）

撤销流程（`replay.ts`）：

1. `addColumns` 先恢复列
2. `updateRecords(..., trigger=false)` 写回被删列的值
3. 主动同步 formula engine 的 sheetData（`normalizeSheetData` + `updateSheetData`），避免公式读取旧数据导致计算为 0
4. `applyCellContent` 写回 `deletedFormulas`，恢复公式关系与显示值

## 已知边界与注意事项

- `sheetKey`：优先通过 `workSheetInstances` 反查 `tableInstance`，否则回退 active sheet；见 [sheet-key.ts](./packages/vtable-plugins/src/history/sheet-key.ts)
- `delete_record`：撤销插回多行时必须按 idx 升序插入，保证行顺序稳定
- 性能：`refreshDependentDisplays` 是 BFS，默认最多刷新 5000 个依赖单元格，避免极端依赖图卡死

## 排查建议

- 入栈：关注 `HistoryPlugin.pushCommand/pushTransaction` 与 `formula_added` 是否重复触发
- 撤销回放：关注 `replayCommand` 的分支与是否触发了 `isReplaying` 防回流
- 公式为 0：优先检查 formula engine 的 sheetData 是否在结构变更后同步（尤其是 `updateRecords(..., false)` 场景）

