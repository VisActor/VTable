---
категория: примеры
группа: гантт
заголовок: пользовательский Rendering Usвозраст из гантт график
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-пользовательскиймакет-preview.png
ссылка: гантт/гантт_пользовательскиймакет
опция: гантт#taskBar
---

# пользовательский Rendering Usвозраст из гантт график

This пример демонстрацияnstrates how к пользовательскийize the rendering из гантт график task bars и date headers. The пользовательский rendering из the лево task information таблица is implemented в the пользовательскиймакет defined в columns. Refer к [tutorial](../../option/списоктаблица-columns-текст#пользовательскиймакет).

в this пример, the пользовательский rendering из the task bar is implemented в the пользовательскиймакет defined в taskBar; the пользовательский rendering из the date header is implemented в the пользовательскиймакет defined в timelineHeader. Refer к [tutorial](../../guide/гантт/гантт_пользовательскиймакет).

## Key Configuration

- `гантт`
- `taskBar`
- `timelineHeader`

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// import * as Vтаблицагантт от '@visactor/vтаблица-гантт';
// import * as VRender от '@visactor/vтаблица/es/vrender';
let ганттInstance;
const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
const records = [
  {
    id: 1,
    заголовок: 'Project Task 1',
    developer: 'bear.xiong',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg',
    начало: '2024-07-24',
    конец: '2024-07-26',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Project Task 2',
    developer: 'wolf.lang',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg',
    начало: '07/25/2024',
    конец: '07/28/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Project Task 3',
    developer: 'rabbit.tu',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg',
    начало: '2024-07-28',
    конец: '2024-08-01',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 1,
    заголовок: 'Project Task 4',
    developer: 'cat.mao',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg',
    начало: '2024-07-31',
    конец: '2024-08-03',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Project Task 5',
    developer: 'bird.niao',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bird.jpeg',
    начало: '2024-08-02',
    конец: '2024-08-04',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Project Task 6',
    developer: 'flower.hua',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg',
    начало: '2024-08-03',
    конец: '2024-08-10',
    progress: 100,
    priority: 'P1'
  }
];
const columns = [
  {
    поле: 'title',
    заголовок: 'TASK',
    ширина: '200',
    headerStyle: {
      textAlign: 'центр',
      fontSize: 20,
      fontWeight: 'bold',
      цвет: 'black',
      bgColor: '#f0f0fb'
    },
    style: {
      bgColor: '#f0f0fb'
    },
    пользовательскиймакет: args => {
      const { таблица, row, col, rect } = args;
      const taskRecord = таблица.getCellOriginRecord(col, row);
      const { высота, ширина } = rect ?? таблица.getCellRect(col, row);
      const container = новый Vтаблицагантт.VRender.Group({
        y: 10,
        x: 20,
        высота: высота - 20,
        ширина: ширина - 40,
        fill: 'white',
        display: 'flex',
        flexDirection: 'column',
        cornerRadius: 30
      });

      const developer = новый Vтаблицагантт.VRender.текст({
        текст: taskRecord.developer,
        fontSize: 16,
        fontFamily: 'sans-serif',
        fill: barColors[args.row],
        fontWeight: 'bold',
        maxLineширина: ширина - 120,
        boundsPadding: [10, 0, 0, 0],
        alignSelf: 'центр'
      });
      container.add(developer);

      const days = новый Vтаблицагантт.VRender.текст({
        текст: `${Vтаблицагантт.tools.formatDate(новый Date(taskRecord.начало), 'mm/dd')}-${Vтаблицагантт.tools.formatDate(
          новый Date(taskRecord.конец),
          'mm/dd'
        )}`,
        fontSize: 12,
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fill: 'black',
        boundsPadding: [10, 0, 0, 0],
        alignSelf: 'центр'
      });
      container.add(days);

      возврат {
        rootContainer: container,
        expectedширина: 160
      };
    }
  }
];
const option = {
  records,
  taskсписоктаблица: {
    columns,
    таблицаширина: 'авто',
    тема: {
      headerStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: 0,
        fontSize: 18,
        fontWeight: 'bold',
        цвет: 'red'
        // bgColor: '#EEF1F5'
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: 0,
        fontSize: 16,
        цвет: '#4D4D4D',
        bgColor: '#FFF'
      }
    }
  },
  frame: {
    outerFrameStyle: {
      borderLineширина: 0,
      borderColor: 'red',
      cornerRadius: 8
    }
    // verticalSplitLineHighlight: {
    //   lineColor: 'green',
    //   lineширина: 3
    // }
  },
  grid: {
    backgroundColor: '#f0f0fb',
    // vertical: {
    //   lineширина: 1,
    //   lineColor: '#e1e4e8'
    // },
    horizontalLine: {
      lineширина: 2,
      lineColor: '#d5d9ee'
    }
  },
  headerRowвысота: 60,
  rowвысота: 80,
  taskBar: {
    startDateполе: 'начало',
    endDateполе: 'конец',
    progressполе: 'progress',
    barStyle: { ширина: 60 },
    пользовательскиймакет: args => {
      const colorLength = barColors.length;
      const { ширина, высота, index, startDate, endDate, taskDays, progress, taskRecord, ганттInstance } = args;
      const container = новый Vтаблицагантт.VRender.Group({
        ширина,
        высота,
        cornerRadius: 30,
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
      const containerCenter = новый Vтаблицагантт.VRender.Group({
        высота,
        ширина: ширина - (ширина >= 120 ? 120 : 60),
        display: 'flex',
        flexDirection: 'column'
        // alignItems: 'лево'
      });
      container.add(containerCenter);

      const developer = новый Vтаблицагантт.VRender.текст({
        текст: taskRecord.developer,
        fontSize: 16,
        fontFamily: 'sans-serif',
        fill: 'white',
        fontWeight: 'bold',
        maxLineширина: ширина - (ширина >= 120 ? 120 : 60),
        boundsPadding: [10, 0, 0, 0]
      });
      containerCenter.add(developer);

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
          cornerRadius: 20,
          fill: 'white',
          высота: 40,
          ширина: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'центр',
          justifyContent: 'центр', // 垂直方向居中对齐
          boundsPadding: [10, 0, 0, 0]
        });
        container.add(containerRight);

        const progressText = новый Vтаблицагантт.VRender.текст({
          текст: `${progress}%`,
          fontSize: 12,
          fontFamily: 'sans-serif',
          fill: 'black',
          alignSelf: 'центр',
          fontWeight: 'bold',
          maxLineширина: (ширина - 60) / 2,
          boundsPadding: [0, 0, 0, 0]
        });
        containerRight.add(progressText);
      }
      возврат {
        rootContainer: container
        // renderDefaultBar: true
        // renderDefaultText: true
      };
    },
    hoverBarStyle: {
      cornerRadius: 30
    }
  },
  timelineHeader: {
    backgroundColor: '#f0f0fb',
    colширина: 80,
    // verticalLine: {
    //   lineColor: 'red',
    //   lineширина: 1,
    //   lineDash: [4, 2]
    // },
    // horizontalLine: {
    //   lineColor: 'green',
    //   lineширина: 1,
    //   lineDash: [4, 2]
    // },
    scales: [
      {
        unit: 'day',
        step: 1,
        format(date) {
          возврат date.dateIndex.toString();
        },
        пользовательскиймакет: args => {
          const colorLength = barColors.length;
          const { ширина, высота, index, startDate, endDate, days, dateIndex, title, ганттInstance } = args;
          const container = новый Vтаблицагантт.VRender.Group({
            ширина,
            высота,
            fill: '#f0f0fb',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });
          const containerLeft = новый Vтаблицагантт.VRender.Group({
            высота,
            ширина: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'центр',
            justifyContent: 'space-around'
            // fill: 'red'
          });
          container.add(containerLeft);

          const avatar = новый Vтаблицагантт.VRender.Imвозраст({
            ширина: 20,
            высота: 30,
            imвозраст:
              '<svg t="1724675965803" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4299" ширина="200" высота="200"><path d="M53.085678 141.319468C23.790257 141.319468 0 165.035326 0 194.34775L0 918.084273C0 947.295126 23.796789 971.112572 53.085678 971.112572L970.914322 971.112572C1000.209743 971.112572 1024 947.396696 1024 918.084273L1024 194.34775C1024 165.136896 1000.203211 141.319468 970.914322 141.319468L776.827586 141.319468 812.137931 176.629813 812.137931 88.275862C812.137931 68.774506 796.328942 52.965517 776.827586 52.965517 757.32623 52.965517 741.517241 68.774506 741.517241 88.275862L741.517241 176.629813 741.517241 211.940158 776.827586 211.940158 970.914322 211.940158C961.186763 211.940158 953.37931 204.125926 953.37931 194.34775L953.37931 918.084273C953.37931 908.344373 961.25643 900.491882 970.914322 900.491882L53.085678 900.491882C62.813237 900.491882 70.62069 908.306097 70.62069 918.084273L70.62069 194.34775C70.62069 204.087649 62.74357 211.940158 53.085678 211.940158L247.172414 211.940158C266.67377 211.940158 282.482759 196.131169 282.482759 176.629813 282.482759 157.128439 266.67377 141.319468 247.172414 141.319468L53.085678 141.319468ZM211.862069 176.629813C211.862069 196.131169 227.671058 211.940158 247.172414 211.940158 266.67377 211.940158 282.482759 196.131169 282.482759 176.629813L282.482759 88.275862C282.482759 68.774506 266.67377 52.965517 247.172414 52.965517 227.671058 52.965517 211.862069 68.774506 211.862069 88.275862L211.862069 176.629813ZM1024 353.181537 1024 317.871192 988.689655 317.871192 35.310345 317.871192 0 317.871192 0 353.181537 0 441.457399C0 460.958755 15.808989 476.767744 35.310345 476.767744 54.811701 476.767744 70.62069 460.958755 70.62069 441.457399L70.62069 353.181537 35.310345 388.491882 988.689655 388.491882 953.37931 353.181537 953.37931 441.457399C953.37931 460.958755 969.188299 476.767744 988.689655 476.767744 1008.191011 476.767744 1024 460.958755 1024 441.457399L1024 353.181537ZM776.937913 582.62069C796.439287 582.62069 812.248258 566.811701 812.248258 547.310345 812.248258 527.808989 796.439287 512 776.937913 512L247.172414 512C227.671058 512 211.862069 527.808989 211.862069 547.310345 211.862069 566.811701 227.671058 582.62069 247.172414 582.62069L776.937913 582.62069ZM247.172414 688.551724C227.671058 688.551724 211.862069 704.360713 211.862069 723.862069 211.862069 743.363425 227.671058 759.172414 247.172414 759.172414L600.386189 759.172414C619.887563 759.172414 635.696534 743.363425 635.696534 723.862069 635.696534 704.360713 619.887563 688.551724 600.386189 688.551724L247.172414 688.551724ZM776.827586 211.940158 741.517241 176.629813 741.517241 247.328574C741.517241 266.829948 757.32623 282.638919 776.827586 282.638919 796.328942 282.638919 812.137931 266.829948 812.137931 247.328574L812.137931 176.629813 812.137931 141.319468 776.827586 141.319468 247.172414 141.319468C227.671058 141.319468 211.862069 157.128439 211.862069 176.629813 211.862069 196.131169 227.671058 211.940158 247.172414 211.940158L776.827586 211.940158ZM282.482759 176.629813C282.482759 157.128439 266.67377 141.319468 247.172414 141.319468 227.671058 141.319468 211.862069 157.128439 211.862069 176.629813L211.862069 247.328574C211.862069 266.829948 227.671058 282.638919 247.172414 282.638919 266.67377 282.638919 282.482759 266.829948 282.482759 247.328574L282.482759 176.629813Z" fill="#389BFF" p-id="4300"></path></svg>'
          });
          containerLeft.add(avatar);

          const containerCenter = новый Vтаблицагантт.VRender.Group({
            высота,
            ширина: ширина - 30,
            display: 'flex',
            flexDirection: 'column'
            // alignItems: 'лево'
          });
          container.add(containerCenter);
          const dayNumber = новый Vтаблицагантт.VRender.текст({
            текст: строка(dateIndex).padStart(2, '0'),
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            fill: 'black',
            textAlign: 'право',
            maxLineширина: ширина - 30,
            boundsPadding: [15, 0, 0, 0]
          });
          containerCenter.add(dayNumber);

          const weekDay = новый Vтаблицагантт.VRender.текст({
            текст: Vтаблицагантт.tools.getWeekday(startDate, 'short').toLocaleUpperCase(),
            fontSize: 12,
            fontFamily: 'sans-serif',
            fill: 'black',
            boundsPadding: [0, 0, 0, 0]
          });
          containerCenter.add(weekDay);
          возврат {
            rootContainer: container
            //renderDefaultText: true
          };
        }
      }
    ]
  },
  minDate: '2024-07-20',
  maxDate: '2024-08-15',
  markLine: [
    {
      date: '2024-07-29',
      style: {
        lineширина: 1,
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    },
    {
      date: '2024-08-17',
      style: {
        lineширина: 2,
        lineColor: 'red',
        lineDash: [8, 4]
      }
    }
  ],
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    видимый: 'фокус',
    ширина: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};
ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window['ганттInstance'] = ганттInstance;
```
