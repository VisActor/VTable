# Style Style Introduction

The table style configuration provides flexibility and customization, enabling users to design and beautify the table presentation according to the business data type of each column. If you need to consider the style from the table as a whole, you can use it[Theme](../../guide/theme_and_style/theme).

This document describes how to use style and headerStyle to configure table styles to help users better understand and use these features.

## A brief introduction

The style refinement configuration of cells in VTable, including cell styles, header cell styles, etc. The configuration of styles is listed as a group of separate configurations (if it is a transposed table, it is used to behave as a group of configuration styles).

## Header cell style configuration

Configure headerStyle in each item of columns. If it is in the pivot table, it corresponds to columns and rows. Example code:

     import * as vTable from '@visactor/vtable';

     const option: vTable.ListTableConstructorOptions = {
     columns: [
      {
        field: 'id',
        title: 'ID',
        headerStyle: {
          bgColor: 'red',
          autoWrapText: true,
          lineHeight: 20,
          lineClamp: 'auto',
          textBaseline: "top",
          color:"yellow"
        },
      }
      ...
    ];

    const tableInstance = new VTable.ListTable(option);

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0b.png)

## Body cell style configuration

Configure style in each item of columns. If it is in the pivot table, it corresponds to columns and rows. Example code:

     import * as vTable from '@visactor/vtable';

     const option: vTable.ListTableConstructorOptions = {
     columns: [
      {
        field: 'id',
        title: 'ID',
        style: {
          bgColor: 'green',
          autoWrapText: true,
          lineHeight: 20,
          lineClamp: 'auto',
          textBaseline: "top",
          color:"yellow"
        },
      }
      ...
    ];

    const tableInstance = new VTable.ListTable(option);

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270908.png)

Style provides a series of cell configurations, briefly described below.

## Specific introduction

### Cell background color

`bgColor`: Defines the background color of the cell. Use string or function parameters to set the color.

### Text style

*   `textAlign`: Defines the horizontal alignment of text in cells
*   `textBaseline`: Defines the vertical alignment of text in cells
*   `color`: Defines the text color of the cell
*   `fontSize`: define cell text size
*   `fontFamily`: Defines the text font of the cell
*   `fontWeight`: Defines the text font weight of the unit
*   `fontVariant`: Defines the text weight of the cell
*   'FontStyle: Defines the text font style of the cell

These settings make it easy to adjust the rendering of text in cells.

### border

Contains the following configuration items:

*   `borderColor`Set the color of the border for the cell
*   `borderLineWidth`: cell sets the width of the border
*   `borderLineDash`: Set the line dashed style of the border for the cell

### Line height, line feed settings

*   `lineHeight`: set text height for cell content
*   `textOverflow`: Sets the ellipsed form of the text. This configuration has no effect if autoWrapText sets line wrapping

### Underscore, underline settings

*   `underline`: set underscores for single cells
*   `lineThrough`: underline cell text

### Link text color

`linkColor`: Set the text color of the link type.

### Mouse hover style

`cursor`: mouse hover to cell mouse style

### Text adsorption effect

`textStick`: Set whether the text of the cell has an adsorption fruit \[Dynamically adjust the position of the cell content when scrolling]

### Cell Tag

`marked`: Set whether the cell has a record style

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/cell-marked.jpeg)

### line wrapping

`autoWrapText`: Set cell wrapping

### Maximum number of rows setting

*   `lineamp`: Set the maximum number of rows of the unit, you can set number or'auto ', set it to'auto', it will be automatically calculated

Through the above introduction, you have mastered the use of style in VTable, and then you can create a table with a personalized style according to your needs.
