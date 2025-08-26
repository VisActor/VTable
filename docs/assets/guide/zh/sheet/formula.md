# 公式功能

VTable-Sheet提供类似Excel的公式功能，支持在单元格中输入公式进行计算，使表格具备更强大的数据处理能力。

## 公式基础

在VTable-Sheet中，公式以`=`开头，可以在单元格中使用，也可以通过API进行设置。

### 公式输入方式

1. **直接输入**：选中单元格，在公式栏中输入以`=`开头的公式
2. **API设置**：使用`FormulaManager`的API设置公式

### 支持的公式类型

VTable-Sheet目前支持以下常用函数：

| 函数名 | 说明 | 示例 |
|-------|------|------|
| SUM | 计算指定范围内的数值总和 | `=SUM(A1:A5)` |
| AVERAGE | 计算指定范围内的数值平均值 | `=AVERAGE(B1:B10)` |
| MAX | 返回指定范围内的最大值 | `=MAX(C1:C20)` |
| MIN | 返回指定范围内的最小值 | `=MIN(D1:D15)` |
| COUNT | 计算指定范围内非空单元格的数量 | `=COUNT(A1:D10)` |
| IF | 条件判断，根据条件返回不同的值 | `=IF(A1>100,"高","低")` |

## 启用公式功能

要使用公式功能，需要在创建VTableSheet实例时启用公式栏：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  showFormulaBar: true,  // 启用公式栏
  // 其他配置...
});
```

## 通过API设置公式

可以使用`FormulaManager`在代码中设置公式：

```typescript
// 获取公式管理器
const formulaManager = sheetInstance.getFormulaManager();

// 为单元格注册公式
formulaManager.registerFormula({
  sheet: 'sheet1',  // 表格页key
  row: 5,          // 行索引（从0开始）
  col: 3           // 列索引（从0开始）
}, 'SUM(B1:B5)');  // 公式内容（无需=号）

