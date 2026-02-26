# 场景二处理流程：VTable配置生成

## 适用情况

- 用户从零创建表格
- 用户在已有配置上新增功能或修改效果

## 生成模式

- 完整生成：无现有配置，输出完整可运行 HTML
- 增量生成：有现有配置，合并变更后输出完整可运行 HTML

## 生成流程

1. 识别表格类型与核心需求
2. 构建数据结构与列定义
3. 加入交互、样式、事件配置
4. 产出可运行 HTML

## 输出要求

- 必须输出可运行 HTML
- 必须通过脚本生成 HTML，不允许手写 HTML 或只给片段
- 示例包含可直接运行的完整初始化代码
 - 若未输出脚本命令与文件路径，视为未完成

## 生成方式

使用脚本生成演示 HTML：

```bash
python3 scripts/generate_demo_html.py --spec-file spec.js
```

输出必须包含脚本命令与生成文件路径，确保可复现。

## 输入代码规范

- spec.js 仅保留可执行的表格配置代码
- 移除 `import` / `export` 语句，避免在 HTML 中执行时报错
- 支持复杂代码结构：可将数据、注册逻辑、配置分开定义，也可使用 try/catch 包裹
- `container` 字段可写为 `document.getElementById('container')`，模板会自动替换为实际渲染容器
- PivotChart + VChart 场景无需手动加载 VChart CDN，模板已内置

spec.js 简单示例：

```javascript
const tableInstance = new VTable.ListTable({
  container: document.getElementById('container'),
  records: [{ name: "张三", age: 25 }],
  columns: [
    { field: "name", title: "姓名", width: 100 },
    { field: "age", title: "年龄", width: 80 }
  ],
  width: 600,
  height: 400
});
```

spec.js 复杂示例（PivotChart + 外部数据）：

```javascript
const records = [
  { region: '华东', category: '办公用品', month: '1月', sales: 1200 },
  { region: '华东', category: '办公用品', month: '2月', sales: 1350 }
];

if (typeof VChart !== 'undefined' && VTable.register && typeof VTable.register.chartModule === 'function') {
  VTable.register.chartModule('vchart', VChart);
}

const options = {
  container: document.getElementById('container'),
  records,
  rows: [{ dimensionKey: 'region', title: '地区', width: 120 }],
  columns: [],
  indicators: [{
    indicatorKey: 'sales',
    title: '销售额趋势',
    cellType: 'chart',
    chartModule: 'vchart',
    chartSpec: { type: 'line', xField: 'month', yField: 'sales' }
  }],
  width: 800,
  height: 400
};

const tableInstance = new VTable.PivotChart(options);
```
