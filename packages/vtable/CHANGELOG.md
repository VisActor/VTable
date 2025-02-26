# Change Log - @visactor/vtable

This log was last generated on Wed, 26 Feb 2025 11:11:06 GMT and should not be manually modified.

## 1.17.0
Wed, 26 Feb 2025 11:11:06 GMT

### Minor changes

- feat: add switch & button cell type
- feat: delete loading icon auto register

### Updates

- feat: gantt time scale support visible #3098


- docs: update changlog of rush


- feat: dropdownmenu support function #3443


- fix: after release instance, resize event occor error #3459


- fix: when set autoFillWidth the rowSeriesNumber column not change his width #3459


- fix: when resize taskbar start or end time tree node update error #3460


- feat: add verticalLineDependenceOnTimeScale #3467


- fix: fix node env config
- feat: add api activateChartInstance replaceChartCacheImage


- feat: add `specTransformInCell` for support modifying vchart spec of each cell in PivotChart


- fix: fix row/col is decimal in animation #3455
- fix: fix height is decimal in carousel #3458

## 1.16.2
Wed, 19 Feb 2025 07:56:38 GMT

### Updates

- fix: field with dot occor error # 3409


- fix: getChartInstance log vchart updateViewBox method #3442


- fix: computeAxisComponentWidth value ceil #3444


- fix: fix sort function in getCheckboxState() #3394

## 1.16.1
Fri, 14 Feb 2025 09:37:30 GMT

### Updates

- refactor: progressbar type cell support customLayou #3295


- fix: when rowHierarchyType is tree total value show on top no work #3322


- fix: when column has custom aggregation edit cell update #3333


- feat: add visibleOnHover setting for columnResize #3349


- feat: gantt barStyle support function #3364


- refactor: supplement theme frozen frameStyle border create #3400


- fix: progress will only support number not decimals #3401


- fix: disable auto resize column width when double clicking the column border line


- fix: fix bodyGroup frame update #3404
- fix: fix dom position in react-vtable #3314
- fix: fix groupBy judgement in getHierarchyState() #3406
- fix: fix sorted checkbox state #3394

## 1.16.0
Sat, 08 Feb 2025 11:35:13 GMT

### Minor changes

- feat: add grid-tree mode for pivot table



### Updates

- fix: when resize gantt view size should update dependency node size #3287


- fix: resize or move taskbar update record problem #3321


- fix: updateScales to quarter taskbar size error #3348


- refactor: rowSeriesNumber cell can use theme headerStyle #3362


- fix: mouseover last date border occor error for gantt #3373


- feat: support async in downloadCsv&downloadExcel
- feat: linkJump & linkDetect support function
- feat: support react17 in customLayout function
- feat: add keepColumnWidthChange in vue-vtable #3346
- fix: fix clipped judgement in getCellOverflowText()
- fix: fix rowData error in media-click #3342
- fix: fix header checkbox state in functional cellType #3334
- fix: fix text vertical layout #3353
- fix: fix merge cell style update in vtable-search #3327

## 1.15.2
Sun, 26 Jan 2025 08:59:28 GMT

### Updates

- fix: when mouse leave gantt should trigger mouseleave_taskbar #3294


- feat: dependField&batType support function in progress-bar
- feat: add emptyTip click event
- feat: canvasWidth canvasHeight support auto setting #3089


- feat: add data update in list-table tree(group) mode
- feat: add groupTitleFieldFormat API #3092
- feat: add skipImageExportCellType in vtable-export
- fix: fix empty-tip layout problem when resize window #3312
- fix: remove tree limit in handleTextStick() #3274

## 1.15.1
Fri, 17 Jan 2025 10:20:01 GMT

### Updates

- fix: when mouse leave gantt should trigger mouseleave_taskbar #3294


- feat: add emptyTip click event
- feat: canvasWidth canvasHeight support auto setting #3089


- feat: add data update in list-table tree(group) mode
- feat: add groupTitleFieldFormat API #3092
- fix: fix empty-tip layout problem when resize window #3312
- fix: remove tree limit in handleTextStick() #3274

## 1.15.0
Thu, 09 Jan 2025 08:44:38 GMT

### Minor changes

- feat: aggregationType custom work in pivot table #1508



### Updates

