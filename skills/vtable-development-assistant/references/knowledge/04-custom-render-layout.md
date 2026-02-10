# 自定义渲染与布局

VTable 提供两套自定义渲染方案：**Custom Render**（低级元素 API）和 **Custom Layout**（高级 JSX 布局 API）。

## 一、Custom Render — 元素 API

### 使用方式

在列定义中配置 `customRender` 或 `headerCustomRender`：

```typescript
{
  field: 'info',
  title: '信息',
  customRender: (args: CustomRenderFunctionArg) => {
    return {
      renderDefault: false,   // 是否也渲染默认内容
      elements: [
        // 元素数组
      ]
    };
  }
}
```

### CustomRenderFunctionArg 参数

```typescript
interface CustomRenderFunctionArg {
  col: number;           // 列号
  row: number;           // 行号
  value: FieldData;      // 格式化后的值
  dataValue: FieldData;  // 原始值
  rect: RectProps;       // 单元格矩形 { left, right, top, bottom, width, height }
  table: BaseTableAPI;   // 表格实例
  cellHeaderPaths?: ICellHeaderPaths;  // 表头路径
}
```

### 7 种元素类型

#### text — 文本

```typescript
{
  type: 'text',
  x: 10, y: 10,
  text: '标题文字',
  fill: '#333',
  fontSize: 14,
  fontFamily: 'PingFang SC',
  fontWeight: 'bold',
  textAlign: 'left',
  textBaseline: 'top',
  ellipsis: true,      // 溢出省略
  lineClamp: 2,        // 最大行数
  maxLineWidth: 100    // 最大行宽
}
```

#### rect — 矩形

```typescript
{
  type: 'rect',
  x: 0, y: 0,
  width: 100, height: 30,
  fill: '#e6f7ff',
  stroke: '#1890ff',
  lineWidth: 1,
  radius: 4            // 圆角
}
```

#### circle — 圆形

```typescript
{
  type: 'circle',
  x: 20, y: 20,
  radius: 10,
  fill: '#52c41a',
  stroke: '#389e0d',
  lineWidth: 1
}
```

#### arc — 弧形

```typescript
{
  type: 'arc',
  x: 30, y: 30,
  radius: 20,
  startAngle: 0,
  endAngle: Math.PI * 1.5,
  fill: '#1890ff',
  stroke: '#096dd9',
  lineWidth: 2
}
```

#### line — 线段

```typescript
{
  type: 'line',
  points: [
    { x: 0, y: 20 },
    { x: 50, y: 10 },
    { x: 100, y: 30 }
  ],
  stroke: '#1890ff',
  lineWidth: 2
}
```

#### icon — SVG 图标

```typescript
{
  type: 'icon',
  x: 5, y: 5,
  width: 20, height: 20,
  svg: '<svg>...</svg>',
  hover: {
    width: 22, height: 22  // hover 时放大
  }
}
```

#### image — 图片

```typescript
{
  type: 'image',
  x: 5, y: 5,
  width: 40, height: 40,
  src: 'https://example.com/avatar.png',
  shape: 'circle',     // 'circle' | 'square'
  hover: {
    width: 44, height: 44
  }
}
```

### 完整示例

```typescript
{
  field: 'user',
  title: '用户',
  width: 200,
  customRender: (args) => {
    const { rect, dataValue, table } = args;
    const record = table.getCellOriginRecord(args.col, args.row);
    return {
      renderDefault: false,
      elements: [
        // 头像
        {
          type: 'image',
          x: 10, y: 8,
          width: 32, height: 32,
          src: record.avatar,
          shape: 'circle'
        },
        // 用户名
        {
          type: 'text',
          x: 50, y: 10,
          text: record.name,
          fill: '#1f2329',
          fontSize: 14,
          fontWeight: 'bold'
        },
        // 描述
        {
          type: 'text',
          x: 50, y: 28,
          text: record.desc,
          fill: '#86909c',
          fontSize: 12
        }
      ]
    };
  }
}
```

---

## 二、Custom Layout — JSX 布局 API（推荐）

Custom Layout 使用 VRender 的场景图原语，支持 **Flex 布局**，开发体验更好。

### 使用方式

