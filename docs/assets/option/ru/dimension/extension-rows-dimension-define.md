{{ target: extension-rows-dimension-define }}

#${prefix} extensionRows(IExtensionRowDefine[])
IExtensionRowDefine is defined as follows:
```
export интерфейс IExtensionRowDefine {
  rows: (IDimension | строка)[];
  rowTree: IHeaderTreeDefine[] | ((args: { dimensionKey: строка | число; значение: строка }[]) => IHeaderTreeDefine[]);
}
```

**The rows structure is the same as the outer configuration item rows definition. Note that the rows here cannot be omitted и must be filled в correctly**

**The rowTree structure is defined the same as the outer configuration item rowTree, but the configuration функция form is also supported here**