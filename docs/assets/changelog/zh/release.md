# v1.23.1

2026-02-05


**🆕 新增功能**

- **@visactor/vtable**: add componentLayoutOrder api [#4965](https://github.com/VisActor/VTable/issues/4965)
- **@visactor/vtable**: optimize search latency
- **@visactor/vtable**: 新增基于记录索引的单元格值修改方法及优化范围删除性能
- **@visactor/vtable**: 添加syncRecordOperationsToSourceRecords选项支持同步操作到源数据
- **@visactor/vtable**: 新增批量修改单元格值接口及优化筛选态数据同步
- **@visactor/vtable-sheet**: add updateOption api for vtable-sheet
- **@visactor/vtable-sheet**: add editable  for vtable-sheet

**🐛 功能修复**

- **@visactor/vtable**: fix prepareEdit occor error [#4871](https://github.com/VisActor/VTable/issues/4871)
- **@visactor/vtable**: updateOption run resize logic [#4965](https://github.com/VisActor/VTable/issues/4965)
- **@visactor/vtable**: 修复过滤状态下新增记录位置错误问题
- **@visactor/vtable**: handle escape option correctly for CSV export
- **@visactor/vtable**: set white background for media overlay image

**🔨 功能重构**

- **@visactor/vtable**: legend and title component position calculation logic [#4965](https://github.com/VisActor/VTable/issues/4965)



[更多详情请查看 v1.23.1](https://github.com/VisActor/VTable/releases/tag/v1.23.1)

# v1.23.0

2026-01-29


**🆕 新增功能**

- **@visactor/vtable-sheet**:vtable-sheet 新增事件系统 [#4861](https://github.com/VisActor/VTable/issues/4861)

**🐛 功能修复**

- **@visactor/vtable**: 修复 columnWidthConfig 计算逻辑 [#4935](https://github.com/VisActor/VTable/issues/4935)
- **@visactor/vtable**: 维度值变化时重新计算 totalTree [#4953](https://github.com/VisActor/VTable/issues/4953)
- **@visactor/vtable**: 维度值变化时更新 cached changedTree 值
- **@visactor/vtable-sheet**: 新增记录后更新公式
- **@visactor/vtable**: 修复 react 类型定义

**🔨 功能重构**

- **@visactor/vtable**: 修复 pivotTable 区分无维度值和维度值为空字符串的问题

[更多详情请查看 v1.23.0](https://github.com/VisActor/VTable/releases/tag/v1.23.0)

# v1.22.12

2026-01-26


**🆕 新增功能**

- **@visactor/vtable**: 新增 cancelEditCell 方法到 ListTable 和 PivotTable APIs
- **@visactor/vtable**: 新增 selectedStateFilter 方法到 pivotChart
- **@visactor/vtable**: 新增 clearChartState 和 disableTooltip 方法

**🐛 功能修复**

- **@visactor/vtable**: 修复当点击行系列号时 makeSelectCellVisible 设置为 false [#4942](https://github.com/VisActor/VTable/issues/4942)
- **@visactor/vtable**: 修复当行系列号启用时最后一行维度列宽问题 [#4946](https://github.com/VisActor/VTable/issues/4946)

**🔨 功能重构**

- **@visactor/vtable**: 优化图表交互



[更多详情请查看 v1.22.12](https://github.com/VisActor/VTable/releases/tag/v1.22.12)

# v1.22.11

2026-01-20


**🐛 功能修复**

- **@visactor/vtable**: 修复prepareEdit 代码运行报错问题 [#4871](https://github.com/VisActor/VTable/issues/4871)
- **@visactor/vtable**: 修复粘贴到表格时性能问题 [#4912](https://github.com/VisActor/VTable/issues/4912)
- **@visactor/vtable**: 修复透视图列维度中区分空值和空字符串值问题
- **scenegraph**: 修复开始超出结束时重置代理行状态问题
- **@visactor/vtable**: 修复时间单位computeCountToTimeScale月精确度问题 [#4909](https://github.com/VisActor/VTable/issues/4909)
- **@visactor/vtable**: 修复主题配置theme.headerStyle.textStickBaseOnAlign不生效问题

**🆕 新增功能**

- **@visactor/vtable**: 新增showSubTotalsOnTreeNode 到 dataConfig配置 [#4850](https://github.com/VisActor/VTable/issues/4850)

**🔨 功能重构**

- **@visactor/vtable**: 修复当有合并单元格时删除列的问题 [#4848](https://github.com/VisActor/VTable/issues/4848)
- **@visactor/vtable**: 修复单元格合并删除记录逻辑问题 [#4848](https://github.com/VisActor/VTable/issues/4848)



[更多详情请查看 v1.22.11](https://github.com/VisActor/VTable/releases/tag/v1.22.11)

# v1.22.10

2026-01-05


**🐛 功能修复**

- **@visactor/vtable**: 修复 prepareEdit 逻辑造成的一些问题
- **@visactor/vtable-plugins**: 修复del和backspace键不能删除单元格的问题
- **@visactor/vtable**: 修复透视图非笛卡尔坐标系的图表类型中显示指标标题问题


**🆕 新增功能**

- **@visactor/vtable-gantt**: 甘特图依赖性支持自定义拐点距离taskbar的长度



[更多详情请查看 v1.22.10](https://github.com/VisActor/VTable/releases/tag/v1.22.10)

# v1.22.9

2025-12-28


**🐛 功能修复**

- **@visactor/vtable**: toggleSelectAll 应该只选中当前选项. fix[#4838](https://github.com/VisActor/VTable/issues/4838)
- **@visactor/vtable**: 修复二级显示长度问题
- **@visactor/vtable**: 修复透视图没有左侧轴的情况
- **@visactor/vtable**: 修复维度提示延迟逻辑错误
- **@visactor/vtable**: 修复编辑器中文输入法第一个字符识别问题 [#4847](https://github.com/VisActor/VTable/issues/4847)
- **@visactor/vtable**: 修复过滤插件与子标题的问题

**🔨 功能重构**

- **@visactor/vtable-gantt**: 识别甘特图任务栏毫秒
- **@visactor/vtable**: 修复没有轴时计算列宽逻辑
- **@visactor/vtable**: 修复编辑器中文输入法第一个字符识别问题 [#4847](https://github.com/VisActor/VTable/issues/4847)

[更多详情请查看 v1.22.9](https://github.com/VisActor/VTable/releases/tag/v1.22.9)

# v1.22.8

2025-12-17


**🆕 新增功能**

- **@visactor/vtable-sheet**: vtable-sheet 支持跨表格计算公式
- **@visactor/vtable-sheet**: vtable-sheet 支持从 excel 文件中导入多个表格
- **@visactor/vtable**: vtable 支持导出多个sheet到excel文件
- **@visactor/vtable-plugins**: 过滤插件支持更新样式 api. close[#4790](https://github.com/VisActor/VTable/issues/4790)
- **@visactor/vtable-plugins**: 过滤插件支持自定义样式. close[#4720](https://github.com/VisActor/VTable/issues/4720)
- **@visactor/vtable-plugins**: 过滤菜单隐藏或显示时触发事件. close[#4784](https://github.com/VisActor/VTable/issues/4784)


**🐛 功能修复**

- **@visactor/vtable**: 透视表设置 grid-tree 小计值不显示 [#4815](https://github.com/VisActor/VTable/issues/4815)
- **@visactor/vtable**: 更新选项时滚动条错误
- **@visactor/vtable**: 过滤开关启用错误. fix[#4783](https://github.com/VisActor/VTable/issues/4783)
- **@visactor/vtable**: 更新表格数据后应用过滤. fix[#4785](https://github.com/VisActor/VTable/issues/4785)
- **@visactor/vtable**: 更新表格数据后更新过滤状态和键. fix[#4787](https://github.com/VisActor/VTable/issues/4787)
- **@visactor/vtable**: 选择 none 不生效. fix[#4792](https://github.com/VisActor/VTable/issues/4792)
- **@visactor/vtable**: 更新表格数据后更新复选框状态. fix[#4795](https://github.com/VisActor/VTable/issues/4795)
- **@visactor/vtable**: 删除键下不应完成编辑单元格
- **@visactor/vtable**: 透视图联动 getAxis 节点错误
- **@visactor/vtable**: 按下回车键时面板隐藏. fix[#4813](https://github.com/VisActor/VTable/issues/4813)

**📖 文档更新**

- **@visactor/vtable**: 补充 chartDimensionLinkage 示例



[更多详情请查看 v1.22.8](https://github.com/VisActor/VTable/releases/tag/v1.22.8)

# v1.22.7

2025-12-08


**🆕 新增功能**

- **@visactor/vtable**: 调整列宽resize支持设置canResizeColumn函数 [#4764](https://github.com/VisActor/VTable/issues/4764)

**🐛 功能修复**

- **@visactor/vtable**: 透视图轴配置zero和range矛盾问题修复

**🔨 功能重构**

- **@visactor/vtable**: 优化透视图tooltip联动效果
- **@visactor/vtable-plugins**: 当表格记录变化时过滤插件自动更新筛选项



[更多详情请查看 v1.22.7](https://github.com/VisActor/VTable/releases/tag/v1.22.7)

# v1.22.6

2025-12-02


**🆕 新增功能**

- **@visactor/vtable-sheet**: 支持复制公式到粘贴单元格
- **@visactor/vtable-sheet**: 支持公式利用填充柄自动填充

**🐛 功能修复**

- **@visactor/vtable**: 修复excel键盘插件删除和退格键不生效问题
- **@visactor/vtable**: 透视表修复行/列维度中区分空值和空字符串值
- **@visactor/vtable-plugins**: 修复点击过滤插件时无法正常打开的问题 [#4736](https://github.com/VisActor/VTable/issues/4736)
- **@visactor/vtable-plugins**: 修复过滤插件显示时搜索输入框值不清空的问题 [#4736](https://github.com/VisActor/VTable/issues/4736)



[更多详情请查看 v1.22.6](https://github.com/VisActor/VTable/releases/tag/v1.22.6)

# v1.22.5

2025-11-26


**🆕 新增功能**

- **@visactor/vtable**: 支持透视图右侧轴配置 [#4723](https://github.com/VisActor/VTable/issues/4723)
- **@visactor/vtable**: 支持透视图维度联动配置

**🐛 功能修复**

- **@visactor/vtable**: 修复matchDimensionPath方法中nodeChildren为空检查



[更多详情请查看 v1.22.5](https://github.com/VisActor/VTable/releases/tag/v1.22.5)

# v1.22.4

2025-11-18


**🐛 功能修复**

- **@visactor/vtable**: 修复getCellAdressByHeaderPath匹配算法回溯问题 [#4680](https://github.com/VisActor/VTable/issues/4680)
- **pivot-table**: 修复冻结列数设置为0时的无效问题 [#4680](https://github.com/VisActor/VTable/issues/4680)
- **@visactor/vtable**: 修复序列号无法编辑问题 [#4627](https://github.com/VisActor/VTable/issues/4627)

**🔨 功能重构**

- **@visactor/vtable**: 过滤插件优化filterState变化接口
- **@visactor/vtable-plugins**: 主从表插件展开收起配置优化



[更多详情请查看 v1.22.4](https://github.com/VisActor/VTable/releases/tag/v1.22.4)

# v1.22.3

2025-11-07


**🆕 新增功能**

- **@visactor/vtable-sheet**: 新增 dragOrder 配置，支持拖拽行或列顺序
- **@visactor/vtable**: 新增 api getCellRowHeaderFullPaths 方法，支持获取透视表单元格的行表头完整路径
- **@visactor/vtable**: 在透视图中支持 boxPlot 图表类型

**🐛 功能修复**

- **@visactor/vtable-sheet**: 修复拖拽列位置问题 [#4645](https://github.com/VisActor/VTable/issues/4645)
- **@visactor/vtable**: 修复左上角渲染边框线问题 [#4677](https://github.com/VisActor/VTable/issues/4677)
- **@visactor/vtable**: 修复 vue-vtable 的 getTargetGroup 方法 [#4663](https://github.com/VisActor/VTable/issues/4663)

**🔨 功能重构**

- **@visactor/vtable**: 优化 overscrollBehavior 设置为 none 交互效果 [#4675](https://github.com/VisActor/VTable/issues/4675)



[更多详情请查看 v1.22.3](https://github.com/VisActor/VTable/releases/tag/v1.22.3)

# v1.22.2

2025-10-29


**🆕 新增功能**

- **@visactor/vtable-sheet**: 新增拖拽行或列顺序功能
- **@visactor/vtable-sheet**: 新增拖拽列顺序功能，支持更新和计算公式
- **@visactor/vtable-sheet**: 新增删除或添加行和列后调整公式依赖关系功能
- **@visactor/vtable**: 新增 refValue 参数，支持 vue-vtable 动态渲染编辑时使用 v-model [#4597](https://github.com/VisActor/VTable/issues/4597)

**🐛 功能修复**

- **@visactor/vtable**: 拖拽行顺序更新 rowHeightMap
- **@visactor/vtable**: 使用行系列编号合并单元格时选择状态错误
- **@visactor/vtable**: 调整列宽后图例标题位置错误 [#4629](https://github.com/VisActor/VTable/issues/4629)
- **@visactor/vtable**: 修复透视图标记线布局问题
- **@visactor/vtable**: 修复表格容器调整大小事件问题 [#4558](https://github.com/VisActor/VTable/issues/4558)
- **@visactor/vtable**: 修复 vue-vtable 动态渲染编辑问题 [#4621](https://github.com/VisActor/VTable/issues/4621)

**🔨 功能重构**

- **@visactor/vtable**: 优化宽度自适应模式计算逻辑
- **@visactor/vtable**: 使用 vrender api 替换 requestAnimationFrame [#4619](https://github.com/VisActor/VTable/issues/4619)
- **@visactor/vtable-sheet**: 支持小写字母公式上下文 [#4628](https://github.com/VisActor/VTable/issues/4628)


[更多详情请查看 v1.22.2](https://github.com/VisActor/VTable/releases/tag/v1.22.2)

# v1.22.0

2025-10-17


**🆕 新增功能**

- **@visactor/vtable-plugins**: 新增主从表能力的插件
- **@visactor/vtable-sheet**: 针对新增或删除行和列的情况，优化处理公式计算
- **@visactor/vtable**: 新增getFilteredRecords方法到ListTable [#4537](https://github.com/VisActor/VTable/issues/4537)

**🐛 功能修复**

- **@visactor/vtable**: 修复PivotTable的getFilteredRecords方法 [#4537](https://github.com/VisActor/VTable/issues/4537)
- **@visactor/vtable**: 修复HighlightHeaderWhenSelectCellPlugin插件的options解析问题



[更多详情请查看 v1.22.0](https://github.com/VisActor/VTable/releases/tag/v1.22.0)

# v1.21.1

2025-10-14


**🐛 功能修复**

- **@visactor/vtable-gantt**: 修复甘特图缩放轴组件及时释放问题



[更多详情请查看 v1.21.1](https://github.com/VisActor/VTable/releases/tag/v1.21.1)

# v1.21.0

2025-10-13


**🆕 新增功能**

- **@visactor/vtable-gantt**: 甘特图新增缩放zoom交互功能

**🐛 功能优化**

- **@visactor/vtable**: 优化PivotTable的updateFilterRules方法新增isResetTree参数 [#4450](https://github.com/VisActor/VTable/issues/4450)



[更多详情请查看 v1.21.0](https://github.com/VisActor/VTable/releases/tag/v1.21.0)

# v1.20.3

2025-10-11


**🐛 功能修复**

- **@visactor/vtable**: 修复粘贴 HTML 到单元格失效的问题 [#4551](https://github.com/VisActor/VTable/issues/4551)
- **@visactor/vtable**: 修复使用键盘方向键 arrowUp 和 arrowDown 选择公式项项的问题
- **@visactor/vtable**: 修复配置 rightFrozenColCount 时双击使右侧冻结列自动列宽分割线未更新问题 [#4526](https://github.com/VisActor/VTable/issues/4526)



[更多详情请查看 v1.20.3](https://github.com/VisActor/VTable/releases/tag/v1.20.3)

# v1.20.2

2025-10-09


**🐛 功能修复**

- **@visactor/vtable**: 重构 vtable-plugins 和 vtable-sheet 组件的 UMD 构建产物
- **@visactor/vtable**: 搜索组件clear方法问题修复 [#4476](https://github.com/VisActor/VTable/issues/4476)
- **@visactor/vtable-sheet**: 编辑表格组件使用键盘选择公式选择项后enter，arrow键不生效问题修复

**📖 文档更新**

- **@visactor/vtable**: vtable sheet UMD 导入指南



[更多详情请查看 v1.20.2](https://github.com/VisActor/VTable/releases/tag/v1.20.2)

# v1.20.1

2025-09-26


**🆕 新增功能**

- **@visactor/vtable**: 透视图扩展图表类型
- **@visactor/vtable**: 支持在选取vchart时使用detailPath，添加detectPickChartItem配置

**🐛 功能修复**

- **@visactor/vtable**: 修复调用deleteRecord和renderWidthCreateCells api，switchState错误 [#4436](https://github.com/VisActor/VTable/issues/4436)
- **@visactor/vtable**: 修复设置浏览器缩放时maxfrozenwidth不生效 [#4494](https://github.com/VisActor/VTable/issues/4494)
- **@visactor/vtable-gantt**: 修复甘特图网格线样式linedash不生效 [#4495](https://github.com/VisActor/VTable/issues/4495)
- **@visactor/vtable**: 修复updateOption时更改enablecheckboxcascade不生效 [#4499](https://github.com/VisActor/VTable/issues/4499)
- **@visactor/vtable**: 修复api selectCells在ctrlMultiSelect为false时不生效
- **@visactor/vtable**: 修复分页时行顺序更改不生效



[更多详情请查看 v1.20.1](https://github.com/VisActor/VTable/releases/tag/v1.20.1)

# v1.20.0

2025-09-22


**🆕 新增功能**

- **@visactor/vtable-sheet**: 新增vtable-sheet组件
- **@visactor/vtable**: 新增 keyboardOption.cutSelected配置

**🔧 项目配置**

- **@visactor/vtable**: 更新vrender版本至1.0.16


[更多详情请查看 v1.20.0](https://github.com/VisActor/VTable/releases/tag/v1.20.0)

# v1.19.9

2025-09-12


**🆕 新增功能**

- **@visactor/vtable**: 添加 disableSelectOnContextMenu 配置项
- **@visactor/vtable-gantt**: 甘特图任务条进度百分比可调整

**🐛 功能修复**

- **@visactor/vtable**: 添加 isReleased 检查，增强健壮性
- **@visactor/vtable**: 修复填充句柄不显示的错误 [#4376](https://github.com/VisActor/VTable/issues/4376)

**🔨 功能重构**

- **@visactor/vtable**: 优化在 Windows 系统上的库构建流程



[更多详情请查看 v1.19.9](https://github.com/VisActor/VTable/releases/tag/v1.19.9)

# v1.19.8

2025-08-29


**🐛 功能修复**

- **@visactor/vtable**: 修复 getLayoutRowTree api 错误 [#4346](https://github.com/VisActor/VTable/issues/4346)
- **@visactor/vtable**: 修复当有多列展开时 columnTree 场景图节点 y 值错误 [#4357](https://github.com/VisActor/VTable/issues/4357)
- **@visactor/vtable**: 当数据透视表仅有指标无维度时 columnWidthConfig 不生效 [#4388](https://github.com/VisActor/VTable/issues/4388)

**🔨 功能重构**

- **@visactor/vtable**: 补充 contextmenu-click 事件参数 [#4364](https://github.com/VisActor/VTable/issues/4364)



[更多详情请查看 v1.19.8](https://github.com/VisActor/VTable/releases/tag/v1.19.8)

# v1.19.7

2025-08-19


**🆕 新增功能**

- **@visactor/vtable**: 新增 ignoreFrozenCols 配置，用于设置冻结列的样式
- **@visactor/vtable**: 新增 CONTEXTMENU_CANVAS 事件类型

**🐛 功能修复**

- **@visactor/vtable**: 修复当设置隐藏列时，带有子列的列报错的问题 [#4223](https://github.com/VisActor/VTable/issues/4223)
- **@visactor/vtable**: 修复甘特图刷新容器大小的问题 [#4319](https://github.com/VisActor/VTable/issues/4319)
- **@visactor/vtable**: 修复当使用 InputEditor 更新 groupBy 配置时，同步组折叠状态时报错的问题 [#4216](https://github.com/VisActor/VTable/issues/4216)

**🔨 功能重构**

- **@visactor/vtable**: 当记录较少时，不需要显示滚动条时，滚动条不显示

[更多详情请查看 v1.19.7](https://github.com/VisActor/VTable/releases/tag/v1.19.7)

# v1.19.6

2025-08-08


**🆕 新增功能**

- **@visactor/vtable**: 透视图pivot chart 添加 columnWidthConfig 配置

**🐛 功能修复**

- **@visactor/vtable**: 修复透视图设置 columnHierarchyType 为 gird 时展开树时报错 [#4254](https://github.com/VisActor/VTable/issues/4254)
- **@visactor/vtable-gantt**: 修复当没有数据records时markline渲染错误 [#4305](https://github.com/VisActor/VTable/issues/4305)

**🔨 功能重构**

- **@visactor/vtable**: 添加表格导出插件



[更多详情请查看 v1.19.6](https://github.com/VisActor/VTable/releases/tag/v1.19.6)

# v1.19.5

2025-07-31


**🆕 新增功能**

- **@visactor/vtable**: 新增 enableHeaderCheckboxCascade option
- **@visactor/vtable-gantt**:  甘特图组件新增 move_end_task_bar 事件.[#4266](https://github.com/VisActor/VTable/issues/4266)

**🐛 功能修复**

- **@visactor/vtable**: 修复setCellCheckboxState 在tree列设置无效的问题

**🔨 功能重构**

- **@visactor/vtable**: 删除和添加数据时同步更新复选框状态checkstate [#4240](https://github.com/VisActor/VTable/issues/4240)



[更多详情请查看 v1.19.5](https://github.com/VisActor/VTable/releases/tag/v1.19.5)

# v1.19.4

2025-07-28


**🆕 新增功能**

- **@visactor/vtable**: rowSeriesNumber 支持配置field 对应record中字段 [#3902](https://github.com/VisActor/VTable/issues/3902)
- **@visactor/vtable**: 添加 enableCheckboxCascade 选项 可以取消checkbox级联 [#4130](https://github.com/VisActor/VTable/issues/4130)
- **@visactor/vtable**: 添加 groupConfig 替代 groupBy 和 group** & 添加 titleCheckbox [#4130](https://github.com/VisActor/VTable/issues/4130)
- **@visactor/vtable**: 添加 getRecordHierarchyState 接口，并修复更改表头位置参数 [#4226](https://github.com/VisActor/VTable/issues/4226)
- **@visactor/vtable**: 添加 paste-add-row 插件以支持扩展行数或列数

**🐛 功能修复**

- **@visactor/vtable**: 修复vchart透明背景颜色覆盖掉单元格悬停颜色问题 [#4245](https://github.com/VisActor/VTable/issues/4245)
- **@visactor/vtable**: 修复透视表中加载图标更新问题 [#4236](https://github.com/VisActor/VTable/issues/4236)

**🔨 功能重构**

- **@visactor/vtable**: 更新合并单元格性能 [#3293](https://github.com/VisActor/VTable/issues/3293)
- **@visactor/vtable**: 滚动时隐藏菜单列表 [#4214](https://github.com/VisActor/VTable/issues/4214)


[更多详情请查看 v1.19.4](https://github.com/VisActor/VTable/releases/tag/v1.19.4)

# v1.19.3

2025-07-09


**🆕 新增功能**

- **@visactor/vtable**: 添加 eventOptions.contextmenuReturnAllSelectedCells [#4064](https://github.com/VisActor/VTable/issues/4064)
-  **@visactor/vtable**: 添加批量展开或折叠所有树节点

**🐛 功能修复**

- **@visactor/vtable**: 修复在使用groupBy时单击触发编辑单元格无效的问题 [#4172](https://github.com/VisActor/VTable/issues/4172)
- **@visactor/vtable**: 修复粘贴单元格时的validateCellVaule问题 [#4174](https://github.com/VisActor/VTable/issues/4174) [#1797](https://github.com/VisActor/VTable/issues/1797)
- **@visactor/vtable**: 修复容器resize后冻结列样式不可见问题
-  **@visactor/vtable**: 修复粘贴validateValue缺少position表参数 [#4164](https://github.com/VisActor/VTable/issues/4164)
-  **@visactor/vtable**: 修复动画注册进度问题
-  **@visactor/vtable**: 修复：修复调整容器大小后冻结列不可见的问题 [#3836](https://github.com/VisActor/VTable/issues/3836)




[更多详情请查看 v1.19.3](https://github.com/VisActor/VTable/releases/tag/v1.19.3)

# v1.19.2

2025-07-01


**🆕 新增功能**

- **@visactor/vtable**: 列表表格支持表头层级跨度
- **@visactor/vtable-plugins**: 添加导入Excel文件插件
- **@visactor/vtable-gantt**: 甘特图外边框支持数组配置


**🐛 功能修复**

- **@visactor/vtable**: 修复导出Excel时templateLink问题 [#4106](https://github.com/VisActor/VTable/issues/4106)
- **@visactor/vtable**: 修复使用deleteRecords删除列表树根级别时的错误
- **@visactor/vtable**: 修复自动填充宽度状态下的minWidth和maxWidth问题 [#4100](https://github.com/VisActor/VTable/issues/4100)
- **@visactor/vtable**: 修复带聚合时updateColumns发生错误
- **@visactor/vtable**: 编辑透视表指标值时总计值应同步更新
- **@visactor/vtable**: 修复自定义聚合时的合并渲染错误
- **@visactor/vtable**: 修复列表树删除数据时的bug [#3991](https://github.com/VisActor/VTable/issues/3991)
- **@visactor/vtable**: 修复安装boolean类型的某个字段分组时无法渲染false值的问题 [#4059](https://github.com/VisActor/VTable/issues/4059)



[更多详情请查看 v1.19.2](https://github.com/VisActor/VTable/releases/tag/v1.19.2)

# v1.19.1

2025-06-20


**🆕 新增功能**

- **@visactor/vtable**: 修复使用 containerFit 滚动时底部边框错误问题 [#3337](https://github.com/VisActor/VTable/issues/3337)

**🐛 功能修复**

- **@visactor/vtable**: 修复复制 tooltip 文本后无法复制的问题 [#3968](https://github.com/VisActor/VTable/issues/3968)
- **@visactor/vtable**: 修复当 cellType 为 progressBar 时图标配置不生效的问题 [#4047](https://github.com/VisActor/VTable/issues/4047)

**🔧 项目配置**

- **@visactor/vtable**: 更新 vrender 1.0.5 修复动画 bug



[更多详情请查看 v1.19.1](https://github.com/VisActor/VTable/releases/tag/v1.19.1)

# v1.19.0

2025-06-16


**🆕 新增功能**

- **@visactor/vtable-gantt**: 添加任务条最小尺寸配置 [#4016](https://github.com/VisActor/VTable/issues/4016)
- **@visactor/vtable-gantt**: 支持不同依赖关系连接线具有不同样式 [#4016](https://github.com/VisActor/VTable/issues/4016)
- **@visactor/vtable**: 添加 containerFit 配置以支持表格尺寸适配
- **@visactor/vtable**: 添加 仿WPS 填充柄功能插件
- **@visactor/vtable**: 为 updateColumns API 添加 clearColWidthCache 配置项，用于清除列宽缓存

**🐛 功能修复**

- **@visactor/vtable**: 某些 taskShowMode 应该计算 vtable 上的所有行高 [#4011](https://github.com/VisActor/VTable/issues/4011)
- **@visactor/vtable**: gif 停止动画时释放资源 [#4029](https://github.com/VisActor/VTable/issues/4029)

**🔧 项目配置**

- **@visactor/vtable**: 更新至 vrender 1.0.0



[更多详情请查看 v1.19.0](https://github.com/VisActor/VTable/releases/tag/v1.19.0)

# v1.18.5

2025-06-09


**🆕 新增功能**

- **@visactor/vtable-vue**: 添加vue-table导出类型 /es/*.d.ts

**🐛 功能修复**

- **@visactor/vtable**: 修复PivotChart中node-canvas范围问题 [#3997](https://github.com/VisActor/VTable/issues/3997)
- **@visactor/vtable**: 指针抬起时设置isDown为false
- **@visactor/vtable**: 修复拖动选择不停止的问题 [#3895](https://github.com/VisActor/VTable/issues/3895)
- **@visactor/vtable**: 修复当设置visible为'focus'时滚动条不显示的问题 [#3914](https://github.com/VisActor/VTable/issues/3914)
- **@visactor/vtable**: 右键菜单子菜单显示位置应根据底部调整 [#3867](https://github.com/VisActor/VTable/issues/3867)
- **@visactor/vtable**: 修复在排序状态和分组情况下过滤数据发生错误的问题 [#3961](https://github.com/VisActor/VTable/issues/3961) 


[更多详情请查看 v1.18.5](https://github.com/VisActor/VTable/releases/tag/v1.18.5)

# v1.18.4

2025-05-27


**🆕 新增功能**

- **@visactor/vtable**: 新增事件 pasted_data event [#3908](https://github.com/VisActor/VTable/issues/3908)
- **@visactor/vtable-gantt**: 给markline添加 date position 定位类型 
- **@visactor/vtable-gantt**: 里程碑 milestone 支持配置文本text
- **@visactor/vtable-gantt**: 任务信息可配置type = 'project'表示项目类型
- **@visactor/vtable-gantt**: 新增任务条展示模式 tasksShowMode 'Project_Sub_Tasks_Inline'

**🐛 功能修复**

- **@visactor/vtable**: 修复当有scale时，图表矩阵报错问题 [#3910](https://github.com/VisActor/VTable/issues/3910)



[更多详情请查看 v1.18.4](https://github.com/VisActor/VTable/releases/tag/v1.18.4)

# v1.18.3

2025-05-13


**🆕 新增功能**

- **@visactor/vtable**: 在主题中添加 frozenColumnLine visible 配置 [#3828](https://github.com/VisActor/VTable/issues/3828)
- **@visactor/vtable**: 为甘特图添加 touch 事件 [#3864](https://github.com/VisActor/VTable/issues/3864)
- **@visactor/vtable-gantt**: 任务条支持文本不隐藏自适应显示到任务条外部 [#3802](https://github.com/VisActor/VTable/issues/3802)
- **@visactor/vtable**: 为导出插件添加 exportAllData 配置 [#3726](https://github.com/VisActor/VTable/issues/3726)

**🐛 功能修复**

- **@visactor/vtable**: 当没有配置rowTree时，tree 模式下报错 [#3830](https://github.com/VisActor/VTable/issues/3830)
- **@visactor/vtable**: 修复当点击功能按钮点击时意外激活编辑状态 [#3831](https://github.com/VisActor/VTable/issues/3831)
- **@visactor/vtable**: 修复当点击 resize图标后再点击 linkPonitNode 时，触发任务条调整宽度问题 [#3829](https://github.com/VisActor/VTable/issues/3829)



[更多详情请查看 v1.18.3](https://github.com/VisActor/VTable/releases/tag/v1.18.3)

# v1.18.2

2025-04-30


**🐛 功能修复**

- **@visactor/vtable**: 当 records 为空时，updateColumns 接口报错 [#3766](https://github.com/VisActor/VTable/issues/3766)
- **@visactor/vtable**: 使用 dataSource 对象做数据源，调用 updateOption 接口报错 [#3768](https://github.com/VisActor/VTable/issues/3768)
- **@visactor/vtable**: 隐藏透视表表头时，查找 headerPath 错误 [#3791](https://github.com/VisActor/VTable/issues/3791)
- **@visactor/vtable**: 补充自适应 widthAdaptiveMode 逻辑 [#3796](https://github.com/VisActor/VTable/issues/3796)
- **@visactor/vtable**: 启用 groupBy 时，跳过聚合行的序号计算
- **@visactor/vtable**: 在聚合中隐藏 rowSeriesNumber 和复选框 [#2173](https://github.com/VisActor/VTable/issues/2173)

**🔨 功能重构**

- **@visactor/vtable**: 使用 vglobal 更改事件监听器 [#3734](https://github.com/VisActor/VTable/issues/3734)
- **@visactor/vtable**: 插件更新机制 [#3788](https://github.com/VisActor/VTable/issues/3788)
- **@visactor/vtable**: 添加转换表格插件


[更多详情请查看 v1.18.2](https://github.com/VisActor/VTable/releases/tag/v1.18.2)


# v1.18.1

2025-04-21


**🐛 功能修复**

- **@visactor/vtable**: 修复当拖拽滚动条时，控制台报错问题 #3770 [#3766](https://github.com/VisActor/VTable/issues/3770)


# v1.18.0 
  v1.17.7 版本相同内容

2025-04-17

**💥 Breaking change**

- **@visactor/vtable**: 修复 switch 默认方向问题 [#3667](https://github.com/VisActor/VTable/issues/3667)
- **@visactor/vtable-editors**: 修改了input编辑器中的默认样式

**🆕 新增功能**
- **@visactor/vtable-plugins**: 新增 行列新增 行列序号 excel键盘对齐等插件
- **@visactor/vtable**: 新增 onBeforeCacheChartImage 事件
- **@visactor/vtable**: 支持 customConfig disableBuildInChartActive 配置
- **@visactor/vtable**: 在 theme.selectionStyle 中新增 dynamicUpdateSelectionSize 配置

**🐛 功能修复**

- **@visactor/vtable**: 修复 getCellsRect() 中表格大小问题 [#3681](https://github.com/VisActor/VTable/issues/3681)
- **@visactor/vtable**: 修复配置 rowSeriesNumber 时列索引计算错误问题
- **@visactor/vtable**: 修复图片闪烁问题 [#3588](https://github.com/VisActor/VTable/issues/3588)
- **@visactor/vtable**: 修复 text-stick 中行/列更新问题 [#3744](https://github.com/VisActor/VTable/issues/3744)



[更多详情请查看 v1.17.7](https://github.com/VisActor/VTable/releases/tag/v1.17.7)

# v1.17.6

2025-04-10


**🆕 新增功能**

- **@visactor/vtable**: ListTable的changeCellValue方法新增tiggerEvent参数
- **@visactor/vtable**: ListTable表头支持层级结构

**🐛 功能修复**

- **@visactor/vtable**: 修复移动树节点位置时代码报错问题 [#3645](https://github.com/VisActor/VTable/issues/3645) [#3706](https://github.com/VisActor/VTable/issues/3706)
- **@visactor/vtable**: 修复边框设置数组时底部线条位置渲染错误 [#3684](https://github.com/VisActor/VTable/issues/3684)
- **@visactor/vtable**: 修复移动端触摸事件调整列宽问题 [#3693](https://github.com/VisActor/VTable/issues/3693)
- **@visactor/vtable**: 修复设置冻结时禁用拖拽选择不生效问题 [#3702](https://github.com/VisActor/VTable/issues/3702)
- **@visactor/vtable**: 修复react-custom-layout组件中flex布局更新问题 [#3696](https://github.com/VisActor/VTable/issues/3696)
- **@visactor/vtable**: 修复updateTaskRecord接口问题 [#3639](https://github.com/VisActor/VTable/issues/3639)
- **@visactor/vtable**: 修复重复调用computeColsWidth自适应模式结果错误问题



[更多详情请查看 v1.17.6](https://github.com/VisActor/VTable/releases/tag/v1.17.6)

# v1.17.5

2025-04-02


**🆕 新增功能**

- **@visactor/vtable**: 单元格支持标记功能 [#3583](https://github.com/VisActor/VTable/issues/3583)
- **@visactor/vtable**: 重构透视表在无列或无行情况下的角落处理 [#3653](https://github.com/VisActor/VTable/issues/3653)

**🐛 功能修复**

- **@visactor/vtable**: 修复甘特图刻度设置季度解析问题 [#3612](https://github.com/VisActor/VTable/issues/3612)
- **@visactor/vtable**: 修复甘特图 overscrollBehavior 无效问题 [#3638](https://github.com/VisActor/VTable/issues/3638)
- **@visactor/vtable**: 修复树形模式下甘特图 updateRecords 错误 [#3639](https://github.com/VisActor/VTable/issues/3639)
- **@visactor/vtable**: 修复设置自适应高度模式时行高错误 [#3640](https://github.com/VisActor/VTable/issues/3640)
- **@visactor/vtable**: 修复设置异步渲染图表时 setRecords API 渲染错误 [#3661](https://github.com/VisActor/VTable/issues/3661)
- **@visactor/vtable**: 修复合并单元格复选框状态更新问题 [#3668](https://github.com/VisActor/VTable/issues/3668)

**🔨 功能重构**

- **@visactor/vtable**: 重构填充句柄功能 [#3582](https://github.com/VisActor/VTable/issues/3582)



[更多详情请查看 v1.17.5](https://github.com/VisActor/VTable/releases/tag/v1.17.5)

# v1.17.4

2025-03-31

**🆕 新增功能**

- **@visactor/vtable**: 在进度条中添加条形标记样式配置 [#3616](https://github.com/VisActor/VTable/issues/3616)

**🐛 功能修复**

- **@visactor/vtable**: 修复按钮样式问题 [#3614](https://github.com/VisActor/VTable/issues/3614)
- **@visactor/vtable**: 修复复选框状态顺序更新问题 [#3606](https://github.com/VisActor/VTable/issues/3606)
- **@visactor/vtable**: 为合并单元格范围添加自定义标记 [#3504](https://github.com/VisActor/VTable/issues/3504)
- **@visactor/vtable**: 修复树形复选框状态更新问题
- **@visactor/vtable**: 禁用分组标题编辑器

[更多详情请查看 v1.17.4](https://github.com/VisActor/VTable/releases/tag/v1.17.4)

# v1.17.3

2025-03-24

**🆕 新增功能**

- **@visactor/vtable**: 行序号支持单选按钮类型 [#3558](https://github.com/VisActor/VTable/issues/3558)
- **@visactor/vtable**: 在 react-vtable 中添加自定义 reactAttributePlugin
- **@visactor/vtable**: 添加 maintainedColumnCount 配置

**🐛 功能修复**

- **@visactor/vtable**: 修复选择合并单元格扩展范围问题 [#3529](https://github.com/VisActor/VTable/issues/3529)
- **@visactor/vtable**: 修复设置 cellInnerBorder 为 false 时边框渲染错误 [#3574](https://github.com/VisActor/VTable/issues/3574)
- **@visactor/vtable**: 修复带圆角单元格的边框问题
- **@visactor/vtable**: 修复坐标轴标签自动大小计算
- **@visactor/vtable**: 修复小窗口大小下冻结列数问题
- **@visactor/vtable**: 修复 columnWidthConfig 维度匹配错误
- **@visactor/vtable**: 修复 React 组件更新问题 [#3474](https://github.com/VisActor/VTable/issues/3474)
- **@visactor/vtable**: 修复右键选择问题
- **@visactor/vtable**: 修复行更新范围问题 [#3468](https://github.com/VisActor/VTable/issues/3468)

[更多详情请查看 v1.17.3](https://github.com/VisActor/VTable/releases/tag/v1.17.3)

# v1.17.2

2025-03-11

**🐛 功能修复**

- **@visactor/vue-vtable**: 修复 custom container value 问题

[更多详情请查看 v1.17.2](https://github.com/VisActor/VTable/releases/tag/v1.17.2)

# v1.17.1

2025-03-10

**🆕 新增功能**

- **@visactor/vtable**: 透视表新增 setLoadingHierarchyState API [#3469](https://github.com/VisActor/VTable/issues/3469)
- **@visactor/vtable**: 在 dragOrder 选项中新增 validateDragOrderOnEnd 配置 [#3493](https://github.com/VisActor/VTable/issues/3493)
- **@visactor/vtable**: sortByIndicatorRule 支持 sortFunc 配置 [#3508](https://github.com/VisActor/VTable/issues/3508)
- **@visactor/vtable-gantt**: 甘特图支持创建标记线
- **@visactor/vtable**: customCellStyle 支持函数配置 [#3483](https://github.com/VisActor/VTable/issues/3483)

**🐛 功能修复**

- **@visactor/vtable**: 移动端下钻图标状态更新 [#3485](https://github.com/VisActor/VTable/issues/3485)
- **@visactor/vtable**: 激活右键交互 [#3482](https://github.com/VisActor/VTable/issues/3482)

**🔧 项目配置**

- **@visactor/vtable**: 更新 vrender 版本

[更多详情请查看 v1.17.1](https://github.com/VisActor/VTable/releases/tag/v1.17.1)

# v1.17.0

2025-02-26

**💥 Breaking change**

- **@visactor/vtable**: 删除 loading 加载图标的自动注册，需要手动注册，具体可以参考教程：/guide/table_type/List_table/tree_list

**🆕 新增功能**

- **@visactor/vtable-gantt**: 甘特图 scale 时间表头支持可见性设置 [#3098](https://github.com/VisActor/VTable/issues/3098)
- **@visactor/vtable**: 下拉菜单支持函数配置 [#3443](https://github.com/VisActor/VTable/issues/3443)
- **@visactor/vtable-gantt**: 新增 grid 网格垂直线依赖于时间轴的配置 [#3467](https://github.com/VisActor/VTable/issues/3467)
- **@visactor/vtable**: 新增 activateChartInstance 和 replaceChartCacheImage API
- **@visactor/vtable**: 新增 `specTransformInCell` 配置，支持修改透视表每个单元格的 VChart 规范
- **@visactor/vtable**: 新增开关和按钮类型单元格

**🐛 功能修复**

- **@visactor/vtable**: 修复释放实例后，调整大小事件发生错误的问题 [#3459](https://github.com/VisActor/VTable/issues/3459)
- **@visactor/vtable**: 修复设置 autoFillWidth 时行号列宽度不变的问题 [#3459](https://github.com/VisActor/VTable/issues/3459)
- **@visactor/vtable-gantt**: 修复调整任务条开始或结束时间时树节点更新错误的问题 [#3460](https://github.com/VisActor/VTable/issues/3460)
- **@visactor/vtable**: 修复 node 环境配置
- **@visactor/vtable**: 修复动画中行列为小数的问题 [#3455](https://github.com/VisActor/VTable/issues/3455)
- **@visactor/vtable**: 修复轮播中高度为小数的问题 [#3458](https://github.com/VisActor/VTable/issues/3458)

**📖 文档更新**

- **@visactor/vtable**: 更新 Rush 的更新日志

[更多详情请查看 v1.17.0](https://github.com/VisActor/VTable/releases/tag/v1.17.0)

# v1.16.2

2025-02-19

**🐛 功能修复**

- **@visactor/vtable**: 修复字段名包含点号时出现的错误 [#3409](https://github.com/VisActor/VTable/issues/3409)
- **@visactor/vtable**: 修复 getChartInstance 方法中 vchart updateViewBox 的参数 [#3442](https://github.com/VisActor/VTable/issues/3442)
- **@visactor/vtable**: 修复 computeAxisComponentWidth 的返回值向上取整 [#3444](https://github.com/VisActor/VTable/issues/3444)
- **@visactor/vtable**: 修复 getCheckboxState() 中的排序函数 [#3394](https://github.com/VisActor/VTable/issues/3394)

[更多详情请查看 v1.16.2](https://github.com/VisActor/VTable/releases/tag/v1.16.2)

# v1.16.1

2025-02-14

**🆕 新增功能**

- **@visactor/vtable**: 为列宽调整添加 visibleOnHover 设置 [#3349](https://github.com/VisActor/VTable/issues/3349)
- **@visactor/vtable**: 甘特图的 barStyle 支持函数配置 [#3364](https://github.com/VisActor/VTable/issues/3364)

**🐛 功能修复**

- **@visactor/vtable**: 修复当 rowHierarchyType 为 tree 时，总计值显示在顶部不生效的问题 [#3322](https://github.com/VisActor/VTable/issues/3322)
- **@visactor/vtable**: 修复当列有自定义聚合时编辑单元格更新的问题 [#3333](https://github.com/VisActor/VTable/issues/3333)
- **@visactor/vtable**: 进度条类型现在仅支持数字而非小数 [#3401](https://github.com/VisActor/VTable/issues/3401)
- **@visactor/vtable**: 禁用双击列边框时自动调整列宽的功能
- **@visactor/vtable**: 修复表体组框架更新问题 [#3404](https://github.com/VisActor/VTable/issues/3404)
- **@visactor/vtable**: 修复 react-vtable 中 DOM 定位问题 [#3314](https://github.com/VisActor/VTable/issues/3314)
- **@visactor/vtable**: 修复 getHierarchyState() 中 groupBy 判断问题 [#3406](https://github.com/VisActor/VTable/issues/3406)
- **@visactor/vtable**: 修复排序后复选框状态问题 [#3394](https://github.com/VisActor/VTable/issues/3394)

**🔨 功能重构**

- **@visactor/vtable**: 进度条类型单元格支持自定义布局 [#3295](https://github.com/VisActor/VTable/issues/3295)
- **@visactor/vtable**: 补充主题冻结框架样式边框创建 [#3400](https://github.com/VisActor/VTable/issues/3400)

[更多详情请查看 v1.16.1](https://github.com/VisActor/VTable/releases/tag/v1.16.1)

# v1.16.0

2025-02-08

**🆕 新增功能**

- **@visactor/vtable**: 在 downloadCsv&downloadExcel 中支持异步操作
- **@visactor/vtable**: linkJump 和 linkDetect 支持函数配置
- **@visactor/vtable**: 在 customLayout 函数中支持 react17
- **@visactor/vtable**: 在 vue-vtable 中添加 keepColumnWidthChange 配置 [#3346](https://github.com/VisActor/VTable/issues/3346)
- **@visactor/vtable**: 为透视表添加网格树形结构模式:`rowHierarchyType: grid-tree` 和 `columnHierarchyType: grid-tree`

**🐛 功能修复**

- **@visactor/vtable-gantt**: 调整甘特图视图大小时需要更新依赖节点大小 [#3287](https://github.com/VisActor/VTable/issues/3287)
- **@visactor/vtable-gantt**: 修复调整或移动任务条时更新记录的问题 [#3321](https://github.com/VisActor/VTable/issues/3321)
- **@visactor/vtable-gantt**: 修复更新 scale 时任务条大小时的错误 [#3348](https://github.com/VisActor/VTable/issues/3348)
- **@visactor/vtable-gantt**: 修复甘特图中鼠标悬停在最后日期边界时出现的错误 [#3373](https://github.com/VisActor/VTable/issues/3373)
- **@visactor/vtable**: 修复 getCellOverflowText() 中的裁剪判断
- **@visactor/vtable**: 修复媒体点击事件中的行数据错误 [#3342](https://github.com/VisActor/VTable/issues/3342)
- **@visactor/vtable**: 修复函数单元格类型中的表头复选框状态 [#3334](https://github.com/VisActor/VTable/issues/3334)
- **@visactor/vtable**: 修复文本垂直布局问题 [#3353](https://github.com/VisActor/VTable/issues/3353)
- **@visactor/vtable**: 修复表格搜索中合并单元格样式更新问题 [#3327](https://github.com/VisActor/VTable/issues/3327)

**🔨 功能重构**

- **@visactor/vtable**: 行序号单元格现可使用主题表头样式 [#3362](https://github.com/VisActor/VTable/issues/3362)

[更多详情请查看 v1.16.0](https://github.com/VisActor/VTable/releases/tag/v1.16.0)

# v1.15.2

2025-01-26

**🆕 新增功能**

- **@visactor/vtable**: 进度条中 dependField&batType 配置支持函数配置

[更多详情请查看 v1.15.2](https://github.com/VisActor/VTable/releases/tag/v1.15.2)

# v1.15.1

2025-01-17

**🆕 新增功能**

- **@visactor/vtable**: 添加 emptyTip 点击事件
- **@visactor/vtable**: canvasWidth canvasHeight 支持'auto'设置 [#3089](https://github.com/VisActor/VTable/issues/3089)
- **@visactor/vtable**: 在基本表 tree 及 group 模式中支持添加数据及更新数据接口
- **@visactor/vtable**: 添加 groupTitleFieldFormat API [#3092](https://github.com/VisActor/VTable/issues/3092)

**🐛 功能修复**

- **@visactor/vtable-gantt**: 当鼠标离开甘特图时应触发 mouseleave_taskbar 事件 [#3294](https://github.com/VisActor/VTable/issues/3294)
- **@visactor/vtable**: 修复调整窗口大小时的空提示布局问题 [#3312](https://github.com/VisActor/VTable/issues/3312)
- **@visactor/vtable**: 在 handleTextStick() 中移除树形结构限制 [#3274](https://github.com/VisActor/VTable/issues/3274)

[更多详情请查看 v1.15.1](https://github.com/VisActor/VTable/releases/tag/v1.15.1)

# v1.15.0

2025-01-09

**🆕 新增功能**

- **@visactor/vtable**: 透视表支持注册自定义聚合类型 [#1508](https://github.com/VisActor/VTable/issues/1508)
- **@visactor/vtable**: 优化透视表中的 frozenColCount 功能工作正常 [#3201](https://github.com/VisActor/VTable/issues/3201)
- **@visactor/vtable-gantt**: 添加 moveToExtendDateRange 选项，可以拖拽超出甘特图日期范围时自动扩展日期 [#3221](https://github.com/VisActor/VTable/issues/3221)
- **@visactor/vtable-gantt**: 添加 keyboardOptions 选项，并添加了 delete_dependency_link 和 contextmenu_dependency_link 事件 [#3268](https://github.com/VisActor/VTable/issues/3268)
- **@visactor/vtable**: customMergeCell 支持数组配置 [#3202](https://github.com/VisActor/VTable/issues/3202)
- **@visactor/vtable**: 在 emptyTip 中添加 displayMode
- **@visactor/vtable**: groupby 支持数组配置
- **@visactor/vtable**: 在 react-component 中添加 penetrateEventList 配置
- **@visactor/vtable**: 在 react-vtable 中添加 keepColumnWidthChange 属性
- **@visactor/vtable**: 在 customConfig 中添加 imageAnonymous
- **@visactor/vtable**: 透视表中的 aggregationType 为 custom 时配合 aggregationFun 使用 [#1508](https://github.com/VisActor/VTable/issues/1508)

**🐛 功能修复**

- **@visactor/vtable**: 当所有列都隐藏时，不应该生成单元格 id [#3199](https://github.com/VisActor/VTable/issues/3199)
- **@visactor/vtable**: 修复当头部树指示器节点有不同的值时，columnWidthConfig 不起作用 [#3258](https://github.com/VisActor/VTable/issues/3258)
- **@visactor/vtable-gantt**: 当调整任务栏的宽度时，文本标签应该更新 [#3263](https://github.com/VisActor/VTable/issues/3263)
- **@visactor/vtable-gantt**: 当左边的表格设置为自动宽度时，甘特图渲染错误 [#3266](https://github.com/VisActor/VTable/issues/3266)
- **@visactor/vtable-gantt**: 将 taskRecord 类型从 string 改为 any
- **@visactor/vtable**: 修复树形结构表头中的聚合显示问题
- **@visactor/vtable**: 修复折叠复选框状态更新问题 [#3171](https://github.com/VisActor/VTable/issues/3171)
- **@visactor/vtable**: 在 dataset 中设置记录时，清除排序目标
- **@visactor/vtable**: 修复 react-dom-component 中的冻结更新问题
- **@visactor/vtable**: 修复 getCheckboxState()中的迭代器映射问题 [#3177](https://github.com/VisActor/VTable/issues/3177) [#3239](https://github.com/VisActor/VTable/issues/3239)

**📖 文档更新**

- **@visactor/vtable**: 添加天气日历演示
- **@visactor/vtable**: 添加日程可创建文档

[更多详情请查看 v1.15.0](https://github.com/VisActor/VTable/releases/tag/v1.15.0)

# v1.14.3

2024-12-27

**🆕 新增功能**

- **@visactor/vtable**: 透视表指标及维度的 showSort 支持函数配置 [#2630](https://github.com/VisActor/VTable/issues/2630)
- **@visactor/vtable**: 透视表指标支持设置 hide 隐藏功能 [#2257](https://github.com/VisActor/VTable/issues/2257) [#2451](https://github.com/VisActor/VTable/issues/2451)
- **@visactor/vtable**: 添加 enableTreeCheckbox 配置 groupBy 分组模式下支持复选框交互

**🐛 功能修复**

- **@visactor/vtable**: 修复 borderLineWidth 数组配置 [#3183](https://github.com/VisActor/VTable/issues/3183)
- **@visactor/vtable**: 当设置 resizable 为 false 时，悬停任务栏出现错误 [#3189](https://github.com/VisActor/VTable/issues/3189)

[更多详情请查看 v1.14.3](https://github.com/VisActor/VTable/releases/tag/v1.14.3)

# v1.14.1

2024-12-23

**🆕 新增功能**

- **@visactor/vtable-gantt**: 添加 grid 配置支持行背景颜色和列背景颜色、周末背景颜色 [#3155](https://github.com/VisActor/VTable/issues/3155)

**🐛 功能修复**

- **@visactor/vtable-gantt**: 甘特图任务条调整宽度交互无法限制一个时间单位 [#3161](https://github.com/VisActor/VTable/issues/3161)
- **@visactor/vtable**: 修复系列 Ids 配置中的轴计数错误

**🔨 功能重构**

- **@visactor/vtable**: 添加选项 tableSizeAntiJitter 防止容器宽高小数情况下表格抖动[#3160](https://github.com/VisActor/VTable/issues/3160)

[更多详情请查看 v1.14.1](https://github.com/VisActor/VTable/releases/tag/v1.14.1)

# v1.14.0

2024-12-20

**🆕 新增功能**

- **@visactor/vtable-gantt**：甘特图添加 contextmenu_task_bar 事件 #3013
- **@visactor/vtable-gantt**：甘特图添加里程碑类型 #3097
- **@visactor/vtable**：添加合并单元格功能以支持更详细的条件
- **@visactor/vtable**：在数据透视表中支持刻度对齐
- **@visactor/vtable-gantt**：添加更新标记线接口
- **@visactor/vtable**：在 vtable 编辑器的 validateValue 中添加枚举类型 #3039

**🐛 修复**

- **@visactor/vtable**：validateValue 非 Promise 情况无法被回调 #3144
- **@visactor/vtable**：调整表格组上的滚动热区限制 #3152
- **@visactor/vtable**：修复树状表格中 React 组件的更新问题
- **@visactor/vtable**：修复自定义样式更新不生效的问题 #3068
- **@visactor/vtable**：修复 vtable 导出中的字体粗细问题 #3005
- **@visactor/vtable**：修复图形 HTML 属性错误
- **@visactor/vtable**：在 react-vtable 的 UMD 文件中定义应用程序 #3093
- **@visactor/vtable**：修复 react-vtable 中的自定义渲染错误 #3142
- **@visactor/vtable**：修复组标题链接点击问题 #3022
- **@visactor/vtable**：修复滚动时单元格组判断问题 #3149
- **@visactor/vtable**：修复文本测量中的下划线高度问题 #3112
- **@visactor/vtable**：将 checkboxState 改为 Map 类型

**🔨 重构**

- **@visactor/vtable**：自定义计算行高逻辑

[更多详情请查看 v1.14.0](https://github.com/VisActor/VTable/releases/tag/v1.14.0)

# v1.13.2

2024-12-16

**🆕 新增功能**

- **@visactor/vtable-gantt**: 任务条调整大小和可移动支持函数配置 [#3074](https://github.com/VisActor/VTable/issues/3074)
- **@visactor/vtable-gantt**: 添加 updateOption 和 updateScales API

**🐛 功能修复**

- **@visactor/vtable**: 在 iframe 中进行复制权限检查 [#3077](https://github.com/VisActor/VTable/issues/3077)
- **@visactor/vtable**: 当有选中单元格时调整列宽或行高出错 [#3085](https://github.com/VisActor/VTable/issues/3085)
- **@visactor/vtable-gantt**: 考虑未设置 minDate 和 maxDate 时调用 setRecords API

[更多详情请查看 v1.13.2](https://github.com/VisActor/VTable/releases/tag/v1.13.2)

# v1.13.1

2024-12-13

**🆕 新增功能**

- **@visactor/vtable-gantt**: 甘特图时间单位支持时分秒级别 [#2976](https://github.com/VisActor/VTable/issues/2976)

**🐛 功能修复**

- **@visactor/vtable-gantt**: 处理 tableWidth 设置为 'auto' 情况下的表格整体宽度自动适应问题 [#3033](https://github.com/VisActor/VTable/issues/3033)

[更多详情请查看 v1.13.1](https://github.com/VisActor/VTable/releases/tag/v1.13.1)

# v1.13.0

2024-12-09

**🆕 新增功能**

- **@visactor/vtable**：添加键盘 ctrlMultiSelect 配置 [#2995](https://github.com/VisActor/VTable/issues/2995)
- **@visactor/vtable**：在 Popover 中添加 panelStyle 和 arrowStyle 配置 [#2988](https://github.com/VisActor/VTable/issues/2988)

**🐛 功能修复**

- **@visactor/vtable**：当 select 设置为 disableSelect 时，选择不起作用 [#2981](https://github.com/VisActor/VTable/issues/2981)
- **@visactor/vtable**：修复 checkbox/radio 中的 textAlign 问题 [#2908](https://github.com/VisActor/VTable/issues/2908)
- **@visactor/vtable**：菜单元素中的 outsideClickDeselect 事件
- **@visactor/vtable**：修复 getCellMergeRange() 中的列和行范围问题 [#2906](https://github.com/VisActor/VTable/issues/2906)
- **@visactor/vtable**：修复合并单元格选择范围更新问题 [#2944](https://github.com/VisActor/VTable/issues/2944)
- **@visactor/vtable**：修复 tree_hierarchy_state_change 事件中 ListTreeStickCellPlugin 的更新问题 [#2914](https://github.com/VisActor/VTable/issues/2914)
- **@visactor/vtable**：修复 \_refreshHierarchyState() 中的行更新范围问题 [#2987](https://github.com/VisActor/VTable/issues/2987)
- **@visactor/vtable**: 修复文字 baseline 对齐问题

[更多详情请查看 v1.13.0](https://github.com/VisActor/VTable/releases/tag/v1.13.0)

# v1.12.0

2024-12-03

**🆕 新增功能**

- **@visactor/vtable**: 添加选项 customComputeRowHeight，并且 defaultRowHeight 可以设置为 "auto"
- **@visactor/vtable-gantt**: 为甘特图添加 taskShowMode 选项 [#2849](https://github.com/VisActor/VTable/issues/2849)

**🐛 功能修复**

- **@visactor/vtable-gantt**: 编辑记录任务日期时更新任务栏出现错误 [#2938](https://github.com/VisActor/VTable/issues/2938)
- **@visactor/vtable**: 修复最后一列和最后一行编辑器的大小问题 [#2926](https://github.com/VisActor/VTable/issues/2926)
- **@visactor/vtable**: 修复 CustomCellStylePlugin 中的单元格更新事件问题 [#2927](https://github.com/VisActor/VTable/issues/2927)
- **@visactor/vtable**: 修复树模式下的 React 组件更新问题
- **@visactor/vtable**: 修复 computeRowHeight() 中的默认行高问题 [#2903](https://github.com/VisActor/VTable/issues/2903)
- **@visactor/vtable**: 修复调整表格大小时图例可见性的问题
- **@visactor/vtable**: 修复 Icon.loadGif() 中的缓存问题 [#2905](https://github.com/VisActor/VTable/issues/2905)
- **@visactor/vtable**: 修复合并单选单元格的选中状态更新问题 [#2881](https://github.com/VisActor/VTable/issues/2881)
- **@visactor/vtable**: 修复 updateCell() 中的 strokeArrayWidth 更新问题 [#2811](https://github.com/VisActor/VTable/issues/2811)

**📖 文档更新**

- **@visactor/vtable-gantt**: 添加 getTaskBarRelativeRect API [#2920](https://github.com/VisActor/VTable/issues/2920)

[更多详情请查看 v1.12.0](https://github.com/VisActor/VTable/releases/tag/v1.12.0)

# v1.11.5

2024-11-29

**🆕 新增功能**

- **@visactor/vtable**: 添加 @visactor/vtable-plugins 包

**📖 文档更新**

- **@visactor/vtable**: 更新进入或离开节点时的事件文档
- **@visactor/vtable**: 更新甘特图事件文档，暴露整个 e 的信息

[更多详情请查看 v1.11.5](https://github.com/VisActor/VTable/releases/tag/v1.11.5)

# v1.11.3

2024-11-28

**🐛 功能修复**

- **@visactor/vtable**: 冻结图表在调整行或列宽时不更新 [#2876](https://github.com/VisActor/VTable/issues/2876)
- **@visactor/vtable**: 修复 deleteRecords API 中的自定义组件更新问题

**🔨 功能重构**

- **@visactor/vtable**: 当 columnWidthConfig 设置错误维度时应判断此情况 [#2948](https://github.com/VisActor/VTable/issues/2948)

[更多详情请查看 v1.11.3](https://github.com/VisActor/VTable/releases/tag/v1.11.3)

# v1.11.2

2024-11-26

**🆕 新增功能**

- **@visactor/vtable**: 添加 select makeSelectCellVisible [#2840](https://github.com/VisActor/VTable/issues/2840)
- **@visactor/vtable**: 在 stateManager 中添加 setCustomSelectRanges [#2750](https://github.com/VisActor/VTable/issues/2750) [#2845](https://github.com/VisActor/VTable/issues/2845)
- **@visactor/vtable**: 优化 HeaderHighlightPlugin 中的范围选择
- **@visactor/vtable**: isShowOverflowTextTooltip 支持函数
- **@visactor/vtable**: 单元格支持多自定义样式 [#2841](https://github.com/VisActor/VTable/issues/2841)
- **@visactor/vtable**: templateLink 支持函数 [#2847](https://github.com/VisActor/VTable/issues/2847)
- **@visactor/vtable**: 在 tooltip 配置中添加 position [#2869](https://github.com/VisActor/VTable/issues/2869)
- **@visactor/vtable**: 在菜单选项中添加 parentElement

**🐛 功能修复**

- **@visactor/vtable**: 添加 isValidatingValue 状态以修复重复调用 validateValue API 的问题 [#2830](https://github.com/VisActor/VTable/issues/2830)
- **@visactor/vtable**: 在画布空白区域上移时不能正确拖动位置 [#2831](https://github.com/VisActor/VTable/issues/2831)
- **@visactor/vtable**: 调整列宽时选择状态被清除 [#2861](https://github.com/VisActor/VTable/issues/2861)
- **@visactor/vtable**: 容器调整大小时触发标记线调整大小 [#2883](https://github.com/VisActor/VTable/issues/2883)
- **@visactor/vtable**: 未设置 minDate 和 maxDate 时调用 setRecords 渲染错误 [#2892](https://github.com/VisActor/VTable/issues/2892)
- **@visactor/vtable**: 修复单元格边框虚线更新问题 [#2818](https://github.com/VisActor/VTable/issues/2818)
- **@visactor/vtable**: 修复合并单元格文本位置问题 [#2858](https://github.com/VisActor/VTable/issues/2858)
- **@visactor/vtable**: 修复函数式 padding 更新问题 [#2774](https://github.com/VisActor/VTable/issues/2774)
- **@visactor/vtable**: 修复行系列编号复选框中的全选问题 [#2880](https://github.com/VisActor/VTable/issues/2880)

**🔨 功能重构**

- **@visactor/vtable**: 设置 headerSelectMode 时，body 拖动列顺序应起作用 [#2860](https://github.com/VisActor/VTable/issues/2860)

[更多详情请查看 v1.11.2](https://github.com/VisActor/VTable/releases/tag/v1.11.2)

# v1.11.1

2024-11-21

**🆕 新增功能**

- **@visactor/vtable**: 在 stateManager 中添加 setCustomSelectRanges [#2750](https://github.com/VisActor/VTable/issues/2750) [#2845](https://github.com/VisActor/VTable/issues/2845)
- **@visactor/vtable**: 优化 HeaderHighlightPlugin 中的范围选择
- **@visactor/vtable**: isShowOverflowTextTooltip 支持函数

**🐛 功能修复**

- **@visactor/vtable**: 添加 isValidatingValue 状态以修复重复调用 validateValue API 的问题 [#2830](https://github.com/VisActor/VTable/issues/2830)
- **@visactor/vtable**: 在画布空白区域上移时不能正确拖动位置 [#2831](https://github.com/VisActor/VTable/issues/2831)
- **@visactor/vtable**: 修复单元格边框虚线更新问题 [#2818](https://github.com/VisActor/VTable/issues/2818)
- **@visactor/vtable**: 修复合并单元格文本位置问题 [#2858](https://github.com/VisActor/VTable/issues/2858)

[更多详情请查看 v1.11.1](https://github.com/VisActor/VTable/releases/tag/v1.11.1)

# v1.11.0

2024-11-15

**🆕 新增功能**

- **@visactor/vtable**: 增加日历图
- **@visactor/vtable**: 增加反选高亮插件
- **@visactor/vtable**: 增加轮播动画插件
- **@visactor/vtable**: 增加表头高亮插件
- **@visactor/vtable**: 增加 changing_header_position 事件
- **@visactor/vtable**: 增加 change_header_position_fail 事件
- **@visactor/vtable-gantt**: 增加拖拽高亮标记线
- **@visactor/vtable**: 增加树形结构 recalculateColWidths api 参数 [#2817](https://github.com/VisActor/VTable/issues/2817)

**🐛 功能修复**

- **@visactor/vtable**：修复透视图饼图类型选定状态不起作用 [#2178](https://github.com/VisActor/VTable/issues/2178)
- **@visactor/vtable**：修复透视图玫瑰图单击图例然后悬停图表渲染错误 [#2209](https://github.com/VisActor/VTable/issues/2209)
- **@visactor/vtable**：修复当图表行冻结时渲染错误 [#2800](https://github.com/VisActor/VTable/issues/2800)
- **@visactor/vtable**：修复选择范围后不存在问题 [#2804](https://github.com/VisActor/VTable/issues/2804)
- **@visactor/vtable**：修复当 widthMode 为自适应时，调用 renderWithRecreateCells 不应影响 colWidth [#2835]（https://github.com/VisActor/VTable/issues/2835）

**🔨 功能重构**

- **@visactor/vtable**: 设置 disableSelect 时，selectCell api 可调用 [#2799](https://github.com/VisActor/VTable/issues/2799)

[更多详情请查看 v1.11.0](https://github.com/VisActor/VTable/releases/tag/v1.11.0)

# v1.10.5

2024-11-11

**🐛 功能修复**

181 / 5,000

- **@visactor/vtable**: 修复数据透视图规范启用选择不起作用 [#2210](https://github.com/VisActor/VTable/issues/2210)
- **@visactor/vtable**: 修复 sortState 字段未定义发生错误

[更多详情请查看 v1.10.5](https://github.com/VisActor/VTable/releases/tag/v1.10.5)

# v1.10.4

2024-11-07

**🆕 新增功能**

- **@visactor/vtable-gantt**：甘特图依赖关系线支持树节点 [#2701](https://github.com/VisActor/VTable/issues/2701)
- **@visactor/vtable**：在标题上拖动时可以连续选择单元格 [#2751](https://github.com/VisActor/VTable/issues/2751)

**🐛 功能修复**

- **@visactor/vtable-gantt**: 修复当标记线日期小于 minDate 时不应显示 [#2689](https://github.com/VisActor/VTable/issues/2689)
- **@visactor/vtable**: 修复数据透视表标题图标显示不正确 [#2735](https://github.com/VisActor/VTable/issues/2735)
- **@visactor/vtable**: 修复当用户设置轴时解析轴配置错误 [#2749](https://github.com/VisActor/VTable/issues/2749)
- **@visactor/vtable**: 修复 cellType 设置函数发生错误 [#2754](https://github.com/VisActor/VTable/issues/2754)
- **@visactor/vtable**: 修复当数据透视表单元格类型设置为图表而非数据单元格时渲染错误[#2758](https://github.com/VisActor/VTable/issues/2758)
- **@visactor/vtable**: 修复图例问题 [#2764](https://github.com/VisActor/VTable/issues/2764) [#2755](https://github.com/VisActor/VTable/issues/2755)
- **@visactor/vtable-gantt**: 修复创建任务计划日期错误 [#2771](https://github.com/VisActor/VTable/issues/2771)
- **@visactor/vtable**: 修复数据透视表中的单元格位置 [#2694](https://github.com/VisActor/VTable/issues/2694)
- **@visactor/vtable**: 修复菜单比例位置问题[#2734](https://github.com/VisActor/VTable/issues/2734)
- **@visactor/vtable**：修复树冻结行问题 [#2619](https://github.com/VisActor/VTable/issues/2619)

[更多详情请查看 v1.10.4](https://github.com/VisActor/VTable/releases/tag/v1.10.4)

# v1.10.3

2024-11-01

**🐛 功能修复**

- **@visactor/vtable**: 修复类型 columnWidthConfig 定义

[更多详情请查看 v1.10.3](https://github.com/VisActor/VTable/releases/tag/v1.10.3)

# v1.10.2

2024-11-01

**🆕 新增功能**

- **@visactor/vtable**: 添加 headerSelectMode 选项的可设置 body [#2491](https://github.com/VisActor/VTable/issues/2491)
- **@visactor/vtable**: 添加 freeze_click 事件 [#2641](https://github.com/VisActor/VTable/issues/2641)
- **@visactor/vtable**: 透视表添加 columnWidthConfig 以根据维度设置宽度 [#2696](https://github.com/VisActor/VTable/issues/2696)

**🐛 功能修复**

- **@visactor/vtable**: 修正 isColumnHeader api 判断逻辑 [#2491](https://github.com/VisActor/VTable/issues/2491)
- **@visactor/vtable**: 修复当折叠最后一个分组时发生错误 [#2600](https://github.com/VisActor/VTable/issues/2600)
- **@visactor/vtable**: 修复最小聚合器类型处理 NaN 值 [#2627](https://github.com/VisActor/VTable/issues/2627)
- **@visactor/vtable**: 修复当拖拽行系列编号单元格时不滚动问题 [#2647](https://github.com/VisActor/VTable/issues/2647)
- **@visactor/vtable**: 修复当行系列编号被冻结时可以渲染自定义布局问题 [#2653](https://github.com/VisActor/VTable/issues/2653)
- **@visactor/vtable**: 修复当有空提示时滚动条不能被点击的问题 [#2690](https://github.com/VisActor/VTable/issues/2690)
- **@visactor/vtable**: 修复当字段设置为数组时，记录没有对应的字段，发生错误的问题 [#2702](https://github.com/VisActor/VTable/issues/2702)
- **@visactor/vtable**: 修复当同时有甘特图和表格时，内部主题不应该被更改的问题 [#2708](https://github.com/VisActor/VTable/issues/2708)
- **@visactor/vtable**: 修复检查状态更新 [#2667](https://github.com/VisActor/VTable/issues/2667)
- **@visactor/vtable**: 修复列表编辑器空间问题
- **@visactor/vtable**: 更改 pointerupoutside 事件回调 [#2674](https://github.com/VisActor/VTable/issues/2674) [#2659](https://github.com/VisActor/VTable/issues/2659)
- **@visactor/vtable**: 在 react-vtable 中补充 vtable 中事件
- **@visactor/vtable**: 在选择所有中添加 selected_cell 事件 [#2664](https://github.com/VisActor/VTable/issues/2664)
- **@visactor/vtable**: 修复选择所有中的 disableRowSeriesNumberSelect [#2665](https://github.com/VisActor/VTable/issues/2665)
- **@visactor/vtable**: 修复自适应模式下的标题调整大小问题 [#2704](https://github.com/VisActor/VTable/issues/2704)

**🔨 功能重构**

- **@visactor/vtable**: 自定义合并单元格忽略检查状态判断 [#2683](https://github.com/VisActor/VTable/issues/2683)
- **@visactor/vtable**: 粘贴单元格值应该使用编辑器验证 api [#2691](https://github.com/VisActor/VTable/issues/2691)

[更多详情请查看 v1.10.2](https://github.com/VisActor/VTable/releases/tag/v1.10.2)

# v1.10.1

2024-10-23

**🐛 功能修复**

- **@visactor/vtable**: 当设置行系列编号时排序图标不更新 [#2643](https://github.com/VisActor/VTable/issues/2643)
- **@visactor/vtable**: 当没有边框时禁用 cellInnerBorder

[更多详情请查看 v1.10.1](https://github.com/VisActor/VTable/releases/tag/v1.10.1)

# v1.10.0

2024-10-18

**🆕 新增功能**

- **@visactor/vtable**: 在菜单容器中添加 maxHeight [#2602](https://github.com/VisActor/VTable/issues/2602)
- **@visactor/vtable**: 添加 after_sort 事件
- **@visactor/vtable-gantt**: 添加未计划任务记录的创建按钮
- **@visactor/vtable-gantt**: 为甘特图添加依赖线
- **@visactor/vtable-gantt**: 添加任务条选中样式
- **@visactor/vtable-gantt**: 添加依赖线选中样式
- **@visactor/vtable-gantt**: 为甘特图添加 underlayBackgroundColor [#2607](https://github.com/VisActor/VTable/issues/2607)

**🐛 功能修复**

- **@visactor/vtable**: 当维度路径包含虚拟时无法识别问题 [#2510](https://github.com/VisActor/VTable/issues/2510)
- **@visactor/vtable**: toggleHierarchyState api 无法更新自定义布局单元格 [#2609](https://github.com/VisActor/VTable/issues/2609)
- **@visactor/vtable**: 修复图例布局问题
- **@visactor/vtable**: 修复 borderLineWidth 为 0 时边框矩形缺失的问题
- **@visactor/vtable**: 修复 updateSortState()中的多排序图标更新问题 [#2614](https://github.com/VisActor/VTable/issues/2614)
- **@visactor/vtable**: 修复 createGroupForFirstScreen()中的列/行结束问题 [#2585](https://github.com/VisActor/VTable/issues/2585)
- **@visactor/vtable**: 修复 react-vtable 中的 customConfig
- **@visactor/vtable**: 修复当垂直滚动时行调整标记位置的问题 [#2606](https://github.com/VisActor/VTable/issues/2606)
- **@visactor/vtable**: 修复列表-表格转置中的排序图标更新问题

[更多详情请查看 v1.10.0](https://github.com/VisActor/VTable/releases/tag/v1.10.0)

# v1.9.1

2024-10-12

**🐛 功能修复**

- **@visactor/vtable**: 修复合并单元格中的排序图标更新问题

[更多详情请查看 v1.9.1](https://github.com/VisActor/VTable/releases/tag/v1.9.1)

# v1.9.0

2024-10-11

**🆕 新增功能**

- **@visactor/vtable**: 增加 scrollTo 动画功能

**🐛 功能修复**

- **@visactor/vtable**: 修复无数据时维度列宽计算 [#2515](https://github.com/VisActor/VTable/issues/2515)
- **@visactor/vtable**: 修复 updateColumns 调用时的聚合更新 [#2519](https://github.com/VisActor/VTable/issues/2519)
- **@visactor/vtable**: 修复 pointerdown 事件中 outsideClickDeselect 判断时机 [#2553](https://github.com/VisActor/VTable/issues/2553)
- **@visactor/vtable**: 修复序号列排序问题 [#2558](https://github.com/VisActor/VTable/issues/2558)
- **@visactor/vtable**: 修复底部单元格选中无法自动滚动问题 [#2546](https://github.com/VisActor/VTable/issues/2546)
- **@visactor/vtable**: 修复自定义组件自动行高列宽的计算问题
- **@visactor/vtable**: 修复拖拽行列时自定义组件的闪烁问题 [#2516](https://github.com/VisActor/VTable/issues/2516)
- **@visactor/vtable**: 修复冻结单元格中自定义组件的更新问题 [#2568](https://github.com/VisActor/VTable/issues/2568)
- **@visactor/vtable**: 修复带有 padding 的图例布局计算
- **@visactor/vtable**: 修复创建单元格时的 cellLocation 计算问题 [#2517](https://github.com/VisActor/VTable/issues/2517)
- **@visactor/vtable**: 修复合并单元格选中区域记录 [#2521](https://github.com/VisActor/VTable/issues/2521)

**🔨 功能重构**

- **@visactor/vtable**: 异步单元格样式获取增加等待 [#2549](https://github.com/VisActor/VTable/issues/2549)

[更多详情请查看 v1.9.0](https://github.com/VisActor/VTable/releases/tag/v1.9.0)

# v1.8.2

2024-10-08

**🐛 功能修复**

- **@visactor/vtable**: 修复富文本图标状态更新问题 [#2281](https://github.com/VisActor/VTable/issues/2281)

[更多详情请查看 v1.8.2](https://github.com/VisActor/VTable/releases/tag/v1.8.2)

# v1.8.1

2024-09-30

**🔨 功能重构**

- **@visactor/vue-vtable**: 重命名 vue 组件

[更多详情请查看 v1.8.1](https://github.com/VisActor/VTable/releases/tag/v1.8.1)

# v1.8.0

2024-09-29

**🆕 新增功能**

- **@visactor/vue-vtable**: 添加了 vue-vtable 组件

**🐛 功能修复**

- **@visactor/vtable**: 修复了位置计算问题针对接口 updateAutoRow() [#2494](https://github.com/VisActor/VTable/issues/2494)
- **@visactor/vtable**: 修复了拖动检查状态更新 [#2518](https://github.com/VisActor/VTable/issues/2518)
- **@visactor/vtable**: 修复了 vtable-export 中分组单元格的问题 [#2487](https://github.com/VisActor/VTable/issues/2487)
- **@visactor/vtable**: 修复了在调整列宽时，React 组件更新的问题
- **@visactor/vtable**: theme 主题中添加了 functionalIconsStyle 配置[#1308](https://github.com/VisActor/VTable/issues/1308)

[更多详情请查看 v1.8.0](https://github.com/VisActor/VTable/releases/tag/v1.8.0)

[更多详情请查看 v1.7.9](https://github.com/VisActor/VTable/releases/tag/v1.7.9)

# v1.7.8

2024-09-24

**🆕 新增功能**

- **@visactor/vtable**: 处理数据集文件中的自定义树结构，以重构 processRecord 函数 [#2279](https://github.com/VisActor/VTable/issues/2279)
- **@visactor/vtable**: 在 vtable-export 中添加异步支持 [#2460](https://github.com/VisActor/VTable/issues/2460)

**🐛 功能修复**

- **@visactor/vtable**: 自定义总值无法工作 [#2455](https://github.com/VisActor/VTable/issues/2455)
- **@visactor/vtable**: 调整排序图标方向 [#2465](https://github.com/VisActor/VTable/issues/2465)
- **@visactor/vtable**: 当前编辑不存在时，无法触发新编辑单元格 [#2469](https://github.com/VisActor/VTable/issues/2469)
- **@visactor/vtable**: 无记录时编辑单元格值出错 [#2474](https://github.com/VisActor/VTable/issues/2474)
- **@visactor/vtable**: 在选项上设置聚合功能不起作用 [#2459](https://github.com/VisActor/VTable/issues/2459)
- **@visactor/vtable**: 修复在"底部-右"边框模式下单元格边框裁剪问题 [#2442](https://github.com/VisActor/VTable/issues/2442)
- **@visactor/vtable**: 在 initChildrenNodeHierarchy() 中添加 children === true hierarchyState
- **@visactor/vtable**: 修复自定义组件冻结更新问题 [#2432](https://github.com/VisActor/VTable/issues/2432)
- **@visactor/vtable**: 调整大小时触发 click_cell 事件
- **@visactor/vtable**: 修复 resetFrozen() 中 proxy.colStart 更新问题 [#2464](https://github.com/VisActor/VTable/issues/2464)
- **@visactor/vtable**: 在特殊字符集中添加"——" [#2470](https://github.com/VisActor/VTable/issues/2470)

**🔨 功能重构**

- **@visactor/vtable**: 更新记录时更新聚合器 [#2459](https://github.com/VisActor/VTable/issues/2459)

# v1.7.7

2024-09-13

**🔨 功能重构**

- **@visactor/vtable**: gantt 包导出依赖的 VTable 和 VRender 的类型

[更多详情请查看 v1.7.7](https://github.com/VisActor/VTable/releases/tag/v1.7.7)

# v1.7.6

2024-09-12

**🐛 修复问题**

- **@visactor/vtable-gantt**: 修复甘特图中设置表格主题错误的问题 [#2439](https://github.com/VisActor/VTable/pull/2439)

[查看 v1.7.6 的更多详情](https://github.com/VisActor/VTable/releases/tag/v1.7.6)

# v1.7.5

2024-09-12

**🆕 新增功能**

- **@visactor/vtable**: 添加了 getFilteredRecords API [#2255](https://github.com/VisActor/VTable/issues/2255)

**🐛 修复问题**

- **@visactor/vtable**: 修复了在选择范围点击外部时不取消选择的问题 [#2355](https://github.com/VisActor/VTable/issues/2355)
- **@visactor/vtable**: 修复了分割线位置的问题 [#2392](https://github.com/VisActor/VTable/issues/2392)
- **@visactor/vtable**: 修复了级别跨度情况下前列节点合并范围错误的问题 [#2359](https://github.com/VisActor/VTable/issues/2359)
- **@visactor/vtable**: 修复了判断值是否有效的问题 [#2402](https://github.com/VisActor/VTable/issues/2402)
- **@visactor/vtable**: 修复了在图表上 mousedown 时会去处理选择单元格并重新渲染的问题 [#2419](https://github.com/VisActor/VTable/issues/2419)
- **@visactor/vtable**: 修复了轴大小和布局的问题 [#2256](https://github.com/VisActor/VTable/issues/2256)
- **@visactor/vtable**: 修复了列表分组中的系列编号问题 [#2425](https://github.com/VisActor/VTable/issues/2425)
- **@visactor/vtable**: 修复了列表分组中 addRecord 的 recordIndex 配置问题 [#2426](https://github.com/VisActor/VTable/issues/2426)

[更多详情请查看 v1.7.5](https://github.com/VisActor/VTable/releases/tag/v1.7.5)

# v1.7.4

2024-09-09

**🆕 新增功能**

- **@visactor/vtable**: 添加 updateFilterRules api [#2245](https://github.com/VisActor/VTable/issues/2245)

**🐛 功能修复**

- **@visactor/vtable**: 树形 pivot 表格排序后展开树节点渲染错误 [#2261](https://github.com/VisActor/VTable/issues/2261)
- **@visactor/vtable**: 修复交互层 DOM 清除问题
- **@visactor/vtable**: 修复当无记录时，角头正常显示维度标题 [#2247](https://github.com/VisActor/VTable/issues/2247)
- **@visactor/vtable**: 修复数据包含 null 时的 sparkline 范围问题

**🔨 功能重构**

- **@visactor/vtable**: 优化透视图的坐标轴效果和 vchart 保持一致

[更多详情请查看 v1.7.4](https://github.com/VisActor/VTable/releases/tag/v1.7.4)

# v1.7.3

2024-09-05

**🐛 功能修复**

- **@visactor/vtable**: 修复当按下 ctrl、meta 和 shift 键时，不应触发编辑模式 # 2372
- **@visactor/vtable**: 修复自定义样式排列重复问题 [#2370](https://github.com/VisActor/VTable/issues/2370)
- **@visactor/vtable**: 修复无文本单元格自定义合并问题 [#2343](https://github.com/VisActor/VTable/issues/2343)
- **@visactor/vtable**: 修复 react-vtable 中的事件绑定问题
- **@visactor/vtable**: 修复右冻结标记位置问题 [#2344](https://github.com/VisActor/VTable/issues/2344)
- **@visactor/vtable**: 修复 cellBgColor 中的选择范围判断问题 [#2368](https://github.com/VisActor/VTable/issues/2368)

[更多详情请查看 v1.7.3](https://github.com/VisActor/VTable/releases/tag/v1.7.3)

# v1.7.2

2024-09-02

**🐛 功能修复**

- **@visactor/vtable**: 使用 groupBy 时，所有合并的单元格将 cellType 设置为文本 [#2331](https://github.com/VisActor/VTable/issues/2331)

[更多详情请查看 v1.7.2](https://github.com/VisActor/VTable/releases/tag/v1.7.2)

# v1.7.1

2024-09-02

**🐛 功能修复**

- **@visactor/react-vtable**: 修复在 react-vtable 项目中的 evns 变量问题

[更多详情请查看 v1.7.1](https://github.com/VisActor/VTable/releases/tag/v1.7.1)

# v1.7.0

2024-08-30

**🆕 New feature**

- **@visactor/vtable-gantt**: 新增甘特图 gantt chart

# v1.6.3

2024-08-29

**🆕 新增功能**

- **@visactor/vtable**: 添加 formatCopyValue 配置
- **@visactor/vtable**: 在 tooltip 中添加 parentElement 配置 [#2290](https://github.com/VisActor/VTable/issues/2290)

**🐛 功能修复**

- **@visactor/vtable**: 处理更改表头位置事件 [#2299](https://github.com/VisActor/VTable/issues/2299)
- **@visactor/vtable**: 修复 pivot tree 无法显示值和展开树时出现错误的问题 [#2306](https://github.com/VisActor/VTable/issues/2306)
- **@visactor/vtable**: 修复 titleOnDimension 全部排序无法运行的问题 [#2278](https://github.com/VisActor/VTable/issues/2278)
- **@visactor/vtable**: 在数组查找函数中添加判断 [#2289](https://github.com/VisActor/VTable/issues/2289)
- **@visactor/vtable**: 修复冻结列自定义组件裁剪问题
- **@visactor/vtable**: 修复顶部冻结行中的 cellLocation 问题 [#2267](https://github.com/VisActor/VTable/issues/2267)
- **@visactor/vtable**: 修复列表表格分组模式样式更新问题
- **@visactor/vtable**: 修复页面滚动时菜单自动隐藏的问题 [#2241](https://github.com/VisActor/VTable/issues/2241)
- **@visactor/vtable**: 修复进度条单元格 textAlign 更新问题 [#2225](https://github.com/VisActor/VTable/issues/2225)
- **@visactor/vtable**: 修复 react-vtable 中的 umd 包问题 [#2244](https://github.com/VisActor/VTable/issues/2244)
- **@visactor/vtable**: 修复 updateContainerAttrWidthAndX() 中右侧冻结大小问题 [#2243](https://github.com/VisActor/VTable/issues/2243)
- **@visactor/vtable**: 修复 getBodyLayoutRangeById() 中 leftRowSeriesNumberColumnCount 错误 [#2234](https://github.com/VisActor/VTable/issues/2234)
- **@visactor/vtable**: 修复冻结列自定义组件裁剪问题
- **@visactor/vtable**: 修复页面滚动时菜单自动隐藏的问题 [#2241](https://github.com/VisActor/VTable/issues/2241)

**🔨 功能重构**

- **@visactor/vtable**: 滚动事件添加参数 [#2249](https://github.com/VisActor/VTable/issues/2249)
- **@visactor/vtable**: changeCellValue 可以修改原始记录 [#2305](https://github.com/VisActor/VTable/issues/2305)

[更多详情请查看 v1.6.3](https://github.com/VisActor/VTable/releases/tag/v1.6.3)

# v1.6.1

2024-08-19

**💥 Breaking change**

- **@visactor/react-vtable**: 优化打包体积，删除`VTable`的导出，如果需要使用`VTable`，请安装并从相同版本的`@visactor/vtable`中导入。
- **@visactor/react-vtable**: 优化打包体积，删除`VRender`的导出，如果需要使用`VRender`，请从`@visactor/vtable/es/vrender`中导入。

**🆕 新增功能**

- **@visactor/vtable**: 新增分组渲染功能
- **@visactor/vtable**: react-vtable 中增加表格相关组件
- **@visactor/vtable**: 新增`forceShowHeader`配置
- **@visactor/vtable**: `frameStyle`中`cornerRadius`支持数组配置 [#2207](https://github.com/VisActor/VTable/issues/2207)
- **@visactor/vtable**: `textStick`配置支持配置方向
- **@visactor/vtable**: 转置列表支持`frozenRowCount`配置 [#2182](https://github.com/VisActor/VTable/issues/2182)
- **@visactor/vtable**: `vtable-export`增加`excelJSWorksheetCallback`配置

**🐛 功能修复**

- **@visactor/vtable**: 修复角头显示维度名称问题 [#2180](https://github.com/VisActor/VTable/issues/2180)
- **@visactor/vtable**: 修复`frameStyle`中`borrerLineWidth`配置为数组时渲染问题 [#2200](https://github.com/VisActor/VTable/issues/2200)
- **@visactor/vtable**: 修复`icon margin`在尺寸更新时的问题 [#2206](https://github.com/VisActor/VTable/issues/2206)
- **@visactor/vtable**: 修复`react custom layout component`容器高度问题
- **@visactor/vtable**: 修复`jsx customLayout`尺寸计算问题 [#2192](https://github.com/VisActor/VTable/issues/2192)
- **@visactor/vtable**: `vtable-export`增加默认颜色
- **@visactor/vtable**: 修复`row-series`单元格类型 [#2188](https://github.com/VisActor/VTable/issues/2188)

**🔨 功能重构**

- **@visactor/vtable**: 编辑器组件支持`backgroundColor`配置 [#1518](https://github.com/VisActor/VTable/issues/1518)

[更多详情请查看 v1.6.1](https://github.com/VisActor/VTable/releases/tag/v1.6.1)

# v1.5.6

2024-08-08

**🆕 新增功能**

- **@visactor/vtable**: 新增 canvas & viewbox 配置

**🐛 功能修复**

- **@visactor/vtable**: 修复异步释放问题 [#2145](https://github.com/VisActor/VTable/issues/2145)

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
- **@visactor/vtable**: 在 \_disableColumnAndRowSizeRound 模式下为滚动添加容差

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
- **@visactor/vtable**: 修复无法选择 Tooltip 提示内容的问题 [#2003](https://github.com/VisActor/VTable/issues/2003)
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
- **@visactor/vtable**: vtable-export 支持缩进导出
- **@visactor/vtable**: react-vtable 支持 CustomComponent & CustomLayout component 组件
- **@visactor/vtable**: PivotTable 支持 field 计算 [#1941](https://github.com/VisActor/VTable/issues/1941)

**🐛 功能修复**

- **@visactor/vtable**: 修复 updateSortState api 调用问题 [#1939](https://github.com/VisActor/VTable/issues/1939)
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

- **@visactor/vtable**: 修复 cellIsInVisualView api 调用问题 [#1864](https://github.com/VisActor/VTable/issues/1864)
- **@visactor/vtable**: 修复改变列宽时 autoWrapText 不生效问题 [#1892](https://github.com/VisActor/VTable/issues/1892)

**🔨 功能重构**

- **@visactor/vtable**: 支持 tooltip 滚动 [#1887](https://github.com/VisActor/VTable/issues/1887)
- **@visactor/vtable**: 支持透视表没有数据是的角头展示 [#1895](https://github.com/VisActor/VTable/issues/1895)
- **@visactor/vtable**: 支持 rowTree 没有 children 时的指标展示 [#1924](https://github.com/VisActor/VTable/issues/1924)

[更多详情请查看 v1.3.2](https://github.com/VisActor/VTable/releases/tag/v1.3.2)

# v1.3.1

2024-06-14

**🐛 功能修复**

- **@visactor/vtable**: 修复 frozenColCount 超过列数时的显示问题 [#1872](https://github.com/VisActor/VTable/issues/1872)
- **@visactor/vtable**: 修复合并单元格的尺寸更新问题 [#1869](https://github.com/VisActor/VTable/issues/1869)
- **@visactor/vtable**: 修复单行填充所有行时的行高更新问题

[更多详情请查看 v1.3.1](https://github.com/VisActor/VTable/releases/tag/v1.3.1)

# v1.3.0

2024-06-12

**🆕 新增功能**

- **@visactor/vtable**: vtable-export 增加 ignoreIcon&formatExportOutput 配置 [#1813](https://github.com/VisActor/VTable/issues/1813)
- **@visactor/vtable**: 增加 textArea editor
- **@visactor/vtable**: 增加 strokeColor 样式 [#1847](https://github.com/VisActor/VTable/issues/1847)
- **@visactor/vtable**: title component 增加 dx&dy 配置 [#1874](https://github.com/VisActor/VTable/issues/1874)
- **@visactor/vtable**: 增加 shrinkSparklineFirst 配置 [#1862](https://github.com/VisActor/VTable/issues/1862)
- **@visactor/vtable**: 增加 tooltip 消失延迟时间 [#1848](https://github.com/VisActor/VTable/issues/1848)
- **@visactor/vtable**: 增加透视表排序配置 [#1865](https://github.com/VisActor/VTable/issues/1865)

**🐛 功能修复**

- **@visactor/vtable**: 修复部分图标位置计算问题 [#1882](https://github.com/VisActor/VTable/issues/1882)
- **@visactor/vtable**: 修复下钻按钮点击问题 [#1899](https://github.com/VisActor/VTable/issues/1899)
- **@visactor/vtable**: 修复 frozenColCount 超过列数时的显示问题 [#1872](https://github.com/VisActor/VTable/issues/1872)
- **@visactor/vtable**: 修复\_disableColumnAndRowSizeRound 模式下文字省略问题 [#1884](https://github.com/VisActor/VTable/issues/1884)

**🔨 功能重构**

- **@visactor/vtable**: 优化内存释放逻辑 [#1856](https://github.com/VisActor/VTable/issues/1856)
- **@visactor/vtable**: 支持方向键 + shift ctrl 选中多个单元格 [#1873](https://github.com/VisActor/VTable/issues/1873)

[更多详情请查看 v1.3.0](https://github.com/VisActor/VTable/releases/tag/v1.3.0)

# v1.2.0

2024-06-06

**🆕 新增功能**

- **@visactor/vtable**: 增加 select highlightMode 效果 [#1167](https://github.com/VisActor/VTable/issues/1167)
- **@visactor/vtable**: 补充 isAggregation api [#1803](https://github.com/VisActor/VTable/issues/1803)
- **@visactor/vtable**: 优化大量列时的性能问题 [#1840](https://github.com/VisActor/VTable/issues/1840) [#1824](https://github.com/VisActor/VTable/issues/1824)
- **@visactor/vtable**: 补充合并单元格自定义图元更新 [#1718](https://github.com/VisActor/VTable/issues/1718)

**🐛 功能修复**

- **@visactor/vtable**: 修复无数据时汇总行展示 [#1804](https://github.com/VisActor/VTable/issues/1804)
- **@visactor/vtable**: 修复 updateColumns 时设置 editor 问题 [#1828](https://github.com/VisActor/VTable/issues/1828)
- **@visactor/vtable**: 修复 maxCharactersNumber 效果 [#1830](https://github.com/VisActor/VTable/issues/1830)

**🔨 功能重构**

- **@visactor/vtable**: resize 时更新 pixelRatio [#1823](https://github.com/VisActor/VTable/issues/1823)
- **@visactor/vtable**: 增加 selectAllOnCtrlA 配置

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

- **@visactor/vtable**: deleteRecord 和 updateRecord 接口调用时，更新 beforeChangedRecordsMap，以对应正确的 rawData [#1780](https://github.com/VisActor/VTable/issues/1780)
- **@visactor/vtable**: disableSelect 模式下支持拖拽表头 [#1800](https://github.com/VisActor/VTable/issues/1800)
- **@visactor/vtable**: 修复 getDataCellPath 方法中计算问题
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

- **@visactor/vtable**: 增加 setRowHeight & setColWidth api

**🐛 功能修复**

- **@visactor/vtable**: 优化 hasAutoImageColumn 方法性能
- **@visactor/vtable**: 坐标轴 size 对齐 vrender-component [#1784](https://github.com/VisActor/VTable/issues/1784)
- **@visactor/vtable**: 修复 lineClamp 配置在行高计算中的问题 [#1772](https://github.com/VisActor/VTable/issues/1772)
- **@visactor/vtable**: 修复 vtable-export 中渐进加载单元格的导出问题 [#1787](https://github.com/VisActor/VTable/issues/1787)
- **@visactor/vtable**: 在 selectCells 方法中忽略单元格合并

[更多详情请查看 v1.0.2](https://github.com/VisActor/VTable/releases/tag/v1.0.2)

# v1.0.1

2024-05-23

**🆕 新增功能**

- **@visactor/vtable**: 支持树形模式配置 icon[#1697](https://github.com/VisActor/VTable/issues/1697)
- **@visactor/vtable**: 增加 setRowHeight & setColWidth api

**🐛 功能修复**

- **@visactor/vtable**: 在 selectCells 方法中忽略单元格合并

[更多详情请查看 v1.0.1](https://github.com/VisActor/VTable/releases/tag/v1.0.1)

# v1.0.0

2024-05-21

**💥 Breaking change**

- **@visactor/vtable**: 透视表 getCellOriginRecord 接口返回结果变为数组结构

**🆕 新增功能**

- **@visactor/vtable**: 自定义树形表头 customTree 可以和透视分析能力结合使用 [#1644](https://github.com/VisActor/VTable/issues/1644)
- **@visactor/vtable**: 在 rowTree & columnTree 中加入 virtual option [#1644](https://github.com/VisActor/VTable/issues/1644)

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

- **@visactor/vtable**: 添加滚动条滑块圆角配置 scrollSliderCornerRadius [#1369](https://github.com/VisActor/VTable/issues/1369)
- **@visactor/vtable**: 在 exportCellImg()中添加禁用背景与禁用边框的功能 [#1733](https://github.com/VisActor/VTable/issues/1733)
- **@visactor/vtable**: 添加禁止列调整大小的配置 disableColumnResize 到行号配置 rowSeriesNumber 中

**🐛 功能修复**

- **@visactor/vtable**: 修复当设置隐藏行头时，单元格内容显示为空白的问题 [#1732](https://github.com/VisActor/VTable/issues/1732)
- **@visactor/vtable**: 修复在未设置列时，设置表格列编辑器会出错问题 [#1747](https://github.com/VisActor/VTable/issues/1747)
- **@visactor/vtable**: 修复在 cellInRanges()中列和行的顺序问题
- **@visactor/vtable**: 在 CSV 导出中添加字符串标记 [#1730](https://github.com/VisActor/VTable/issues/1730)

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
- **@visactor/vtable**: 在 react-vtable 中添加自定义组件

**🐛 功能修复**

- **@visactor/vtable**: 修复复制空白单元格无法粘贴的问题 [#1646](https://github.com/VisActor/VTable/issues/1646)
- **@visactor/vtable**: 修复自定义合并单元格大小更新问题 [#1636](https://github.com/VisActor/VTable/issues/1636)
- **@visactor/vtable**: 添加选择单元格范围重复选择逻辑 [#1628](https://github.com/VisActor/VTable/issues/1628)
- **@visactor/vtable**: 更新@visactor/vutils-extension 版本

[更多详情请查看 v0.25.1](https://github.com/VisActor/VTable/releases/tag/v0.25.1)

# v0.25.0

2024-04-28

**🆕 新增功能**

- **@visactor/vtable**: 透视表表头支持编辑 [#1583](https://github.com/VisActor/VTable/issues/1583)
- **@visactor/vtable**: customrender/customlayout 单元格支持编辑 [#1596](https://github.com/VisActor/VTable/issues/1596)
- **@visactor/vtable**: 支持拖拽改变行高

**🐛 功能修复**

- **@visactor/vtable**: 增加编辑器 0 值处理 [#1590](https://github.com/VisActor/VTable/issues/1590)
- **@visactor/vtable**: 修复 textStick 显示问题 [#1592](https://github.com/VisActor/VTable/issues/1592)
- **@visactor/vtable**: 修复异步渲染容器尺寸更新问题 [#1593](https://github.com/VisActor/VTable/issues/1593)
- **@visactor/vtable**: 修复折叠按钮显示问题

**🔨 功能重构**

- **@visactor/vtable**: 增加调整最后一列宽度灵活性 [#1567](https://github.com/VisActor/VTable/issues/1567)

[更多详情请查看 v0.25.0](https://github.com/VisActor/VTable/releases/tag/v0.25.0)

# v0.24.1

2024-04-23

**🆕 新增功能**

- **@visactor/vtable**: 增加 startEditCell api [#1573](https://github.com/VisActor/VTable/issues/1573)

**🐛 功能修复**

- **@visactor/vtable**: 修复 rowSeriesNumber 最大/最小宽度显示问题 [#1572](https://github.com/VisActor/VTable/issues/1572)

**🔨 功能重构**

- **@visactor/vtable**: 在透视懒加载模式下优化 setTreeNodeChildren api [#1580](https://github.com/VisActor/VTable/issues/1580)

**📖 文档更新**

- **@visactor/vtable**: 增加上钻、下钻 demo [#1556](https://github.com/VisActor/VTable/issues/1556)

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
- **@visactor/vtable**: 在 getCellValue() 中添加 skipCustomMerge 参数忽略配置的自定义合并配置 [#1543](https://github.com/VisActor/VTable/issues/1543)

**🔨 功能重构**

- **@visactor/vtable**: 当行树节点超过 8000 个时，优化性能 [#1557](https://github.com/VisActor/VTable/issues/1557)

[更多详情请查看 v0.24.0](https://github.com/VisActor/VTable/releases/tag/v0.24.0)

# v0.23.3

2024-04-16

**🆕 新增功能**

- **@visactor/vtable**: 添加 widthAdaptiveMode & heightAdaptiveMode 配置 [#1499](https://github.com/VisActor/VTable/issues/1499)
- **@visactor/vtable**: 添加 measureTextBounds API

**🐛 功能修复**

- **@visactor/vtable**: 在释放 tableInstance 时释放编辑器 [#1495](https://github.com/VisActor/VTable/issues/1495)
- **@visactor/vtable**: 修复短表格拖动到表格外时发生错误问题 [#1502](https://github.com/VisActor/VTable/issues/1502)
- **@visactor/vtable**: 行移动功能在移动端不工作 [#1503](https://github.com/VisActor/VTable/issues/1503)
- **@visactor/vtable**: 解决 defaultHeaderRowHeight 与 rowSeriesNumber 不兼容问题 [#1520](https://github.com/VisActor/VTable/issues/1520)
- **@visactor/vtable**: 修复树层级状态图标使用 rowHierarchyTextStartAlignment 子节点渲染错误问题 [#1525](https://github.com/VisActor/VTable/issues/1525)
- **@visactor/vtable**: 调整列宽度需要触发文本 textStick 变化 [#1529](https://github.com/VisActor/VTable/issues/1529)
- **@visactor/vtable**: 在 checkHaveTextStick()中修复主题 textStick 配置 [#1490](https://github.com/VisActor/VTable/issues/1490)
- **@visactor/vtable**: 在 click_cell 事件中添加按钮判断 [#1484](https://github.com/VisActor/VTable/issues/1484)
- **@visactor/vtable**: 修复 vtable-search 中的 defalultQueryMethod [#1448](https://github.com/VisActor/VTable/issues/1448)
- **@visactor/vtable**: 在 updateOption 中更新 customMergeCell [#1493](https://github.com/VisActor/VTable/issues/1493)

**🔨 功能重构**

- **@visactor/vtable**: 添加 mousedown_table 事件 [#1470](https://github.com/VisActor/VTable/issues/1470)
- **@visactor/vtable**: setRecords 处理时处理 tooltip 溢出 [#1494](https://github.com/VisActor/VTable/issues/1494)

[更多详情请查看 v0.23.3](https://github.com/VisActor/VTable/releases/tag/v0.23.3)

# v0.23.2

2024-04-11

**🆕 新增功能**

- **@visactor/vtable**: 滚动条可支持 visible 设置为 focus，当鼠标聚焦到表格时显示滚动条 [#1360](https://github.com/VisActor/VTable/issues/1360)
- **@visactor/vtable**: 树模式下添加层级文本对齐方式：rowHierarchyTextStartAlignment [#1417](https://github.com/VisActor/VTable/issues/1417)

**🐛 功能修复**

- **@visactor/vtable**: 修复合并单元格时数据操作相关 API 调用后的渲染错误 [#1286](https://github.com/VisActor/VTable/issues/1286)
- **@visactor/vtable**: 解决当拖拽列宽时自动行高不生效问题，添加 isAutoRowHeight 来处理行高计算 [#1379](https://github.com/VisActor/VTable/issues/1379)
- **@visactor/vtable**: 解决图表 Tooltip 中配置 DOM 生效问题 [#1422](https://github.com/VisActor/VTable/issues/1422)
- **@visactor/vtable**: 边框虚线效果错误处理 lineCap 设置问题 [#1436](https://github.com/VisActor/VTable/issues/1436)
- **@visactor/vtable**: 解决重复触发选中单元格事件 [#1444](https://github.com/VisActor/VTable/issues/1444)
- **@visactor/vtable**: 解决设置 disableSelect 禁用选择拖动单元格时出错 [#1461](https://github.com/VisActor/VTable/issues/1461)
- **@visactor/vtable**: 解决树层级状态图标宽度错误问题 [#1466](https://github.com/VisActor/VTable/issues/1466)
- **@visactor/vtable**: 修复透视图设置水平方向时轴 domain 顺序 [#1453](https://github.com/VisActor/VTable/issues/1453)
- **@visactor/vtable**: 在 opdateOption 中更新 columnWidthComputeMode 修复列宽计算问题 [#1465](https://github.com/VisActor/VTable/issues/1465)
- **@visactor/vtable**: 修复内联图标 inline icon tooltip 提示配置 [#1456](https://github.com/VisActor/VTable/issues/1456)
- **@visactor/vtable**: 修复进度图在某些情况下遮挡表格边缘单元格
- **@visactor/vtable**: 修复转置表格表头边框获取逻辑 [#1463](https://github.com/VisActor/VTable/issues/1463)

**🔨 功能重构**

- **@visactor/vtable**: 更新下钻上钻图标的 SVG
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

- **@visactor/vtable**: 列表树模式支持 updateFilterRules 接口 [#1376](https://github.com/VisActor/VTable/issues/1376)
- **@visactor/vtable**: 添加滚动结束事件，增加 barToSide 支持滚动条固定显示到边界 [#1304](https://github.com/VisActor/VTable/issues/1304)
- **@visactor/vtable**: 添加 fillHandle 以支持填充手柄

**🐛 功能修复**

- **@visactor/vtable**: 修复使用 frozenColCount 时转置模式的阴影线渲染问题 [#1366](https://github.com/VisActor/VTable/issues/1366)
- **@visactor/vtable**: 数据源 promise 模式调用 addRecords 和 deleteRecords 的问题修复
- **@visactor/vtable**: 点击单元格时不应触发 drag_select_end 事件修复 [#1410](https://github.com/VisActor/VTable/issues/1410)

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