- feat: support register aggregator #1508


- fix: when columns is all hide then should not generate cell ids #3199


- feat: frozenColCount work in pivot table #3201


- feat: add moveToExtendDateRange option #3221


- fix: when header tree indicator node has different value, columnWidthConfig not work #3258


- fix: when resize taskBar width the text label should update #3263


- fix: when left table set autoWidth gantt chart render error #3266


- feat: add keyboardOptions and add delete_dependency_link contextmenu_dependency_link event #3268


- docs: add weather calendar demo
- feat: customMergeCell support array config #3202
- feat: add displayMode in emptyTip
- feat: groupby support array config


- feat: add penetrateEventList config in react-component
- docs: add scheduleCreatable doc


- fix: change taskRecord type from string to any


- fix: fix aggregation display issue in tree-structured table headers


- fix: fix collapse checkbox state update #3171
- fix: clear sort target when setRecords in dataset
- fix: fix frozen update problem in react-dom-component
- fix: fix iterator map in getCheckboxState() #3177 #3239
- feat: add keepColumnWidthChange props in react-vtable
- feat: add imageAnonymous in customConfig

## 1.14.3
Fri, 27 Dec 2024 09:48:26 GMT

### Updates

- feat: showSort support function type #2630


- feat: add hide for indicator setting #2257 #2451


- feat: add enableTreeCheckbox config
- fix: fix borderLineWidth array config #3183
- fix: when set resizable false hover taskbar occor error #3189



## 1.14.2
Wed, 25 Dec 2024 09:27:34 GMT

### Updates

- fix: fix borderLineWidth array config #3183

## 1.14.1
Mon, 23 Dec 2024 12:36:10 GMT

### Updates

- feat: add grid rowBackgroundColor and columnBackgroundColor weekendBackgroundColor #3155


- refactor: add option tableSizeAntiJitter #3160


- fix: gantt taskbar resize width interaction can not limit one time unit #3161


- fix: fix axes count error in seriesIds config

## 1.14.0
Fri, 20 Dec 2024 10:12:51 GMT

### Minor changes

- fix: change checkboxState into Map

### Updates

- feat: add contextmenu_task_bar event #3013


- feat: add milestone type #3097


- fix: validateValue not promise case can not be recalled #3144


- fix: adjust scroll hot area limited on table group #3152


- feat: add mergeCell function to support more detailed conditions
- feat: support tickAlign in PivotChart
- feat: add updateMarkLine


- fix: fix react-component update in tree table
- fix: fix customStyle update not work #3068
- fix: fix font-weight in vtable-export #3005
- feat: add enums in validateValue of vtable-editor #3039
- fix: fix graphic html attribute error
- fix: application define in react-vtable umd file #3093
- fix: fix customRender error in react-vtable #3142
- fix: fix group title link click #3022
- fix: fix cell group judgement when scroll #3149
- fix: fix undeline height in text measurement #3112
- refactor: customComputeRowHeight logic



## 1.13.2
Mon, 16 Dec 2024 11:33:07 GMT

### Updates

- fix: copy permission check when in iframe #3077


- fix: when has select cells to resize col width or row height error #3085


- feat: resizable and moveable support function #3074


- feat: add updateOption and updateScales api


- fix: consider not set mindate maxdate call setRecords api



## 1.13.1
Fri, 13 Dec 2024 08:48:53 GMT

### Updates

- feat: add time scale unit hour #2976


- fix: left table width handle with tableWidth set auto #3033



## 1.13.0
Mon, 09 Dec 2024 08:20:54 GMT

### Minor changes

- fix: fix text baseline align problem

### Updates

- fix: select not work when select set disableSelect #2981


- feat: add keybord ctrlMultiSelect config #2995
- fix: fix textAlign in checkbox/radio #2908
- fix: outsideClickDeselect event in menu element
- fix: fix col&row range in getCellMergeRange() #2906
- feat: add panelStyle&arrowStyle config in Popover #2988
- fix: fix merge cell select range update #2944
- fix: fix ListTreeStickCellPlugin update in tree_hierarchy_state_change event #2914
- fix: fix row update range in _refreshHierarchyState() #2987

## 1.12.0
Tue, 03 Dec 2024 11:06:35 GMT

### Minor changes

