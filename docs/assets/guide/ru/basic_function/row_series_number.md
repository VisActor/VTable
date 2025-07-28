# Table row number

The row numbering capability provides users with an easy way to identify and manipulate specific rows in a table.

VTable provides the ability to row serial numbers. Users can easily enable, customize formats and styles on demand, drag and drop row numbers to change positions, and have the ability to select multiple rows in an entire row.

## Row serial number configuration item

Currently the following configurations are supported:

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
  // /** Whether to include the serial number part when selecting the entire row or all selections */
  // selectRangeInclude?: boolean;
  /** Whether the order can be dragged */
  dragOrder?: boolean;
  /** Whether to disable row serial number width adjustment. */
  disableColumnResize?: boolean;
}
```

The specific configuration items are described as follows:

- width: The line number width can be configured with number or 'auto'. (Default uses defaultColWidth, which defaults to 80)
- title: row number title, empty by default
- format: row serial number formatting function, empty by default. Through this configuration, numerical serial numbers can be converted into custom serial numbers, such as using a, b, c...
- cellType: row number cell type, default is text
- style: row number body cell style
- headerStyle: row number header cell style
- headerIcon: row number header cell icon
- icon: row number body cell icon
- dragOrder: Whether the row serial number order can be dragged, the default is false. If set to true, the icon at the dragging position will be displayed, and you can drag and drop on the icon to change its position. If you need to replace the icon, you can configure it yourself. Please refer to the tutorial: https://visactor.io/vtable/guide/custom_define/custom_icon for the chapter on resetting function icons.
- disableColumnResize: Whether to disable row serial number width adjustment, the default is false

Other annotated configuration items will be gradually improved in the future, and anxious comrades can participate in joint construction and development.

**Note:**

- Sorted tables do not support dragging row numbers to change the order of data;
- Tree-structured tables are currently restricted to move between nodes of the same parent level when dragged and dropped in order;How to move between different parent levels, you can see another [tutorial](../interaction/drag_header)。

[Demo Example](../../demo/basic-functionality/row-series-number)

## Interactive Capabilities Achieved Through Row Numbers

- Drag and drop row numbers to change positions: Set `dragOrder` to `true`. If you need to listen to the drag-and-drop event, you can listen to the [`VTable.EVENT_TYPE.CHANGE_HEADER_POSITION` event](../../api/events#CHANGE_HEADER_POSITION).

- Select entire rows: Click on the row number to select the entire row.
