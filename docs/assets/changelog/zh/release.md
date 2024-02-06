# v0.19.1

2024-02-06


**🆕 新增功能**

- **@visactor/vtable**: add update sort rule api
- **@visactor/vtable**: add axis innerOffset config
- **@visactor/vtable**: add name config in customRender

**🐛 功能修复**

- **@visactor/vtable**: when table has scroll then click header to edit position error [#1069](https://github.com/VisActor/VTable/issues/1069)
- **@visactor/vtable**: fix column cell order problem in sync mode
- **@visactor/vtable**: fix border lineDash in cell group [#1051](https://github.com/VisActor/VTable/issues/1051)
- **@visactor/vtable**: fix textAlign value in width update[#1065](https://github.com/VisActor/VTable/issues/1065)
- **@visactor/vtable**: fix merge cell content position
- **@visactor/vtable**: fix merge cell update problem

**🔨 功能重构**

- **@visactor/vtable**: pivot table sort logic [#1033](https://github.com/VisActor/VTable/issues/1033)
- **@visactor/vtable**: showsort option work well [#1077](https://github.com/VisActor/VTable/issues/1077)



[更多详情请查看 v0.19.1](https://github.com/VisActor/VTable/releases/tag/v0.19.1)

# v0.19.0

2024-02-02


**🆕 新增功能**

- **@visactor/vtable**: 支持获取排序后的列 [#986](https://github.com/VisActor/VTable/issues/986)
- **@visactor/vtable**: 添加配置项：frozenColDragHeaderMode，设置冻结列拖动表头的限制规则

**🐛 功能修复**

- **@visactor/vtable**: 修复选择区域错误问题 [#1018](https://github.com/VisActor/VTable/issues/1018)
- **@visactor/vtable**: 修复调用updateColumns和折扣列发生错误 [#1015](https://github.com/VisActor/VTable/issues/1015)
- **@visactor/vtable**: 修复右侧冻结列计数拖动表头多次后列宽错误 [#1019](https://github.com/VisActor/VTable/issues/1019)
- **@visactor/vtable**: 修复空字符串计算行高错误 [#1031](https://github.com/VisActor/VTable/issues/1031)
- **@visactor/vtable**: 修复合并图像单元格更新问题
- **@visactor/vtable**: 修正底部冻结行大小不正确的问题

**🔨 功能重构**

- **@visactor/vtable**: 当拖动表头移动到冻结区域时标记线显示位置
- **@visactor/vtable**: 优化updateRow api性能

[更多详情请查看 v0.19.0](https://github.com/VisActor/VTable/releases/tag/v0.19.0)

# v0.18.3

2024-01-25

**🐛 功能修复**

- **@visactor/vtable**: 点击单元格外部取消选择状态

[更多详情请查看 v0.18.3](https://github.com/VisActor/VTable/releases/tag/v0.18.3)

# v0.18.2

2024-01-24

**🆕 新增功能**

- **@visactor/vtable**: 当调用updateTheme时 组件更新逻辑

**🐛 功能修复**

- **@visactor/vtable**: 修复 rowHeaderGroup 属性 y 在没有 colHeaderGroup 时的问题 [#971](https://github.com/VisActor/VTable/issues/971)
- **@visactor/vtable**: 修复 transpose时，bottomFrozenRow 单元格布局错误 [#978](https://github.com/VisActor/VTable/issues/978)
- **@visactor/vtable**: 修复值粘贴到最后一行时出现的错误 [#979](https://github.com/VisActor/VTable/issues/979)
- **@visactor/vtable**: 修复使用 updateColumns api 点击选择状态不正确的问题 [#975](https://github.com/VisActor/VTable/issues/975)
- **@visactor/vtable**: 修复records中有'NaN'字符串值 pivotchart 单元格值解析处理问题 [#993](https://github.com/VisActor/VTable/issues/993)
- **@visactor/vtable**: 坐标轴单元格行高度计算逻辑的优化
- **@visactor/vtable**: 修复在 moveCell() 中 deltaY的问题

[更多详情请查看 v0.18.2](https://github.com/VisActor/VTable/releases/tag/v0.18.2)

# v0.18.0

2024-01-19


**🆕 新增功能**

- **@visactor/vtable**: 支持 pivotchart 中配置显示饼图
- **@visactor/vtable**: 在 customMergeCell 中添加 customLayout & customRander
- **@visactor/vtable**: 添加 eventOptions [#914](https://github.com/VisActor/VTable/issues/914)

**🐛 功能修复**

- **@visactor/vtable**: 处理 chartSpec barWidth 设置为字符串类型的情况
- **@visactor/vtable**: 修复当 body 没有数据时调用 addRecords api报错问题 [#953](https://github.com/VisActor/VTable/issues/953)
- **@visactor/vtable**: 修复当列有多级时，鼠标拖动移动 Header 位置有误 [#957](https://github.com/VisActor/VTable/issues/957)
- **@visactor/vtable**: 修复当调整列宽时，应更新 bottomFrozenRow 的高度 [#954](https://github.com/VisActor/VTable/issues/954)



[更多详情请查看 v0.18.0](https://github.com/VisActor/VTable/releases/tag/v0.18.0)

# v0.17.10

2024-01-18


**🆕 新增功能**

- **@visactor/vtable**: 使用vrender-core

**🐛 功能修复**

- **@visactor/vtable**: 修复选择边界范围错误 [#911](https://github.com/VisActor/VTable/issues/911)
- **@visactor/vtable**: 修复当启用pasteValueToCell和事件change_cell_value参数错误问题 [#919](https://github.com/VisActor/VTable/issues/919)
- **@visactor/vtable**: 修复树结构自动合并更新问题
- **@visactor/vtable**: 切换树节点是需要updateChartSize



[更多详情请查看 v0.17.10](https://github.com/VisActor/VTable/releases/tag/v0.17.10)

# v0.17.9

2024-01-18


**🆕 新增功能**

- **@visactor/vtable**: 支持Excel数据批量粘贴到单元格 [#857](https://github.com/VisActor/VTable/issues/857)
- **@visactor/vtable**: 添加api getCellAddressByRecord
- **@visactor/vtable**: 优化getCellHeaderPath函数

**🐛 功能修复**

- **@visactor/vtable**: 修复showSubTotals无法生效问题 [#893](https://github.com/VisActor/VTable/issues/893)
- **@visactor/vtable**: 修复当设置容器display:none触发resize逻辑问题
- **@visactor/vtable**: 修复右侧冻结单元格位置

[更多详情请查看 v0.17.9](https://github.com/VisActor/VTable/releases/tag/v0.17.9)

# v0.17.8

2024-01-17


**🐛 功能修复**

- **@visactor/vtable**: 修复靠近frozencol或frozenrow时selectRange错误 [#854](https://github.com/VisActor/VTable/issues/854)
- **@visactor/vtable**: 双击自动列宽或者拖拽列位置后，冻结阴影线应移动位置 [#859](https://github.com/VisActor/VTable/issues/859)
- **@visactor/vtable**: 双击自动列宽时 图表大小更新
- **@visactor/vtable**: 修复在createGroupForFirstScreen()中计算底部冻结行高度
- **@visactor/vtable**: 修复cellGroup合并范围
- **@visactor/vtable**: 修复react自定义jsx解析


[更多详情请查看 v0.17.8](https://github.com/VisActor/VTable/releases/tag/v0.17.8)

# v0.17.7

2024-01-05


**🆕 新增功能**

- **@visactor/vtable**: 添加单元格图片元素从表格导出能力

**🐛 功能修复**

- **@visactor/vtable**: 修复react-vtable中的jsx解析错误



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
- **@visactor/vtable**: 为pivotTable添加getCellHeaderTreeNodes API [#839](https://github.com/VisActor/VTable/issues/839)

**🐛 功能修复**

- **@visactor/vtable**: setRecords处理scrollTop并更新场景树 [#831](https://github.com/VisActor/VTable/issues/831)
- **@visactor/vtable**: 在表格body中添加clip范围

**🔨 功能重构**

- **@visactor/vtable**: 修复列表表格底部行不能使用bottomFrozenStyle [#836](https://github.com/VisActor/VTable/issues/836)
- **@visactor/vtable**: 为BaseTable添加onVChartEvent [#843](https://github.com/VisActor/VTable/issues/843)



[更多详情请查看 v0.17.5](https://github.com/VisActor/VTable/releases/tag/v0.17.5)

# v0.17.3

2024-01-01


**🆕 新增功能**

- **@visactor/vtable**: 添加数据索引与表格索引的转换 [#789](https://github.com/VisActor/VTable/issues/789)
- **@visactor/vtable**: mergeCell支持自定义比较函数 [#804](https://github.com/VisActor/VTable/issues/804)
- **@visactor/vtable**: 添加列调整标签主题

**🐛 功能修复**

- **@visactor/vtable**: setRecords接口调用后丢失悬停状态  [#783](https://github.com/VisActor/VTable/issues/783)
- **@visactor/vtable**: 修复转置表格10000条数据的性能问题 [#790](https://github.com/VisActor/VTable/issues/790)
- **@visactor/vtable**: 修复setRecords recomputeColWidth问题 [#796](https://github.com/VisActor/VTable/issues/796)
- **@visactor/vtable**: 设置disableSelect拖动交互错误 [#799](https://github.com/VisActor/VTable/issues/799)
- **@visactor/vtable**: 工具提示样式无效 [#805](https://github.com/VisActor/VTable/issues/805)
- **@visactor/vtable**: 透视表pagination.perPageCount修改 [#807](https://github.com/VisActor/VTable/issues/807)
- **@visactor/vtable**: [Bug] 当有frozencol和rightFrozenCol时，自适应模式计算问题 [#820](https://github.com/VisActor/VTable/issues/820)
- **@visactor/vtable**: 修复轴渲染更新问题
- **@visactor/vtable**: 修复选择更新时更改冻结
- **@visactor/vtable**: 透视表使用图标错误
- **@visactor/vtable**: 修复排序图标更新

**🔨 功能重构**

- **@visactor/vtable**: 更新vrender事件版本以使用scrollDrag

**🔧 项目配置**

- **@visactor/vtable**: 更新vrender版本 [#785](https://github.com/VisActor/VTable/issues/785)


[更多详情请查看 v0.17.3](https://github.com/VisActor/VTable/releases/tag/v0.17.3)

# v0.17.2

2023-12-21


**🐛 功能修复**

- **@visactor/vtable**: 修复编辑表格错误 [#771](https://github.com/VisActor/VTable/issues/771)
- **@visactor/vtable**: 在resetRowHeight中添加行高度舍入



[更多详情请查看 v0.17.2](https://github.com/VisActor/VTable/releases/tag/v0.17.2)

# v0.17.1

2023-12-21


**🆕 新增功能**

- **@visactor/vtable**: 添加方向键交互 [#646](https://github.com/VisActor/VTable/issues/646)

**🐛 功能修复**

- **@visactor/vtable**: 停止传播双击事件
- **@visactor/vtable**: 修复下拉菜单点击触发问题 [#760](https://github.com/VisActor/VTable/issues/760)
- **@visactor/vtable**: 修复双击出现错误 [#758](https://github.com/VisActor/VTable/issues/758)
- **@visactor/vtable**: 修复getCellOverflowText()中的富文本错误
- **@visactor/vtable**: 添加滚动条事件以调用completeEdit [#710](https://github.com/VisActor/VTable/issues/710)
- **@visactor/vtable**: 支持树形模式自适应
- **@visactor/vtable**: 修复下拉图标显示错误
- **@visactor/vtable**: 修复右侧冻结列宽度更新问题

**🔨 功能重构**

- **@visactor/vtable**: 当有选择单元格时，优化100W记录滚动性能 [#681](https://github.com/VisActor/VTable/issues/681)
- **@visactor/vtable**: 移除透视表的默认排序规则 [#759](https://github.com/VisActor/VTable/issues/759)

**📖 文档更新**

- **@visactor/vtable**: 更新rush的changelog



[更多详情请查看 v0.17.1](https://github.com/VisActor/VTable/releases/tag/v0.17.1)

# v0.17.0

2023-12-15


**🆕 新增功能**

- **@visactor/vtable**: 添加配置 showGrandTotalsOnTop  [#650](https://github.com/VisActor/VTable/issues/650)
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
- **@visactor/vtable**: 添加api addRecords

**🐛 功能修复**

- **@visactor/vtable**: updateOption调用时需要更新updateEventBinde
- **@visactor/vtable**: 修复columnResizeType: all无效
- **@visactor/vtable**: 修复树结构底部冻结更新
- **@visactor/vtable**: 修复限制列宽自适应更新
- **@visactor/vtable**: 修复容器调整大小时的表格范围
- **@visactor/vtable**: 修复表格框架阴影颜色
- **@visactor/vtable**: 修复滚动位置更新问题

**📖 文档更新**

- **@visactor/vtable**: 修复lineheight描述



[更多详情请查看 v0.16.0](https://github.com/VisActor/VTable/releases/tag/v0.16.0)

# v0.15.4

2023-12-01


**🐛 功能修复**

- **@visactor/vtable**: 解决列中设置的编辑器对象被克隆的问题
- **@visactor/vtable**: 修复主题样式获取问题
- **@visactor/vtable**: 修复列表表格冻结悬停颜色
- **@visactor/vtable**: 修复getCellRect()中的右下角冻结单元格
- **@visactor/vtable**: 修复列宽限制时的表格调整问题
- **@visactor/vtable**: 修复自定义渲染renderDefault自动大小问题
- **@visactor/vtable**: 修复columnWidthComputeMode配置问题
- **@visactor/vtable**: 触发调整大小事件后释放tableInstance
- **@visactor/vtable**: columnWidthComputeMode逻辑中考虑only-header

**🔨 功能重构**

- **@visactor/vtable**: ts定义优化



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
- **@visactor/vtable**: 在 updateCell() 中修复文本图元 x的值

**🔖 其他**

- **@visactor/vtable**: 在 updateCellGroupContent() 中修复/修复单元格角色判断



[更多详情请查看 v0.15.0](https://github.com/VisActor/VTable/releases/tag/v0.15.0)

# v0.14.2

2023-11-16


**🐛 功能修复**

- **@visactor/vtable**: 修复行头选择绑定错误 [#572](https://github.com/VisActor/VTable/issues/572)
- **@visactor/vtable**: 修复selectHeader 复制数据问题



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

