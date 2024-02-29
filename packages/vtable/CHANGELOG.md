# Change Log - @visactor/vtable

This log was last generated on Thu, 29 Feb 2024 11:57:42 GMT and should not be manually modified.

## 0.20.1
Thu, 29 Feb 2024 11:57:42 GMT

### Updates

- fix: hideColumnsSubheader with three levels show error #1105


- feat: add api getRecordIndexByCell #1121


- refactor: rename resize_column_end event arguments #1129


- refactor: api return value type


- refactor: setRecords support restoreHierarchyState #1148


- fix: customlayout flex render error #1163


- refactor: vtable not stop event bubble #892
- fix: when scroll tooltip hide #905


- fix: fix axis innerOffset
- fix-contextMenuItems-add-col-param
- fix: add skipFunctionDiff in react-vtable
- refactor: remove Circular dependency



## 0.20.0
Fri, 23 Feb 2024 10:06:24 GMT

### Updates

- feat: add aggregation for list table column


- feat: add api getAggregateValuesByField


- feat: add custom aggregation


- fix: edit right frozen cell input position error


- fix: mouseleave_cell event trigger #1112


- feat: chartSpec support function #1115


- feat: add filter data config #607


- fix: fix cellBgColor judgement in isCellHover()
- fix: fix custom merge cell computed height&width
- fix: fix content position update problem
- fix: merge cell update in setDropDownMenuHighlight()
- fix: fix react-vtable display error in react strict mode #990

## 0.19.1
Mon, 05 Feb 2024 12:36:17 GMT

### Updates

- refactor: pivot table sort logic #1033


- feat: add update sort rule api


- fix: when table has scroll then click header to edit position error #1069


- refactor: showsort option work well #1077


- feat: add axis innerOffset config
- fix: fix column cell order problem in sync mode
- fix: fix border lineDash in cell group #1051
- fix: fix textAlign value in width update#1065
- feat: add name config in customRender
- fix: fix merge cell content position
- fix: fix merge cell update problem

## 0.19.0
Fri, 02 Feb 2024 04:13:16 GMT

### Updates

- fix: select region saved problem #1018


- fix: when call updateColumns and discount col occor error #1015


- fix: rightFrozenColCount drag header move more time the column width is error #1019


- fix: empty string compute row height error #1031


- feat: support get sorted columns #986


- feat: add option frozenColDragHeaderMode


- refactor: when drag header move to frozen region then markLine show positon


- refactor: optimize updateRow api performance & resize bottom frozen row not right


- fix: fix merge image cell update problem

## 0.18.4
Fri, 26 Jan 2024 09:15:07 GMT

### Updates

- fix: when click bottomFrozenRow table scroll sometimes #1011



## 0.18.3
Thu, 25 Jan 2024 10:27:02 GMT

### Updates

- fix: click outside of cells click cancel select state



## 0.18.2
Wed, 24 Jan 2024 12:12:36 GMT

### Updates

- fix: fix rowHeaderGroup attribute y when has no colHeaderGroup #971


- fix:  transpose bottomFrozenRow cell layout error #978


- fix: passte value to last row occur error #979


- fix: use updateColumns api click state not right #975


- fix: record has nan string value pivotchart cell value parse handle this case #993


- fix: row Height compute for axis


- fix: fix deltaY col number in moveCell()
- feat: add component update

## 0.18.1
Fri, 19 Jan 2024 11:43:14 GMT

### Updates

- fix: fix funciton updateColumnWidth occor error



## 0.18.0
Fri, 19 Jan 2024 10:43:47 GMT

### Minor changes

- feat: add eventOptions #914



### Updates

- fix: handle with chartSpec barWidth set string type


- fix: addRecords api call when body no data #953


- fix: mouse drag to move Header position has error when column has multi-levels #957


- fix: when resize column width bottomFrozenRow height should update #954


- feat: pivotchart support pie


- feat: add customLayout & customRander in customMergeCell

