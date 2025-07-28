---
категория: примеры
группа: пользовательский
заголовок: пользовательский Merge
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-merge-пользовательский.png
ссылка: пользовательский_define/пользовательский_merge
опция: списоктаблица-columns-текст#пользовательскиймакет
---

#Cell пользовательский merge

в cell пользовательский merging, Вы можете also use `пользовательскийRender` или `пользовательскиймакет` к implement пользовательский rendering или пользовательский макет в пользовательский merged cells.

## 代码演示

```javascript liveдемонстрация template=vтаблица
const VGroup = Vтаблица.VGroup;
const VText = Vтаблица.VText;
const VImвозраст = Vтаблица.VImвозраст;
const VTag = Vтаблица.VTag;

const option = {
  container: document.getElementById('container'),
  columns: [
    {
      поле: 'bloggerId',
      заголовок: 'bloggerId'
    },
    {
      поле: 'bloggerимя',
      заголовок: 'bloggerимя',
      ширина: 330
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
    },
    {},
    {}
  ],
  defaultRowвысота: 40,
  пользовательскийMergeCell: (col, row, таблица) => {
    if (col >= 0 && col < таблица.colCount && row === таблица.rowCount - 2) {
      возврат {
        range: {
          начало: {
            col: 0,
            row: таблица.rowCount - 2
          },
          конец: {
            col: таблица.colCount - 1,
            row: таблица.rowCount - 2
          }
        },
        пользовательскиймакет: args => {
          const { таблица, row, col, rect } = args;
          const { высота, ширина } = rect || таблица.getCellRect(col, row);
          const container = (
            <VGroup
              attribute={{
                id: 'container',
                ширина,
                высота,
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'центр',
                justifyContent: 'центр'
              }}
            >
              <VText
                attribute={{
                  id: 'текст',
                  текст: 'Created по ',
                  fontSize: 14,
                  fontFamily: 'sans-serif',
                  fill: 'black',
                  textAlign: 'лево',
                  textBaseline: 'верх',
                  boundsPadding: [0, 0, 0, 10]
                }}
              ></VText>
              <VTag
                attribute={{
                  текст: 'VisActor',
                  textStyle: {
                    fontSize: 14,
                    fontFamily: 'sans-serif',
                    fill: 'rgb(51, 101, 238)'
                  },
                  panel: {
                    видимый: true,
                    fill: '#e6fffb',
                    lineширина: 1,
                    cornerRadius: 4
                  }
                }}
              ></VTag>
            </VGroup>
          );
          возврат {
            rootContainer: container,
            renderDefault: false
          };
        }
      };
    } else if (col >= 0 && col < таблица.colCount && row === таблица.rowCount - 1) {
      возврат {
        текст: 'a',
        range: {
          начало: {
            col: 0,
            row: таблица.rowCount - 1
          },
          конец: {
            col: таблица.colCount - 1,
            row: таблица.rowCount - 1
          }
        },
        пользовательскийRender: args => {
          const { ширина, высота } = args.rect;
          const { данныеValue, таблица, row } = args;
          const elements = [];
          elements.push({
            тип: 'текст',
            fill: '#000',
            fontSize: 12,
            fontWeight: 500,
            textBaseline: 'верх',
            текст: '© 2024 VisActor',
            x: ширина / 2 - 50,
            y: 14
          });
          возврат {
            elements
          };
        }
      };
    }
  }
};

const instance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window.таблицаInstance = instance;
```
