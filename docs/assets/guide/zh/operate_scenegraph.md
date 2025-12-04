# 操作场景树（进阶）

某些场景下，需要对场景树进行操作，比如单独更新某个节点（单元格），或者获取某个节点的信息等。

下面主要介绍目前稳定的接口，因为场景树模块不断优化迭代，所以不保证以下接口不会发生变化。

## 获取场景树

```ts
tableInstance.scenegraph;
```

## 获取场景树中对应某个单元格的节点

```ts
tableInstance.scenegraph.getCell(colIndex, rowIndex);
```


## 更新场景树中某个单元格节点内容
通过这个接口会触发单元格节点的刷新和重绘。适用于自定义单元格内容customLayout的场景中，需要执行customLayout重新计算单元格内容的情况。

```ts
tableInstance.scenegraph.updateCellContent(colIndex, rowIndex);
```

## 通过某个节点获取其所属单元格节点

```ts
VTable.getTargetCell(e.target);
```

