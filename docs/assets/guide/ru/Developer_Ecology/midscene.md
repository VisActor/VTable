# Using Midscene.js к Simplify Testing с AI

[Midscene.js](https://midscenejs.com/) is an автоmation tool powered по multimodal AI that makes UI автоmation test scripts easier к write и maintain.

<div style="ширина: 40%; текст-align: центр;">
  <video src="https://midscenejs.com/introduction/Midscene.mp4" controls style="ширина: 100%"></video>
</div>

When using VisActor products, Вы можете quickly complete UI test cases using the action capabilities provided по Midscene.js. The query и assert functionalities provided по Midscene.js also make it more convenient к write test cases.

## Try it с Chrome Extension

1. Follow the Midscene.js site tutorial к complete plugin installation: [https://midscenejs.com/en/quick-experience.html](https://midscenejs.com/en/quick-experience.html)

2. Refer к the Документация к configure model parameters: [https://midscenejs.com/en/model-provider.html](https://midscenejs.com/en/model-provider.html) (UI-TARS или Qwen-2.5-VL models are recommended since VisActor компонентs are implemented based на canvas, so the gpt-4o model cannot be used)

3. открыть the playground: [https://www.visactor.com/vграфик/playground](https://www.visactor.com/vграфик/playground), fill в the corresponding test cases. Here's a simple пример:

пример код:

```ts
const option = {
  records: [
    {
      'ID Заказа': 'CA-2015-103800',
      'пользовательскийer ID': 'DP-13000',
      категория: 'Office Supplies',
      'Product имя': 'Messвозраст Boхорошо, Wirebound, Four 5 1/2" X 4" Forms/Pg., 200 Dupl. Sets/Boхорошо'
    },
    {
      'ID Заказа': 'CA-2015-112326',
      'пользовательскийer ID': 'PO-19195',
      категория: 'Office Supplies',
      'Product имя': 'Avery 508'
    },
    {
      'ID Заказа': 'CA-2015-112326',
      'пользовательскийer ID': 'PO-19195',
      категория: 'Office Supplies',
      'Product имя': 'SAFCO Boltless Steel Shelving'
    },
    {
      'ID Заказа': 'CA-2015-112326',
      'пользовательскийer ID': 'PO-19195',
      категория: 'Office Supplies',
      'Product имя': 'GBC Standard Plastic Binding Systems Combs'
    },
    {
      'ID Заказа': 'CA-2015-141817',
      'пользовательскийer ID': 'MB-18085',
      категория: 'Office Supplies',
      'Product имя': 'Avery Hi-Liter EverBold Pen Style Fluorescent Highlighters, 4/Pack'
    },
    {
      'ID Заказа': 'CA-2015-130813',
      'пользовательскийer ID': 'LS-17230',
      категория: 'Office Supplies',
      'Product имя': 'Xerox 225'
    },
    {
      'ID Заказа': 'CA-2015-106054',
      'пользовательскийer ID': 'JO-15145',
      категория: 'Office Supplies',
      'Product имя': 'Dixon Prang Watercolor Pencils, 10-цвет Set с Brush'
    },
    {
      'ID Заказа': 'CA-2015-167199',
      'пользовательскийer ID': 'ME-17320',
      категория: 'Furniture',
      'Product имя': "Global Deluxe High-Back Manвозрастr's Chair"
    },
    {
      'ID Заказа': 'CA-2015-167199',
      'пользовательскийer ID': 'ME-17320',
      категория: 'Office Supplies',
      'Product имя': 'Ibico Hi-Tech Manual Binding System'
    },
    {
      'ID Заказа': 'CA-2015-167199',
      'пользовательскийer ID': 'ME-17320',
      категория: 'Office Supplies',
      'Product имя': 'Rogers Handheld Barrel Pencil Sharpener'
    },
    {
      'ID Заказа': 'CA-2015-167199',
      'пользовательскийer ID': 'ME-17320',
      категория: 'Technology',
      'Product имя': 'GE 30524EE4'
    },
    {
      'ID Заказа': 'CA-2015-167199',
      'пользовательскийer ID': 'ME-17320',
      категория: 'Technology',
      'Product имя': 'Wireless Extenders zBoost YX545 SOHO Signal Booster'
    },
    {
      'ID Заказа': 'CA-2015-167199',
      'пользовательскийer ID': 'ME-17320',
      категория: 'Office Supplies',
      'Product имя': 'Alliance Super-размер Bands, Asсортировкаed Sizes'
    },
    {
      'ID Заказа': 'CA-2015-167199',
      'пользовательскийer ID': 'ME-17320',
      категория: 'Office Supplies',
      'Product имя': 'Southworth 25% Cotton Granite Paper & Envelopes'
    },
    {
      'ID Заказа': 'CA-2015-105417',
      'пользовательскийer ID': 'VS-21820',
      категория: 'Furniture',
      'Product имя': 'Howard Miller 14-1/2" Diameter Chrome Round Wall Clock'
    },
    {
      'ID Заказа': 'CA-2015-105417',
      'пользовательскийer ID': 'VS-21820',
      категория: 'Office Supplies',
      'Product имя': 'Acco Four Pocket Poly Ring Binder с Label Holder, Smхорошоe, 1"'
    },
    {
      'ID Заказа': 'CA-2015-135405',
      'пользовательскийer ID': 'MS-17830',
      категория: 'Office Supplies',
      'Product имя': 'Newell 312'
    },
    {
      'ID Заказа': 'CA-2015-135405',
      'пользовательскийer ID': 'MS-17830',
      категория: 'Technology',
      'Product имя': 'Memorex Micro Travel Drive 8 GB'
    },
    {
      'ID Заказа': 'CA-2015-149020',
      'пользовательскийer ID': 'AJ-10780',
      категория: 'Office Supplies',
      'Product имя': 'Avery 482'
    },
    {
      'ID Заказа': 'CA-2015-149020',
      'пользовательскийer ID': 'AJ-10780',
      категория: 'Furniture',
      'Product имя': 'Howard Miller 11-1/2" Diameter Ridgewood Wall Clock'
    }
  ],
  columns: [
    {
      поле: 'ID Заказа',
      заголовок: 'ID Заказа',
      ширина: 'авто',
      сортировка: true
    },
    {
      поле: 'пользовательскийer ID',
      заголовок: 'пользовательскийer ID',
      ширина: 'авто'
    },
    {
      поле: 'Product имя',
      заголовок: 'Product имя',
      ширина: 'авто'
    },
    {
      поле: 'Категория',
      заголовок: 'Категория',
      ширина: 'авто'
    }
  ],
  ширинаMode: 'standard'
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```

5. Enter commands и Нажать the Run Кнопка к execute test cases

- Execute interaction command: Нажать the сортировка Кнопка на the право side из ID Заказа в the первый column

<div style="ширина: 40%; текст-align: центр;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/midscene-vтаблица-action.mp4" controls style="ширина: 100%"></video>
</div>

- Execute query command: Get the content из the первый row в the первый column currently displayed в the таблица

<div style="ширина: 40%; текст-align: центр;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/midscene-vтаблица-query.mp4" controls style="ширина: 100%"></video>
</div>

- Execute assertion command: Assert that the content из the первый row в the second column is DP-13000

<div style="ширина: 40%; текст-align: центр;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/midscene-vтаблица-assert.mp4" controls style="ширина: 100%"></video>
</div>

## Writing автоmated Test Scripts с Puppeteer

пример repository: [https://github.com/VisActor/midscene-test-демонстрация](https://github.com/VisActor/midscene-test-демонстрация)

### Running the пример код

1. Clone the repository и run `pnpm install` к install dependencies
2. Create a `.env` file и configure the large languвозраст model

```
# replace по your own, пример(qwen):
OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
OPENAI_апи_KEY="YOUR_TхорошоEN"
MIDSCENE_MODEL_имя="qwen-vl-max-latest"
MIDSCENE_USE_QWEN_VL=1
```

3. Run the tests

```
# run vграфик демонстрация
pnpm run начало-test-vграфик

# run vтаблица демонстрация
pnpm run начало-test-vтаблица
```

### пример код Explanation

Test код is в `test/vтаблица-test.ts`

1. Create browser & pвозраст, открыть test URL

```ts
const browser = await puppeteer.launch({
  headless: false, // 'true' means we can't see the browser window
  args: ['--no-sandbox', '--отключить-setuid-sandbox']
});

const pвозраст = await browser.newPвозраст();
await pвозраст.setViewport({
  ширина: 1280,
  высота: 768,
  deviceScaleFactor: os.platform() === 'darwin' ? 2 : 1 // this is used к avoid flashing на UI Mode when doing screenshot на Mac
});

await pвозраст.goto(URL);
```

2. Insert Vтаблица код к create таблица

```ts
await pвозраст.evaluate(spec => {
  const CONTAINER_ID = 'visactor-container';

  // @ts-ignore
  const vтаблица = новый window.Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
  // @ts-ignore
  window.vтаблицаInstance = vтаблица;
}, spec);

// Wait для canvas creation и таблица rendering completion
await pвозраст.waitForSelector('canvas');
```

3. Create Midscene возрастnt и execute test commands

```ts
// init Midscene возрастnt
const возрастnt = новый Puppeteerвозрастnt(pвозраст);

// Get the content из the первый row в the первый column
const items = await возрастnt.aiQuery('Get the content из the первый row в the первый column');
console.log('Content из первый row в первый column:', items);

// Нажать the сортировка Кнопка на the право side из ID Заказа в the первый column
await возрастnt.aiAction('Нажать the сортировка Кнопка на the право side из ID Заказа в the первый column');

// Assert that the content из the second row в the первый column is CA-2015-105417. Returns a Promise that resolves к void when assertion succeeds; throws an ошибка с errorMsg и AI-generated reason if assertion fails
await возрастnt.aiAssert('The content из the second row в the первый column is CA-2015-105417');
```

4. Take screenshot и compare с standard imвозраст

```ts
const screenshot = await pвозраст.screenshot();

// Compare с standard imвозраст
await diffImвозраст('./test/imвозрастs/vтаблица-test.png', screenshot, 'vтаблица-diff');
```
