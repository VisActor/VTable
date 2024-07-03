# Change Log - @visactor/vtable

This log was last generated on Tue, 02 Jul 2024 12:48:08 GMT and should not be manually modified.

## 1.4.2
Tue, 02 Jul 2024 12:48:08 GMT

### Updates

- feat: corner title can display row and column diemensionTitle #1926


- fix: when not exit edit state then can not select other cells #1974


- fix: selected_clear event trigger #1981


- feat: add column hide config #1991


- refactor: sparkline cellType set aggregationType None automatically #1999


- fix: pivotTable virtual node edit value not work #2002


- fix: tooltip content can not be selected #2003


- feat: add getCellAtRelativePosition api
- fix: fix vrender export module
- fix: fix merge cell update performance problem #1972
- fix: fix regexp format for webpack 3 #2005
- fix: fix width computation in shrinkSparklineFirst mode

## 1.4.1
Mon, 24 Jun 2024 08:48:40 GMT

### Updates

- fix: fix editingEditor missing problem

## 1.4.0
Fri, 21 Jun 2024 10:26:08 GMT

### Minor changes

- feat: support calculate field for PivotTable #1941



### Updates

- fix: updateSortState api occor error #1939


- feat: support corner header cell edit value #1945


- fix: when setRecords should update emptyTip #1953


- fix: getCellRect api when cell is frozen get bounds error #1955


- fix: when drag cell and enter edit state but can not exit edit rightly #1956


- chore: update vrender version


- feat: add indent in vtable-export
- feat: add CustomComponent in react-vtable
- feat: add CustomLayout component in react-vtable
- fix: fix custom width problem #1905
- fix: fix content judgement in getCellRange() #1911
- fix: fix size update problem in pivot table sort #1958

## 1.3.3
Thu, 20 Jun 2024 12:19:07 GMT

### Updates

- fix: fix column update problem #1951

## 1.3.2
Mon, 17 Jun 2024 11:51:18 GMT

### Updates

- fix: cellIsInVisualView api error #1864


- refactor: tooltip support scroll #1887


- fix: if set style autoWrapText, this config not wort when resize column width #1892


- refactor: when not records pivot table can show corner header #1895


- refactor: when rowTree children not set value can supplement indicators #1924


- feat: add blankAreaClickDeselect and outsideClickDeselect config



## 1.3.1
Thu, 13 Jun 2024 12:35:49 GMT

### Updates

- fix: fix frozenColCount large than colCount error #1872


- docs: update changlog of rush


- fix: fix merge cell size update #1869
- fix: optimize row height update when useOneRowHeightFillAll

## 1.3.0
Wed, 12 Jun 2024 12:30:16 GMT

### Minor changes

- feat: tooltip disappear delay time #1848


- feat: add sort config for pivotTable #1865



### Updates

- refactor: memory release logic optimization #1856


- refactor: arrow key with shift ctrl key to select cells #1873


- fix: icon inlineEnd inlineFront x position compute error #1882


- fix: drill down icon can not be click #1899


- feat: add ignoreIcon&formatExportOutput config in vtable-export #1813
- feat: add textArea editor


- feat: add strokeColor style #1847
- feat: add dx&dy in title component #1874
- fix: fix frozenColCount large than colCount error #1872
- feat: add shrinkSparklineFirst config #1862
- fix: fix ellipsis error in _disableColumnAndRowSizeRound mode #1884

## 1.2.0
Thu, 06 Jun 2024 02:34:10 GMT

### Minor changes

- feat: add merge cell custom graphic attribute sync #1718

### Updates

- feat: support select highlightMode effect #1167


- feat: add isAggregation api #1803


- fix: when has no records should not has aggregation row #1804


- refactor: update pixelRatio when resize #1823


- fix: updateColumns set editor error #1828


- chore: update vrender version


- refactor: selectAllOnCtrlA option


- feat: optimize large column performance #1840 #1824
- fix: fix maxCharactersNumber effect #1830

## 1.1.2
Fri, 31 May 2024 08:56:27 GMT

### Updates

- chore: update vrender version



