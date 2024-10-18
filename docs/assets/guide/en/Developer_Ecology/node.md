# Node Server Rendering

VTable provides Node server rendering capabilities. You can use VTable to generate chart images in the Node environment. The following will introduce how to use [node-canvas](https://github.com/Automattic/node-canvas) to achieve server-side rendering of charts.

## How to use

VTable's Node server rendering capabilities are provided by the underlying rendering engine [VRender](https://github.com/VisActor/VRender). The usage is very simple, and the following is a simple example to illustrate:

```ts
const fs = require('fs');

const VTable = require('@visactor/vtable');
const Canvas = require('canvas');
const {Resvg} = require('@resvg/resvg-js');

const generatePersons = (count) => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `John${i + 1}`,
    lastName: 'Smith',
    date1: '2022,9,1',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'new york'
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

  // Declare the rendering environment to be used and the corresponding rendering environment parameters
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


// export image
const buffer = tableInstance.getImageBuffer();
fs.writeFileSync(`./list-table.png`, buffer);
```

Among them:
* `pixelRatio` is the dpr of the output image, the default is 1
* `mode` is the rendering environment, which needs to be set to `node`
* `modeParams` is the parameters of the rendering environment:
  * `createCanvas` is the method for creating canvas
  * `createImageData` is the method for creating imageData
  * `loadImage` is the method for loading images
  * `Resvg` is the tool for svg rendering