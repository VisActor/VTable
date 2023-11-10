# Change Log - @visactor/vtable

This log was last generated on Fri, 10 Nov 2023 10:36:39 GMT and should not be manually modified.

## 0.13.5
Fri, 10 Nov 2023 10:36:39 GMT

### Patches

- feat: refactor merge cell strategy
- feat: add functionial tickCount config in axis 
- feat: update customLayout api

## 0.13.4
Tue, 07 Nov 2023 12:09:57 GMT

### Patches

- feat: add option overscrollBehavior


- fix: drag select out tablecell getSelectCellInfos null


- refactor: change styleElement add targetDom


- fix: select border render error when frozen bottom row #508



## 0.13.3
Fri, 03 Nov 2023 10:46:41 GMT

### Patches

- fix: fix frozen shadow update in tree mode #525



## 0.13.2
Fri, 03 Nov 2023 09:55:11 GMT

### Patches

- fix: getCellByCache maximum call stack size exceeded


- refactor: save select when click outside table #478


- fix: event trigger selected_cell drag_select_end change_header_position


- fix: axis label sort not right #503


- fix: over 100 columns after init scroll right now columns attribute Xvalue error #506


- feat: add decode for react jsx customLayout

## 0.13.1
Fri, 27 Oct 2023 13:15:39 GMT

### Patches

- fix: stack default value is true



## 0.13.0
Wed, 25 Oct 2023 06:11:44 GMT

### Minor changes

- feat: add option headerSelectMode



### Patches

- feat: add initialized event #301


- docs: add event api


- fix: when use customlayout function, after resize col width the row height changed #427


- fix: fix resize compute col width logic #432


- fix: [Bug] set records blank scroll error #458


- feat: add checkbox cell type

## 0.12.2
Wed, 18 Oct 2023 11:47:45 GMT

### Patches

- docs: add option to all demos


- fix: init listtable with blank columns occur error #405



## 0.12.1
Tue, 17 Oct 2023 11:39:37 GMT

### Patches

- feat: support use custom data as summary data #400


- fix: analysis pivot tree summary value is wrong


- docs: add analysis rules demos


- fix: when set description can show not to consider tooltip.isShowOverflowTextTooltip #407


- fix: fix axis zero align error in updateOption()

## 0.12.0
Wed, 11 Oct 2023 09:34:42 GMT

### Minor changes

- docs: add docs about multi tree to pivot table



### Patches

- fix: the width and height of the container is changed, chart display exception. #338


- fix: chart shake when after resize container #344


- fix: the width or height of the container change large，pivotChart display exception. #350


- fix: loss tree HierarchyState when call updateOption #339


- fix: mobile test fix problems #357



## 0.11.0
Thu, 14 Sep 2023 06:45:59 GMT

### Minor changes

- feat: add cellType function define to support different type can show one column #320

### Patches

- fix: indicators/customRender data mapping exception #292


- feat: add api selectCells #300


- fix: when rows is [], pivot-chart display exception #319


- fix: get axis domain with blank columns



## 0.10.2
Wed, 06 Sep 2023 09:18:51 GMT

### Patches

- fix: updatePagination


- feat: update vchart version



## 0.10.1
Fri, 01 Sep 2023 02:36:27 GMT

### Patches

- refactor: wrap text should suit English word #183


- feat: sort support don't execute inner sort logic #230


- refactor: optimize selected interaction when click header cell then use shift keyboard #233


- fix: when set max Width value for column to resize column width occur error #241


- feat: add api for updateAutoWrapText widthMode heightMode #240


- refactor: optimize performance when window resize Compute RowHeight ColWidth  #249


- feat: add analysis for pivot table


- fix: pivotTable horizontal scroll bar is abnormal when the display area is small #269


- feat: add columnResizeType config

## 0.10.0
Wed, 16 Aug 2023 04:16:18 GMT

### Minor changes

- feat: handle legend event to reset chart


- feat: add api getChartDatumPosition


- feat: add right and bottom frozen function

### Patches

- refactor: last column to resize width is inflexibility #136


- refactor: delete widthMode:standard-aeolus and add option of autoFillWidth


- refactor: use barWidth to compute chart column width #185


- refactor: widthMode set adaptive , compute body column to adaptive lefted container space #187


- fix: use updateOption can‘t modify hover highlight mode correctly #189


- refactor: compute optimize height for chart by axis tick count #196


- refactor: sort collectedValues by data.field.domain


- feat: add onVChartEvent Event



## 0.9.2
Wed, 26 Jul 2023 03:47:00 GMT

### Patches

- refactor: chart type handle with transpose or indicator in row



## 0.9.1
Wed, 05 Jul 2023 06:55:19 GMT

### Patches

- fix: chart shake after resize column width


- fix: fix chart size after column width changed


- fix: solve chart image shake caused by decimals


- fix: fix merge cell y position


- fix: fix problems width customRender expectedWidth and expectedHeight


- feat: add custom element line type


- refactor: borderRadius rename to cornerRadius
- refactor: rename to cornerRadius and add demo
- refactor: rename pin to frozen
- feat: support event in mobile device
- feat: add resize event response
- alpha