## 1.1.1
Thu, 30 May 2024 08:07:33 GMT

### Updates

- refactor: dimension value same with indicator key cell value error #1817


- fix: when set emptyTip interaction not work well with has records #1818


- fix: fix table frame corner radius display problem #1783

## 1.1.0
Tue, 28 May 2024 12:24:56 GMT

### Minor changes

- feat: add empty tip #1782



### Updates

- fix: add update delete record api should maintain beforeChangedRecordsMap #1780


- fix: when set disableSelect table should support drag header #1800


- fix: fix tree create problem in getDataCellPath()
- fix: fix left axis index in horizontal pivot chart

## 1.0.3
Fri, 24 May 2024 10:31:16 GMT

### Updates

- refactor: legends support ser array form #1740


- fix: first col tree mode compute col width error #1778



## 1.0.2
Fri, 24 May 2024 10:08:07 GMT

### Updates

- fix: use table option in hasAutoImageColumn()
- fix: axis size align with vrender-component #1784
- fix: fix lineClamp config in computeRowsHeight() #1772
- fix: fix progress cell create problem in vtable-export #1787
- fix: ignore cell merge in selectCells()
- feat: add setRowHeight&setColWidth api

## 1.0.1
Wed, 22 May 2024 12:21:05 GMT

### Updates

- feat: tree mode  can set icon #1697


- fix: ignore cell merge in selectCells()
- feat: add setRowHeight&setColWidth api

## 1.0.0
Tue, 21 May 2024 12:41:50 GMT

### Breaking changes

- feat: add virtual option for rowTree and columnTree #1644

 BREAKING CHANGE: getCellOriginRecord will return an array of source data.

### Updates

- feat: rows and tree can  combined use  #1644



## 0.25.9
Tue, 21 May 2024 12:33:13 GMT

### Updates

- fix: when body cell is blank string,compute row height error #1752


- fix: fix custom merge cell display problem when select header

## 0.25.8
Tue, 21 May 2024 11:19:27 GMT

### Updates

- feat: add scrollSliderCornerRadius config #1369


- fix: when set hideRowHeader, body cell value is blank #1732


- fix: setTableColumnsEditor occor error when not set columns #1747


- feat: add disableBackground &  disableBorder in exportCellImg() #1733
- feat: add disableColumnResize for rowSeriesNumber


- fix: fix col & row order in cellInRanges()
- fix: add string mark in csv-export #1730

## 0.25.7
Fri, 17 May 2024 12:08:43 GMT

_Version update only_

## 0.25.6
Fri, 17 May 2024 10:50:13 GMT

### Updates

- feat: add selected_clear event #1705


- fix: mouse down on scroll rail trigger mousedown_table #1706


- fix: merge cell value can be edited #1711


- fix: sub colunms can not be edit when set editor instance #1711


- feat: add mergeCellInfo arg in event #1667
- fix: fix checkbox and radio state update when change row index #1712
- fix: fix veritial offset in text stick
- fix: fix column width may be zero #1708
- fix: fix getCell performance
- fix: fix header hide func in pivot table
- fix: lineDash judgement in group-contribution-render #1696

## 0.25.5
Mon, 13 May 2024 13:47:37 GMT

### Updates

- fix: trigger mousedown_table event region need extend #1668



## 0.25.4
Fri, 10 May 2024 03:15:01 GMT

### Updates

- feat: remove vutil-extension temply

## 0.25.3
Thu, 09 May 2024 11:13:29 GMT

### Updates

- feat: remove vutil-extension temply

## 0.25.2
Wed, 08 May 2024 10:48:37 GMT

### Updates

- fix: fix veritial offset in text stick

## 0.25.1
Wed, 08 May 2024 08:38:35 GMT

### Updates

- feat: pivot chart support wordCloud rose radar gauge #1614


- feat: pivot chart support scatter chart type #1618


- fix: when copy blank cell paste not work #1646


- feat: add CustomComponent in react-vtable
- fix: fix custom merge cell size update #1636
- fix: add arg in completeEdit()
- fix: add selecting cell range deduplication #1628
- fix: update @visactor/vutils-extension version

