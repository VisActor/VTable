---
title: How to set the text style of the VTable table component?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to set text style for VTable component?</br>
## Problem description

What text styles are supported and how to configure them when using the VTable table component?</br>
## Solution

VTable supports the following text styles:</br>
*  `fontSize `: The font size of the text.</br>
*  `FontFamily `: Font used for text. Multiple fonts can be specified, such as `Arial, sans-serif `, and the browser will search and use them in the specified order.</br>
*  `FontWeight `: Set font thickness.</br>
*  `FontVariant `: Sets the font variant.</br>
*  `fontStyle `: Set font style.</br>
The places where VTable supports setting text styles are:</br>
*  `Column (row/indicator) `, configure the style corresponding to the column (row/indicator)</br>
*  `Style `: The style corresponding to the content cell</br>
*  `headerStyle `: the style corresponding to the header cell</br>
*  `In theme `, configure the theme style</br>
*  `defaultStyle `: default style</br>
*  `bodyStyle `: table content area style</br>
*  `headerStyle `: header (list)/list header (pivot table) style</br>
*  `rowHeaderStyle `: Row header style</br>
*  `cornerHeaderStyle `: corner head style</br>
*  `bottomFrozenStyle `: Bottom frozen cell style</br>
*  `rightFrozenStyle `: Freeze cell style on the right</br>


## Code example

You can paste it into the official website editor for testing: [https://visactor.io/vtable/demo/table-type/list-table](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table)</br>
```
let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto",
        style: {
            fontSize: 14
        },
        headerStyle: {
            fontSize: 16,
            fontFamily: 'Verdana'
        }
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "width": "auto"
    },
    {
        "field": "Category",
        "title": "Category",
        "width": "auto"
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "Region",
        "title": "Region",
        "width": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  theme: VTable.themes.DEFAULT.extends({
    bodyStyle: {
        fontSize: 12
    },
    headerStyle: {
        fontSize: 18
    }
  })
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })</br>
```
## Related Documents

Related api: https://visactor.io/vtable/option/ListTable-columns-text#style.fontSize</br>
github：https://github.com/VisActor/VTable</br>



