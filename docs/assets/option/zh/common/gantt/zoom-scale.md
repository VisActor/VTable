{{ target: common-gantt-zoom-scale }}
智能缩放配置，对应的类型为 IZoomScale，具体配置项如下：

${prefix} enabled(boolean)

是否启用智能缩放功能

当启用时，会根据缩放级别自动切换不同的时间刻度组合，优先级高于 `timelineHeader.scales` 配置。

默认值：false

非必填

${prefix} minMillisecondsPerPixel(number)

最小毫秒每像素值，控制最大缩放级别（最细时间粒度）

当用户放大到极限时，每个像素代表的最小毫秒数。数值越小，允许的最大缩放级别越高，用户可以看到更细的时间粒度。

默认值：1000（1 秒/像素）

非必填

${prefix} maxMillisecondsPerPixel(number)

最大毫秒每像素值，控制最小缩放级别（最粗时间粒度）

当用户缩小到极限时，每个像素代表的最大毫秒数。数值越大，允许的最小缩放级别越低，用户可以看到更长的时间跨度。

默认值：6000000（100 分钟/像素）

非必填

${prefix} step(number)

鼠标滚轮缩放的步长参数

控制每次鼠标滚轮滚动时的基础缩放幅度。实际缩放效果会根据当前缩放级别进行智能调整。数值越大，缩放速度越快；数值越小，缩放更平滑。

默认值：0.015（1.5%）

非必填

${prefix} levels(Array<Array<ITimelineScale>>)

多级别时间刻度配置，二维数组，每个级别是完整的时间刻度组合

数组中的每个元素代表一个缩放级别，级别索引从 0 开始

每个级别内的时间刻度数组从粗粒度到细粒度排列，系统会自动根据当前的 `millisecondsPerPixel` 值选择最适合的级别。

每个级别中的时间刻度配置格式与 `timelineHeader.scales` 中的配置完全相同：

{{ use: common-gantt-timeline-scale( prefix = ${prefix} + '#') }}

${prefix} dataZoomAxis(IDataZoomAxisConfig)

DataZoomAxis 滚动条配置，提供可视化的时间范围选择器

DataZoomAxis 以滚动条的形式显示在甘特图底部，用户可以通过拖拽手柄来精确控制显示的时间范围，实现快速导航和缩放操作。

非必填

{{ use: common-gantt-data-zoom-config( prefix = ${prefix} + '#') }}
