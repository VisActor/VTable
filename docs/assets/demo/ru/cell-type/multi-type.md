---
категория: примеры
группа: Cell тип
заголовок: Cell Content тип
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/multi-тип.png
порядок: 2-1
ссылка: cell_type/cellType
опция: списоктаблица-columns-текст#cellType
---

# Cell Content тип

Specify the cell content тип по cellType. Imвозраст video source: https://birdsoftheworld.org/bow/home

## Ключевые Конфигурации

headerType: 'текст' | 'link' | 'imвозраст' | 'video';

cellType:
'текст'
| 'link'
| 'imвозраст'
| 'video'
| 'Sparkline'
| 'progressbar'
| 'график';

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const records = [
  {
    имя: 'pigeon',
    introduction: 'The pigeon is a common urban bird с gray plumвозраст и a short, stout beak',
    imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/pigeon.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/pigeon.mp4',
    YoY: 50,
    QoQ: 10,
    trend: [
      { x: 1, y: 1500 },
      { x: 2, y: 1480 },
      { x: 3, y: 1520 },
      { x: 4, y: 1550 },
      { x: 5, y: 1600 }
    ]
    // "trend":[1500,1480,1520,1550,1600],
  },
  {
    имя: 'Swallow',
    introduction: 'Swallow is a kind из bird that is good в flying, usually perches near houses и buildings.',
    imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/swallow.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/swallow.mp4',
    YoY: 10,
    QoQ: -10,
    trend: [
      { x: 1, y: 800 },
      { x: 2, y: 780 },
      { x: 3, y: 700 },
      { x: 4, y: 800 },
      { x: 5, y: 900 }
    ]
  },
  {
    имя: 'Magpie',
    introduction:
      'The magpie is a common small bird mainly found в Asia. They are small в размер с a black head и throat, gray back и white belly. Magpies are social animals и often live в woods Breeding nests в China или в urban parks, feeding на insects, fruit и seeds. They are also highly intelligent и social, и are considered an intelligent, playful bird.',
    imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/Magpie.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/Magpie.mp4',
    YoY: -10,
    QoQ: -10,
    trend: [
      { x: 1, y: 500 },
      { x: 2, y: 680 },
      { x: 3, y: 400 },
      { x: 4, y: 600 },
      { x: 5, y: 800 }
    ]
  },
  {
    имя: 'Peacock',
    introduction:
      'The peacock is a large, beautiful bird с brilliant blue-green plumвозраст и a long tail. Native к South Asia, it feeds на insects, fruit, и seeds.',
    imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/peacock.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/peacock.mp4',
    YoY: -10,
    QoQ: -10,
    trend: [
      { x: 1, y: 500 },
      { x: 2, y: 680 },
      { x: 3, y: 400 },
      { x: 4, y: 600 },
      { x: 5, y: 800 }
    ]
  },
  {
    имя: 'Peacock',
    introduction:
      'The flamingo is a beautiful pink bird с long legs и neck, good в swimming, и is a common bird в tropical areas.',
    imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/flamingo.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/flamingo.mp4',
    YoY: -1,
    QoQ: -6,
    trend: [
      { x: 1, y: 980 },
      { x: 2, y: 880 },
      { x: 3, y: 900 },
      { x: 4, y: 1600 },
      { x: 5, y: 1800 }
    ]
  },
  {
    имя: 'ostrich',
    introduction:
      'The ostrich is a large bird that cannot fly и runs fast. It is one из the largest birds в the world',
    imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/ostrich.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/ostrich.mp4',
    YoY: -3,
    QoQ: 10,
    trend: [
      { x: 1, y: 560 },
      { x: 2, y: 680 },
      { x: 3, y: 5500 },
      { x: 4, y: 600 },
      { x: 5, y: 900 }
    ]
  },
  {
    имя: 'Mandarin Duck',
    introduction:
      'Mandarin duck is a kind из two-winged bird. The head из the male bird is blue и the head из the female bird is brown. It usually perches и mates в pairs. It is one из the symbols в Chinese culture.',
    imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/Mandarin.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/Mandarin.mp4',
    YoY: 10,
    QoQ: 16,
    trend: [
      { x: 1, y: 500 },
      { x: 2, y: 480 },
      { x: 3, y: 400 },
      { x: 4, y: 500 },
      { x: 5, y: 800 }
    ]
  }
];

const columns = [
  {
    поле: 'имя',
    заголовок: 'имя',
    cellType: 'link',
    templateссылка: 'https://www.google.com.hk/search?q={имя}',
    linkJump: true,
    ширина: 100
  },
  {
    поле: 'introduction',
    заголовок: 'introduction',
    cellType: 'текст',
    ширина: 200
  },
  {
    поле: 'imвозраст',
    заголовок: 'bird imвозраст',
    cellType: 'imвозраст',
    ширина: 150
    // imвозрастSizing : 'keep-aspect-ratio',
  },
  {
    поле: 'video',
    заголовок: 'bird video',
    cellType: 'video',
    ширина: 150
    // imвозрастSizing : 'keep-aspect-ratio',
  },
  {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина: 200,
    полеFormat() {
      возврат '';
    },
    barType: 'negative',
    min: -20,
    max: 60,
    style: {
      barвысота: 20,
      barBottom: '30%'
    }
  },
  {
    поле: 'QoQ',
    заголовок: 'count Quarter-over-Quarter',
    полеFormat(rec) {
      возврат rec['QoQ'] + '%';
    },
    style: {
      textAlign: 'центр'
    },
    иконка(args) {
      const { данныеValue } = args;
      if (данныеValue > 0) {
        возврат {
          тип: 'svg',
          svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/up-arrow.svg',
          ширина: 12,
          высота: 12,
          имя: 'up-green',
          positionType: 'inlineEnd'
        };
      } else if (данныеValue < 0)
        возврат {
          тип: 'svg',
          svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/down-arrow.svg',
          ширина: 14,
          высота: 14,
          имя: 'down-red',
          positionType: 'contentRight'
        };
      возврат '';
    },
    ширина: 150
  },
  {
    поле: 'trend',
    заголовок: 'bird count',
    cellType: 'sparkline',
    ширина: 300,
    sparklineSpec: {
      тип: 'line',
      xполе: 'x',
      yполе: 'y',
      pointShowRule: 'никто',
      smooth: true,
      line: {
        style: {
          strхорошоe: '#2E62F1',
          strхорошоeширина: 2
        }
      },
      point: {
        навести: {
          strхорошоe: 'blue',
          strхорошоeширина: 1,
          fill: 'red',
          shape: 'circle',
          размер: 4
        },
        style: {
          strхорошоe: 'red',
          strхорошоeширина: 1,
          fill: 'yellow',
          shape: 'circle',
          размер: 2
        }
      },
      crosshair: {
        style: {
          strхорошоe: 'gray',
          strхорошоeширина: 1
        }
      }
    }
  }
];
const option = {
  records,
  columns,
  автоWrapText: true,
  defaultRowвысота: 120
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
