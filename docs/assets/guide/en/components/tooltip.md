# Tooltip Introduction

In table components, a tooltip is a common user interface element used to provide additional information about a specific table cell or data. It appears as a small pop-up window or floating box that displays relevant prompt text when the user hovers over a specific cell or interacts with a specific element.

## Tooltip usage scenarios

*   Data interpretation and description: Data in some tables may require additional interpretation or description. Tooltip can be used to display these interpretations to help users understand the meaning, units, calculation methods or other relevant information of the data.

*   Overflow content: When the text or data in the table exceeds the width of the cell, you can use tooltip to display the full content to prevent truncation or hide important information.

*   Description of Interactive Elements: If the table contains interactive elements (such as links, buttons, or icons), Tooltip can be used to provide functional descriptions or action hints for those elements.

## Introduction to configuration items

The configuration items are:

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

## Turn on overflow content prompt

VTable defaults to tooltip for overflow content: isShowOverflowTextTooltip defaults to true.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170e.gif)

## Display tooltip custom information through the interface

The interface showTooltip can actively display tooltip information, which is used as follows: (listen for cell hover events, call the interface)
[Reference interface description](https://visactor.io/vtable/option/Methods#showTooltip)

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

Effect:
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff05.gif)
