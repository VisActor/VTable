# 表格滚动

在数据分析的过程中，通常会遇到大量的数据展示在表中。为了能够同时展示更多的数据内容提供更好的数据查询体，滚动功能就显得尤为重要。通过滚动，用户可以快速地在表格中查找到所需的内容，并进行后续的分析与处理。

## 滚动性能优势

VTable 底层基于 canvas 进行渲染，每次更新只会绘制可视区域内容，确保即使在处理大数据时仍能流畅地滚动。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090d.gif)

## 滚动样式

VTable 提供了丰富的滚动样式配置项，用户可以按照自己的需求来定制现滚动条样式。通过 ListTable.theme.scrollStyle 配置滚动条样式，以下为滚动样式配置的详细内容：

- scrollRailColor： 配置滚动条轨道的颜色。
- scrollSliderColor：配置滚动条滑块的颜色。
- scrollSliderCornerRadius:滚动条滑块的圆角半径
- width：配置滚动条宽度。
- visible：配置滚动条是否可见，可配值：'always' | 'scrolling' | 'none' | 'focus'，分别对应：常驻显示|滚动时显示|显示|聚焦在画布上时。默认为‘scrolling’。
- hoverOn ：指定滚动条是悬浮在容器上，还是独立于容器。默认为 true 即悬浮于容器上。
- barToSide ：是否显示到容器的边缘 尽管内容没有撑满的情况下. 默认 false

下面我们通过示例来展示这些配置的效果：

```javascript livedemo   template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      theme: {
        scrollStyle: {
          visible: 'always',
          scrollSliderColor: 'purple',
          scrollRailColor: '#bac3cc',
          hoverOn: false,
          barToSide: true
        }
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```

## 横向滚动

VTable 支持在按住 Shift 键时进行横向滚动，或者直接拖拽横向滚动条，以便用户更方便地浏览表格数据。当然，如果您的电脑有触摸板，可以直接在触摸板上直接左右滑动来实现横向滚动。

## 滚动接口

VTable 提供了 scrollToCell 接口，用于滚到指定的单元格位置。该方法接受 cellAddr 参数用于指定要滚动到的单元位置。示例代码如下：

```javascript
table.scrollToCell({ row: 20, col: 10 });
```

在上示例中，我们将滚动到行号为 20，列号为 10 的单元格位置。

## 关闭浏览器默认行为

可通过配置项 overscrollBehavior 属性来关闭浏览器默认行为，如下配置说明：

```
  /**
   * 'auto':表格滚动到顶部或者底部时，触发浏览器默认行为;
   * 'none':表格滚动到顶部或者底部时, 不会触发浏览器默认行为，即表格滚动到边界继续滚动时不会触发父级页面的滚动
   * */
  overscrollBehavior?: 'auto' | 'none';
```

在 mac 电脑上 有时候会出现已经设置了'none'，但还是会触发了浏览器的默认滚动（如橡皮筋效果或者触发了页面回退）

<div style="display: flex;">
 <div style="width: 20%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/scroll-bounce.gif" />
  </div>
  <div style="width: 10%; text-align: center;">
  </div>
  <div style="width: 20%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/scroll-back.jpeg" />
  </div>
</div>

这个问题可能是因为在表格外部触发过了浏览器的橡默认行为，转而到了表格中进行滚动时延续了这个效果，为了避免这个问题的发生可以在页面 body 设置 css 滚动条样式（同时配合 VTable 的 overscrollBehavior 配置两层进行限制）：

```
"overscroll-behavior: none;"
```

具体说明可参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/overscroll-behavior
