# 导读
VTable: 不只是高性能的多维数据分析表格，更是行列间创作的方格艺术家！

在现代应用程序中，表格组件是不可或缺的一部分，它们能够快速展示大量数据，并提供良好的可视化效果和交互体验。VTable是一款基于可视化渲染引擎VRender的高性能表格组件库，为用户提供卓越的性能和强大的多维分析能力，以及灵活强大的图形能力。

# 流畅的性能体验
VTable采用可视化渲染引擎VRender进行封装，提供了卓越的性能和渲染效果。VTable支持百万级数据的秒级渲染，可以快速展示大量数据。下面我们来看一个例子，展示VTable的快速渲染能力。也可转到官网亲自体验：https://visactor.io/vtable/demo/performance/100W
![VTable滚动交互性能展示](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/f7c7048f8d595c464505b5f00.gif)

# 多种表形态
VTable提供了三种主要的表格形态，包括基本表格、多维透视表格和透视组合图，以及gantt甘特图。可以满足不同用户的需求，帮助用户更好地展示和分析数据，并从中发现有价值的信息。
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

- 基本表格是最简单的表格形态，它由行和列组成，每个单元格包含一个数据项。基本表格适用于对数据进行简单的排列和展示。
- 透视表格是一种用于多维数据分析的表格形态，它可以将数据按照多个维度进行聚合和汇总，为用户提供多角度的数据分析和探索。
- 透视组合图是一种将多维透视表格与其他图表形式（如柱状图、折线图等）结合起来的图表形态，它可以将透视表格中的数据转化为更直观、易懂的图形展示。
- 甘特图是一种用于展示项目进度和资源分配的图表形态，它可以帮助用户更好地了解项目的进展情况和资源分配情况。

同时基本表格可以形变为转置表格，还可以用树形结构展示层次关系：

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

透视表的行表头也可用树形结构展示维度间层级关系：
 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af805.png" />
    <p>pivot table-tree mode</p>
  </div>
  

# 丰富的单元格呈现形式
VTable提供了多种单元格呈现形式，可以满足不同的数据展示需求，帮助用户更好地呈现和分析数据。
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/5717b050ef81c8b03549af806.png)
具体支持的单元格呈现形式有：
1.  **'text'文本类型**：用于展示文字数据。同时支持多种样式和格式，如字体大小、颜色、加粗、斜体、自动换行等，也可对数据进行格式化，来满足不同的排版需求。
1.  **'link'链接类型**：将数据转化为超链接，点击链接可以跳转到指定的网页或文件
1.  **'image'图像类型**：将有效url转化为图像展示，如照片、图标等。
1.  **'video'视频类型**：将有效url转化为视频展示，如YouTube视频、本地视频文件等。
1.  **'sparkline'迷你图类型**：将数据转化为小型图表展示，如折线图、面积图，在表格中展示数据趋势和变化。
1.  **'progressbar'进度条类型**：将数据转化为进度条展示，可自定义进度条颜色、大小和文本，可以方便地在表格中展示任务进度和状态。
1.  **'chart'图表类型**：将数据转化为VChart图表在单元格中展示。
1.  **自定义渲染**：如果想要单元格呈现更为丰富的内容或布局形态，还可以通过自定义渲染来实现。

# 全面的交互能力
VTable提供了丰富全面的交互能力。
## 表格交互
交互类型包括：选中单元格，hover高亮，拖拽换位，排序，冻结列，调整列宽等。
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

## 组件级交互
交互类型包括：滚动条滚动，tooltip提示，dropdown下来菜单弹出等。

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

如果上述交互还不能满足需求，可以结合event事件监听来自定义交互行为。
# 灵活多样的UI风格
VTable支持多种主题和样式，可以根据用户的需求进行自定义设置，以满足不同的视觉效果。
## 多套theme主题

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

## 单元格style
除了使用theme来设置样式外，还可以通过列维度或者行维度的配置style来设置单元格样式，可以达到单元格级别自定义样式的灵活程度。

# 用户CASES：
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

# 结语
VTable是一款基于可视化渲染引擎VRender的高性能表格组件库，提供了卓越的性能和强大的多维分析能力，以及灵活强大的图形能力。VTable支持百万级数据的快速运算和渲染，可以自动分析和呈现多维数据，无缝融合VChart，为用户提供了强大的数据分析和可视化能力。VTable提供了丰富的功能，包括多种表格类型、单元格内容类型、交互功能、主题、样式、自定义渲染等，以满足用户的各种需求。如果你正在寻找一款高效、易用的数据表格库，VTable是一个不错的选择！