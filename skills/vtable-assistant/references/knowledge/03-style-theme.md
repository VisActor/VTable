# 样式系统与主题

## 一、样式属性速查

所有样式属性定义于 `packages/vtable/src/ts-types/style-define.ts`，可用于列定义的 `style`/`headerStyle` 和主题配置中。

### 文本样式

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `color` | `string \| Function` | `'#000'` | 文字颜色 |
| `fontSize` | `number \| Function` | `14` | 字号 |
| `fontFamily` | `string \| Function` | `'sans-serif'` | 字体 |
| `fontWeight` | `string \| number \| Function` | `'normal'` | 字重 |
| `fontStyle` | `string \| Function` | `'normal'` | 字体样式（italic） |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | 水平对齐 |
| `textBaseline` | `'top' \| 'middle' \| 'bottom'` | `'middle'` | 垂直对齐 |
| `lineHeight` | `number` | — | 行高 |
| `textOverflow` | `string` | `'...'` | 溢出省略字符 |
| `lineClamp` | `number \| 'auto'` | `1` | 最大行数 |
| `autoWrapText` | `boolean` | `false` | 自动换行 |
| `underline` | `boolean \| Function` | `false` | 下划线 |
| `lineThrough` | `boolean \| Function` | `false` | 删除线 |

### 单元格样式

| 属性 | 类型 | 说明 |
|---|---|---|
| `bgColor` | `string \| Function` | 背景色（支持渐变、CanvasPattern） |
| `borderColor` | `string \| string[]` | 边框颜色（可分别设置四边） |
| `borderLineWidth` | `number \| number[]` | 边框宽度（可分别设置四边） |
| `borderLineDash` | `number[] \| number[][]` | 边框虚线样式 |
| `padding` | `number \| number[]` | 内边距（支持 [上,右,下,左]） |
| `cursor` | `string \| Function` | 鼠标指针样式 |

### 特殊样式

| 属性 | 类型 | 说明 |
|---|---|---|
| `textStick` | `boolean` | 文字吸附（滚动时保持可见） |
| `textStickBaseOnAlign` | `boolean` | 吸附基于对齐方式 |
| `marked` | `boolean \| MarkCellStyle \| Function` | 单元格标记（角标） |
| `tag` | `string \| Function` | 标签文字 |

### 标记样式 MarkCellStyle

```typescript
{
  bgColor?: string;      // 标记颜色
  shape?: 'rect' | 'triangle' | 'sector';  // 标记形状
  position?: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  size?: number;         // 标记大小
  offset?: number;       // 偏移量
}
```

## 二、动态样式（回调函数）

所有样式属性都支持回调函数形式，参数为 `StylePropertyFunctionArg`：

```typescript
const columns = [{
  field: 'score',
  title: '分数',
  style: (args) => ({
    // 根据分数值动态设置背景色
    bgColor: args.dataValue >= 90 ? '#f6ffed' :
             args.dataValue >= 60 ? '#e6f7ff' :
             '#fff1f0',
    // 根据分数值动态设置字体颜色
    color: args.dataValue >= 90 ? '#52c41a' :
           args.dataValue >= 60 ? '#1890ff' :
           '#f5222d',
    fontWeight: args.dataValue >= 90 ? 'bold' : 'normal'
  })
}];
```

### StylePropertyFunctionArg 完整定义

```typescript
interface StylePropertyFunctionArg {
  row: number;                        // 行号
  col: number;                        // 列号
  table: BaseTableAPI;                // 表格实例
  value?: FieldData;                  // 格式化后的展示值
  dataValue?: FieldData;              // 原始数据值
  percentile?: number;                // 百分位（进度条用）
  cellHeaderPaths?: ICellHeaderPaths; // 表头路径（透视表用）
}
```

## 三、主题系统

### 内置主题

VTable 提供 5 种内置主题：

```typescript
import { themes } from '@visactor/vtable';

// 使用内置主题
const table = new ListTable({
  theme: themes.ARCO,  // 或 themes.DEFAULT, themes.BRIGHT, themes.DARK, themes.SIMPLIFY
  // ...
});
```

| 主题 | 风格 |
|---|---|
| `themes.DEFAULT` | 默认主题，浅色系 |
| `themes.ARCO` | ArcoDesign 风格 |
| `themes.BRIGHT` | 明亮风格 |
| `themes.DARK` | 暗色主题 |
| `themes.SIMPLIFY` | 简约风格 |

