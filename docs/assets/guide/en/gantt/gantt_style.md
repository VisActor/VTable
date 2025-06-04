
## Task Bar Style

VTable Gantt provides rich task bar style configuration options to customize the appearance of the task bar.

### Basic Style

You can configure the basic style of the task bar through `taskBar.barStyle`, the project task style through `taskBar.projectStyle`, and the milestone style through `taskBar.milestoneStyle`:

```javascript
const ganttOptions = {
  taskBar: {
    barStyle: {
      barColor: '#1890ff',           // 任务条的颜色
      completedBarColor: '#52c41a',  // 已完成部分的颜色
      borderColor: '#096dd9',        // 边框颜色
      borderLineWidth: 1,            // 边框宽度
      cornerRadius: 3                // 圆角半径
    },
    projectStyle: {
      barColor: '#722ed1',           // 项目任务条的颜色
      completedBarColor: '#eb2f96',  // 已完成部分的颜色
      borderColor: '#531dab',        // 边框颜色
      borderLineWidth: 1,            // 边框宽度
      cornerRadius: 0                // 圆角半径
    },
    milestoneStyle: {
      fillColor: '#fa8c16',          // 里程碑填充颜色
      borderColor: '#d46b08',        // 里程碑边框颜色
      borderLineWidth: 1,            // 边框宽度
      width: 12,                     // 里程碑大小
      cornerRadius: 0,               // 圆角半径
      textOrient: 'right'            // 文本位置
    }
  }
};
```

You can also dynamically set the style based on the task attributes through a function:

```javascript
const ganttOptions = {
  taskBar: {
    barStyle: (args) => {
      const { taskRecord, progress } = args;
      
      // 根据进度设置不同颜色
      if (progress > 0.8) {
        return {
          barColor: '#52c41a',
          completedBarColor: '#389e0d'
        };
      } else if (progress > 0.3) {
        return {
          barColor: '#1890ff',
          completedBarColor: '#096dd9'
        };
      } else {
        return {
          barColor: '#fa8c16',
          completedBarColor: '#d46b08'
        };
      }
    }
  }
};
```

### Selected State

You can configure the selected style of the task bar through `taskBar.selectedBarStyle`:

```javascript
const ganttOptions = {
  taskBar: {
    selectable: true,            // 允许选择任务条
    selectedBarStyle: {
      shadowBlur: 6,             // 阴影模糊半径
      shadowColor: 'rgba(0,0,0,0.3)',  // 阴影颜色
      shadowOffsetX: 2,          // 阴影X偏移
      shadowOffsetY: 2,          // 阴影Y偏移
      borderColor: '#ff4d4f',    // 选中时的边框颜色
      borderLineWidth: 2         // 选中时的边框宽度
    }
  }
};
```

### 悬停状态

可以通过`taskBar.hoverBarStyle`配置任务条悬停时的样式：

```javascript
const ganttOptions = {
  taskBar: {
    hoverBarStyle: {
      cornerRadius: 4,           // 悬停时的圆角半径
      barOverlayColor: 'rgba(24, 144, 255, 0.1)'  // 悬停时的覆盖色
    }
  }
};
```

### Custom Layout

For more complex custom requirements, you can fully control the rendering of the task bar through `taskBar.customLayout`:

```javascript
const ganttOptions = {
  taskBar: {
    customLayout: (args) => {
      const { width, height, taskRecord, progress, ganttInstance } = args;
      
      // 创建自定义任务条
      const rootContainer = new Group();
      
      // 添加自定义图形
      const background = createRect({
        x: 0,
        y: 0,
        width,
        height,
        fill: taskRecord.color || '#1890ff',
        radius: 4
      });
      rootContainer.appendChild(background);
      
      // 添加进度条
      if (progress > 0) {
        const progressBar = createRect({
          x: 0,
          y: 0,
          width: width * progress,
          height,
          fill: '#52c41a',
          radius: [4, 0, 0, 4]
        });
        rootContainer.appendChild(progressBar);
      }
      
      // 添加自定义文本
      const text = createText({
        x: width / 2,
        y: height / 2,
        text: taskRecord.text,
        fontSize: 12,
        fill: '#fff',
        textAlign: 'center',
        textBaseline: 'middle'
      });
      rootContainer.appendChild(text);
      
      return {
        rootContainer,
        renderDefaultBar: false,
        renderDefaultText: false,
        renderDefaultResizeIcon: false
      };
    }
  }
};
```
## Grid Line Style
You can refer to the tutorial [Gantt Grid](gantt_grid.md) for more details.