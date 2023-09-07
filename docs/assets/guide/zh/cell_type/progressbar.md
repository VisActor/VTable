# progressbar数据条类型

在数据分析的场景中，我们通常需要展示各种类型的数据，其中，进度条类型（如 progressbar）在某些场景中非常有用，例如，任务进度管理、销售额达成情况等。它们可以直观地展示进度数据，帮助用户快速了解当前数据的完成程度。通过在表格中展示进度条类型，可以有效提高数据展示的效果和用户体验。

在表格中展示进度条类型数据的优点如下：

1. 直观展示数据完成率：使用进度条直接展示数据完成率，无需查看数值，用户可以快速地了解数据的完成程度。
2. 更突出数据的差异：通过使用不同颜色的进度条，可以让用户更容易地区分数据的差异，快速识别出需关注的数据。
3. 动态展示数据变化：当数据发生变化时，可以动态调整进度条长度，方便用户及时了解数据的变化情况。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a222eb3ecfe32db85220dda02.png)

## progressbar数据条的专属配置项介绍

progressbar 数据条类型在配置中的特有配置项如下：

1. `min`：进度条展示范围的最小数据，默认值为 0。
2. `max`：进度条展示范围的最大数据，默认值为 100。
3. `barType`：进度条类型，默认值为 'default'。可选值包括：
    - 'default'：普通进度条；
    - 'negative'：考虑负值的进度条，进度条会以 0 为分割显示正负两个方向的进度条；
    - 'negative_no_axis'：与 'negative' 类似，但无 0 值坐标轴。
4. `dependField`：如果需要单元格展示的文字和进度条使用的数据字段不同，在 `dependField` 中配置进度条使用的数据字段。

示例：
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

## progressbar数据条的style样式配置介绍

progressbar 数据条类型在样式 `style` 方面有很多专属配置项如：barColor，barHeight，barAxisColor，barMarkXXX等，请通过下面的示例及[数据条api](../../option/ListTable-columns-progressbar)来详细了解各项配置的使用：

示例：
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
  records,
  columns,
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

通过以上介绍，您已学会了如何在 VTable 表格中使用 progressbar 数据条类型进行数据展示，希望对您有所帮助。