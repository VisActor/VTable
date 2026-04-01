# VTable Scenegraph 速查

## 根对象与入口

VTable 的绘制由 VRender 的场景树决定，核心入口：
- `table.scenegraph`：场景树管理器（class `Scenegraph`）
- `table.scenegraph.tableGroup`：表格全局根 Group

开发环境下常见暴露方式（便于 DevTools 脚本访问）：
- `window[table.id] = table`（参考 `BaseTable.ts` 的构造/初始化逻辑）
- `(scenegraph.stage as any).table = table`（Scenegraph 构造里会做这件事）

## Scenegraph 的关键分区（Group）

Scenegraph 上常见的 Group 字段（都是 `Group` 类型，继承自 VRender 的 Group）：
- `tableGroup`: 表格全局根 Group（最终被 add 到 stage）
- `colHeaderGroup`: 列表头 Group
- `cornerHeaderGroup`: 左上角（表头+冻结交汇）Group
- `rowHeaderGroup`: 行表头 Group
- `bodyGroup`: 内容区 Group
- `rightFrozenGroup`: 右侧冻结列 Group
- `bottomFrozenGroup`: 下侧冻结行 Group
- `rightTopCornerGroup/leftBottomCornerGroup/rightBottomCornerGroup`: 冻结交汇占位区域
- `componentGroup`: 表格外组件 Group（tooltip/菜单/选择框等）

定位问题时优先确定“问题发生在哪个分区”，避免误判：
- “body 不对”但实际是 rightFrozen/bottomFrozen 在画
- 视觉上像 body 的内容其实在 cornerHeader/rowHeader 画（尤其冻结/转置/pivot 场景）

## Group / Cell 的常用字段

`Group`（`packages/vtable/src/scenegraph/graphic/group.ts`）在 VRender Group 基础上补充了：
- `role?: string`：场景语义（例如 cell / header / ...，具体值取决于构建逻辑）
- `col?: number`, `row?: number`：用于定位单元格（role=cell 常见）
- `mergeStartCol/mergeStartRow/mergeEndCol/mergeEndRow`：合并单元格范围
- `border?: IRect`：该 group 的边框标记（默认遍历时可跳过）
- `childrenCount`, `_firstChild/_next`：链表形式的子节点（遍历更稳）
- `AABBBounds`, `globalAABBBounds`：包围盒（用于对齐截图 / 叠加 overlay）

常用方法：
- `getChildByName(name, deep?)`
- `forEachChildrenSkipChild(cb, skipChildName = 'border-rect', reverse?)`
- `getColGroup(col)` / `getRowGroup(row)`：按 col/row 找子 group（特定层级有效）

## 建议的调试切片（最小化）

为了避免一次导出树太大，建议按以下顺序逐步深入：
1. `tableGroup` 深度 2-3：确认分区是否齐全、是否重复、bounds 是否异常
2. 选择具体分区（例如 `bodyGroup`），深度 3：确认“行 group / 列 group / cell group”的层级形态
3. 选定一个目标 cell（按 `role=cell && col/row`），深度 5-8：确认文本/图标/tag 的节点是否存在、属性是否正确

