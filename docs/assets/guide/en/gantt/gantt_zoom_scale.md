# Gantt Chart Smart Zoom Scale

The Gantt chart smart zoom scale feature provides multi-level timeline zooming capabilities that automatically switch to appropriate time scale combinations based on different zoom levels, offering users both macro and micro views of their projects.

## Features

- **Multi-level Zooming**: Support defining multiple zoom levels, each corresponding to different time scale combinations
- **Automatic Switching**: Automatically select the most suitable time scale display based on current zoom state
- **Smooth Transitions**: Provide smooth visual transitions when switching between different levels
- **Interactive Zooming**: Support mouse wheel zooming and programmatic zoom control
- **Priority Override**: When enabled, overrides the static configuration of `timelineHeader.scales`

## Basic Configuration

### Enable Smart Zoom

```javascript
const ganttOptions = {
  // Other configurations...
  timelineHeader: {
    // Smart zoom configuration
    zoomScale: {
      enabled: true, // Enable smart zoom feature
      levels: [
        // Level configuration array
      ]
    }
  }
};
```

### Level Configuration Structure

Each level is an array of time scales, arranged from coarse to fine granularity:

```typescript
interface IZoomScale {
  enabled: boolean; // Whether to enable smart zoom
  levels: ITimelineScale[][]; // Multi-level time scale configuration
}
```

## Level Design Examples

### Basic Three-Level Configuration

```javascript
timelineHeader: {
  zoomScale: {
    enabled: true,
    levels: [
    // Level 0: Month-Week combination (coarsest, suitable for long-term projects)
    [
      {
        unit: 'month',
        step: 1,
        format: date => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
        }
      },
      {
        unit: 'week',
        step: 1,
        format: date => {
          const weekNum = Math.ceil(
            (date.startDate.getDate() + new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) / 7
          );
          return `Week ${weekNum}`;
        }
      }
    ],

    // Level 1: Month-Week-Day combination (suitable for monthly planning)
    [
      {
        unit: 'month',
        step: 1,
        format: date => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
        }
      },
      {
        unit: 'week',
        step: 1,
        format: date => `Week ${Math.ceil(date.startDate.getDate() / 7)}`
      },
      {
        unit: 'day',
        step: 4,
        format: date => date.startDate.getDate().toString()
      }
    ],

    // Level 2: Day-Hour combination (suitable for detailed progress tracking)
    [
      {
        unit: 'day',
        step: 1,
        format: date => {
          const day = date.startDate.getDate();
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${day} ${monthNames[date.startDate.getMonth()]}`;
        }
      },
      {
        unit: 'hour',
        step: 6,
        format: date => {
          const startHour = date.startDate.getHours();
          return `${startHour.toString().padStart(2, '0')}:00`;
        }
      }
    ]
  ]
  }
}
```

## API Usage

### Get Zoom Manager

```javascript
const zoomManager = ganttInstance.zoomScaleManager;
```

### Zoom Operations

#### 1. Zoom by Percentage

```javascript
// Zoom in by 10%
zoomManager.zoomByPercentage(10);

// Zoom out by 10%
zoomManager.zoomByPercentage(-10);

// Specify zoom center
zoomManager.zoomByPercentage(15, true, 300);
```

**Parameters:**

- `percentage` (number): Zoom percentage, positive for zoom in, negative for zoom out
- `center` (boolean, optional): Whether to maintain view center, default is true
- `centerX` (number, optional): X coordinate of zoom center, default is view center

#### 2. Set Zoom State

Precisely set to a specified zoom state, supporting multiple parameter combination methods.

```javascript
// Method 1: Set by level number
zoomManager.setZoomPosition({
  levelNum: 2, // Switch to level 2
  colWidth: 60 // Set column width to 60px
});

// Method 2: Set by time unit
zoomManager.setZoomPosition({
  minUnit: 'day', // Minimum time unit is day
  step: 1, // Step size is 1
  colWidth: 80 // Set column width to 80px (optional)
});

