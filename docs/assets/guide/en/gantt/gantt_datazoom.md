# Gantt DataZoomAxis Scrollbar

DataZoomAxis is a visual time range selector for Gantt charts, displayed as a scrollbar at the bottom of the Gantt chart, providing intuitive time navigation and zoom control functionality. It seamlessly integrates with the smart zoom system to achieve a bidirectional synchronized interactive experience.

## Features

- **Visual Scrollbar**: Display time range selection scrollbar at the bottom of Gantt chart
- **Precise Range Selection**: Precisely control display time range through dragging handles
- **Quick View Navigation**: Drag middle area to quickly move to different time periods
- **Real-time Bidirectional Sync**: Scrollbar operations synchronize with Gantt chart view in real-time
- **Automatic Range Limitation**: Prevent zooming beyond reasonable display ranges
- **Responsive Design**: Automatically adapt to container size changes
- **Smart Zoom Integration**: Perfect integration with multi-level smart zoom system

## Basic Configuration

### Enable DataZoomAxis

DataZoomAxis needs to work together with smart zoom functionality:

```javascript
const ganttOptions = {
  // Other configurations...
  timelineHeader: {
    // Smart zoom configuration
    zoomScale: {
      enabled: true, // Enable smart zoom functionality
      dataZoomAxis: {
        enabled: true, // Enable DataZoomAxis scrollbar
        height: 30, // Scrollbar height
        delayTime: 10 // Event debounce delay
      },
      levels: [
        // Smart zoom level configuration
        [
          { unit: 'month', step: 1 },
          { unit: 'week', step: 1 }
        ]
        // More levels...
      ]
    }
  }
};
```

### Configuration Parameters

- `enabled` (boolean): Whether to enable DataZoomAxis functionality
- `width` (number): Scrollbar width, automatically calculated by default
- `height` (number): Scrollbar height, default 30px
- `x` (number): X coordinate offset, aligned with timeline by default
- `y` (number): Y coordinate offset, default 0
- `delayTime` (number): Event trigger delay time, default 10ms

## Interactive Operations

### Basic Operations

1. **Drag Left Handle**: Adjust the start time of display range, drag right to shrink range
2. **Drag Right Handle**: Adjust the end time of display range, drag left to shrink range
3. **Drag Middle Selection Area**: Pan the current display time range as a whole
4. **Scrollbar Background Area**: Click to quickly jump to corresponding time position

### Bidirectional Sync Mechanism

DataZoomAxis and Gantt chart achieve complete bidirectional synchronization:

- **Gantt → DataZoomAxis**: When users change the Gantt chart view through mouse wheel, zoom buttons, etc., DataZoomAxis automatically updates the selection range
- **DataZoomAxis → Gantt**: When users drag DataZoomAxis handles, the Gantt chart automatically adjusts display range and zoom level
