# Node 服务端渲染

VTable 提供了 Node 服务端渲染的能力，你可以在 Node 环境中使用 VTable 来生成图表图片，下面将向大家介绍如何使用 [node-canvas](https://github.com/Automattic/node-canvas) 来实现图表的服务端渲染。

## 如何使用

VTable 的 Node 服务端渲染能力由底层的渲染引擎 [VRender](https://github.com/VisActor/VRender)提供。使用方式很简单，下面通过一个简单的例子进行说明：

```ts
const fs = require('fs');

const VTable = require('@visactor/vtable');
const Canvas = require('canvas');
const {Resvg} = require('@resvg/resvg-js');

const generatePersons = (count) => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

const records = generatePersons(20);
const columns: VTable.ColumnsDefine = [
  {
    field: 'id',
    title: 'ID ff',
    width: '1%',
    minWidth: 200,
    sort: true
  },
  {
    field: 'email1',
    title: 'email',
    width: 200,
    sort: true
  },
  {
    title: 'full name',
    columns: [
      {
        field: 'name',
        title: 'First Name',
        width: 200
      },
      {
        field: 'name',
        title: 'Last Name',
        width: 200
      }
    ]
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
  },
  {
    field: 'tel',
    title: 'telephone',
    width: 150
  },
  {
    field: 'work',
    title: 'job',
    width: 200
  },
  {
    field: 'city',
    title: 'city',
    width: 150
  }
];
const option: VTable.ListTableConstructorOptions = {
  records,
  columns,

  // 声明使用的渲染环境以及传染对应的渲染环境参数
  pixelRatio: 2, // dpr
  mode: 'node',
  modeParams: {
    createCanvas: canvas.createCanvas,
    createImageData: canvas.createImageData,
    loadImage: canvas.loadImage,
    Resvg: Resvg // for svg
  },
  canvasWidth: 1000,
  canvasHeight: 700
};
const tableInstance = new VTable.ListTable(option);


// 导出图片
const buffer = tableInstance.getImageBuffer();
fs.writeFileSync(`./list-table.png`, buffer);
```

其中：
* `pixelRatio` 为输出图片的 dpr，默认为 1
* `mode` 为渲染环境，需要设置为 `node`
* `modeParams` 为渲染环境的参数：
  * `createCanvas` 为创建 canvas 的方法
  * `createImageData` 为创建 imageData 的方法
  * `loadImage` 为加载图片的方法
  * `Resvg` 为 svg 渲染的工具