```typescript
import { Group, Text, Image, Rect, Tag } from '@visactor/vtable';

{
  field: 'user',
  title: '用户',
  width: 250,
  customLayout: (args) => {
    const { table, row, col, rect, value } = args;
    const record = table.getCellOriginRecord(col, row);
    
    const container = (
      <Group display="flex" flexDirection="row" alignItems="center"
             width={rect.width} height={rect.height} padding={[8, 12]}>
        <Image
          src={record.avatar}
          width={36} height={36}
          cornerRadius={18}
        />
        <Group display="flex" flexDirection="column" padding={[0, 0, 0, 8]}>
          <Text text={record.name} fontSize={14} fontWeight="bold" fill="#1f2329" />
          <Text text={record.desc} fontSize={12} fill="#86909c" />
        </Group>
      </Group>
    );

    return {
      rootContainer: container,
      renderDefault: false
    };
  }
}
```

### 可用 JSX 原语

| 原语 | 说明 | 关键属性 |
|---|---|---|
| `Group` | 容器/布局 | `display`, `flexDirection`, `alignItems`, `justifyContent`, `flexWrap`, `gap` |
| `Text` | 文本 | `text`, `fontSize`, `fill`, `fontWeight`, `maxLineWidth`, `ellipsis` |
| `Rect` | 矩形 | `width`, `height`, `fill`, `stroke`, `cornerRadius` |
| `Circle` | 圆形 | `radius`, `fill`, `stroke` |
| `Image` | 图片 | `src`, `width`, `height`, `cornerRadius` |
| `Arc` | 弧形 | `radius`, `startAngle`, `endAngle`, `fill` |
| `Tag` | 标签 | `text`, `fill`, `textStyle`, `padding`, `cornerRadius` |
| `Line` | 线段 | `points`, `stroke`, `lineWidth` |
| `Checkbox` | 复选框 | `checked`, `text` |
| `Radio` | 单选框 | `checked`, `text` |

### Flex 布局属性

Group 支持完整的 Flex 布局：

```typescript
<Group
  display="flex"
  flexDirection="row"        // 'row' | 'column' | 'row-reverse' | 'column-reverse'
  alignItems="center"        // 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justifyContent="flex-start" // 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  flexWrap="wrap"            // 'nowrap' | 'wrap'
  gap={8}                    // 子元素间距
  padding={[8, 12]}          // 内边距
  width={rect.width}
  height={rect.height}
>
  {/* 子元素 */}
</Group>
```

### 事件绑定

JSX 元素支持事件绑定：

```typescript
<Group
  cursor="pointer"
  onMouseEnter={(event) => { /* hover效果 */ }}
  onMouseLeave={(event) => { /* 取消hover */ }}
  onClick={(event) => {
    console.log('点击了', args.row, args.col);
  }}
>
  <Text text="点击我" fill="#1890ff" />
</Group>
```

### 响应式自定义样式

```typescript
customLayout: (args) => {
  const { rect, table, col, row } = args;
  const record = table.getCellOriginRecord(col, row);
  
  // 根据数据动态生成标签
  const tags = record.tags?.map((tag, i) => (
    <Tag
      key={i}
      text={tag}
      fill="#e6f7ff"
      textStyle={{ fill: '#1890ff', fontSize: 12 }}
      padding={[2, 6]}
      cornerRadius={3}
    />
  )) ?? [];

  return {
    rootContainer: (
      <Group display="flex" flexDirection="row" flexWrap="wrap" gap={4}
             width={rect.width} height={rect.height} padding={[6, 8]}>
        {tags}
      </Group>
    ),
    renderDefault: false
  };
}
```

---

## 三、全局自定义渲染

可在表格级别设置全局 customRender/customLayout：

```typescript
const table = new ListTable({
  customRender: (args) => {
    // 对所有单元格生效
    // ...
  },
  headerCustomRender: (args) => {
    // 对所有表头单元格生效
    // ...
  },
  customLayout: (args) => {
    // 全局 JSX 布局
    // ...
  }
});
```

列定义上的 customRender/customLayout 优先级高于全局配置。

---

## 四、两套方案对比

| 特性 | Custom Render | Custom Layout |
|---|---|---|
| 定位方式 | 绝对坐标 (x, y) | Flex 布局（自动排列） |
| 学习成本 | 低 | 中（需了解 Flex） |
| 布局能力 | 手动计算位置 | 自动 Flex 排列 |
| 事件支持 | 有限 | 完整事件系统 |
| 适用场景 | 简单图元组合 | 复杂卡片式布局 |
| 推荐程度 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**建议**: 新项目优先使用 Custom Layout（JSX 方案），只在极简场景下使用 Custom Render。
