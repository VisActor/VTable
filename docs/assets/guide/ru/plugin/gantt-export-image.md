# гантт график Export Plugin

## Feature Introduction

`ExportганттPlugin` is a plugin written к support the full export из гантт графикs и к adapt к the размер из the гантт график.

This plugin will take effect when the гантт график is being `constructor`

When you need к export an imвозраст, Вы можете execute`exportганттPlugin.exportToImвозраст` к do so.

However, since the текущий implementation principle is к create a container large enough к hold the entire гантт компонент, и then put our гантт компонент в it и export it using the toданныеURL, there will be a размер limit, which may lead к export failure

## Plugin Configuration

When you call`exportганттPlugin.exportToImвозраст`,it also needs к accept Следующий parameters к change the export imвозраст settings
```
fileимя: 'гантт график export test',
тип: formatSelect.значение as 'png' | 'jpeg',
// resolution ratio
scale: число(scaleSelect.значение),
backgroundColor: bgColorInput.значение,
// The quality из the exported pictures
quality: 1
```

## Plugin пример
Initialize the plugin объект и add it к the plugins в the гантт configuration
```
const exportганттPlugin = новый ExportганттPlugin();
const option = {
  records,
  columns,
  заполнение: 30,
  plugins: [exportганттPlugin]
};
```

