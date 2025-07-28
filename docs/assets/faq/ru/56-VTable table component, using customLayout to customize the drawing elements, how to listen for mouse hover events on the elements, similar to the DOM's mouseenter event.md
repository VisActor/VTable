---
заголовок: Vтаблица таблица компонент, using пользовательскиймакет к пользовательскийize the drawing elements, how к списокen для mouse навести событиеs на the elements, similar к the DOM's mouseenter событие?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

Vтаблица таблица компонент, using пользовательскиймакет к пользовательскийize the drawing elements, how к списокen для mouse навести событиеs на the elements, similar к the DOM's mouseenter событие?</br>
## Question Description

When пользовательскийizing cell content using пользовательскиймакет, including текст и Imвозраст, I would like к have некоторые пользовательский logic when hovering over the Imвозраст. Currently, the mouse-enter событие для the cell cannot distinguish between specific targets.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/EKH7b2sAUoaQoXxMEtwc0aKgn2b.gif' alt='' ширина='336' высота='284'>

для DOM elements в JavaScript, the mouseenter событие is triggered only once when the mouse pointer enters (moves over) the element. So is there an событие like mouseenter_cell к monitor specified content в пользовательский cells?</br>
## Solution

Вы можете bind the mouseenter и mouseleave событиеs к the imвозраст dom из the пользовательский макет 'пользовательскиймакет'.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/V4YfbaHyKo4IG9xgX4bcsTThnjf.gif' alt='' ширина='2542' высота='628'>

код пример</br>
Вы можете paste it into the official editor к test:</br>
https://visactor.io/vтаблица/демонстрация/пользовательский-render/пользовательский-cell-макет-jsx</br>
```
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
                          fill: 'green',
                          cornerRadius: 5,
                          expandX: 1,
                          expandY: 1
                        }
                      };
                    }
                  }}
                  onPointerEnter={событие => {
                    событие.currentTarget.addState('навести', true, false);
                    событие.currentTarget.stвозраст.renderNextFrame();
                  }}
                  onPointerLeave={событие => {
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
// 只为了方便控制太调试用，不要拷贝
window.таблицаInstance = instance;</br>
```
## 相关文档

демонстрация: https://visactor.io/vтаблица/демонстрация/пользовательский-render/пользовательский-cell-макет-jsx</br>
Relevant апи：https://visactor.io/vтаблица/option/списоктаблица-columns-текст#пользовательскиймакет</br>
Tutorial：https://visactor.io/vтаблица/guide/пользовательский_define/пользовательский_макет</br>
github：https://github.com/VisActor/Vтаблица</br>