// Method 3: Switch level only (use middle state of level)
zoomManager.setZoomPosition({
  levelNum: 1
});
```

**Parameter Type:**

```typescript
interface SetZoomPositionParams {
  levelNum?: number; // Target level index
  minUnit?: string; // Minimum time unit
  step?: number; // Time step
  colWidth?: number; // Target column width
}
```

**Parameter Description:**

- `levelNum` (number, optional): Target level index, starting from 0, corresponding to position in `levels` array

  - When `levelNum` is specified, it will switch to the corresponding level
  - If `colWidth` is also specified, it will adjust to the specified column width within that level
  - If `colWidth` is not specified, it will use the middle state column width of that level

- `minUnit` (string, optional): Minimum time unit, available values:

  - `'year'`: Year
  - `'month'`: Month
  - `'week'`: Week
  - `'day'`: Day
  - `'hour'`: Hour
  - `'minute'`: Minute
  - `'second'`: Second

- `step` (number, optional): Time step, represents the quantity of each minimum unit

  - For example: `minUnit: 'day', step: 2` means every 2 days as one display unit
  - Must be used together with `minUnit`

- `colWidth` (number, optional): Target column width in pixels
  - Affects the display density of the timeline
  - Recommended range: 40-200px

**Return Value:** `boolean` - Whether the operation was successful

**Usage Example:**

```javascript
// Quick switch to week view
const success = zoomManager.setZoomPosition({
  minUnit: 'week',
  step: 1,
  colWidth: 80
});

if (success) {
  console.log('Zoom setting successful');
} else {
  console.log('Zoom setting failed, parameters may not match any level');
}
```

### State Queries

#### Get Detailed Zoom State

Get detailed information about the current zoom state, including level, time unit, step, and column width.

```javascript
const state = zoomManager.getCurrentZoomState();
console.log('Current level:', state.levelNum);
console.log('Min time unit:', state.minUnit);
console.log('Time step:', state.step);
console.log('Column width:', state.currentColWidth);
```

**Return Type:**

```typescript
interface ZoomState {
  levelNum: number; // Current level index, starting from 0
  minUnit: string; // Minimum time unit ('year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')
  step: number; // Time step, represents the quantity of each minimum unit
  currentColWidth: number; // Current column width in pixels
}
```

**Return Value Description:**

- `levelNum`: Current active zoom level index, corresponding to the position in the `levels` array
- `minUnit`: The finest granularity time unit in the current level, used to determine the minimum display unit of the timeline
- `step`: Step size of the minimum time unit, e.g., `step: 2` with `minUnit: 'day'` means every 2 days as one display unit
- `currentColWidth`: Current timeline column width, affecting the display density of the timeline

#### Get Current Level

```javascript
const currentLevel = zoomManager.getCurrentLevel();
console.log('Current level:', currentLevel);
```

## Interaction Methods

### Mouse Wheel Zooming

After enabling smart zoom, users can interact through:

- **Zoom In**: Hold `Ctrl` key and scroll mouse wheel up or pinch to zoom in
- **Zoom Out**: Hold `Ctrl` key and scroll mouse wheel down or pinch to zoom out
- **Zoom Center**: Zooming will be centered at the mouse pointer position

### Programmatic Control

Besides mouse interaction, you can also use APIs for programmatic control, suitable for:

- Custom zoom buttons
- Keyboard shortcuts binding
- Automatic zoom logic
- State synchronization

## Best Practices

### 1. Level Design Principles

- **Coarse to Fine**: Level 0 should be the coarsest time scale, with higher levels being more detailed
- **Reasonable Transitions**: Time granularity differences between adjacent levels should not be too large
- **Practicality First**: Design appropriate time scale combinations based on actual scenarios
- **Reasonable Level Count**: Recommend controlling within 3-6 levels

### 2. Time Scale Selection

Choose appropriate time scales based on project duration:

- **Long-term Projects** (months to years): Year-Quarter-Month or Month-Week
- **Medium-term Projects** (weeks to months): Month-Week-Day
- **Short-term Projects** (days to weeks): Week-Day-Hour
- **Fine Tasks** (hours to days): Day-Hour-Minute

### 3. Performance Optimization

- Avoid too many level configurations to prevent affecting switching performance
- Set reasonable time scale steps to avoid overly dense displays
- In large data scenarios, prioritize using coarser time granularities

### 4. User Experience

- Provide intuitive zoom control interface
- Display current zoom state information
- Support quick jumping to specific levels
- Maintain consistency and predictability of zoom operations

## Event Listening

You can listen to zoom-related events to implement custom logic:

```javascript
// Listen to zoom events
ganttInstance.on('zoom', args => {
  console.log('Zoom event:', args);

  // Get current time unit information
  const scale = ganttInstance.parsedOptions.reverseSortedTimelineScales[0];
  console.log('Current time unit:', {
    unit: scale?.unit,
    step: scale?.step,
    timelineColWidth: ganttInstance.parsedOptions.timelineColWidth
  });
});
```

Through the smart zoom feature, you can provide users with a more flexible and intuitive Gantt chart viewing experience, supporting seamless switching from project overview to task details.
