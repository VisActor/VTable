# VRender 图元/节点速查（面向 Debug）

## 关键字段（建议优先读取）

大多数 VRender 节点（IGraphic / INode 体系）都具备或常见以下字段：
- `type`: 图元类型（常见：`group` / `rect` / `text` / `richtext` / `symbol` / `path` / `image` / ...）
- `name`: 业务命名（VTable 会给部分节点命名，便于查找）
- `attribute`: 属性对象（位置、尺寸、颜色、文本、可见性等）
- `AABBBounds`: 本地包围盒（AABB）
- `globalAABBBounds`: 全局包围盒（更适合与截图/overlay 对齐）
- `stage`: 所属舞台（scenegraph.stage）

Group（容器）额外常见：
- `childrenCount`, `children`（可能存在数组形式）
- `_firstChild/_next`（链表形式，遍历更稳定）
- `forEachChildren(cb)`（遍历 API）

## 常见 attribute 字段（按需）

注意：不同 type 的 attribute 字段差异较大，这里列出最常用且跨类型稳定的字段。

布局/可见性：
- `x`, `y`, `dx`, `dy`
- `width`, `height`
- `visible`
- `opacity`

样式（部分类型支持）：
- `fill`, `stroke`, `lineWidth`, `lineDash`
- `cornerRadius` / `cornerType`（圆角）

文本（text / richtext / 带 text 能力的节点）：
- `text`
- `fontFamily`, `fontSize`, `fontWeight`
- `textAlign`, `textBaseline`
- `fill`（文字色常复用 fill）

## Debug 建议的最小摘要（用于日志/比对）

对任意节点生成摘要时，优先输出：
- `type/name/role/col/row`
- `visible`
- `bounds: globalAABBBounds`（x1,y1,x2,y2,w,h）
- `attr: x/y/width/height/fill/stroke/lineWidth/text`

这样可以：
- 快速确认节点是否存在
- 快速确认节点是否画在正确区域
- 快速确认“看起来像样式问题”是否其实是节点缺失/不可见/尺寸为 0

## 与截图对齐的坐标换算

当把 bounds 画到浏览器屏幕上时，建议按 stage 尺寸换算：
1. 获取 canvas DOM rect：`const rect = canvas.getBoundingClientRect()`
2. 获取 stage 尺寸：`const stage = table.scenegraph.stage`
3. 换算比例：
   - `scaleX = rect.width / stage.width`
   - `scaleY = rect.height / stage.height`
4. 屏幕坐标：
   - `left = rect.left + bounds.x1 * scaleX`
   - `top  = rect.top  + bounds.y1 * scaleY`
   - `w    = (bounds.x2 - bounds.x1) * scaleX`
   - `h    = (bounds.y2 - bounds.y1) * scaleY`

如果框整体偏移或缩放不对：
- 优先检查拿到的 canvas 是否就是 scenegraph.stage 在用的那张 canvas（VTable 可能在容器中嵌套多层）
- 检查 stage.width/height 是否等于 viewBox 或 canvas 尺寸（Scenegraph 构造逻辑会根据配置切换）

