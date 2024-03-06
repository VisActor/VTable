# Theme Theme

In this article, we will learn how to customize and beautify the presentation of data tables with the theme Theme in VTable.

Theme controls the appearance of the table, makes the table more aesthetic, and has some help for data analytics. It should be noted that: Theme theme is to set the style of the table from the whole, and can also be used through[style](../../guide/theme_and_style/style)To style each column separately.

Theme supports setting the static styles of modules such as table header, body and outer border. The settings include: font, font size, color, background color, cell dividing line thickness and color; it also supports dynamic style configuration of each interaction effect module of cells. For example: mouse suspension or style configuration of each cell when selected. For details, please check the configuration items.

## Theme style corresponding structure

Refer to the figure below to learn commonly used configuration items
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c60d.jpeg)

## Header Theme

The header is an important part of the table display, and its style directly affects the visual effect of the entire table. The configuration item is`theme.headerStyle`We can adjust the background color, border, text style, etc. of the header cells by modifying the configuration items. E.g:

- Specify the background color of the header cell: you can pass`theme.headerStyle.bgColor`To set the background color of the header cell, support string (directly specify the color value), function (return the color value according to the condition), and CanvasGradient and CanvasPattern objects.

- Define the padding of header cells: you can pass`theme.headerStyle.padding`To set the margins of header cells, support values (uniformly set the margins in four directions) and arrays (set the margins in the upper, right, lower and left directions respectively).

- Adjust the horizontal alignment of text in header cells: you can pass`theme.headerStyle.textAlign`To set the horizontal alignment of text, support`left`,`right`and`center`.

If it is a pivot table, when you need to configure different Themes for different headers, you can pass`theme.rowHeaderStyle`,`theme.cornerHeaderStyle`To configure separately.

## Body Theme

Body Theme is mainly responsible for the style configuration of data cells, through`theme.bodyStyle`To specify.

By modifying the configuration items of the body Theme, you can realize personalized data cell styles. Similar to the header Theme, you can also customize properties such as background color, padding, and text style.

## Other Modules Theme Styles

In addition to the table header and body Theme, VTable also provides a series of Theme configuration items for other subdivision modules, such as:

- Frame Style: Pass`theme.frameStyle`To set the overall border color, width, line style, shadow effect and other properties of the table.

- Column Width Adjustment Style: Pass`theme.columnResize`To set the color, width, etc. of the column width drag bar.

- Scroll Bar Style: Pass`theme.scrollStyle`To set the color of the scroll bar track, the color and width of the slider, etc.

- Drag and drop position marker line style: pass`theme.dragHeaderSplitLine`To set the style of the transposition dividing line of the drag and drop table.

By personalizing these modules, richer and more diverse table styles can be achieved.

## interactive effect

Set the background effect when the mouse is hovered to a cell by setting the hover background color.
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20c.png)

Set the highlighted border and background color when the cell is selected by setting selectionStyle.
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270906.png)
Set Column Width Adjust Marker Line Style
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c60e.png)
Drag and drop the header transposition marker line style
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270907.png)

## Built-in Theme

VTable built-in a set of default Theme /DEFAULT, a set of ARCO style, a set of dark Theme /DARK, a set of distinct Theme /BRIGHT, a set of minimalist Theme /SIMPLIFY

**Default Theme Sample Code**

The specific configuration content can be viewed at: https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/themes/DEFAULT.ts

    // 使用默认主题
    option.theme = VTable.themes.DEFAULT;

    const tableInstance = new VTable.ListTable(option);

**ARCO Theme Sample Code**

The specific configuration content can be viewed at: https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/themes/ARCO.ts

    // 使用默认主题
    option.theme = vTable.themes.ARCO;

    const tableInstance = new VTable.ListTable(option);

**Dark Theme Sample Code**

The specific configuration content can be viewed at: https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/themes/DARK.ts

    // 使用默认主题
    option.theme = vTable.themes.DARK;

    const tableInstance = new VTable.ListTable(option);

**Vivid Theme Sample Code**

The specific configuration content can be viewed at: https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/themes/BRIGHT.ts

    // 使用默认主题
    option.theme = vTable.themes.BRIGHT;

    const tableInstance = new VTable.ListTable(option);

**Minimalist Theme Sample Code**

