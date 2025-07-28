---
категория: примеры
группа: календарь
заголовок: календарь
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/календарь-weather.gif
ссылка: календарь/introduction
опция: календарь#startDate
---

# Weather календарь

Cell пользовательский content, implement weather календарь.

## Ключевые Конфигурации

- `таблицаOptions` календарь таблица configuration (this configuration will be passed к the corresponding Vтаблица instance для deep пользовательскийization)

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// import * as VRender от '@visactor/vтаблица/es/vrender';

const {
  createGroup,
  GifImвозраст,
  container,
  gifImвозрастModule,
  gifImвозрастCanvasPickModule
} = VRender;

const gifs = [
  '/иконкаs8-雨.gif',
  '/иконкаs8-夏季.gif',
  '/иконкаs8-多云兼雨.gif',
  '/иконкаs8-有风的天气.gif',
  '/иконкаs8-冬季.gif',
  '/иконкаs8-小雨2.gif',
  '/иконкаs8-瓢泼大雨.gif',
  '/иконкаs8-白天晴间多云.gif'
];

container.load(gifImвозрастModule);
container.load(gifImвозрастCanvasPickModule);

const календарь = новый Vтаблицакалендарь.календарь(document.getElementById(CONTAINER_ID), {
  rangeDays: 20,
  таблицаOptions: {
    пользовательскиймакет: args => {
      const { таблица, row, col, rect } = args;
      const record = таблица.getCellOriginRecord(col, row);
      const { высота, ширина } = rect ?? таблица.getCellRect(col, row);

      const container = createGroup({
        высота,
        ширина,
        // fill: 'yellow',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'центр',
        alignItems: 'центр',
        flexWrap: 'nowrap'
      });

      const gif = gifs[Math.floor(Math.random() * gifs.length)];
      const imвозраст = новый GifImвозраст({
        ширина: 50,
        высота: 50,
        gifImвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media' + gif
      });

      container.add(imвозраст);

      возврат {
        rootContainer: container,
        renderDefault: true
      };
    }
  }
});

window['календарь'] = календарь;
```
