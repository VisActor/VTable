# React-VTable custom components

## Custom cell components

To help react developers quickly implement custom cell content, React-VTable provides the ability to encapsulate components and use them in cells.

### Component usage

Custom cell components are encapsulated based on [custom layout](../custom_define/custom_layout), and their usage is similar to custom layout. To use components in `ListColumn`, custom components need to pass in the `role` attribute to identify the component as a custom cell component; the `custom-layout` component will take effect in the table content part, and the `header-custom-layout` component will take effect in the table header part. There can be at most one `custom-layout` component in each column, and at most one `header-custom-layout` component.

```tsx
  <ListTable records={records}>
    <ListColumn field={'bloggerName'} title={'bloggerName'} width={330} disableHover={true}>
      <CustomLayoutComponent role={'custom-layout'} info={bodyInfo}/>
      <HeaderCustomLayoutComponent role={'header-custom-layout'} info={headerInfo}/>
    </ListColumn>
    // ......
  </ListTable>
```

### Component encapsulation

#### Default properties

In the component, in addition to user-defined properties, like custom layouts, react-vtable also provides some default properties for components to use

```tsx
interface CustomLayoutProps {
  table: ListTable; // 表格实例
  row: number; // 行号
  col: number; // 列号
  value: FieldData; // 单元格展示数据
  dataValue: FieldData; // 单元格原始数据
  rect?: RectProps; // 单元格布局信息
}
const CustomLayoutComponent = (props: CustomLayoutProps & UserProps) => {
  const { table, row, col, rect, text } = props;
  // ......
}
```

#### Label

The label returned by the component must be based on the element label provided by react-vtable (HTML tags or DOM react components cannot be used directly. If you need to use them, please refer to the next section)

```tsx
import { Group, Text } from '@visactor/react-vtable';

const CustomLayoutComponent = (props: CustomLayoutFunctionArg & { text: string }) => {
  const { table, row, col, rect, text } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const [hover, setHover] = useState(false);

  const fieldData = [
    {
      value: 'a',
      label: 'a'
    },
    {
      value: 'b',
      label: 'b'
    }
  ];

  const groupRef = useRef(null);

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center'
      }}
      ref={groupRef}
    >
      {fieldData.map(item => {
        return (
          <Text
            key={item.value}
            attribute={{
              text: `${text}-${row}`,
              fill: hover ? 'red' : '#000'
            }}
            onMouseEnter={(event: any) => {
              // eslint-disable-next-line no-console, no-undef
              console.log('groupRef', groupRef.current);
              setHover(true);
              event.currentTarget.stage.renderNextFrame();
            }}
            onMouseLeave={(event: any) => {
              setHover(false);
              event.currentTarget.stage.renderNextFrame();
            }}
          />
        );
      })}
      {hover && (
        <Text
          attribute={{
            text: 'hover',
            fill: 'blue',
          }}
        />
      )}
    </Group>
  );
};
```

Basic primitives:

* Text
* Rect
* Image
* Line
* ​​Arc
* Circle
* Group

Basic components:

* Tag
* Radio
* Checkbox Checkbox