## 0.25.0
Sun, 28 Apr 2024 06:22:38 GMT

### Minor changes

- feat: add row resize function

### Updates

- feat: pivot table header cell support edit #1583


- feat: customrender or customlayout support edit #1596


- fix: editor input value handle with 0value #1590


- fix: when set textStick init and updateOption text jump #1592


- fix: clear async contain resize task before render #1593
- fix: hierarchy state icon can not show when only one level


- refactor: resize last column width can be more  flexibly #1567



## 0.24.1
Tue, 23 Apr 2024 11:19:00 GMT

### Updates

- docs: add drill down drill up demo #1556


- fix: when has rowSeriesNumber minWidth maxWidth error #1572


- feat: add startEditCell api #1573


- refactor: pivot lazy load modify setTreeNodeChildren api #1580



## 0.24.0
Mon, 22 Apr 2024 10:59:12 GMT

### Minor changes

- feat: add lazy load for pivot table tree #1521


- feat: add radio column type

### Updates

- fix: handle with editor input ctrl+a event #1552


- refactor: optimize performance when row tree node exceed 8000 nodes #1557


- fix: when resize window size the editor input size not match cell size #1559


- feat: add setCellCheckboxState & setCellRadioState api #1504
- fix: fix multilines new line style #1531
- fix: fix cell group order in async data #1517
- fix: add skipCustomMerge in getCellValue() #1543

## 0.23.4
Thu, 18 Apr 2024 08:13:35 GMT

### Updates

- fix: fix right & top axis visible

## 0.23.3
Tue, 16 Apr 2024 08:38:10 GMT

### Updates

- refactor: add mousedown_table event #1470


- refactor: setRecords handle with tooltip overflow #1494


- fix: release editor when release tableInstance #1495


- fix: short table drag to out table occor error #1502


- fix: row move funciton not work on mobile #1503


- fix: defaultHeaderRowHeight not work with rowSeriesNumber #1520


- fix: tree hierarchy state icon use rowHierarchyTextStartAlignment children node render error #1525


- fix: resize col width trigger text stick change #1529


- fix: fix theme textStick config in checkHaveTextStick() #1490 
- fix: add button jedgement in click_cell event #1484
- feat: add widthAdaptiveMode & heightAdaptiveMode config #1499
- feat: add measureTextBounds api
- fix: fix defalultQueryMethod in vtable-search #1448
- fix: update customMergeCell in updateOption #1493

## 0.23.2
Wed, 10 Apr 2024 13:08:31 GMT

### Updates

- fix: records api when has merge cell render error #1286


- refactor: update drilldown drillup svg


- feat: scrollbar visible focus #1360


- fix: add isAutoRowHeight to handle width row height compute #1379


- feat: add rowHierarchyTextStartAlignment for tree mode #1417


- refactor: handle width chartSpce with markLine #1420


- fix: chart spec clone filtered dom problem #1422


- refactor: supplement event type for react table #1434


- fix: borderlinedash effect error handle with lineCap #1436


- fix: trigger event selectedCell #1444


- fix: set disableSelect drag cells occor error #1461


- fix: left content width error when tree hierarchy state icon back rect showing #1466


- fix: fix domain order in  horizontal #1453
- fix: add columnWidthComputeMode update in opdateOption #1465
- fix: fix inline icon tooltip config #1456
- fix: 修复进度图部分情况遮挡表格边缘单元格


- fix: fix transpose border theme #1463

## 0.23.1
Sun, 07 Apr 2024 02:48:06 GMT

### Updates

- fix: maxLineWidth value should consider hierarchyOffset #1224


- fix: tree leaf node textAlign right render error #1393


- feat: select range can extends during scroll #1400


- fix: when copy or paste navigator.clipboard?.write occor undefined error in not https #1421


- fix: fix header cell imageAutoSizing #1339
- fix: hide icon background when hide icon
- fix: fix nan verticalBarPos #1232
- fix: fix progressbar cover cell border #1425
- fix: remove container in table option
- fix: add sync render in exportCellImg #1398
- refactor: optimize performance when change tree hierarchy state #1406



