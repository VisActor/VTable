# VTable Custom Render 类型定义

> Custom Render 是元素 API 方式的自定义渲染，通过返回元素数组描述单元格内容。
> 如需更灵活的 JSX/Flex 布局，推荐使用 Custom Layout（见 custom-layout.md）。

## 入口类型

```typescript
/** 自定义渲染函数签名 — 在列定义中通过 customRender 使用 */
export type ICustomRender = (args: CustomRenderFunctionArg) => ICustomRenderObj | null;

/** 自定义渲染函数参数 */
export interface CustomRenderFunctionArg {
  /** 列号 */
  col: number;
  /** 行号 */
  row: number;
  /** 原始数据值 */
  dataValue: any;
  /** 显示值 */
  value: string | number;
  /** 单元格绘制区域 */
  rect: CellRectProps;
  /** 表格实例 */
  table: any;
  /** 当前单元格所属层级（树形表格） */
  treeLevel?: number;
}

/** 单元格绘制区域 */
export interface CellRectProps {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

/** 自定义渲染返回对象 */
export interface ICustomRenderObj {
  /** 元素数组 */
  elements: ICustomRenderElement[];
  /** 期望单元格高度 */
  expectedHeight?: number;
  /** 期望单元格宽度 */
  expectedWidth?: number;
  /** 是否仍然渲染默认内容 */
  renderDefault?: boolean;
}
```

## 7 种元素类型

```typescript
export type ICustomRenderElement =
  | TextElement
  | RectElement
  | CircleElement
  | ArcElement
  | LineElement
  | IconElement
  | ImageElement;
```

### 通用基础属性

```typescript
/** 所有元素共有的基础属性 */
interface BaseElement {
  /** 相对 x 坐标 */
  x: number;
  /** 相对 y 坐标 */
  y: number;
  /** 点击事件 */
  onClick?: (event: any) => void;
  /** hover 光标 */
  cursor?: string;
}
```

### 文本元素

```typescript
export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontColor?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  textBaseline?: 'top' | 'middle' | 'bottom';
  lineHeight?: number;
  underline?: boolean;
  lineThrough?: boolean;
  /** 最大宽度（超出省略） */
  maxLineWidth?: number;
  /** 富文本配置 */
  textConfig?: RichTextConfig[];
}
```

### 矩形元素

```typescript
export interface RectElement extends BaseElement {
  type: 'rect';
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  cornerRadius?: number;
}
```

### 圆形元素

```typescript
export interface CircleElement extends BaseElement {
  type: 'circle';
  radius: number;
  fill?: string;
  stroke?: string;
  lineWidth?: number;
}
```

### 弧形元素

```typescript
export interface ArcElement extends BaseElement {
  type: 'arc';
  radius: number;
  startAngle: number;
  endAngle: number;
  fill?: string;
  stroke?: string;
  lineWidth?: number;
}
```

### 线条元素

```typescript
export interface LineElement extends BaseElement {
  type: 'line';
  points: { x: number; y: number }[];
  stroke?: string;
  lineWidth?: number;
  lineDash?: number[];
}
```

### 图标元素

```typescript
export interface IconElement extends BaseElement {
  type: 'icon';
  /** 注册的图标 SVG 字符串 */
  svg: string;
  width: number;
  height: number;
  /** 图标功能类型 */
  funcType?: string;
  /** hover 状态图标 */
  hoverSvg?: string;
}
```

### 图片元素

```typescript
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
}
```

### 富文本片段

```typescript
/** 富文本片段配置 — 用于 TextElement.textConfig */
export interface RichTextConfig {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontColor?: string;
  fill?: string;
  textDecoration?: 'underline' | 'line-through' | 'none';
  lineHeight?: number;
}
```
