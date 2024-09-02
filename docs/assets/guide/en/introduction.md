# Introduction

VTable: Not only a high-performance multi-dimensional data analytics table, but also a grid artist created between columns!

In modern applications, table components are an integral part, they can quickly display large amounts of data, and provide a good visualization and interactive experience. VTable is a high-performance table component library based on the visual rendering engine VRender, providing users with excellent performance and powerful multi-dimensional analysis capabilities, as well as flexible and powerful graphics capabilities.

# Smooth performance experience

VTable is packaged with the visual rendering engine VRender, which provides excellent performance and rendering effects. VTable supports second-level rendering of millions of data, which can quickly display large amounts of data. Let's take a look at an example to show the fast rendering capabilities of VTable. You can also go to the official website to experience it for yourself: https://visactor.io/vtable/demo/performance/100W
![VTablePerformance](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f00.gif)

# Various forms

VTable provides three main table forms, including basic table, multi-dimensional perspective table and perspective combination diagram. It can meet the needs of different users, help users better display and analyze data, and find valuable information from it.

<div style="display: flex;">
 <div style="width: 43%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af800.png" />
    <p>list table</p>
  </div>
  <div style="width: 43%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af801.png" />
    <p>pivot table</p>
  </div>
  </div>
  <div style="display: flex;">
  <div style="width: 43%; text-align: center;">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af802.png" />
    <p>pivot chart</p>
  </div>
  <div style="width: 43%; text-align: center;">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-basic-preview.png" />
    <p>gantt chart</p>
  </div>
</div>

*   The basic table is the simplest form of table, it consists of rows and columns, and each cell contains a data item. Basic tables are suitable for simple arrangement and presentation of data.
*   Pivot table is a table form for multidimensional data analytics, which can aggregate and summarize data according to multiple Dimensions, providing users with multi-angle data analytics and exploration.
*   Pivot chart is a chart form that combines a multi-dimensional perspective table with other chart forms (such as histograms, line charts, etc.), which can transform the data in the perspective table into a more intuitive and understandable graphical display.
*   Gantt chart is a chart used to display project progress and resource allocation. It can help users better understand the progress of the project and resource allocation.

At the same time, the basic table can be transformed into a transposed table, and the hierarchical relationship can also be displayed with a tree structure:

<div style="display: flex;">
 <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af803.png" />
    <p>list table-transpose</p>
  </div>
  <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f01.png" />
    <p>list table-tree mode</p>
  </div>
</div>

The row header of the pivot table can also use a tree structure to show the hierarchical relationship between Dimensions:

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af805.png" />
    <p>pivot table-tree mode</p>
  </div>

# Rich cell presentation

VTable provides a variety of cell presentation forms, which can meet different data display needs and help users better present and analyze data.
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af806.png)
Specific supported cell renderings are:

1.  **'Text 'text type**: Used to display text data. At the same time, it supports a variety of styles and formats, such as font size, color, bold, italics, line wrapping, etc., and can also format data to meet different typesetting needs.
2.  **'Link 'link type**: Convert the data into hyperlinke, click the link to jump to the specified web page or file
3.  **'Image 'image type**: Convert valid URLs into image displays such as photos, icons, etc.
4.  **'Video 'video type**: Convert valid URLs into video presentations, such as YouTube videos, local video files, etc.
5.  **'Sparkline 'miniature type**: Turn data into small chart displays, such as line charts, area charts, and display data trends and changes in tables.
6.  **'Progressbar 'progress bar type**: Convert data into progress bar display, customize progress bar color, size and text, and easily display task progress and status in tables.
7.  **'Chart 'chart type**: Convert data into VChart charts and display them in cells.
8.  **Custom rendering**: If you want cells to render richer content or layout patterns, you can also do so through custom rendering.

# Comprehensive interaction capabilities

VTable provides rich and comprehensive interaction capabilities.

## table interaction

Interaction types include: select cells, hover highlighting, drag and drop transposition, sort, freeze columns, adjust column widths, etc.

<div style="display: flex;">
 <div style="width: 33%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f02.gif" />
    <p>select cells: 支持单选，框选，选中整列，快捷键多选及全选</p>
  </div>
  <div style="width: 33%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f03.gif" />
    <p>hover highlight: 支持hover单元格高亮，或十字高亮</p>
  </div>
  <div style="width: 33%; text-align: center;">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f04.gif" />
    <p>change column: 拖拽表头换位</p>
  </div>
</div>

<div style="display: flex;">
 <div style="width: 33%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f05.gif" />
    <p>sort records</p>
  </div>
  <div style="width: 33%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f06.gif" />
    <p>frozen column</p>
  </div>
  <div style="width: 33%; text-align: center;">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f07.gif" />
    <p>resize column width</p>
  </div>
</div>

## Component Level Interaction

Interaction types include: scroll bar scroll, tooltip prompt, dropdown menu pop-up, etc.

<div style="display: flex;">
 <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f08.gif" />
    <p>tooltip</p>
  </div>
  <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f09.gif" />
    <p>dropdown</p>
  </div>
</div>

If the above interaction does not meet the requirements, you can customize the interaction behavior in conjunction with event event listening.

# Flexible and diverse UI styles

VTable supports a variety of Themes and styles, which can be customized according to the needs of users to meet different visual effects.

## Multiple theme Themes

<div style="display: flex;">
 <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af807.png" />
    <p>ARCO theme</p>
  </div>
  <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af808.png" />
    <p>LIGHT theme</p>
  </div>
</div>
<div style="display: flex;">
 <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af809.png" />
    <p>SIMPLY theme</p>
  </div>
  <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f0a.png" />
    <p>DARK theme</p>
  </div>
</div>
<div style="display: flex;">
 <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f0b.png" />
    <p>custom</p>
  </div>
  <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f0c.png" />
    <p>custom</p>
  </div>
</div>

## Cell style

In addition to using theme to set styles, cell styles can also be set through the configuration style of column Dimensions or row Dimensions, which can achieve the flexibility of customizing styles at the cell level.

# User CASES:

<div style="display: flex;">
 <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f0d.png" />
    <p>From DataWind</p>
  </div>
  <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af80a.png" />
    <p>Sales order information</p>
  </div>
</div>

# Conclusion

VTable is a high-performance table component library based on the visual rendering engine VRender, providing excellent performance and powerful multi-dimensional analysis capabilities, as well as flexible and powerful graphics capabilities. VTable supports fast calculation and rendering of millions of data, and can automatically analyze and render multi-dimensional data. Seamless integration of VChart provides users with powerful data analytics and visualization capabilities. VTable provides rich functions, including multiple table types, cell content types, interactive functions, Themes, styles, custom rendering, etc., to meet the various needs of users. If you are looking for an efficient and easy-to-use data table library, VTable is a good choice!
