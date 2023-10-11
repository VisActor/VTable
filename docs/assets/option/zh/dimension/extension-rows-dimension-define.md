{{ target: extension-rows-dimension-define }}

#${prefix} extensionRows(IExtensionRowDefine[])
IExtensionRowDefine定义如下：
```
export interface IExtensionRowDefine {
  rows: (IDimension | string)[];
  rowTree: IHeaderTreeDefine[] | ((args: { dimensionKey: string | number; value: string }[]) => IHeaderTreeDefine[]);
}
```

**其中rows结构同外层的配置项rows定义相同，注意这里的rows不能省略 必须要填写正确**

**其中rowTree结构同外层的配置项rowTree定义相同，但这里同时支持配置函数形式**