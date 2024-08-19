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
- **@visactor/vtable**: add tolerance for scroll in _disableColumnAndRowSizeRound mode



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
- **@visactor/vtable**: fix ellipsis error in _disableColumnAndRowSizeRound mode [#1884](https://github.com/VisActor/VTable/issues/1884)

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

- **@visactor/vtable**: tree mode  can set icon [#1697](https://github.com/VisActor/VTable/issues/1697)
- **@visactor/vtable**: add setRowHeight&setColWidth api

**🐛 Bug fix**

- **@visactor/vtable**: ignore cell merge in selectCells()



[more detail about v1.0.1](https://github.com/VisActor/VTable/releases/tag/v1.0.1)

# v1.0.0

2024-05-21

**💥 Breaking change**

- **@visactor/vtable**: The result returned by the pivot table getCellOriginRecord interface becomes an array structure.

**🆕 New feature**

- **@visactor/vtable**: rows and tree can  combined use  [#1644](https://github.com/VisActor/VTable/issues/1644)
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
- **@visactor/vtable**: add disableBackground &  disableBorder in exportCellImg() [#1733](https://github.com/VisActor/VTable/issues/1733)
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

- **@visactor/vtable**: resize last column width can be more  flexibly [#1567](https://github.com/VisActor/VTable/issues/1567)



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
- **@visactor/vtable**: fix domain order in  horizontal [#1453](https://github.com/VisActor/VTable/issues/1453)
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
