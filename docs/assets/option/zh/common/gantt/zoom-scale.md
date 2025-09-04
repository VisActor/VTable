{{ target: common-gantt-zoom-scale }}
智能缩放配置，对应的类型为 IZoomScale，具体配置项如下：

${prefix} enabled(boolean)

是否启用智能缩放功能

当启用时，会根据缩放级别自动切换不同的时间刻度组合，优先级高于 `timelineHeader.scales` 配置。

默认值：false

非必填

${prefix} levels(Array<Array<ITimelineScale>>)

多级别时间刻度配置，二维数组，每个级别是完整的时间刻度组合

数组中的每个元素代表一个缩放级别，级别索引从 0 开始

每个级别内的时间刻度数组从粗粒度到细粒度排列，系统会自动根据当前的 `timePerPixel` 值选择最适合的级别。

每个级别中的时间刻度配置格式与 `timelineHeader.scales` 中的配置完全相同：

{{ use: common-gantt-timeline-scale( prefix = ${prefix} + '#') }}
