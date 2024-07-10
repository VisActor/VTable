# React-VTable自定义组件

## 自定义单元格组件

为了方便react开发者快速实现自定义单元格内容，React-VTable 提供了封装组件并在单元格中使用的能力。

### 组件用法

自定义单元格组件在[自定义布局](../custom_define/custom_layout)的基础上封装而成，用法类似于自定义布局。在`ListColumn`中使用组件，自定义组件需要传入`role`属性，用于标识该组件为自定义单元格组件；其中`custom-layout`组件会在表格内容部分生效，`header-custom-layout`组件会在表格表头部分生效。每列中最多只能有一个`custom-layout`组件，最多只能有一个`header-custom-layout`组件。

```tsx
  <ListTable records={records}>
    <ListColumn field={'bloggerName'} title={'bloggerName'} width={330} disableHover={true}>
      <CustomLayoutComponent role={'custom-layout'} info={bodyInfo}/>
      <HeaderCustomLayoutComponent role={'header-custom-layout'} info={headerInfo}/>
    </ListColumn>
    // ......
  </ListTable>
```

### 组件封装

#### 默认属性

在组件中，除了用户定义的属性外，与自定义布局一样，react-vtable还提供了一些默认属性供组件使用

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

#### 标签

组件返回的标签，必须是基于react-vtable提供的图元标签（不可以直接使用HTML标签或DOM react组件，如果需要使用，请参考下一节）

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

基础图元：

* Text 文字
* Rect 矩形
* Image 图片
* Line 线
* Arc 弧形
* Circle 圆
* Group 图元组

基础组件：

* Tag 文本标签
* Radio 单选框
* Checkbox 复选框

具体配置属性可以参考[`VRender图元配置`](https://visactor.io/vrender/option/Group)，具体使用和布局可以参考[自定义布局](../custom_define/custom_layout)，[参考示例](../../demo-react/component/custom-layout)。

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-cell-layout-jsx.png" style="flex: 0 0 50%; padding: 10px;">
</div>

#### 使用DOM react组件

如果需要在组件中使用DOM react组件，可以在图元组件的`attribute`属性中，指定`react`属性，并将react组件作为`element`属性传入：

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

react中还支持配置以下属性：
* `pointerEvents` 是否响应鼠标事件
* `container` 容器，用于限制滚动时组件显示区域在表格中，如果需要限制组件显示在表格内容区域，需要指定为`table.bodyDomContainer`；如果需要限制组件显示在表格表头区域，需要指定为`table.headerDomContainer`；如果是弹窗或菜单类组件，不需要配置该属性
* `anchorType` 锚定类型，用于指定组件左上角相对于单元格的锚定位置
  * 'top'
  * 'bottom'
  * 'left'
  * 'right'
  * 'top-right'
  * 'top-left'
  * 'bottom-right'
  * 'bottom-left'
  * 'center'

我们推荐用户在单元格内展示的内容，使用react-vtable提供的图元标签，单元格内触发的弹窗、菜单等组件，可以使用DOM react组件，这样是性能最优的方案。[参考示例](../../demo-react/component/custom-layout)。

如果需要在单元格内展示的内容，使用DOM react组件，需要按照限制组件显示在表格内容区域，指定`react.container`。需要注意，这样的方式需要频繁更新组件相关DOM，会对性能有一定影响，可以参考[自定义布局](../custom_define/custom_layout)。我们强烈推荐将单元格内的内容组件使用react-vtable提供的图元标签，这样是性能最优的方案。

## 自定义外部组件

为了方便在 React-VTable 组件上叠加外部组件，React-VTable 提供了`CustomComponent`工具组件，方便快速将外部组件定位到表格当中，可以用来快速实现弹窗、菜单等功能组件。

```jsx
<ListTable option={option} onMouseEnterCell={updatePos} onMouseLeaveTable={hide} onReady={ready}>
  <CustomComponent width="50%" height="100%" displayMode="cell" col={col} row={row} anchor="bottom-right" dx="-50%">
    <UserComponent value={value} />
  </CustomComponent>
</ListTable>
```

其中，`CustomComponent`作为一个容器，用于在表格中定位，并自动匹配尺寸（基于锚定的单元格），具体有两种使用方式：

1. 绝对定位

   绝对定位的方式，需要指定`displayMode`为`position`, 需要指定`x`和`y`属性，用于将容器定位到表格中的指定像素位置（基于左上角），`width`和`height`属性指定容器的像素尺寸。

2. 相对定位

   相对定位的方式，需要指定`displayMode`为`cell`，容器相对为单元格定位、`col`和`row`属性用于指定锚定的单元格坐标，`anchor`属性指定容器相对于单元格的锚定位置，`dx`和`dy`属性指定容器相对于锚定单元格的偏移量，`width`和`height`属性指定容器的尺寸，其中`dx` `dy` `width`和`height`属性的均支持单位为像素或百分比，为百分比时，相对于单元格的尺寸进行计算。

### API

```ts
interface CustomComponentProps {
  children: React.ReactNode;
  displayMode: 'position' | 'cell'; // 定位方式
  col?: number; // 锚定的列坐标
  row?: number; // 锚定的行坐标
  anchor?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'middle-left'
    | 'middle-center'
    | 'middle-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'; // 锚定的位置
  dx?: number | string; // x方向的偏移
  dy?: number | string; // y方向的偏移
  width?: number | string; // 容器的宽度
  height?: number | string; // 容器的高度
}
```

自定义外部组件 demo：[custom component demo](../../demo-react/component/custom-component)