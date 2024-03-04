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
- **@visactor/vtable**:  transpose bottomFrozenRow cell layout error [#978](https://github.com/VisActor/VTable/issues/978)
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
- **@visactor/vtable**:  frozen shadowline should move position [#859](https://github.com/VisActor/VTable/issues/859)
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

- **@visactor/vtable**: setRecords lose hover state  [#783](https://github.com/VisActor/VTable/issues/783)
- **@visactor/vtable**:  transpose list demo when records has 10000 performance problem [#790](https://github.com/VisActor/VTable/issues/790)
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

- **@visactor/vtable**: add option showGrandTotalsOnTop  [#650](https://github.com/VisActor/VTable/issues/650)
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