## 0.23.0
Fri, 29 Mar 2024 09:26:36 GMT

### Minor changes

- feat: add scroll end event and barToSide option #1304


- feat: add excel options to support fill handle



### Updates

- fix: transpose with frozenColCount shadowline render #1366


- feat: list tree mode support filter #1376


- fix: datasource support promise mode call addRecords and deleteRecords


- fix: when click cell should not trigger drag_select_end event #1410



## 0.22.3
Thu, 28 Mar 2024 07:06:46 GMT

### Updates

- fix: fix legend default selectData

## 0.22.2
Wed, 27 Mar 2024 06:41:08 GMT

### Updates

- fix: icon set interactive true logic error #1097


- fix: customlayout container set width invalid #1263


- fix: row height compute error when set autoHeight and has large count columns #1325


- fix: compute row height handle with sparkline cellType #1331


- fix: pivot-image demo can not scroll #1337


- feat: add validateValue api for editor #1374


- fix: change-header-position arguments row refix


- fix: drawCellInnerBorder with no frameStyle #1381


- feat: max/min in progress support funtion #1312
- fix: fix axis column/row visible in pivotchart #1309
- fix: fix _widthResizedColMap update in DBLCLICK_CELL #1297
- fix: fix table text measurement in restore mode #1349
- fix: fix merge cell custom layout update #1271
- fix: fix stroke width update in merge cell #1324
- fix: add _contentOffset in progressbar #1350
- fix: fix richtext height measurement #1313
- fix: fix textStickBaseOnAlign in style
- refactor: setRecords clear reference object #1188



## 0.22.1
Fri, 22 Mar 2024 11:26:30 GMT

### Updates

- feat: add openinula-vtable

## 0.22.0
Fri, 22 Mar 2024 10:54:02 GMT

### Minor changes

- feat: support rowSeriesNumber #968


- feat: record data support set hierarchyState



### Updates

- fix: fix typeError in getCellMergeRange()

## 0.21.3
Wed, 20 Mar 2024 10:48:31 GMT

### Updates

- fix: mapping colorMap not work #1295


- fix: when copy blank cell and paste to cell change to undefined #1298


- fix:  bug datasource lazy load edit cell value invalid #1302


- docs: add list table tree mode guide


- fix: fix cell progress create content size
- fix: fix row level in getCellAdressByHeaderPath()
- fix: use default style in exportCellImg()
- fix: fix typeError in getCellMergeRange()

## 0.21.2
Thu, 14 Mar 2024 02:24:21 GMT

### Updates

- fix: after change transpose resize line render error #1239


- fix: pivot tree mode when use headerIcon the indent value invalid #1269


- feat: add textStickBaseOnAlign config
- fix: fix progress bar rect height

## 0.21.1
Mon, 11 Mar 2024 07:05:40 GMT

### Updates

- fix: merge cell render error with summary and pagination #1223


- docs: indicatorsAsCol support indicators display in rows #1238



## 0.21.0
Mon, 11 Mar 2024 06:03:40 GMT

### Minor changes

- feat: add search component

### Updates

- refactor: pasteValueToCell can only work on editable cell #1063


- refactor: support underlineDash and underlineOffset #1132 #1135


- fix: records change restoreHierarchyState occor error #1203


- fix: call updatePagination mergeCell render error #1207


- refactor: onStart funciton add col row arguments #1214


- fix: drag header position cell error #1220


- test: add unit test getCellAddressByHeaderPaths


- feat: add text measure ment config
- feat: add custom cell style function
- fix: fix checkbox text space problem
- fix: fix scroll position delta 
- feat: add cellInnerBorder&cellBorderClipDirection&_contentOffset in theme comfig

## 0.20.3
Mon, 04 Mar 2024 04:30:08 GMT

### Updates

- fix: fix checkbox text space problem

## 0.20.2
Fri, 01 Mar 2024 11:46:26 GMT

### Updates

- fix: rightFrozenCol is bigger then colCount #1162


- fix: header description tooltip flicker #1173


- feat: add checkbox style theme
- fix: add fontStyle & fontVariant

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

