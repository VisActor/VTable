---
категория: примеры
группа: Business
заголовок:  Project schedule
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/project-schedule.png
порядок: 9-2
---

# Project schedule

в this пример, the overall schedule is highlighted по setting the фон цвет, и the entire row из фон colors is generated according к the length из the project duration, и the attention к the project с a longer total duration is strengthened through the цвет level visual effect.

## Ключевые Конфигурации

\-`тема.bgColor` Set the фон цвет according к the conditions through the функция definition

## код демонстрация

```javascript liveдемонстрация template=vтаблица
функция getColor(min, max, n) {
  if (max === min) {
    if (n > 0) {
      возврат 'rgb(255,0,0)';
    }
    возврат 'rgb(255,255,255)';
  }
  if (n === '') возврат 'rgb(255,255,255)';
  const c = (n - min) / (max - min)+0.1;
  const red = (1 - c) * 200+55;
  const green = (1 - c) * 200+55;
  возврат `rgb(${red},${green},255)`;
}
const records = [
  {
    'projectимя': 'Project No.1',
    "startTime": "2023/5/1",
    "endTime": "2023/5/10",
    "estimateDays": 10,
    "date1":1,
    "date2":1,
    "date3":1,
    "date4":1,
    "date5":1,
    "date6":1,
    "date7":1,
    "date8":1,
    "date9":1,
    "date10":1
  },
  {
    'projectимя': 'Project No.2',
    "startTime": "2023/5/1",
    "endTime": "2023/5/5",
    "estimateDays": 5,
    "date1":1,
    "date2":1,
    "date3":1,
    "date4":1,
    "date5":1,
  },
  {
    'projectимя': 'Project No.3',
    "startTime": "2023/5/7",
    "endTime": "2023/5/8",
    "estimateDays": 3,
    "date6":1,
    "date7":1,
    "date8":1,
  },
  {
    'projectимя': 'Project No.4',
    "startTime": "2023/5/11",
    "endTime": "2023/5/12",
    "estimateDays": 2,
    "date11":1,
    "date12":1,
  },
  {
    'projectимя': 'Project No.5',
    "startTime": "2023/5/0",
    "endTime": "2023/5/10",
    "estimateDays": 2,
    "date9":1,
    "date10":1,
  },
   {
    'projectимя': 'Project No.6',
    "startTime": "2023/5/11",
    "endTime": "2023/5/15",
    "estimateDays": 5,
    "date11":1,
    "date12":1,
    "date13":1,
    "date14":1,
    "date15":1,
  },
  {
    'projectимя': 'Project No.7',
    "startTime": "2023/5/16",
    "endTime": "2023/5/19",
    "estimateDays": 4,
    "date16":1,
    "date17":1,
    "date18":1,
    "date19":1,
  },
     {
    'projectимя': 'Project No.8',
    "startTime": "2023/5/13",
    "endTime": "2023/5/15",
    "estimateDays": 3,
    "date13":1,
    "date14":1,
    "date15":1,
  },
  {
    'projectимя': 'Project No.9',
    "startTime": "2023/5/20",
    "endTime": "2023/5/21",
    "estimateDays": 2,
    "date20":1,
    "date21":1,
  },
  {
    'projectимя': 'Project No.10',
    "startTime": "2023/5/16",
    "endTime": "2023/5/21",
    "estimateDays": 6,
    "date16":1,
    "date17":1,
    "date18":1,
    "date19":1,
    "date20":1,
    "date21":1,
  }
];
const columns =[
    {
        "поле": "projectимя",
        "title": "Project имя",
        "ширина": "авто",
        "style":{
          цвет:'#ff689d',
          fontWeight:'bold'
        }
    },
    {
        "поле": "startTime",
        "title": "начало Time",
        "ширина": "авто",
    },
    {
        "поле": "endTime",
        "title": "конец Time",
        "ширина": "авто"
    },
    {
        "поле": "estimateDays",
        "title": "Duration (days)",
        "ширина": "авто",
        "style":{
          цвет:'red'
        }
    },
    {
        "title": "Period:2023/5/1-2023/5/15",
        "headerStyle":{
          textAlign:'центр'
        },
        "columns":[
          {
            "title": "Monday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date1",
                "title": "1",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Tuesday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date2",
                "title": "2",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Wednesday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date3",
                "title": "3",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Thursday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date4",
                "title": "4",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Friday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date5",
                "title": "5",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Saturday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date6",
                "title": "6",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Sunday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date7",
                "title": "7",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
          {
            "title": "Monday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date8",
                "title": "8",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Tuesday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date9",
                "title": "9",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Wes day",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date10",
                "title": "10",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Thursday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date11",
                "title": "11",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Friday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date12",
                "title": "12",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Saturday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date13",
                "title": "13",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Sunday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date14",
                "title": "14",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Monday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date15",
                "title": "15",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
          {
            "title": "Tuesday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date16",
                "title": "16",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Wednesday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date17",
                "title": "17",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Thursday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date18",
                "title": "18",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Friday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date19",
                "title": "19",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Saturday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date20",
                "title": "20",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
           {
            "title": "Sunday",
            "ширина": "авто",
             "columns":[
              {
                "поле": "date21",
                "title": "21",
                "ширина": "авто",
                "полеFormat":()=>{возврат ''}
              },
             ]
          },
        ]
    }
];

const option = {
  records,
  columns,
  ширинаMode: 'standard',
  навести:{
    highlightMode: 'cross'
  },
  тема:Vтаблица.темаs.ARCO.extends({
    headerStyle:{
      bgColor:'#08aff1',
      цвет:'#FFF',
      навести:{
        inlineColumnBgColor:'blue'
      }
    },
    bodyStyle:{
       навести:{
        cellBgColor:'',
        inlineColumnBgColor:'',
        inlineRowBgColor(args){
          if(args.col===0)
            возврат  'blue';
          возврат ''
        }
      },
      bgColor(args){
        const {таблица,row,col}=args;
        if(таблица.getCellOriginValue(col,row)===1)
        возврат '#ffc200';

        возврат getColor(2,15,таблица.getCellOriginValue(3,row))
      }
    }
  })
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```

## Related Tutorials

[Производительность optimization](link)