- feat: add taskShowMode for gantt chart #2849



### Updates

- feat: add option customComputeRowHeight and defaultRowHeight can set "auto"


- docs: add getTaskBarRelativeRect api #2920


- fix: when edit record task date update taskbar occor error #2938


- fix: fix last col&row editor size #2926
- fix: fix cell update event problem in CustomCellStylePlugin #2927
- fix: fix react-component in tree mode update
- fix: fix default row height in computeRowHeight() #2903
- fix: fix legend visible problem when reize table
- fix: fix cache problem in Icon.loadGif() #2905
- fix: fix merge radio cell check update #2881
- fix: fix strokeArrayWidth update in updateCell() #2811

## 1.11.5
Fri, 29 Nov 2024 07:59:16 GMT

### Updates

- docs: 更新进入或离开节点时的事件文档


- docs: 更新甘特图事件文档，暴露整个e的信息


- feat: add @visactor/vtable-plugins package

## 1.11.4
Fri, 29 Nov 2024 03:38:27 GMT

### Updates

- fix: columnWidthConfig match problem #2957



## 1.11.3
Thu, 28 Nov 2024 12:26:11 GMT

### Updates

- fix: frozen chart not update when resize row or column width #2876


- refactor: when columnWidthConfig set wrong dimensions should judge this case #2948


- fix: fix custom-component update in deleteRecords api

## 1.11.2
Tue, 26 Nov 2024 09:13:29 GMT

### Updates

- fix: add isValidatingValue state to fix call validateValue api repeatedly #2830


- fix: when up on canvas blank area not drag position rightly #2831


- feat: add select makeSelectCellVisible #2840


- refactor: when set headerSelectMode body drag column order should work #2860


- fix: when resize column width the select state be cleared #2861


- fix: when container resize trigger mark line resize #2883


- fix: when not set minDate maxDate call setRecords render error #2892


- feat: add setCustomSelectRanges in stateManager #2750 #2845
- feat: optimize range select in HeaderHighlightPlugin
- feat: isShowOverflowTextTooltip support function
- feat: cell support multi-custom-style #2841
- feat: templateLink support function #2847
- feat: add position in tooltip config #2869
- feat: add parentElement in menu option
- fix: fix cell border dash update #2818
- fix: fix merge cell text position #2858
- fix: fix functional padding update #2774
- fix: fix select all in row-series-number checkbox #2880

## 1.11.1
Tue, 19 Nov 2024 12:21:58 GMT

### Updates

- fix: add isValidatingValue state to fix call validateValue api repeatedly #2830


- fix: when up on canvas blank area not drag position rightly #2831


- feat: add setCustomSelectRanges in stateManager #2750 #2845
- feat: optimize range select in HeaderHighlightPlugin
- feat: isShowOverflowTextTooltip support function
- fix: fix cell border dash update #2818
- fix: fix merge cell text position #2858

## 1.11.0
Fri, 15 Nov 2024 11:58:31 GMT

### Minor changes

- feat: add vtable-calendar

### Updates

- fix: pivot chart pie type selected state not work #2178


- fix: rose pivotchart click legend then hover chart render error #2209


- feat: add event changing_header_position


- feat: drag order highlight line render


- feat: add change_header_position_fail event


- refactor: when set disableSelect but api selectCell can work #2799


- fix: when chart row is frozen render error #2800


- fix: when after select range not exist #2804


- feat: add argument recalculateColWidths for api toggleHierarchyState #2817


- fix: call renderWithRecreateCells should not effect colWidth when widthMode is adaptive #2835


- feat: add InvertHighlightPlugin 
- fix: add CarouselAnimationPlugin
- fix: add HeaderHighlightPlugin

## 1.10.5
Mon, 11 Nov 2024 07:50:58 GMT

### Updates

- fix: pivot chart spec enable select not work #2210


- fix: sortState field undefined occor error



## 1.10.4
Thu, 07 Nov 2024 13:33:17 GMT

### Updates

- fix: when markline date less then minDate should not show #2689


- feat: gantt dependency line support tree node #2701


- fix: pivot table header icon display incorrect #2735


- fix: parse axes config error when user set axes #2749


- feat: when drag on header can select cells continuous #2751


- fix: cellType set funciton occor error #2754


