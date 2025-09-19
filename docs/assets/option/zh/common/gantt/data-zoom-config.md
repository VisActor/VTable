{{ target: common-gantt-data-zoom-config }}

${prefix} enabled(boolean)

是否启用 DataZoom 滚动条功能

当启用时，会在甘特图底部显示一个可交互的时间范围选择滚动条，用户可以通过拖拽手柄来控制显示范围。

默认值：false

非必填

${prefix} containerId(string)

DataZoom 容器 ID

指定 DataZoom 滚动条的容器 DOM 元素 ID。如果不提供，系统会自动从 Gantt 实例获取合适的容器。

非必填

${prefix} width(number)

DataZoom 滚动条宽度（像素）

设置滚动条的宽度。如果不提供，默认自动使用 Gantt 时间轴区域的宽度。

非必填

${prefix} height(number)

DataZoom 滚动条高度（像素）

设置滚动条的高度，影响滚动条的视觉大小和交互区域。

默认值：30

非必填

${prefix} x(number)

X 坐标偏移（像素）

设置 DataZoom 滚动条相对于容器左侧的 X 坐标位置。默认排除左侧表头宽度，与时间轴内容区域对齐。

默认值：0

非必填

${prefix} y(number)

Y 坐标偏移（像素）

设置 DataZoom 滚动条相对于容器底边界的 Y 坐标偏移。正值表示向下偏移。

默认值：0

非必填

${prefix} start(number)

初始显示范围起始位置

设置 DataZoom 滚动条的初始起始位置，取值范围为 0-1，表示在整个时间范围中的相对位置。

默认值：0.2

非必填

${prefix} end(number)

初始显示范围结束位置

设置 DataZoom 滚动条的初始结束位置，取值范围为 0-1，表示在整个时间范围中的相对位置。

默认值：0.5

非必填

${prefix} delayTime(number)

事件触发延迟时间（毫秒）

设置 DataZoom 事件触发的防抖延迟时间，用于优化性能，避免频繁触发更新。

默认值：10

非必填
