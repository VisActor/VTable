# 列定义与单元格类型

## 一、列定义结构

ListTable 的 `columns` 配置使用 `ColumnsDefine` 类型，定义于 `packages/vtable/src/ts-types/list-table/define/`。

```typescript
type ColumnsDefine = (ColumnDefine | GroupColumnDefine)[];

// 13 种列定义的联合类型
type ColumnDefine = TextColumnDefine | LinkColumnDefine | ImageColumnDefine | SparklineColumnDefine 
  | ProgressbarColumnDefine | ChartColumnDefine | CheckboxColumnDefine | RadioColumnDefine 
  | SwitchColumnDefine | ButtonColumnDefine | CompositeColumnDefine | VideoColumnDefine 
  | MultilineTextColumnDefine;

// 分组列（嵌套表头）
interface GroupColumnDefine {
  title: string;
  headerStyle?: ColumnStyleOption;
  headerIcon?: string | ColumnIconOption | (string | ColumnIconOption)[];
  columns: ColumnsDefine;   // 递归嵌套
}
```

## 二、公共列属性 (所有列类型共享)

来自 `HeaderDefine` + `ColumnBodyDefine`：

### 表头属性 (HeaderDefine)

| 属性 | 类型 | 说明 |
|---|---|---|
| `title` | `string` | 列标题 |
| `headerType` | `ColumnTypeOption` | 表头单元格类型 |
| `headerStyle` | `ColumnStyleOption \| Function` | 表头样式 |
| `headerIcon` | `string \| ColumnIconOption \| Array` | 表头图标 |
| `headerCustomRender` | `ICustomRender` | 表头自定义渲染 |
| `headerCustomLayout` | `ICustomLayout` | 表头自定义布局 |
| `headerEditor` | `string \| IEditor \| Function` | 表头编辑器 |
| `sort` | `boolean \| Function` | 排序配置 |
| `showSort` | `boolean` | 仅显示排序图标不排序 |
| `dropDownMenu` | `MenuListItem[]` | 下拉菜单项 |
| `description` | `string` | 表头描述（hover 提示） |
| `disableHeaderHover` | `boolean` | 禁用表头 hover |
| `disableHeaderSelect` | `boolean` | 禁用表头选中 |

### Body 属性 (ColumnBodyDefine)

| 属性 | 类型 | 说明 |
|---|---|---|
| `field` | `string \| number \| string[]` | 数据字段名（支持嵌套 `'a.b.c'`） |
| `fieldFormat` | `Function` | 数据格式化函数 |
| `cellType` | `ColumnTypeOption` | 单元格类型 |
| `width` | `number \| string` | 列宽（支持百分比 `'20%'`） |
| `minWidth` | `number \| string` | 最小列宽 |
| `maxWidth` | `number \| string` | 最大列宽 |
| `style` | `ColumnStyleOption \| Function` | 单元格样式 |
| `icon` | `string \| ColumnIconOption \| Array \| Function` | 单元格图标 |
| `customRender` | `ICustomRender` | 自定义渲染 |
| `customLayout` | `ICustomLayout` | 自定义布局 |
| `editor` | `string \| IEditor \| Function` | 编辑器 |
| `tree` | `boolean` | 是否为树形展示列 |
| `mergeCell` | `boolean \| Function` | 合并单元格 |
| `aggregation` | `Aggregation \| Aggregation[]` | 聚合计算 |
| `hide` | `boolean` | 隐藏列 |
| `disableHover` | `boolean` | 禁用 hover |
| `disableSelect` | `boolean` | 禁用选中 |
| `disableColumnResize` | `boolean` | 禁止调整列宽 |
| `dragHeader` | `boolean` | 是否允许拖拽表头 |

## 三、13 种单元格类型详解

### 1. text — 文本（默认类型）

```typescript
{
  field: 'name',
  title: '姓名',
  cellType: 'text',    // 可省略，默认就是 text
  width: 120,
  style: {
    color: '#333',
    fontSize: 14,
    textAlign: 'left'
  }
}
```

### 2. link — 链接

```typescript
{
  field: 'url',
  title: '链接',
  cellType: 'link',
  linkJump: true,           // 点击跳转
  linkDetect: true,          // 自动检测 URL
  templateLink: 'https://example.com/{id}',  // URL 模板
  style: {
    color: '#1890ff',
    underline: true
  }
}
```

### 3. image — 图片

```typescript
{
  field: 'avatar',
  title: '头像',
  cellType: 'image',
  width: 80,
  keepAspectRatio: true,     // 保持宽高比
  imageAutoSizing: false,    // 图片自适应大小
  style: {
    margin: 4                // 图片边距
  }
}
```

### 4. video — 视频

```typescript
{
  field: 'videoUrl',
  title: '视频',
  cellType: 'video',
  width: 200
}
```

