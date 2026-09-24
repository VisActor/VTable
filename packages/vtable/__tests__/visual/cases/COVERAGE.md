# 本地视觉用例覆盖

当前有 180 个本地用例，关联 202 个真实 BugServer case ID。本清单描述实际验证目的，具体 ID 用 `--list` 查询。一个视觉用例只代表所写的固定输入、动作和断言；不能据此推断相邻配置或所有 BugServer 用例已覆盖。

| 功能 | 当前代表用例 | 主要条件 |
| --- | --- | --- |
| 列表与表头 | `list-basic`、`level-span`、`header-hidden-nested`、`header-hidden-parent`、`header-grid-tree`、`header-grid-tree-transpose`、`header-grid-tree-filter-expand`、`row-series-number` | 基础列表、多层及 grid-tree 表头、隐藏父子节点、筛选插件下的表头展开、序号 |
| 单元格与样式 | `wrapped-text`、`checkbox-states`、`mixed-sparkline-progress`、`switch-button`、`inline-image`、`style-underline`、`checkbox-header-options` | 文本、复选框、火花线、进度条、开关、按钮、内联图片、下划线 |
| 布局与主题 | `auto-width-height`、`adaptive-width`、`layout-container-fit-height`、`layout-container-fit-both`、`frozen-short-content-connected`、`theme-dark-icons`、`theme-update-theme`、`layout-min-max-adaptive-width`、`pivot-max-frozen-width`、`frozen-shadow-start`、`frozen-shadow-middle`、`frozen-shadow-end`、`scrollbar-ignore-frozen` | 自适应尺寸、冻结边界、深色图标、运行时主题更新、自适应列宽上下限、透视冻结宽度上限 |
| 透视表 | `pivot-analysis-two-level`、`pivot-virtual-column-total`、`pivot-calculated-field-hidden-dependencies`、`pivot-custom-merge-subtotal`、`pivot-indicator-sort-subtotal`、`pivot-custom-sort-click-colors`、`pivot-aggregation-rules`、`pivot-tree-zero-expand`、`pivot-update-sort-state-click`、`pivot-initial-column-sort-state`、`pivot-custom-total-data-tree`、`pivot-corner-empty-matrix`、`pivot-empty-string-dimension`、`pivot-resize-indicator-row`、`pivot-corner-sort-one-dimension`、`pivot-corner-sort-two-dimensions` | 维度层级、虚拟节点、隐藏依赖指标、SUM/COUNT/AVG 聚合、指标路径排序、自定义比较器与双指标着色、小计、初始列树排序状态与点击后更新排序状态、显式汇总记录、空维度矩阵、空字符串维度、指标行拖动调整行高、单级与两级角头初始排序图标 |
| 透视图 | `pivot-chart-box-plot`、`pivot-chart-box-plot-horizontal`、`pivot-chart-histogram-overlap`、`pivot-chart-heatmap-two-indicators`、`pivot-chart-scatter-axes`、`pivot-chart-mark-line`、`pivot-chart-combination-forecast`、`pivot-chart-sunburst-hierarchy`、`pivot-chart-histogram-color`、`pivot-chart-bar-line-right-axis`、`pivot-chart-pie-multi-select`、`pivot-chart-circle-packing-hierarchy`、`pivot-chart-crosshair-linkage-hover` | 箱线图、直方图、热力图、散点图、组合预测图、旭日图、标记线与颜色映射、左右双轴柱线图、饼图图元多选、圆形打包图、跨图表悬停准线与提示 |
| Gantt | `gantt-taskbar-relative-rect`、`gantt-baseline-overlap`、`gantt-project-range-set-records`、`gantt-empty-mark-line`、`gantt-baseline-padding-static`、`gantt-baseline-padding-function`、`gantt-locate-offscreen-task`、`gantt-move-task-bar`、`gantt-tree-move-resize` | 任务条拖动、基线间距、记录更新后的时间边界、空任务标记线、离屏定位、树形子任务条移动与拉伸 |
| Sheet | `sheet-add-columns`、`sheet-formula-edit`、`sheet-copy-paste`、`sheet-update-option`、`sheet-cross-tab-formula`、`sheet-formula-auto-fill-copy` | 列插入、跨表公式、公式结果格的复制填充、事件剪贴板、配置更新 |
| 插件 | `plugin-filter-hide-reorder`、`plugin-master-detail-auto-height`、`plugin-fill-handle-hit-area`、`plugin-context-menu-click`、`header-grid-tree-filter-expand` | 筛选与列移动、主从表、填充柄命中范围、上下文菜单 |
| 交互与组件 | `select-cross`、`keyboard-copy-paste-event`、`sort-multiple-header-click`、`edit-complete-input`、`component-legend-resize`、`menu-dropdown-highlight`、`hover-tooltip`、`drag-column-header`、`select-disable-callback`、`blank-area-deselect`、`disabled-arrow-navigation`、`drag-row-series-select`、`drag-row-series-order`、`keyboard-cut-paste-event`、`resize-row-height`、`hover-cross`、`hover-row`、`hover-column`、`hover-single`、`select-drag-outside`、`select-header-cell`、`select-column-disabled`、`select-global-disabled`、`select-header-disabled-drag`、`select-highlight-row`、`select-highlight-column`、`select-highlight-cross-theme`、`select-highlight-cross-header-cell`、`select-highlight-cross-transpose` | 列拖动、回调禁选、选择、复制粘贴、复合排序、编辑、图例缩窄、下拉菜单、提示、空白区清选、禁选列键盘导航、行序号拖选与重排、剪切粘贴、列表行高拖动、悬停四模式、列级与全局禁选 |
| 数据与 API | `aggregation-pagination`、`filter-api`、`records-add-sorted`、`records-delete-sorted`、`transpose-update-option-off`、`api-update-columns`、`api-change-cell-values`、`records-add-pagination`、`promise-custom-merge`、`promise-keep-data`、`frozen-empty-records-header` | 聚合、筛选、分页插入、异步数据自定义合并、排序状态下增删记录、转置更新、列更新、二维批量改单元格、异步数据源配置更新时保留数据 |
| 其他结构 | `tree-list-merge-expand`、`tree-checkbox-set-state`、`transpose-theme-header`、`progress-custom-layout`、`group-one-column`、`tree-checkbox-add-record`、`tree-checkbox-delete-record`、`tree-lazy-record-children`、`tree-pagination-double-click`、`tree-filter-clear-lazy`、`group-add-delete-records` | 树展开、树复选状态、树节点增删与懒加载、分页双击、转置、自定义布局、两级分组内路径增删、树形列表过滤与懒加载 |