## 0.17.10
Thu, 18 Jan 2024 03:43:34 GMT

### Updates

- fix: select border range error #911


- fix: when enable pasteValueToCell and event change_cell_value arguments is error #919


- feat: use vrender-core
- fix: fix tree structure auto merge update problem
- fix: toggele tree node updateChartSize



## 0.17.9
Wed, 10 Jan 2024 11:22:48 GMT

### Updates

- feat: support excel data paste to cells #857


- fix: showSubTotals can not work #893


- feat: add api getCellAddressByRecord


- feat: optimize getCellHeaderPath function
- fix: set display:none trigger resize logic


- fix: fix right frozen cell location

## 0.17.8
Fri, 05 Jan 2024 10:34:08 GMT

### Updates

- fix: selectRange error when near frozencol or frozenrow #854


- fix:  frozen shadowline should move position #859


- fix: fix chart cell dblclick size update
- fix: fix bottom frozen row height compute in createGroupForFirstScreen()
- fix: fix cellGroup merge range
- fix: fix react custom jsx parse

## 0.17.7
Thu, 04 Jan 2024 10:03:11 GMT

### Updates

- feat: add cell image table export
- fix: fix jsx parse error in react-vtable

## 0.17.6
Wed, 03 Jan 2024 13:58:45 GMT

### Updates

- fix: fix resize line position

## 0.17.5
Wed, 03 Jan 2024 12:50:32 GMT

### Updates

- feat: support edit header title #819


- fix: setRecords process scrollTop update scenegraph #831


- refactor: list table bottom row can not use bottomFrozenStyle #836


- feat: add api getCellHeaderTreeNodes for pivotTable #839


- refactor: add onVChartEvent for BaseTable #843


- fix: add group clip in body

## 0.17.4
Tue, 02 Jan 2024 09:23:54 GMT

### Updates

- fix: fix frozen chart cell active problem 

## 0.17.3
Fri, 29 Dec 2023 12:31:07 GMT

### Updates

- fix: setRecords lose hover state  #783


- feat: add body index convert with table index #789


- fix:  transpose list demo when records has 10000 performance problem #790


- fix: setRecords recomputeColWidth problems #796


- fix: set disableSelect drag interaction occor error #799


- feat: mergeCell support custom compare function #804


- fix: tooltip style not work #805


- fix: pivot table pagination.perPageCount modify #807


- fix: [Bug] adaptive mode compute problem when has frozencol and rightFrozenCol #820


- fix: fix axis render update problem
- feat: add column resize label theme
- fix: fix select update when change frozen
- fix: pivot table use icon bug


- fix: fix sort icon update
- refactor: update vrender event verison use scrollDrag


- chore: update vrender version #785



## 0.17.2
Thu, 21 Dec 2023 11:54:58 GMT

### Updates

- fix: edit bug #771


- fix: add row height round in resetRowHeight

## 0.17.1
Thu, 21 Dec 2023 04:01:16 GMT

### Updates

- refactor: 100W records scroll performance optimize when has select Cell #681


- fix: stopPropagation effect doubletap


- refactor: remove default sort rule for pivot table #759


- fix: dropdown_menu_click trigger #760


- fix: dblclick occur error #758


- fix: fix richtext error in getCellOverflowText()
- feat: add arrowkeys interaction #646


- fix: add scrollBar event to call completeEdit #710


- docs: update changlog of rush


- fix: support tree mode adaptive
- fix: fix dropdown icon display error
- fix: fix right frozen columns width update problem

## 0.17.0
Fri, 15 Dec 2023 11:23:08 GMT

### Updates

- feat: add option showGrandTotalsOnTop  #650


- feat: optimize diffCellIndices in toggleHierarchyState()
- fix: fix right frozen adaptive problem
- feat: add disableAxisHover config
- feat: optimize computeTextWidth() in pivot table
- fix: fix disableHover bottom frozen hover error
- fix: fix rowUpdatePos update in updateRow()
- refactor: dropdownMenu hide #727



