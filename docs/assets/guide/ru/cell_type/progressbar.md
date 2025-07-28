# Progressbar data bar type

In the scenario of data analytics, we usually need to display various types of data. Among them, progress bar types (such as progressbar) are very useful in some scenarios, such as task progress management, sales achievement, etc. They can visually display progress data and help users quickly understand the completion of the current data. By displaying progress bar types in tables, the effect of data display and user experience can be effectively improved.

The advantages of displaying progress bar type data in a table are as follows:

1.  Visual display of data completion rate: Use the progress bar to directly display the data completion rate, without looking at the value, the user can quickly understand the degree of completion of the data.
2.  Highlight differences in data: By using different colored progress bars, it is easier for users to distinguish differences in data and quickly identify data that needs attention.
3.  Dynamic display of data changes: When the data changes, the length of the progress bar can be dynamically adjusted to facilitate users to keep abreast of data changes.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a222eb3ecfe32db85220dda02.png)

## Introduction of exclusive configuration items for progressbar data strips

The specific configuration items of the progressbar stripe type in the configuration are as follows:

1.  `min`: The progress bar displays the minimum data of the range, the default value is 0.
2.  `max`: The progress bar displays the maximum data of the range, the default value is 100.
3.  `barType`: Progress bar type, the default value is'default '. Optional values include:
    *   'Default ': normal progress bar;
    *   'Negative ': Considering the progress bar with negative value, the progress bar will display the progress bar in both positive and negative directions divided by 0;
    *   negative\_no\_axis ': Similar to'negative', but without a 0-valued axis.
4.  `dependField`: If you need the text displayed in the cell and the data field used by the progress bar are different, in `dependField` The data field used to configure the progress bar in.

Example:

```javascript
{
  cellType: 'progressbar',
  field: 'sales_progress',
  title: '销售进度',
  min: 0,
  max: 100,
  barType: 'default',
  dependField: 'sales_rate'
}
```

## Introduction to style style configuration of progressbar data strips

Progressbar stripe type in style `style` There are many exclusive configuration items such as: barColor, barHeight, barAxisColor, barMarkXXX, etc. Please pass the following examples and[Data Bar API](../../option/ListTable-columns-progressbar)To learn more about the use of each configuration:

Example:

```javascript livedemo template=vtable

const records = [
  {
   "YoY":"50",
  },
  {
   "YoY":10,
  },
   {
   "YoY":-10,
  },
   {
   "YoY":5,
  }
];

const columns = [
 {
       field: 'YoY',
    title: 'count Year-over-Year',
    cellType: 'progressbar',
     width:200,
      fieldFormat(rec){
        debugger;
        if(typeof rec['YoY'] === 'number')
        return rec['YoY']+'%'
      return rec['YoY'];
    },
  },
  {
       field: 'YoY',
    title: 'count Year-over-Year',
    cellType: 'progressbar',
     width:200,
      style: {
        barHeight: '100%',
        // barBgColor: '#aaa',
        // barColor: '#444',
        barBgColor: (data) => {
          return `rgb(${200 + 50 * (1 - data.percentile)},${ 255 * (1 - data.percentile)
            },${255 * (1 - data.percentile)})`;
        },
        barColor: 'transparent',
      },
    },
 {
    field: 'YoY',
    title: 'count Year-over-Year',
    cellType: 'progressbar',
    width:200,
    fieldFormat(){
      return '';
    },
    min:-20,
    max:60,
    style: {
      showBar:true,
      barColor: (data) => {
          return `rgb(${200 + 50 * (1 - data.percentile)},${ 255 * (1 - data.percentile)
            },${255 * (1 - data.percentile)})`;
        },
        barHeight: 20,
        barBottom:'30%',
    },
  },
  {
    field: 'YoY',
    title: 'count Year-over-Year',
    cellType: 'progressbar',
    width:200,
    fieldFormat(){
      return '';
    },
    barType:'negative',
    min:-20,
    max:60,
    style: {
        barHeight: 20,
        barBottom:'30%',
      },
  },
    {
    field: 'YoY',
    title: 'count Year-over-Year',
    cellType: 'progressbar',
    width:200,
    barType:'negative_no_axis',
    min:-20,
    max:60,
    style: {
        textAlign:'right',
        barHeight: 20,
        barBottom:'30%',
        barBgColor:'rgba(217,217,217,0.3)'
    },
  },
  {
    field: 'YoY',
    title: 'count Year-over-Year',
    cellType: 'progressbar',
    width:200,
    barType:'negative_no_axis',
    min:-20,
    max:60,
    style: {
        showBar:false,
        barHeight: 20,
        barBottom:'30%',
        barBgColor:'rgba(217,217,217,0.3)'
    },
  },
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
```

Through the above introduction, you have learned how to use the progressbar data strip type in the VTable table for data display, I hope it will be helpful to you.
