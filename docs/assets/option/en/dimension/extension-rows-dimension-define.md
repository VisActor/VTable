{{ target: extension-rows-dimension-define }}

#${prefix} extensionRows(IExtensionRowDefine[])
IExtensionRowDefine is defined as follows:
```
export interface IExtensionRowDefine {
  rows: (IDimension | string)[];
  rowTree: IHeaderTreeDefine[] | ((args: { dimensionKey: string | number; value: string }[]) => IHeaderTreeDefine[]);
}
```

**The rows structure is the same as the outer configuration item rows definition. Note that the rows here cannot be omitted and must be filled in correctly**

**The rowTree structure is defined the same as the outer configuration item rowTree, but the configuration function form is also supported here**