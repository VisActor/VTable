# v0.17.8

undefined

**🐛 Bug fix**
- **@visactor/vtable**: selectRange error when near frozencol or frozenrow [#854](https://github.com/VisActor/VTable/issues/854)
- **@visactor/vtable**:  frozen shadowline should move position [#859](https://github.com/VisActor/VTable/issues/859)
- **@visactor/vtable**: fix chart cell dblclick size update
- **@visactor/vtable**: fix bottom frozen row height compute in createGroupForFirstScreen()
- **@visactor/vtable**: fix cellGroup merge range
- **@visactor/vtable**: fix react custom jsx parse

[more detail about v0.17.8](https://github.com/VisActor/VTable/releases/tag/untagged-9e3a48457d9822768273)

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

# v0.17.4

undefined

**🐛 Bug fix**
- **@visactor/vtable**: fix frozen chart cell active problem

[more detail about v0.17.4](https://github.com/VisActor/VTable/releases/tag/untagged-c251569adf257751690b)

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

# v0.16.1

undefined

**🐛 Bug fix**
- **@visactor/vtable**: add min first screen limit

[more detail about v0.16.1](https://github.com/VisActor/VTable/releases/tag/untagged-291b8cef3ef13482bcbc)

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

# v0.15.5

undefined

**🆕 New feature**
- **@visactor/vtable**: axis support chart padding config
- **@visactor/vtable**: optimize pivot header performance
- **@visactor/vtable**: add axis theme
- **@visactor/vtable**: overlay default and hover colors
**🐛 Bug fix**
- **@visactor/vtable**: updateOption to update updateEventBinder
- **@visactor/vtable**: fix tree structure bottom frozen update
- **@visactor/vtable**: fix limit column width adaptive update
- **@visactor/vtable**: fix table range when container resize
- **@visactor/vtable**: fix table frame shadow color
- **@visactor/vtable**: fix scroll position update problem

[more detail about v0.15.5](https://github.com/VisActor/VTable/releases/tag/untagged-0108f934e97737593d25)

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

# v0.15.2

undefined

**🐛 Bug fix**
- **@visactor/vtable**: fix merge cell checkbox update

[more detail about v0.15.2](https://github.com/VisActor/VTable/releases/tag/untagged-791f8c264eaeb68d6a6e)

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

# v0.14.3

undefined

**🐛 Bug fix**
- **@visactor/vtable**: select_border_clip
**🔨 Refactor**
- **@visactor/vtable**: add dpr argument when init vchart [#570](https://github.com/VisActor/VTable/issues/570)

[more detail about v0.14.3](https://github.com/VisActor/VTable/releases/tag/untagged-b66db662b4a5fdeb46e0)

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

# v0.13.5

undefined

**🆕 New feature**
- **@visactor/vtable**: refactor merge cell strategy
- **@visactor/vtable**: add functionial tickCount config in axis
- **@visactor/vtable**: update customLayout api

[more detail about v0.13.5](https://github.com/VisActor/VTable/releases/tag/untagged-55948cfc631c5742a28c)

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

# v0.13.2

undefined

**🆕 New feature**
- **@visactor/vtable**: add decode for react jsx customLayout
**🐛 Bug fix**
- **@visactor/vtable**: getCellByCache maximum call stack size exceeded
- **@visactor/vtable**: event trigger selected_cell drag_select_end change_header_position
- **@visactor/vtable**: axis label sort not right [#503](https://github.com/VisActor/VTable/issues/503)
- **@visactor/vtable**: over 100 columns after init scroll right now columns attribute Xvalue error [#506](https://github.com/VisActor/VTable/issues/506)
**🔨 Refactor**
- **@visactor/vtable**: save select when click outside table [#478](https://github.com/VisActor/VTable/issues/478)

[more detail about v0.13.2](https://github.com/VisActor/VTable/releases/tag/untagged-0a7b4188c4d4c74ff1fd)

# v0.13.2

2023-11-03

**🆕 New feature**
- **@visactor/vtable**: add decode for react jsx customLayout
**🐛 Bug fix**
- **@visactor/vtable**: getCellByCache maximum call stack size exceeded
- **@visactor/vtable**: event trigger selected_cell drag_select_end change_header_position
- **@visactor/vtable**: axis label sort not right [#503](https://github.com/VisActor/VTable/issues/503)
- **@visactor/vtable**: over 100 columns after init scroll right now columns attribute Xvalue error [#506](https://github.com/VisActor/VTable/issues/506)
**🔨 Refactor**
- **@visactor/vtable**: save select when click outside table [#478](https://github.com/VisActor/VTable/issues/478)



[more detail about v0.13.2](https://github.com/VisActor/VTable/releases/tag/v0.13.2)

# v0.12.2

undefined

**🐛 Bug fix**
- **@visactor/vtable**: init listtable with blank columns occur error [#405](https://github.com/VisActor/VTable/issues/405)
**📖 Site / documentation update**
- **@visactor/vtable**: add option to all demos

[more detail about v0.12.2](https://github.com/VisActor/VTable/releases/tag/untagged-791536aa047e2c813114)

# v0.12.1

undefined

**🆕 New feature**
- **@visactor/vtable**: support use custom data as summary data [#400](https://github.com/VisActor/VTable/issues/400)
**🐛 Bug fix**
- **@visactor/vtable**: analysis pivot tree summary value is wrong
- **@visactor/vtable**: when set description can show not to consider tooltip.isShowOverflowTextTooltip [#407](https://github.com/VisActor/VTable/issues/407)
- **@visactor/vtable**: fix axis zero align error in updateOption()
**📖 Site / documentation update**
- **@visactor/vtable**: add analysis rules demos

[more detail about v0.12.1](https://github.com/VisActor/VTable/releases/tag/untagged-32138b5e26e30dc195d5)

