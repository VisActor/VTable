---
name: vtable-browser-debugger-assistant
description: This skill should be used when debugging VTable (canvas-based table) rendering/interaction issues in the browser via Chrome DevTools by inspecting the VRender Scenegraph (Scenegraph.tableGroup). Use it for blank/white canvas, missing/misaligned cells, frozen header/body issues, hover/selection box issues, DOM overlay (react attribute) issues, and React18/React19 differences in custom-layout / react-reconciler (e.g., Fiber contamination, double React, older React element errors).
---

# VTable Browser Debugger Skill

## 使用场景

在出现以下问题时触发本技能：
- 页面白屏/表格区域空白：canvas 存在但不绘制内容，或局部区域（表头/冻结区/正文）缺失
- 单元格内容缺失、错位、尺寸异常、冻结区错位、hover/selection 框位置异常
- 自定义渲染异常：custom-layout / react-custom-layout 不生效、渲染为空、渲染偏移或尺寸不对
- DOM overlay 异常：react attribute（DOM 容器挂载）不显示、位置不对、与 canvas 不同步
- React18 正常、React19 异常：custom-layout 空白、`older version of React element`、两份 React 共存、reconciler/hostConfig 兼容问题
- React19 reconciler 相关直接崩溃：`ReactCurrentOwner`
- VTable core customLayout 解码报错：`decodeReactDom` + `type is not a function`（rootContainer 的 type 不符合预期）
- 仅在特定交互触发：滚动/resize 后消失、hover 才出现、冻结列切换后错位

## 工作流（按顺序执行）

### 0) 复现/验证工作流（源码排查场景）

当在 VTable 源代码中排查解决问题时，使用以下工作流：

**复现问题：**
1. 在 `/packages/vtable/examples` 中找到与问题相关的 demo或创建新的 demo；如果是gantt问题，需要在 `/packages/vtable-gantt/examples` 中找到对应的 demo或创建新的 demo;如果是插件plugin问题，需要在 `/packages/vtable-plugins/demo` 中找到对应的 demo或创建新的 demo;如果是sheet电子表格问题，需要在 `/packages/vtable-sheet/examples` 中找到对应的 demo或创建新的 demo;也就是看情况决定在哪个目录下创建 demo。
2. 修改 demo 配置以复现问题（如设置 `select.disableSelect`、`customMergeCell` 等）
3. 启动 demo 服务：`rushx demo`（在 `packages/vtable` 目录下）
4. 使用 Chrome DevTools MCP 连接浏览器，验证问题是否复现

**验证修复：**
1. 修改源代码后，确保 demo 服务已重新加载（Vite 会自动热更新）
2. 使用相同的 demo 验证问题是否解决
3. 检查修复是否引入新的问题（如影响其他交互、其他 demo 是否正常）

**常用调试技巧（借助 DevTools MCP）：**
- **动态修改配置验证**：可通过 `table.options.select.disableSelect = ...` 或修改 `table.theme.scrollStyle` 等动态注入配置，无需频繁修改代码和重启服务即可测试不同边界情况。
- **排查闭包/作用域问题**：VTable 的事件监听器（如 `pointerleave`, `pointermove`）中存在大量闭包变量。如果某逻辑未按预期执行，可利用 MCP 注入断点或打印日志（覆盖原型链方法或动态添加 event listener），排查闭包变量是否为 `undefined` 或过期。
- **Canvas 事件与 Scenegraph 层级**：
  - 区分 `stage` 和 `tableGroup` 的事件。Hover/Leave 相关问题（如滚动条、Tooltip 异常消失），往往是因为 `tableGroup` 的 `pointerleave` 事件在鼠标移动到 canvas 空白区域时被意外触发。
  - 注意 `e.target` 和 `e.relatedTarget`：判断节点是否在某容器内时，`e.target.isDescendantsOf(stage)` 当 `target` 正是 `stage` 本身时会返回 `false`。**正确的判断模式**应为 `target === stage || target?.isDescendantsOf?.(stage)`。
- **获取状态**：
  - 使用 `table.getSelectedCellRanges()` 检查当前选区状态。
  - 使用 `table.getCellRange(col, row)` 检查单元格合并信息。

## 常见坑（NEVER）

