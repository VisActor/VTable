---
категория: примеры
группа: Business
заголовок: 2018 QSChina University Mathematics Major Rankings Mathematics
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/ranking.png
порядок: 9-3
---

# 2018 QSChina University Mathematics Major Rankings Mathematics

в this пример, the styles из the header и body are configured по configuring headerStyle и style, respectively. все сводный columns с the same Dimension Категория are set к the same фон цвет, и Количество, Продажи и Прибыль в Metirc are set к different шрифт colors. данные source: https://www.university-список.net/zhongguo/paiming/dx-100034.html

## Ключевые Конфигурации

\-`headerStyle` Configure the header style из a Dimension

\-`style` Configure the style из a Dimension или Metirc body part

## код демонстрация

```javascript liveдемонстрация template=vтаблица

const records =[
  {
    "WordRanking": "20",
    "University": "Peking University",
    "Country / Регион":"China",
    "Overall Rating":  "85.3",
    "Academic Reputation": "84.1",
    "Employer evaluation": "90",
    "Averвозраст Citation Rate из Papers": "84.6",
    "H-index": "83.5",
     "Rank up": 1
}, {
    "WordRanking": "26",
    "University": "Tsinghua University",
    "Country / Регион":"China",
    "Overall Rating":  "83.8",
    "Academic Reputation": "80.8",
    "Employer evaluation": "89.3",
    "Averвозраст Citation Rate из Papers": "79.6",
    "H-index": "88.3",
     "Rank up": 2
}, {
    "WordRanking": "51-100",
    "University": "Zhejiang University",
    "Country / Регион":"China",
    "Overall Rating":  "",
    "Academic Reputation": "63.7",
    "Employer evaluation": "75.4",
    "Averвозраст Citation Rate из Papers": "81.2",
    "H-index": "85.4",
     "Rank up": 1
}, {
    "WordRanking": "51-100",
    "University": "Fudan University",
    "Country / Регион":"China",
    "Overall Rating":  "",
    "Academic Reputation": "73.3",
    "Employer evaluation": "78.4",
    "Averвозраст Citation Rate из Papers": "84.2",
    "H-index": "78.6",
     "Rank up": -1
}, {
    "W o r d R an king": "51-100",
    "University": "Shanghai Jiao Tong University",
    "Country / Регион":"China",
    "Overall Rating":  "",
    "Academic Reputation": "68",
    "Employer evaluation": "80.6",
    "Averвозраст Citation Rate из Papers": "84.1",
    "H-index": "87.2",
     "Rank up": 3
}, {
    "WordRanking": "101-150",
    "University": "University из Science и Technology из China",
    "Country / Регион":"China",
    "Overall Rating":  "",
    "Academic Reputation": "64",
    "Employer evaluation": "67.9",
    "Averвозраст Citation Rate из Papers": "80.8",
    "H-index": "79.4",
     "Rank up": 2
}, {
    "WordRanking": "151-200",
    "University": "Sun Yat-sen University",
    "Country / Регион":"China",
    "Overall Rating":  "",
    "Academic Reputation": "55.1",
    "Employer evaluation": "69.2",
    "Averвозраст Citation Rate из Papers": "82.7",
    "H-index": "74.7",
     "Rank up": -1
}, {
    "WordRanking": "151-200",
    "University": "Nanjing University",
    "Country / Регион":"China",
    "Overall Rating":  "",
    "Academic Reputation": "55.4",
    "Employer evaluation": "73.9",
    "Averвозраст Citation Rate из Papers": "83.4",
    "H-index": "77.1",
    "Rank up": -1
  }
];

const columns =[
    {
        "поле": "WordRanking",
        "title": "WordRanking",
        "ширина": "авто"
    },
    {
        "поле": "University",
        "title": "University",
        "ширина": "авто"
    },
    {
        "поле": "Country / Регион",
        "title": "Country / Регион",
        "ширина": "авто"
    },
    {
        "поле": "Overall Rating",
        "title": "Overall Rating",
        "ширина": "авто",
        cellType: 'progressbar',
        style:{
          barColor:'orange',
          barвысота:'90%',
          barBottom:'5%',
        }
    },
    {
        "поле": "Academic Reputation",
        "title": "Academic Reputation",
        "ширина": "авто",
        cellType: 'progressbar',
        style:{
          // barColor:'green',
          barвысота:'90%',
          barBottom:'5%',
        }
    },
    {
        "поле": "Averвозраст Citation Rate из Papers",
        "title": "Averвозраст Citation Rate из Papers",
        "ширина": "авто",
        cellType: 'progressbar',
        style:{
          barColor:'#2283C6',
          barвысота:'90%',
          barBottom:'5%',
        }
    },
    {
        "поле": "H-index",
        "title": "H-index",
        "ширина": "авто",
        cellType: 'progressbar', 
        style:{
          barColor:'#BCBD22',
          barвысота:'90%',
          barBottom:'5%',
        }
    },
    {
        "поле": "Rank up",
        "title": "Rank up【unreal】",
        "ширина": "авто",
        cellType: 'progressbar',
        barType:'negative',
        max:4,
        min:-2,
        полеFormat(){
          возврат '';
        },
        style:{
          barAxisColor:'black',
          barвысота:'90%',
          barBottom:'5%',

          showBarMark:true,

          barPositiveColor:'rgba(255,0,0,0.5)',
          barNegativeColor:'rgba(0,255,0,0.5)',

          barMarkPositiveColor:'red',
          barMarkNegativeColor:'green',
        }
    },
];

const option = {
  records,
  columns,
  ширинаMode:'standard'
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
    
```

## Related Tutorials

[Производительность optimization](link)