The specific configuration content can be viewed at: https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/themes/SIMPLIFY.ts

    // 使用默认主题
    option.theme = vTable.themes.SIMPLIFY;

    const tableInstance = new VTable.ListTable(option);

## Custom Theme

If you can't meet the needs, you can expand it on the basis of a certain Theme, or completely customize it.,

**Extend customization**

Such as extending for DEFAULT

```

option.theme = vTable.themes.DEFAULT.extends({ headerStyle:{ color: 'red'}})

const tableInstance = new vTable.ListTable(option);
```

**Full Custom Theme**

```javascript livedemo template=vtable
//定义theme 类型为IListTableThemeDefine
const theme = {
  //默认样式，如bodyStyle或者headerStyle未设置某项配置则从这里获取相应样式
  defaultStyle: {
    color: '#1B1F23',
    bgColor: '#EEF1F5',
    font: '500 12px PingFang SC',
    lineHeight: 16,
    borderColor: '#e1e4e8',
    padding: [8, 12, 8, 12]
  },
  headerStyle: {
    color: '#1B1F23',
    bgColor: '#EEF1F5',
    font: '500 12px PingFang SC',
    lineHeight: 16,
    borderColor: '#e1e4e8',
    padding: [8, 12, 8, 12],
    hover: {
      //hover状态单元格样式
      cellBgColor: '#c8daf6'
    },
    click: {
      //click状态单元格样式
      cellBgColor: '#c8daf6',
      cellBorderColor: ['#e1e4e8', '#e1e4e8', '#3073f2', '#e1e4e8'],
      cellBorderLineWidth: [0, 1, 3, 1]
    }
  },
  rowHeaderStyle: {},
  cornerHeaderStyle: {},
  bodyStyle: {
    padding: [8, 12, 8, 12],
    color: '#141414',
    textAlign: 'right',
    font: '400 12px PingFang SC',
    bgColor(args) {
      // 支持自定义函数设置，如这里设置第一列指定颜色为yellow 其他为skyblue
      const { col } = args;
      if (col === 4) {
        return 'yellow';
      } else {
        return 'skyblue';
      }
    },
    borderColor: '#e1e4e8',
    lineHeight: 18,
    hover: {
      cellBgColor: '#d6e6fe',
      inlineRowBgColor: '#F3F8FF',
      inlineColumnBgColor: '#F3F8FF'
    },
    click: {
      cellBgColor: '#d6e6fe',
      cellBorderLineWidth: 2,
      inlineColumnBgColor: '#CCE0FF',
      cellBorderColor: '#3073f2'
    }
  },
  //表格外边框样式
  frameStyle: {
    borderColor: '#d1d5da',
    borderLineWidth: 1,
    borderLineDash: [],
    roundCornerRadius: 10,
    shadowBlur: 6,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(00, 24, 47, 0.06)'
  },
  //拖拽列宽分割线样式
  columnResizer: {
    lineWidth: 1,
    lineColor: '#416EFF',
    bgColor: '#D9E2FF',
    width: 3
  },
  //冻结列分割线样式
  frozenColumnLine: {
    shadow: {
      width: 4,
      startColor: 'rgba(00, 24, 47, 0.05)',
      endColor: 'rgba(00, 24, 47, 0)'
    }
  },
  //菜单样式
  menuStyle: {
    color: '#000',
    highlightColor: '#2E68CF',
    font: '12px sans-serif',
    highlightFont: '12px sans-serif',
    hoverBgColor: '#EEE'
  }
};

const data = [
  {
    10002: '36004.12287902832',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '36004.12287902832',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1646.5089945793152',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1646.5089945793152',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Bookcases'
  },
  {
    10002: '10899.361869812012',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '10899.361869812012',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Bookcases'
  },
  {
    10002: '1339.4909970760345',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '1339.4909970760345',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Bookcases'
  },
  {
    10002: '24157.178108215332',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '24157.178108215332',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1997.9050402641296',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1997.9050402641296',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Bookcases'
  },
  {
    10002: '43819.33399963379',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '43819.33399963379',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1167.6339691877365',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1167.6339691877365',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Bookcases'
  },
  {
    10002: '101781.32774353027',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '101781.32774353027',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Chairs'
  },
  {
    10002: '4027.58094894886',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '4027.58094894886',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Chairs'
  },
  {
    10002: '45176.44617843628',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '45176.44617843628',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Chairs'
  },
  {
    10002: '6612.087041854858',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '6612.087041854858',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Chairs'
  },
  {
    10002: '85230.64583206177',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '85230.64583206177',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Chairs'
  },
  {
    10002: '6592.718985438347',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '6592.718985438347',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Chairs'
  },
  {
    10002: '96260.68257522583',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '96260.68257522583',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Chairs'
  },
  {
    10002: '9357.765951037407',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '9357.765951037407',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Chairs'
  },
  {
    10002: '30072.729959964752',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '30072.729959964752',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Furnishings'
  },
  {
    10002: '7641.274031370878',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '7641.274031370878',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Furnishings'
  },
  {
    10002: '17306.68389749527',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '17306.68389749527',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Furnishings'
  },
  {
    10002: '3442.686985105276',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '3442.686985105276',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Furnishings'
  },
  {
    10002: '15254.369949698448',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '15254.369949698448',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Furnishings'
  },
  {
    10002: '-3906.223020374775',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-3906.223020374775',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Furnishings'
  },
  {
    10002: '29071.379935264587',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '29071.379935264587',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Furnishings'
  },
  {
    10002: '5881.414980173111',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '5881.414980173111',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Furnishings'
  },
  {
    10002: '84754.5619468689',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '84754.5619468689',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Tables'
  },
  {
    10002: '1482.6120259165764',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '1482.6120259165764',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Tables'
  },
  {
    10002: '43916.19310760498',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '43916.19310760498',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Tables'
  },
  {
    10002: '-4623.056034088135',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-4623.056034088135',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Tables'
  },
  {
    10002: '39154.970703125',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '39154.970703125',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Tables'
  },
  {
    10002: '-3559.6519879102707',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-3559.6519879102707',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Tables'
  },
  {
    10002: '39139.806856155396',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '39139.806856155396',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Tables'
  },
  {
    10002: '-11025.375987529755',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-11025.375987529755',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Tables'
  },
  {
    10002: '30236.3359644413',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '30236.3359644413',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Appliances'
  },
  {
    10002: '8261.27197098732',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '8261.27197098732',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Appliances'
  },
  {
    10002: '19525.326094150543',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '19525.326094150543',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Appliances'
  },
  {
    10002: '4123.939019560814',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '4123.939019560814',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Appliances'
  },
  {
    10002: '23582.032926678658',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '23582.032926678658',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Appliances'
  },
  {
    10002: '-2638.6159623861313',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '-2638.6159623861313',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Appliances'
  },
  {
    10002: '34188.466317892075',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '34188.466317892075',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Appliances'
  },
  {
    10002: '8391.413984239101',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '8391.413984239101',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Appliances'
  },
  {
    10002: '9212.066044569016',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '9212.066044569016',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Art'
  },
  {
    10002: '2374.101003214717',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '2374.101003214717',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Art'
  },
  {
    10002: '4655.6219692230225',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4655.6219692230225',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Art'
  },
  {
    10002: '1058.5850008130074',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1058.5850008130074',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Art'
  },
  {
    10002: '5765.340019583702',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '5765.340019583702',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Art'
  },
  {
    10002: '1195.1630011796951',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1195.1630011796951',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Art'
  },
  {
    10002: '7485.764034986496',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '7485.764034986496',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Art'
  },
  {
    10002: '1899.942004531622',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1899.942004531622',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Art'
  },
  {
    10002: '55961.11282122135',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '55961.11282122135',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Binders'
  },
  {
    10002: '16096.799980849028',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '16096.799980849028',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Binders'
  },
  {
    10002: '37030.34099626541',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '37030.34099626541',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Binders'
  },
  {
    10002: '3900.6622482538223',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '3900.6622482538223',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Binders'
  },
  {
    10002: '56923.28208118677',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '56923.28208118677',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Binders'
  },
  {
    10002: '-1043.632896721363',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '-1043.632896721363',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Binders'
  },
  {
    10002: '53497.99653959274',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '53497.99653959274',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Binders'
  },
  {
    10002: '11267.932148218155',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '11267.932148218155',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Binders'
  },
  {
    10002: '4118.099995136261',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4118.099995136261',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1908.761996269226',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1908.761996269226',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Envelopes'
  },
  {
    10002: '3345.555993080139',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '3345.555993080139',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1465.4750101566315',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1465.4750101566315',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Envelopes'
  },
  {
    10002: '4636.871988296509',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4636.871988296509',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1777.5259877443314',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1777.5259877443314',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Envelopes'
  },
  {
    10002: '4375.874011039734',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4375.874011039734',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1812.4089943170547',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1812.4089943170547',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Envelopes'
  },
  {
    10002: '923.2159950733185',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '923.2159950733185',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Fasteners'
  },
  {
    10002: '275.19199895858765',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '275.19199895858765',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Fasteners'
  },
  {
    10002: '503.3160014152527',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '503.3160014152527',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Fasteners'
  },
  {
    10002: '173.71899946779013',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '173.71899946779013',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Fasteners'
  },
  {
    10002: '778.0299946069717',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '778.0299946069717',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Fasteners'
  },
  {
    10002: '236.6199992671609',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '236.6199992671609',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Fasteners'
  },
  {
    10002: '819.7179999351501',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '819.7179999351501',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Fasteners'
  },
  {
    10002: '263.98999811708927',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '263.98999811708927',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Fasteners'
  },
  {
    10002: '5078.726016759872',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '5078.726016759872',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Labels'
  },
  {
    10002: '2303.1279985904694',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '2303.1279985904694',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Labels'
  },
  {
    10002: '2353.179967880249',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2353.179967880249',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Labels'
  },
  {
    10002: '1040.771997153759',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1040.771997153759',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Labels'
  },
  {
    10002: '2451.4719779491425',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2451.4719779491425',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Labels'
  },
  {
    10002: '1073.0799936652184',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1073.0799936652184',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Labels'
  },
  {
    10002: '2602.934000492096',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2602.934000492096',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Labels'
  },
  {
    10002: '1129.2839995622635',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1129.2839995622635',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Labels'
  },
  {
    10002: '26663.717969417572',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '26663.717969417572',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Paper'
  },
  {
    10002: '12119.230026364326',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '12119.230026364326',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Paper'
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  records: data,
  rowTree: [
    {
      dimensionKey: '230627170530016',
      value: 'Furniture',
      hierarchyState: 'expand',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Bookcases',
          hierarchyState: 'collapse'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Chairs',
          hierarchyState: 'collapse'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Furnishings'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Tables'
        }
      ]
    },
    {
      dimensionKey: '230627170530016',
      value: 'Office Supplies',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Appliances'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Art'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Binders'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Envelopes'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Fasteners'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Labels'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Paper'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Storage'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Supplies'
        }
      ]
    },
    {
      dimensionKey: '230627170530016',
      value: 'Technology',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Accessories'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Copiers'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Machines'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Phones'
        }
      ]
    }
  ],
  columnTree: [
    {
      dimensionKey: '230627170530059',
      value: 'West',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'South',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'Central',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'East',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    }
  ],
  rows: [
    {
      dimensionKey: '230627170530016',
      title: 'Catogery',
      width: 'auto'
    },
    {
      dimensionKey: '230627170530068',
      title: 'Sub-Catogery',
      width: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: '230627170530059',
      title: 'Region',
      headerStyle: {
        textStick: true
      },
      width: 'auto'
    }
  ],
  indicators: [
    {
      indicatorKey: '230627170530019',
      title: 'Sales',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: value => {
        if (value) return '$' + Number(value).toFixed(2);
        return '';
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    },
    {
      indicatorKey: '230627170530022',
      title: 'Profit',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: value => {
        if (value) return '$' + Number(value).toFixed(2);
        return '';
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      textStick: true
    }
  },
  widthMode: 'standard',
  rowHierarchyIndent: 20,
  theme: {
    defaultStyle: {
      borderLineWidth: 0
    },
    headerStyle: {
      frameStyle: {
        borderColor: 'blue',
        borderLineWidth: [0, 0, 1, 0]
      }
    },
    rowHeaderStyle: {
      frameStyle: {
        borderColor: 'blue',
        borderLineWidth: [0, 1, 0, 0]
      }
    },
    cornerHeaderStyle: {
      frameStyle: {
        borderColor: 'blue',
        borderLineWidth: [0, 1, 1, 0]
      }
    }
  }
};

const tableInstance = new VTable.PivotTable(option);
```

In short, in VTable, by flexibly using Theme configuration items, we can easily create an exclusive data table style that meets our needs. Please refer to this tutorial to make reasonable configurations based on actual scenarios, and give full play to VTable's powerful Theme customization capabilities.