### 自定义主题 ITableThemeDefine

```typescript
const myTheme: VTable.ITableThemeDefine = {
  // 默认样式
  defaultStyle: {
    color: '#333',
    bgColor: '#fff',
    fontSize: 14,
    fontFamily: 'PingFang SC',
    borderColor: '#e1e4e8',
    borderLineWidth: 1,
    padding: [8, 12]
  },

  // 表头样式
  headerStyle: {
    color: '#1f2329',
    bgColor: '#f5f7fa',
    fontSize: 14,
    fontWeight: 'bold',
    borderColor: '#e1e4e8',
    borderLineWidth: 1,
    padding: [8, 12]
  },

  // 行表头样式（透视表用）
  rowHeaderStyle: {
    color: '#1f2329',
    bgColor: '#f5f7fa'
  },

  // 角头样式（透视表用）
  cornerHeaderStyle: {
    color: '#1f2329',
    bgColor: '#e8eaed'
  },

  // body 样式
  bodyStyle: {
    color: '#333',
    bgColor: '#fff',
    hover: {
      cellBgColor: '#e6f7ff',
      inlineColumnBgColor: '#f0f5ff',
      inlineRowBgColor: '#f0f5ff'
    }
  },

  // 选择框样式
  selectionStyle: {
    cellBorderColor: '#1890ff',
    cellBorderLineWidth: 2,
    cellBgColor: 'rgba(24,144,255,0.1)'
  },

  // 边框样式
  frameStyle: {
    borderColor: '#e1e4e8',
    borderLineWidth: 1,
    borderLineDash: [],
    cornerRadius: 4,       // 表格圆角
    shadowBlur: 0
  },

  // 滚动条样式
  scrollStyle: {
    visible: 'scrolling',  // 'always' | 'scrolling' | 'none' | 'focus'
    scrollSliderColor: 'rgba(0,0,0,0.3)',
    scrollRailColor: 'rgba(0,0,0,0.05)',
    width: 7,
    hoverOn: true          // hover 时变粗
  },

  // 冻结列分割线样式
  frozenColumnLine: {
    shadow: {
      width: 4,
      startColor: 'rgba(0,0,0,0.05)',
      endColor: 'transparent'
    }
  },

  // 提示框样式
  tooltipStyle: {
    bgColor: '#333',
    color: '#fff',
    fontSize: 12,
    padding: [6, 8]
  }
};
```

### 基于内置主题扩展

```typescript
import { themes } from '@visactor/vtable';

const customTheme = {
  ...themes.ARCO,
  bodyStyle: {
    ...themes.ARCO.bodyStyle,
    color: '#1f2329',
    hover: {
      cellBgColor: '#e8f3ff',
      inlineColumnBgColor: '#f2f3f5',
      inlineRowBgColor: '#f2f3f5'
    }
  },
  selectionStyle: {
    cellBorderColor: '#165DFF',
    cellBorderLineWidth: 2,
    cellBgColor: 'rgba(22,93,255,0.1)'
  }
};
```

## 四、registerCustomCellStyle — 运行时自定义样式

可以在运行时注册和分配自定义样式：

```typescript
// 1. 注册样式
table.registerCustomCellStyle('highlight', {
  bgColor: '#ffffcc',
  color: '#f5222d',
  fontWeight: 'bold'
});

// 2. 分配样式到单元格
table.arrangeCustomCellStyle({
  cellPosition: { col: 2, row: 3 },   // 单个单元格
  customStyleId: 'highlight'
});

// 或分配到区域
table.arrangeCustomCellStyle({
  cellPosition: {
    range: { start: { col: 1, row: 1 }, end: { col: 3, row: 5 } }
  },
  customStyleId: 'highlight'
});
```

也可以通过配置项预注册：

```typescript
const table = new ListTable({
  customCellStyle: [
    { id: 'warning', style: { bgColor: '#fff7e6', color: '#fa8c16' } },
    { id: 'error', style: { bgColor: '#fff1f0', color: '#f5222d' } }
  ],
  customCellStyleArrangement: [
    { cellPosition: { col: 1, row: 2 }, customStyleId: 'warning' }
  ]
});
```
