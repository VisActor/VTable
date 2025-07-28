# гантт график пользовательский Rendering Capabilities

в this tutorial, we will introduce how к use the пользовательский capabilities из @visactor/vтаблица-гантт к draw a гантт график.

## Preparation

Import пользовательский graphic elements. Since the installed @visactor/vтаблица already includes the graphic element types из the VRender library, we can import them directly.

```javascript
import { Group, Imвозраст, текст, Tag } от '@visactor/vтаблица/es/vrender';
или;
import * as VRender от '@visactor/vтаблица/es/vrender';
```

## пользовательский Rendering из лево Task Information таблица Cells

**Since the лево side is a complete списоктаблица, Вы можете directly refer к the [пользовательский rendering tutorial](../пользовательский_define/пользовательский_макет) в списоктаблица.**

## пользовательский Rendering из Date Header

The specific configuration corresponds к the поле [timelineHeader.scales.пользовательскиймакет](<../../option/гантт#timelineHeader.scales(массив<ITimelineScale>).пользовательскиймакет>)

пользовательскиймакет is a пользовательский функция:

```
 (args: TaskBarпользовательскиймакетArgumentType) => ITaskBarпользовательскиймакетObj;
```

### параметр description

The функция parameters are provided по the гантт компонент и include the dimensions из the rendered task bar и date information. Specifically:

```
export тип DateпользовательскиймакетArgumentType = {
  ширина: число;
  высота: число;
  index: число;
  /** The текущий date belongs к the nth позиция из the date scale. для пример, the fourth quarter в a quarterly date returns 4. */
  dateIndex: число;
  заголовок: строка;
  startDate: Date;
  endDate: Date;
  days: число;
  ганттInstance: гантт;
};
```

### returned значение specification

The возврат значение needs к include a VRender Group container объект. This rootContainer should contain the specific content structure you want к display в the date header.

```
export тип IDateпользовательскиймакетObj = {
  rootContainer: Group;
  renderDefaultText?: логический; // 是否渲染正常非自定义的文本，默认false
};
```

каждый VRender graphic element can be understood as a DOM tree structure, where каждый element has a parent container that can contain multiple child elements. Common graphic element types и their configurations can be found в the VRender [configuration Документация](https://visactor.io/vrender/option):

 <div style="ширина: 40%; текст-align: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-guide-vrender-graphic-overview.png" />
  <p>VRender Element тип</p>
</div>

### демонстрация

Вы можете refer к the демонстрация:

```javascript liveдемонстрация template=vтаблица
// import * as VRender от '@visactor/vтаблица/es/vrender';

const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
const tools = Vтаблицагантт.tools;

let ганттInstance;

const records = [
  {
    id: 1,
    заголовок: 'Task 1',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-07-26',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Task 2',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '07/24/2024',
    конец: '08/04/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Task 3',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-08-04',
    конец: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 4,
    заголовок: 'Task 4',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 5,
    заголовок: 'Task 5',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 6,
    заголовок: 'Task 6',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-29',
    конец: '2024-08-11',
    progress: 100,
    priority: 'P1'
  }
];

const columns = [
  {
    поле: 'title',
    заголовок: 'title',
    ширина: 'авто',
    сортировка: true,
    tree: true,
    editor: 'ввод'
  },
  {
    поле: 'начало',
    заголовок: 'начало',
    ширина: 'авто',
    сортировка: true,
    editor: 'date-ввод'
  },
  {
    поле: 'конец',
    заголовок: 'конец',
    ширина: 'авто',
    сортировка: true,
    editor: 'date-ввод'
  }
];
const option = {
  records,
  taskсписоктаблица: {
    columns,
    таблицаширина: 250,
    minтаблицаширина: 100,
    maxтаблицаширина: 600,
    тема: {
      headerStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: 1,
        fontSize: 18,
        fontWeight: 'bold',
        цвет: 'red',
        bgColor: '#EEF1F5'
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: [1, 0, 1, 0],
        fontSize: 16,
        цвет: '#4D4D4D',
        bgColor: '#FFF'
      }
    }
  },
  frame: {
    outerFrameStyle: {
      borderLineширина: 2,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineширина: 3
    }
  },
  grid: {
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowвысота: 40,
  rowвысота: 40,
  taskBar: {
    startDateполе: 'начало',
    endDateполе: 'конец',
    progressполе: 'progress',
    resizable: true,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title}  complete {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'лево',
      textOverflow: 'ellipsis'
    },
    barStyle: {
      ширина: 20,
      /** Task bar цвет */
      barColor: '#ee8800',
      /** Completed part из the task bar цвет */
      completedBarColor: '#91e8e0',
      /** Task bar corner radius */
      cornerRadius: 8,
      /** Task bar граница */
      borderLineширина: 1,
      /** граница цвет */
      borderColor: 'black'
    }
  },
  timelineHeader: {
    colширина: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        rowвысота: 60,
        format(date) {
          возврат `Week ${date.dateIndex}`;
        },
        пользовательскиймакет: args => {
          const colorLength = barColors.length;
          const { ширина, высота, index, startDate, endDate, days, dateIndex, title, ганттInstance } = args;
          console.log('week', index);
          const container = новый Vтаблицагантт.VRender.Group({
            ширина,
            высота,
            fill: {
              gradient: 'linear',
              x0: 0,
              y0: 0,
              x1: 1,
              y1: 0,
              stops: [
                {
                  offset: 0,
                  цвет: barColors0[dateIndex % colorLength]
                },
                {
                  offset: 0.5,
                  цвет: barColors[dateIndex % colorLength]
                },
                {
                  offset: 1,
                  цвет: barColors0[dateIndex % colorLength]
                }
              ]
            },
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });
          const containerLeft = новый Vтаблицагантт.VRender.Group({
            высота,
            ширина: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'центр',
            justifyContent: 'space-around'
            // fill: 'red'
          });
          container.add(containerLeft);

          const avatar = новый Vтаблицагантт.VRender.Imвозраст({
            ширина: 50,
            высота: 50,
            imвозраст:
              '<svg t="1722943462248" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5107" ширина="200" высота="200"><path d="M866.462 137.846H768V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384H374.154V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384h-98.462c-43.323 0-78.769 35.446-78.769 78.77v49.23c0 15.754 13.785 29.539 29.539 29.539h807.384c15.754 0 29.539-13.785 29.539-29.539v-49.23c0-43.324-35.446-78.77-78.77-78.77z m49.23 256H108.308c-15.754 0-29.539 13.785-29.539 29.539v482.461c0 43.323 35.446 78.77 78.77 78.77h708.923c43.323 0 78.769-35.447 78.769-78.77V423.385c0-15.754-13.785-29.539-29.539-29.539zM645.908 580.923L521.846 844.8c-5.908 13.785-19.692 21.662-35.446 21.662-21.662 0-37.415-17.724-37.415-35.447 0-3.938 1.969-9.846 3.938-15.753l104.37-224.493H407.63c-17.723 0-33.477-11.815-33.477-29.538 0-15.754 15.754-29.539 33.477-29.539h204.8c19.692 0 37.415 15.754 37.415 35.446 0 5.908-1.97 9.847-3.938 13.785z" fill="#1296db" p-id="5108"></path></svg>',
            cornerRadius: 25
          });
          containerLeft.add(avatar);

          const containerCenter = новый Vтаблицагантт.VRender.Group({
            высота,
            ширина: ширина - 60,
            display: 'flex',
            flexDirection: 'column'
            // alignItems: 'лево'
          });
          container.add(containerCenter);

          const weekNumber = новый Vтаблицагантт.VRender.текст({
            текст: `Week ${title}`,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            fill: 'white',
            textAlign: 'право',
            maxLineширина: ширина - 60,
            boundsPadding: [10, 0, 0, 0]
          });
          containerCenter.add(weekNumber);

          const daysFromText = новый Vтаблицагантт.VRender.текст({
            текст: `${tools.formatDate(startDate, 'mm/dd')}-${tools.formatDate(endDate, 'mm/dd')}`,
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: 'white',
            boundsPadding: [10, 0, 0, 0]
          });
          containerCenter.add(daysFromText);
          возврат {
            rootContainer: container
            // renderDefaultText: true
          };
        }
      },
      {
        unit: 'day',
        step: 1,
        rowвысота: 30,
        format(date) {
          возврат date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          заполнение: 5,
          fontWeight: 'bold',
          цвет: 'white',
          strхорошоeColor: 'black',
          textAlign: 'право',
          textBaseline: 'низ',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
  markLine: [
    {
      date: '2024/8/02',
      scrollToMarkLine: true,
      позиция: 'лево',
      style: {
        lineColor: 'red',
        lineширина: 1
      }
    }
  ],
  rowSeriesNumber: {
    заголовок: 'Row число',
    dragпорядок: true,
    headerStyle: {
      bgColor: '#EEF1F5',
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8'
    }
  },
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    видимый: 'scrolling',
    ширина: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};
ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window['ганттInstance'] = ганттInstance;
```

## пользовательский Rendering из Task Bar

The specific configuration corresponds к the поле [taskBar.пользовательскиймакет](../../option/гантт#taskBar.пользовательскиймакет)

пользовательскиймакет is a пользовательский функция:

```
 (args: TaskBarпользовательскиймакетArgumentType) => ITaskBarпользовательскиймакетObj;
```

### параметр description

The функция parameters are provided по the гантт компонент и include the dimensions из the rendered task bar и task bar данные information. Specifically:

```
export тип TaskBarпользовательскиймакетArgumentType = {
  ширина: число;
  высота: число;
  index: число;
  startDate: Date;
  endDate: Date;
  taskDays: число;
  progress: число;
  taskRecord: любой;
  ганттInstance: гантт;
};
```

### возврат значение Description

The возврат значение needs к include a VRender Group container объект. This rootContainer should contain the specific content structure you want к display в the task bar.

```
export тип ITaskBarпользовательскиймакетObj = {
  rootContainer: Group;
  renderDefaultBar?: логический; // по умолчанию false
  renderDefaultResizeиконка?: логический; // по умолчанию false
  renderDefaultText?: логический; // по умолчанию false
};
```

каждый VRender graphic element can be understood as a DOM tree structure, where каждый element has a parent container that can contain multiple child elements. Common graphic element types и their configurations can be found в the VRender [configuration Документация](https://visactor.io/vrender/option):

 <div style="ширина: 40%; текст-align: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-guide-vrender-graphic-overview.png" />
  <p>VRender Element тип</p>
</div>

### пользовательский Graphic Element событие списокeners

VRender graphic elements support событие списокeners, as shown в Следующий код logic:

```
      const avatar = новый Vтаблицагантт.VRender.Imвозраст({
        ширина: 50,
        высота: 50,
        imвозраст: taskRecord.avatar,
        cornerRadius: 25
      });
      // 鼠标悬浮到头像上时，显示Подсказка 显示负责人名字
      avatar.addсобытиесписокener('mouseenter',событие => {
        console.log('enter');
        const containerRect = document.getElementById(CONTAINER_ID).getBoundingClientRect();
        debugger;
        const targetX=событие.target.globalAABBBounds.x1;
        const targetY=событие.target.globalAABBBounds.y1;
        showПодсказка([taskRecord.developer],ганттInstance.taskтаблицаширина+ targetX+containerRect.лево, targetY+containerRect.верх+50);
      });
```

### демонстрация

Вы можете refer к the демонстрация:

```javascript liveдемонстрация template=vтаблица
// import * as VRender от '@visactor/vтаблица/es/vrender';

const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
const tools = Vтаблицагантт.tools;

let ганттInstance;

const records = [
  {
    id: 1,
    заголовок: 'Task 1',
    developer: 'bear.xiong',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg',
    начало: '2024-07-24',
    конец: '2024-07-26',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Task 2',
    developer: 'wolf.lang',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg',
    начало: '07/30/2024',
    конец: '08/04/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Task 3',
    developer: 'rabbit.tu',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg',
    начало: '2024-08-04',
    конец: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 1,
    заголовок: 'Task 4',
    developer: 'cat.mao',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Task 5',
    developer: 'bird.niao',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bird.jpeg',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Task 6',
    developer: 'flower.hua',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg',
    начало: '2024-07-29',
    конец: '2024-08-11',
    progress: 100,
    priority: 'P1'
  }
];

const columns = [
  {
    поле: 'title',
    заголовок: 'title',
    ширина: 'авто',
    сортировка: true,
    tree: true,
    editor: 'ввод'
  },
  {
    поле: 'начало',
    заголовок: 'начало',
    ширина: 'авто',
    сортировка: true,
    editor: 'date-ввод'
  },
  {
    поле: 'конец',
    заголовок: 'конец',
    ширина: 'авто',
    сортировка: true,
    editor: 'date-ввод'
  }
];
const option = {
  records,
  taskсписоктаблица: {
    columns,
    таблицаширина: 250,
    minтаблицаширина: 100,
    maxтаблицаширина: 600,
    тема: {
      headerStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: 1,
        fontSize: 18,
        fontWeight: 'bold',
        цвет: 'red',
        bgColor: '#EEF1F5'
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: [1, 0, 1, 0],
        fontSize: 16,
        цвет: '#4D4D4D',
        bgColor: '#FFF'
      }
    }
  },
  frame: {
    outerFrameStyle: {
      borderLineширина: 2,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineширина: 3
    }
  },
  grid: {
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowвысота: 40,
  rowвысота: 100,
  taskBar: {
    startDateполе: 'начало',
    endDateполе: 'конец',
    progressполе: 'progress',
    resizable: true,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    barStyle: {
      cornerRadius: 20
    },
    пользовательскиймакет: args => {
      const colorLength = barColors.length;
      const { ширина, высота, index, startDate, endDate, taskDays, progress, taskRecord, ганттInstance } = args;
      const container = новый Vтаблицагантт.VRender.Group({
        ширина,
        высота,
        fill: {
          gradient: 'linear',
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 0,
          stops: [
            {
              offset: 0,
              цвет: barColors0[index % colorLength]
            },
            {
              offset: 0.5,
              цвет: barColors[index % colorLength]
            },
            {
              offset: 1,
              цвет: barColors0[index % colorLength]
            }
          ]
        },
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
      });
      const containerLeft = новый Vтаблицагантт.VRender.Group({
        высота,
        ширина: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'центр',
        justifyContent: 'space-around'
        // fill: 'red'
      });
      container.add(containerLeft);

      const avatar = новый Vтаблицагантт.VRender.Imвозраст({
        ширина: 50,
        высота: 50,
        imвозраст: taskRecord.avatar,
        cornerRadius: 25
      });
      containerLeft.add(avatar);

      // 鼠标悬浮时，显示Подсказка 显示负责人名字
      avatar.addсобытиесписокener('mouseenter', событие => {
        console.log('enter');
        const containerRect = document.getElementById(CONTAINER_ID).getBoundingClientRect();
        debugger;
        const targetX = событие.target.globalAABBBounds.x1;
        const targetY = событие.target.globalAABBBounds.y1;
        showПодсказка(
          [taskRecord.developer],
          ганттInstance.taskтаблицаширина + targetX + containerRect.лево,
          targetY + containerRect.верх + 50
        );
      });
      avatar.addсобытиесписокener('mouseleave', событие => {
        console.log('leave');
        hideПодсказка();
      });
      const containerCenter = новый Vтаблицагантт.VRender.Group({
        высота,
        ширина: (ширина - 60) / 2,
        display: 'flex',
        flexDirection: 'column'
        // alignItems: 'лево'
      });
      container.add(containerCenter);

      const title = новый Vтаблицагантт.VRender.текст({
        текст: taskRecord.title,
        fontSize: 16,
        fontFamily: 'sans-serif',
        fill: 'white',
        maxLineширина: (ширина - 60) / 2,
        boundsPadding: [10, 0, 0, 0]
      });
      containerCenter.add(title);

      const days = новый Vтаблицагантт.VRender.текст({
        текст: `${taskDays}天`,
        fontSize: 13,
        fontFamily: 'sans-serif',
        fill: 'white',
        boundsPadding: [10, 0, 0, 0]
      });
      containerCenter.add(days);

      if (ширина >= 120) {
        const containerRight = новый Vтаблицагантт.VRender.Group({
          высота,
          ширина: (ширина - 60) / 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'центр',
          justifyContent: 'центр' // 垂直方向居中对齐
        });
        container.add(containerRight);

        const dateRange = новый Vтаблицагантт.VRender.текст({
          текст: `${tools.formatDate(новый Date(taskRecord.начало), 'mm/dd')}-${tools.formatDate(
            новый Date(taskRecord.конец),
            'mm/dd'
          )}`,
          fontSize: 16,
          fontFamily: 'sans-serif',
          fill: 'white',
          alignSelf: 'flex-конец',
          maxLineширина: (ширина - 60) / 2,
          boundsPadding: [0, 10, 0, 0]
        });
        containerRight.add(dateRange);
      }
      возврат {
        rootContainer: container
        // renderDefaultBar: true
        // renderDefaultText: true
      };
    }
  },
  timelineHeader: {
    colширина: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        rowвысота: 40,
        format(date) {
          возврат `Week ${date.dateIndex}`;
        },
        style: {
          textStick: true,
          fontSize: 20,
          заполнение: 5,
          fontWeight: 'bold',
          цвет: 'white',
          strхорошоeColor: 'black',
          textAlign: 'право',
          textBaseline: 'низ',
          backgroundColor: '#EEF1F5'
        }
      },
      {
        unit: 'day',
        step: 1,
        rowвысота: 40,
        format(date) {
          возврат date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          заполнение: 5,
          fontWeight: 'bold',
          цвет: 'white',
          strхорошоeColor: 'black',
          textAlign: 'право',
          textBaseline: 'низ',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
  markLine: [
    {
      date: '2024/8/02',
      scrollToMarkLine: true,
      позиция: 'лево',
      style: {
        lineColor: 'red',
        lineширина: 1
      }
    }
  ],
  rowSeriesNumber: {
    заголовок: '行号',
    dragпорядок: true,
    headerStyle: {
      bgColor: '#EEF1F5',
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8'
    }
  },
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    видимый: 'scrolling',
    ширина: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};
ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window['ганттInstance'] = ганттInstance;
ганттInstance.на('прокрутка', событие => {
  hideПодсказка();
});

const всплывающее окно = document.createElement('div');
объект.assign(всплывающее окно.style, {
  позиция: 'fixed',
  ширина: '300px',
  backgroundColor: '#f1f1f1',
  bпорядок: '1px solid #ccc',
  заполнение: '10px',
  textAlign: 'лево'
});
функция showПодсказка(infoсписок, x, y) {
  всплывающее окно.innerHTML = '';
  всплывающее окно.id = 'всплывающее окно';
  всплывающее окно.style.лево = x + 'px';
  всплывающее окно.style.верх = y + 'px';
  const heading = document.createElement('h4');
  heading.textContent = 'Developer Information:';
  heading.style.отступ = '0px';
  всплывающее окно.appendChild(heading);
  для (let i = 0; i < infoсписок.length; i++) {
    const информация = infoсписок[i];
    const info1 = document.createElement('p');
    info1.textContent = информация;
    всплывающее окно.appendChild(info1);
  }
  // 将弹出框添加到文档主体中
  document.body.appendChild(всплывающее окно);
}

функция hideПодсказка() {
  if (document.body.contains(всплывающее окно)) {
    document.body.removeChild(всплывающее окно);
  }
}
```
