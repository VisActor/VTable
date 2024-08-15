# tooltip介绍

在表格组件中，tooltip（信息提示）是一种常见的用户界面元素，用于提供关于特定表格单元格或数据的额外信息。它以一个小型弹出窗口或浮动框的形式出现，当用户将鼠标悬停在特定单元格上或与特定元素交互时，显示相关的提示文本。

## tooltip的使用场景

- 数据解释和描述：某些表格中的数据可能需要额外的解释或描述。Tooltip可以用于显示这些解释，帮助用户理解数据的含义、单位、计算方法或其他相关信息。

- 溢出内容：当表格中的文本或数据超出单元格的宽度时，可以使用tooltip显示完整的内容，以防止截断或隐藏重要信息。

- 可交互元素说明：如果表格中包含可交互的元素（如链接、按钮或图标），Tooltip可以用于提供这些元素的功能说明或操作提示。

## 配置项介绍

配置项为：
```
{
  /** 提示弹框的相关配置。消失时机：显示后鼠标移动到指定区域外或者进入新的单元格后自动消失*/
  tooltip: {
    /** 渲染方式：如使用html具有较好灵活行，上层可以覆盖样式；canvas具有较好的跨平台展示稳定性 */
    renderMode: 'html' | 'canvas';
    /** 代替原来hover:isShowTooltip配置 */
    isShowOverflowTextTooltip: boolean;
    /** 弹框是否需要限定在表格区域内 */
    confine: boolean;
  };
}
```

## 开启溢出内容提示


VTable默认开启溢出内容的tooltip：isShowOverflowTextTooltip默认为true。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170e.gif)

## 通过接口显示tooltip自定义信息

接口showTooltip可主动显示tooltip信息，如下使用方式：（监听单元格hover事件，调用接口）
[参考接口说明](https://visactor.io/vtable/option/Methods#showTooltip)
```
  tableInstance.on('mouseenter_cell', (args) => {
        const { col, row, targetIcon } = args;
        if(col===0&&row>=1){
          const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
          tableInstance.showTooltip(col, row, {
            content: 'Order ID：'+tableInstance.getCellValue(col,row),
            referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
            className: 'defineTooltip',
            style: {
              bgColor: 'black',
              color: 'white',
              font: 'normal bold normal 14px/1 STKaiti',
              arrowMark: true,
            },
          });
        }
    });
```
效果：
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff05.gif)
