---
category: examples
group: Business
title: 2018 QSChina University Mathematics Major Rankings Mathematics
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/ranking.png
order: 9-3
---

# 2018 QSChina University Mathematics Major Rankings Mathematics

In this example, the styles of the header and body are configured by configuring headerStyle and style, respectively. All pivot columns with the same Dimension Category are set to the same background color, and Quantity, Sales and Profit in Metirc are set to different font colors. Data source: https://www.university-list.net/zhongguo/paiming/dx-100034.html

## Key Configurations

\-`headerStyle` Configure the header style of a Dimension

\-`style` Configure the style of a Dimension or Metirc body part

## Code demo

```javascript livedemo template=vtable

const records =[
  {
    "WordRanking": "20",
    "University": "Peking University",
    "Country / Region":"China",
    "Overall Rating":  "85.3",
    "Academic Reputation": "84.1",
    "Employer evaluation": "90",
    "Average Citation Rate of Papers": "84.6",
    "H-index": "83.5",
     "Rank up": 1
}, {
    "WordRanking": "26",
    "University": "Tsinghua University",
    "Country / Region":"China",
    "Overall Rating":  "83.8",
    "Academic Reputation": "80.8",
    "Employer evaluation": "89.3",
    "Average Citation Rate of Papers": "79.6",
    "H-index": "88.3",
     "Rank up": 2
}, {
    "WordRanking": "51-100",
    "University": "Zhejiang University",
    "Country / Region":"China",
    "Overall Rating":  "",
    "Academic Reputation": "63.7",
    "Employer evaluation": "75.4",
    "Average Citation Rate of Papers": "81.2",
    "H-index": "85.4",
     "Rank up": 1
}, {
    "WordRanking": "51-100",
    "University": "Fudan University",
    "Country / Region":"China",
    "Overall Rating":  "",
    "Academic Reputation": "73.3",
    "Employer evaluation": "78.4",
    "Average Citation Rate of Papers": "84.2",
    "H-index": "78.6",
     "Rank up": -1
}, {
    "W o r d R an king": "51-100",
    "University": "Shanghai Jiao Tong University",
    "Country / Region":"China",
    "Overall Rating":  "",
    "Academic Reputation": "68",
    "Employer evaluation": "80.6",
    "Average Citation Rate of Papers": "84.1",
    "H-index": "87.2",
     "Rank up": 3
}, {
    "WordRanking": "101-150",
    "University": "University of Science and Technology of China",
    "Country / Region":"China",
    "Overall Rating":  "",
    "Academic Reputation": "64",
    "Employer evaluation": "67.9",
    "Average Citation Rate of Papers": "80.8",
    "H-index": "79.4",
     "Rank up": 2
}, {
    "WordRanking": "151-200",
    "University": "Sun Yat-sen University",
    "Country / Region":"China",
    "Overall Rating":  "",
    "Academic Reputation": "55.1",
    "Employer evaluation": "69.2",
    "Average Citation Rate of Papers": "82.7",
    "H-index": "74.7",
     "Rank up": -1
}, {
    "WordRanking": "151-200",
    "University": "Nanjing University",
    "Country / Region":"China",
    "Overall Rating":  "",
    "Academic Reputation": "55.4",
    "Employer evaluation": "73.9",
    "Average Citation Rate of Papers": "83.4",
    "H-index": "77.1",
    "Rank up": -1
  }
];

const columns =[
    {
        "field": "WordRanking",
        "title": "WordRanking",
        "width": "auto"
    },
    {
        "field": "University",
        "title": "University",
        "width": "auto"
    },
    {
        "field": "Country / Region",
        "title": "Country / Region",
        "width": "auto"
    },
    {
        "field": "Overall Rating",
        "title": "Overall Rating",
        "width": "auto",
        cellType: 'progressbar',
        style:{
          barColor:'orange',
          barHeight:'90%',
          barBottom:'5%',
        }
    },
    {
        "field": "Academic Reputation",
        "title": "Academic Reputation",
        "width": "auto",
        cellType: 'progressbar',
        style:{
          // barColor:'green',
          barHeight:'90%',
          barBottom:'5%',
        }
    },
    {
        "field": "Average Citation Rate of Papers",
        "title": "Average Citation Rate of Papers",
        "width": "auto",
        cellType: 'progressbar',
        style:{
          barColor:'#2283C6',
          barHeight:'90%',
          barBottom:'5%',
        }
    },
    {
        "field": "H-index",
        "title": "H-index",
        "width": "auto",
        cellType: 'progressbar', 
        style:{
          barColor:'#BCBD22',
          barHeight:'90%',
          barBottom:'5%',
        }
    },
    {
        "field": "Rank up",
        "title": "Rank up【unreal】",
        "width": "auto",
        cellType: 'progressbar',
        barType:'negative',
        max:4,
        min:-2,
        fieldFormat(){
          return '';
        },
        style:{
          barAxisColor:'black',
          barHeight:'90%',
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
  widthMode:'standard'
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
    
```

## Related Tutorials

[performance optimization](link)