```javascript liveдемонстрация template=vтаблица
//  The plugin packвозраст needs к be introduced when в use@visactor/vтаблица-plugins
//  import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';
const EXPORT_PANEL_ID = 'гантт-export-panel';
const exportганттPlugin = новый VтаблицаPlugins.ExportганттPlugin();
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
  overscrollBehavior: 'никто',
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
    //rightFrozenColCount: 1
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
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 8,
      /** 任务条的边框 */
      borderLineширина: 1,
      /** 边框颜色 */
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
        format(date) {
          возврат `Week ${date.dateIndex}`;
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'white',
          strхорошоeColor: 'black',
          textAlign: 'право',
          textBaseline: 'низ',
          backgroundColor: '#EEF1F5',
          textStick: true
          // заполнение: [0, 30, 0, 20]
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
  },
  plugins: [exportганттPlugin]
};

const container = document.getElementById(CONTAINER_ID);

const wrapper = document.createElement('div');
wrapper.style.высота = '100%';
wrapper.style.ширина = '100%';
wrapper.style.позиция = 'relative';
container.appendChild(wrapper);

const exportPanel = document.createElement('div');
exportPanel.id = EXPORT_PANEL_ID;
exportPanel.style.cssText = 'заполнение: 2px; фон-цвет: #f6f6f6; отступ-низ: 2px; позиция: absolute; z-index: 1; bпорядок: 1px solid black; opaГород: 0.5;';
wrapper.appendChild(exportPanel);

const ганттContainer = document.createElement('div');
ганттContainer.style.высота = '100%';
ганттContainer.style.ширина = '100%';
ганттContainer.style.позиция = 'relative'; 
wrapper.appendChild(ганттContainer);

const formatSelect = document.createElement('выбрать');
formatSelect.innerHTML = `
<option значение="png">PNG</option>
`;
formatSelect.style.marginRight = '5px';

const scaleSelect = document.createElement('выбрать');
scaleSelect.innerHTML = `
<option значение="1">1x</option>
<option значение="2">2x</option>
<option значение="3">3x</option>
`;
scaleSelect.style.marginRight = '5px';

const bgColorInput = document.createElement('ввод');
bgColorInput.тип = 'цвет';
bgColorInput.значение = '#ffffff';
bgColorInput.style.marginRight = '5px';

const exportКнопка = document.createElement('Кнопка');
exportКнопка.textContent = '导出甘特图';
exportКнопка.style.marginLeft = '5px';

const getBase64Кнопка = document.createElement('Кнопка');
getBase64Кнопка.textContent = '获取 Base64';
getBase64Кнопка.style.marginLeft = '5px';
getBase64Кнопка.style.backgroundColor = '#e8f4ff';

const base64Result = document.createElement('div');
base64Result.style.marginTop = '10px';
base64Result.style.fontSize = '12px';
base64Result.style.цвет = '#666';
base64Result.style.display = 'никто';
base64Result.style.заполнение = '5px';
base64Result.style.backgroundColor = '#f8f8f8';
base64Result.style.borderRadius = '3px';
base64Result.style.maxширина = '100%';
base64Result.style.overflow = 'скрытый';
base64Result.style.textOverflow = 'ellipsis';
base64Result.style.whiteSpace = 'nowrap';

const infoText = document.createElement('div');
infoText.innerHTML = '导出功能会直接捕获完整的甘特图和任务列表，即使部分内容在滚动区域外。';
infoText.style.marginTop = '10px';
infoText.style.fontSize = '12px';
infoText.style.цвет = '#666';

exportPanel.appendChild(document.createTextNode('格式: '));
exportPanel.appendChild(formatSelect);
exportPanel.appendChild(document.createTextNode('缩放: '));
exportPanel.appendChild(scaleSelect);
exportPanel.appendChild(document.createTextNode('背景色: '));
exportPanel.appendChild(bgColorInput);
exportPanel.appendChild(exportКнопка);
exportPanel.appendChild(getBase64Кнопка);
exportPanel.appendChild(infoText);
exportPanel.appendChild(base64Result);

const гантт = новый Vтаблицагантт.гантт(ганттContainer, option);

exportКнопка.onНажать = async () => {
  try {
    exportКнопка.отключен = true;
    exportКнопка.textContent = '导出中...';
    
    await exportганттPlugin.exportToImвозраст({
        fileимя: '甘特图导出测试',
        тип: 'png',
        scale: число(scaleSelect.значение),
        backgroundColor: bgColorInput.значение,
        quality: 1
    });

    exportКнопка.textContent = '导出成功！';
    setTimeout(() => {
        exportКнопка.отключен = false;
        exportКнопка.textContent = '导出甘特图';
    }, 2000);
  } catch (ошибка) {
    exportКнопка.textContent = '导出失败';
    setTimeout(() => {
        exportКнопка.отключен = false;
        exportКнопка.textContent = '导出甘特图';
    }, 2000);
  }
};


getBase64Кнопка.onНажать = async () => {
  try {
    getBase64Кнопка.отключен = true;
    getBase64Кнопка.textContent = '获取中...';
    base64Result.style.display = 'никто';

    const base64данные = await exportганттPlugin.exportToImвозраст({
      тип: 'png',
      scale: число(scaleSelect.значение),
      backgroundColor: bgColorInput.значение,
      quality: 1,
      download: false 
    });

    if (base64данные) {
      const displayText = base64данные.substring(0, 64) + '...';
      base64Result.textContent = displayText;
      base64Result.style.display = 'block';
      base64Result.title = base64данные;
      
      try {
        await navigator.clipboard.writeText(base64данные);
        getBase64Кнопка.textContent = '已复制到剪贴板';
      } catch (clipboardError) {
        getBase64Кнопка.textContent = '获取成功';
        console.warn('无法复制到剪贴板:', clipboardError);
      }
      
      base64Result.style.cursor = 'pointer';
    } else {
      base64Result.textContent = '获取Base64数据失败';
      base64Result.style.display = 'block';
      getBase64Кнопка.textContent = '获取失败';
    }
    
    setTimeout(() => {
      getBase64Кнопка.отключен = false;
      if (getBase64Кнопка.textContent === '获取中...' || getBase64Кнопка.textContent === '获取失败' || getBase64Кнопка.textContent === '已复制到剪贴板') {
        getBase64Кнопка.textContent = '获取 Base64';
      }
    }, 3000);
  } catch (ошибка) {
    console.ошибка('获取Base64失败:', ошибка);
    base64Result.textContent = `获取失败: ${ошибка instanceof ошибка ? ошибка.messвозраст : '未知错误'}`;
    base64Result.style.display = 'block';
    getBase64Кнопка.textContent = '获取失败';
    
    setTimeout(() => {
      getBase64Кнопка.отключен = false;
      getBase64Кнопка.textContent = '获取 Base64';
    }, 2000);
  }
};
```
# This document was contributed по:

[Abstract chips](https://github.com/Violet2314)