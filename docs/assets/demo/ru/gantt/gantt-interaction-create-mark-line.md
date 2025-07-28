---
категория: примеры
группа: гантт
заголовок: гантт график interaction - create markLine
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-markline-create.gif
ссылка: гантт/introduction
опция: гантт#IMarkLineCreateOptions
---

# гантт график interaction - create markLine

гантт create markLine。
`IMarkLineCreateOptions`и`IMarkLine`。
демонстрация shows the pop-up window для creating markline needs к be implemented по yourself, и the код only provides the Нажать обратный вызов для creating markline.

## Key Configuration

- `гантт`
- `гантт#IMarkLineCreateOptions` create markLine configuration
- `гантт#IMarkLine` markLine configuration

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// import * as Vтаблицагантт от '@visactor/vтаблица-гантт';
функция formatDate(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  возврат year + '-' + month + '-' + day;
}

функция createPopup({ date, content }, позиция, обратный вызов) {
  const container = document.getElementById('live-демонстрация-additional-container');

  // 创建弹窗元素
  const всплывающее окно = document.createElement('div');
  всплывающее окно.classимя = 'всплывающее окно';

  // 设置定位参数
  всплывающее окно.style.верх = `${позиция.верх}px`;
  всплывающее окно.style.лево = `${позиция.лево}px`;
  всплывающее окно.style.позиция = 'absolute';
  всплывающее окно.style.фон = '#ccc';
  всплывающее окно.style.заполнение = '10px';
  всплывающее окно.style.zIndex = '10000';

  // 日期显示格式化
  const dateString = typeof date === 'строка' ? date : formatDate(date);

  // 弹窗内容
  всплывающее окно.innerHTML = `
      <span class="закрыть-btn" onНажать="this.parentElement.remove()">×</span>
      <div>日期：${dateString}</div>
      <ввод тип="текст" placeholder="输入内容"  class="всплывающее окно-ввод" значение="${content}" />
      <Кнопка class="confirm-btn">确定</Кнопка>
  `;

  const confirmBtn = всплывающее окно.querySelector('.confirm-btn');
  confirmBtn.addсобытиесписокener('Нажать', () => {
    const inputValue = всплывающее окно.querySelector('.всплывающее окно-ввод').значение;
    всплывающее окно.remove();
    if (typeof обратный вызов === 'функция') {
      обратный вызов(inputValue);
    }
  });

  // 添加弹窗到容器
  container.appendChild(всплывающее окно);
}

const records = [
  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    progress: 90,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '07/14/2024',
    конец: '07/24/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-10',
    конец: '2024-07-14',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-04',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024.07.06',
    конец: '2024.07.08',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024/07/09',
    конец: '2024/07/11',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '07.24.2024',
    конец: '08.04.2024',
    progress: 31,
    priority: 'P0'
  }
];

const columns = [
  // {
  //   поле: 'id',
  //   заголовок: 'ID',
  //   ширина: 80,
  //   сортировка: true
  // },
  {
    поле: 'title',
    заголовок: 'title',
    ширина: 200,
    сортировка: true
  },
  {
    поле: 'начало',
    заголовок: 'начало',
    ширина: 150,
    сортировка: true
  },
  {
    поле: 'конец',
    заголовок: 'конец',
    ширина: 150,
    сортировка: true
  },
  {
    поле: 'priority',
    заголовок: 'priority',
    ширина: 100,
    сортировка: true
  },

  {
    поле: 'progress',
    заголовок: 'progress',
    ширина: 200,
    сортировка: true
  }
];
const option = {
  records,
  taskсписоктаблица: {
    columns: columns,
    таблицаширина: 400,
    minтаблицаширина: 100,
    maxтаблицаширина: 600
  },
  resizeLineStyle: {
    lineColor: 'green',
    lineширина: 3
  },

  frame: {
    verticalSplitLineMoveable: true,
    outerFrameStyle: {
      borderLineширина: 2,
      borderColor: 'red',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineширина: 3,
      lineColor: '#e1e4e8'
    },
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineширина: 3
    }
  },
  grid: {
    // backgroundColor: 'gray',
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    }
  },
  defaultHeaderRowвысота: 60,
  defaultRowвысота: 40,
  timelineHeader: {
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    backgroundColor: '#EEF1F5',
    colширина: 60,
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          возврат `Week ${date.dateIndex}`;
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'red',
          backgroundColor: '#EEF1F5'
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          возврат date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'red',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
  minDate: '2024-10-01',
  maxDate: '2024-10-15',
  markLine: [
    {
      date: '2024-10-06',
      content: '我的啊啊得的',
      contentStyle: {
        цвет: '#fff'
        // fontSize: 40
      },
      style: {
        lineширина: 1,
        lineColor: 'red'
      }
    },
    {
      date: '2024-10-08 8:00:00',
      content: 'mrkLine(date)',
      позиция: 'date',
      contentStyle: {
        цвет: '#fff'
        // fontSize: 40
      },
      style: {
        lineширина: 1,
        lineColor: 'blue'
      }
    }
  ],
  scrollStyle: {
    видимый: 'scrolling'
  },
  overscrollBehavior: 'никто',
  markLineCreateOptions: {
    markLineCreaтаблица: true,
    markLineCreationHoverПодсказка: {
      позиция: 'верх',
      tipContent: '创建里程碑',
      style: {
        contentStyle: {
          fill: '#fff'
        },
        panelStyle: {
          фон: '#14161c',
          cornerRadius: 4
        }
      }
    },
    markLineCreationStyle: {
      fill: '#ccc',
      размер: 30,
      иконкаSize: 12,
      svg: '<svg t="1741145302032" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2861" ширина="200" высота="200"><path d="M967.68 558.08v-89.6H542.72V43.52h-87.04v424.96H30.72v89.6h424.96v422.4h87.04V558.08z" fill="" p-id="2862"></path></svg>'
    }
  }
};

const ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window.ганттInstance = ганттInstance;
ганттInstance.на('Нажать_markline_create', ({ данные, позиция }) => {
  createPopup({ date: данные.startDate, content: '' }, позиция, значение => {
    ганттInstance.addMarkLine({
      date: formatDate(данные.startDate),
      content: значение,
      contentStyle: {
        цвет: '#fff'
      },
      style: {
        lineширина: 1,
        lineColor: 'red'
      }
    });
  });
});
ганттInstance.на('Нажать_markline_content', ({ данные, позиция }) => {
  createPopup({ date: данные.date, content: данные.content }, позиция, значение => {
    ганттInstance.updateCurrentMarkLine({ date: данные.date, content: значение });
  });
});
```
