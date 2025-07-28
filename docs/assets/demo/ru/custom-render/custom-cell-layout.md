---
категория: примеры
группа: пользовательский
заголовок: Cell пользовательский макет
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-cell-макет.png
ссылка: пользовательский_define/пользовательский_макет
опция: списоктаблица-columns-текст#пользовательскиймакет
---

# Cell пользовательский макет

пользовательскийize cell content к achieve imвозраст и текст mixing effects

## Ключевые Конфигурации

- `пользовательскиймакет` Configure the апи к возврат what needs к be rendered

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// only use для website
const { createGroup, createText, createImвозраст, Tag, флажок, переключатель } = VRender;
// use this для project
// import {createGroup, createText, createImвозраст, Tag, флажок, переключатель} от '@visactor/vтаблица/es/vrender';

Vтаблица.регистрация.иконка('location', {
  тип: 'svg',
  имя: 'location',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/location.svg'
});
Vтаблица.регистрация.иконка('favorite', {
  тип: 'svg',
  имя: 'favorite',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  ширина: 20,
  высота: 20,
  cursor: 'pointer',
  Подсказка: {
    placement: Vтаблица.TYPES.Placement.верх,
    заголовок: 'follow',
    style: {
      шрифт: '10px Arial',
      bgColor: 'white',
      цвет: '#333',
      arrowMark: true
    }
  },
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/favorite.svg'
});

Vтаблица.регистрация.иконка('messвозраст', {
  тип: 'svg',
  имя: 'messвозраст',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  ширина: 20,
  высота: 20,
  marginLeft: 10,
  cursor: 'pointer',
  Подсказка: {
    placement: Vтаблица.TYPES.Placement.верх,
    заголовок: 'send messвозраст',
    style: {
      шрифт: '10px Arial',
      bgColor: 'white',
      цвет: '#333',
      arrowMark: true
    }
  },
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/messвозраст.svg'
});

