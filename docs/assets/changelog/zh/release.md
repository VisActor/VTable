# v1.5.6

2024-08-08


**🆕 新增功能**

- **@visactor/vtable**: add canvas & viewbox config

**🐛 功能修复**

- **@visactor/vtable**: fix released async problem [#2145](https://github.com/VisActor/VTable/issues/2145)



[更多详情请查看 v1.5.6](https://github.com/VisActor/VTable/releases/tag/v1.5.6)

# v1.5.4

2024-08-02


**🆕 新增功能**

- **@visactor/vtable**: 透视表角表头单元格支持图标配置 [#2120](https://github.com/VisActor/VTable/issues/2120)
- **@visactor/vtable**: 支持将 editCellTrigger 设置为 keydown [#2136](https://github.com/VisActor/VTable/issues/2136)
- **@visactor/vtable**: 为 option-emptyTip 添加 React 组件
- **@visactor/vtable**: 为 option-emptyTip 添加 React 组件 - 示例
- **@visactor/vtable**: 在 csv-exporter 中添加转义配置
- **@visactor/vtable**: 在 theme.selectionStyle 中添加 selectionFillMode 配置 [#2132](https://github.com/VisActor/VTable/issues/2132) [#2027](https://github.com/VisActor/VTable/issues/2027)

**🐛 功能修复**

- **@visactor/vtable**: 设置排序规则时出现错误 [#2106](https://github.com/VisActor/VTable/issues/2106)
- **@visactor/vtable**: clearSelected API 清除 ctrl+a 边框 [#2115](https://github.com/VisActor/VTable/issues/2115)
- **@visactor/vtable**: 修复移动表头位置不生效且不触发 change_header_position 事件 [#2129](https://github.com/VisActor/VTable/issues/2129)
- **@visactor/vtable**: 当 cellType 设置为函数时，调整列宽导致图表大小渲染错误 [#2160](https://github.com/VisActor/VTable/issues/2160)
- **@visactor/vtable**: 调用 setRowHeight 时应更新图表大小 [#2155](https://github.com/VisActor/VTable/issues/2155)
- **@visactor/vtable**: 修复更新记录时单元格范围清除问题
- **@visactor/vtable**: 修复自定义元素更新问题 [#2126](https://github.com/VisActor/VTable/issues/2126)
- **@visactor/vtable**: 修复自定义合并单元格更新
- **@visactor/vtable**: 修复 CellContent 可拾取配置 [#2134](https://github.com/VisActor/VTable/issues/2134)
- **@visactor/vtable**: 修复图例可见性配置 [#2137](https://github.com/VisActor/VTable/issues/2137)
- **@visactor/vtable**: 修复释放异步问题 [#2145](https://github.com/VisActor/VTable/issues/2145)
- **@visactor/vtable**: 在 endResizeCol() 中移除调整大小更新 [#2101](https://github.com/VisActor/VTable/issues/2101)

[更多详情请查看 v1.5.4](https://github.com/VisActor/VTable/releases/tag/v1.5.4)

# v1.5.3

2024-07-19


**🆕 新增功能**

- **@visactor/vtable**: 为 startEditCell API 添加默认参数 value [#2089](https://github.com/VisActor/VTable/issues/2089)

**🐛 功能修复**

- **@visactor/vtable**: 修复 vtable-export 中的选项配置



[更多详情请查看 v1.5.3](https://github.com/VisActor/VTable/releases/tag/v1.5.3)

# v1.5.2

2024-07-15


**🆕 新增功能**

- **@visactor/vtable**: 添加 disableScroll 和 enableScroll API [#2073](https://github.com/VisActor/VTable/issues/2073)
- **@visactor/vtable**: 在 react customLayout 组件中添加 renderDefault 属性
- **@visactor/vtable**: 在 react-vtable 中支持多列标签

**🐛 功能修复**

- **@visactor/vtable**: edit 相关 API validateValue 支持异步
- **@visactor/vtable**: 当记录包含 null 时，API changeFieldValue 出现错误 [#2067](https://github.com/VisActor/VTable/issues/2067)
- **@visactor/vtable**: 修复 updateCell() 中的 react 组件错误 [#2038](https://github.com/VisActor/VTable/issues/2038)
- **@visactor/vtable**: 修复散点图中的坐标轴默认配置 [#2071](https://github.com/VisActor/VTable/issues/2071)



[更多详情请查看 v1.5.2](https://github.com/VisActor/VTable/releases/tag/v1.5.2)

# v1.5.1

2024-07-10


**🐛 功能修复**

- **@visactor/vtable**: 修复 getCellAtRelativePosition API 返回值 [#2054](https://github.com/VisActor/VTable/issues/2054)
- **@visactor/vtable**: 在 _disableColumnAndRowSizeRound 模式下为滚动添加容差



[更多详情请查看 v1.5.1](https://github.com/VisActor/VTable/releases/tag/v1.5.1)

# v1.5.0

2024-07-05


**🆕 新增功能**

- **@visactor/vtable**: 添加 showMoverLine 和 hideMoverLine API [#2009](https://github.com/VisActor/VTable/issues/2009)
- **@visactor/vtable**: 在 vtable-export 中添加 formatExcelJSCell 配置 [#1989](https://github.com/VisActor/VTable/issues/1989)
- **@visactor/vtable**: 优化包大小并添加按需加载功能

**🐛 功能修复**

- **@visactor/vtable**: 修复数据透视图选择状态问题 [#2017](https://github.com/VisActor/VTable/issues/2017)
- **@visactor/vtable**: 修复输入框在表格外时选中进入编辑状态后表格移动的问题 [#2039](https://github.com/VisActor/VTable/issues/2039)
- **@visactor/vtable**: 修复最后一列调整宽度错误 [#2040](https://github.com/VisActor/VTable/issues/2040)
- **@visactor/vtable**: 修复自定义合并单元格的测试判断问题 [#2031](https://github.com/VisActor/VTable/issues/2031)
- **@visactor/vtable**: 修复滚动时选中高亮更新问题 [#2028](https://github.com/VisActor/VTable/issues/2028)
- **@visactor/vtable**: 修复滚动时选择矩形框更新问题 [#2015](https://github.com/VisActor/VTable/issues/2015)
- **@visactor/vtable**: 修复排序中冻结单元格更新问题 [#1997](https://github.com/VisActor/VTable/issues/1997)

[更多详情请查看 v1.5.0](https://github.com/VisActor/VTable/releases/tag/v1.5.0)

# v1.4.2

2024-07-05

**🆕 新增功能**

- **@visactor/vtable**: 角头标题可以显示行和列的维度标题 [#1926](https://github.com/VisActor/VTable/issues/1926)
- **@visactor/vtable**: 添加列隐藏配置 [#1991](https://github.com/VisActor/VTable/issues/1991)
- **@visactor/vtable**: 添加获取相对位置单元格的 API

**🐛 功能修复**

- **@visactor/vtable**: 判断当未退出编辑状态时无法选择其他单元格 [#1974](https://github.com/VisActor/VTable/issues/1974)
- **@visactor/vtable**: 触发 selected_clear 事件 [#1981](https://github.com/VisActor/VTable/issues/1981)
- **@visactor/vtable**: 修复数据透视表虚拟节点编辑值不生效的问题 [#2002](https://github.com/VisActor/VTable/issues/2002)
- **@visactor/vtable**: 修复无法选择Tooltip提示内容的问题 [#2003](https://github.com/VisActor/VTable/issues/2003)
- **@visactor/vtable**: 修复 vrender 导出模块
- **@visactor/vtable**: 修复合并单元格更新性能问题 [#1972](https://github.com/VisActor/VTable/issues/1972)
- **@visactor/vtable**: 修复 webpack 3 的正则表达式格式问题 [#2005](https://github.com/VisActor/VTable/issues/2005)
- **@visactor/vtable**: 修复 shrinkSparklineFirst 模式下宽度计算问题

**🔨 功能重构**

- **@visactor/vtable**: 自动将 sparkline cellType 的聚合类型设置为 None [#1999](https://github.com/VisActor/VTable/issues/1999)



[更多详情请查看 v1.4.2](https://github.com/VisActor/VTable/releases/tag/v1.4.2)

# v1.4.0

2024-06-21


**🆕 新增功能**

- **@visactor/vtable**: 支持角头单元格编辑 [#1945](https://github.com/VisActor/VTable/issues/1945)
- **@visactor/vtable**: vtable-export支持缩进导出
- **@visactor/vtable**: react-vtable支持 CustomComponent & CustomLayout component 组件
- **@visactor/vtable**: PivotTable支持field计算 [#1941](https://github.com/VisActor/VTable/issues/1941)

**🐛 功能修复**

- **@visactor/vtable**: 修复updateSortState api 调用问题 [#1939](https://github.com/VisActor/VTable/issues/1939)
- **@visactor/vtable**: 调用 setRecords 时更新 emptyTip 组件 [#1953](https://github.com/VisActor/VTable/issues/1953)
- **@visactor/vtable**: 修复冻结单元格 getCellRect api 获取 bounds 错误 [#1955](https://github.com/VisActor/VTable/issues/1955)
- **@visactor/vtable**: when drag cell and enter edit state but can not exit edit rightly [#1956](https://github.com/VisActor/VTable/issues/1956)
- **@visactor/vtable**: 修复自定义单元格列宽计算问题 [#1905](https://github.com/VisActor/VTable/issues/1905)
- **@visactor/vtable**: 修复 getCellRange 中的内容判断逻辑 [#1911](https://github.com/VisActor/VTable/issues/1911)
- **@visactor/vtable**: 修复透视表排序时尺寸更新问题 [#1958](https://github.com/VisActor/VTable/issues/1958)

[更多详情请查看 v1.4.0](https://github.com/VisActor/VTable/releases/tag/v1.4.0)

# v1.3.2

2024-06-17


**🆕 新增功能**

- **@visactor/vtable**: 增加 blankAreaClickDeselect & outsideClickDeselect 配置

**🐛 功能修复**

- **@visactor/vtable**: 修复cellIsInVisualView api调用问题 [#1864](https://github.com/VisActor/VTable/issues/1864)
- **@visactor/vtable**: 修复改变列宽时autoWrapText不生效问题 [#1892](https://github.com/VisActor/VTable/issues/1892)

**🔨 功能重构**

- **@visactor/vtable**: 支持tooltip滚动 [#1887](https://github.com/VisActor/VTable/issues/1887)
- **@visactor/vtable**: 支持透视表没有数据是的角头展示 [#1895](https://github.com/VisActor/VTable/issues/1895)
- **@visactor/vtable**: 支持rowTree没有children时的指标展示 [#1924](https://github.com/VisActor/VTable/issues/1924)



[更多详情请查看 v1.3.2](https://github.com/VisActor/VTable/releases/tag/v1.3.2)

# v1.3.1

2024-06-14


**🐛 功能修复**

- **@visactor/vtable**: 修复frozenColCount超过列数时的显示问题 [#1872](https://github.com/VisActor/VTable/issues/1872)
- **@visactor/vtable**: 修复合并单元格的尺寸更新问题 [#1869](https://github.com/VisActor/VTable/issues/1869)
- **@visactor/vtable**: 修复单行填充所有行时的行高更新问题

[更多详情请查看 v1.3.1](https://github.com/VisActor/VTable/releases/tag/v1.3.1)

# v1.3.0

2024-06-12


**🆕 新增功能**

- **@visactor/vtable**: vtable-export增加ignoreIcon&formatExportOutput配置 [#1813](https://github.com/VisActor/VTable/issues/1813)
- **@visactor/vtable**: 增加 textArea editor
- **@visactor/vtable**: 增加 strokeColor 样式 [#1847](https://github.com/VisActor/VTable/issues/1847)
- **@visactor/vtable**: title component增加 dx&dy 配置 [#1874](https://github.com/VisActor/VTable/issues/1874)
- **@visactor/vtable**: 增加 shrinkSparklineFirst 配置 [#1862](https://github.com/VisActor/VTable/issues/1862)
- **@visactor/vtable**: 增加 tooltip 消失延迟时间 [#1848](https://github.com/VisActor/VTable/issues/1848)
- **@visactor/vtable**: 增加透视表排序配置 [#1865](https://github.com/VisActor/VTable/issues/1865)

**🐛 功能修复**

- **@visactor/vtable**: 修复部分图标位置计算问题 [#1882](https://github.com/VisActor/VTable/issues/1882)
- **@visactor/vtable**: 修复下钻按钮点击问题 [#1899](https://github.com/VisActor/VTable/issues/1899)
- **@visactor/vtable**: 修复frozenColCount超过列数时的显示问题 [#1872](https://github.com/VisActor/VTable/issues/1872)
- **@visactor/vtable**: 修复_disableColumnAndRowSizeRound模式下文字省略问题 [#1884](https://github.com/VisActor/VTable/issues/1884)

**🔨 功能重构**

- **@visactor/vtable**: 优化内存释放逻辑 [#1856](https://github.com/VisActor/VTable/issues/1856)
- **@visactor/vtable**: 支持方向键 + shift ctrl选中多个单元格 [#1873](https://github.com/VisActor/VTable/issues/1873)

[更多详情请查看 v1.3.0](https://github.com/VisActor/VTable/releases/tag/v1.3.0)

# v1.2.0

2024-06-06


**🆕 新增功能**

- **@visactor/vtable**: 增加select highlightMode效果 [#1167](https://github.com/VisActor/VTable/issues/1167)
- **@visactor/vtable**: 补充isAggregation api [#1803](https://github.com/VisActor/VTable/issues/1803)
- **@visactor/vtable**: 优化大量列时的性能问题 [#1840](https://github.com/VisActor/VTable/issues/1840) [#1824](https://github.com/VisActor/VTable/issues/1824)
- **@visactor/vtable**: 补充合并单元格自定义图元更新 [#1718](https://github.com/VisActor/VTable/issues/1718)

**🐛 功能修复**

- **@visactor/vtable**: 修复无数据时汇总行展示 [#1804](https://github.com/VisActor/VTable/issues/1804)
- **@visactor/vtable**: 修复updateColumns时设置editor问题 [#1828](https://github.com/VisActor/VTable/issues/1828)
- **@visactor/vtable**: 修复maxCharactersNumber效果 [#1830](https://github.com/VisActor/VTable/issues/1830)

**🔨 功能重构**

- **@visactor/vtable**: resize时更新pixelRatio [#1823](https://github.com/VisActor/VTable/issues/1823)
- **@visactor/vtable**: 增加selectAllOnCtrlA配置

[更多详情请查看 v1.2.0](https://github.com/VisActor/VTable/releases/tag/v1.2.0)

# v1.1.2

2024-06-04


**🔧 项目配置**

- **@visactor/vtable**: update vrender version

[更多详情请查看 v1.1.2](https://github.com/VisActor/VTable/releases/tag/v1.1.2)

# v1.1.1

2024-05-30


**🐛 功能修复**

- **@visactor/vtable**: when set emptyTip interaction not work well with has records [#1818](https://github.com/VisActor/VTable/issues/1818)
- **@visactor/vtable**: fix table frame corner radius display problem [#1783](https://github.com/VisActor/VTable/issues/1783)

**🔨 功能重构**

- **@visactor/vtable**: dimension value same with indicator key cell value error [#1817](https://github.com/VisActor/VTable/issues/1817)

[更多详情请查看 v1.1.1](https://github.com/VisActor/VTable/releases/tag/v1.1.1)

# v1.1.0

2024-05-28


**🆕 新增功能**

- **@visactor/vtable**: 增加内容空白提示 [#1782](https://github.com/VisActor/VTable/issues/1782)

**🐛 功能修复**

- **@visactor/vtable**: deleteRecord和updateRecord接口调用时，更新beforeChangedRecordsMap，以对应正确的rawData [#1780](https://github.com/VisActor/VTable/issues/1780)
- **@visactor/vtable**: disableSelect模式下支持拖拽表头 [#1800](https://github.com/VisActor/VTable/issues/1800)
- **@visactor/vtable**: 修复getDataCellPath方法中计算问题
- **@visactor/vtable**: 修复部分坐标轴尺寸计算问题



[更多详情请查看 v1.1.0](https://github.com/VisActor/VTable/releases/tag/v1.1.0)

# v1.0.3

2024-05-24


**🐛 功能修复**

- **@visactor/vtable**: 修复树形模式下第一列列宽计算问题 [#1778](https://github.com/VisActor/VTable/issues/1778)

**🔨 功能重构**

- **@visactor/vtable**: 图例支持数组形式 [#1740](https://github.com/VisActor/VTable/issues/1740)



[更多详情请查看 v1.0.3](https://github.com/VisActor/VTable/releases/tag/v1.0.3)

# v1.0.2

2024-05-24

**🆕 新增功能**

- **@visactor/vtable**: 增加setRowHeight & setColWidth api

**🐛 功能修复**

- **@visactor/vtable**: 优化hasAutoImageColumn方法性能
- **@visactor/vtable**: 坐标轴size对齐vrender-component [#1784](https://github.com/VisActor/VTable/issues/1784)
- **@visactor/vtable**: 修复lineClamp配置在行高计算中的问题 [#1772](https://github.com/VisActor/VTable/issues/1772)
- **@visactor/vtable**: 修复vtable-export中渐进加载单元格的导出问题 [#1787](https://github.com/VisActor/VTable/issues/1787)
- **@visactor/vtable**: 在selectCells方法中忽略单元格合并



[更多详情请查看 v1.0.2](https://github.com/VisActor/VTable/releases/tag/v1.0.2)

# v1.0.1

2024-05-23


**🆕 新增功能**

- **@visactor/vtable**: 支持树形模式配置icon[#1697](https://github.com/VisActor/VTable/issues/1697)
- **@visactor/vtable**: 增加setRowHeight & setColWidth api

**🐛 功能修复**

- **@visactor/vtable**: 在selectCells方法中忽略单元格合并



[更多详情请查看 v1.0.1](https://github.com/VisActor/VTable/releases/tag/v1.0.1)

# v1.0.0

2024-05-21

**💥 Breaking change**

- **@visactor/vtable**: 透视表 getCellOriginRecord接口返回结果变为数组结构

**🆕 新增功能**

- **@visactor/vtable**: 自定义树形表头customTree可以和透视分析能力结合使用 [#1644](https://github.com/VisActor/VTable/issues/1644)
- **@visactor/vtable**: 在 rowTree & columnTree 中加入virtual option [#1644](https://github.com/VisActor/VTable/issues/1644)



[更多详情请查看 v1.0.0](https://github.com/VisActor/VTable/releases/tag/v1.0.0)
# v0.25.9

2024-05-21


**🐛 功能修复**

- **@visactor/vtable**: 修复空字符串在行高计算时的问题 [#1752](https://github.com/VisActor/VTable/issues/1752)
- **@visactor/vtable**: 修复自定义合并单元格在点击表头全选时的选中显示区域问题



[更多详情请查看 v0.25.9](https://github.com/VisActor/VTable/releases/tag/v0.25.9)

# v0.25.8

2024-05-21


**🆕 新增功能**
- **@visactor/vtable**: 添加滚动条滑块圆角配置scrollSliderCornerRadius [#1369](https://github.com/VisActor/VTable/issues/1369)
- **@visactor/vtable**: 在exportCellImg()中添加禁用背景与禁用边框的功能 [#1733](https://github.com/VisActor/VTable/issues/1733)
- **@visactor/vtable**: 添加禁止列调整大小的配置disableColumnResize到行号配置rowSeriesNumber中

**🐛 功能修复**

- **@visactor/vtable**: 修复当设置隐藏行头时，单元格内容显示为空白的问题 [#1732](https://github.com/VisActor/VTable/issues/1732)
- **@visactor/vtable**: 修复在未设置列时，设置表格列编辑器会出错问题 [#1747](https://github.com/VisActor/VTable/issues/1747)
- **@visactor/vtable**: 修复在cellInRanges()中列和行的顺序问题
- **@visactor/vtable**: 在CSV导出中添加字符串标记 [#1730](https://github.com/VisActor/VTable/issues/1730)



[更多详情请查看 v0.25.8](https://github.com/VisActor/VTable/releases/tag/v0.25.8)

# v0.25.6

2024-05-17


**🆕 新增功能**

- **@visactor/vtable**: 添加 selected_clear 事件 [#1705](https://github.com/VisActor/VTable/issues/1705)
- **@visactor/vtable**: 在事件中添加 mergeCellInfo 参数 [#1667](https://github.com/VisActor/VTable/issues/1667)

**🐛 功能修复**

- **@visactor/vtable**: 在滚动条上按下鼠标触发 mousedown_table 事件 [#1706](https://github.com/VisActor/VTable/issues/1706)
- **@visactor/vtable**: 可编辑合并单元格的值 [#1711](https://github.com/VisActor/VTable/issues/1711)
- **@visactor/vtable**: 修复设置编辑器实例时，子列无法编辑的问题 [#1711](https://github.com/VisActor/VTable/issues/1711)
- **@visactor/vtable**: 修复更改行索引时复选框和单选按钮状态更新问题 [#1712](https://github.com/VisActor/VTable/issues/1712)
- **@visactor/vtable**: 修复文本粘贴时的垂直偏移问题
- **@visactor/vtable**: 修复列宽可能为零的问题 [#1708](https://github.com/VisActor/VTable/issues/1708)
- **@visactor/vtable**: 优化 getCell 性能
- **@visactor/vtable**: 修复透视表中隐藏表头的功能问题
- **@visactor/vtable**: 在渲染中修正 lineDash 判断 [#1696](https://github.com/VisActor/VTable/issues/1696)
- **@visactor/vtable**: 扩展触发 mousedown_table 事件的区域 [#1668](https://github.com/VisActor/VTable/issues/1668)



[更多详情请查看 v0.25.6](https://github.com/VisActor/VTable/releases/tag/v0.25.6)

# v0.25.1

2024-05-08


**🆕 新增功能**

- **@visactor/vtable**: 透视图支持词云、玫瑰图、雷达图、仪表盘 [#1614](https://github.com/VisActor/VTable/issues/1614)
- **@visactor/vtable**: 透视图支持散点图类型 [#1618](https://github.com/VisActor/VTable/issues/1618)
- **@visactor/vtable**: 在react-vtable中添加自定义组件

**🐛 功能修复**

- **@visactor/vtable**: 修复复制空白单元格无法粘贴的问题 [#1646](https://github.com/VisActor/VTable/issues/1646)
- **@visactor/vtable**: 修复自定义合并单元格大小更新问题 [#1636](https://github.com/VisActor/VTable/issues/1636)
- **@visactor/vtable**: 添加选择单元格范围重复选择逻辑 [#1628](https://github.com/VisActor/VTable/issues/1628)
- **@visactor/vtable**: 更新@visactor/vutils-extension版本



[更多详情请查看 v0.25.1](https://github.com/VisActor/VTable/releases/tag/v0.25.1)

# v0.25.0

2024-04-28


**🆕 新增功能**

- **@visactor/vtable**: 透视表表头支持编辑 [#1583](https://github.com/VisActor/VTable/issues/1583)
- **@visactor/vtable**: customrender/customlayout单元格支持编辑 [#1596](https://github.com/VisActor/VTable/issues/1596)
- **@visactor/vtable**: 支持拖拽改变行高

**🐛 功能修复**

- **@visactor/vtable**: 增加编辑器0值处理 [#1590](https://github.com/VisActor/VTable/issues/1590)
- **@visactor/vtable**: 修复textStick显示问题 [#1592](https://github.com/VisActor/VTable/issues/1592)
- **@visactor/vtable**: 修复异步渲染容器尺寸更新问题 [#1593](https://github.com/VisActor/VTable/issues/1593)
- **@visactor/vtable**: 修复折叠按钮显示问题

**🔨 功能重构**

- **@visactor/vtable**: 增加调整最后一列宽度灵活性 [#1567](https://github.com/VisActor/VTable/issues/1567)



[更多详情请查看 v0.25.0](https://github.com/VisActor/VTable/releases/tag/v0.25.0)

# v0.24.1

2024-04-23


**🆕 新增功能**

- **@visactor/vtable**: 增加startEditCell api [#1573](https://github.com/VisActor/VTable/issues/1573)

**🐛 功能修复**

- **@visactor/vtable**: 修复rowSeriesNumber最大/最小宽度显示问题 [#1572](https://github.com/VisActor/VTable/issues/1572)

**🔨 功能重构**

- **@visactor/vtable**: 在透视懒加载模式下优化setTreeNodeChildren api [#1580](https://github.com/VisActor/VTable/issues/1580)

**📖 文档更新**

- **@visactor/vtable**: 增加上钻、下钻demo [#1556](https://github.com/VisActor/VTable/issues/1556)



[更多详情请查看 v0.24.1](https://github.com/VisActor/VTable/releases/tag/v0.24.1)

# v0.24.0

2024-04-22


**🆕 新增功能**

- **@visactor/vtable**: 添加单选`radio`类型，并添加 setCellCheckboxState 和 setCellRadioState API [#1504](https://github.com/VisActor/VTable/issues/1504)
- **@visactor/vtable**: 为数据透视表树添加懒加载功能 [#1521](https://github.com/VisActor/VTable/issues/1521)

**🐛 功能修复**

- **@visactor/vtable**: 处理编辑器输入 ctrl+a 事件和表格事件冲突问题 [#1552](https://github.com/VisActor/VTable/issues/1552)
- **@visactor/vtable**: 当调整窗口大小时，退出编辑状态 [#1559](https://github.com/VisActor/VTable/issues/1559)
- **@visactor/vtable**: 修复多行新行样式 [#1531](https://github.com/VisActor/VTable/issues/1531)
- **@visactor/vtable**: 修复异步数据中单元格组顺序问题 [#1517](https://github.com/VisActor/VTable/issues/1517)
- **@visactor/vtable**: 在 getCellValue() 中添加 skipCustomMerge参数忽略配置的自定义合并配置 [#1543](https://github.com/VisActor/VTable/issues/1543)

**🔨 功能重构**

- **@visactor/vtable**: 当行树节点超过8000个时，优化性能 [#1557](https://github.com/VisActor/VTable/issues/1557)



[更多详情请查看 v0.24.0](https://github.com/VisActor/VTable/releases/tag/v0.24.0)

# v0.23.3

2024-04-16


**🆕 新增功能**

- **@visactor/vtable**: 添加 widthAdaptiveMode & heightAdaptiveMode 配置 [#1499](https://github.com/VisActor/VTable/issues/1499)
- **@visactor/vtable**: 添加measureTextBounds API

**🐛 功能修复**

- **@visactor/vtable**: 在释放tableInstance时释放编辑器 [#1495](https://github.com/VisActor/VTable/issues/1495)
- **@visactor/vtable**: 修复短表格拖动到表格外时发生错误问题 [#1502](https://github.com/VisActor/VTable/issues/1502)
- **@visactor/vtable**: 行移动功能在移动端不工作 [#1503](https://github.com/VisActor/VTable/issues/1503)
- **@visactor/vtable**: 解决 defaultHeaderRowHeight与rowSeriesNumber不兼容问题 [#1520](https://github.com/VisActor/VTable/issues/1520)
- **@visactor/vtable**: 修复树层级状态图标使用rowHierarchyTextStartAlignment子节点渲染错误问题 [#1525](https://github.com/VisActor/VTable/issues/1525)
- **@visactor/vtable**: 调整列宽度需要触发文本textStick变化 [#1529](https://github.com/VisActor/VTable/issues/1529)
- **@visactor/vtable**: 在checkHaveTextStick()中修复主题textStick配置 [#1490](https://github.com/VisActor/VTable/issues/1490)
- **@visactor/vtable**: 在click_cell事件中添加按钮判断 [#1484](https://github.com/VisActor/VTable/issues/1484)
- **@visactor/vtable**: 修复vtable-search中的defalultQueryMethod [#1448](https://github.com/VisActor/VTable/issues/1448)
- **@visactor/vtable**: 在updateOption中更新customMergeCell [#1493](https://github.com/VisActor/VTable/issues/1493)

**🔨 功能重构**

- **@visactor/vtable**: 添加mousedown_table事件 [#1470](https://github.com/VisActor/VTable/issues/1470)
- **@visactor/vtable**: setRecords处理时处理tooltip溢出 [#1494](https://github.com/VisActor/VTable/issues/1494)



[更多详情请查看 v0.23.3](https://github.com/VisActor/VTable/releases/tag/v0.23.3)

# v0.23.2

2024-04-11

**🆕 新增功能**

- **@visactor/vtable**: 滚动条可支持visible设置为focus，当鼠标聚焦到表格时显示滚动条 [#1360](https://github.com/VisActor/VTable/issues/1360)
- **@visactor/vtable**: 树模式下添加层级文本对齐方式：rowHierarchyTextStartAlignment [#1417](https://github.com/VisActor/VTable/issues/1417)

**🐛 功能修复**

- **@visactor/vtable**: 修复合并单元格时数据操作相关 API 调用后的渲染错误 [#1286](https://github.com/VisActor/VTable/issues/1286)
- **@visactor/vtable**: 解决当拖拽列宽时自动行高不生效问题，添加isAutoRowHeight来处理行高计算 [#1379](https://github.com/VisActor/VTable/issues/1379)
- **@visactor/vtable**: 解决图表Tooltip中配置 DOM 生效问题 [#1422](https://github.com/VisActor/VTable/issues/1422)
- **@visactor/vtable**: 边框虚线效果错误处理lineCap设置问题 [#1436](https://github.com/VisActor/VTable/issues/1436)
- **@visactor/vtable**: 解决重复触发选中单元格事件 [#1444](https://github.com/VisActor/VTable/issues/1444)
- **@visactor/vtable**: 解决设置disableSelect禁用选择拖动单元格时出错 [#1461](https://github.com/VisActor/VTable/issues/1461)
- **@visactor/vtable**: 解决树层级状态图标宽度错误问题 [#1466](https://github.com/VisActor/VTable/issues/1466)
- **@visactor/vtable**: 修复透视图设置水平方向时轴domain顺序 [#1453](https://github.com/VisActor/VTable/issues/1453)
- **@visactor/vtable**: 在 opdateOption 中更新 columnWidthComputeMode修复列宽计算问题 [#1465](https://github.com/VisActor/VTable/issues/1465)
- **@visactor/vtable**: 修复内联图标inline icon tooltip 提示配置 [#1456](https://github.com/VisActor/VTable/issues/1456)
- **@visactor/vtable**: 修复进度图在某些情况下遮挡表格边缘单元格
- **@visactor/vtable**: 修复转置表格表头边框获取逻辑 [#1463](https://github.com/VisActor/VTable/issues/1463)

**🔨 功能重构**

- **@visactor/vtable**: 更新下钻上钻图标的SVG
- **@visactor/vtable**: 透视图设置 markLine autoRange 处理轴范围 [#1420](https://github.com/VisActor/VTable/issues/1420)
- **@visactor/vtable**: 为 react 表格补充事件类型 [#1434](https://github.com/VisActor/VTable/issues/1434)

[更多详情请查看 v0.23.2](https://github.com/VisActor/VTable/releases/tag/v0.23.2)

# v0.23.1

2024-04-07


**🆕 新增功能**

- **@visactor/vtable**: 滚动时选择范围可以自动滚动扩展 [#1400](https://github.com/VisActor/VTable/issues/1400)

**🐛 功能修复**

- **@visactor/vtable**: maxLineWidth 值应考虑 hierarchyOffset [#1224](https://github.com/VisActor/VTable/issues/1224)
- **@visactor/vtable**: 树叶节点文本右对齐渲染错误 [#1393](https://github.com/VisActor/VTable/issues/1393)
- **@visactor/vtable**: 复制或粘贴时 navigator.clipboard?.write 在非 https 中未定义错误 [#1421](https://github.com/VisActor/VTable/issues/1421)
- **@visactor/vtable**: 修复表头单元格图像自动调整大小 [#1339](https://github.com/VisActor/VTable/issues/1339)
- **@visactor/vtable**: 隐藏图标时隐藏图标背景
- **@visactor/vtable**: 修复 nan verticalBarPos [#1232](https://github.com/VisActor/VTable/issues/1232)
- **@visactor/vtable**: 修复进度条覆盖单元格边框 [#1425](https://github.com/VisActor/VTable/issues/1425)
- **@visactor/vtable**: 在表格选项中移除容器
- **@visactor/vtable**: 在 exportCellImg 中添加同步渲染 [#1398](https://github.com/VisActor/VTable/issues/1398)

**🔨 功能重构**

- **@visactor/vtable**: 优化更改树层级状态时的性能 [#1406](https://github.com/VisActor/VTable/issues/1406)



[更多详情请查看 v0.23.1](https://github.com/VisActor/VTable/releases/tag/v0.23.1)

# v0.23.0

2024-03-29


**🆕 新增功能**

- **@visactor/vtable**: 列表树模式支持updateFilterRules接口 [#1376](https://github.com/VisActor/VTable/issues/1376)
- **@visactor/vtable**: 添加滚动结束事件，增加barToSide支持滚动条固定显示到边界 [#1304](https://github.com/VisActor/VTable/issues/1304)
- **@visactor/vtable**: 添加fillHandle以支持填充手柄

**🐛 功能修复**

- **@visactor/vtable**: 修复使用frozenColCount时转置模式的阴影线渲染问题 [#1366](https://github.com/VisActor/VTable/issues/1366)
- **@visactor/vtable**: 数据源promise模式调用addRecords和deleteRecords的问题修复
- **@visactor/vtable**: 点击单元格时不应触发drag_select_end事件修复 [#1410](https://github.com/VisActor/VTable/issues/1410)



[更多详情请查看 v0.23.0](https://github.com/VisActor/VTable/releases/tag/v0.23.0)

# v0.22.0

2024-03-22

**🆕 新增功能**

- **@visactor/vtable**: 支持配置行号

[更多详情请查看 v0.22.0](https://github.com/VisActor/VTable/releases/tag/v0.22.0)

# v0.21.3

2024-03-20

**🐛 功能修复**

- **@visactor/vtable**: 透视分析表中使用映射 colorMap 不起作用 [#1295](https://github.com/VisActor/VTable/issues/1295)
- **@visactor/vtable**: 当复制空白单元格并粘贴到单元格时变成 undefined [#1298](https://github.com/VisActor/VTable/issues/1298)
- **@visactor/vtable**: 修复数据源懒加载编辑单元格值无效的 bug [#1302](https://github.com/VisActor/VTable/issues/1302)
- **@visactor/vtable**: 修复单元格进度的宽高值少一像素问题
- **@visactor/vtable**: 修复 getCellAdressByHeaderPath 接口问题
- **@visactor/vtable**: 在 exportCellImg() 中使用默认样式
- **@visactor/vtable**: 修复 getCellMergeRange() 中的 typeError

**📖 文档更新**

- **@visactor/vtable**: 添加基本表格树形结构文档

[更多详情请查看 v0.21.3](https://github.com/VisActor/VTable/releases/tag/v0.21.3)

# v0.21.2

2024-03-14

**🆕 新增功能**

- **@visactor/vtable**: 添加 textStickBaseOnAlign 配置

**🐛 功能修复**

- **@visactor/vtable**: 表格转置后，调整列宽后冻结线条渲染错误 [#1239](https://github.com/VisActor/VTable/issues/1239)
- **@visactor/vtable**: 在使用 headerIcon 的透视树模式下，缩进值无效 [#1269](https://github.com/VisActor/VTable/issues/1269)
- **@visactor/vtable**: 修复进度条矩形高度问题

[更多详情请查看 v0.21.2](https://github.com/VisActor/VTable/releases/tag/v0.21.2)

# v0.21.1

2024-03-11

**🐛 功能修复**

- **@visactor/vtable**: 合并单元格渲染错误，当配置了聚合和分页时 [#1223](https://github.com/VisActor/VTable/issues/1223)

**📖 文档更新**

- **@visactor/vtable**: indicatorsAsCol 支持指标在行中显示 [#1238](https://github.com/VisActor/VTable/issues/1238)

[更多详情请查看 v0.21.1](https://github.com/VisActor/VTable/releases/tag/v0.21.1)

# v0.21.0

2024-03-11

**🆕 新增功能**

- **@visactor/vtable**: 添加文本测量配置
- **@visactor/vtable**: 添加自定义单元格样式功能
- **@visactor/vtable**: 在主题配置中添加 cellInnerBorder、cellBorderClipDirection 和 \_contentOffset
- **@visactor/vtable**: 添加搜索组件

**🐛 功能修复**

- **@visactor/vtable**: 调用 updatePagination 合并单元格渲染错误 [#1207](https://github.com/VisActor/VTable/issues/1207)
- **@visactor/vtable**: 拖动表头位置单元格错误 [#1220](https://github.com/VisActor/VTable/issues/1220)
- **@visactor/vtable**: 修复复选框文本间距问题
- **@visactor/vtable**: 修复滚动位置差异

**🔨 功能重构**

- **@visactor/vtable**: 限制 pasteValueToCell 只能在可编辑单元格上工作 [#1063](https://github.com/VisActor/VTable/issues/1063)
- **@visactor/vtable**: 支持 underlineDash 和 underlineOffset [#1132](https://github.com/VisActor/VTable/issues/1132) [#1135](https://github.com/VisActor/VTable/issues/1135)
- **@visactor/vtable**: onStart 函数添加 col row 参数 [#1214](https://github.com/VisActor/VTable/issues/1214)

**✅ 单元测试**

- **@visactor/vtable**: 添加单元测试 getCellAddressByHeaderPaths

[更多详情请查看 v0.21.0](https://github.com/VisActor/VTable/releases/tag/v0.21.0)

# v0.20.2

2024-03-04

**🆕 新增功能**

- **@visactor/vtable**: 添加复选框样式主题

**🐛 功能修复**

- **@visactor/vtable**: 修复右侧冻结列数大于列总数的情况下渲染问题 [#1162](https://github.com/VisActor/VTable/issues/1162)
- **@visactor/vtable**: 表头上的 Tooltip hover 时移动闪烁问题 [#1173](https://github.com/VisActor/VTable/issues/1173)
- **@visactor/vtable**: 添加字体样式和字体变体

[更多详情请查看 v0.20.2](https://github.com/VisActor/VTable/releases/tag/v0.20.2)

# v0.20.1

2024-02-29

**🆕 新增功能**

- **@visactor/vtable**: 添加 getRecordIndexByCell API [#1121](https://github.com/VisActor/VTable/issues/1121)

**🐛 功能修复**

- **@visactor/vtable**: 三级子标题设置隐藏列时显示错误 [#1105](https://github.com/VisActor/VTable/issues/1105)
- **@visactor/vtable**: 自定义布局弹性渲染错误 [#1163](https://github.com/VisActor/VTable/issues/1163)
- **@visactor/vtable**: 滚动时将 tooltip 隐藏 [#905](https://github.com/VisActor/VTable/issues/905)
- **@visactor/vtable**: 修复轴内偏移
- **@visactor/vtable**: 在 react-vtable 中添加 skipFunctionDiff

**🔨 功能重构**

- **@visactor/vtable**: 重命名 resize_column_end 事件参数 [#1129](https://github.com/VisActor/VTable/issues/1129)
- **@visactor/vtable**: API 返回 value 类型定义
- **@visactor/vtable**: setRecords 支持恢复层次状态 [#1148](https://github.com/VisActor/VTable/issues/1148)
- **@visactor/vtable**: vtable 不停止事件冒泡 [#892](https://github.com/VisActor/VTable/issues/892)
- **@visactor/vtable**: 移除循环依赖

**🔖 其他**

- **@visactor/vtable**: 修复 contextMenuItems 事件添加 col 参数

[更多详情请查看 v0.20.1](https://github.com/VisActor/VTable/releases/tag/v0.20.1)

# v0.20.0

2024-02-23

**🆕 新增功能**

- **@visactor/vtable**：添加列表列的聚合
- **@visactor/vtable**：添加 api getAggregateValuesByField
- **@visactor/vtable**：添加自定义聚合
- **@visactor/vtable**：chartSpec 支持函数 [#1115](https://github.com/VisActor/VTable/issues/1115)
- **@visactor/vtable**：添加基本表格的过滤能力 [#607](https://github.com/VisActor/VTable/issues/607)

**🐛 功能修复**

- **@visactor/vtable**：编辑右冻结单元格输入位置错误
- **@visactor/vtable**：mouseleave_cell 事件触发器 [#1112](https://github.com/VisActor/VTable/issues/1112)
- **@visactor/vtable**：修复 isCellHover() 中的 cellBgColor 判断
- **@visactor/vtable**：修复自定义合并单元计算的高度和宽度
- **@visactor/vtable**：修复内容位置更新问题
- **@visactor/vtable**：在 setDropDownMenuHighlight() 中合并单元格更新
- **@visactor/vtable**：修复 react 严格模式下的 react-vtable 显示错误[#990](https://github.com/VisActor/VTable/issues/990)

[更多详情请查看 v0.20.0](https://github.com/VisActor/VTable/releases/tag/v0.20.0)

# v0.19.1

2024-02-06

**🆕 新增功能**

- **@visactor/vtable**: 添加透视表更新排序规则的 API updateSortRules
- **@visactor/vtable**: 添加轴内偏移配置
- **@visactor/vtable**: 在 customRender 中添加 name 配置

**🐛 功能修复**

- **@visactor/vtable**: 修复当表格有滚动时，点击表头编辑位置错误 [#1069](https://github.com/VisActor/VTable/issues/1069)
- **@visactor/vtable**: 修复同步模式下列单元格顺序问题
- **@visactor/vtable**: 修复单元格组中边框 lineDash 的问题 [#1051](https://github.com/VisActor/VTable/issues/1051)
- **@visactor/vtable**: 修复宽度更新中 textAlign 值的问题[#1065](https://github.com/VisActor/VTable/issues/1065)
- **@visactor/vtable**: 修复合并单元格内容位置
- **@visactor/vtable**: 修复合并单元格更新问题

**🔨 功能重构**

- **@visactor/vtable**: 透视表排序逻辑 [#1033](https://github.com/VisActor/VTable/issues/1033)
- **@visactor/vtable**: 显示排序选项工作正常 [#1077](https://github.com/VisActor/VTable/issues/1077)

[更多详情请查看 v0.19.1](https://github.com/VisActor/VTable/releases/tag/v0.19.1)

# v0.19.0

2024-02-02

**🆕 新增功能**

- **@visactor/vtable**: 支持获取排序后的列 [#986](https://github.com/VisActor/VTable/issues/986)
- **@visactor/vtable**: 添加配置项：frozenColDragHeaderMode，设置冻结列拖动表头的限制规则

**🐛 功能修复**

- **@visactor/vtable**: 修复选择区域错误问题 [#1018](https://github.com/VisActor/VTable/issues/1018)
- **@visactor/vtable**: 修复调用 updateColumns 和折扣列发生错误 [#1015](https://github.com/VisActor/VTable/issues/1015)
- **@visactor/vtable**: 修复右侧冻结列计数拖动表头多次后列宽错误 [#1019](https://github.com/VisActor/VTable/issues/1019)
- **@visactor/vtable**: 修复空字符串计算行高错误 [#1031](https://github.com/VisActor/VTable/issues/1031)
- **@visactor/vtable**: 修复合并图像单元格更新问题
- **@visactor/vtable**: 修正底部冻结行大小不正确的问题

**🔨 功能重构**

- **@visactor/vtable**: 当拖动表头移动到冻结区域时标记线显示位置
- **@visactor/vtable**: 优化 updateRow api 性能

[更多详情请查看 v0.19.0](https://github.com/VisActor/VTable/releases/tag/v0.19.0)

# v0.18.3

2024-01-25

**🐛 功能修复**

- **@visactor/vtable**: 点击单元格外部取消选择状态

[更多详情请查看 v0.18.3](https://github.com/VisActor/VTable/releases/tag/v0.18.3)

# v0.18.2

2024-01-24

**🆕 新增功能**

- **@visactor/vtable**: 当调用 updateTheme 时 组件更新逻辑

**🐛 功能修复**

- **@visactor/vtable**: 修复 rowHeaderGroup 属性 y 在没有 colHeaderGroup 时的问题 [#971](https://github.com/VisActor/VTable/issues/971)
- **@visactor/vtable**: 修复 transpose 时，bottomFrozenRow 单元格布局错误 [#978](https://github.com/VisActor/VTable/issues/978)
- **@visactor/vtable**: 修复值粘贴到最后一行时出现的错误 [#979](https://github.com/VisActor/VTable/issues/979)
- **@visactor/vtable**: 修复使用 updateColumns api 点击选择状态不正确的问题 [#975](https://github.com/VisActor/VTable/issues/975)
- **@visactor/vtable**: 修复 records 中有'NaN'字符串值 pivotchart 单元格值解析处理问题 [#993](https://github.com/VisActor/VTable/issues/993)
- **@visactor/vtable**: 坐标轴单元格行高度计算逻辑的优化
- **@visactor/vtable**: 修复在 moveCell() 中 deltaY 的问题

[更多详情请查看 v0.18.2](https://github.com/VisActor/VTable/releases/tag/v0.18.2)

# v0.18.0

2024-01-19

**🆕 新增功能**

- **@visactor/vtable**: 支持 pivotchart 中配置显示饼图
- **@visactor/vtable**: 在 customMergeCell 中添加 customLayout & customRander
- **@visactor/vtable**: 添加 eventOptions [#914](https://github.com/VisActor/VTable/issues/914)

**🐛 功能修复**

- **@visactor/vtable**: 处理 chartSpec barWidth 设置为字符串类型的情况
- **@visactor/vtable**: 修复当 body 没有数据时调用 addRecords api 报错问题 [#953](https://github.com/VisActor/VTable/issues/953)
- **@visactor/vtable**: 修复当列有多级时，鼠标拖动移动 Header 位置有误 [#957](https://github.com/VisActor/VTable/issues/957)
- **@visactor/vtable**: 修复当调整列宽时，应更新 bottomFrozenRow 的高度 [#954](https://github.com/VisActor/VTable/issues/954)

[更多详情请查看 v0.18.0](https://github.com/VisActor/VTable/releases/tag/v0.18.0)

# v0.17.10

2024-01-18

**🆕 新增功能**

- **@visactor/vtable**: 使用 vrender-core

**🐛 功能修复**

- **@visactor/vtable**: 修复选择边界范围错误 [#911](https://github.com/VisActor/VTable/issues/911)
- **@visactor/vtable**: 修复当启用 pasteValueToCell 和事件 change_cell_value 参数错误问题 [#919](https://github.com/VisActor/VTable/issues/919)
- **@visactor/vtable**: 修复树结构自动合并更新问题
- **@visactor/vtable**: 切换树节点是需要 updateChartSize

[更多详情请查看 v0.17.10](https://github.com/VisActor/VTable/releases/tag/v0.17.10)

# v0.17.9

2024-01-18

**🆕 新增功能**

- **@visactor/vtable**: 支持 Excel 数据批量粘贴到单元格 [#857](https://github.com/VisActor/VTable/issues/857)
- **@visactor/vtable**: 添加 api getCellAddressByRecord
- **@visactor/vtable**: 优化 getCellHeaderPath 函数

**🐛 功能修复**

- **@visactor/vtable**: 修复 showSubTotals 无法生效问题 [#893](https://github.com/VisActor/VTable/issues/893)
- **@visactor/vtable**: 修复当设置容器 display:none 触发 resize 逻辑问题
- **@visactor/vtable**: 修复右侧冻结单元格位置

[更多详情请查看 v0.17.9](https://github.com/VisActor/VTable/releases/tag/v0.17.9)

# v0.17.8

2024-01-17

**🐛 功能修复**

- **@visactor/vtable**: 修复靠近 frozencol 或 frozenrow 时 selectRange 错误 [#854](https://github.com/VisActor/VTable/issues/854)
- **@visactor/vtable**: 双击自动列宽或者拖拽列位置后，冻结阴影线应移动位置 [#859](https://github.com/VisActor/VTable/issues/859)
- **@visactor/vtable**: 双击自动列宽时 图表大小更新
- **@visactor/vtable**: 修复在 createGroupForFirstScreen()中计算底部冻结行高度
- **@visactor/vtable**: 修复 cellGroup 合并范围
- **@visactor/vtable**: 修复 react 自定义 jsx 解析

[更多详情请查看 v0.17.8](https://github.com/VisActor/VTable/releases/tag/v0.17.8)

# v0.17.7

2024-01-05

**🆕 新增功能**

- **@visactor/vtable**: 添加单元格图片元素从表格导出能力

**🐛 功能修复**

- **@visactor/vtable**: 修复 react-vtable 中的 jsx 解析错误

[更多详情请查看 v0.17.7](https://github.com/VisActor/VTable/releases/tag/v0.17.7)

# v0.17.6

2024-01-04

**🐛 功能修复**

- **@visactor/vtable**: 修复列宽调整线位置

[更多详情请查看 v0.17.6](https://github.com/VisActor/VTable/releases/tag/v0.17.6)

# v0.17.5

2024-01-04

**🆕 新增功能**

- **@visactor/vtable**: 支持编辑表头标题 [#819](https://github.com/VisActor/VTable/issues/819)
- **@visactor/vtable**: 为 pivotTable 添加 getCellHeaderTreeNodes API [#839](https://github.com/VisActor/VTable/issues/839)

**🐛 功能修复**

- **@visactor/vtable**: setRecords 处理 scrollTop 并更新场景树 [#831](https://github.com/VisActor/VTable/issues/831)
- **@visactor/vtable**: 在表格 body 中添加 clip 范围

**🔨 功能重构**

- **@visactor/vtable**: 修复列表表格底部行不能使用 bottomFrozenStyle [#836](https://github.com/VisActor/VTable/issues/836)
- **@visactor/vtable**: 为 BaseTable 添加 onVChartEvent [#843](https://github.com/VisActor/VTable/issues/843)

[更多详情请查看 v0.17.5](https://github.com/VisActor/VTable/releases/tag/v0.17.5)

# v0.17.3

2024-01-01

**🆕 新增功能**

- **@visactor/vtable**: 添加数据索引与表格索引的转换 [#789](https://github.com/VisActor/VTable/issues/789)
- **@visactor/vtable**: mergeCell 支持自定义比较函数 [#804](https://github.com/VisActor/VTable/issues/804)
- **@visactor/vtable**: 添加列调整标签主题

**🐛 功能修复**

- **@visactor/vtable**: setRecords 接口调用后丢失悬停状态 [#783](https://github.com/VisActor/VTable/issues/783)
- **@visactor/vtable**: 修复转置表格 10000 条数据的性能问题 [#790](https://github.com/VisActor/VTable/issues/790)
- **@visactor/vtable**: 修复 setRecords recomputeColWidth 问题 [#796](https://github.com/VisActor/VTable/issues/796)
- **@visactor/vtable**: 设置 disableSelect 拖动交互错误 [#799](https://github.com/VisActor/VTable/issues/799)
- **@visactor/vtable**: 工具提示样式无效 [#805](https://github.com/VisActor/VTable/issues/805)
- **@visactor/vtable**: 透视表 pagination.perPageCount 修改 [#807](https://github.com/VisActor/VTable/issues/807)
- **@visactor/vtable**: [Bug] 当有 frozencol 和 rightFrozenCol 时，自适应模式计算问题 [#820](https://github.com/VisActor/VTable/issues/820)
- **@visactor/vtable**: 修复轴渲染更新问题
- **@visactor/vtable**: 修复选择更新时更改冻结
- **@visactor/vtable**: 透视表使用图标错误
- **@visactor/vtable**: 修复排序图标更新

**🔨 功能重构**

- **@visactor/vtable**: 更新 vrender 事件版本以使用 scrollDrag

**🔧 项目配置**

- **@visactor/vtable**: 更新 vrender 版本 [#785](https://github.com/VisActor/VTable/issues/785)

[更多详情请查看 v0.17.3](https://github.com/VisActor/VTable/releases/tag/v0.17.3)

# v0.17.2

2023-12-21

**🐛 功能修复**

- **@visactor/vtable**: 修复编辑表格错误 [#771](https://github.com/VisActor/VTable/issues/771)
- **@visactor/vtable**: 在 resetRowHeight 中添加行高度舍入

[更多详情请查看 v0.17.2](https://github.com/VisActor/VTable/releases/tag/v0.17.2)

# v0.17.1

2023-12-21

**🆕 新增功能**

- **@visactor/vtable**: 添加方向键交互 [#646](https://github.com/VisActor/VTable/issues/646)

**🐛 功能修复**

- **@visactor/vtable**: 停止传播双击事件
- **@visactor/vtable**: 修复下拉菜单点击触发问题 [#760](https://github.com/VisActor/VTable/issues/760)
- **@visactor/vtable**: 修复双击出现错误 [#758](https://github.com/VisActor/VTable/issues/758)
- **@visactor/vtable**: 修复 getCellOverflowText()中的富文本错误
- **@visactor/vtable**: 添加滚动条事件以调用 completeEdit [#710](https://github.com/VisActor/VTable/issues/710)
- **@visactor/vtable**: 支持树形模式自适应
- **@visactor/vtable**: 修复下拉图标显示错误
- **@visactor/vtable**: 修复右侧冻结列宽度更新问题

**🔨 功能重构**

- **@visactor/vtable**: 当有选择单元格时，优化 100W 记录滚动性能 [#681](https://github.com/VisActor/VTable/issues/681)
- **@visactor/vtable**: 移除透视表的默认排序规则 [#759](https://github.com/VisActor/VTable/issues/759)

**📖 文档更新**

- **@visactor/vtable**: 更新 rush 的 changelog

[更多详情请查看 v0.17.1](https://github.com/VisActor/VTable/releases/tag/v0.17.1)

# v0.17.0

2023-12-15

**🆕 新增功能**

- **@visactor/vtable**: 添加配置 showGrandTotalsOnTop [#650](https://github.com/VisActor/VTable/issues/650)
- **@visactor/vtable**: 优化 toggleHierarchyState() 中的 diffCellIndices
- **@visactor/vtable**: 添加 disableAxisHover 配置
- **@visactor/vtable**: 优化数据透视表中的 computeTextWidth()

**🐛 功能修复**

- **@visactor/vtable**: 修复右侧冻结自适应问题
- **@visactor/vtable**: 修复底部冻结悬停错误的 disableHover
- **@visactor/vtable**: 修复 updateRow() 中的 rowUpdatePos 更新

**🔨 功能重构**

- **@visactor/vtable**: 隐藏下拉菜单 [#727](https://github.com/VisActor/VTable/issues/727)

[更多详情请查看 v0.17.0](https://github.com/VisActor/VTable/releases/tag/v0.17.0)

# v0.16.3

2023-12-14

**🆕 新增功能**

- **@visactor/vtable**: 在自定义布局中添加 enableCellPadding 配置
- **@visactor/vtable**: 添加列 disableHover&disableSelect 配置

**🐛 功能修复**

- **@visactor/vtable**: 修复轴主题获取函数
- **@visactor/vtable**: 数据透视表支持非数字类型 [#718](https://github.com/VisActor/VTable/issues/718)
- **@visactor/vtable**: 边缘单元格选择边框剪裁 [#716](https://github.com/VisActor/VTable/issues/716)

[更多详情请查看 v0.16.3](https://github.com/VisActor/VTable/releases/tag/v0.16.3)

# v0.16.2

2023-12-14

**🐛 功能修复**

- **@visactor/vtable**: 修复在数据透视表上编辑空白单元格无效问题 [#712](https://github.com/VisActor/VTable/issues/712)
- **@visactor/vtable**: 修复拖动表头位置时数据懒加载问题 [#705](https://github.com/VisActor/VTable/issues/705)

**🔨 功能重构**

- **@visactor/vtable**: 数据透视表格式参数修改

**📖 文档更新**

- **@visactor/vtable**: 更新数据透视表格式使用方法

[更多详情请查看 v0.16.2](https://github.com/VisActor/VTable/releases/tag/v0.16.2)

# v0.16.0

2023-12-08

**🆕 新增功能**

- **@visactor/vtable**: 轴支持图表填充配置
- **@visactor/vtable**: 优化透视表头性能
- **@visactor/vtable**: 添加轴主题
- **@visactor/vtable**: 覆盖默认和悬停颜色
- **@visactor/vtable**: 添加 api addRecords

**🐛 功能修复**

- **@visactor/vtable**: updateOption 调用时需要更新 updateEventBinde
- **@visactor/vtable**: 修复 columnResizeType: all 无效
- **@visactor/vtable**: 修复树结构底部冻结更新
- **@visactor/vtable**: 修复限制列宽自适应更新
- **@visactor/vtable**: 修复容器调整大小时的表格范围
- **@visactor/vtable**: 修复表格框架阴影颜色
- **@visactor/vtable**: 修复滚动位置更新问题

**📖 文档更新**

- **@visactor/vtable**: 修复 lineheight 描述

[更多详情请查看 v0.16.0](https://github.com/VisActor/VTable/releases/tag/v0.16.0)

# v0.15.4

2023-12-01

**🐛 功能修复**

- **@visactor/vtable**: 解决列中设置的编辑器对象被克隆的问题
- **@visactor/vtable**: 修复主题样式获取问题
- **@visactor/vtable**: 修复列表表格冻结悬停颜色
- **@visactor/vtable**: 修复 getCellRect()中的右下角冻结单元格
- **@visactor/vtable**: 修复列宽限制时的表格调整问题
- **@visactor/vtable**: 修复自定义渲染 renderDefault 自动大小问题
- **@visactor/vtable**: 修复 columnWidthComputeMode 配置问题
- **@visactor/vtable**: 触发调整大小事件后释放 tableInstance
- **@visactor/vtable**: columnWidthComputeMode 逻辑中考虑 only-header

**🔨 功能重构**

- **@visactor/vtable**: ts 定义优化

[更多详情请查看 v0.15.4](https://github.com/VisActor/VTable/releases/tag/v0.15.4)

# v0.15.3

2023-12-01

**🆕 新增功能**

- **@visactor/vtable**: 添加 setRecordChildren 以懒加载树节点
- **@visactor/vtable**: 数据透视表支持编辑

**🐛 功能修复**

- **@visactor/vtable**: 修复 cornerCellStyle 更新
- **@visactor/vtable**: 修复图表项选择问题
- **@visactor/vtable**: 修复左下角冻结单元格样式

[更多详情请查看 v0.15.3](https://github.com/VisActor/VTable/releases/tag/v0.15.3)

# v0.15.1

2023-11-28

**🐛 功能修复**

- **@visactor/vtable**: 修复了重复选中第一个单元格的拖动选择问题 [#611](https://github.com/VisActor/VTable/issues/611)
- **@visactor/vtable**: 渲染无指标的透视图
- **@visactor/vtable**: 使用 Math.ceil bandSpace 计算图表列宽

**🔨 功能重构**

- **@visactor/vtable**: 当列没有排序设置时，sortState 无法工作 [#622](https://github.com/VisActor/VTable/issues/622)
- **@visactor/vtable**: 移除了 keydown 事件参数 cells
- **@visactor/vtable**: 将 maneger 重命名为 manager

**📖 文档更新**

- **@visactor/vtable**: 添加了 api getCellCheckboxState

[更多详情请查看 v0.15.1](https://github.com/VisActor/VTable/releases/tag/v0.15.1)

# v0.15.0

2023-11-24

**🆕 新增功能**

- **@visactor/vtable**: 添加复制数据事件 [#551](https://github.com/VisActor/VTable/issues/551)
- **@visactor/vtable**: 添加列宽最小限制的列配置 [#590](https://github.com/VisActor/VTable/issues/590)
- **@visactor/vtable**: 使用 inputEditor 编辑文本值
- **@visactor/vtable**: 添加 react-vtable

**🐛 功能修复**

- **@visactor/vtable**: 当大量列与采样冻结底部行未计算时，计算列宽度
- **@visactor/vtable**: 当 bodyRowCount 为 0 时，修复单元格位置不匹配的问题 [#596](https://github.com/VisActor/VTable/issues/596)
- **@visactor/vtable**: 在 updateCell() 中修复文本图元 x 的值

**🔖 其他**

- **@visactor/vtable**: 在 updateCellGroupContent() 中修复/修复单元格角色判断

[更多详情请查看 v0.15.0](https://github.com/VisActor/VTable/releases/tag/v0.15.0)

# v0.14.2

2023-11-16

**🐛 功能修复**

- **@visactor/vtable**: 修复行头选择绑定错误 [#572](https://github.com/VisActor/VTable/issues/572)
- **@visactor/vtable**: 修复 selectHeader 复制数据问题

[更多详情请查看 v0.14.2](https://github.com/VisActor/VTable/releases/tag/v0.14.2)

# v0.14.1

2023-11-13

**🔨 功能重构**

- **@visactor/vtable**: 当拖动到画布空白区域结束选择 [#556](https://github.com/VisActor/VTable/issues/556)

[更多详情请查看 v0.14.1](https://github.com/VisActor/VTable/releases/tag/v0.14.1)

# v0.14.0

2023-11-10

**🆕 新增功能**

- **@visactor/vtable**: 在自定义布局中添加 jsx 支持
- **@visactor/vtable**: 重构合并单元格策略
- **@visactor/vtable**: 在轴中添加功能性 tickCount 配置
- **@visactor/vtable**: 更新 customLayout api

[更多详情请查看 v0.14.0](https://github.com/VisActor/VTable/releases/tag/v0.14.0)

# v0.13.4

2023-11-08

**🆕 新增功能**

- **@visactor/vtable**: 添加选项 overscrollBehavior

**🐛 功能修复**

- **@visactor/vtable**: 拖动选择超出表格单元格 getSelectCellInfos 为空
- **@visactor/vtable**: 当冻结底部行时，选择边框渲染错误 [#508](https://github.com/VisActor/VTable/issues/508)

**🔨 功能重构**

- **@visactor/vtable**: 更改 styleElement 添加 targetDom

[更多详情请查看 v0.13.4](https://github.com/VisActor/VTable/releases/tag/v0.13.4)

# v0.13.3

2023-11-03

**🐛 功能修复**

- **@visactor/vtable**: 在树模式下修复冻结阴影更新 [#525](https://github.com/VisActor/VTable/issues/525)

[更多详情请查看 v0.13.3](https://github.com/VisActor/VTable/releases/tag/v0.13.3)
