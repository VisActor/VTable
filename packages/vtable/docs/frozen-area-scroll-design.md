# 冻结区域独立横向滚动：技术设计

本文总结 VTable 中“冻结区域（左冻结/右冻结）支持独立横向滚动”的实现设计、核心数据结构、关键链路改动点与边界行为。

> 对应实现主要落在 packages/vtable/src 内；PR 参考：#5063（Feat/frozen column scroll）。

## 1. 背景与问题

在 ListTable 中，冻结列用于保持关键列常驻可见。但当冻结列总宽度超过最大冻结宽度（`maxFrozenWidth`）时，既有策略通常是“自动解冻部分列”以满足视口宽度限制。

在一些业务场景中，冻结列必须保留（例如左侧关键标识列、右侧操作列），因此需要：

- 冻结区域在宽度受限时仍保留全部冻结列
- 在冻结区域内部提供横向滚动能力（与 body 横向滚动相互独立）
- 在多滚动域场景下，滚动条显隐与交互需要“按区域”工作，避免混乱

## 2. 目标与非目标

### 2.1 目标

- 新增左/右冻结区域内部横向滚动能力（trackpad/wheel 与滚动条拖拽/点击轨道）
- 保持冻结区域“视口宽度”可控（左：`maxFrozenWidth`，右：`maxRightFrozenWidth`）
- 多滚动域并存时（body / leftFrozen / rightFrozen），保证：
  - 渲染坐标系正确（内容随各自 scrollLeft 平移）
  - 命中坐标正确（getCellAt、事件 target 等与渲染一致）
  - 主滚动条与冻结滚动条互不干扰
  - `scrollStyle.visible` 为 `focus/scrolling/always/none` 时行为一致

### 2.2 非目标

- 本设计不覆盖 PivotTable/Gantt 的冻结滚动扩展（当前以 ListTable 为主）
- 不引入插件化实现（该能力需要穿透状态/布局/命中/scenegraph 多层链路）

## 3. 概念与术语

- **冻结内容宽（content width）**：冻结列本身的总宽度，不受 maxFrozenWidth 限制。
- **冻结视口宽（viewport width）**：冻结区域在画布上占用的宽度，受 maxFrozenWidth / maxRightFrozenWidth 限制。
- **冻结溢出量（offset）**：`max(0, contentWidth - viewportWidth)`，表示冻结区域内部最大可滚动距离。
- **滚动域（scroll domain）**：
  - `body`：主横向滚动域（影响非冻结列）
  - `frozen`：左冻结区域内部横向滚动域
  - `rightFrozen`：右冻结区域内部横向滚动域

## 4. 对外配置与 API

### 4.1 新增配置（ListTableConstructorOptions）

- `scrollFrozenCols?: boolean`
  - `false`（默认）：冻结列超出最大冻结宽度时遵循原策略（可能解冻）
  - `true`：冻结区域内部可横向滚动，保留全部冻结列
- `maxRightFrozenWidth?: number | string`
  - 右侧最大冻结宽度，默认与 `maxFrozenWidth` 对齐
- `scrollRightFrozenCols?: boolean`
  - `false`（默认）：右冻结区域宽度 = 内容宽度（无内部滚动）
  - `true`：右冻结区域内部可横向滚动

### 4.2 相关方法（BaseTable）

左冻结：

- `getFrozenColsContentWidth()`：冻结内容宽
- `getFrozenColsWidth()`：冻结视口宽（scrollFrozenCols 开启时受 maxFrozenWidth 限制）
- `getFrozenColsOffset()`：溢出量（最大可滚动距离）
- `getFrozenColsScrollLeft()`：当前左冻结 scrollLeft（px）

右冻结：

- `getRightFrozenColsContentWidth()`
- `getRightFrozenColsWidth()`（scrollRightFrozenCols 开启时受 maxRightFrozenWidth 限制）
- `getRightFrozenColsOffset()`
- `getRightFrozenColsScrollLeft()`

## 5. 数据结构（StateManager）

在 StateManager 中新增两个横向位置用于维护冻结域滚动：

- `scroll.frozenHorizontalBarPos`：左冻结 scrollLeft（px）
- `scroll.rightFrozenHorizontalBarPos`：右冻结 scrollLeft（px）

并提供两类接口：

1) 外部“设置滚动位置”（用于 wheel / click 轨道 / 拖拽）
- `setFrozenColsScrollLeft(left, triggerRender?)`
- `setRightFrozenColsScrollLeft(left, triggerRender?)`