## 0.16.3
Wed, 13 Dec 2023 11:43:30 GMT

### Updates

- fix: fix axis theme get function
- feat: add enableCellPadding config in custom layout
- feat: add column disableHover&disableSelect config
- fix: pivot table support not number type #718


- fix: edge cell selection border clip #716



## 0.16.2
Wed, 13 Dec 2023 03:30:39 GMT

### Updates

- fix: blank cell edit invalid on pivottbale #712


- fix: data lazy load when drag header position #705


- refactor: pivot table format arguments


- docs: pivot table format usage update



## 0.16.1
Fri, 08 Dec 2023 10:37:39 GMT

### Updates

- fix: add min first screen limit

## 0.16.0
Fri, 08 Dec 2023 09:27:10 GMT

### Minor changes

- feat: add api addRecords


- feat: add api delRecords



### Updates

- fix: updateOption to update updateEventBinder


- fix: columnResizeType: all invalid


- docs: refix lineheight description


- fix: fix tree structure bottom frozen update
- feat: axis support chart padding config
- fix: fix limit column width adaptive update
- fix: fix table range when container resize
- feat: optimize pivot header performance
- fix: fix table frame shadow color
- fix: fix scroll position update problem
- feat: add axis theme
- feat: overlay default and hover colors

## 0.15.4
Fri, 01 Dec 2023 10:28:56 GMT

### Updates

- fix: editor object set in column be cloned


- fix: fix theme style get problem
- fix: fix list table frozen hover color
- fix: fix right bottom frozen cell in getCellRect()
- fix: fix table resize problem when column width limit
- fix: fix custom render renderDefault auto size problem
- fix: fix columnWidthComputeMode config problem
- fix: release tableInstance after resize event trigger


- refactor: ts define optimize


- fix: columnWidthComputeMode only-header



## 0.15.3
Thu, 30 Nov 2023 10:46:46 GMT

### Patches

- fix: fix bottom left frozen cell style

### Updates

- feat: add setRecordChildren to lazy load tree node


- feat: pivot table support editable


- fix: fix cornerCellStyle update
- fix: fix chart item select problem

## 0.15.2
Thu, 30 Nov 2023 02:57:38 GMT

### Patches

- fix: fix merge cell checkbox update

## 0.15.1
Tue, 28 Nov 2023 12:32:45 GMT

### Updates

- refactor: sortState can not work when column has no sort setting #622


- docs: add api getCellCheckboxState


- fix: drag select first cell seleted repeatly #611


- refactor: remove keydown event arguments cells


- refactor: rename maneger to manager


- fix: no indicators pivotchart render


- fix: compute chart column width use Math.ceil bandSpace



## 0.15.0
Fri, 24 Nov 2023 12:06:58 GMT

### Minor changes

- feat: add event copy_data #551


- feat: add column with min limit #590
Open


- feat: edit text value with inputEditor


- feat: add react-vtable

### Patches

- fix: compute col width when large count col with sampling the frozen bottom rows is not computed


- fix: fix cell position mismatch problems when bodyRowCount is 0 #596


- fix/fix cell role judgement in updateCellGroupContent()
- fix: fix text mark x in updateCell()

## 0.14.3
Fri, 17 Nov 2023 08:33:08 GMT

### Patches

- refactor: add dpr argument when init vchart #570


- fix: select_border_clip



## 0.14.2
Thu, 16 Nov 2023 04:36:53 GMT

### Patches

- fix: row header select bound wrong #572


- fix: selectHeader copy data



## 0.14.1
Mon, 13 Nov 2023 12:07:03 GMT

### Patches

- refactor: when drag to canvas blank area to end select #556



## 0.14.0
Fri, 10 Nov 2023 11:31:45 GMT

### Minor changes

- feat: add jsx support in custom layout

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

### Updates

- none
- update vrender version

