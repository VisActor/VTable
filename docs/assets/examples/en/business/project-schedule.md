---
category: examples
group: Business
title:  Project schedule
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/project-schedule.png
order: 9-2
---

# Project schedule

In this example, the overall schedule is highlighted by setting the background color, and the entire row of background colors is generated according to the length of the project duration, and the attention to the project with a longer total duration is strengthened through the color level visual effect.

## critical configuration

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
        "caption": "Project Name",
        "width": "auto",
        "style":{
          color:'#ff689d',
          fontWeight:'bold'
        }
    },
    {
        "field": "startTime",
        "caption": "Start Time",
        "width": "auto",
    },
    {
        "field": "endTime",
        "caption": "End Time",
        "width": "auto"
    },
    {
        "field": "estimateDays",
        "caption": "Duration (days)",
        "width": "auto",
        "style":{
          color:'red'
        }
    },
    {
        "caption": "Period:2023/5/1-2023/5/15",
        "headerStyle":{
          textAlign:'center'
        },
        "columns":[
          {
            "caption": "Monday",
            "width": "auto",
             "columns":[
              {
                "field": "date1",
                "caption": "1",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Tuesday",
            "width": "auto",
             "columns":[
              {
                "field": "date2",
                "caption": "2",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Wednesday",
            "width": "auto",
             "columns":[
              {
                "field": "date3",
                "caption": "3",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Thursday",
            "width": "auto",
             "columns":[
              {
                "field": "date4",
                "caption": "4",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Friday",
            "width": "auto",
             "columns":[
              {
                "field": "date5",
                "caption": "5",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Saturday",
            "width": "auto",
             "columns":[
              {
                "field": "date6",
                "caption": "6",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Sunday",
            "width": "auto",
             "columns":[
              {
                "field": "date7",
                "caption": "7",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
          {
            "caption": "Monday",
            "width": "auto",
             "columns":[
              {
                "field": "date8",
                "caption": "8",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Tuesday",
            "width": "auto",
             "columns":[
              {
                "field": "date9",
                "caption": "9",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Wes day",
            "width": "auto",
             "columns":[
              {
                "field": "date10",
                "caption": "10",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Thursday",
            "width": "auto",
             "columns":[
              {
                "field": "date11",
                "caption": "11",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Friday",
            "width": "auto",
             "columns":[
              {
                "field": "date12",
                "caption": "12",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Saturday",
            "width": "auto",
             "columns":[
              {
                "field": "date13",
                "caption": "13",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Sunday",
            "width": "auto",
             "columns":[
              {
                "field": "date14",
                "caption": "14",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Monday",
            "width": "auto",
             "columns":[
              {
                "field": "date15",
                "caption": "15",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
          {
            "caption": "Tuesday",
            "width": "auto",
             "columns":[
              {
                "field": "date16",
                "caption": "16",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Wednesday",
            "width": "auto",
             "columns":[
              {
                "field": "date17",
                "caption": "17",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Thursday",
            "width": "auto",
             "columns":[
              {
                "field": "date18",
                "caption": "18",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Friday",
            "width": "auto",
             "columns":[
              {
                "field": "date19",
                "caption": "19",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Saturday",
            "width": "auto",
             "columns":[
              {
                "field": "date20",
                "caption": "20",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "Sunday",
            "width": "auto",
             "columns":[
              {
                "field": "date21",
                "caption": "21",
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