const option = {
  columns: [
    {
      поле: 'bloggerId',
      заголовок: 'order число'
    },
    {
      поле: 'bloggerимя',
      заголовок: 'anchor nickимя',
      ширина: 330,
      style: {
        fontFamily: 'Arial',
        fontWeight: 500
      },
      пользовательскиймакет: args => {
        const { таблица, row, col, rect } = args;
        const record = таблица.getCellOriginRecord(col, row);
        const { высота, ширина } = rect ?? таблица.getCellRect(col, row);

        const container = createGroup({
          высота,
          ширина,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        });
        const containerLeft = createGroup({
          высота,
          ширина: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'центр',
          justifyContent: 'space-around'
        });
        container.add(containerLeft);

        const иконка0 = createImвозраст({
          id: 'иконка0',
          ширина: 50,
          высота: 50,
          imвозраст: record.bloggerAvatar,
          cornerRadius: 25
        });
        containerLeft.add(иконка0);

        const containerRight = createGroup({
          высота,
          ширина: ширина - 60,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap'
        });
        container.add(containerRight);

        const containerRightTop = createGroup({
          высота: высота / 2,
          ширина,
          display: 'flex',
          alignItems: 'flex-конец'
        });

        const containerRightBottom = createGroup({
          высота: высота / 2,
          ширина,
          display: 'flex',
          alignItems: 'центр'
        });

        containerRight.add(containerRightTop);
        containerRight.add(containerRightBottom);

        const bloggerимя = createText({
          текст: record.bloggerимя,
          fontSize: 13,
          fontFamily: 'sans-serif',
          fill: 'black'
        });
        containerRightTop.add(bloggerимя);

        const location = createImвозраст({
          id: 'location',
          imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/location.svg',
          ширина: 15,
          высота: 15,
          boundsPadding: [0, 0, 0, 10]
        });
        containerRightTop.add(location);

        const locationимя = createText({
          текст: record.Город,
          fontSize: 11,
          fontFamily: 'sans-serif',
          fill: '#6f7070'
        });
        containerRightTop.add(locationимя);

        для (let i = 0; i < record?.tags?.length ?? 0; i++) {
          const tag = новый Tag({
            текст: record.tags[i],
            textStyle: {
              fontSize: 10,
              fontFamily: 'sans-serif',
              fill: 'rgb(51, 101, 238)'
            },
            panel: {
              видимый: true,
              fill: '#f4f4f2',
              cornerRadius: 5
            },
            space: 5,
            boundsPadding: [0, 0, 0, 5]
          });
          containerRightBottom.add(tag);
        }
        возврат {
          rootContainer: container,
          renderDefault: false
        };
      }
    },
    {
      поле: 'fansCount',
      заголовок: 'fansCount',
      полеFormat(rec) {
        возврат rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      поле: 'worksCount',
      заголовок: 'worksCount',
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      поле: 'viewCount',
      заголовок: 'viewCount',
      полеFormat(rec) {
        возврат rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      поле: 'viewCount',
      заголовок: 'viewCount',
      полеFormat(rec) {
        возврат rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      поле: '',
      заголовок: 'Operation options',
      ширина: 200,
      пользовательскиймакет: args => {
        const { таблица, row, col, rect } = args;
        const { высота, ширина } = rect ?? таблица.getCellRect(col, row);

        const container = createGroup({
          высота,
          ширина,
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'центр',
          justifyContent: 'центр'
        });

        const checkboxGroup = createGroup({
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'no-wrap',
          boundsPadding: [5, 0, 5, 10],
          justifyContent: 'центр'
        });
        container.appendChild(checkboxGroup);

        const checkboxText = createText({
          текст: 'operate: ',
          fontSize: 12,
          boundsPadding: [0, 10, 0, 0]
        });
        checkboxGroup.appendChild(checkboxText);

        const checkbox1 = новый флажок({
          текст: {
            текст: 'like',
            fontSize: 12
          },
          spaceBetweenTextAndиконка: 2,
          boundsPadding: [0, 10, 0, 0]
        });
        checkbox1.render();
        checkboxGroup.appendChild(checkbox1);
        checkbox1.addсобытиесписокener('checkbox_state_change', e => {
          console.log('checkbox_state_change', e);
        });

        const checkbox2 = новый флажок({
          текст: {
            текст: 'collect',
            fontSize: 12
          },
          spaceBetweenTextAndиконка: 2
          // boundsPadding: [10, 0, 0, 10]
        });
        checkbox2.render();
        checkboxGroup.appendChild(checkbox2);
        checkbox2.addсобытиесписокener('checkbox_state_change', e => {
          console.log('checkbox_state_change', e);
        });

        const radioGroup = createGroup({
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'no-wrap',
          boundsPadding: [5, 0, 5, 10]
        });
        container.appendChild(radioGroup);

        const radioText = createText({
          текст: 'тип: ',
          fontSize: 12,
          boundsPadding: [0, 10, 0, 0]
        });
        radioGroup.appendChild(radioText);

        const radio1 = новый переключатель({
          текст: {
            текст: 'normal',
            fontSize: 12
          },
          checked: true,
          spaceBetweenTextAndиконка: 2,
          boundsPadding: [0, 10, 0, 0]
        });
        radio1.render();
        radioGroup.appendChild(radio1);
        radio1.addсобытиесписокener('radio_checked', () => {
          if (radio2.attribute.checked) {
            radio2.setAttribute('checked', false);
            таблица.scenegraph.updateNextFrame();
          }
        });

        const radio2 = новый переключатель({
          текст: {
            текст: 'special',
            fontSize: 12
          },
          spaceBetweenTextAndиконка: 2
        });
        radio2.render();
        radioGroup.appendChild(radio2);
        radio2.addсобытиесписокener('radio_checked', () => {
          if (radio1.attribute.checked) {
            radio1.setAttribute('checked', false);
            таблица.scenegraph.updateNextFrame();
          }
        });

        возврат {
          rootContainer: container,
          renderDefault: false
        };
      }
    },
    {
      поле: '',
      заголовок: 'operation',
      ширина: 100,
      иконка: ['favorite', 'messвозраст']
    }
  ],
  records: [
    {
      bloggerId: 1,
      bloggerимя: 'Virtual Anchor Xiaohua',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg',
      introduction:
        'Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation и food. I hope к share happy moments с you through live broadcast.',
      fansCount: 400,
      worksCount: 10,
      viewCount: 5,
      Город: 'Dream Город',
      tags: ['game', 'anime', 'food']
    },
    {
      bloggerId: 2,
      bloggerимя: 'Virtual anchor little wolf',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg',
      introduction:
        'Hello everyone, I am the virtual anchor Little Wolf. I like music, travel и photography, и I hope к explore the beauty из the world с you through live broadcast.',
      fansCount: 800,
      worksCount: 20,
      viewCount: 15,
      Город: 'Город из Music',
      tags: ['music', 'travel', 'photography']
    },
    {
      bloggerId: 3,
      bloggerимя: 'Virtual anchor bunny',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg',
      introduction:
        'Hello everyone, I am the virtual anchor Xiaotu. I like painting, handicrafts и beauty makeup. I hope к share creativity и fashion с you through live broadcast.',
      fansCount: 600,
      worksCount: 15,
      viewCount: 10,
      Город: 'Город из Art',
      tags: ['painting', 'handmade', 'beauty makeup']
    },
    {
      bloggerId: 4,
      bloggerимя: 'Virtual anchor kitten',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg',
      introduction:
        'Hello everyone, I am the virtual host Kitty. I am a lazy cat who likes dancing, fitness и coхорошоing. I hope к live a healthy и happy life с everyone through the live broadcast.',
      fansCount: 1000,
      worksCount: 30,
      viewCount: 20,
      Город: 'Health Город',
      tags: ['dance', 'fitness', 'coхорошоing']
    },
    {
      bloggerId: 5,
      bloggerимя: 'Virtual anchor Bear',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg',
      introduction:
        'Hello everyone, I am the virtual host Xiaoxiong. A little wise man who likes movies, reading и philosophy, I hope к explore the meaning из life с you through live broadcast.',
      fansCount: 1200,
      worksCount: 25,
      viewCount: 18,
      Город: 'Город из Wisdom',
      tags: ['Movie', 'Literature']
    },
    {
      bloggerId: 6,
      bloggerимя: 'Virtual anchor bird',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bird.jpeg',
      introduction:
        'Hello everyone, I am the virtual anchor Xiaoniao. I like singing, acting и variety shows. I hope к be happy с everyone through the live broadcast.',
      fansCount: 900,
      worksCount: 12,
      viewCount: 8,
      Город: 'Happy Город',
      tags: ['music', 'Производительность', 'variety']
    }
  ],
  defaultRowвысота: 80
};

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