// 批量设置多个公式
for (let row = 1; row <= 4; row++) {
  formulaManager.registerFormula({
    sheet: 'sales',
    row: row,
    col: 5
  }, `SUM(B${row+1}:E${row+1})`);
}
```

## 单元格引用

公式中可以使用单元格引用，支持以下格式：

- **单个单元格**：`A1`、`B5`
- **单元格范围**：`A1:B5`、`C2:E8`
- **整行引用**：`5:5`（第5行）
- **整列引用**：`A:A`（A列）

## 公式计算示例

以下是一些常用公式的示例：

### 求和公式

```
=SUM(B2:B10)      // 计算B2到B10单元格的总和
=SUM(A1:D1)       // 计算A1到D1单元格的总和
=SUM(A1,B2,C3)    // 计算A1、B2、C3单元格的总和
```

### 平均值公式

```
=AVERAGE(C2:C8)   // 计算C2到C8单元格的平均值
```

### 最大值和最小值公式

```
=MAX(D1:D20)      // 获取D1到D20单元格的最大值
=MIN(E1:E15)      // 获取E1到E15单元格的最小值
```

### 条件判断公式

```
=IF(A1>100,"大于100","小于等于100")  // 如果A1大于100，返回"大于100"，否则返回"小于等于100"
=IF(B2="完成","√","×")              // 如果B2的值为"完成"，返回"√"，否则返回"×"
```

## 公式依赖和自动计算

当公式依赖的单元格内容发生变化时，VTable-Sheet会自动重新计算公式结果。

例如，如果单元格C1包含公式`=SUM(A1:B1)`，那么当A1或B1的值发生变化时，C1的值会自动更新。

## 完整示例：销售数据分析表

以下是一个使用公式功能的完整示例，创建一个销售数据分析表：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>VTable-Sheet公式示例</title>
  <style>
    #formula-container {
      width: 800px;
      height: 500px;
      margin: 20px auto;
    }
  </style>
</head>
<body>
  <div id="formula-container"></div>
  
  <script src="path/to/vtable-sheet.js"></script>
  <script>
    // 创建销售数据
    const salesData = [
      ['产品', '一月', '二月', '三月', '四月', '五月', '六月', '总计', '平均值'],
      ['产品A', 1200, 1500, 900, 1800, 1350, 1650, '', ''],
      ['产品B', 950, 1100, 1300, 800, 1200, 1400, '', ''],
      ['产品C', 400, 600, 350, 500, 450, 550, '', ''],
      ['产品D', 2500, 2200, 2400, 2300, 2600, 2700, '', ''],
      ['总计', '', '', '', '', '', '', '', ''],
      ['平均值', '', '', '', '', '', '', '', '']
    ];
    
    // 初始化VTableSheet
    const sheet = new VTableSheet.VTableSheet({
      container: 'formula-container',
      showToolbar: true,
      showFormulaBar: true,
      showSheetTab: true,
      sheets: [
        {
          title: "销售数据",
          key: "sales",
          data: salesData
        }
      ]
    });
    
    // 添加公式
    window.addEventListener('load', () => {
      setTimeout(() => {
        const formulaManager = sheet.getFormulaManager();
        
        // 添加行总计公式
        for (let row = 1; row <= 4; row++) {
          formulaManager.registerFormula({
            sheet: 'sales',
            row: row,
            col: 7
          }, `SUM(B${row+1}:G${row+1})`);
        }
        
        // 添加行平均值公式
        for (let row = 1; row <= 4; row++) {
          formulaManager.registerFormula({
            sheet: 'sales',
            row: row,
            col: 8
          }, `AVERAGE(B${row+1}:G${row+1})`);
        }
        
        // 添加列总计公式
        for (let col = 1; col <= 6; col++) {
          formulaManager.registerFormula({
            sheet: 'sales',
            row: 5,
            col: col
          }, `SUM(${String.fromCharCode(65 + col)}2:${String.fromCharCode(65 + col)}5)`);
        }
        
        // 添加列平均值公式
        for (let col = 1; col <= 6; col++) {
          formulaManager.registerFormula({
            sheet: 'sales',
            row: 6,
            col: col
          }, `AVERAGE(${String.fromCharCode(65 + col)}2:${String.fromCharCode(65 + col)}5)`);
        }
        
        // 添加总计的总计
        formulaManager.registerFormula({
          sheet: 'sales',
          row: 5,
          col: 7
        }, 'SUM(B6:G6)');
        
        // 添加总计的平均值
        formulaManager.registerFormula({
          sheet: 'sales',
          row: 5,
          col: 8
        }, 'AVERAGE(B6:G6)');
        
        // 添加平均值的总计
        formulaManager.registerFormula({
          sheet: 'sales',
          row: 6,
          col: 7
        }, 'SUM(B7:G7)');
        
        // 添加平均值的平均值
        formulaManager.registerFormula({
          sheet: 'sales',
          row: 6,
          col: 8
        }, 'AVERAGE(B7:G7)');
      }, 1000);
    });
  </script>
</body>
</html>
```

这个示例创建了一个销售数据分析表，使用公式自动计算行总计、列总计、行平均值和列平均值。

【注：此处需要添加公式功能使用效果截图，显示公式栏和计算结果】

## 公式API参考

### FormulaManager 方法

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|-------|------|
| registerFormula | position: {sheet, row, col}, formula: string | void | 为指定单元格注册公式 |
| removeFormula | position: {sheet, row, col} | void | 移除指定单元格的公式 |
| evaluateFormula | formula: string, context?: object | any | 计算指定公式的值 |
| getFormulaByPosition | position: {sheet, row, col} | string \| null | 获取指定单元格的公式 |
| refreshAllFormulas | - | void | 刷新所有公式计算 |
| getAllFormulas | - | object[] | 获取所有已注册的公式 |

通过这些功能，VTable-Sheet可以提供类似Excel的公式功能，满足各种数据计算和分析需求。
