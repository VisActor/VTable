---
заголовок: 19. How can I increase the gap between adjacent sparklines в the Vтаблица компонент?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

How can I increase the gap between adjacent sparklines в the Vтаблица компонент?</br>
## Question Description

The mini graph в the product uses Vтаблица, but the effect из generating the mini graph с данные is that the users feel the distance between adjacent line segments is too закрыть. How к adjust this spacing?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WCfcbEOuIхорошоc3JxEbmVcsbAsnIe.gif' alt='' ширина='1475' высота='628'>

## Solution

первый, it is necessary к clarify that the ширина и высота из a cell include two parts: the заполнение отступ и the content. The заполнение отступ в the Vтаблица is set к [10, 16, 10, 16] по по умолчанию, и the row высота из the Vтаблица is 40px по по умолчанию, с the верх и низ заполнение margins taking up 20px. Therefore, the высота из the content is reduced к 20px.</br>
The верх и низ заполнение margins take up 20px, so the minimum distance between two adjacent  sparklines графикs is also 20px. в other words, the minimum distance between two adjacent  sparklines графикs is determined по the заполнение отступ. в the official пример, заполнение отступ is adjusted к 20, и it is found that the line curve becomes a straight line after the adjustment. This is because the 40px row высота is occupied по the заполнение отступ, leaving no space для the line график к stretch.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/AxaLbDVvMoViADxrhPxciAOLnDc.gif' alt='' ширина='945' высота='266'>

So в this case, we need к increase the row высота accordingly. The effect из setting defaultRowвысота к 60 is as follows:</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/NzN8bMoTJoPtQWxRkYzcjSbqnde.gif' alt='' ширина='916' высота='311'>



## код пример

```
const records = [
  {
   'lineданные':[50,20,20,40,60,50,70],
   'lineданные2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineданные':[50,20,60,40,60,50,70],
   'lineданные2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineданные':[50,50,20,40,10,50,70],
   'lineданные2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineданные':[70,20,20,40,60,50,70],
   'lineданные2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  }
];

const columns = [
  {
    поле: 'lineданные',
    заголовок: 'sparkline',
    cellType: 'sparkline',
    ширина:300,
    style:{
      заполнение:20
    },
    sparklineSpec: {
        тип: 'line',
        pointShowRule: 'никто',
        smooth: true,
        line: {
          style: {
            strхорошоe: '#2E62F1',
            strхорошоeширина: 2,
          },
        },
        point: {
          навести: {
              strхорошоe: 'blue',
              strхорошоeширина: 1,
              fill: 'red',
              shape: 'circle',
              размер: 4,
          },
          style: {
            strхорошоe: 'red',
            strхорошоeширина: 1,
            fill: 'yellow',
            shape: 'circle',
            размер: 2,
          },
        },
        crosshair: {
          style: {
            strхорошоe: 'gray',
            strхорошоeширина: 1,
          },
        },
      },
  },
  {
    поле: 'lineданные2',
    заголовок: 'sparkline 2',
    cellType: 'sparkline',
    ширина:300,
    style:{
      заполнение:20
    },
    sparklineSpec: {
        тип: 'line', 
        xполе: 'x',
        yполе: 'y',
        pointShowRule: 'все',
        smooth: true,
        line: {
          style: {
            strхорошоe: '#2E62F1',
            strхорошоeширина: 2,
          },
        },
      },
  },
];
const option = {
  records,
  columns,
  defaultRowвысота:60
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
</br>
```
## Result Display 

Just paste the код от the пример directly into the official editor и it will be displayed.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HkPgbc4aLoaqczxnug8ccxZwnOQ.gif' alt='' ширина='916' высота='311'>

## Relevant Documents 

Sparkline Usвозраст Reference демонстрация：https://visactor.io/vтаблица/guide/cell_type/sparkline</br>
Style Usвозраст Toturial：https://visactor.io/vтаблица/guide/тема_and_style/style</br>
Related апи：https://visactor.io/vтаблица/option/списоктаблица-columns-sparkline#style.заполнение</br>
github：https://github.com/VisActor/Vтаблица</br>

