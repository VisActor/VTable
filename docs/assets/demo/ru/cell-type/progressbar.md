---
категория: примеры
группа: Cell тип
заголовок: Progressba тип
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/progressbar.png
порядок: 2-2
ссылка: cell_type/progressbar
опция: списоктаблица-columns-progressbar#cellType
---

# данные Bar тип

демонстрацияnstrate multiple ways к use stripe types

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
    имя: '鸽子',
    introduction: '鸽子是一种常见的城市鸟类，具有灰色的羽毛和短而粗壮的喙',
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
    //  "trend":[1500,1480,1520,1550,1600],
  },
  {
    имя: '燕子',
    introduction: '燕子是一种善于飞行的鸟类，通常栖息在房屋和建筑物的附近。',
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
    имя: '喜鹊',
    introduction:
      '喜鹊是一种常见的小型鸟类，主要分布在亚洲地区。它们体型较小，具有黑色的头部和喉咙、灰色的背部和白色的腹部。喜鹊是群居动物，常常在树林中或城市公园中筑巢繁殖，以昆虫、果实和种子为食。它们还具有很高的智商和社交性，被认为是一种聪明、有趣的鸟类。',
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
    имя: '孔雀',
    introduction:
      '孔雀是一种美丽的大型鸟类，拥有灿烂的蓝绿色羽毛和长长的尾羽。主要生活在南亚地区，以昆虫、水果和种子为食。',
    imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/peacock.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/peacock.mp4',
    YoY: 5,
    QoQ: -10,
    trend: [
      { x: 1, y: 500 },
      { x: 2, y: 680 },
      { x: 3, y: 400 },
      { x: 4, y: 600 },
      { x: 5, y: 800 }
    ]
  }
];

const columns = [
  {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина: 200,
    полеFormat(rec) {
      if (typeof rec['YoY'] === 'число') возврат rec['YoY'] + '%';
      возврат rec['YoY'];
    }
  },
  {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина: 200,
    style: {
      barвысота: '100%',
      // barBgColor: '#aaa',
      // barColor: '#444',
      barBgColor: данные => {
        возврат `rgb(${200 + 50 * (1 - данные.percentile)},${255 * (1 - данные.percentile)},${255 * (1 - данные.percentile)})`;
      },
      barColor: 'transparent'
    }
  },
  {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина: 200,
    полеFormat() {
      возврат '';
    },
    min: -20,
    max: 60,
    style: {
      showBar: true,
      barColor: данные => {
        возврат `rgb(${200 + 50 * (1 - данные.percentile)},${255 * (1 - данные.percentile)},${255 * (1 - данные.percentile)})`;
      },
      barвысота: 20,
      barBottom: '30%'
    }
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
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина: 200,
    barType: 'negative_no_axis',
    min: -20,
    max: 60,
    style: {
      textAlign: 'право',
      barвысота: 20,
      barBottom: '30%',
      barBgColor: 'rgba(217,217,217,0.3)'
    }
  },
  {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина: 200,
    barType: 'negative_no_axis',
    min: -20,
    max: 60,
    style: {
      showBar: false
    }
  }
];
const option = {
  records,
  columns,
  автоWrapText: true
  // автоRowвысота:true
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