Sheet 复制填充当前只断言邻格显示值，不代表公式引用平移。仍未建立独立的视频与远程资源、透视树扩展标题路径与懒加载、大规模多级分组动态更新、大数据性能视觉回归。已发现的官方基线行为问题保留在下述去向台账和仓库外私有复现记录，不把失败场景登记为通过用例。旧 BugServer 目录存在大量重复与混杂项；全量来源先在仓库外筛查，再按真实功能和动作选择可公开的代表用例。新增功能或缺陷修复优先补充对应触发条件，不以数量填充用例。

## BugServer 未选候选去向（2026-09-24）

上轮未选入的 528 条候选已按来源摘要、配置及 API 信号、录制动作逐条登记在 [去向台账](./BUGSERVER_CANDIDATE_TRIAGE.json)。状态为 `migrated` 的 42 条均指向实际运行的本地用例及断言；`deferred_*` 只表示尚未证明本地覆盖，不应据相似配置名或 AST 结构推断等价。

| 去向 | 数量 | 含义 |
| --- | ---: | --- |
| 已迁入本地用例 | 42 | 35 个新模块，以匿名数据重建配置及动作 |
| 隐私风险排除 | 11 | 发现业务化字段或数值，原始内容没有进入仓库 |
| 官方基线待查 | 1 | 初始排序状态存在，但预期记录顺序未改变 |
| 外部资源待替换 | 31 | 需要确定性的本地资源后才能验证 |
| 大型源码待缩减 | 70 | 需要缩成匿名且仍保留关键边界的数据 |
| 交互未证明覆盖 | 157 | 录制动作缺少对应的本地动作与断言 |
| 静态配置未证明覆盖 | 216 | 配置或数据变体缺少对应的本地断言 |

三条含人名与编号的 `changeCellValues` 来源按用户决定列为隐私风险排除；另有一条包含订单和客户标识的主从表来源排除。独立的 `api-change-cell-values` 用匿名固定记录验证二维更新，不关联被排除来源 ID。

新补充的冻结与配置场景：overflow 阴影滚动三边界、主滚动条包含冻结列宽度、311 列下清空记录后保留表头，以及复选框表头变体。单例与相关目录均通过官方基线比较。

继续补齐选择高亮的 row、column、带主题 cross、表头单格和转置变体，并加入行序号拖动两次后的记录重排；逐例保留真实来源 ID，验证动作顺序与最终状态。

新补充的交互场景：四种悬停模式、连续选择与表外点击、表头单格选择、列级和全局禁选、禁选表头下仍可拖动换列。当前全量 180/180 与官方基线通过。

本轮新增可验证场景：列头标题层、初始复合排序、自动列宽上限、记录驱动行高、固定画布与自动画布尺寸、左右冻结区拖动及滚动、折叠树复选状态和零高度行、角头剩余三种排列、指标组行高拖动、转置表仅按表体计算列宽。待查初始排序 case ID：`66c54ebdc3ab4200c6b4fdf6`。此前五条基线问题继续保留：`6731de62013a5500b2fe995f`、`69646241e4654d005ebc40ed`、`655c9445ba621bd56533efcb`、`6855015beb13a600a741dd62`、`69d4cbe3547bee005d6c8482`。

这份台账是可继续处理的缺口清单，尚不能据此判断 BugServer 用例迁移已经完成。业务风险排除项不提供源码或字段原文；未来重新筛查应重新从 BugServer 获取来源并核对 `sourceDigest`。
