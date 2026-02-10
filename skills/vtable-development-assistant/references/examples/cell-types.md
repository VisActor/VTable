# 13 种单元格类型示例

## 1. text — 文本（默认）

```javascript
{
  field: 'name',
  title: '姓名',
  width: 120,
  cellType: 'text', // 可省略，默认即 text
  style: { fontWeight: 'bold', color: '#333' }
}
```

## 2. link — 链接

```javascript
{
  field: 'url',
  title: '链接',
  width: 200,
  cellType: 'link',
  linkJump: true,              // 点击跳转
  style: { linkColor: '#1890ff', cursor: 'pointer' }
}
// 模板链接：用 field 值替换模板
{
  field: 'id',
  title: '详情',
  cellType: 'link',
  templateLink: 'https://example.com/detail/{id}',
  linkJump: true
}
```

## 3. image — 图片

```javascript
{
  field: 'avatar',
  title: '头像',
  width: 80,
  cellType: 'image',
  keepAspectRatio: true,
  imageAutoSizing: false,
  style: { padding: 4 }
}
```

## 4. video — 视频

```javascript
{
  field: 'videoUrl',
  title: '视频',
  width: 200,
  cellType: 'video',
  keepAspectRatio: true
}
```

## 5. progressbar — 进度条

```javascript
{
  field: 'completion',
  title: '完成率',
  width: 150,
  cellType: 'progressbar',
  min: 0,
  max: 100,
  barType: 'default',
  style: {
    barColor: (args) => {
      if (args.dataValue >= 80) return '#52c41a';
      if (args.dataValue >= 50) return '#faad14';
      return '#ff4d4f';
    },
    barBgColor: '#f0f0f0',
    barHeight: 12,
    barBottom: 6
  }
}
```

## 6. sparkline — 迷你图

```javascript
{
  field: 'trend',
  title: '趋势',
  width: 180,
  cellType: 'sparkline',
  sparklineSpec: {
    type: 'line',
    xField: { field: 'x' },
    yField: { field: 'y' },
    pointShowRule: 'none',
    line: {
      style: { stroke: '#1890ff', strokeWidth: 2 }
    }
  }
}
// 数据格式: record.trend = [{ x: 1, y: 10 }, { x: 2, y: 15 }, ...]
```

## 7. chart — 嵌入图表

```javascript
import VChart from '@visactor/vchart';
VTable.register.chartModule('vchart', VChart);

{
  field: 'chartData',
  title: '分布',
  width: 250,
  cellType: 'chart',
  chartModule: 'vchart',
  chartSpec: {
    type: 'pie',
    categoryField: 'type',
    valueField: 'value',
    label: { visible: true },
    legends: { visible: false }
  }
}
```

## 8. checkbox — 复选框

```javascript
{
  field: 'selected',
  title: '选择',
  width: 60,
  cellType: 'checkbox',
  // 表头也显示 checkbox（全选）
  headerType: 'checkbox'
}

// 监听变更
table.on('checkbox_state_change', (args) => {
  console.log(args.col, args.row, args.checked);
});

// API
table.getCheckboxState();              // 获取所有 checkbox 状态
table.getCheckboxState({ col: 0 });    // 获取指定列的 checkbox 状态
table.setCellCheckboxState(0, 3, true); // 设置指定单元格选中
```

## 9. radio — 单选框

```javascript
{
  field: 'priority',
  title: '优先级',
  width: 80,
  cellType: 'radio'
}

// 监听变更
table.on('radio_state_change', (args) => {
  console.log(args.col, args.row, args.radioIndexInCell);
});
```

## 10. switch — 开关

```javascript
{
  field: 'enabled',
  title: '启用',
  width: 80,
  cellType: 'switch',
  disable: (args) => args.row === 1  // 禁用第1行
}

// 监听变更
table.on('switch_state_change', (args) => {
  console.log(args.col, args.row, args.checked);
});
```

## 11. button — 按钮

```javascript
{
  field: 'action',
  title: '操作',
  width: 100,
  cellType: 'button',
  text: '点击',
  style: {
    color: '#fff',
    bgColor: '#1890ff',
    cornerRadius: 4,
    padding: [4, 12]
  }
}

// 监听点击
table.on('button_click', (args) => {
  const record = table.getCellOriginRecord(args.col, args.row);
  console.log('按钮点击:', record);
});
```

## 12. composite — 组合

```javascript
// 组合类型通常与 customRender 或 customLayout 配合使用
{
  field: 'info',
  title: '综合信息',
  width: 300,
  cellType: 'composite',
  customLayout: (args) => {
    // ... 使用 JSX 组合多种元素
  }
}
```

## 13. multilinetext — 多行文本

```javascript
{
  field: 'description',
  title: '描述',
  width: 250,
  cellType: 'multilinetext',
  style: {
    autoWrapText: true,
    lineClamp: 3  // 最多3行
  }
}
```

## 单元格类型选择指南

| 需求 | 推荐类型 |
|------|----------|
| 普通文字 | text |
| 可点击跳转 | link |
| 显示头像/图片 | image |
| 百分比/进度 | progressbar |
| 数据趋势 | sparkline |
| 复杂图表 | chart |
| 勾选/多选 | checkbox |
| 单选 | radio |
| 开关 | switch |
| 操作按钮 | button |
| 长文本 | multilinetext |
| 复杂自定义 | composite + customLayout |