- fix: when pivot cell type set chart not data cell render error #2758


- fix: legend problems #2764 #2755


- fix: create task shedule date error #2771


- fix: fix cellLocation in pivot-table #2694
- fix: fix menu scale pos problem #2734
- fix: fix tree frozen row problem #2619

## 1.10.3
Fri, 01 Nov 2024 03:33:15 GMT

### Updates

- fix: type define columnWidthConfig



## 1.10.2
Thu, 31 Oct 2024 12:52:23 GMT

### Updates

- feat: headerSelectMode option add body setting #2491


- fix: isColumnHeader api judement logic #2491


- fix: when collapse last group occor error #2600


- fix: when collapse tree node occor error #2600


- fix: min aggregator type handle with NaN value #2627


- feat: add freeze_click event #2641


- fix: when drag row series number cells not scroll #2647


- fix: rowSeriesNumber when be frozen can render customlayout #2653


- refactor: custom merge cell ignore check state jude #2683


- fix: when has empty tip scrollbar can not be clicked #2690


- refactor: paste cell value should use editor validateValidate api #2691


- feat: add columnWidthConfig to set width by dimensions #2696


- fix: when field set array，record no corresponding field，occur error #2702


- fix: when has gantt and table same time internal theme should not be changed #2708


- fix: fix check state update #2667
- fix: fix list-editor space problem
- fix: change pointerupoutside event callback #2674 #2659
- fix: add event in react-vtable
- fix: add selected_cell event in select-all #2664
- fix: fix disableRowSeriesNumberSelect in select-all #2665
- fix: fix title resize in adaptive mode #2704

## 1.10.1
Tue, 22 Oct 2024 09:49:27 GMT

### Updates

- fix: when set rowSeriesNumber then sort icon not update #2643


- fix: disable cellInnerBorder when no frame border 

## 1.10.0
Fri, 18 Oct 2024 09:42:47 GMT

### Minor changes

- feat: add creation buttom for not schedualed task record


- feat: add dependency line for gantt chart


- feat: add after_sort event


- feat: add task bar selected style


- feat: add dependency line selected style



### Updates

- fix: when dimension paths has virtual not identify problem #2510


- feat: add underlayBackgroundColor for gantt chart #2607


- fix: toggleHierarchyState api can not update customlayout cell #2609


- feat: add maxHeight in menu container #2602
- fix: fix legend layout problem
- fix: fix border rect missing when borderLineWidth is 0
- fix: fix multi-sort icon update in updateSortState() #2614
- fix: fix col/row end in createGroupForFirstScreen() #2585
- fix: fix customConfig in react-vtable
- fix: fix row resize mark position when scrolled vertically #2606
- fix: fix sort icon update in transpose list-table

## 1.9.1
Sat, 12 Oct 2024 07:07:25 GMT

### Updates

- fix: fix sort icon update in merge cell

## 1.9.0
Fri, 11 Oct 2024 11:35:17 GMT

### Minor changes

- feat: add scrollTo animation function

### Updates

- fix: when dimension set width auto but no records, the col width not compute #2515


- fix: when call updateColumns should update aggregation #2519


- refactor: when value is promise cell style function should await #2549


- fix: change outsideClickDeselect trigger time when pointerdown #2553


- fix: when sort with row series number occor error #2558


- fix: fix select auto-scroll in bottom #2546
- fix: fix auto size in react custom component
- fix: fix custom component flash when cell resizes #2516
- fix: fix custom component in forzen cell #2568
- fix: fix legend with padding layout size
- fix: fix cellLocation in createComplexColumn #2517
- fix: fix merge cell select range #2521

## 1.8.3
Fri, 11 Oct 2024 10:52:03 GMT

### Updates

- fix: when dimension set width auto but no records, the col width not compute #2515


- fix: when call updateColumns should update aggregation #2519


- refactor: when value is promise cell style function should await #2549


- fix: change outsideClickDeselect trigger time when pointerdown #2553


- fix: when sort with row series number occor error #2558


- fix: fix select auto-scroll in bottom #2546
- fix: fix auto size in react custom component
- fix: fix custom component flash when cell resizes #2516
- fix: fix custom component in forzen cell #2568
- fix: fix legend with padding layout size
- fix: fix cellLocation in createComplexColumn #2517
- fix: fix merge cell select range #2521

