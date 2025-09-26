{{ target: common-gantt-zoom-scale }}
Smart zoom configuration, corresponding type is IZoomScale, with the following configuration items:

${prefix} enabled(boolean)

Whether to enable smart zoom functionality

When enabled, it will automatically switch between different time scale combinations based on zoom levels, with higher priority than the `timelineHeader.scales` configuration.

Default: false

Optional

${prefix} minMillisecondsPerPixel(number)

Minimum milliseconds per pixel value, controlling the maximum zoom level (finest time granularity)

When the user zooms in to the limit, this is the minimum number of milliseconds each pixel represents. The smaller the value, the higher the maximum zoom level allowed, and the finer time granularity users can see.

Default: 1000 (1 second/pixel)

Optional

${prefix} maxMillisecondsPerPixel(number)

Maximum milliseconds per pixel value, controlling the minimum zoom level (coarsest time granularity)

When the user zooms out to the limit, this is the maximum number of milliseconds each pixel represents. The larger the value, the lower the minimum zoom level allowed, and the longer time spans users can see.

Default: 6000000 (100 minutes/pixel)

Optional

${prefix} step(number)

Mouse wheel zoom step parameter

Controls the base zoom magnitude for each mouse wheel scroll. The actual zoom effect will be intelligently adjusted based on the current zoom level. Larger values make zooming faster; smaller values make zooming smoother.

Default: 0.015 (1.5%)

Optional

${prefix} levels(Array<Array<ITimelineScale>>)

Multi-level time scale configuration, a two-dimensional array where each level is a complete time scale combination

Each element in the array represents a zoom level, with level indices starting from 0

The time scale array within each level is arranged from coarse to fine granularity. The system will automatically select the most appropriate level based on the current `millisecondsPerPixel` value.

Each level's time scale configuration format is exactly the same as `timelineHeader.scales`:

{{ use: common-gantt-timeline-scale( prefix = ${prefix} + '#') }}

${prefix} dataZoomAxis(IDataZoomAxisConfig)

DataZoomAxis scrollbar configuration, providing a visual time range selector

DataZoomAxis is displayed as a scrollbar at the bottom of the Gantt chart, allowing users to precisely control the display time range through dragging handles, enabling quick navigation and zoom operations.

Optional

{{ use: common-gantt-data-zoom-config( prefix = ${prefix} + '#') }}
