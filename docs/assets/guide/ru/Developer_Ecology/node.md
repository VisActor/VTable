# Node Server Rendering

Vтаблица provides Node server rendering capabilities. Вы можете use Vтаблица к generate график imвозрастs в the Node environment. Следующий will introduce how к use [node-canvas](https://github.com/автоmattic/node-canvas) к achieve server-side rendering из графикs.

## How к use

Vтаблица's Node server rendering capabilities are provided по the underlying rendering engine [VRender](https://github.com/VisActor/VRender). The usвозраст is very simple, и Следующий is a simple пример к illustrate:

```ts
const fs = require('fs');

const Vтаблица = require('@visactor/vтаблица');
const Canvas = require('canvas');
const {Resvg} = require('@resvg/resvg-js');

const generatePersons = (count) => {
  возврат массив.от(новый массив(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `John${i + 1}`,
    lastимя: 'Smith',
    date1: '2022,9,1',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' : 'front-конец engineer',
    Город: 'новый york'
  }));
};

const records = generatePersons(20);
const columns: Vтаблица.ColumnsDefine = [
  {
    поле: 'id',
    заголовок: 'ID ff',
    ширина: '1%',
    minширина: 200,
    сортировка: true
  },
  {
    поле: 'email1',
    заголовок: 'email',
    ширина: 200,
    сортировка: true
  },
  {
    заголовок: 'full имя',
    columns: [
      {
        поле: 'имя',
        заголовок: 'первый имя',
        ширина: 200
      },
      {
        поле: 'имя',
        заголовок: 'последний имя',
        ширина: 200
      }
    ]
  },
  {
    поле: 'date1',
    заголовок: 'birthday',
    ширина: 200
  },
  {
    поле: 'sex',
    заголовок: 'sex',
    ширина: 100
  },
  {
    поле: 'tel',
    заголовок: 'telephone',
    ширина: 150
  },
  {
    поле: 'work',
    заголовок: 'job',
    ширина: 200
  },
  {
    поле: 'Город',
    заголовок: 'Город',
    ширина: 150
  }
];
const опция: Vтаблица.списоктаблицаConstructorOptions = {
  records,
  columns,

  // Declare the rendering environment к be used и the corresponding rendering environment parameters
  pixelRatio: 2, // dpr
  mode: 'node',
  modeParams: {
    createCanvas: canvas.createCanvas,
    createImвозрастданные: canvas.createImвозрастданные,
    loadImвозраст: canvas.loadImвозраст,
    Resvg: Resvg // для svg
  },
  canvasширина: 1000,
  canvasвысота: 700
};
const таблицаInstance = новый Vтаблица.списоктаблица(option);


// export imвозраст
const buffer = таблицаInstance.getImвозрастBuffer();
fs.writeFileSync(`./список-таблица.png`, buffer);
```

Among them:
* `pixelRatio` is the dpr из the output imвозраст, the по умолчанию is 1
* `mode` is the rendering environment, which needs к be set к `node`
* `modeParams` is the parameters из the rendering environment:
  * `createCanvas` is the method для creating canvas
  * `createImвозрастданные` is the method для creating imвозрастданные
  * `loadImвозраст` is the method для загрузка imвозрастs
  * `Resvg` is the tool для svg rendering