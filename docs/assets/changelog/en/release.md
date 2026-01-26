# v1.22.12

2026-01-26


**🆕 New feature**

- **@visactor/vtable**: add cancelEditCell method to ListTable and PivotTable APIs
- **@visactor/vtable**: add selectedStateFilter for pivotChart
- **@visactor/vtable**: add clearChartState and disableTooltip api

**🐛 Bug fix**

- **@visactor/vtable**: makeSelectCellVisible set false when click row series number [#4942](https://github.com/VisActor/VTable/issues/4942)
- **@visactor/vtable**: fix last row dimension column width when row series number is enabled

**🔨 Refactor**

- **@visactor/vtable**: optimize brush chart interaction



[more detail about v1.22.12](https://github.com/VisActor/VTable/releases/tag/v1.22.12)

# v1.22.11

2026-01-20


**🐛 Bug fix**

- **@visactor/vtable**: prepareEdit occor error [#4871](https://github.com/VisActor/VTable/issues/4871)
- **@visactor/vtable**: paste to table performance when has prepared edit cell [#4912](https://github.com/VisActor/VTable/issues/4912)
- **@visactor/vtable**: distinguish null and empty string values in column dimensions
- **scenegraph**: reset proxy row status when start exceeds end
- **@visactor/vtable**: time unit computeCountToTimeScale month exactitude [#4909](https://github.com/VisActor/VTable/issues/4909)
- **@visactor/vtable**: 修复theme配置theme.headerStyle.textStickBaseOnAlign不生效问题

**🆕 New feature**

- **@visactor/vtable**: add showSubTotalsOnTreeNode to dataConfig [#4850](https://github.com/VisActor/VTable/issues/4850)

**🔨 Refactor**

- **@visactor/vtable**: when has merge cells to delete column [#4848](https://github.com/VisActor/VTable/issues/4848)
- **@visactor/vtable**: update cell merge delete records logic [#4848](https://github.com/VisActor/VTable/issues/4848)



[more detail about v1.22.11](https://github.com/VisActor/VTable/releases/tag/v1.22.11)

# v1.22.10

2026-01-05


**🐛 Bug fix**

- **@visactor/vtable**: fix prepareEdit logic occor some bug
- **@visactor/vtable-plugins**: fix delete and backbase key cann't delete cells
- **@visactor/vtable**: rose pivotchart show indicator title problem


**🆕 New feature**

- **@visactor/vtable-gantt**: feat: support distanceToTaskBar config



[more detail about v1.22.10](https://github.com/VisActor/VTable/releases/tag/v1.22.10)

# v1.22.9

2025-12-28


**🐛 Bug fix**

- **@visactor/vtable**: toggleSelectAll only in searched item. fix[#4838](https://github.com/VisActor/VTable/issues/4838)
- **@visactor/vtable**: fix the issue with second-level display length
- **@visactor/vtable**: pivot chart no left axis case
- **@visactor/vtable**: show dimension tooltip delay logic error
- **@visactor/vtable**: editor support keydown chinese [#4847](https://github.com/VisActor/VTable/issues/4847)
- **@visactor/vtable**: fix filter plugin with sub header

**🔨 Refactor**

- **@visactor/vtable-gantt**: recognize millisecond for gantt taskbar
- **@visactor/vtable**: when no axis compute col width logic
- **@visactor/vtable**: when set editCellTrigger keydown input chinese first letter problem [#4847](https://github.com/VisActor/VTable/issues/4847)

[more detail about v1.22.9](https://github.com/VisActor/VTable/releases/tag/v1.22.9)

# v1.22.8

2025-12-17


**🆕 New feature**

- **@visactor/vtable-sheet**: vtable-sheet support cross sheet calculate formula
- **@visactor/vtable-sheet**: support import multiply sheets from excel file
- **@visactor/vtable**: excel export multiply sheets
- **@visactor/vtable-plugins**: add update styles api for filter plugin. close[#4790](https://github.com/VisActor/VTable/issues/4790)
- **@visactor/vtable-plugins**:  filter plugin support custom styles. close[#4720](https://github.com/VisActor/VTable/issues/4720)
- **@visactor/vtable-plugins**: emit event when filter menu hide or show. close[#4784](https://github.com/VisActor/VTable/issues/4784)


**🐛 Bug fix**

- **@visactor/vtable**: when pivot table set grid-tree subTotal value not show [#4815](https://github.com/VisActor/VTable/issues/4815)
- **@visactor/vtable**: scroll bug when update option
- **@visactor/vtable**: filter swtich enable erroe. fix[#4783](https://github.com/VisActor/VTable/issues/4783)
- **@visactor/vtable**: apply filter after update table data. fix[#4785](https://github.com/VisActor/VTable/issues/4785)
- **@visactor/vtable**: update filter state and keys when update data. fix[#4787](https://github.com/VisActor/VTable/issues/4787)
- **@visactor/vtable**: select none not effect. fix[#4792](https://github.com/VisActor/VTable/issues/4792)
- **@visactor/vtable**: empty line bug
- **@visactor/vtable**: update checkbox state after update data. fix[#4795](https://github.com/VisActor/VTable/issues/4795)
- **@visactor/vtable**: delete key down should not complete edit cell
- **@visactor/vtable**: pivotChart linkage getAxis node occor error
- **@visactor/vtable**: panel hide when press enter. fix[#4813](https://github.com/VisActor/VTable/issues/4813)

**📖 Site / documentation update**

- **@visactor/vtable**: supplement chartDimensionLinkage demo



[more detail about v1.22.8](https://github.com/VisActor/VTable/releases/tag/v1.22.8)

# v1.22.7

2025-12-08


**🆕 New feature**

- **@visactor/vtable**: resize support set canResizeColumn function [#4764](https://github.com/VisActor/VTable/issues/4764)

**🐛 Bug fix**

- **@visactor/vtable**: pivotChart axis should change zero when has range

**🔨 Refactor**

- **@visactor/vtable**: optimize linkage pivotChart tooltip
- **@visactor/vtable-plugins**: filter  auto update item when change table records



[more detail about v1.22.7](https://github.com/VisActor/VTable/releases/tag/v1.22.7)

# v1.22.6

2025-12-02


**🆕 New feature**

- **@visactor/vtable-sheet**: support copy formula to paste cell
- **@visactor/vtable-sheet**: support formula auto fill

**🐛 Bug fix**

- **@visactor/vtable**: excel keyboard plugin when use key of delete and back to delete not work
- **@visactor/vtable**: distinguish null and empty string values in row/column dimensions
- **@visactor/vtable**: the filter plugin cannot be opened normally when clicked [#4736](https://github.com/VisActor/VTable/issues/4736)
- **@visactor/vtable**: clear the value of the searchInput when the filter plugin is displayed [#4736](https://github.com/VisActor/VTable/issues/4736)



[more detail about v1.22.6](https://github.com/VisActor/VTable/releases/tag/v1.22.6)

# v1.22.5

2025-11-26


**🆕 New feature**

- **@visactor/vtable**: support right axis in pivotChart spec [#4723](https://github.com/VisActor/VTable/issues/4723)
- **@visactor/vtable**: add chartDimensionLinkage for pivotChart

**🐛 Bug fix**

- **@visactor/vtable**: add null check for nodeChildren in matchDimensionPath



[more detail about v1.22.5](https://github.com/VisActor/VTable/releases/tag/v1.22.5)

# v1.22.4

2025-11-18


**🐛 Bug fix**

- **@visactor/vtable**: fix backtracking issue in getCellAdressByHeaderPath matching algorithm
- **pivot-table**: fix frozenColCount being invalid when set to 0
- **@visactor/vtable**: the serial number cannot be edited [#4627](https://github.com/VisActor/VTable/issues/4627)

**🔨 Refactor**

- **@visactor/vtable**: filter plugins update when filterState changes
- **@visactor/vtable-plugins**: master sub table plugins refactor config



[more detail about v1.22.4](https://github.com/VisActor/VTable/releases/tag/v1.22.4)

# v1.22.3

2025-11-07


**🆕 New feature**

- **@visactor/vtable-sheet**: add dragOrder to vtableSheet
- **@visactor/vtable**: add api getCellRowHeaderFullPaths for pivotTable
- **@visactor/vtable**: support boxPlot chart in pivotChart

**🐛 Bug fix**

- **@visactor/vtable-sheet**: vtable-sheet drag column position [#4645](https://github.com/VisActor/VTable/issues/4645)
- **@visactor/vtable**: leftTop cornder render frame border line [#4677](https://github.com/VisActor/VTable/issues/4677)
- **@visactor/vtable**: the getTargetGroup method of vue-vtable [#4663](https://github.com/VisActor/VTable/issues/4663)

**🔨 Refactor**

- **@visactor/vtable**: overscrollBehavior set none not scrollbar effect [#4675](https://github.com/VisActor/VTable/issues/4675)



[more detail about v1.22.3](https://github.com/VisActor/VTable/releases/tag/v1.22.3)

# v1.22.2

2025-10-29


**🆕 New feature**

- **@visactor/vtable-sheet**: drag row or column order for vtable-sheet
- **@visactor/vtable-sheet**: drag column order to update and calculate formula
- **@visactor/vtable-sheet**: adjust formula dependency after delete or add rows columns
- **@visactor/vtable**: the addition of the refValue parameter in vue-vtable dynamic rendering editing now supports v-model [#4597](https://github.com/VisActor/VTable/issues/4597)

**🐛 Bug fix**

- **@visactor/vtable**: drag row order to update rowHeightMap
- **@visactor/vtable**: select row use row series number with cell merge, select state error
- **@visactor/vtable**: after resize column width legend title position error [#4629](https://github.com/VisActor/VTable/issues/4629)
- **@visactor/vtable**: fix issue of markline layout in PivotChart
- **@visactor/vtable**: the resize event of tableContainer [#4558](https://github.com/VisActor/VTable/issues/4558)
- **@visactor/vtable**: vue-vtable dynamic rendering editing [#4621](https://github.com/VisActor/VTable/issues/4621)

**🔨 Refactor**

- **@visactor/vtable**: refactor adaptive mode for column width calculation
- **@visactor/vtable**: requestAnimationFrame use vrender api [#4619](https://github.com/VisActor/VTable/issues/4619)
- **@visactor/vtable-sheet**: formula context support lower case character [#4628](https://github.com/VisActor/VTable/issues/4628)



[more detail about v1.22.2](https://github.com/VisActor/VTable/releases/tag/v1.22.2)

# v1.22.0

2025-10-17


**🆕 New feature**

- **@visactor/vtable-plugins**: add master detail table plugin
- **@visactor/vtable-sheet**:  handle with formula calculate when add or delete row and column;
- **@visactor/vtable**: a new getFilteredRecords method has been added to ListTable [#4537](https://github.com/VisActor/VTable/issues/4537)


**🐛 Bug fix**

- **@visactor/vtable**: the getFilteredRecords method of PivotTable
- **@visactor/vtable**: plugin HighlightHeaderWhenSelectCellPlugin options parse



[more detail about v1.22.0](https://github.com/VisActor/VTable/releases/tag/v1.22.0)

# v1.21.1

2025-10-14


**🐛 Bug fix**

- **@visactor/vtable-gantt**: fix gantt zoom axis component should release



[more detail about v1.21.1](https://github.com/VisActor/VTable/releases/tag/v1.21.1)

# v1.21.0

2025-10-13


**🆕 New feature**

- **@visactor/vtable-gantt**: add zoom interaction feature for gantt

**🐛 Bug fix**

- **@visactor/vtable**: the updateFilterRules method of PivotTable [#4450](https://github.com/VisActor/VTable/issues/4450)



[more detail about v1.21.0](https://github.com/VisActor/VTable/releases/tag/v1.21.0)

# v1.20.3

2025-10-11


**🐛 Bug fix**

- **@visactor/vtable**: paste html to cell no work [#4551](https://github.com/VisActor/VTable/issues/4551)
- **@visactor/vtable**: select formula item use keyboard arrowUp and arrowDown
- **@visactor/vtable**: dbclick the automatic column width in the rightFrozenColCount configuration [#4526](https://github.com/VisActor/VTable/issues/4526)



[more detail about v1.20.3](https://github.com/VisActor/VTable/releases/tag/v1.20.3)

# v1.20.2

2025-10-09


**🐛 Bug fix**

- **@visactor/vtable**: refactor umd build for vtable-plugins and vtable-sheet component
- **@visactor/vtable**: search component clear method [#4476](https://github.com/VisActor/VTable/issues/4476)
- **@visactor/vtable-sheet**: refactor use keyboard to select formula select item

**📖 Site / documentation update**

- **@visactor/vtable**: vtable sheet umd import guide



[more detail about v1.20.2](https://github.com/VisActor/VTable/releases/tag/v1.20.2)

# v1.20.1

2025-09-26


**🆕 New feature**

- **@visactor/vtable**: extend chart type
- **@visactor/vtable**: support detailPath when pick vchart to add detectPickChartItem config

**🐛 Bug fix**

- **@visactor/vtable**: deleteRecord switchState error after call renderWidthCreateCells api [#4436](https://github.com/VisActor/VTable/issues/4436)
- **@visactor/vtable**: maxfrozenwidth not work when set brower scale [#4494](https://github.com/VisActor/VTable/issues/4494)
- **@visactor/vtable-gantt**: gannt grid line style linedash not work [#4495](https://github.com/VisActor/VTable/issues/4495)
- **@visactor/vtable**: when updateOption change enablecheckboxcascade not work [#4499](https://github.com/VisActor/VTable/issues/4499)
- **@visactor/vtable**: api selectCells not work with ctrlMultiSelect false
- **@visactor/vtable**: row change order not work with pagination



[more detail about v1.20.1](https://github.com/VisActor/VTable/releases/tag/v1.20.1)

# v1.20.0

2025-09-22


**🆕 New feature**

- **@visactor/vtable**: add cutSelected keyboardOption for vtable
- **@visactor/vtable-sheet**: add vtable sheet component

**🔧 Configuration releated**

- **@visactor/vtable**: update vrender version to 1.0.16



[more detail about v1.20.0](https://github.com/VisActor/VTable/releases/tag/v1.20.0)

# v1.19.9

2025-09-12


**🆕 New feature**

- **@visactor/vtable**: add disableSelectOnContextMenu option
- **@visactor/vtable-gantt**: gantt task bar process percentage can be resized

**🐛 Bug fix**

- **@visactor/vtable**: add isReleased check before resize in initialization
- **@visactor/vtable**: fix fill handler not show error [#4376](https://github.com/VisActor/VTable/issues/4376)

**🔨 Refactor**

- **@visactor/vtable**: build library process on window system



[more detail about v1.19.9](https://github.com/VisActor/VTable/releases/tag/v1.19.9)

# v1.19.8

2025-08-29


**🐛 Bug fix**

- **@visactor/vtable**: fix getLayoutRowTree api error [#4346](https://github.com/VisActor/VTable/issues/4346)
- **@visactor/vtable**: fix when has many columns expand columnTree scenegraph node y value error [#4357](https://github.com/VisActor/VTable/issues/4357)
- **@visactor/vtable**: columnWidthConfig not work when just has indicator on pivot table [#4388](https://github.com/VisActor/VTable/issues/4388)

**🔨 Refactor**

- **@visactor/vtable**: supplement contextmenu-click event arguments [#4364](https://github.com/VisActor/VTable/issues/4364)



[more detail about v1.19.8](https://github.com/VisActor/VTable/releases/tag/v1.19.8)

# v1.19.7

2025-08-19


**🆕 New feature**

- **@visactor/vtable**: add ignoreFrozenCols for theme's scrollStyle setting
- **@visactor/vtable**: add event type CONTEXTMENU_CANVAS

**🐛 Bug fix**

- **@visactor/vtable**: when set hide for column with children occor error [#4223](https://github.com/VisActor/VTable/issues/4223)
- **@visactor/vtable**: markline refresh container size [#4319](https://github.com/VisActor/VTable/issues/4319)
- **@visactor/vtable**: fix error in syncGroupCollapseState when use InputEditor update groupBy config key.[#4216](https://github.com/VisActor/VTable/issues/4216)

**🔨 Refactor**

- **@visactor/vtable**: scrollbar not show when less records no need show scrollbar

[more detail about v1.19.7](https://github.com/VisActor/VTable/releases/tag/v1.19.7)

# v1.19.6

2025-08-08


**🆕 New feature**

- **@visactor/vtable**: pivot chart add columnWidthConfig option

**🐛 Bug fix**

- **@visactor/vtable**: fix error when pivot table set columnHierarchyType gird with expand tree [#4254](https://github.com/VisActor/VTable/issues/4254)
- **@visactor/vtable-gantt**: fix when no records markline render error [#4305](https://github.com/VisActor/VTable/issues/4305)

**🔨 Refactor**

- **@visactor/vtable**: add table export plugin



[more detail about v1.19.6](https://github.com/VisActor/VTable/releases/tag/v1.19.6)

# v1.19.5

2025-07-31


**🆕 New feature**

- **@visactor/vtable**: add enableHeaderCheckboxCascade option
- **@visactor/vtable-gantt**: add  move_end_task_bar event for vtable-gantt.[#4266](https://github.com/VisActor/VTable/issues/4266)

**🐛 Bug fix**

- **@visactor/vtable**: setCellCheckboxState not work when tree column set checkbox cell type

**🔨 Refactor**

- **@visactor/vtable**: when delete and add records update checkstate [#4240](https://github.com/VisActor/VTable/issues/4240)



[more detail about v1.19.5](https://github.com/VisActor/VTable/releases/tag/v1.19.5)

# v1.19.4

2025-07-28


**🆕 New feature**

- **@visactor/vtable**: rowSeriesNumber support config record's field [#3902](https://github.com/VisActor/VTable/issues/3902)
- **@visactor/vtable**: add enableCheckboxCascade option [#4130](https://github.com/VisActor/VTable/issues/4130)
- **@visactor/vtable**: add groupConfig replace groupBy and group** & add titleCheckbox [#4130](https://github.com/VisActor/VTable/issues/4130)
- **@visactor/vtable**: add getRecordHierarchyState api and fix change header position arguments [#4226](https://github.com/VisActor/VTable/issues/4226)
- **@visactor/vtable**: add paste-add-row plugin to support extend row count or column count

**🐛 Bug fix**

- **@visactor/vtable**: vchart trasnparent bgColor replace cell hover color [#4245](https://github.com/VisActor/VTable/issues/4245)
- **@visactor/vtable**: fix loading icon update in pivot-table [#4236](https://github.com/VisActor/VTable/issues/4236)

**🔨 Refactor**

- **@visactor/vtable**: update merge cell performance [#3293](https://github.com/VisActor/VTable/issues/3293)
- **@visactor/vtable**: hide menu list when scroll [#4214](https://github.com/VisActor/VTable/issues/4214)



[more detail about v1.19.4](https://github.com/VisActor/VTable/releases/tag/v1.19.4)

# v1.19.3

2025-07-09


**🆕 New feature**

- **@visactor/vtable**: add eventOptions contextmenuReturnAllSelectedCells [#4064](https://github.com/VisActor/VTable/issues/4064)
-  **@visactor/vtable**: add batch expand or collapse all tree nodes

**🐛 Bug fix**

- **@visactor/vtable**: click to edit cell not work with groupBy [#4172](https://github.com/VisActor/VTable/issues/4172)
- **@visactor/vtable**: fix validateCellVaule when paste cell [#4174](https://github.com/VisActor/VTable/issues/4174) [#1797](https://github.com/VisActor/VTable/issues/1797)
- **@visactor/vtable**: handle frozen column calculation when container is invisible
-  **@visactor/vtable**: fix: paste validateValue missing position table params [#4164](https://github.com/VisActor/VTable/issues/4164)
-  **@visactor/vtable**: fix animation register progress
-  **@visactor/vtable**: fix: fix after resize container then frozen column invisible [#3836](https://github.com/VisActor/VTable/issues/3836)




[more detail about v1.19.3](https://github.com/VisActor/VTable/releases/tag/v1.19.3)

# v1.19.2

2025-07-01


**🆕 New feature**

- **@visactor/vtable**: ListTable support levelSpan for header
- **@visactor/vtable-plugins**: add import excel file plugin
- **@visactor/vtable-gantt**: gantt chart's frame border support set array


**🐛 Bug fix**

- **@visactor/vtable**: fix templateLink in export excel [#4106](https://github.com/VisActor/VTable/issues/4106)
- **@visactor/vtable**: list-tree delete root level error when using deleteRecords
- **@visactor/vtable**: fix minWidth & maxWidth in autoFillWidth status [#4100](https://github.com/VisActor/VTable/issues/4100)
- **@visactor/vtable**: when updateColumns occor error with aggregation
- **@visactor/vtable**: when edit pivot indicator value the total value should update synchronously
- **@visactor/vtable**: merge render error when has custom aggregation
- **@visactor/vtable**: list tree delete records bug [#3991](https://github.com/VisActor/VTable/issues/3991)
- **@visactor/vtable**: group by boolean cannot render false [#4059](https://github.com/VisActor/VTable/issues/4059)



[more detail about v1.19.2](https://github.com/VisActor/VTable/releases/tag/v1.19.2)

# v1.19.1

2025-06-20


**🆕 New feature**

- **@visactor/vtable**: fix when use containerFit scroll and bottom border error [#3337](https://github.com/VisActor/VTable/issues/3337)

**🐛 Bug fix**

- **@visactor/vtable**: copy not work when after copy tooltip text [#3968](https://github.com/VisActor/VTable/issues/3968)
- **@visactor/vtable**: fix the issue where the icon configuration is not effective when cellType is progressBar [#4047](https://github.com/VisActor/VTable/issues/4047)

**🔧 Configuration releated**

- **@visactor/vtable**: update vrender 1.0.5 fix animation bug



[more detail about v1.19.1](https://github.com/VisActor/VTable/releases/tag/v1.19.1)

# v1.19.0

2025-06-16


**🆕 New feature**

- **@visactor/vtable-gantt**: add task-bar minSize config [#4016](https://github.com/VisActor/VTable/issues/4016)
- **@visactor/vtable-gantt**: support different dependency link line has differrent style [#4016](https://github.com/VisActor/VTable/issues/4016)
- **@visactor/vtable**: add containerFit config to support table size
- **@visactor/vtable**: add wps fill-handle plugin
- **@visactor/vtable**: add clearColWidthCache for updateColumns api

**🐛 Bug fix**

- **@visactor/vtable**: some taskShowMode should compute all row height on vtable [#4011](https://github.com/VisActor/VTable/issues/4011)
- **@visactor/vtable**: group release so gif can stop animation [#4029](https://github.com/VisActor/VTable/issues/4029)

**🔧 Configuration releated**

- **@visactor/vtable**: update vrender 1.0.0



[more detail about v1.19.0](https://github.com/VisActor/VTable/releases/tag/v1.19.0)

# v1.18.5

2025-06-09


**🆕 New feature**

- **@visactor/vtable-vue**: add vue-table export type /es/*.d.ts

**🐛 Bug fix**

- **@visactor/vtable**: fix node-canvas range in PivotChart [#3997](https://github.com/VisActor/VTable/issues/3997)
- **@visactor/vtable**: when pointer up set isDown false
- **@visactor/vtable**: fix drag select not stop problem [#3895](https://github.com/VisActor/VTable/issues/3895)
- **@visactor/vtable**: fix scrollbar not show when set visible 'focus' [#3914](https://github.com/VisActor/VTable/issues/3914)
- **@visactor/vtable**: contextmenu submenu show postion should adjust by bottom [#3867](https://github.com/VisActor/VTable/issues/3867)
- **@visactor/vtable**: filter data occor error with sort state and groupby [#3961](https://github.com/VisActor/VTable/issues/3961) 


[more detail about v1.18.5](https://github.com/VisActor/VTable/releases/tag/v1.18.5)

# v1.18.4

2025-05-27


**🆕 New feature**

- **@visactor/vtable**: add pasted_data event [#3908](https://github.com/VisActor/VTable/issues/3908)
- **@visactor/vtable-gantt**: add date position to markline
- **@visactor/vtable-gantt**: add milestone text
- **@visactor/vtable-gantt**: support record type 'project'
- **@visactor/vtable-gantt**:  add tasksShowMode 'Project_Sub_Tasks_Inline'

**🐛 Bug fix**

- **@visactor/vtable**: fix bug of chart matrix when has scale



[more detail about v1.18.4](https://github.com/VisActor/VTable/releases/tag/v1.18.4)

# v1.18.3

2025-05-13


**🆕 New feature**

- **@visactor/vtable**: add frozenColumnLine visible on theme [#3828](https://github.com/VisActor/VTable/issues/3828)
- **@visactor/vtable**: add touch event for gantt chart [#3864](https://github.com/VisActor/VTable/issues/3864)
- **@visactor/vtable**: add support for text not to be hidden [#3802](https://github.com/VisActor/VTable/issues/3802)
- **@visactor/vtable**: add exportAllData to export table plugin [#3726](https://github.com/VisActor/VTable/issues/3726)

**🐛 Bug fix**

- **@visactor/vtable**: when no rowTree treeMode occor error [#3830](https://github.com/VisActor/VTable/issues/3830)
- **@visactor/vtable**: unintended edit state activation on functional button clicks
- **@visactor/vtable**: resolve taskBar width problem when click linkPonitNode [#3829](https://github.com/VisActor/VTable/issues/3829)



[more detail about v1.18.3](https://github.com/VisActor/VTable/releases/tag/v1.18.3)

# v1.18.2

2025-04-30


**🐛 Bug fix**

- **@visactor/vtable**: when records is blank updateColumns api occor error [#3766](https://github.com/VisActor/VTable/issues/3766)
- **@visactor/vtable**: updateOption with dataSource object occor error [#3768](https://github.com/VisActor/VTable/issues/3768)
- **@visactor/vtable**: when hide pivot header find headerPath error [#3791](https://github.com/VisActor/VTable/issues/3791)
- **@visactor/vtable**: supplement adaptive widthAdaptiveMode logic [#3796](https://github.com/VisActor/VTable/issues/3796)
- **@visactor/vtable**: transform rotate api
- **@visactor/vtable**: after rotate resize column interaction error
- **@visactor/vtable**: skip serial number calculation for aggregation rows when groupBy is enabled
- **@visactor/vtable**: hide rowSeriesNumber and checkbox in aggregation [#2173](https://github.com/VisActor/VTable/issues/2173)

**🔨 Refactor**

- **@visactor/vtable**: change event listener with vglobal [#3734](https://github.com/VisActor/VTable/issues/3734)
- **@visactor/vtable**: plugins update progress [#3788](https://github.com/VisActor/VTable/issues/3788)



[more detail about v1.18.2](https://github.com/VisActor/VTable/releases/tag/v1.18.2)

# v1.18.0
  v1.17.7 same content

2025-04-17

**💥 Breaking change**

- **@visactor/vtable**: fix switch default direction [#3667](https://github.com/VisActor/VTable/issues/3667)
- **@visactor/vtable-editors**: fix input editor default style

**🆕 New feature**

- **@visactor/vtable**: add onBeforeCacheChartImage event
- **@visactor/vtable**: support customConfig disableBuildInChartActive
- **@visactor/vtable**: add dynamicUpdateSelectionSize config in theme.selectionStyle

**🐛 Bug fix**

- **@visactor/vtable**: fix table size in getCellsRect() [#3681](https://github.com/VisActor/VTable/issues/3681)
- **@visactor/vtable**: correct column index calculation when rowSeriesNumber is configured
- **@visactor/vtable**: fix image flash problem [#3588](https://github.com/VisActor/VTable/issues/3588)
- **@visactor/vtable**: fix row/column update problem in text-stick [#3744](https://github.com/VisActor/VTable/issues/3744)
- **@visactor/vtable**: fix switch default direction [#3667](https://github.com/VisActor/VTable/issues/3667)



[more detail about v1.17.7](https://github.com/VisActor/VTable/releases/tag/v1.17.7)

# v1.17.6

2025-04-10


**🆕 New feature**

- **@visactor/vtable**: listTable added tiggerEvent parameter to changeCellValue
- **@visactor/vtable**: list table header support hierarchy

**🐛 Bug fix**

- **@visactor/vtable**: when move tree node position code occor error [#3645](https://github.com/VisActor/VTable/issues/3645) [#3706](https://github.com/VisActor/VTable/issues/3706)
- **@visactor/vtable**: frame border set array render bottom line position error [#3684](https://github.com/VisActor/VTable/issues/3684)
- **@visactor/vtable**: mobile touch event resize column width [#3693](https://github.com/VisActor/VTable/issues/3693)
- **@visactor/vtable**: when set frozen disableDragSelect not work [#3702](https://github.com/VisActor/VTable/issues/3702)
- **@visactor/vtable**: fix flex layout update in react-custom-layout component [#3696](https://github.com/VisActor/VTable/issues/3696)
- **@visactor/vtable**: updateTaskRecord api [#3639](https://github.com/VisActor/VTable/issues/3639)
- **@visactor/vtable**: repeat call computeColsWidth adaptive mode result error



[more detail about v1.17.6](https://github.com/VisActor/VTable/releases/tag/v1.17.6)

# v1.17.5

2025-04-02


**🆕 New feature**

- **@visactor/vtable**: cell support marked function [#3583](https://github.com/VisActor/VTable/issues/3583)
- **@visactor/vtable**: refactor pivotTable corner with no columns or rows case [#3653](https://github.com/VisActor/VTable/issues/3653)

**🐛 Bug fix**

- **@visactor/vtable**: gantt scale set quarter parser problem [#3612](https://github.com/VisActor/VTable/issues/3612)
- **@visactor/vtable**: gantt overscrollBehavior none work [#3638](https://github.com/VisActor/VTable/issues/3638)
- **@visactor/vtable**: gantt chart updateRecords error when table is tree mode [#3639](https://github.com/VisActor/VTable/issues/3639)
- **@visactor/vtable**: rowHeight error when set adaptive heightMode [#3640](https://github.com/VisActor/VTable/issues/3640)
- **@visactor/vtable**: when set renderChartAsync setRecords api render error [#3661](https://github.com/VisActor/VTable/issues/3661)
- **@visactor/vtable**: fix merge cell checkbox state update [#3668](https://github.com/VisActor/VTable/issues/3668)

**🔨 Refactor**

- **@visactor/vtable**: fillHandle function [#3582](https://github.com/VisActor/VTable/issues/3582)



[more detail about v1.17.5](https://github.com/VisActor/VTable/releases/tag/v1.17.5)

# v1.17.4

2025-03-31


**🆕 New feature**

- **@visactor/vtable**: add barMarkInBar style config in progressbar [#3616](https://github.com/VisActor/VTable/issues/3616)

**🐛 Bug fix**

- **@visactor/vtable**: fix button style problem [#3614](https://github.com/VisActor/VTable/issues/3614)
- **@visactor/vtable**: fix checkbox state order update [#3606](https://github.com/VisActor/VTable/issues/3606)
- **@visactor/vtable**: add isCustom tag for merge cell range [#3504](https://github.com/VisActor/VTable/issues/3504)
- **@visactor/vtable**: fix tree checkbox state update problem
- **@visactor/vtable**: disable group title editor

[more detail about v1.17.4](https://github.com/VisActor/VTable/releases/tag/v1.17.4)

# v1.17.3

2025-03-24


**🆕 New feature**

- **@visactor/vtable**: rowSeriesNumber support cell type radio [#3558](https://github.com/VisActor/VTable/issues/3558)
- **@visactor/vtable**: add custom reactAttributePlugin in react-vtable
- **@visactor/vtable**: add maintainedColumnCount config

**🐛 Bug fix**

- **@visactor/vtable**: selection mergeCell extend range [#3529](https://github.com/VisActor/VTable/issues/3529)
- **@visactor/vtable**: set cellInnerBorder false frame border render error [#3574](https://github.com/VisActor/VTable/issues/3574)
- **@visactor/vtable**: fix cell border in cell with corner-radius
- **@visactor/vtable**: fix axis label autosize computation
- **@visactor/vtable**: fix small window size frozen column count
- **@visactor/vtable**: columnWidthConfig match dimension error
- **@visactor/vtable**: fix react component update [#3474](https://github.com/VisActor/VTable/issues/3474)
- **@visactor/vtable**: fix right button select problem
- **@visactor/vtable**: fix row update range [#3468](https://github.com/VisActor/VTable/issues/3468)

[more detail about v1.17.3](https://github.com/VisActor/VTable/releases/tag/v1.17.3)

# v1.17.2

2025-03-11


**🐛 Bug fix**

- **@visactor/vue-vtable**: custom container value error


[more detail about v1.17.2](https://github.com/VisActor/VTable/releases/tag/v1.17.2)

# v1.17.1

2025-03-10


**🆕 New feature**

- **@visactor/vtable**: pivot table add api setLoadingHierarchyState [#3469](https://github.com/VisActor/VTable/issues/3469)
- **@visactor/vtable**: add validateDragOrderOnEnd on dragOrder option [#3493](https://github.com/VisActor/VTable/issues/3493)
- **@visactor/vtable**: sortByIndicatorRule support sortFunc [#3508](https://github.com/VisActor/VTable/issues/3508)
- **@visactor/vtable-gantt**: gantt chart support create markline
- **@visactor/vtable**: customCellStyle supports functional config [#3483](https://github.com/VisActor/VTable/issues/3483)

**🐛 Bug fix**

- **@visactor/vtable**: mobile drill icon state update [#3485](https://github.com/VisActor/VTable/issues/3485)
- **@visactor/vtable**: active right button interactive [#3482](https://github.com/VisActor/VTable/issues/3482)

**🔧 Configuration releated**

- **@visactor/vtable**: update vrender version



[more detail about v1.17.1](https://github.com/VisActor/VTable/releases/tag/v1.17.1)

# v1.17.0

2025-02-26

**💥 Breaking change**

- **@visactor/vtable**: delete loading icon auto register, need to register manually, please refer to the tutorial: /guide/table_type/List_table/tree_list

**🆕 New feature**

- **@visactor/vtable-gantt**: gantt time scale support visible [#3098](https://github.com/VisActor/VTable/issues/3098)
- **@visactor/vtable**: dropdownmenu support function [#3443](https://github.com/VisActor/VTable/issues/3443)
- **@visactor/vtable-gantt**: add verticalLineDependenceOnTimeScale [#3467](https://github.com/VisActor/VTable/issues/3467)
- **@visactor/vtable**: add api activateChartInstance replaceChartCacheImage
- **@visactor/vtable**: add `specTransformInCell` for support modifying vchart spec of each cell in PivotChart
- **@visactor/vtable**: add switch & button cell type

**🐛 Bug fix**

- **@visactor/vtable**: after release instance, resize event occor error [#3459](https://github.com/VisActor/VTable/issues/3459)
- **@visactor/vtable**: when set autoFillWidth the rowSeriesNumber column not change his width [#3459](https://github.com/VisActor/VTable/issues/3459)
- **@visactor/vtable-gantt**: when resize taskbar start or end time tree node update error [#3460](https://github.com/VisActor/VTable/issues/3460)
- **@visactor/vtable**: fix node env config
- **@visactor/vtable**: fix row/col is decimal in animation [#3455](https://github.com/VisActor/VTable/issues/3455)
- **@visactor/vtable**: fix height is decimal in carousel [#3458](https://github.com/VisActor/VTable/issues/3458)

**📖 Site / documentation update**

- **@visactor/vtable**: update changlog of rush



[more detail about v1.17.0](https://github.com/VisActor/VTable/releases/tag/v1.17.0)

# v1.16.2

2025-02-19


**🐛 Bug fix**

- **@visactor/vtable**: field with dot occor error # 3409
- **@visactor/vtable**: getChartInstance log vchart updateViewBox method [#3442](https://github.com/VisActor/VTable/issues/3442)
- **@visactor/vtable**: computeAxisComponentWidth value ceil [#3444](https://github.com/VisActor/VTable/issues/3444)
- **@visactor/vtable**: fix sort function in getCheckboxState() [#3394](https://github.com/VisActor/VTable/issues/3394)



[more detail about v1.16.2](https://github.com/VisActor/VTable/releases/tag/v1.16.2)

# v1.16.1

2025-02-14


**🆕 New feature**

- **@visactor/vtable**: add visibleOnHover setting for columnResize [#3349](https://github.com/VisActor/VTable/issues/3349)
- **@visactor/vtable**: gantt barStyle support function [#3364](https://github.com/VisActor/VTable/issues/3364)

**🐛 Bug fix**

- **@visactor/vtable**: when rowHierarchyType is tree total value show on top no work [#3322](https://github.com/VisActor/VTable/issues/3322)
- **@visactor/vtable**: when column has custom aggregation edit cell update [#3333](https://github.com/VisActor/VTable/issues/3333)
- **@visactor/vtable**: progress will only support number not decimals [#3401](https://github.com/VisActor/VTable/issues/3401)
- **@visactor/vtable**: disable auto resize column width when double clicking the column border line
- **@visactor/vtable**: fix bodyGroup frame update [#3404](https://github.com/VisActor/VTable/issues/3404)
- **@visactor/vtable**: fix dom position in react-vtable [#3314](https://github.com/VisActor/VTable/issues/3314)
- **@visactor/vtable**: fix groupBy judgement in getHierarchyState() [#3406](https://github.com/VisActor/VTable/issues/3406)
- **@visactor/vtable**: fix sorted checkbox state [#3394](https://github.com/VisActor/VTable/issues/3394)

**🔨 Refactor**

- **@visactor/vtable**: progressbar type cell support customLayou [#3295](https://github.com/VisActor/VTable/issues/3295)
- **@visactor/vtable**: supplement theme frozen frameStyle border create [#3400](https://github.com/VisActor/VTable/issues/3400)

[more detail about v1.16.1](https://github.com/VisActor/VTable/releases/tag/v1.16.1)

# v1.16.0

2025-02-08


**🆕 New feature**

- **@visactor/vtable**: support async in downloadCsv&downloadExcel
- **@visactor/vtable**: linkJump & linkDetect support function
- **@visactor/vtable**: support react17 in customLayout function
- **@visactor/vtable**: add keepColumnWidthChange in vue-vtable [#3346](https://github.com/VisActor/VTable/issues/3346)
- **@visactor/vtable**: add grid-tree mode for pivot table

**🐛 Bug fix**

- **@visactor/vtable-gantt**: when resize gantt view size should update dependency node size [#3287](https://github.com/VisActor/VTable/issues/3287)
- **@visactor/vtable-gantt**: resize or move taskbar update record problem [#3321](https://github.com/VisActor/VTable/issues/3321)
- **@visactor/vtable-gantt**: updateScales to quarter taskbar size error [#3348](https://github.com/VisActor/VTable/issues/3348)
- **@visactor/vtable-gantt**: mouseover last date border occor error for gantt [#3373](https://github.com/VisActor/VTable/issues/3373)
- **@visactor/vtable**: fix clipped judgement in getCellOverflowText()
- **@visactor/vtable**: fix rowData error in media-click [#3342](https://github.com/VisActor/VTable/issues/3342)
- **@visactor/vtable**: fix header checkbox state in functional cellType [#3334](https://github.com/VisActor/VTable/issues/3334)
- **@visactor/vtable**: fix text vertical layout [#3353](https://github.com/VisActor/VTable/issues/3353)
- **@visactor/vtable**: fix merge cell style update in vtable-search [#3327](https://github.com/VisActor/VTable/issues/3327)

**🔨 Refactor**

- **@visactor/vtable**: rowSeriesNumber cell can use theme headerStyle [#3362](https://github.com/VisActor/VTable/issues/3362)



[more detail about v1.16.0](https://github.com/VisActor/VTable/releases/tag/v1.16.0)

# v1.15.2

2025-01-26

**🆕 New feature**

- **@visactor/vtable**: dependField&batType support function in progress-bar

[more detail about v1.15.2](https://github.com/VisActor/VTable/releases/tag/v1.15.2)

# v1.15.1

2025-01-17

**🆕 New feature**

- **@visactor/vtable**: add emptyTip click event
- **@visactor/vtable**: canvasWidth canvasHeight support auto setting [#3089](https://github.com/VisActor/VTable/issues/3089)
- **@visactor/vtable**: add data update in list-table tree(group) mode
- **@visactor/vtable**: add groupTitleFieldFormat API [#3092](https://github.com/VisActor/VTable/issues/3092)

**🐛 Bug fix**

- **@visactor/vtable-gantt**: when mouse leave gantt should trigger mouseleave_taskbar [#3294](https://github.com/VisActor/VTable/issues/3294)
- **@visactor/vtable**: fix empty-tip layout problem when resize window [#3312](https://github.com/VisActor/VTable/issues/3312)
- **@visactor/vtable**: remove tree limit in handleTextStick() [#3274](https://github.com/VisActor/VTable/issues/3274)

[more detail about v1.15.1](https://github.com/VisActor/VTable/releases/tag/v1.15.1)

# v1.15.0

2025-01-09

**🆕 New feature**

- **@visactor/vtable**: support register aggregator [#1508](https://github.com/VisActor/VTable/issues/1508)
- **@visactor/vtable**: frozenColCount work in pivot table [#3201](https://github.com/VisActor/VTable/issues/3201)
- **@visactor/vtable-gantt**: add moveToExtendDateRange option [#3221](https://github.com/VisActor/VTable/issues/3221)
- **@visactor/vtable-gantt**: add keyboardOptions and add delete_dependency_link contextmenu_dependency_link event [#3268](https://github.com/VisActor/VTable/issues/3268)
- **@visactor/vtable**: customMergeCell support array config [#3202](https://github.com/VisActor/VTable/issues/3202)
- **@visactor/vtable**: add displayMode in emptyTip
- **@visactor/vtable**: groupby support array config
- **@visactor/vtable**: add penetrateEventList config in react-component
- **@visactor/vtable**: add keepColumnWidthChange props in react-vtable
- **@visactor/vtable**: add imageAnonymous in customConfig
- **@visactor/vtable**: aggregationType custom work in pivot table [#1508](https://github.com/VisActor/VTable/issues/1508)

**🐛 Bug fix**

- **@visactor/vtable**: when columns is all hide then should not generate cell ids [#3199](https://github.com/VisActor/VTable/issues/3199)
- **@visactor/vtable**: when header tree indicator node has different value, columnWidthConfig not work [#3258](https://github.com/VisActor/VTable/issues/3258)
- **@visactor/vtable-gantt**: when resize taskBar width the text label should update [#3263](https://github.com/VisActor/VTable/issues/3263)
- **@visactor/vtable-gantt**: when left table set autoWidth gantt chart render error [#3266](https://github.com/VisActor/VTable/issues/3266)
- **@visactor/vtable-gantt**: change taskRecord type from string to any
- **@visactor/vtable**: fix aggregation display issue in tree-structured table headers
- **@visactor/vtable**: fix collapse checkbox state update [#3171](https://github.com/VisActor/VTable/issues/3171)
- **@visactor/vtable**: clear sort target when setRecords in dataset
- **@visactor/vtable**: fix frozen update problem in react-dom-component
- **@visactor/vtable**: fix iterator map in getCheckboxState() [#3177](https://github.com/VisActor/VTable/issues/3177) [#3239](https://github.com/VisActor/VTable/issues/3239)

**📖 Site / documentation update**

- **@visactor/vtable**: add weather calendar demo
- **@visactor/vtable**: add scheduleCreatable doc

[more detail about v1.15.0](https://github.com/VisActor/VTable/releases/tag/v1.15.0)

# v1.14.3

2024-12-27

**🆕 New feature**

- **@visactor/vtable**: showSort support function type [#2630](https://github.com/VisActor/VTable/issues/2630)
- **@visactor/vtable**: add hide for indicator setting [#2257](https://github.com/VisActor/VTable/issues/2257) [#2451](https://github.com/VisActor/VTable/issues/2451)
- **@visactor/vtable**: add enableTreeCheckbox config

**🐛 Bug fix**

- **@visactor/vtable**: fix borderLineWidth array config [#3183](https://github.com/VisActor/VTable/issues/3183)
- **@visactor/vtable**: when set resizable false hover taskbar occor error [#3189](https://github.com/VisActor/VTable/issues/3189)

[more detail about v1.14.3](https://github.com/VisActor/VTable/releases/tag/v1.14.3)

# v1.14.1

2024-12-23

**🆕 New feature**

- **@visactor/vtable-gantt**: add grid rowBackgroundColor and columnBackgroundColor weekendBackgroundColor [#3155](https://github.com/VisActor/VTable/issues/3155)

**🐛 Bug fix**

- **@visactor/vtable-gantt**: gantt taskbar resize width interaction can not limit one time unit [#3161](https://github.com/VisActor/VTable/issues/3161)
- **@visactor/vtable**: fix axes count error in seriesIds config

**🔨 Refactor**

- **@visactor/vtable**: add option tableSizeAntiJitter [#3160](https://github.com/VisActor/VTable/issues/3160)

[more detail about v1.14.1](https://github.com/VisActor/VTable/releases/tag/v1.14.1)

# v1.14.0

2024-12-20

**🆕 New feature**

- **@visactor/vtable-gantt**: add contextmenu_task_bar event [#3013](https://github.com/VisActor/VTable/issues/3013)
- **@visactor/vtable-gantt**: add milestone type [#3097](https://github.com/VisActor/VTable/issues/3097)
- **@visactor/vtable**: add mergeCell function to support more detailed conditions
- **@visactor/vtable**: support tickAlign in PivotChart
- **@visactor/vtable-gantt**: add updateMarkLine
- **@visactor/vtable**: add enums in validateValue of vtable-editor [#3039](https://github.com/VisActor/VTable/issues/3039)

**🐛 Bug fix**

- **@visactor/vtable**: validateValue not promise case can not be recalled [#3144](https://github.com/VisActor/VTable/issues/3144)
- **@visactor/vtable**: adjust scroll hot area limited on table group [#3152](https://github.com/VisActor/VTable/issues/3152)
- **@visactor/vtable**: fix react-component update in tree table
- **@visactor/vtable**: fix customStyle update not work [#3068](https://github.com/VisActor/VTable/issues/3068)
- **@visactor/vtable**: fix font-weight in vtable-export [#3005](https://github.com/VisActor/VTable/issues/3005)
- **@visactor/vtable**: fix graphic html attribute error
- **@visactor/vtable**: application define in react-vtable umd file [#3093](https://github.com/VisActor/VTable/issues/3093)
- **@visactor/vtable**: fix customRender error in react-vtable [#3142](https://github.com/VisActor/VTable/issues/3142)
- **@visactor/vtable**: fix group title link click [#3022](https://github.com/VisActor/VTable/issues/3022)
- **@visactor/vtable**: fix cell group judgement when scroll [#3149](https://github.com/VisActor/VTable/issues/3149)
- **@visactor/vtable**: fix undeline height in text measurement [#3112](https://github.com/VisActor/VTable/issues/3112)
- **@visactor/vtable**: change checkboxState into Map

**🔨 Refactor**

- **@visactor/vtable**: customComputeRowHeight logic

[more detail about v1.14.0](https://github.com/VisActor/VTable/releases/tag/v1.14.0)

# v1.13.2

2024-12-16

**🆕 New feature**

- **@visactor/vtable-gantt**: resizable and moveable support function [#3074](https://github.com/VisActor/VTable/issues/3074)
- **@visactor/vtable-gantt**: add updateOption and updateScales api

**🐛 Bug fix**

- **@visactor/vtable**: copy permission check when in iframe [#3077](https://github.com/VisActor/VTable/issues/3077)
- **@visactor/vtable**: when has select cells to resize col width or row height error [#3085](https://github.com/VisActor/VTable/issues/3085)
- **@visactor/vtable-gantt**: consider not set mindate maxdate call setRecords api

[more detail about v1.13.2](https://github.com/VisActor/VTable/releases/tag/v1.13.2)

# v1.13.1

2024-12-13

**🆕 New feature**

- **@visactor/vtable-gantt**: add time scale unit hour [#2976](https://github.com/VisActor/VTable/issues/2976)

**🐛 Bug fix**

- **@visactor/vtable-gantt**: left table width handle with tableWidth set auto [#3033](https://github.com/VisActor/VTable/issues/3033)

[more detail about v1.13.1](https://github.com/VisActor/VTable/releases/tag/v1.13.1)

# v1.13.0

2024-12-09

**🆕 New feature**

- **@visactor/vtable**: add keybord ctrlMultiSelect config [#2995](https://github.com/VisActor/VTable/issues/2995)
- **@visactor/vtable**: add panelStyle&arrowStyle config in Popover [#2988](https://github.com/VisActor/VTable/issues/2988)

**🐛 Bug fix**

- **@visactor/vtable**: select not work when select set disableSelect [#2981](https://github.com/VisActor/VTable/issues/2981)
- **@visactor/vtable**: fix textAlign in checkbox/radio [#2908](https://github.com/VisActor/VTable/issues/2908)
- **@visactor/vtable**: outsideClickDeselect event in menu element
- **@visactor/vtable**: fix col&row range in getCellMergeRange() [#2906](https://github.com/VisActor/VTable/issues/2906)
- **@visactor/vtable**: fix merge cell select range update [#2944](https://github.com/VisActor/VTable/issues/2944)
- **@visactor/vtable**: fix ListTreeStickCellPlugin update in tree_hierarchy_state_change event [#2914](https://github.com/VisActor/VTable/issues/2914)
- **@visactor/vtable**: fix row update range in \_refreshHierarchyState() [#2987](https://github.com/VisActor/VTable/issues/2987)
- **@visactor/vtable**: fix text baseline align problem

[more detail about v1.13.0](https://github.com/VisActor/VTable/releases/tag/v1.13.0)

# v1.12.0

2024-12-03

**🆕 New feature**

- **@visactor/vtable**: add option customComputeRowHeight and defaultRowHeight can set "auto"
- **@visactor/vtable-gantt**: add taskShowMode for gantt chart [#2849](https://github.com/VisActor/VTable/issues/2849)

**🐛 Bug fix**

- **@visactor/vtable-gantt**: when edit record task date update taskbar occor error [#2938](https://github.com/VisActor/VTable/issues/2938)
- **@visactor/vtable**: fix last col&row editor size [#2926](https://github.com/VisActor/VTable/issues/2926)
- **@visactor/vtable**: fix cell update event problem in CustomCellStylePlugin [#2927](https://github.com/VisActor/VTable/issues/2927)
- **@visactor/vtable**: fix react-component in tree mode update
- **@visactor/vtable**: fix default row height in computeRowHeight() [#2903](https://github.com/VisActor/VTable/issues/2903)
- **@visactor/vtable**: fix legend visible problem when reize table
- **@visactor/vtable**: fix cache problem in Icon.loadGif() [#2905](https://github.com/VisActor/VTable/issues/2905)
- **@visactor/vtable**: fix merge radio cell check update [#2881](https://github.com/VisActor/VTable/issues/2881)
- **@visactor/vtable**: fix strokeArrayWidth update in updateCell() [#2811](https://github.com/VisActor/VTable/issues/2811)

**📖 Site / documentation update**

- **@visactor/vtable-gantt**: add getTaskBarRelativeRect api [#2920](https://github.com/VisActor/VTable/issues/2920)

[more detail about v1.12.0](https://github.com/VisActor/VTable/releases/tag/v1.12.0)

# v1.11.5

2024-11-29

**🆕 New feature**

- **@visactor/vtable**: add @visactor/vtable-plugins package

**📖 Site / documentation update**

- **@visactor/vtable**: 更新进入或离开节点时的事件文档
- **@visactor/vtable**: 更新甘特图事件文档，暴露整个 e 的信息

[more detail about v1.11.5](https://github.com/VisActor/VTable/releases/tag/v1.11.5)

# v1.11.3

2024-11-28

**🐛 Bug fix**

- **@visactor/vtable**: frozen chart not update when resize row or column width [#2876](https://github.com/VisActor/VTable/issues/2876)
- **@visactor/vtable**: fix custom-component update in deleteRecords api

**🔨 Refactor**

- **@visactor/vtable**: when columnWidthConfig set wrong dimensions should judge this case [#2948](https://github.com/VisActor/VTable/issues/2948)

[more detail about v1.11.3](https://github.com/VisActor/VTable/releases/tag/v1.11.3)

# v1.11.2

2024-11-26

**🆕 New feature**

- **@visactor/vtable**: add select makeSelectCellVisible [#2840](https://github.com/VisActor/VTable/issues/2840)
- **@visactor/vtable**: add setCustomSelectRanges in stateManager [#2750](https://github.com/VisActor/VTable/issues/2750) [#2845](https://github.com/VisActor/VTable/issues/2845)
- **@visactor/vtable**: optimize range select in HeaderHighlightPlugin
- **@visactor/vtable**: isShowOverflowTextTooltip support function
- **@visactor/vtable**: cell support multi-custom-style [#2841](https://github.com/VisActor/VTable/issues/2841)
- **@visactor/vtable**: templateLink support function [#2847](https://github.com/VisActor/VTable/issues/2847)
- **@visactor/vtable**: add position in tooltip config [#2869](https://github.com/VisActor/VTable/issues/2869)
- **@visactor/vtable**: add parentElement in menu option

**🐛 Bug fix**

- **@visactor/vtable**: add isValidatingValue state to fix call validateValue api repeatedly [#2830](https://github.com/VisActor/VTable/issues/2830)
- **@visactor/vtable**: when up on canvas blank area not drag position rightly [#2831](https://github.com/VisActor/VTable/issues/2831)
- **@visactor/vtable**: when resize column width the select state be cleared [#2861](https://github.com/VisActor/VTable/issues/2861)
- **@visactor/vtable**: when container resize trigger mark line resize [#2883](https://github.com/VisActor/VTable/issues/2883)
- **@visactor/vtable**: when not set minDate maxDate call setRecords render error [#2892](https://github.com/VisActor/VTable/issues/2892)
- **@visactor/vtable**: fix cell border dash update [#2818](https://github.com/VisActor/VTable/issues/2818)
- **@visactor/vtable**: fix merge cell text position [#2858](https://github.com/VisActor/VTable/issues/2858)
- **@visactor/vtable**: fix functional padding update [#2774](https://github.com/VisActor/VTable/issues/2774)
- **@visactor/vtable**: fix select all in row-series-number checkbox [#2880](https://github.com/VisActor/VTable/issues/2880)

**🔨 Refactor**

- **@visactor/vtable**: when set headerSelectMode body drag column order should work [#2860](https://github.com/VisActor/VTable/issues/2860)

[more detail about v1.11.2](https://github.com/VisActor/VTable/releases/tag/v1.11.2)

# v1.11.1

2024-11-21

**🆕 New feature**

- **@visactor/vtable**: add setCustomSelectRanges in stateManager [#2750](https://github.com/VisActor/VTable/issues/2750) [#2845](https://github.com/VisActor/VTable/issues/2845)
- **@visactor/vtable**: optimize range select in HeaderHighlightPlugin
- **@visactor/vtable**: isShowOverflowTextTooltip support function

**🐛 Bug fix**

- **@visactor/vtable**: add isValidatingValue state to fix call validateValue api repeatedly [#2830](https://github.com/VisActor/VTable/issues/2830)
- **@visactor/vtable**: when up on canvas blank area not drag position rightly [#2831](https://github.com/VisActor/VTable/issues/2831)
- **@visactor/vtable**: fix cell border dash update [#2818](https://github.com/VisActor/VTable/issues/2818)
- **@visactor/vtable**: fix merge cell text position [#2858](https://github.com/VisActor/VTable/issues/2858)

[more detail about v1.11.1](https://github.com/VisActor/VTable/releases/tag/v1.11.1)

# v1.11.0

2024-11-15

**🆕 New feature**

- **@visactor/vtable**: add event changing_header_position
- **@visactor/vtable-gantt**: drag order highlight line render
- **@visactor/vtable**: add change_header_position_fail event
- **@visactor/vtable**: add argument recalculateColWidths for api toggleHierarchyState [#2817](https://github.com/VisActor/VTable/issues/2817)
- **@visactor/vtable**: add InvertHighlightPlugin
- **@visactor/vtable**: add vtable-calendar

**🐛 Bug fix**

- **@visactor/vtable**: pivot chart pie type selected state not work [#2178](https://github.com/VisActor/VTable/issues/2178)
- **@visactor/vtable**: rose pivotchart click legend then hover chart render error [#2209](https://github.com/VisActor/VTable/issues/2209)
- **@visactor/vtable**: when chart row is frozen render error [#2800](https://github.com/VisActor/VTable/issues/2800)
- **@visactor/vtable**: when after select range not exist [#2804](https://github.com/VisActor/VTable/issues/2804)
- **@visactor/vtable**: call renderWithRecreateCells should not effect colWidth when widthMode is adaptive [#2835](https://github.com/VisActor/VTable/issues/2835)
- **@visactor/vtable**: add CarouselAnimationPlugin
- **@visactor/vtable**: add HeaderHighlightPlugin

**🔨 Refactor**

- **@visactor/vtable**: when set disableSelect but api selectCell can work [#2799](https://github.com/VisActor/VTable/issues/2799)

[more detail about v1.11.0](https://github.com/VisActor/VTable/releases/tag/v1.11.0)

# v1.10.5

2024-11-11

**🐛 Bug fix**

- **@visactor/vtable**: pivot chart spec enable select not work [#2210](https://github.com/VisActor/VTable/issues/2210)
- **@visactor/vtable**: sortState field undefined occor error

[more detail about v1.10.5](https://github.com/VisActor/VTable/releases/tag/v1.10.5)

# v1.10.4

2024-11-07

**🆕 New feature**

- **@visactor/vtable-gantt**: gantt dependency line support tree node [#2701](https://github.com/VisActor/VTable/issues/2701)
- **@visactor/vtable**: when drag on header can select cells continuous [#2751](https://github.com/VisActor/VTable/issues/2751)

**🐛 Bug fix**

- **@visactor/vtable-gantt**: when markline date less then minDate should not show [#2689](https://github.com/VisActor/VTable/issues/2689)
- **@visactor/vtable**: pivot table header icon display incorrect [#2735](https://github.com/VisActor/VTable/issues/2735)
- **@visactor/vtable**: parse axes config error when user set axes [#2749](https://github.com/VisActor/VTable/issues/2749)
- **@visactor/vtable**: cellType set funciton occor error [#2754](https://github.com/VisActor/VTable/issues/2754)
- **@visactor/vtable**: when pivot cell type set chart not data cell render error [#2758](https://github.com/VisActor/VTable/issues/2758)
- **@visactor/vtable**: legend problems [#2764](https://github.com/VisActor/VTable/issues/2764) [#2755](https://github.com/VisActor/VTable/issues/2755)
- **@visactor/vtable-gantt**: create task shedule date error [#2771](https://github.com/VisActor/VTable/issues/2771)
- **@visactor/vtable**: fix cellLocation in pivot-table [#2694](https://github.com/VisActor/VTable/issues/2694)
- **@visactor/vtable**: fix menu scale pos problem [#2734](https://github.com/VisActor/VTable/issues/2734)
- **@visactor/vtable**: fix tree frozen row problem [#2619](https://github.com/VisActor/VTable/issues/2619)

[more detail about v1.10.4](https://github.com/VisActor/VTable/releases/tag/v1.10.4)

# v1.10.3

2024-11-01

**🐛 Bug fix**

- **@visactor/vtable**: type define columnWidthConfig

[more detail about v1.10.3](https://github.com/VisActor/VTable/releases/tag/v1.10.3)

# v1.10.2

2024-11-01

**🆕 New feature**

- **@visactor/vtable**: headerSelectMode option add body setting [#2491](https://github.com/VisActor/VTable/issues/2491)
- **@visactor/vtable**: add freeze_click event [#2641](https://github.com/VisActor/VTable/issues/2641)
- **@visactor/vtable**: add columnWidthConfig to set width by dimensions [#2696](https://github.com/VisActor/VTable/issues/2696)

**🐛 Bug fix**

- **@visactor/vtable**: isColumnHeader api judement logic [#2491](https://github.com/VisActor/VTable/issues/2491)
- **@visactor/vtable**: when collapse last group occor error [#2600](https://github.com/VisActor/VTable/issues/2600)
- **@visactor/vtable**: when collapse tree node occor error [#2600](https://github.com/VisActor/VTable/issues/2600)
- **@visactor/vtable**: min aggregator type handle with NaN value [#2627](https://github.com/VisActor/VTable/issues/2627)
- **@visactor/vtable**: when drag row series number cells not scroll [#2647](https://github.com/VisActor/VTable/issues/2647)
- **@visactor/vtable**: rowSeriesNumber when be frozen can render customlayout [#2653](https://github.com/VisActor/VTable/issues/2653)
- **@visactor/vtable**: when has empty tip scrollbar can not be clicked [#2690](https://github.com/VisActor/VTable/issues/2690)
- **@visactor/vtable**: when field set array，record no corresponding field，occur error [#2702](https://github.com/VisActor/VTable/issues/2702)
- **@visactor/vtable**: when has gantt and table same time internal theme should not be changed [#2708](https://github.com/VisActor/VTable/issues/2708)
- **@visactor/vtable**: fix check state update [#2667](https://github.com/VisActor/VTable/issues/2667)
- **@visactor/vtable**: fix list-editor space problem
- **@visactor/vtable**: change pointerupoutside event callback [#2674](https://github.com/VisActor/VTable/issues/2674) [#2659](https://github.com/VisActor/VTable/issues/2659)
- **@visactor/vtable**: add event in react-vtable
- **@visactor/vtable**: add selected_cell event in select-all [#2664](https://github.com/VisActor/VTable/issues/2664)
- **@visactor/vtable**: fix disableRowSeriesNumberSelect in select-all [#2665](https://github.com/VisActor/VTable/issues/2665)
- **@visactor/vtable**: fix title resize in adaptive mode [#2704](https://github.com/VisActor/VTable/issues/2704)

**🔨 Refactor**

- **@visactor/vtable**: custom merge cell ignore check state jude [#2683](https://github.com/VisActor/VTable/issues/2683)
- **@visactor/vtable**: paste cell value should use editor validateValidate api [#2691](https://github.com/VisActor/VTable/issues/2691)

[more detail about v1.10.2](https://github.com/VisActor/VTable/releases/tag/v1.10.2)

# v1.10.1

2024-10-23

**🐛 Bug fix**

- **@visactor/vtable**: when set rowSeriesNumber then sort icon not update [#2643](https://github.com/VisActor/VTable/issues/2643)
- **@visactor/vtable**: disable cellInnerBorder when no frame border

[more detail about v1.10.1](https://github.com/VisActor/VTable/releases/tag/v1.10.1)

# v1.10.0

2024-10-18

**🆕 New feature**

- **@visactor/vtable**: add maxHeight in menu container [#2602](https://github.com/VisActor/VTable/issues/2602)
- **@visactor/vtable**: add after_sort event
- **@visactor/vtable-gantt**: add creation buttom for not schedualed task record
- **@visactor/vtable-gantt**: add dependency line for gantt chart
- **@visactor/vtable-gantt**: add task bar selected style
- **@visactor/vtable-gantt**: add dependency line selected style
- **@visactor/vtable-gantt**: add underlayBackgroundColor for gantt chart [#2607](https://github.com/VisActor/VTable/issues/2607)

**🐛 Bug fix**

- **@visactor/vtable**: when dimension paths has virtual not identify problem [#2510](https://github.com/VisActor/VTable/issues/2510)
- **@visactor/vtable**: toggleHierarchyState api can not update customlayout cell [#2609](https://github.com/VisActor/VTable/issues/2609)
- **@visactor/vtable**: fix legend layout problem
- **@visactor/vtable**: fix border rect missing when borderLineWidth is 0
- **@visactor/vtable**: fix multi-sort icon update in updateSortState() [#2614](https://github.com/VisActor/VTable/issues/2614)
- **@visactor/vtable**: fix col/row end in createGroupForFirstScreen() [#2585](https://github.com/VisActor/VTable/issues/2585)
- **@visactor/vtable**: fix customConfig in react-vtable
- **@visactor/vtable**: fix row resize mark position when scrolled vertically [#2606](https://github.com/VisActor/VTable/issues/2606)
- **@visactor/vtable**: fix sort icon update in transpose list-table

[more detail about v1.10.0](https://github.com/VisActor/VTable/releases/tag/v1.10.0)

# v1.9.1

2024-10-12

**🐛 Bug fix**

- **@visactor/vtable**: fix sort icon update in merge cell

[more detail about v1.9.1](https://github.com/VisActor/VTable/releases/tag/v1.9.1)

# v1.9.0

2024-10-11

**🆕 New feature**

- **@visactor/vtable**: add scrollTo animation function

**🐛 Bug fix**

- **@visactor/vtable**: when dimension set width auto but no records, the col width not compute [#2515](https://github.com/VisActor/VTable/issues/2515)
- **@visactor/vtable**: when call updateColumns should update aggregation [#2519](https://github.com/VisActor/VTable/issues/2519)
- **@visactor/vtable**: change outsideClickDeselect trigger time when pointerdown [#2553](https://github.com/VisActor/VTable/issues/2553)
- **@visactor/vtable**: when sort with row series number occor error [#2558](https://github.com/VisActor/VTable/issues/2558)
- **@visactor/vtable**: fix select auto-scroll in bottom [#2546](https://github.com/VisActor/VTable/issues/2546)
- **@visactor/vtable**: fix auto size in react custom component
- **@visactor/vtable**: fix custom component flash when cell resizes [#2516](https://github.com/VisActor/VTable/issues/2516)
- **@visactor/vtable**: fix custom component in forzen cell [#2568](https://github.com/VisActor/VTable/issues/2568)
- **@visactor/vtable**: fix legend with padding layout size
- **@visactor/vtable**: fix cellLocation in createComplexColumn [#2517](https://github.com/VisActor/VTable/issues/2517)
- **@visactor/vtable**: fix merge cell select range [#2521](https://github.com/VisActor/VTable/issues/2521)

**🔨 Refactor**

- **@visactor/vtable**: when value is promise cell style function should await [#2549](https://github.com/VisActor/VTable/issues/2549)

[more detail about v1.9.0](https://github.com/VisActor/VTable/releases/tag/v1.9.0)

# v1.8.2

2024-10-08

**🐛 Bug fix**

- **@visactor/vtable**: fix richtext icon update [#2281](https://github.com/VisActor/VTable/issues/2281)

[more detail about v1.8.2](https://github.com/VisActor/VTable/releases/tag/v1.8.2)

# v1.8.1

2024-09-30

**🔨 Refactor**

- **@visactor/vue-vtable**: rename vue component name

[more detail about v1.8.1](https://github.com/VisActor/VTable/releases/tag/v1.8.1)

# v1.8.0

2024-09-29

**🆕 New feature**

- **@visactor/vue-vtable**: add vue-vtable

**🐛 Bug fix**

- **@visactor/vtable**: fix estimate position in updateAutoRow() [#2494](https://github.com/VisActor/VTable/issues/2494)
- **@visactor/vtable**: fix drag check state update [#2518](https://github.com/VisActor/VTable/issues/2518)
- **@visactor/vtable**: fix group cell in vtable-export [#2487](https://github.com/VisActor/VTable/issues/2487)
- **@visactor/vtable**: fix react component update problem when resize column
- **@visactor/vtable**: add functionalIconsStyle on theme [#1308](https://github.com/VisActor/VTable/issues/1308)

[more detail about v1.8.0](https://github.com/VisActor/VTable/releases/tag/v1.8.0)

[more detail about v1.7.9](https://github.com/VisActor/VTable/releases/tag/v1.7.9)

# v1.7.8

2024-09-24

**🆕 New feature**

- **@visactor/vtable**: handle with customTree in dataset file to refactor processRecord function [#2279](https://github.com/VisActor/VTable/issues/2279)
- **@visactor/vtable**: add async support in vtable-export [#2460](https://github.com/VisActor/VTable/issues/2460)

**🐛 Bug fix**

- **@visactor/vtable**: custom total value not work [#2455](https://github.com/VisActor/VTable/issues/2455)
- **@visactor/vtable**: adjust sort icon up and down [#2465](https://github.com/VisActor/VTable/issues/2465)
- **@visactor/vtable**: when current edit not exit, could not trigger new edit cell [#2469](https://github.com/VisActor/VTable/issues/2469)
- **@visactor/vtable**: when no records edit cell value occor error [#2474](https://github.com/VisActor/VTable/issues/2474)
- **@visactor/vtable**: set aggregation on option not work [#2459](https://github.com/VisActor/VTable/issues/2459)
- **@visactor/vtable**: fix cell border clip in 'bottom-right' borde mode [#2442](https://github.com/VisActor/VTable/issues/2442)
- **@visactor/vtable**: add children === true hierarchyState in initChildrenNodeHierarchy()
- **@visactor/vtable**: fix custom component frozen update [#2432](https://github.com/VisActor/VTable/issues/2432)
- **@visactor/vtable**: when resize trigger click_cell event
- **@visactor/vtable**: fix proxy.colStart update in resetFrozen() [#2464](https://github.com/VisActor/VTable/issues/2464)
- **@visactor/vtable**: add '——' in specialCharSet [#2470](https://github.com/VisActor/VTable/issues/2470)

**🔨 Refactor**

- **@visactor/vtable**: update aggregator when update records [#2459](https://github.com/VisActor/VTable/issues/2459)

[more detail about v1.7.8](https://github.com/VisActor/VTable/releases/tag/v1.7.8)

# v1.7.7

2024-09-13

**🔨 功能重构**

- **@visactor/vtable**: gantt project export vtable and vrender

[更多详情请查看 v1.7.7](https://github.com/VisActor/VTable/releases/tag/v1.7.7)

# v1.7.6

2024-09-12

**🐛 Bug fix**

- **@visactor/vtable-gantt**: fix: set table theme error in gantt chart [#2439](https://github.com/VisActor/VTable/pull/2439)

[more detail about v1.7.6](https://github.com/VisActor/VTable/releases/tag/v1.7.6)

# v1.7.5

2024-09-12

**🆕 New feature**

- **@visactor/vtable**: add getFilteredRecords api [#2255](https://github.com/VisActor/VTable/issues/2255)

**🐛 Bug fix**

- **@visactor/vtable**: select range click outside not cancel select [#2355](https://github.com/VisActor/VTable/issues/2355)
- **@visactor/vtable**: split line position fix [#2392](https://github.com/VisActor/VTable/issues/2392)
- **@visactor/vtable**: levelSpan case front columnNode merge range error [#2359](https://github.com/VisActor/VTable/issues/2359)
- **@visactor/vtable**: judge value is valid [#2402](https://github.com/VisActor/VTable/issues/2402)
- **@visactor/vtable**: mousedown chart go dealSelectCell and rerender it [#2419](https://github.com/VisActor/VTable/issues/2419)
- **@visactor/vtable**: fix axis size and layout [#2256](https://github.com/VisActor/VTable/issues/2256)
- **@visactor/vtable**: fix series number in list-group [#2425](https://github.com/VisActor/VTable/issues/2425)
- **@visactor/vtable**: fix recordIndex config of addRecord in list-group [#2426](https://github.com/VisActor/VTable/issues/2426)

[more detail about v1.7.5](https://github.com/VisActor/VTable/releases/tag/v1.7.5)

# v1.7.4

2024-09-09

**🆕 New feature**

- **@visactor/vtable**: add updateFilterRules api [#2245](https://github.com/VisActor/VTable/issues/2245)

**🐛 Bug fix**

- **@visactor/vtable**: when tree pivot table sort then expand tree node render error [#2261](https://github.com/VisActor/VTable/issues/2261)
- **@visactor/vtable**: fix interactive layer dom clear problem
- **@visactor/vtable**: when no records corner header show dimention title [#2247](https://github.com/VisActor/VTable/issues/2247)
- **@visactor/vtable**: fix sparkline range when data has null

[more detail about v1.7.4](https://github.com/VisActor/VTable/releases/tag/v1.7.4)

# v1.7.3

2024-09-05

**🐛 Bug fix**

- **@visactor/vtable**: when keydown with ctrl meta and shift not trigger edit mode # 2372
- **@visactor/vtable**: fix custom style arrangement duplicate [#2370](https://github.com/VisActor/VTable/issues/2370)
- **@visactor/vtable**: fix no-text cell custom merge [#2343](https://github.com/VisActor/VTable/issues/2343)
- **@visactor/vtable**: fix event bind problem in react-vtable
- **@visactor/vtable**: fix right frozen mark position [#2344](https://github.com/VisActor/VTable/issues/2344)
- **@visactor/vtable**: fix select range judgement in cellBgColor [#2368](https://github.com/VisActor/VTable/issues/2368)

[more detail about v1.7.3](https://github.com/VisActor/VTable/releases/tag/v1.7.3)

# v1.7.2

2024-09-02

**🐛 Bug fix**

- **@visactor/vtable**: when use groupBy then all merged cells set cellType text [#2331](https://github.com/VisActor/VTable/issues/2331)

[more detail about v1.7.2](https://github.com/VisActor/VTable/releases/tag/v1.7.2)

# v1.7.1

2024-09-02

**🐛 Bug fix**

- **@visactor/react-vtable**: fix envs type in react-vtable

[more detail about v1.7.1](https://github.com/VisActor/VTable/releases/tag/v1.7.1)

# v1.7.0

2024-08-30

**🆕 New feature**

- **@visactor/vtable-gantt**: add gantt chart

# v1.6.3

2024-08-29

**🆕 New feature**

- **@visactor/vtable**: add formatCopyValue config
- **@visactor/vtable**: add parentElement config in tooltip [#2290](https://github.com/VisActor/VTable/issues/2290)

**🐛 Bug fix**

- **@visactor/vtable**: handle with change header postion event [#2299](https://github.com/VisActor/VTable/issues/2299)
- **@visactor/vtable**: pivot tree can not show value and expand tree occor error [#2306](https://github.com/VisActor/VTable/issues/2306)
- **@visactor/vtable**: set titleOnDimension all sort can not run [#2278](https://github.com/VisActor/VTable/issues/2278)
- **@visactor/vtable**: add judgement in array find function [#2289](https://github.com/VisActor/VTable/issues/2289)
- **@visactor/vtable**: fix frozen column custom component clip
- **@visactor/vtable**: fix cellLocation in top frozen row [#2267](https://github.com/VisActor/VTable/issues/2267)
- **@visactor/vtable**: fix list-table group mode style update problem
- **@visactor/vtable**: fix menu auto hide when page crolled [#2241](https://github.com/VisActor/VTable/issues/2241)
- **@visactor/vtable**: fix progress bar cell textAlign update [#2225](https://github.com/VisActor/VTable/issues/2225)
- **@visactor/vtable**: fix umd package problem in react-vtable [#2244](https://github.com/VisActor/VTable/issues/2244)
- **@visactor/vtable**: fix right frozen size in updateContainerAttrWidthAndX() [#2243](https://github.com/VisActor/VTable/issues/2243)
- **@visactor/vtable**: fix leftRowSeriesNumberColumnCount error in getBodyLayoutRangeById() [#2234](https://github.com/VisActor/VTable/issues/2234)
- **@visactor/vtable**: fix frozen column custom component clip
- **@visactor/vtable**: fix menu auto hide when page crolled [#2241](https://github.com/VisActor/VTable/issues/2241)

**🔨 Refactor**

- **@visactor/vtable**: scroll event add argument [#2249](https://github.com/VisActor/VTable/issues/2249)
- **@visactor/vtable**: changeCellValue can modify raw record [#2305](https://github.com/VisActor/VTable/issues/2305)

[more detail about v1.6.3](https://github.com/VisActor/VTable/releases/tag/v1.6.3)

# v1.6.1

2024-08-19

**💥 Breaking change**

- **@visactor/react-vtable**: remove `VTable` export in `react-vtable`, if you want to use `VTable`, please add and import it from `@visactor/vtable` in the same version.
- **@visactor/react-vtable**: remove `VRender` export in `vtable`, if you want to use `VRender`, import it from `@visactor/vtable/es/vrender`.

**🆕 New feature**

- **@visactor/vtable**: add option forceShowHeader
- **@visactor/vtable**: frameStyle cornerRadius support array type [#2207](https://github.com/VisActor/VTable/issues/2207)
- **@visactor/vtable**: add table releated components in react-vtable
- **@visactor/vtable**: add enum in textStick config
- **@visactor/vtable**: add frozenRowCount in transpose table [#2182](https://github.com/VisActor/VTable/issues/2182)
- **@visactor/vtable**: add excelJSWorksheetCallback config in vtable-export
- **@visactor/vtable**: add group function

**🐛 Bug fix**

- **@visactor/vtable**: corner header display dimension name in some case [#2180](https://github.com/VisActor/VTable/issues/2180)
- **@visactor/vtable**: frameStyle borrerLineWidth set array, table render positon error [#2200](https://github.com/VisActor/VTable/issues/2200)
- **@visactor/vtable**: fix icon margin error in update size [#2206](https://github.com/VisActor/VTable/issues/2206)
- **@visactor/vtable**: fix react custom layout component container height
- **@visactor/vtable**: fix jsx customLayout size compute mode [#2192](https://github.com/VisActor/VTable/issues/2192)
- **@visactor/vtable**: add default color in vtable-export
- **@visactor/vtable**: fix row-series cell type [#2188](https://github.com/VisActor/VTable/issues/2188)

**🔨 Refactor**

- **@visactor/vtable**: supplement backgroundColor for editor [#1518](https://github.com/VisActor/VTable/issues/1518)

[more detail about v1.6.1](https://github.com/VisActor/VTable/releases/tag/v1.6.1)

# v1.5.6

2024-08-08

**🆕 New feature**

- **@visactor/vtable**: add canvas & viewbox config

**🐛 Bug fix**

- **@visactor/vtable**: fix released async problem [#2145](https://github.com/VisActor/VTable/issues/2145)

[more detail about v1.5.6](https://github.com/VisActor/VTable/releases/tag/v1.5.6)

# v1.5.4

2024-08-02

**🆕 New feature**

- **@visactor/vtable**: pivot table corner cell support icon [#2120](https://github.com/VisActor/VTable/issues/2120)
- **@visactor/vtable**: support editCellTrigger set keydown [#2136](https://github.com/VisActor/VTable/issues/2136)
- **@visactor/vtable**: add react-component for option-emptyTip
- **@visactor/vtable**: add react-component for option-emptyTip - demo
- **@visactor/vtable**: add escape config in csv-exporter
- **@visactor/vtable**: add selectionFillMode config in theme.selectionStyle [#2132](https://github.com/VisActor/VTable/issues/2132) [#2027](https://github.com/VisActor/VTable/issues/2027)

**🐛 Bug fix**

- **@visactor/vtable**: set sort rule occor error [#2106](https://github.com/VisActor/VTable/issues/2106)
- **@visactor/vtable**: clearSelected api clear ctrl+a border [#2115](https://github.com/VisActor/VTable/issues/2115)
- **@visactor/vtable**: move header position not work not trigger change_header_position event [#2129](https://github.com/VisActor/VTable/issues/2129)
- **@visactor/vtable**: set cellType is function, resize col width chart size render error [#2160](https://github.com/VisActor/VTable/issues/2160)
- **@visactor/vtable**: when call setRowHeight should update chart size [#2155](https://github.com/VisActor/VTable/issues/2155)
- **@visactor/vtable**: fix cell range clear in update record
- **@visactor/vtable**: fix custom-element update problem [#2126](https://github.com/VisActor/VTable/issues/2126)
- **@visactor/vtable**: fix customMege cell update
- **@visactor/vtable**: fix CellContent pickable config [#2134](https://github.com/VisActor/VTable/issues/2134)
- **@visactor/vtable**: fix legend visible config [#2137](https://github.com/VisActor/VTable/issues/2137)
- **@visactor/vtable**: fix released async problem [#2145](https://github.com/VisActor/VTable/issues/2145)
- **@visactor/vtable**: remove resizing update in endResizeCol() [#2101](https://github.com/VisActor/VTable/issues/2101)

[more detail about v1.5.4](https://github.com/VisActor/VTable/releases/tag/v1.5.4)

# v1.5.3

2024-07-19

**🆕 New feature**

- **@visactor/vtable**: add param value for startEditCell api [#2089](https://github.com/VisActor/VTable/issues/2089)

**🐛 Bug fix**

- **@visactor/vtable**: fix option config in vtable-export

[more detail about v1.5.3](https://github.com/VisActor/VTable/releases/tag/v1.5.3)

# v1.5.2

2024-07-15

**🆕 New feature**

- **@visactor/vtable**: add api disableScroll and enableScroll [#2073](https://github.com/VisActor/VTable/issues/2073)
- **@visactor/vtable**: add renderDefault prop in react customLayout component
- **@visactor/vtable**: support multiple columns tag in react-vtable

**🐛 Bug fix**

- **@visactor/vtable**: edit api validateValue support async
- **@visactor/vtable**: api changeFieldValue occor errow when records has null [#2067](https://github.com/VisActor/VTable/issues/2067)
- **@visactor/vtable**: fix react component error in updateCell() [#2038](https://github.com/VisActor/VTable/issues/2038)
- **@visactor/vtable**: fix axes default config in scatter chart [#2071](https://github.com/VisActor/VTable/issues/2071)

[more detail about v1.5.2](https://github.com/VisActor/VTable/releases/tag/v1.5.2)

# v1.5.1

2024-07-10

**🐛 Bug fix**

- **@visactor/vtable**: getCellAtRelativePosition api return value [#2054](https://github.com/VisActor/VTable/issues/2054)
- **@visactor/vtable**: add tolerance for scroll in \_disableColumnAndRowSizeRound mode

[more detail about v1.5.1](https://github.com/VisActor/VTable/releases/tag/v1.5.1)

# v1.5.0

2024-07-05

**🆕 New feature**

- **@visactor/vtable**: add showMoverLine and hideMoverLine api [#2009](https://github.com/VisActor/VTable/issues/2009)
- **@visactor/vtable**: add formatExcelJSCell config in vtable-export [#1989](https://github.com/VisActor/VTable/issues/1989)
- **@visactor/vtable**: optimize package size & add load on demand feature

**🐛 Bug fix**

- **@visactor/vtable**: pivot chart select state [#2017](https://github.com/VisActor/VTable/issues/2017)
- **@visactor/vtable**: disable select and edit input should move when input is outside of table [#2039](https://github.com/VisActor/VTable/issues/2039)
- **@visactor/vtable**: last column resize width error [#2040](https://github.com/VisActor/VTable/issues/2040)
- **@visactor/vtable**: fix test judgement in customMergeCell [#2031](https://github.com/VisActor/VTable/issues/2031)
- **@visactor/vtable**: fix selected highlight update when scrolling [#2028](https://github.com/VisActor/VTable/issues/2028)
- **@visactor/vtable**: fix select-rect update when scroll [#2015](https://github.com/VisActor/VTable/issues/2015)
- **@visactor/vtable**: fix frozen cell update problem in sort [#1997](https://github.com/VisActor/VTable/issues/1997)

[more detail about v1.5.0](https://github.com/VisActor/VTable/releases/tag/v1.5.0)

# v1.4.2

2024-07-05

**🆕 New feature**

- **@visactor/vtable**: corner title can display row and column diemensionTitle [#1926](https://github.com/VisActor/VTable/issues/1926)
- **@visactor/vtable**: add column hide config [#1991](https://github.com/VisActor/VTable/issues/1991)
- **@visactor/vtable**: add getCellAtRelativePosition api

**🐛 Bug fix**

- **@visactor/vtable**: when not exit edit state then can not select other cells [#1974](https://github.com/VisActor/VTable/issues/1974)
- **@visactor/vtable**: selected_clear event trigger [#1981](https://github.com/VisActor/VTable/issues/1981)
- **@visactor/vtable**: pivotTable virtual node edit value not work [#2002](https://github.com/VisActor/VTable/issues/2002)
- **@visactor/vtable**: tooltip content can not be selected [#2003](https://github.com/VisActor/VTable/issues/2003)
- **@visactor/vtable**: fix vrender export module
- **@visactor/vtable**: fix merge cell update performance problem [#1972](https://github.com/VisActor/VTable/issues/1972)
- **@visactor/vtable**: fix regexp format for webpack 3 [#2005](https://github.com/VisActor/VTable/issues/2005)
- **@visactor/vtable**: fix width computation in shrinkSparklineFirst mode

**🔨 Refactor**

- **@visactor/vtable**: sparkline cellType set aggregationType None automatically [#1999](https://github.com/VisActor/VTable/issues/1999)

[more detail about v1.4.2](https://github.com/VisActor/VTable/releases/tag/v1.4.2)

# v1.4.0

2024-06-21

**🆕 New feature**

- **@visactor/vtable**: support corner header cell edit value [#1945](https://github.com/VisActor/VTable/issues/1945)
- **@visactor/vtable**: add indent in vtable-export
- **@visactor/vtable**: add CustomComponent in react-vtable
- **@visactor/vtable**: add CustomLayout component in react-vtable
- **@visactor/vtable**: support calculate field for PivotTable [#1941](https://github.com/VisActor/VTable/issues/1941)

**🐛 Bug fix**

- **@visactor/vtable**: updateSortState api occor error [#1939](https://github.com/VisActor/VTable/issues/1939)
- **@visactor/vtable**: when setRecords should update emptyTip [#1953](https://github.com/VisActor/VTable/issues/1953)
- **@visactor/vtable**: getCellRect api when cell is frozen get bounds error [#1955](https://github.com/VisActor/VTable/issues/1955)
- **@visactor/vtable**: when drag cell and enter edit state but can not exit edit rightly [#1956](https://github.com/VisActor/VTable/issues/1956)
- **@visactor/vtable**: fix custom width problem [#1905](https://github.com/VisActor/VTable/issues/1905)
- **@visactor/vtable**: fix content judgement in getCellRange() [#1911](https://github.com/VisActor/VTable/issues/1911)
- **@visactor/vtable**: fix size update problem in pivot table sort [#1958](https://github.com/VisActor/VTable/issues/1958)

**🔧 Configuration releated**

- **@visactor/vtable**: update vrender version

[more detail about v1.4.0](https://github.com/VisActor/VTable/releases/tag/v1.4.0)

# v1.3.2

2024-06-17

**🆕 New feature**

- **@visactor/vtable**: add blankAreaClickDeselect and outsideClickDeselect config

**🐛 Bug fix**

- **@visactor/vtable**: cellIsInVisualView api error [#1864](https://github.com/VisActor/VTable/issues/1864)
- **@visactor/vtable**: if set style autoWrapText, this config not wort when resize column width [#1892](https://github.com/VisActor/VTable/issues/1892)

**🔨 Refactor**

- **@visactor/vtable**: tooltip support scroll [#1887](https://github.com/VisActor/VTable/issues/1887)
- **@visactor/vtable**: when not records pivot table can show corner header [#1895](https://github.com/VisActor/VTable/issues/1895)
- **@visactor/vtable**: when rowTree children not set value can supplement indicators [#1924](https://github.com/VisActor/VTable/issues/1924)

[more detail about v1.3.2](https://github.com/VisActor/VTable/releases/tag/v1.3.2)

# v1.3.1

2024-06-14

**🐛 Bug fix**

- **@visactor/vtable**: fix frozenColCount large than colCount error [#1872](https://github.com/VisActor/VTable/issues/1872)
- **@visactor/vtable**: fix merge cell size update [#1869](https://github.com/VisActor/VTable/issues/1869)
- **@visactor/vtable**: optimize row height update when useOneRowHeightFillAll

**📖 Site / documentation update**

- **@visactor/vtable**: update changlog of rush

[more detail about v1.3.1](https://github.com/VisActor/VTable/releases/tag/v1.3.1)

# v1.3.0

2024-06-12

**🆕 New feature**

- **@visactor/vtable**: add ignoreIcon&formatExportOutput config in vtable-export [#1813](https://github.com/VisActor/VTable/issues/1813)
- **@visactor/vtable**: add textArea editor
- **@visactor/vtable**: add strokeColor style [#1847](https://github.com/VisActor/VTable/issues/1847)
- **@visactor/vtable**: add dx&dy in title component [#1874](https://github.com/VisActor/VTable/issues/1874)
- **@visactor/vtable**: add shrinkSparklineFirst config [#1862](https://github.com/VisActor/VTable/issues/1862)
- **@visactor/vtable**: tooltip disappear delay time [#1848](https://github.com/VisActor/VTable/issues/1848)
- **@visactor/vtable**: add sort config for pivotTable [#1865](https://github.com/VisActor/VTable/issues/1865)

**🐛 Bug fix**

- **@visactor/vtable**: icon inlineEnd inlineFront x position compute error [#1882](https://github.com/VisActor/VTable/issues/1882)
- **@visactor/vtable**: drill down icon can not be click [#1899](https://github.com/VisActor/VTable/issues/1899)
- **@visactor/vtable**: fix frozenColCount large than colCount error [#1872](https://github.com/VisActor/VTable/issues/1872)
- **@visactor/vtable**: fix ellipsis error in \_disableColumnAndRowSizeRound mode [#1884](https://github.com/VisActor/VTable/issues/1884)

**🔨 Refactor**

- **@visactor/vtable**: memory release logic optimization [#1856](https://github.com/VisActor/VTable/issues/1856)
- **@visactor/vtable**: arrow key with shift ctrl key to select cells [#1873](https://github.com/VisActor/VTable/issues/1873)

[more detail about v1.3.0](https://github.com/VisActor/VTable/releases/tag/v1.3.0)

# v1.2.0

2024-06-06

**🆕 New feature**

- **@visactor/vtable**: support select highlightMode effect [#1167](https://github.com/VisActor/VTable/issues/1167)
- **@visactor/vtable**: add isAggregation api [#1803](https://github.com/VisActor/VTable/issues/1803)
- **@visactor/vtable**: optimize large column performance [#1840](https://github.com/VisActor/VTable/issues/1840) [#1824](https://github.com/VisActor/VTable/issues/1824)
- **@visactor/vtable**: add merge cell custom graphic attribute sync [#1718](https://github.com/VisActor/VTable/issues/1718)

**🐛 Bug fix**

- **@visactor/vtable**: when has no records should not has aggregation row [#1804](https://github.com/VisActor/VTable/issues/1804)
- **@visactor/vtable**: updateColumns set editor error [#1828](https://github.com/VisActor/VTable/issues/1828)
- **@visactor/vtable**: fix maxCharactersNumber effect [#1830](https://github.com/VisActor/VTable/issues/1830)

**🔨 Refactor**

- **@visactor/vtable**: update pixelRatio when resize [#1823](https://github.com/VisActor/VTable/issues/1823)
- **@visactor/vtable**: selectAllOnCtrlA option

**🔧 Configuration releated**

- **@visactor/vtable**: update vrender version

[more detail about v1.2.0](https://github.com/VisActor/VTable/releases/tag/v1.2.0)

# v1.1.2

2024-06-04

**🔧 Configuration releated**

- **@visactor/vtable**: update vrender version

[more detail about v1.1.2](https://github.com/VisActor/VTable/releases/tag/v1.1.2)

# v1.1.1

2024-05-30

**🐛 Bug fix**

- **@visactor/vtable**: when set emptyTip interaction not work well with has records [#1818](https://github.com/VisActor/VTable/issues/1818)
- **@visactor/vtable**: fix table frame corner radius display problem [#1783](https://github.com/VisActor/VTable/issues/1783)

**🔨 Refactor**

- **@visactor/vtable**: dimension value same with indicator key cell value error [#1817](https://github.com/VisActor/VTable/issues/1817)

[more detail about v1.1.1](https://github.com/VisActor/VTable/releases/tag/v1.1.1)

# v1.1.0

2024-05-28

**🆕 New feature**

- **@visactor/vtable**: add empty tip [#1782](https://github.com/VisActor/VTable/issues/1782)

**🐛 Bug fix**

- **@visactor/vtable**: add update delete record api should maintain beforeChangedRecordsMap [#1780](https://github.com/VisActor/VTable/issues/1780)
- **@visactor/vtable**: when set disableSelect table should support drag header [#1800](https://github.com/VisActor/VTable/issues/1800)
- **@visactor/vtable**: fix tree create problem in getDataCellPath()
- **@visactor/vtable**: fix left axis index in horizontal pivot chart

[more detail about v1.1.0](https://github.com/VisActor/VTable/releases/tag/v1.1.0)

# v1.0.3

2024-05-24

**🐛 Bug fix**

- **@visactor/vtable**: first col tree mode compute col width error [#1778](https://github.com/VisActor/VTable/issues/1778)

**🔨 Refactor**

- **@visactor/vtable**: legends support ser array form [#1740](https://github.com/VisActor/VTable/issues/1740)

[more detail about v1.0.3](https://github.com/VisActor/VTable/releases/tag/v1.0.3)

# v1.0.2

2024-05-24

**🆕 New feature**

- **@visactor/vtable**: add setRowHeight&setColWidth api

**🐛 Bug fix**

- **@visactor/vtable**: use table option in hasAutoImageColumn()
- **@visactor/vtable**: axis size align with vrender-component [#1784](https://github.com/VisActor/VTable/issues/1784)
- **@visactor/vtable**: fix lineClamp config in computeRowsHeight() [#1772](https://github.com/VisActor/VTable/issues/1772)
- **@visactor/vtable**: fix progress cell create problem in vtable-export [#1787](https://github.com/VisActor/VTable/issues/1787)
- **@visactor/vtable**: ignore cell merge in selectCells()

[more detail about v1.0.2](https://github.com/VisActor/VTable/releases/tag/v1.0.2)

# v1.0.1

2024-05-23

**🆕 New feature**

- **@visactor/vtable**: tree mode can set icon [#1697](https://github.com/VisActor/VTable/issues/1697)
- **@visactor/vtable**: add setRowHeight&setColWidth api

**🐛 Bug fix**

- **@visactor/vtable**: ignore cell merge in selectCells()

[more detail about v1.0.1](https://github.com/VisActor/VTable/releases/tag/v1.0.1)

# v1.0.0

2024-05-21

**💥 Breaking change**

- **@visactor/vtable**: The result returned by the pivot table getCellOriginRecord interface becomes an array structure.

**🆕 New feature**

- **@visactor/vtable**: rows and tree can combined use [#1644](https://github.com/VisActor/VTable/issues/1644)
- **@visactor/vtable**: add virtual option for rowTree and columnTree [#1644](https://github.com/VisActor/VTable/issues/1644)

[more detail about v1.0.0](https://github.com/VisActor/VTable/releases/tag/v1.0.0)

# v0.25.9

2024-05-21

**🐛 Bug fix**

- **@visactor/vtable**: when body cell is blank string,compute row height error [#1752](https://github.com/VisActor/VTable/issues/1752)
- **@visactor/vtable**: fix custom merge cell display problem when select header

[more detail about v0.25.9](https://github.com/VisActor/VTable/releases/tag/v0.25.9)

# v0.25.8

2024-05-21

**🆕 New feature**

- **@visactor/vtable**: add scrollSliderCornerRadius config [#1369](https://github.com/VisActor/VTable/issues/1369)
- **@visactor/vtable**: add disableBackground & disableBorder in exportCellImg() [#1733](https://github.com/VisActor/VTable/issues/1733)
- **@visactor/vtable**: add disableColumnResize for rowSeriesNumber

**🐛 Bug fix**

- **@visactor/vtable**: when set hideRowHeader, body cell value is blank [#1732](https://github.com/VisActor/VTable/issues/1732)
- **@visactor/vtable**: setTableColumnsEditor occor error when not set columns [#1747](https://github.com/VisActor/VTable/issues/1747)
- **@visactor/vtable**: fix col & row order in cellInRanges()
- **@visactor/vtable**: add string mark in csv-export [#1730](https://github.com/VisActor/VTable/issues/1730)

[more detail about v0.25.8](https://github.com/VisActor/VTable/releases/tag/v0.25.8)

# v0.25.6

2024-05-17

**🆕 New feature**

- **@visactor/vtable**: add selected_clear event [#1705](https://github.com/VisActor/VTable/issues/1705)
- **@visactor/vtable**: add mergeCellInfo arg in event [#1667](https://github.com/VisActor/VTable/issues/1667)

**🐛 Bug fix**

- **@visactor/vtable**: mouse down on scroll rail trigger mousedown_table [#1706](https://github.com/VisActor/VTable/issues/1706)
- **@visactor/vtable**: merge cell value can be edited [#1711](https://github.com/VisActor/VTable/issues/1711)
- **@visactor/vtable**: sub colunms can not be edit when set editor instance [#1711](https://github.com/VisActor/VTable/issues/1711)
- **@visactor/vtable**: fix checkbox and radio state update when change row index [#1712](https://github.com/VisActor/VTable/issues/1712)
- **@visactor/vtable**: fix veritial offset in text stick
- **@visactor/vtable**: fix column width may be zero [#1708](https://github.com/VisActor/VTable/issues/1708)
- **@visactor/vtable**: fix getCell performance
- **@visactor/vtable**: fix header hide func in pivot table
- **@visactor/vtable**: lineDash judgement in group-contribution-render [#1696](https://github.com/VisActor/VTable/issues/1696)
- **@visactor/vtable**: trigger mousedown_table event region need extend [#1668](https://github.com/VisActor/VTable/issues/1668)

[more detail about v0.25.6](https://github.com/VisActor/VTable/releases/tag/v0.25.6)

# v0.25.1

2024-05-08

**🆕 New feature**

- **@visactor/vtable**: pivot chart support wordCloud rose radar gauge [#1614](https://github.com/VisActor/VTable/issues/1614)
- **@visactor/vtable**: pivot chart support scatter chart type [#1618](https://github.com/VisActor/VTable/issues/1618)
- **@visactor/vtable**: add CustomComponent in react-vtable

**🐛 Bug fix**

- **@visactor/vtable**: when copy blank cell paste not work [#1646](https://github.com/VisActor/VTable/issues/1646)
- **@visactor/vtable**: fix custom merge cell size update [#1636](https://github.com/VisActor/VTable/issues/1636)
- **@visactor/vtable**: add selecting cell range deduplication [#1628](https://github.com/VisActor/VTable/issues/1628)
- **@visactor/vtable**: update @visactor/vutils-extension version

[more detail about v0.25.1](https://github.com/VisActor/VTable/releases/tag/v0.25.1)

# v0.25.0

2024-04-28

**🆕 New feature**

- **@visactor/vtable**: pivot table header cell support edit [#1583](https://github.com/VisActor/VTable/issues/1583)
- **@visactor/vtable**: customrender or customlayout support edit [#1596](https://github.com/VisActor/VTable/issues/1596)
- **@visactor/vtable**: add row resize function

**🐛 Bug fix**

- **@visactor/vtable**: editor input value handle with 0value [#1590](https://github.com/VisActor/VTable/issues/1590)
- **@visactor/vtable**: when set textStick init and updateOption text jump [#1592](https://github.com/VisActor/VTable/issues/1592)
- **@visactor/vtable**: clear async contain resize task before render [#1593](https://github.com/VisActor/VTable/issues/1593)
- **@visactor/vtable**: hierarchy state icon can not show when only one level

**🔨 Refactor**

- **@visactor/vtable**: resize last column width can be more flexibly [#1567](https://github.com/VisActor/VTable/issues/1567)

[more detail about v0.25.0](https://github.com/VisActor/VTable/releases/tag/v0.25.0)

# v0.24.1

2024-04-23

**🆕 New feature**

- **@visactor/vtable**: add startEditCell api [#1573](https://github.com/VisActor/VTable/issues/1573)

**🐛 Bug fix**

- **@visactor/vtable**: when has rowSeriesNumber minWidth maxWidth error [#1572](https://github.com/VisActor/VTable/issues/1572)

**🔨 Refactor**

- **@visactor/vtable**: pivot lazy load modify setTreeNodeChildren api [#1580](https://github.com/VisActor/VTable/issues/1580)

**📖 Site / documentation update**

- **@visactor/vtable**: add drill down drill up demo [#1556](https://github.com/VisActor/VTable/issues/1556)

[more detail about v0.24.1](https://github.com/VisActor/VTable/releases/tag/v0.24.1)

# v0.24.0

2024-04-22

**🆕 New feature**

- **@visactor/vtable**: add `radio` cell type, and add setCellCheckboxState & setCellRadioState api [#1504](https://github.com/VisActor/VTable/issues/1504)
- **@visactor/vtable**: add lazy load for pivot table tree [#1521](https://github.com/VisActor/VTable/issues/1521)

**🐛 Bug fix**

- **@visactor/vtable**: handle with editor input ctrl+a event [#1552](https://github.com/VisActor/VTable/issues/1552)
- **@visactor/vtable**: when resize window size the editor input size not match cell size [#1559](https://github.com/VisActor/VTable/issues/1559)
- **@visactor/vtable**: fix multilines new line style [#1531](https://github.com/VisActor/VTable/issues/1531)
- **@visactor/vtable**: fix cell group order in async data [#1517](https://github.com/VisActor/VTable/issues/1517)
- **@visactor/vtable**: add skipCustomMerge in getCellValue() [#1543](https://github.com/VisActor/VTable/issues/1543)

**🔨 Refactor**

- **@visactor/vtable**: optimize performance when row tree node exceed 8000 nodes [#1557](https://github.com/VisActor/VTable/issues/1557)

[more detail about v0.24.0](https://github.com/VisActor/VTable/releases/tag/v0.24.0)

# v0.23.3

2024-04-16

**🆕 New feature**

- **@visactor/vtable**: add widthAdaptiveMode & heightAdaptiveMode config [#1499](https://github.com/VisActor/VTable/issues/1499)
- **@visactor/vtable**: add measureTextBounds api

**🐛 Bug fix**

- **@visactor/vtable**: release editor when release tableInstance [#1495](https://github.com/VisActor/VTable/issues/1495)
- **@visactor/vtable**: short table drag to out table occor error [#1502](https://github.com/VisActor/VTable/issues/1502)
- **@visactor/vtable**: row move funciton not work on mobile [#1503](https://github.com/VisActor/VTable/issues/1503)
- **@visactor/vtable**: defaultHeaderRowHeight not work with rowSeriesNumber [#1520](https://github.com/VisActor/VTable/issues/1520)
- **@visactor/vtable**: tree hierarchy state icon use rowHierarchyTextStartAlignment children node render error [#1525](https://github.com/VisActor/VTable/issues/1525)
- **@visactor/vtable**: resize col width trigger text stick change [#1529](https://github.com/VisActor/VTable/issues/1529)
- **@visactor/vtable**: fix theme textStick config in checkHaveTextStick() [#1490](https://github.com/VisActor/VTable/issues/1490)
- **@visactor/vtable**: add button jedgement in click_cell event [#1484](https://github.com/VisActor/VTable/issues/1484)
- **@visactor/vtable**: fix defalultQueryMethod in vtable-search [#1448](https://github.com/VisActor/VTable/issues/1448)
- **@visactor/vtable**: update customMergeCell in updateOption [#1493](https://github.com/VisActor/VTable/issues/1493)

**🔨 Refactor**

- **@visactor/vtable**: add mousedown_table event [#1470](https://github.com/VisActor/VTable/issues/1470)
- **@visactor/vtable**: setRecords handle with tooltip overflow [#1494](https://github.com/VisActor/VTable/issues/1494)

[more detail about v0.23.3](https://github.com/VisActor/VTable/releases/tag/v0.23.3)

# v0.23.2

2024-04-11

**🆕 New feature**

- **@visactor/vtable**: scrollbar visible focus [#1360](https://github.com/VisActor/VTable/issues/1360)
- **@visactor/vtable**: add rowHierarchyTextStartAlignment for tree mode [#1417](https://github.com/VisActor/VTable/issues/1417)

**🐛 Bug fix**

- **@visactor/vtable**: records api when has merge cell render error [#1286](https://github.com/VisActor/VTable/issues/1286)
- **@visactor/vtable**: add isAutoRowHeight to handle width row height compute [#1379](https://github.com/VisActor/VTable/issues/1379)
- **@visactor/vtable**: chart spec clone filtered dom problem [#1422](https://github.com/VisActor/VTable/issues/1422)
- **@visactor/vtable**: borderlinedash effect error handle with lineCap [#1436](https://github.com/VisActor/VTable/issues/1436)
- **@visactor/vtable**: trigger event selectedCell [#1444](https://github.com/VisActor/VTable/issues/1444)
- **@visactor/vtable**: set disableSelect drag cells occor error [#1461](https://github.com/VisActor/VTable/issues/1461)
- **@visactor/vtable**: left content width error when tree hierarchy state icon back rect showing [#1466](https://github.com/VisActor/VTable/issues/1466)
- **@visactor/vtable**: fix domain order in horizontal [#1453](https://github.com/VisActor/VTable/issues/1453)
- **@visactor/vtable**: add columnWidthComputeMode update in opdateOption [#1465](https://github.com/VisActor/VTable/issues/1465)
- **@visactor/vtable**: fix inline icon tooltip config [#1456](https://github.com/VisActor/VTable/issues/1456)
- **@visactor/vtable**: 修复进度图部分情况遮挡表格边缘单元格
- **@visactor/vtable**: fix transpose border theme [#1463](https://github.com/VisActor/VTable/issues/1463)

**🔨 Refactor**

- **@visactor/vtable**: update drilldown drillup svg
- **@visactor/vtable**: handle width chartSpce with markLine [#1420](https://github.com/VisActor/VTable/issues/1420)
- **@visactor/vtable**: supplement event type for react table [#1434](https://github.com/VisActor/VTable/issues/1434)

[more detail about v0.23.2](https://github.com/VisActor/VTable/releases/tag/v0.23.2)

# v0.23.1

2024-04-07

**🆕 New feature**

- **@visactor/vtable**: select range can extends during scroll [#1400](https://github.com/VisActor/VTable/issues/1400)

**🐛 Bug fix**

- **@visactor/vtable**: maxLineWidth value should consider hierarchyOffset [#1224](https://github.com/VisActor/VTable/issues/1224)
- **@visactor/vtable**: tree leaf node textAlign right render error [#1393](https://github.com/VisActor/VTable/issues/1393)
- **@visactor/vtable**: when copy or paste navigator.clipboard?.write occor undefined error in not https [#1421](https://github.com/VisActor/VTable/issues/1421)
- **@visactor/vtable**: fix header cell imageAutoSizing [#1339](https://github.com/VisActor/VTable/issues/1339)
- **@visactor/vtable**: hide icon background when hide icon
- **@visactor/vtable**: fix nan verticalBarPos [#1232](https://github.com/VisActor/VTable/issues/1232)
- **@visactor/vtable**: fix progressbar cover cell border [#1425](https://github.com/VisActor/VTable/issues/1425)
- **@visactor/vtable**: remove container in table option
- **@visactor/vtable**: add sync render in exportCellImg [#1398](https://github.com/VisActor/VTable/issues/1398)

**🔨 Refactor**

- **@visactor/vtable**: optimize performance when change tree hierarchy state [#1406](https://github.com/VisActor/VTable/issues/1406)

[more detail about v0.23.1](https://github.com/VisActor/VTable/releases/tag/v0.23.1)

# v0.23.0

2024-03-29

**🆕 New feature**

- **@visactor/vtable**: list tree mode support filter [#1376](https://github.com/VisActor/VTable/issues/1376)
- **@visactor/vtable**: add scroll end event and barToSide option [#1304](https://github.com/VisActor/VTable/issues/1304)
- **@visactor/vtable**: add excel options to support fill handle

**🐛 Bug fix**

- **@visactor/vtable**: transpose with frozenColCount shadowline render [#1366](https://github.com/VisActor/VTable/issues/1366)
- **@visactor/vtable**: datasource support promise mode call addRecords and deleteRecords
- **@visactor/vtable**: when click cell should not trigger drag_select_end event [#1410](https://github.com/VisActor/VTable/issues/1410)

[more detail about v0.23.0](https://github.com/VisActor/VTable/releases/tag/v0.23.0)

# v0.22.0

2024-03-22

**🆕 New feature**

- **@visactor/vtable**: support row series number

[more detail about v0.22.0](https://github.com/VisActor/VTable/releases/tag/v0.22.0)

# v0.21.3

2024-03-20

**🐛 Bug fix**

- **@visactor/vtable**: mapping colorMap not work [#1295](https://github.com/VisActor/VTable/issues/1295)
- **@visactor/vtable**: when copy blank cell and paste to cell change to undefined [#1298](https://github.com/VisActor/VTable/issues/1298)
- **@visactor/vtable**: bug datasource lazy load edit cell value invalid [#1302](https://github.com/VisActor/VTable/issues/1302)
- **@visactor/vtable**: fix cell progress create content size
- **@visactor/vtable**: fix row level in getCellAdressByHeaderPath()
- **@visactor/vtable**: use default style in exportCellImg()
- **@visactor/vtable**: fix typeError in getCellMergeRange()

**📖 Site / documentation update**

- **@visactor/vtable**: add list table tree mode guide

[more detail about v0.21.3](https://github.com/VisActor/VTable/releases/tag/v0.21.3)

# v0.21.2

2024-03-14

**🆕 New feature**

- **@visactor/vtable**: add textStickBaseOnAlign config

**🐛 Bug fix**

- **@visactor/vtable**: after change transpose resize line render error [#1239](https://github.com/VisActor/VTable/issues/1239)
- **@visactor/vtable**: pivot tree mode when use headerIcon the indent value invalid [#1269](https://github.com/VisActor/VTable/issues/1269)
- **@visactor/vtable**: fix progress bar rect height

[more detail about v0.21.2](https://github.com/VisActor/VTable/releases/tag/v0.21.2)

# v0.21.1

2024-03-11

**🐛 Bug fix**

- **@visactor/vtable**: merge cell render error with summary and pagination [#1223](https://github.com/VisActor/VTable/issues/1223)

**📖 Site / documentation update**

- **@visactor/vtable**: indicatorsAsCol support indicators display in rows [#1238](https://github.com/VisActor/VTable/issues/1238)

[more detail about v0.21.1](https://github.com/VisActor/VTable/releases/tag/v0.21.1)

# v0.21.0

2024-03-11

**🆕 New feature**

- **@visactor/vtable**: add text measure ment config
- **@visactor/vtable**: add custom cell style function
- **@visactor/vtable**: add cellInnerBorder&cellBorderClipDirection&\_contentOffset in theme comfig
- **@visactor/vtable**: add search component

**🐛 Bug fix**

- **@visactor/vtable**: records change restoreHierarchyState occor error [#1203](https://github.com/VisActor/VTable/issues/1203)
- **@visactor/vtable**: call updatePagination mergeCell render error [#1207](https://github.com/VisActor/VTable/issues/1207)
- **@visactor/vtable**: drag header position cell error [#1220](https://github.com/VisActor/VTable/issues/1220)
- **@visactor/vtable**: fix checkbox text space problem
- **@visactor/vtable**: fix scroll position delta

**🔨 Refactor**

- **@visactor/vtable**: pasteValueToCell can only work on editable cell [#1063](https://github.com/VisActor/VTable/issues/1063)
- **@visactor/vtable**: support underlineDash and underlineOffset [#1132](https://github.com/VisActor/VTable/issues/1132) [#1135](https://github.com/VisActor/VTable/issues/1135)
- **@visactor/vtable**: onStart funciton add col row arguments [#1214](https://github.com/VisActor/VTable/issues/1214)

**✅ Test Case**

- **@visactor/vtable**: add unit test getCellAddressByHeaderPaths

[more detail about v0.21.0](https://github.com/VisActor/VTable/releases/tag/v0.21.0)

# v0.20.2

2024-03-04

**🆕 New feature**

- **@visactor/vtable**: add checkbox style theme

**🐛 Bug fix**

- **@visactor/vtable**: rightFrozenCol is bigger then colCount [#1162](https://github.com/VisActor/VTable/issues/1162)
- **@visactor/vtable**: header description tooltip flicker [#1173](https://github.com/VisActor/VTable/issues/1173)
- **@visactor/vtable**: add fontStyle & fontVariant

[more detail about v0.20.2](https://github.com/VisActor/VTable/releases/tag/v0.20.2)

# v0.20.1

2024-02-29

**🆕 New feature**

- **@visactor/vtable**: add api getRecordIndexByCell [#1121](https://github.com/VisActor/VTable/issues/1121)

**🐛 Bug fix**

- **@visactor/vtable**: hideColumnsSubheader with three levels show error [#1105](https://github.com/VisActor/VTable/issues/1105)
- **@visactor/vtable**: customlayout flex render error [#1163](https://github.com/VisActor/VTable/issues/1163)
- **@visactor/vtable**: when scroll tooltip hide [#905](https://github.com/VisActor/VTable/issues/905)
- **@visactor/vtable**: fix axis innerOffset
- **@visactor/vtable**: add skipFunctionDiff in react-vtable

**🔨 Refactor**

- **@visactor/vtable**: rename resize_column_end event arguments [#1129](https://github.com/VisActor/VTable/issues/1129)
- **@visactor/vtable**: api return value type
- **@visactor/vtable**: setRecords support restoreHierarchyState [#1148](https://github.com/VisActor/VTable/issues/1148)
- **@visactor/vtable**: vtable not stop event bubble [#892](https://github.com/VisActor/VTable/issues/892)
- **@visactor/vtable**: remove Circular dependency

**🔖 other**

- **@visactor/vtable**: fix-contextMenuItems-add-col-param

[more detail about v0.20.1](https://github.com/VisActor/VTable/releases/tag/v0.20.1)

# v0.20.0

2024-02-23

**🆕 New feature**

- **@visactor/vtable**: add aggregation for list table column
- **@visactor/vtable**: add api getAggregateValuesByField
- **@visactor/vtable**: add custom aggregation
- **@visactor/vtable**: chartSpec support function [#1115](https://github.com/VisActor/VTable/issues/1115)
- **@visactor/vtable**: add filter data config [#607](https://github.com/VisActor/VTable/issues/607)

**🐛 Bug fix**

- **@visactor/vtable**: edit right frozen cell input position error
- **@visactor/vtable**: mouseleave_cell event trigger [#1112](https://github.com/VisActor/VTable/issues/1112)
- **@visactor/vtable**: fix cellBgColor judgement in isCellHover()
- **@visactor/vtable**: fix custom merge cell computed height&width
- **@visactor/vtable**: fix content position update problem
- **@visactor/vtable**: merge cell update in setDropDownMenuHighlight()
- **@visactor/vtable**: fix react-vtable display error in react strict mode [#990](https://github.com/VisActor/VTable/issues/990)

[more detail about v0.20.0](https://github.com/VisActor/VTable/releases/tag/v0.20.0)

# v0.19.1

2024-02-06

**🆕 New feature**

- **@visactor/vtable**: add update sort rule api
- **@visactor/vtable**: add axis innerOffset config
- **@visactor/vtable**: add name config in customRender

**🐛 Bug fix**

- **@visactor/vtable**: when table has scroll then click header to edit position error [#1069](https://github.com/VisActor/VTable/issues/1069)
- **@visactor/vtable**: fix column cell order problem in sync mode
- **@visactor/vtable**: fix border lineDash in cell group [#1051](https://github.com/VisActor/VTable/issues/1051)
- **@visactor/vtable**: fix textAlign value in width update[#1065](https://github.com/VisActor/VTable/issues/1065)
- **@visactor/vtable**: fix merge cell content position
- **@visactor/vtable**: fix merge cell update problem

**🔨 Refactor**

- **@visactor/vtable**: pivot table sort logic [#1033](https://github.com/VisActor/VTable/issues/1033)
- **@visactor/vtable**: showsort option work well [#1077](https://github.com/VisActor/VTable/issues/1077)

[more detail about v0.19.1](https://github.com/VisActor/VTable/releases/tag/v0.19.1)

# v0.19.0

2024-02-02

**🆕 New feature**

- **@visactor/vtable**: support get sorted columns [#986](https://github.com/VisActor/VTable/issues/986)
- **@visactor/vtable**: add option frozenColDragHeaderMode

**🐛 Bug fix**

- **@visactor/vtable**: select region saved problem [#1018](https://github.com/VisActor/VTable/issues/1018)
- **@visactor/vtable**: when call updateColumns and discount col occor error [#1015](https://github.com/VisActor/VTable/issues/1015)
- **@visactor/vtable**: rightFrozenColCount drag header move more time the column width is error [#1019](https://github.com/VisActor/VTable/issues/1019)
- **@visactor/vtable**: empty string compute row height error [#1031](https://github.com/VisActor/VTable/issues/1031)
- **@visactor/vtable**: fix merge image cell update problem

**🔨 Refactor**

- **@visactor/vtable**: when drag header move to frozen region then markLine show positon
- **@visactor/vtable**: optimize updateRow api performance & resize bottom frozen row not right

[more detail about v0.19.0](https://github.com/VisActor/VTable/releases/tag/v0.19.0)

# v0.18.3

2024-01-25

**🐛 Bug fix**

- **@visactor/vtable**: click outside of cells click cancel select state

[more detail about v0.18.3](https://github.com/VisActor/VTable/releases/tag/v0.18.3)

# v0.18.2

2024-01-24

**🆕 New feature**

- **@visactor/vtable**: add component update

**🐛 Bug fix**

- **@visactor/vtable**: fix rowHeaderGroup attribute y when has no colHeaderGroup [#971](https://github.com/VisActor/VTable/issues/971)
- **@visactor/vtable**: transpose bottomFrozenRow cell layout error [#978](https://github.com/VisActor/VTable/issues/978)
- **@visactor/vtable**: passte value to last row occur error [#979](https://github.com/VisActor/VTable/issues/979)
- **@visactor/vtable**: use updateColumns api click state not right [#975](https://github.com/VisActor/VTable/issues/975)
- **@visactor/vtable**: record has nan string value pivotchart cell value parse handle this case [#993](https://github.com/VisActor/VTable/issues/993)
- **@visactor/vtable**: row Height compute for axis
- **@visactor/vtable**: fix deltaY col number in moveCell()

[more detail about v0.18.2](https://github.com/VisActor/VTable/releases/tag/v0.18.2)

# v0.18.0

2024-01-19

**🆕 New feature**

- **@visactor/vtable**: pivotchart support pie
- **@visactor/vtable**: add customLayout & customRander in customMergeCell
- **@visactor/vtable**: add eventOptions [#914](https://github.com/VisActor/VTable/issues/914)

**🐛 Bug fix**

- **@visactor/vtable**: handle with chartSpec barWidth set string type
- **@visactor/vtable**: addRecords api call when body no data [#953](https://github.com/VisActor/VTable/issues/953)
- **@visactor/vtable**: mouse drag to move Header position has error when column has multi-levels [#957](https://github.com/VisActor/VTable/issues/957)
- **@visactor/vtable**: when resize column width bottomFrozenRow height should update [#954](https://github.com/VisActor/VTable/issues/954)

[more detail about v0.18.0](https://github.com/VisActor/VTable/releases/tag/v0.18.0)

# v0.17.10

2024-01-18

**🆕 New feature**

- **@visactor/vtable**: use vrender-core

**🐛 Bug fix**

- **@visactor/vtable**: select border range error [#911](https://github.com/VisActor/VTable/issues/911)
- **@visactor/vtable**: when enable pasteValueToCell and event change_cell_value arguments is error [#919](https://github.com/VisActor/VTable/issues/919)
- **@visactor/vtable**: fix tree structure auto merge update problem
- **@visactor/vtable**: toggele tree node updateChartSize

[more detail about v0.17.10](https://github.com/VisActor/VTable/releases/tag/v0.17.10)

# v0.17.9

2024-01-18

**🆕 New feature**

- **@visactor/vtable**: support excel data paste to cells [#857](https://github.com/VisActor/VTable/issues/857)
- **@visactor/vtable**: add api getCellAddressByRecord
- **@visactor/vtable**: optimize getCellHeaderPath function

**🐛 Bug fix**

- **@visactor/vtable**: showSubTotals can not work [#893](https://github.com/VisActor/VTable/issues/893)
- **@visactor/vtable**: set display:none trigger resize logic
- **@visactor/vtable**: fix right frozen cell location

[more detail about v0.17.9](https://github.com/VisActor/VTable/releases/tag/v0.17.9)

# v0.17.8

2024-01-17

**🐛 Bug fix**

- **@visactor/vtable**: selectRange error when near frozencol or frozenrow [#854](https://github.com/VisActor/VTable/issues/854)
- **@visactor/vtable**: frozen shadowline should move position [#859](https://github.com/VisActor/VTable/issues/859)
- **@visactor/vtable**: fix chart cell dblclick size update
- **@visactor/vtable**: fix bottom frozen row height compute in createGroupForFirstScreen()
- **@visactor/vtable**: fix cellGroup merge range
- **@visactor/vtable**: fix react custom jsx parse

[more detail about v0.17.8](https://github.com/VisActor/VTable/releases/tag/v0.17.8)

# v0.17.7

2024-01-05

**🆕 New feature**

- **@visactor/vtable**: add cell image table export

**🐛 Bug fix**

- **@visactor/vtable**: fix jsx parse error in react-vtable

[more detail about v0.17.7](https://github.com/VisActor/VTable/releases/tag/v0.17.7)

# v0.17.6

2024-01-04

**🐛 Bug fix**

- **@visactor/vtable**: fix resize line position

[more detail about v0.17.6](https://github.com/VisActor/VTable/releases/tag/v0.17.6)

# v0.17.5

2024-01-04

**🆕 New feature**

- **@visactor/vtable**: support edit header title [#819](https://github.com/VisActor/VTable/issues/819)
- **@visactor/vtable**: add api getCellHeaderTreeNodes for pivotTable [#839](https://github.com/VisActor/VTable/issues/839)

**🐛 Bug fix**

- **@visactor/vtable**: setRecords process scrollTop update scenegraph [#831](https://github.com/VisActor/VTable/issues/831)
- **@visactor/vtable**: add group clip in body

**🔨 Refactor**

- **@visactor/vtable**: list table bottom row can not use bottomFrozenStyle [#836](https://github.com/VisActor/VTable/issues/836)
- **@visactor/vtable**: add onVChartEvent for BaseTable [#843](https://github.com/VisActor/VTable/issues/843)

[more detail about v0.17.5](https://github.com/VisActor/VTable/releases/tag/v0.17.5)

# v0.17.3

2024-01-01

**🆕 New feature**

- **@visactor/vtable**: add body index convert with table index [#789](https://github.com/VisActor/VTable/issues/789)
- **@visactor/vtable**: mergeCell support custom compare function [#804](https://github.com/VisActor/VTable/issues/804)
- **@visactor/vtable**: add column resize label theme

**🐛 Bug fix**

- **@visactor/vtable**: setRecords lose hover state [#783](https://github.com/VisActor/VTable/issues/783)
- **@visactor/vtable**: transpose list demo when records has 10000 performance problem [#790](https://github.com/VisActor/VTable/issues/790)
- **@visactor/vtable**: setRecords recomputeColWidth problems [#796](https://github.com/VisActor/VTable/issues/796)
- **@visactor/vtable**: set disableSelect drag interaction occor error [#799](https://github.com/VisActor/VTable/issues/799)
- **@visactor/vtable**: tooltip style not work [#805](https://github.com/VisActor/VTable/issues/805)
- **@visactor/vtable**: pivot table pagination.perPageCount modify [#807](https://github.com/VisActor/VTable/issues/807)
- **@visactor/vtable**: [Bug] adaptive mode compute problem when has frozencol and rightFrozenCol [#820](https://github.com/VisActor/VTable/issues/820)
- **@visactor/vtable**: fix axis render update problem
- **@visactor/vtable**: fix select update when change frozen
- **@visactor/vtable**: pivot table use icon bug
- **@visactor/vtable**: fix sort icon update

**🔨 Refactor**

- **@visactor/vtable**: update vrender event verison use scrollDrag

**🔧 Configuration releated**

- **@visactor/vtable**: update vrender version [#785](https://github.com/VisActor/VTable/issues/785)

[more detail about v0.17.3](https://github.com/VisActor/VTable/releases/tag/v0.17.3)

# v0.17.2

2023-12-21

**🐛 Bug fix**

- **@visactor/vtable**: edit bug [#771](https://github.com/VisActor/VTable/issues/771)
- **@visactor/vtable**: add row height round in resetRowHeight

[more detail about v0.17.2](https://github.com/VisActor/VTable/releases/tag/v0.17.2)

# v0.17.1

2023-12-21

**🆕 New feature**

- **@visactor/vtable**: add arrowkeys interaction [#646](https://github.com/VisActor/VTable/issues/646)

**🐛 Bug fix**

- **@visactor/vtable**: stopPropagation effect doubletap
- **@visactor/vtable**: dropdown_menu_click trigger [#760](https://github.com/VisActor/VTable/issues/760)
- **@visactor/vtable**: dblclick occur error [#758](https://github.com/VisActor/VTable/issues/758)
- **@visactor/vtable**: fix richtext error in getCellOverflowText()
- **@visactor/vtable**: add scrollBar event to call completeEdit [#710](https://github.com/VisActor/VTable/issues/710)
- **@visactor/vtable**: support tree mode adaptive
- **@visactor/vtable**: fix dropdown icon display error
- **@visactor/vtable**: fix right frozen columns width update problem

**🔨 Refactor**

- **@visactor/vtable**: 100W records scroll performance optimize when has select Cell [#681](https://github.com/VisActor/VTable/issues/681)
- **@visactor/vtable**: remove default sort rule for pivot table [#759](https://github.com/VisActor/VTable/issues/759)

**📖 Site / documentation update**

- **@visactor/vtable**: update changlog of rush

[more detail about v0.17.1](https://github.com/VisActor/VTable/releases/tag/v0.17.1)

# v0.17.0

2023-12-15

**🆕 New feature**

- **@visactor/vtable**: add option showGrandTotalsOnTop [#650](https://github.com/VisActor/VTable/issues/650)
- **@visactor/vtable**: optimize diffCellIndices in toggleHierarchyState()
- **@visactor/vtable**: add disableAxisHover config
- **@visactor/vtable**: optimize computeTextWidth() in pivot table

**🐛 Bug fix**

- **@visactor/vtable**: fix right frozen adaptive problem
- **@visactor/vtable**: fix disableHover bottom frozen hover error
- **@visactor/vtable**: fix rowUpdatePos update in updateRow()

**🔨 Refactor**

- **@visactor/vtable**: dropdownMenu hide [#727](https://github.com/VisActor/VTable/issues/727)

[more detail about v0.17.0](https://github.com/VisActor/VTable/releases/tag/v0.17.0)

# v0.16.3

2023-12-14

**🆕 New feature**

- **@visactor/vtable**: add enableCellPadding config in custom layout
- **@visactor/vtable**: add column disableHover&disableSelect config

**🐛 Bug fix**

- **@visactor/vtable**: fix axis theme get function
- **@visactor/vtable**: pivot table support not number type [#718](https://github.com/VisActor/VTable/issues/718)
- **@visactor/vtable**: edge cell selection border clip [#716](https://github.com/VisActor/VTable/issues/716)

[more detail about v0.16.3](https://github.com/VisActor/VTable/releases/tag/v0.16.3)

# v0.16.2

2023-12-14

**🐛 Bug fix**

- **@visactor/vtable**: blank cell edit invalid on pivottbale [#712](https://github.com/VisActor/VTable/issues/712)
- **@visactor/vtable**: data lazy load when drag header position [#705](https://github.com/VisActor/VTable/issues/705)

**🔨 Refactor**

- **@visactor/vtable**: pivot table format arguments

**📖 Site / documentation update**

- **@visactor/vtable**: pivot table format usage update

[more detail about v0.16.2](https://github.com/VisActor/VTable/releases/tag/v0.16.2)

# v0.16.0

2023-12-08

**🆕 New feature**

- **@visactor/vtable**: axis support chart padding config
- **@visactor/vtable**: optimize pivot header performance
- **@visactor/vtable**: add axis theme
- **@visactor/vtable**: overlay default and hover colors
- **@visactor/vtable**: add api addRecords

**🐛 Bug fix**

- **@visactor/vtable**: updateOption to update updateEventBinder
- **@visactor/vtable**: columnResizeType: all invalid
- **@visactor/vtable**: fix tree structure bottom frozen update
- **@visactor/vtable**: fix limit column width adaptive update
- **@visactor/vtable**: fix table range when container resize
- **@visactor/vtable**: fix table frame shadow color
- **@visactor/vtable**: fix scroll position update problem

**📖 Site / documentation update**

- **@visactor/vtable**: refix lineheight description

[more detail about v0.16.0](https://github.com/VisActor/VTable/releases/tag/v0.16.0)

# v0.15.4

2023-12-01

**🐛 Bug fix**

- **@visactor/vtable**: editor object set in column be cloned
- **@visactor/vtable**: fix theme style get problem
- **@visactor/vtable**: fix list table frozen hover color
- **@visactor/vtable**: fix right bottom frozen cell in getCellRect()
- **@visactor/vtable**: fix table resize problem when column width limit
- **@visactor/vtable**: fix custom render renderDefault auto size problem
- **@visactor/vtable**: fix columnWidthComputeMode config problem
- **@visactor/vtable**: release tableInstance after resize event trigger
- **@visactor/vtable**: columnWidthComputeMode only-header

**🔨 Refactor**

- **@visactor/vtable**: ts define optimize

[more detail about v0.15.4](https://github.com/VisActor/VTable/releases/tag/v0.15.4)

# v0.15.3

2023-12-01

**🆕 New feature**

- **@visactor/vtable**: add setRecordChildren to lazy load tree node
- **@visactor/vtable**: pivot table support editable

**🐛 Bug fix**

- **@visactor/vtable**: fix cornerCellStyle update
- **@visactor/vtable**: fix chart item select problem
- **@visactor/vtable**: fix bottom left frozen cell style

[more detail about v0.15.3](https://github.com/VisActor/VTable/releases/tag/v0.15.3)

# v0.15.1

2023-11-28

**🐛 Bug fix**

- **@visactor/vtable**: drag select first cell seleted repeatly [#611](https://github.com/VisActor/VTable/issues/611)
- **@visactor/vtable**: no indicators pivotchart render
- **@visactor/vtable**: compute chart column width use Math.ceil bandSpace

**🔨 Refactor**

- **@visactor/vtable**: sortState can not work when column has no sort setting [#622](https://github.com/VisActor/VTable/issues/622)
- **@visactor/vtable**: remove keydown event arguments cells
- **@visactor/vtable**: rename maneger to manager

**📖 Site / documentation update**

- **@visactor/vtable**: add api getCellCheckboxState

[more detail about v0.15.1](https://github.com/VisActor/VTable/releases/tag/v0.15.1)

# v0.15.0

2023-11-24

**🆕 New feature**

- **@visactor/vtable**: add event copy_data [#551](https://github.com/VisActor/VTable/issues/551)
- **@visactor/vtable**: add column with min limit [#590](https://github.com/VisActor/VTable/issues/590)
- **@visactor/vtable**: edit text value with inputEditor
- **@visactor/vtable**: add react-vtable

**🐛 Bug fix**

- **@visactor/vtable**: compute col width when large count col with sampling the frozen bottom rows is not computed
- **@visactor/vtable**: fix cell position mismatch problems when bodyRowCount is 0 [#596](https://github.com/VisActor/VTable/issues/596)
- **@visactor/vtable**: fix text mark x in updateCell()

**🔖 other**

- **@visactor/vtable**: fix/fix cell role judgement in updateCellGroupContent()

[more detail about v0.15.0](https://github.com/VisActor/VTable/releases/tag/v0.15.0)

# v0.14.2

2023-11-16

**🐛 Bug fix**

- **@visactor/vtable**: row header select bound wrong [#572](https://github.com/VisActor/VTable/issues/572)
- **@visactor/vtable**: selectHeader copy data

[more detail about v0.14.2](https://github.com/VisActor/VTable/releases/tag/v0.14.2)

# v0.14.1

2023-11-13

**🔨 Refactor**

- **@visactor/vtable**: when drag to canvas blank area to end select [#556](https://github.com/VisActor/VTable/issues/556)

[more detail about v0.14.1](https://github.com/VisActor/VTable/releases/tag/v0.14.1)

# v0.14.0

2023-11-10

**🆕 New feature**

- **@visactor/vtable**: add jsx support in custom layout
- **@visactor/vtable**: refactor merge cell strategy
- **@visactor/vtable**: add functionial tickCount config in axis
- **@visactor/vtable**: update customLayout api

[more detail about v0.14.0](https://github.com/VisActor/VTable/releases/tag/v0.14.0)

# v0.13.4

2023-11-08

**🆕 New feature**

- **@visactor/vtable**: add option overscrollBehavior

**🐛 Bug fix**

- **@visactor/vtable**: drag select out tablecell getSelectCellInfos null
- **@visactor/vtable**: select border render error when frozen bottom row [#508](https://github.com/VisActor/VTable/issues/508)

**🔨 Refactor**

- **@visactor/vtable**: change styleElement add targetDom

[more detail about v0.13.4](https://github.com/VisActor/VTable/releases/tag/v0.13.4)

# v0.13.3

2023-11-03

**🐛 Bug fix**

- **@visactor/vtable**: fix frozen shadow update in tree mode [#525](https://github.com/VisActor/VTable/issues/525)

[more detail about v0.13.3](https://github.com/VisActor/VTable/releases/tag/v0.13.3)