## 1.8.2
Mon, 30 Sep 2024 09:38:25 GMT

### Updates

- fix: fix richtext icon update #2281

## 1.8.1
Sun, 29 Sep 2024 07:41:11 GMT

### Updates

- refactor: rename vue component name



## 1.8.0
Sun, 29 Sep 2024 02:17:55 GMT

### Minor changes

- feat: add vue-vtable



### Updates

- docs: add functionalIconsStyle on theme #1308


- fix: fix estimate position in updateAutoRow() #2494
- fix: fix drag check state update #2518
- fix: fix group cell in vtable-export #2487
- fix: fix react component update problem when resize column

## 1.7.9
Fri, 27 Sep 2024 09:40:51 GMT

### Updates

- docs: add functionalIconsStyle on theme #1308


- fix: fix estimate position in updateAutoRow() #2494
- fix: fix drag check state update #2518
- fix: fix group cell in vtable-export #2487
- fix: fix react component update problem when resize column

## 1.7.8
Tue, 24 Sep 2024 10:22:40 GMT

### Updates

- feat: handle with customTree in dataset file to refactor processRecord function #2279


- fix: custom total value not work #2455


- refactor: update aggregator when update records #2459


- fix: adjust sort icon up and down #2465


- fix: when current edit not exit, could not trigger new edit cell #2469


- fix: when no records edit cell value occor error #2474


- feat: add async support in vtable-export #2460
- fix: set aggregation on option not work #2459


- fix: fix cell border clip in 'bottom-right' borde mode #2442
- fix: add children === true hierarchyState in initChildrenNodeHierarchy()
- fix: fix custom component frozen update #2432
- fix: when resize trigger click_cell event


- fix: fix proxy.colStart update in resetFrozen() #2464
- fix: add '——' in specialCharSet #2470

## 1.7.7
Fri, 13 Sep 2024 08:37:37 GMT

### Updates

- refactor: gantt project export vtable and vrender



## 1.7.6
Thu, 12 Sep 2024 06:18:44 GMT

_Version update only_

## 1.7.5
Wed, 11 Sep 2024 12:33:19 GMT

### Updates

- feat: add getFilteredRecords api #2255


- fix: select range click outside not cancel select #2355


- fix: split line position fix #2392


- fix: levelSpan case front columnNode merge range error #2359


- fix: judge value is valid #2402


- fix: mousedown chart go dealSelectCell and rerender it #2419


- fix: fix axis size and layout #2256
- fix: fix series number in list-group #2425
- fix: fix recordIndex config of addRecord in list-group #2426

## 1.7.4
Mon, 09 Sep 2024 02:02:17 GMT

### Updates

- fix: when tree pivot table sort then expand tree node render error #2261


- fix: fix interactive layer dom clear problem
- fix: when no records corner header show dimention title #2247


- feat: add updateFilterRules api #2245


- fix: fix sparkline range when data has null

## 1.7.3
Thu, 05 Sep 2024 03:09:20 GMT

### Updates

- fix: when keydown with ctrl meta and shift not trigger edit mode # 2372


- fix: fix custom style arrangement duplicate #2370
- fix: fix no-text cell custom merge #2343
- fix: fix event bind problem in react-vtable
- fix: fix right frozen mark position #2344
- fix: fix select range judgement in cellBgColor #2368

## 1.7.2
Mon, 02 Sep 2024 10:09:57 GMT

### Updates

- fix: when use groupBy then all merged cells set cellType text #2331



## 1.7.1
Mon, 02 Sep 2024 03:26:48 GMT

### Updates

- fix: fix envs type in react-vtable

## 1.7.0
Fri, 30 Aug 2024 11:54:08 GMT

### Minor changes

- feat: add gantt chart



### Updates

- fix: leftTable just has row series number



## 1.6.3
Thu, 29 Aug 2024 12:00:16 GMT

### Updates

- refactor: scroll event add argument #2249


- fix: handle with change header postion event #2299


- refactor: changeCellValue can modify raw record #2305


- fix: pivot tree can not show value and expand tree occor error #2306


- fix: set titleOnDimension all sort can not run #2278