For specific configuration properties, please refer to [`VRender element configuration`](https://visactor.io/vrender/option/Group), and for specific usage and layout, please refer to [custom layout](../custom_define/custom_layout), [reference example](../../demo-react/component/custom-layout).

<div style="display: flex; justify-content: center;">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-cell-layout-jsx.png" style="flex: 0 0 50%; padding: 10px;">
</div>

#### Use DOM react components

If you need to use DOM react components in components, you can specify the `react` attribute in the `attribute` property of the element component and pass the react component as the `element` property:

```tsx
<Group
  attribute={{
    // ......
    react: {
      pointerEvents: true,
      container: table.bodyDomContainer, // table.headerDomContainer
      anchorType: 'bottom-right',
      element: <CardInfo record={record} hover={hover} row={row} />
    }
  }}
  onMouseEnter={(event) => {
    setHover(true);
    event.currentTarget.stage.renderNextFrame();
  }}
  onMouseLeave={(event) => {
    setHover(false);
    event.currentTarget.stage.renderNextFrame();
  }}
>
// ...
</Group>
```

<div style="display: flex; justify-content: center;">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-vtable-dom-component.gif" style="flex: 0 0 50%; padding: 10px;">
</div>

The following properties are also supported in react:
* `pointerEvents` whether to respond to mouse events
* `container` Container, used to limit the component display area in the table when scrolling. If you need to limit the component display in the table content area, you need to specify it as `table.bodyDomContainer`; if you need to limit the component display in the table header area, you need to specify it as `table.headerDomContainer`; if it is a pop-up window or menu component, you do not need to configure this property
* `anchorType` Anchor type, used to specify the anchor position of the upper left corner of the component relative to the cell
  * 'top'
  * 'bottom'
  * 'left'
  * 'right'
  * 'top-right'
  * 'top-left'
  * 'bottom-right'
  * 'bottom-left'
  * 'center'

We recommend that users use the meta tags provided by react-vtable for the content displayed in the cell. For pop-ups, menus and other components triggered in the cell, you can use DOM react components. This is the best performance solution. [Reference example](../../demo-react/component/custom-layout).

If you need to display content in a cell, use DOM react components. You need to specify `react.container` according to the restrictions on components displayed in the table content area. It should be noted that this method requires frequent updates of component-related DOM, which will have a certain impact on performance. You can refer to [custom layout](../custom_define/custom_layout). We strongly recommend that the content components in the cell use the meta tags provided by react-vtable, which is the best solution for performance.

## Custom external components

In order to facilitate the overlay of external components on the React-VTable component, React-VTable provides the `CustomComponent` tool component, which allows you to quickly locate external components in the table, and can be used to quickly implement functional components such as pop-ups and menus.

```jsx
<ListTable option={option} onMouseEnterCell={updatePos} onMouseLeaveTable={hide} onReady={ready}>
  <CustomComponent width="50%" height="100%" displayMode="cell" col={col} row={row} anchor="bottom-right" dx="-50%">
    <UserComponent value={value} />
  </CustomComponent>
</ListTable>
```

Among them, `CustomComponent` is used as a container to position in the table and automatically match the size (based on the anchored cell). There are two specific ways to use it:

1. Absolute positioning

For absolute positioning, you need to specify `displayMode` as `position`, and you need to specify `x` and `y` attributes to position the container to the specified pixel position in the table (based on the upper left corner). The `width` and `height` attributes specify the pixel size of the container.

2. Relative positioning

For relative positioning, you need to specify `displayMode` as `cell`, the container is positioned relative to the cell, the `col` and `row` attributes are used to specify the anchored cell coordinates, the `anchor` attribute specifies the anchor position of the container relative to the cell, the `dx` and `dy` attributes specify the offset of the container relative to the anchored cell, and the `width` and `height` attributes specify the size of the container. The `dx` `dy` `width` and `height` attributes all support units of pixels or percentages. When the percentage is calculated relative to the size of the cell.

### API

```ts
interface CustomComponentProps {
   children: React.ReactNode;
   displayMode: 'position' | 'cell'; // Positioning mode
   col?: number; // Anchored column coordinates
   row?: number; // Anchored row coordinates
   anchor?:
   | 'top-left'
   | 'top-center'
   | 'top-right'
   | 'middle-left'
   | 'middle-center'
   | 'middle-right'
   | 'bottom-left'
   | 'bottom-center'
   | 'bottom-right'; // Anchored position
   dx?: number | string; // x-direction offset
   dy?: number | string; // y-direction offset
   width?: number | string; // container width
   height?: number | string; // container height
}
```

Custom external component demo: [custom component demo](../../demo-react/component/custom-component)