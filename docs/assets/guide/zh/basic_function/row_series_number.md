# 表格行序号

行号能力为用户提供了一种简便的方式来识别和操作表格中的特定行。

VTable 提供了行序号的能力，用户可以轻松地按需开启、自定义 format、自定义样式，拖拽行号来换位，已经选中整行多行的能力。

## 行序号配置项

目前支持如下各项配置：

```javascript
export interface IRowSeriesNumber {
  width?: number | 'auto';
  // align?: 'left' | 'right';
  // span?: number | 'dependOnNear';
  title?: string;
  // field?: FieldDef;
  format?: (col?: number, row?: number, table?: BaseTableAPI) => any;
  cellType?: 'text' | 'link' | 'image' | 'video' | 'checkbox';
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerIcon?: string | ColumnIconOption | (string | ColumnIconOption)[];
  icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
  // /** 选中整行或者全选时 是否包括序号部分 */
  // selectRangeInclude?: boolean;
  /** 是否可拖拽顺序 */
  dragOrder?: boolean;
  /** 是否禁止列宽调整 */
  disableColumnResize?: boolean;
}
```

具体配置项说明如下：

- width: 行序号宽度可配置 number 或者'auto'。（默认使用 defaultColWidth，该默认值为 80）
- title: 行序号标题，默认为空
- format: 行序号格式化函数，默认为空，通过该配置可以将数值类型的序号转换为自定义序号，如使用 a,b,c...
- cellType: 行序号单元格类型，默认为文本
- style: 行序号 body 单元格样式
- headerStyle: 行序号 header 单元格样式
- headerIcon: 行序号 header 单元格图标
- icon: 行序号 body 单元格图标
- dragOrder: 是否可拖拽行序号顺序，默认为 false。如果设置为 true，会显示拖拽位置的图标，交互在该图标上可以拖拽来换位。如果需要替换该图标可以自行配置。可参考教程：https://visactor.io/vtable/guide/custom_define/custom_icon 中重置功能图标的章节。
- disableColumnResize: 是否禁止列宽调整，默认为 false

其他被注释的配置项，后续会逐步完善，着急的同志们可参与共建开发。

**注：**

- 设置过排序的表格不支持拖拽行序号来更换数据顺序；
- 透视图目前不支持行序号。

demo 示例可参考：https://visactor.io/vtable/demo/basic-functionality/row-series-number
