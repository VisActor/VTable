# Table Carousel Animation Plugin

VTable provides a table carousel animation plugin that supports row or column carousel animations for tables.

Effect shown below:
<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/carousel-animation.gif" style="flex: 0 0 50%; padding: 10px;">
</div>

## Usage Example

```ts
const tableCarouselAnimationPlugin = new TableCarouselAnimationPlugin({
  rowCount: 10,
  colCount: 10,
  animationDuration: 1000,
  animationDelay: 0,
  animationEasing: 'linear',
  autoPlay: true,
  autoPlayDelay: 1000,
});

const option: VTable.ListTableConstructorOptions = {
  records,
  columns,
  plugins: [tableCarouselAnimationPlugin],
};

```
If you don't want the table to start playing immediately after initialization, you can set `autoPlay` to `false` and then call the `play` method manually to start playing.

```ts
tableCarouselAnimationPlugin.play();
```



## Plugin Parameter Description

The plugin provides customization options, with the following parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| rowCount | number | Number of rows to scroll per animation |
| colCount | number | Number of columns to scroll per animation |
| animationDuration | number | Animation duration |
| animationDelay | number | Animation delay |
| animationEasing | string | Animation easing function |
| autoPlay | boolean | Whether to auto-play |
| autoPlayDelay | number | Auto-play delay |
| customDistRowFunction | (row: number, table: BaseTableAPI) => { distRow: number; animation?: boolean } | Custom animation distance function for rows |
| customDistColFunction | (col: number, table: BaseTableAPI) => { distCol: number; animation?: boolean } | Custom animation distance function for columns |

## Running Example


```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 正常使用方式 const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 VTable.plugins重命名成了VTablePlugins

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing',
    image:
      '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" stroke="#f5a623" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" stroke="#f5a623" stroke-width="1" stroke-linejoin="round"/></svg>'
  }));
};

  const   animationPlugin = new VTablePlugins.TableCarouselAnimationPlugin({
    rowCount: 2,
    // colCount: 2,
    autoPlay: true,
    autoPlayDelay: 1000
  });
  const option = {
    records: generatePersons(30),
    rowSeriesNumber: {
      title: 'No.'
    },
    columns:[
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },

        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        },

    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    }
  ],

    plugins: [animationPlugin]
  };
  const tableInstance = new VTable.ListTable( document.getElementById(CONTAINER_ID),option);
  window.tableInstance = tableInstance;
```

