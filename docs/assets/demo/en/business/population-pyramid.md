---
category: examples
group: Business
title: China’s population pyramid in 2023
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/population-pyramid.png
---

# China’s population pyramid in 2023

China's population distribution map.

Data source: https://population-pyramid.net/zh-cn

## Key Configurations

- `title` defines the title
- `theme` defines the table style
- `cellType: 'progressbar'` specifies the progress chart

## Code Demo

```javascript livedemo template=vtable
const records = [
  [0, 5634674, 5063545],
  [1, 5705095, 5104886],
  [2, 6428332, 5727205],
  [3, 7693489, 6821534],
  [4, 8161021, 7203100],
  [5, 9715173, 8532301],
  [6, 9650591, 8437180],
  [7, 9219192, 8023112],
  [8, 9895275, 8576677],
  [9, 9661108, 8338776],
  [10, 10181676, 8760074],
  [11, 9435376, 8092996],
  [12, 9489747, 8122793],
  [13, 9556154, 8163689],
  [14, 9381839, 8005802],
  [15, 9099192, 7758048],
  [16, 8890454, 7576040],
  [17, 8720216, 7432716],
  [18, 8594120, 7328355],
  [19, 8416000, 7183082],
  [20, 8430209, 7205565],
  [21, 8466902, 7251819],
  [22, 8894890, 7638348],
  [23, 8486376, 7308669],
  [24, 8587529, 7420310],
  [25, 8796105, 7629613],
  [26, 9049822, 7885903],
  [27, 9367029, 8203736],
  [28, 9588509, 8447239],
  [29, 9880743, 8760562],
  [30, 10273285, 9171734],
  [31, 11010587, 9897533],
  [32, 13601860, 12314052],
  [33, 13043658, 11883209],
  [34, 12594941, 11546787],
  [35, 13131786, 12117412],
  [36, 12360084, 11473978],
  [37, 11386597, 10628424],
  [38, 10761644, 10094575],
  [39, 10163338, 9571765],
  [40, 11422792, 10797854],
  [41, 10508636, 9964478],
  [42, 10017988, 9526554],
  [43, 9619763, 9173632],
  [44, 9056756, 8659112],
  [45, 8997215, 8626101],
  [46, 9652077, 9281127],
  [47, 10015409, 9662890],
  [48, 11069594, 10715950],
  [49, 11768373, 11433423],
  [50, 12018464, 11708473],
  [51, 12355492, 12091272],
  [52, 12906951, 12693324],
  [53, 12432644, 12298286],
  [54, 12529023, 12460625],
  [55, 10718431, 10707166],
  [56, 11251041, 11290592],
  [57, 11415079, 11504019],
  [58, 11196086, 11338591],
  [59, 12228142, 12453712],
  [60, 9600080, 9836193],
  [61, 5711938, 5898205],
  [62, 5933189, 6167949],
  [63, 5948957, 6221196],
  [64, 7167743, 7565716],
  [65, 8064981, 8622421],
  [66, 7202344, 7810706],
  [67, 7411934, 8156809],
  [68, 7100337, 7937336],
  [69, 6511011, 7403640],
  [70, 6628801, 7655587],
  [71, 5539974, 6496927],
  [72, 5340662, 6361109],
  [73, 4486039, 5334561],
  [74, 4095771, 4855813],
  [75, 3672686, 4282433],
  [76, 3284023, 3938476],
  [77, 2840609, 3499661],
  [78, 2557354, 3174779],
  [79, 2259373, 2870194],
  [80, 2076623, 2715500],
  [81, 1907136, 2559103],
  [82, 1682448, 2318997],
  [83, 1409855, 2009200],
  [84, 1286674, 1875365],
  [85, 1103399, 1686589],
  [86, 933191, 1521358],
  [87, 769638, 1350282],
  [88, 626185, 1151337],
  [89, 503993, 973886],
  [90, 370193, 768844],
  [91, 268569, 598536],
  [92, 202514, 492130],
  [93, 136717, 366776],
  [94, 93980, 278374],
  [95, 58550, 192884],
  [96, 34165, 129966],
  [97, 20236, 92475],
  [98, 10692, 60687],
  [99, 4848, 35695],
  [100, 3722, 45558],
  [101, 0, 0],
  [102, 0, 0]
  // ['', 727445708, 698403578]//人口总数
];
const columns = [
  {
    field: '0',
    title: 'Age',
    width: 'auto',
    mergeCell: true,
    fieldFormat(args) {
      if (args[0] >= 100) {
        return 100;
      }
      return Math.round(args[0] / 5) * 5;
    },
    style: {
      color: 'green',
      fontWeight: 'bold'
    }
  },
  {
    field: '1',
    title: 'Male (Population)',
    width: 'auto',
    fieldFormat(args) {
      return '';
    },
    cellType: 'progressbar',
    min: 0,
    max: 13601860 + 1000000,
    style: {
      color: 'red',
      barHeight: 5,
      barColor: '#4cba72',
      barRightToLeft: true
    }
  },
  {
    field: '2',
    title: 'Female (Population)',
    width: 'auto',
    cellType: 'progressbar',
    fieldFormat(args) {
      return '';
    },
    min: 0,
    max: 13601860 + 1000000, //12693324,
    style: {
      color: 'red',
      barHeight: 5,
      showBarMark: true
    }
  },
  {
    field: '0',
    title: 'Age',
    width: 'auto',
    style: {
      color: '#ff689d',
      fontWeight: 'bold'
    },
    mergeCell: true,
    fieldFormat(args) {
      if (args[0] === '100+') {
        return 100;
      }
      return Math.round(args[0] / 5) * 5;
    }
  }
];

const option = {
  records,
  columns,
  widthMode: 'standard',

  sortState: {
    field: '0',
    order: 'desc'
  },
  hover: {
    highlightMode: 'cell',
    disableHover: true
  },
  defaultRowHeight: 6,
  defaultHeaderRowHeight: 30,
  title: {
    text: 'China Population 2023 Pyramid: 1,425,849,286',
    padding: 10,
    orient: 'top',
    textStyle: { fill: '#16cdcd' }
  },
  theme: VTable.themes.DEFAULT.extends({
    headerStyle: {
      color: '#dfeef7',
      bgColor: '#038dc8'
    },
    bodyStyle: {
      bgColor(args) {
        const { row, table } = args;
        const value = parseInt(table.getCellValue(0, row) ?? '0', 10);
        if (value % 10 === 0) {
          return '#FAF9FB';
        }
        return '#FDFDFD';
      }
    },
    frameStyle: {
      borderColor: '#1d80b0',
      borderLineWidth: 2
    }
  })
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```
