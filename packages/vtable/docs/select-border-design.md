# 选框（Select Border）改造：技术设计（前/后对比）

本文总结 VTable 选框（selection border + fill handle）的设计背景、改造前的问题、改造后的结构与关键实现点，便于后续维护与扩展。

> 涉及代码：packages/vtable/src/scenegraph/select/* 及 overlay clip 相关贡献逻辑。

## 1. 背景

VTable 的“选框”由两个主要视觉元素组成：

- **selection border**：选区外边框（可配置边框色、线宽、虚线等）
- **fill handle**：右下角 6x6 小方块（Excel 类填充柄），受 `excelOptions.fillHandle` 控制

在引入“冻结区域独立滚动”后，表格的可视区域被拆成多个区域（body/headers/leftFrozen/rightFrozen/bottomFrozen），选框需要：

- 正确出现在对应区域的 overlay 层并被 clip 裁剪
- 支持跨区域选择（需要拆分多段绘制）
- 避免在跨区域边界重复描边（导致边框变粗）
- 在贴边/裁剪边界时不出现“半条线”或 fill handle 被切掉

## 2. 改造前设计（概念层面）

### 2.1 选框的基本组织方式

- 选框图元挂在 overlayGroup 下（select-overlay），overlayGroup 会被各区域 clipRect 裁剪。
- 对于跨区域选区，会拆分为多个选框段落（每段一个 rect，必要时一个 fill handle）。

### 2.2 主要痛点

1) **贴边裁剪导致的边框缺失**
- 选框的描边线宽是以 rect 边界为中心绘制；当选区贴着表格边缘或区域 clip 边界时，一半线宽会被裁剪，呈现“半条线”。

2) **fill handle 被裁剪或定位异常**
- 在最后一行/最后一列等边界场景，fill handle 可能落到 clip 外，导致不可见或难以命中。

3) **跨区域选框的重复描边**
- 选区跨越多个 overlay（例如 columnHeader + body，或 body + rightFrozen）时，如果各段都绘制相邻边，会在边界处叠加出更粗的边框。

4) **场景树重建导致选区丢失**
- 数据更新导致 scenegraph 重建时，overlay 下的选区图元会被清空，需要从 state 恢复。

## 3. 改造后设计（实现层面）

改造后的原则：

- **跨区域必拆分**：按区域拆分为多段选框，每段只负责自己的绘制与裁剪
- **边界不重复描边**：通过 strokeArray 控制每段四边是否绘制
- **贴边不裁半线**：在选框更新时对 rect 做“半线宽补偿”，同时对 overlay clipRect 做“外扩”
- **fill handle 只在可解释场景出现**：单选区 + 非表头 + 边不被禁用时显示

## 4. 关键实现点

### 4.1 选框创建：overlay 坐标换算与 fill handle 显示条件

文件：

- packages/vtable/src/scenegraph/select/create-select-border.ts

要点：

- 使用 `highPerformanceGetCell(...).globalAABBBounds` 获取单元格全局边界，再减去 `tableGroup + overlayGroup` 的偏移，换算成 overlay 本地坐标。
- fill handle 的显示需要满足：
  - `excelOptions.fillHandle` 开启
  - 当前仅 1 个选区（多选区时移除所有 handle）
  - 选区不包含表头（header 不允许填充）
  - strokes 中右边或下边被关闭时不显示（避免 handle 由其它段负责时重复出现）

### 4.2 选框更新：可视范围裁剪与 fill handle 边界定位

文件：

- packages/vtable/src/scenegraph/select/update-select-border.ts

要点：

1) **按 role 裁剪计算范围**

不同区域的选框更新策略不同：

- `rowHeader`：只裁剪行范围（跟随 body 可视行）
- `columnHeader` / `bottomFrozen`：只裁剪列范围（跟随 body 可视列）
- `rightFrozen`：只裁剪行范围（跟随 body 可视行）
- `body`：裁剪行列范围

目的是避免更新不可见区域的选框段落，降低滚动过程的更新开销。

2) **fill handle 边界推导**

当选区触达最后一列/最后一行时，直接取 “end cell bound” 可能导致 handle 超出 clip。实现上通过相邻单元格的 bound 推导 `handlerX/handlerY`，让 handle 保持在可见边界附近。

3) **贴边半线宽裁切修正**

当选区贴着表格外边界时，通过根据 lineWidth 计算 diffSize，对 rect 做 x/y/width/height 的微调，避免“半条线”现象。

### 4.3 跨区域拆分：calculateCellRangeDistribution + strokeArray

文件：

- packages/vtable/src/scenegraph/select/update-select-border.ts
- packages/vtable/src/scenegraph/select/update-custom-select-border.ts

流程：

1) `calculateCellRangeDistribution(startCol, startRow, endCol, endRow, table)` 判断选区跨越哪些区域。
2) 针对每个需要的区域创建一段选框，传入该段负责的范围。
3) 通过 `strokeArray=[top,right,bottom,left]` 控制该段四边是否绘制，避免跨区域边界重复描边。

自定义选框（CustomSelectionStyle）沿用相同的拆分策略，但只绘制 rect，不包含 fill handle。

### 4.4 selecting → selected 的提交语义

文件：

- packages/vtable/src/scenegraph/select/move-select-border.ts

语义：

- `selectingRangeComponents` 表示“拖拽中”的临时选框
- 鼠标松开后需要迁移到 `selectedRangeComponents`，作为稳定的选中态
- 若同 key 已存在历史段落，先 delete 避免泄漏与重复绘制

### 4.5 删除逻辑：shift 续选与 fill handle 清理

文件：

- packages/vtable/src/scenegraph/select/delete-select-border.ts

要点：

- 通过 `scene.lastSelectId` 识别“上一次选择动作”产生的所有段落（跨区域拆分时 selectId 相同）
- shift 续选需要删除上一次选择段落，再追加新的段落
- 多选区时需要统一移除 fill handle

### 4.6 overlay 裁剪外扩：避免边框与 fill handle 被 clip 截断

文件：

- packages/vtable/src/scenegraph/graphic/contributions/group-contribution-render.ts

要点：

- overlay（select-overlay）组会被各区域 clipRect 裁剪
- 对 overlay 的 clipRect 进行“外扩”（inflate）：
  - baseInflate：覆盖 selection border 的线宽
  - handleInflate：当开启 fill handle 且只有一个选区时，为 6x6 handle 预留空间（3px）

这一层和 4.2 的贴边修正配合，解决“线宽/handle 被裁切”的可见性问题。

### 4.7 场景树重建后的选区恢复

文件：

- packages/vtable/src/scenegraph/scenegraph.ts

要点：

- 数据更新触发 scenegraph 重建会清空 overlay 下的选区图元
- 若 state 中仍存在 select ranges，需要在场景树重建完成后重新创建选区组件，保证选中态不丢失

## 5. 行为对比（摘要）

- 改造前：选区贴边时边框/handle 可能被裁，跨区域容易重复描边，scenegraph 重建后可能丢失选区图元。
- 改造后：通过“跨区域拆分 + strokeArray 去重 + overlay clip 外扩 + 贴边半线宽修正 + 重建后恢复”保证一致性与可维护性。

## 6. 测试建议

- 单选区 + fill handle：拖拽到最后一行/最后一列仍可见且可命中
- 多选区：fill handle 不出现，且历史 handle 会被清理
- 跨区域选择：跨表头/左冻结/右冻结/底部冻结时边框不加粗
- scrollFrozenCols/scrollRightFrozenCols 开启：滚动冻结域时选框与 handle 不被裁切、不漂移

