# VTable Custom Layout（JSX 方式）类型定义

> Custom Layout 使用 JSX 语法描述单元格内容，支持 Flex 布局，是推荐的自定义渲染方案。
> 元素 API 方式见 custom-render.md。

## 入口类型

```typescript
/** JSX 布局函数签名 — 在列定义中通过 customLayout 使用 */
export type ICustomLayout = (args: CustomRenderFunctionArg) => ICustomLayoutObj;

/** 自定义布局返回对象 */
export interface ICustomLayoutObj {
  /** JSX 根节点 */
  rootContainer: VRenderJSXElement;
  /** 是否仍然渲染默认内容 */
  renderDefault?: boolean;
  /** 期望单元格高度 */
  expectedHeight?: number;
  /** 期望单元格宽度 */
  expectedWidth?: number;
  /** 是否可 hover 响应子元素 */
  enableCellPadding?: boolean;
}

/** 自定义渲染函数参数（与 Custom Render 共用） */
export interface CustomRenderFunctionArg {
  col: number;
  row: number;
  dataValue: any;
  value: string | number;
  rect: { left: number; top: number; width: number; height: number; right: number; bottom: number };
  table: any;
  treeLevel?: number;
}

/** VRender JSX 元素 — JSX 表达式返回值 */
type VRenderJSXElement = any;
```

## 组件引入方式

```typescript
import * as VTable from '@visactor/vtable';
const { Group, Text, Image, Rect, Circle, Arc, Tag, Line, Checkbox, Radio } = VTable.CustomLayout;
```

## Group — 容器 / Flex 布局

```typescript
export interface GroupProps {
  /** 开启 Flex 布局 */
  display?: 'flex';
  /** 主轴方向 */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** 换行 */
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  /** 主轴对齐 */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  /** 交叉轴对齐 */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  /** 自身交叉轴对齐 */
  alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  /** 自身 flex 占比 */
  flex?: number;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 内边距 */
  padding?: number | number[];
  /** 外边距 */
  margin?: number | number[];
  /** 背景色 */
  fill?: string;
  /** 圆角 */
  cornerRadius?: number;
  /** 边框色 */
  stroke?: string;
  /** 边框宽度 */
  lineWidth?: number;
  /** 光标 */
  cursor?: string;
  /** 点击事件 */
  onClick?: (event: any) => void;
  /** hover 事件 */
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  /** 裁剪溢出内容 */
  clip?: boolean;
}
```

## Text — 文本

```typescript
export interface TextProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fill?: string;
  textAlign?: 'left' | 'center' | 'right';
  textBaseline?: 'top' | 'middle' | 'bottom';
  /** 最大宽度 */
  maxLineWidth?: number;
  /** 是否省略 */
  ellipsis?: boolean | string;
  /** 行高 */
  lineHeight?: number;
  underline?: boolean;
  lineThrough?: boolean;
  cursor?: string;
  onClick?: (event: any) => void;
  margin?: number | number[];
  flex?: number;
}
```

## Image — 图片

```typescript
export interface ImageProps {
  src: string;
  width: number;
  height: number;
  cornerRadius?: number;
  margin?: number | number[];
  cursor?: string;
  onClick?: (event: any) => void;
}
```

## Rect — 矩形

```typescript
export interface RectProps {
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  cornerRadius?: number;
  margin?: number | number[];
}
```

## Circle — 圆形

```typescript
export interface CircleProps {
  radius: number;
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  margin?: number | number[];
}
```

## Arc — 弧形

```typescript
export interface ArcProps {
  outerRadius: number;
  innerRadius?: number;
  startAngle: number;
  endAngle: number;
  fill?: string;
  stroke?: string;
  margin?: number | number[];
}
```

## Tag — 标签（文本 + 背景）

```typescript
export interface TagProps {
  text: string;
  fill?: string;
  textStyle?: {
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    fontWeight?: string | number;
  };
  padding?: number | number[];
  cornerRadius?: number;
  margin?: number | number[];
  cursor?: string;
  onClick?: (event: any) => void;
}
```

## Line — 线条

```typescript
export interface LineProps {
  points: { x: number; y: number }[];
  stroke?: string;
  lineWidth?: number;
  lineDash?: number[];
  margin?: number | number[];
}
```

## Checkbox — 复选框

```typescript
export interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  text?: string;
  cursor?: string;
  onChange?: (checked: boolean) => void;
  margin?: number | number[];
}
```

## Radio — 单选框

```typescript
export interface RadioProps {
  checked: boolean;
  disabled?: boolean;
  text?: string;
  cursor?: string;
  onChange?: (checked: boolean) => void;
  margin?: number | number[];
}
```

## 使用示例

```tsx
customLayout: args => {
  const { table, row, col, rect, dataValue } = args;
  const record = table.getCellOriginRecord(col, row);

  const container = (
    <Group display="flex" flexDirection="row" alignItems="center" padding={8}>
      <Image src={record.avatar} width={40} height={40} cornerRadius={20} />
      <Group display="flex" flexDirection="column" margin={[0, 0, 0, 8]} flex={1}>
        <Text text={record.name} fontSize={14} fontWeight="bold" fill="#333" />
        <Text text={record.role} fontSize={12} fill="#999" margin={[4, 0, 0, 0]} />
      </Group>
      <Tag
        text={record.status}
        fill={record.status === 'active' ? '#e6f7e6' : '#fff3e6'}
        textStyle={{ fill: record.status === 'active' ? '#52c41a' : '#fa8c16', fontSize: 11 }}
        padding={[2, 6]}
        cornerRadius={4}
      />
    </Group>
  );
  return {
    rootContainer: container,
    renderDefault: false
  };
};
```
