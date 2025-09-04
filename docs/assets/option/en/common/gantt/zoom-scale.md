{{ target: common-gantt-zoom-scale }}
Smart zoom configuration, corresponding type is IZoomScale, with the following configuration items:

${prefix} enabled(boolean)

Whether to enable smart zoom functionality

When enabled, it will automatically switch between different time scale combinations based on zoom levels, with higher priority than the `timelineHeader.scales` configuration.

Default: false

Optional

${prefix} levels(Array<Array<ITimelineScale>>)

Multi-level time scale configuration, a two-dimensional array where each level is a complete time scale combination

Each element in the array represents a zoom level, with level indices starting from 0

The time scale array within each level is arranged from coarse to fine granularity. The system will automatically select the most appropriate level based on the current `timePerPixel` value.

Each level's time scale configuration format is exactly the same as `timelineHeader.scales`:

{{ use: common-gantt-timeline-scale( prefix = ${prefix} + '#') }}