- NEVER 在 `stage.width/height` 为 0 或父容器高度未定时深入排查 scenegraph，先修布局与容器高度
- NEVER 在同一页面疑似存在两份 React/ReactDOM 时继续看 scenegraph 细节，先修 alias/依赖树保证同源
- NEVER 在检测到 Fiber 污染（图元 `attribute` 出现 `tag/child/sibling/return/memoizedProps/lanes` 等）后继续做 bounds 叠加，直接回到 reconciler HostConfig（常见点：`commitUpdate` 参数签名）
- NEVER 只看 DOM/console 就下结论，canvas 相关问题如绘制内容缺失，单元格错位等，必须同时用 scenegraph 树 + bounds 对比验证
- NEVER 忽略 `componentGroup`：selection/tooltip/overlay 等很多“看起来像 cell 的问题”其实是 component/overlay 层问题
- NEVER 在处理鼠标交互问题（Hover/Leave/Enter）时，想当然地认为 `e.target.isDescendantsOf(stage)` 对于 `stage` 本身会返回 `true`。永远使用 `target === stage || target?.isDescendantsOf?.(stage)`。
- NEVER 忽视内部 Group 的事件拦截。如果遇到滚动条、高亮状态异常消失，不要只在 `stage` 层寻找原因，多半是内部的 `tableGroup` 或其他 Group 的 `pointerleave` / `pointerout` 冒泡或执行了意外的隐藏逻辑。
- NEVER 假设 VTable 初始化时的变量在闭包中永远是最新的。由于配置项（如 `theme`, `options`）在运行时可能被深拷贝或替换，在事件监听器等闭包内直接解构或使用外部作用域变量可能会拿到旧值。遇到问题时，利用 MCP `evaluate_script` 检查闭包运行时的实际值。
- NEVER 在树形 / 懒加载 / 折叠场景里，把 `dataSource.getTableIndex(path)` 返回的 `-1` 当成合法可见行号继续参与高亮、focus、hover、selection 或刷新逻辑。`-1` 的含义通常是“该 path 当前不可见”，如果继续做 `row = rawIndex + headerOffset` 之类的换算，常见后果就是高亮落到表头或别的可见单元格上。
- NEVER 在依赖可见 `row`/`col` 的交互逻辑里（如 customCellStyle arrangement、focus 高亮、范围框）跨越“展开/折叠/排序/过滤/数据更新”直接复用旧坐标。布局一旦变化，必须先清空旧 arrangement / 旧缓存，再按最新可见布局重算，否则旧的 `row` 会指向别的记录，表现为“搜索 A 却把 B 染黄”。
- NEVER 在排查透视表（PivotTable）角表头状态（如排序图标、菜单等）时依赖 `getCellAddressByHeaderPaths` 这种全局坐标映射 API，因为当行列中存在同名维度（如行和列都配置了 `Category` 维度）时，该类 API 只会返回第一个匹配的单元格坐标。同时也 NEVER 仅仅依赖角表头单元格自身的 `pivotInfo` 或 `dimensionKey` 去做单点状态比对，因为角表头可能代表多层嵌套的维度（例如 `Sub-Category` 是在 `Category` 之下的第二层）。**正确的排查思路**是：结合 `cornerSetting.titleOnDimension` 和 `indicatorsAsCol` 的配置精确定位角表头属于行维度还是列维度，然后利用 `col` / `row` 坐标从 `layoutMap.rowDimensionKeys` 或 `layoutMap.colDimensionKeys` 中截取完整的层级路径（path keys），再与目标 `dimensions` 数组做严格的长度和逐层比对。

## DevTools MCP 连接排障

遇到 MCP 报错（例如 `DevToolsActivePort` 找不到、`Network.enable timed out`）时，先按 [snippets.md](references/snippets.md) 的 `0) MCP 连接不上 Chrome` 处理，确认 DevTools 连接可用后再继续排查 scenegraph。

### 1) 先拿到 table 与 scenegraph（必做）

目标：
- 拿到 VTable 实例（ListTable/PivotTable）
- 确认 `table.scenegraph.stage` 存在且 width/height 正常

MANDATORY：加载并使用 [snippets.md](references/snippets.md) 的：
- 1) 查找页面上的 VTable 实例
- 2) 快速查看各分区 group 的 childrenCount

### 2) 分区归因（必做）

根据现象快速确定排查分区：
- 表头问题：`colHeaderGroup / rowHeaderGroup / cornerHeaderGroup`
- 内容区问题：`bodyGroup / rightFrozenGroup / bottomFrozenGroup`
- DOM overlay / 组件问题：`componentGroup`

需要理解 scenegraph 分区结构时，按需加载：
- [vtable-scenegraph.md](references/vtable-scenegraph.md)

### 3) 结构问题：导出树 + 定位 cell（按需）

当“没有报错但视觉不对”时：
- 导出目标分区浅层树确认节点存在
- 按 col/row 找到目标 cell，再做深层导出

MANDATORY：加载并使用 [snippets.md](references/snippets.md) 的：
- 3) 在 bodyGroup 里按 col/row 找某个 cell group
- 4) 导出任意 group 的树

### 4) 坐标问题：bounds 叠加对比（按需）

当“节点存在但位置/尺寸不对”时：
- 对目标节点做 bounds 叠加
- 截图对比“场景树坐标”与“屏幕像素”

MANDATORY：加载并使用 [snippets.md](references/snippets.md) 的：
- 5) 叠加 bounds 到屏幕（用于截图对比）

### 5) 快速检查表（必做）

- 优先排除“容器高度为 0 / stage 尺寸为 0 / canvas 被遮挡”的布局问题
- 确认分区选择正确（body vs frozen vs header）
- 检查目标节点 `attribute.visible`、透明度、clip/culling
- 发现 bounds 异常（Infinity/0/负数/极大偏移）时优先怀疑尺寸更新/坐标系变换/错误属性写入
- DOM overlay 模式下确认 container 正确（`table.bodyDomContainer` / `table.headerDomContainer`）且 container 尺寸/定位可用

### 6) React18/React19 差异排查（集中处理）

当现象是“React18 正常、React19 异常”或“custom-layout 在 React19 下空白/偏移”，先按专项指南做二分排查（依赖树/双 React/reconciler/HostConfig/DOM overlay），再回到 scenegraph 做细化定位。

MANDATORY：加载并从头到尾执行 [react18-react19.md](references/react18-react19.md)。

## 参考资料（按需加载）

- [snippets.md](references/snippets.md)
- [vtable-scenegraph.md](references/vtable-scenegraph.md)
- [vrender-graphics.md](references/vrender-graphics.md)
- [react18-react19.md](references/react18-react19.md)
