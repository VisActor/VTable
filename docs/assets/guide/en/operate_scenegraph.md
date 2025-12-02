# Operate Scenegraph (Advanced)

In some scenarios, it is necessary to operate on the scenegraph, such as updating a single node (cell) or obtaining information about a node.

The following mainly introduces the currently stable interfaces. Since the implementation of the scenegraph is still being iterated, it is not guaranteed that the following interfaces will not change.

## Get Scenegraph

```ts
tableInstance.scenegraph;
```

## Get the node of the corresponding cell in the scenegraph

```ts
tableInstance.scenegraph.getCell(colIndex, rowIndex);
```


## Update the content of the corresponding cell in the scenegraph
By this interface, the cell node will be refreshed and repainted.

```ts
tableInstance.scenegraph.updateCellContent();
```

## Get the cell node of the corresponding node

```ts
VTable.getTargetCell(e.target);
```

