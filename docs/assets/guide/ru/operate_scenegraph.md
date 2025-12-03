# Operate Scenegraph (Advanced)

в некоторые scenarios, it is necessary к operate на the scenegraph, such as updating a single node (cell) или obtaining information about a node.

Следующий mainly introduces the currently sтаблица interfaces. Since the implementation из the scenegraph is still being iterated, it is не guaranteed that Следующий interfaces will не change.

## Get Scenegraph

```ts
таблицаInstance.scenegraph;
```

## Get the node из the corresponding cell в the scenegraph

```ts
таблицаInstance.scenegraph.getCell(colIndex, rowIndex);
```


## Get the node из the corresponding cell в the scenegraph

```ts
таблицаInstance.scenegraph.updateCellContent();
```

## Get the cell node из the corresponding node

```ts
Vтаблица.getTargetCell(e.target);
```

