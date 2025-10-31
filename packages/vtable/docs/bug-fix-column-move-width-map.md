# 列移动时宽度调整映射修复文档

## 问题描述

在VTable中，当用户手动调整列宽后，这些调整过的列宽信息会被存储在表格实例的 `internalProps._widthResizedColMap` 中。当用户拖动列位置后，需要正确地更新这个映射，确保列宽调整信息能够正确地跟随列的移动而移动。

在实现 `adjustWidthResizedColMap` 方法时，发现了一个bug：当源列位置在目标位置之前（向后移动）时，如果存在位于目标位置或之后的列宽调整记录，这些记录不会正确地向左移动。

## Bug复现

### 初始状态
- `_widthResizedColMap = new Set([2, 4, 5])`（列2、4、5被调整过宽度）

### 移动操作
将列2移动到位置5：
```javascript
moveContext = {
    "sourceIndex": 2,
    "targetIndex": 5,
    "sourceSize": 1,
    "targetSize": 2,
    "moveType": "column"
}
```

### 实际结果
- `_widthResizedColMap = new Set([5, 3])`

### 预期结果
- `_widthResizedColMap = new Set([5, 3, 4])`
  - 原来的列2移动到了位置5
  - 原来的列4移动到了位置3（因为前面的列2被移走了，所以往前移一位）
  - 原来的列5移动到了位置4（同样因为列2被移走，往前移一位）

## Bug原因分析

在 `adjustWidthResizedColMap` 方法中，当处理"源位置在目标位置之前"的情况时，对于目标位置之后的列的处理有误：

```javascript
else if (colIndex >= targetIndex) {
    // 目标位置之后的列保持不变
    newColIndex = colIndex;
}
```

错误的逻辑是将目标位置及之后的列保持不变。但实际上，当源列被移动到目标位置后，目标位置及之后的列也应该向左移动（减去sourceSize）。

这导致了原来位于位置5的列仍然在位置5，而不是正确地移动到位置4。

## 修复方法

修改 `adjustWidthResizedColMap` 方法中的问题代码段：

```javascript
else if (colIndex >= targetIndex) {
    // 目标位置之后的列需要向左移动（减去sourceSize）
    newColIndex = colIndex - sourceSize;
}
```

这样，当将列2移动到位置5时，原来位于位置5的列会正确地向左移动到位置4。

## 测试验证

编写了详细的单元测试来验证修复：
1. 基本移动场景测试
2. 向前移动场景测试
3. 多列移动测试
4. 极端情况测试
5. 处理重复列号的情况

所有测试都通过，证明修复有效。

## 结论

这个bug是一个逻辑错误，在列移动操作中没有正确地更新目标位置之后列的索引。通过修复这个错误，我们确保了手动调整过列宽的信息能够在列移动后正确地保留，提升了用户体验。
