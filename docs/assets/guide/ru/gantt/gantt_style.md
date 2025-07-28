
## Task Bar Style

Vтаблица гантт provides rich task bar style configuration options к пользовательскийize the appearance из the task bar.

### базовый Style

Вы можете configure the базовый style из the task bar through `taskBar.barStyle`, the project task style through `taskBar.projectStyle`, и the milestone style through `taskBar.milestoneStyle`:

```javascript
const ганттOptions = {
  taskBar: {
    barStyle: {
      barColor: '#1890ff',           // 任务条的颜色
      completedBarColor: '#52c41a',  // 已完成部分的颜色
      borderColor: '#096dd9',        // 边框颜色
      borderLineширина: 1,            // 边框宽度
      cornerRadius: 3                // 圆角半径
    },
    projectStyle: {
      barColor: '#722ed1',           // 项目任务条的颜色
      completedBarColor: '#eb2f96',  // 已完成部分的颜色
      borderColor: '#531dab',        // 边框颜色
      borderLineширина: 1,            // 边框宽度
      cornerRadius: 0                // 圆角半径
    },
    milestoneStyle: {
      fillColor: '#fa8c16',          // 里程碑填充颜色
      borderColor: '#d46b08',        // 里程碑边框颜色
      borderLineширина: 1,            // 边框宽度
      ширина: 12,                     // 里程碑大小
      cornerRadius: 0,               // 圆角半径
      textOrient: 'право'            // 文本位置
    }
  }
};
```

Вы можете also dynamically set the style based на the task attributes through a функция:

```javascript
const ганттOptions = {
  taskBar: {
    barStyle: (args) => {
      const { taskRecord, progress } = args;
      
      // 根据进度设置不同颜色
      if (progress > 0.8) {
        возврат {
          barColor: '#52c41a',
          completedBarColor: '#389e0d'
        };
      } else if (progress > 0.3) {
        возврат {
          barColor: '#1890ff',
          completedBarColor: '#096dd9'
        };
      } else {
        возврат {
          barColor: '#fa8c16',
          completedBarColor: '#d46b08'
        };
      }
    }
  }
};
```

### Selected State

Вы можете configure the selected style из the task bar through `taskBar.selectedBarStyle`:

```javascript
const ганттOptions = {
  taskBar: {
    selecтаблица: true,            // 允许选择任务条
    selectedBarStyle: {
      shadowBlur: 6,             // 阴影模糊半径
      shadowColor: 'rgba(0,0,0,0.3)',  // 阴影颜色
      shadowOffsetX: 2,          // 阴影X偏移
      shadowOffsetY: 2,          // 阴影Y偏移
      borderColor: '#ff4d4f',    // 选中时的边框颜色
      borderLineширина: 2         // 选中时的边框宽度
    }
  }
};
```

### 悬停状态

可以通过`taskBar.hoverBarStyle`配置任务条悬停时的样式：

```javascript
const ганттOptions = {
  taskBar: {
    hoverBarStyle: {
      cornerRadius: 4,           // 悬停时的圆角半径
      barOverlayColor: 'rgba(24, 144, 255, 0.1)'  // 悬停时的覆盖色
    }
  }
};
```

### пользовательский макет

для more complex пользовательский requirements, Вы можете fully control the rendering из the task bar through `taskBar.пользовательскиймакет`:

```javascript
const ганттOptions = {
  taskBar: {
    пользовательскиймакет: (args) => {
      const { ширина, высота, taskRecord, progress, ганттInstance } = args;
      
      // 创建自定义任务条
      const rootContainer = новый Group();
      
      // 添加自定义图形
      const фон = createRect({
        x: 0,
        y: 0,
        ширина,
        высота,
        fill: taskRecord.цвет || '#1890ff',
        radius: 4
      });
      rootContainer.appendChild(фон);
      
      // 添加进度条
      if (progress > 0) {
        const progressBar = createRect({
          x: 0,
          y: 0,
          ширина: ширина * progress,
          высота,
          fill: '#52c41a',
          radius: [4, 0, 0, 4]
        });
        rootContainer.appendChild(progressBar);
      }
      
      // 添加自定义文本
      const текст = createText({
        x: ширина / 2,
        y: высота / 2,
        текст: taskRecord.текст,
        fontSize: 12,
        fill: '#fff',
        textAlign: 'центр',
        textBaseline: 'середина'
      });
      rootContainer.appendChild(текст);
      
      возврат {
        rootContainer,
        renderDefaultBar: false,
        renderDefaultText: false,
        renderDefaultResizeиконка: false
      };
    }
  }
};
```
## Grid Line Style
Вы можете refer к the tutorial [гантт Grid](гантт_grid.md) для more details.