### 5. progressbar — 进度条

```typescript
{
  field: 'progress',
  title: '进度',
  cellType: 'progressbar',
  min: 0,
  max: 100,
  barType: 'default',   // 'default' | 'negative' | 'negative_no_axis'
  style: {
    barHeight: 20,
    barColor: (value) => value > 80 ? '#52c41a' : '#1890ff',
    barBgColor: '#f5f5f5',
    barBorderRadius: 10
  }
}
```

### 6. sparkline — 迷你图

```typescript
{
  field: 'trend',
  title: '趋势',
  cellType: 'sparkline',
  width: 200,
  sparklineSpec: {
    type: 'line',            // 'line' | 'area' | 'bar'
    xField: { field: 'x' },
    yField: { field: 'y' },
    line: { style: { stroke: '#1890ff', lineWidth: 2 } },
    point: { style: { fill: '#1890ff' } }
  }
}
```

### 7. chart — 嵌入图表

需要先注册 VChart 模块：`register.bindChartModule(VChart)`

```typescript
{
  field: 'chartData',
  title: '图表',
  cellType: 'chart',
  chartModule: 'vchart',
  width: 300,
  chartSpec: {
    type: 'bar',
    data: { id: 'data' },
    xField: 'x',
    yField: 'y'
  }
}
```

### 8. checkbox — 复选框

```typescript
{
  field: 'checked',
  title: '选中',
  cellType: 'checkbox',
  headerType: 'checkbox',   // 表头也是复选框
  checked: true,             // 默认值
  disable: false
}
```

### 9. radio — 单选框

```typescript
{
  field: 'selected',
  title: '选择',
  cellType: 'radio',
  radioCheckType: 'column',  // 'cell' | 'column' — 整列单选互斥
  radioDirectionInCell: 'horizontal'  // 同一单元格内多选项排列方向
}
```

### 10. switch — 开关

```typescript
{
  field: 'enabled',
  title: '启用',
  cellType: 'switch'
}
```

### 11. button — 按钮

```typescript
{
  field: 'action',
  title: '操作',
  cellType: 'button',
  text: '编辑',           // 按钮文字（也可以从 field 取值）
  style: {
    color: '#fff',
    bgColor: '#1890ff',
    borderRadius: 4,
    padding: [4, 12]
  }
}
```

### 12. composite — 组合单元格

在一个单元格中组合多种元素：

```typescript
{
  title: '综合信息',
  cellType: 'composite',
  columns: [
    { cellType: 'image', field: 'avatar', width: 40 },
    {
      cellType: 'composite',
      columns: [
        { cellType: 'text', field: 'name', style: { fontWeight: 'bold' } },
        { cellType: 'text', field: 'desc', style: { fontSize: 12, color: '#999' } }
      ],
      layout: 'vertical'
    }
  ]
}
```

### 13. multilinetext — 多行文本

```typescript
{
  field: 'content',
  title: '内容',
  cellType: 'multilinetext',
  autoWrapText: true,
  style: {
    autoWrapText: true,
    lineHeight: 20
  }
}
```

## 四、列类型选择指南

| 数据类型 | 推荐 cellType | 备注 |
|---|---|---|
| 普通文本/数字 | `text` | 默认类型，最常用 |
| URL/链接 | `link` | 支持自动检测和跳转 |
| 图片 URL | `image` | 支持保持宽高比 |
| 布尔值/开关 | `checkbox` / `switch` | checkbox 支持表头全选 |
| 数值进度 | `progressbar` | 可配色、可显示负值 |
| 时序数据 | `sparkline` | 迷你折线/面积/柱状图 |
| 复杂图表 | `chart` | 集成 VChart，功能最强 |
| 单选 | `radio` | 支持整列互斥 |
| 多字段组合 | `composite` | 一个单元格展示多字段 |
| 操作按钮 | `button` | 支持点击事件 |

## 五、列样式 ColumnStyleOption

所有列类型的 `style` 和 `headerStyle` 属性使用 `ColumnStyleOption` 类型，支持静态值或回调函数：

```typescript
// 静态样式
style: {
  bgColor: '#f5f5f5',
  color: '#333',
  fontSize: 14
}

// 动态样式（根据数据变化）
style: (args: StylePropertyFunctionArg) => {
  return {
    bgColor: args.dataValue > 100 ? '#e6f7ff' : '#fff',
    color: args.dataValue > 100 ? '#1890ff' : '#333'
  };
}
```

`StylePropertyFunctionArg` 参数：
```typescript
{
  row: number;           // 行号
  col: number;           // 列号
  table: BaseTableAPI;   // 表格实例
  value?: FieldData;     // 格式化后的值
  dataValue?: FieldData; // 原始值
  cellHeaderPaths?: ICellHeaderPaths;  // 表头路径
}
```
