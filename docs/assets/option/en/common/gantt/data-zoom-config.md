{{ target: common-gantt-data-zoom-config }}

${prefix} enabled(boolean)

Whether to enable DataZoom scrollbar functionality

When enabled, an interactive time range selection scrollbar will be displayed at the bottom of the Gantt chart, allowing users to control the display range by dragging handles.

Default: false

Optional

${prefix} containerId(string)

DataZoom container ID

Specify the DOM element ID of the DataZoom scrollbar container. If not provided, the system will automatically obtain a suitable container from the Gantt instance.

Optional

${prefix} width(number)

DataZoom scrollbar width (pixels)

Set the width of the scrollbar. If not provided, it defaults to automatically use the width of the Gantt timeline area.

Optional

${prefix} height(number)

DataZoom scrollbar height (pixels)

Set the height of the scrollbar, affecting the visual size and interaction area of the scrollbar.

Default: 30

Optional

${prefix} x(number)

X coordinate offset (pixels)

Set the X coordinate position of the DataZoom scrollbar relative to the left side of the container. By default, it excludes the left table header width and aligns with the timeline content area.

Default: 0

Optional

${prefix} y(number)

Y coordinate offset (pixels)

Set the Y coordinate offset of the DataZoom scrollbar relative to the bottom boundary of the container. Positive values indicate downward offset.

Default: 0

Optional

${prefix} start(number)

Initial display range start position

Set the initial start position of the DataZoom scrollbar, with a value range of 0-1, representing the relative position within the entire time range.

Default: 0.2

Optional

${prefix} end(number)

Initial display range end position

Set the initial end position of the DataZoom scrollbar, with a value range of 0-1, representing the relative position within the entire time range.

Default: 0.5

Optional

${prefix} delayTime(number)

Event trigger delay time (milliseconds)

Set the debounce delay time for DataZoom event triggering, used to optimize performance and avoid frequent update triggers.

Default: 10

Optional