2) 外部“按滚动条 ratio 更新”（scrollDrag 回调给的是 range，需要映射回 scrollLeft）
- `updateFrozenHorizontalScrollBar(xRatio)`
- `updateRightFrozenHorizontalScrollBar(xRatio)`

右冻结的 ratio 与 left 做了反向映射（`ratio = 1 - left/maxScrollLeft`），以更符合“右冻结内容从右向左展开”的视觉直觉。

## 6. 渲染与布局（Scenegraph）

### 6.1 左冻结

左冻结的平移相对直观：冻结区域内部滚动时，对应 group 的 childrenX 直接使用 `-scrollLeft`。

### 6.2 右冻结

右冻结的布局基准是“内容右对齐视口”，因此需要同时考虑溢出量 offset 与 scrollLeft：

- `rightFrozenStartX = -rightFrozenOffset + rightFrozenScrollLeft`

含义：

- `-offset`：使右冻结内容尾部对齐到视口右侧（把超出部分整体向左移出视口）
- `+scrollLeft`：在视口内左右移动查看隐藏的列

对应更新点：

- `Scenegraph.updateContainerAttrWidthAndX()` 在布局刷新时更新 rightFrozenGroup / corner group 的 childrenX
- `Scenegraph.setRightFrozenColsScrollLeft()` 在右冻结滚动变化时更新 rightFrozenGroup / rightTopCorner / rightBottomCorner 的 childrenX

### 6.3 Clip（裁剪）

多区域 overlay/内容组均依赖 clipRect 进行裁剪。右冻结视口宽度在开启 scrollRightFrozenCols 时不再等于内容宽度，需要使用 `getRightFrozenColsWidth()` 作为 clip 宽度来源，保证“内容滚动但不越界绘制”。

## 7. 命中与坐标映射（HitTest）

冻结区域内部滚动会改变“可视坐标 ↔ 内容坐标”的映射关系，因此需要在命中链路中补偿：

- 右冻结命中：当 x 落在右冻结视口范围内时，先将 `absoluteX -= rightFrozenScrollLeft` 再计算 target col
- 右冻结列 x 计算：`getColX(col, table, true)` 叠加 `getRightFrozenColsScrollLeft()`，保证渲染坐标与 hitTest 一致

## 8. 事件分发（Wheel/Trackpad）

横向 wheel 需要判断“滚动意图属于哪个滚动域”：

- 优先冻结域：当指针坐标落在左冻结/右冻结视口范围内且该域可滚动（offset>0）
- 否则落入 body 域

注意：部分环境 wheel 事件可能没有可靠的 x/y，因此引入 LastBodyPointerXY 作为回退坐标。

右冻结域的 delta 需要反向映射：

- `rightFrozenDelta = -optimizedDeltaX`

原因是右冻结内容的“展开方向”与 body/左冻结相反（内容从右向左展开）。

## 9. 滚动条系统（ScrollBar UI）

### 9.1 多段横向滚动条

当左右冻结域启用内部滚动且存在溢出时，底部会出现三段横向滚动条：

- body 主滚动条（hScrollBar）
- 左冻结横向滚动条（frozenHScrollBar）
- 右冻结横向滚动条（rightFrozenHScrollBar）

各段的 range（滑块长度）分别反映其域的“视口宽 / 内容宽”。

### 9.2 显隐策略与交互

`scrollStyle.visible` 在多滚动域场景下的定义：

- `always`：所有可滚动域的滚动条同时显示
- `focus`：只显示指针所在域的滚动条（避免干扰）
- `scrolling`：滚动发生时显示；hover 到滚动条区域时显示以支持交互；离开后延迟隐藏

实现上通过 `TableComponent.showHorizontalScrollBar(target)` 控制显示目标域，并在事件监听中根据 hover/scrolling 规则维护 autoHide。

## 10. 关键边界与已处理问题

- **右冻结分割线（shadow line）错位**：当右冻结内容可滚动时，分割线应固定在“右冻结视口左边界”而不是随内容滚动
- **选区 overlay 被裁切**：当选区贴边或存在 fill handle 时，需要对 overlay 的 clipRect 进行外扩（详见选框技术设计文档）
- **拖拽滚动条不生效**：throttle 绑定函数需要 bind(this)，否则 this.table 不可用

## 11. 可观测性与测试建议

建议覆盖以下用例：

- 左冻结溢出：trackpad 横向滚动仅影响左冻结内容；body 不动
- 右冻结溢出：trackpad 横向滚动方向符合预期；命中列与渲染一致
- 滚动条：三段滚动条的滑块比例正确；拖拽与点击轨道能驱动对应域滚动
- visible 策略：focus/scolling 下仅显示目标域滚动条且可自动隐藏

