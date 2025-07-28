---
category: examples
group: Business
title:  Project schedule
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/project-schedule.png
order: 9-2
---

# Project schedule

In this example, the overall schedule is highlighted by setting the background color, and the entire row of background colors is generated according to the length of the project duration, and the attention to the project with a longer total duration is strengthened through the color level visual effect.

## Key Configurations

\-`theme.bgColor` Set the background color according to the conditions through the function definition

## Code demo

```javascript livedemo template=vtable
function getColor(min, max, n) {
  if (max === min) {
    if (n > 0) {
      return 'rgb(255,0,0)';
    }
    return 'rgb(255,255,255)';
  }
  if (n === '') return 'rgb(255,255,255)';
  const c = (n - min) / (max - min)+0.1;
  const red = (1 - c) * 200+55;
  const green = (1 - c) * 200+55;
  return `rgb(${red},${green},255)`;
}
const records = [
  {
    'projectName': 'Project No.1',
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
    'projectName': 'Project No.2',
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
    'projectName': 'Project No.3',
    "startTime": "2023/5/7",
    "endTime": "2023/5/8",
    "estimateDays": 3,
    "date6":1,
    "date7":1,
    "date8":1,
  },
  {
    'projectName': 'Project No.4',
    "startTime": "2023/5/11",
    "endTime": "2023/5/12",
    "estimateDays": 2,
    "date11":1,
    "date12":1,
  },
  {
    'projectName': 'Project No.5',
    "startTime": "2023/5/0",
    "endTime": "2023/5/10",
    "estimateDays": 2,
    "date9":1,
    "date10":1,
  },
   {
    'projectName': 'Project No.6',
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
    'projectName': 'Project No.7',
    "startTime": "2023/5/16",
    "endTime": "2023/5/19",
    "estimateDays": 4,
    "date16":1,
    "date17":1,
    "date18":1,
    "date19":1,
  },
     {
    'projectName': 'Project No.8',
    "startTime": "2023/5/13",
    "endTime": "2023/5/15",
    "estimateDays": 3,
    "date13":1,
    "date14":1,
    "date15":1,
  },
  {
    'projectName': 'Project No.9',
    "startTime": "2023/5/20",
    "endTime": "2023/5/21",
    "estimateDays": 2,
    "date20":1,
    "date21":1,
  },
  {
    'projectName': 'Project No.10',
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
        "field": "projectName",
        "title": "Project Name",
        "width": "auto",
        "style":{
          color:'#ff689d',
          fontWeight:'bold'
        }
    },
    {
        "field": "startTime",
        "title": "Start Time",
        "width": "auto",
    },
    {
        "field": "endTime",
        "title": "End Time",
        "width": "auto"
    },
    {
        "field": "estimateDays",
        "title": "Duration (days)",
        "width": "auto",
        "style":{
          color:'red'
        }
    },
    {
        "title": "Period:2023/5/1-2023/5/15",
        "headerStyle":{
          textAlign:'center'
        },
        "columns":[
          {
            "title": "Monday",
            "width": "auto",
             "columns":[
              {
                "field": "date1",
                "title": "1",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Tuesday",
            "width": "auto",
             "columns":[
              {
                "field": "date2",
                "title": "2",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Wednesday",
            "width": "auto",
             "columns":[
              {
                "field": "date3",
                "title": "3",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Thursday",
            "width": "auto",
             "columns":[
              {
                "field": "date4",
                "title": "4",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Friday",
            "width": "auto",
             "columns":[
              {
                "field": "date5",
                "title": "5",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Saturday",
            "width": "auto",
             "columns":[
              {
                "field": "date6",
                "title": "6",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Sunday",
            "width": "auto",
             "columns":[
              {
                "field": "date7",
                "title": "7",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
          {
            "title": "Monday",
            "width": "auto",
             "columns":[
              {
                "field": "date8",
                "title": "8",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Tuesday",
            "width": "auto",
             "columns":[
              {
                "field": "date9",
                "title": "9",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Wes day",
            "width": "auto",
             "columns":[
              {
                "field": "date10",
                "title": "10",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Thursday",
            "width": "auto",
             "columns":[
              {
                "field": "date11",
                "title": "11",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Friday",
            "width": "auto",
             "columns":[
              {
                "field": "date12",
                "title": "12",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Saturday",
            "width": "auto",
             "columns":[
              {
                "field": "date13",
                "title": "13",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Sunday",
            "width": "auto",
             "columns":[
              {
                "field": "date14",
                "title": "14",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Monday",
            "width": "auto",
             "columns":[
              {
                "field": "date15",
                "title": "15",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
          {
            "title": "Tuesday",
            "width": "auto",
             "columns":[
              {
                "field": "date16",
                "title": "16",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Wednesday",
            "width": "auto",
             "columns":[
              {
                "field": "date17",
                "title": "17",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Thursday",
            "width": "auto",
             "columns":[
              {
                "field": "date18",
                "title": "18",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Friday",
            "width": "auto",
             "columns":[
              {
                "field": "date19",
                "title": "19",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Saturday",
            "width": "auto",
             "columns":[
              {
                "field": "date20",
                "title": "20",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "title": "Sunday",
            "width": "auto",
             "columns":[
              {
                "field": "date21",
                "title": "21",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
        ]
    }
];

const option = {
  records,
  columns,
  widthMode: 'standard',
  hover:{
    highlightMode: 'cross'
  },
  theme:VTable.themes.ARCO.extends({
    headerStyle:{
      bgColor:'#08aff1',
      color:'#FFF',
      hover:{
        inlineColumnBgColor:'blue'
      }
    },
    bodyStyle:{
       hover:{
        cellBgColor:'',
        inlineColumnBgColor:'',
        inlineRowBgColor(args){
          if(args.col===0)
            return  'blue';
          return ''
        }
      },
      bgColor(args){
        const {table,row,col}=args;
        if(table.getCellOriginValue(col,row)===1)
        return '#ffc200';

        return getColor(2,15,table.getCellOriginValue(3,row))
      }
    }
  })
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

## Related Tutorials

[performance optimization](link)
