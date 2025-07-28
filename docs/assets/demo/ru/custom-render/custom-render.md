---
категория: примеры
группа: пользовательский
заголовок: Cell пользовательский content
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-render.png
порядок: 7-4
ссылка: пользовательский_define/пользовательский_render
опция: списоктаблица-columns-текст#пользовательскийRender.elements
---

# Cell пользовательский content

Set the текущий пользовательский функция through the column configuration item пользовательскийRender

## Ключевые Конфигурации

- `пользовательскийRender` Configure the апи к возврат what needs к be rendered

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const option = {
  columns: [
    {
      поле: 'тип',
      заголовок: '',
      ширина: 170,
      headerStyle: {
        bgColor: '#4991e3'
      },
      style: {
        fontFamily: 'Arial',
        fontWeight: 600,
        bgColor: '#4991e3',
        fontSize: 26,
        заполнение: 20,
        lineвысота: 32,
        цвет: 'white'
      }
    },
    {
      поле: 'urgency',
      заголовок: 'urgency',
      ширина: 400,
      headerStyle: {
        lineвысота: 50,
        fontSize: 26,
        fontWeight: 600,
        bgColor: '#4991e3',
        цвет: 'white',
        textAlign: 'центр'
      },
      пользовательскийRender(args) {
        const { ширина, высота } = args.rect;
        const { данныеValue, таблица, row } = args;
        const elements = [];
        let верх = 30;
        const лево = 15;
        let maxширина = 0;
        elements.push({
          тип: 'rect',
          fill: '#4991e3',
          x: лево + 20,
          y: верх - 20,
          ширина: 300,
          высота: 28
        });
        elements.push({
          тип: 'текст',
          fill: 'white',
          fontSize: 20,
          fontWeight: 500,
          textBaseline: 'середина',
          текст: row === 1 ? 'important & urgency' : 'не important but urgency',
          x: лево + 50,
          y: верх - 5
        });
        данныеValue.forEach((item, i) => {
          верх += 35;
          if (row === 1)
            elements.push({
              тип: 'иконка',
              svg: '<svg t="1687586728544" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1480" ширина="200" высота="200"><path d="M576.4 203.3c46.7 90.9 118.6 145.5 215.7 163.9 97.1 18.4 111.5 64.9 43.3 139.5s-95.6 162.9-82.3 265.2c13.2 102.3-24.6 131-113.4 86.2s-177.7-44.8-266.6 0-126.6 16-113.4-86.2c13.2-102.3-14.2-190.7-82.4-265.2-68.2-74.6-53.7-121.1 43.3-139.5 97.1-18.4 169-73 215.7-163.9 46.6-90.9 93.4-90.9 140.1 0z" fill="#733FF1" p-id="1481"></path></svg>',
              x: лево - 6,
              y: верх - 6,
              ширина: 12,
              высота: 12
            });
          else
            elements.push({
              тип: 'circle',
              strхорошоe: '#000',
              fill: 'yellow',
              x: лево,
              y: верх,
              radius: 3
            });
          elements.push({
            тип: 'текст',
            fill: 'blue',
            шрифт: '14px sans-serif',
            textBaseline: 'середина',
            текст: item,
            x: лево + 10,
            y: верх + 5
          });
          maxширина = Math.max(maxширина, таблица.measureText(item, { fontSize: '15' }).ширина);
        });
        возврат {
          elements,
          expectedвысота: верх + 20,
          expectedширина: maxширина + 20
        };
      }
    },
    {
      поле: 'not_urgency',
      заголовок: 'не urgency',
      ширина: 400,
      headerStyle: {
        lineвысота: 50,
        bgColor: '#4991e3',
        цвет: 'white',
        textAlign: 'центр',
        fontSize: 26,
        fontWeight: 600
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      },
      пользовательскийRender(args) {
        console.log(args);
        const { ширина, высота } = args.rect;
        const { данныеValue, таблица, row } = args;
        const elements = [];
        let верх = 30;
        const лево = 15;
        let maxширина = 0;

        elements.push({
          тип: 'rect',
          fill: '#4991e3',
          x: лево + 20,
          y: верх - 20,
          ширина: 320,
          высота: 28
        });

        elements.push({
          тип: 'текст',
          fill: 'white',
          fontSize: 20,
          fontWeight: 500,
          textBaseline: 'середина',
          текст: row === 1 ? 'important but не urgency' : 'не important и не urgency',
          x: лево + 50,
          y: верх - 5
        });
        данныеValue.forEach((item, i) => {
          верх += 35;
          elements.push({
            тип: 'rect',
            strхорошоe: '#000',
            fill: 'blue',
            x: лево - 3,
            y: верх - 3,
            ширина: 6,
            высота: 6
          });

          elements.push({
            тип: 'текст',
            fill: 'blue',
            шрифт: '14px sans-serif',
            textBaseline: 'середина',
            текст: item,
            x: лево + 6,
            y: верх
          });
          maxширина = Math.max(maxширина, таблица.measureText(item, { fontSize: '15' }).ширина);
        });
        возврат {
          elements,
          expectedвысота: верх + 20,
          expectedширина: 300
        };
      }
    }
  ],
  records: [
    {
      тип: 'important',
      urgency: ['crisis', 'urgent problem', 'tasks that must be completed within a limited time'],
      not_urgency: [
        'prсобытиеive measures',
        'development relationship',
        'identify новый development opportunities',
        'establish long-term goals'
      ]
    },
    {
      тип: 'не\nimportant',
      urgency: ['Receive visitors', 'Certain calls, reports, letters, etc', 'Urgent matters', 'Public activities'],
      not_urgency: [
        'Trivial busy work',
        'некоторые letters',
        'некоторые phone calls',
        'Time-killing activities',
        'некоторые pleasant activities'
      ]
    }
  ],
  defaultRowвысота: 80,
  высотаMode: 'автовысота',
  ширинаMode: 'standard',
  автоWrapText: true
};

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
