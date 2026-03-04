# 场景一处理流程：VTable问题诊断

## 适用情况

- 用户提供现有代码并描述不工作、报错、显示异常
- 用户询问如何优化或修复现有表格

## 需要收集的信息

- 完整的表格初始化代码
- 数据样本（至少 3-5 条）
- 具体报错或异常表现
- 期望效果

## 诊断流程

1. 确认表格类型（ListTable / PivotTable / PivotChart）
2. 检查必填字段（container、records/rows/columns/indicators）
3. 核对字段映射与数据结构一致性
4. 逐项核对交互、样式、事件配置是否生效
5. 给出可运行修复方案

## 输出要求

- 必须输出可运行 HTML
- 必须通过脚本生成 HTML，不允许手写 HTML 或只给片段
- 包含问题回顾、诊断结论、修复方案
 - 若未输出脚本命令与文件路径，视为未完成

## 生成方式

使用脚本生成诊断 HTML：

```bash
python3 scripts/generate_diagnosis_html.py --config-file config.js
```

输出必须包含脚本命令与生成文件路径，确保可复现。

## 输入代码规范

- config.js 中的 specCode 保留可执行配置代码
- 移除 `import` / `export` 语句

配置文件结构：

```javascript
const problemReview = { specCode: `...`, highlightLines: [1, 2] };
const diagnosis = { problem: "...", cause: "...", suggestion: "..." };
const solutions = [
  { title: "...", description: "...", specCode: `...`, highlightLines: [3] }
];
```