- feat: add formatCopyValue config
- feat: add parentElement config in tooltip #2290
- fix: add judgement in array find function #2289
- fix: fix frozen column custom component clip
- fix: fix cellLocation in top frozen row #2267
- fix: fix list-table group mode style update problem
- fix: fix menu auto hide when page crolled #2241
- fix: fix progress bar cell textAlign update #2225
- fix: fix umd package problem in react-vtable #2244
- fix: fix right frozen size in updateContainerAttrWidthAndX() #2243
- fix: fix leftRowSeriesNumberColumnCount error in getBodyLayoutRangeById() #2234

## 1.6.2
Thu, 22 Aug 2024 12:27:03 GMT

### Updates

- feat: add formatCopyValue config
- fix: fix frozen column custom component clip
- fix: fix menu auto hide when page crolled #2241

## 1.6.1
Mon, 19 Aug 2024 08:06:44 GMT

### Minor changes

- feat: add group function

### Updates

- refactor: supplement backgroundColor for editor #1518


- fix: corner header display dimension name in some case #2180


- feat: add option forceShowHeader


- fix: frameStyle borrerLineWidth set array, table render positon error #2200


- feat: frameStyle cornerRadius support array type #2207


- feat: add table releated components in react-vtable
- feat: add enum in textStick config
- feat: add frozenRowCount in transpose table #2182
- fix: fix icon margin error in update size #2206
- fix: fix react custom layout component container height


- fix: fix jsx customLayout size compute mode #2192
- fix: add default color in vtable-export
- feat: add excelJSWorksheetCallback config in vtable-export
- fix: fix row-series cell type #2188

## 1.5.6
Thu, 08 Aug 2024 02:54:17 GMT

### Updates

- feat: add canvas & viewbox config
- fix: fix released async problem #2145

## 1.5.5
Wed, 07 Aug 2024 12:08:17 GMT

_Version update only_

## 1.5.4
Fri, 02 Aug 2024 11:20:11 GMT

### Updates

- fix: set sort rule occor error #2106


- fix: clearSelected api clear ctrl+a border #2115


- feat: pivot table corner cell support icon #2120


- fix: move header position not work not trigger change_header_position event #2129


- feat: support editCellTrigger set keydown #2136


- fix: set cellType is function, resize col width chart size render error #2160


- fix: when call setRowHeight should update chart size #2155


- feat: add react-component for option-emptyTip


- feat: add react-component for option-emptyTip - demo


- feat: add escape config in csv-exporter
- feat: add selectionFillMode config in theme.selectionStyle #2132 #2027
- fix: fix cell range clear in update record
- fix: fix custom-element update problem #2126
- fix: fix customMege cell update
- fix: fix CellContent pickable config #2134
- fix: fix legend visible config #2137
- fix: fix released async problem #2145
- fix: remove resizing update in endResizeCol() #2101

## 1.5.3
Thu, 18 Jul 2024 12:13:07 GMT

### Updates

- feat: add param value for startEditCell api #2089


- fix: fix option config in vtable-export

## 1.5.2
Fri, 12 Jul 2024 10:47:37 GMT

### Updates

- fix: edit api validateValue support async


- feat: add api disableScroll and enableScroll #2073


- fix: api changeFieldValue occor errow when records has null #2067


- fix: fix react component error in updateCell() #2038
- feat: add renderDefault prop in react customLayout component
- feat: support multiple columns tag in react-vtable
- fix: fix axes default config in scatter chart #2071

## 1.5.1
Wed, 10 Jul 2024 06:19:15 GMT

### Updates

- fix: getCellAtRelativePosition api return value #2054


- fix: add tolerance for scroll in _disableColumnAndRowSizeRound mode

## 1.5.0
Fri, 05 Jul 2024 10:43:51 GMT

### Minor changes

- feat: add formatExcelJSCell config in vtable-export #1989
- feat: optimize package size & add load on demand feature

### Updates

- feat: add showMoverLine and hideMoverLine api #2009


- fix: pivot chart select state #2017


- fix: disable select and edit input should move when input is outside of table #2039


- fix: last column resize width error #2040


- fix: fix test judgement in customMergeCell #2031
- fix: fix selected highlight update when scrolling #2028
- fix: fix select-rect update when scroll #2015
- fix: fix frozen cell update problem in sort #1997

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

