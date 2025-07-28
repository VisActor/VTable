---
категория: примеры
группа: пользовательский
заголовок: 单元格自定义布局（JSX）
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-cell-макет-jsx.png
ссылка: пользовательский_define/пользовательский_макет
опция: списоктаблица-columns-текст#пользовательскиймакет
---

# Cell пользовательский макет

Using JSX к describe пользовательский cell content can more clearly express the hierarchical relationship between graphics elements и increase maintainability.

## Ключевые Конфигурации

- `пользовательскиймакет` Configure the апи к возврат what needs к be rendered

## код демонстрация

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
      заголовок: 'order число'
    },
    {
      поле: 'bloggerимя',
      заголовок: 'anchor nickимя',
      ширина: 330,
      пользовательскиймакет: args => {
        const { таблица, row, col, rect } = args;
        const { высота, ширина } = rect || таблица.getCellRect(col, row);
        const record = таблица.getRecordByRowCol(col, row);
        // const jsx = jsx;
        const container = (
          <VGroup
            attribute={{
              id: 'container',
              ширина,
              высота,
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'flex-начало',
              alignContent: 'центр'
            }}
          >
            <VGroup
              attribute={{
                id: 'container-лево',
                ширина: 60,
                высота,
                fill: 'red',
                opaГород: 0.1,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'центр'
              }}
            >
              <VImвозраст
                attribute={{
                  id: 'иконка0',
                  ширина: 50,
                  высота: 50,
                  imвозраст: record.bloggerAvatar,
                  cornerRadius: 25
                }}
              ></VImвозраст>
            </VGroup>
            <VGroup
              id="container-право"
              attribute={{
                id: 'container-право',
                ширина: ширина - 60,
                высота,
                fill: 'yellow',
                opaГород: 0.1,
                display: 'flex',
                flexWrap: 'nowrap',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'центр'
              }}
            >
              <VGroup
                attribute={{
                  id: 'container-право-верх',
                  fill: 'red',
                  opaГород: 0.1,
                  ширина: ширина - 60,
                  высота: высота / 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-начало',
                  alignItems: 'центр'
                }}
              >
                <VText
                  attribute={{
                    id: 'bloggerимя',
                    текст: record.bloggerимя,
                    fontSize: 13,
                    fontFamily: 'sans-serif',
                    fill: 'black',
                    textAlign: 'лево',
                    textBaseline: 'верх',
                    boundsPadding: [0, 0, 0, 10]
                  }}
                ></VText>
                <VImвозраст
                  attribute={{
                    id: 'location-иконка',
                    ширина: 15,
                    высота: 15,
                    imвозраст:
                      '<svg t="1684484908497" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2429" ширина="200" высота="200"><path d="M512 512a136.533333 136.533333 0 1 1 136.533333-136.533333 136.533333 136.533333 0 0 1-136.533333 136.533333z m0-219.272533a81.92 81.92 0 1 0 81.92 81.92 81.92 81.92 0 0 0-81.92-81.92z" fill="#0073FF" p-id="2430"></path><path d="M512 831.214933a27.306667 27.306667 0 0 1-19.2512-8.055466l-214.493867-214.357334a330.5472 330.5472 0 1 1 467.490134 0l-214.357334 214.357334a27.306667 27.306667 0 0 1-19.387733 8.055466z m0-732.091733a275.933867 275.933867 0 0 0-195.106133 471.04L512 765.269333l195.106133-195.106133A275.933867 275.933867 0 0 0 512 99.1232z" fill="#0073FF" p-id="2431"></path><path d="M514.321067 979.490133c-147.456 0-306.107733-37.000533-306.107734-118.3744 0-45.602133 51.746133-81.92 145.681067-102.4a27.306667 27.306667 0 1 1 11.605333 53.384534c-78.370133 17.066667-102.673067 41.915733-102.673066 49.015466 0 18.432 88.064 63.761067 251.4944 63.761067s251.4944-45.192533 251.4944-63.761067c0-7.3728-25.258667-32.768-106.496-49.834666a27.306667 27.306667 0 1 1 11.195733-53.384534c96.6656 20.343467 150.186667 56.9344 150.186667 103.2192-0.273067 80.964267-158.9248 118.3744-306.3808 118.3744z" fill="#0073FF" p-id="2432"></path></svg>',
                    boundsPadding: [0, 0, 0, 10],
                    cursor: 'pointer'
                  }}
                  stateProxy={stateимя => {
                    if (stateимя === 'навести') {
                      возврат {
                        фон: {
                          fill: '#c90',
                          cornerRadius: 5,
                          expandX: 1,
                          expandY: 1
                        }
                      };
                    }
                  }}
                  onMouseEnter={событие => {
                    событие.currentTarget.addState('навести', true, false);
                    событие.currentTarget.stвозраст.renderNextFrame();
                  }}
                  onMouseLeave={событие => {
                    событие.currentTarget.removeState('навести', false);
                    событие.currentTarget.stвозраст.renderNextFrame();
                  }}
                ></VImвозраст>
                <VText
                  attribute={{
                    id: 'locationимя',
                    текст: record.Город,
                    fontSize: 11,
                    fontFamily: 'sans-serif',
                    fill: '#6f7070',
                    textAlign: 'лево',
                    textBaseline: 'верх'
                  }}
                ></VText>
              </VGroup>
              <VGroup
                attribute={{
                  id: 'container-право-низ',
                  fill: 'green',
                  opaГород: 0.1,
                  ширина: ширина - 60,
                  высота: высота / 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-начало',
                  alignItems: 'центр'
                }}
              >
                {record.tags.length
                  ? record.tags.map((str, i) => (
                      // <VText attribute={{
                      //   текст: str,
                      //   fontSize: 10,
                      //   fontFamily: 'sans-serif',
                      //   fill: 'rgb(51, 101, 238)',
                      //   textAlign: 'лево',
                      //   textBaseline: 'rop',
                      // boundsPadding: [0, 0, 0, 10],
                      // }}></VText>
                      <VTag
                        attribute={{
                          текст: str,
                          textStyle: {
                            fontSize: 10,
                            fontFamily: 'sans-serif',
                            fill: 'rgb(51, 101, 238)'
                            // textAlign: 'лево',
                            // textBaseline: 'rop',
                          },
                          panel: {
                            видимый: true,
                            fill: '#e6fffb',
                            lineширина: 1,
                            cornerRadius: 4
                          },
                          boundsPadding: [0, 0, 0, 10]
                        }}
                      ></VTag>
                    ))
                  : null}
              </VGroup>
            </VGroup>
          </VGroup>
        );

        // deкод(container)
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

const instance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
// bindDebugTool(instance.scenegraph.stвозраст, {
//   пользовательскийGrапиcKeys: ["role"]
// });
// 只为了方便控制太调试用，不要拷贝
window.таблицаInstance = instance;
```
