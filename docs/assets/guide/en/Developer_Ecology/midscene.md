# Using Midscene.js to Simplify Testing with AI

[Midscene.js](https://midscenejs.com/) is an automation tool powered by multimodal AI that makes UI automation test scripts easier to write and maintain.

<div style="width: 40%; text-align: center;">
  <video src="https://midscenejs.com/introduction/Midscene.mp4" controls style="width: 100%"></video>
</div>

When using VisActor products, you can quickly complete UI test cases using the action capabilities provided by Midscene.js. The query and assert functionalities provided by Midscene.js also make it more convenient to write test cases.

## Try it with Chrome Extension

1. Follow the Midscene.js site tutorial to complete plugin installation: [https://midscenejs.com/en/quick-experience.html](https://midscenejs.com/en/quick-experience.html)

2. Refer to the documentation to configure model parameters: [https://midscenejs.com/en/model-provider.html](https://midscenejs.com/en/model-provider.html) (UI-TARS or Qwen-2.5-VL models are recommended since VisActor components are implemented based on canvas, so the gpt-4o model cannot be used)

3. Open the playground: [https://www.visactor.com/vchart/playground](https://www.visactor.com/vchart/playground), fill in the corresponding test cases. Here's a simple example:

Example code:

```ts
const option = {
  records: [
    {
      'Order ID': 'CA-2015-103800',
      'Customer ID': 'DP-13000',
      Category: 'Office Supplies',
      'Product Name': 'Message Book, Wirebound, Four 5 1/2" X 4" Forms/Pg., 200 Dupl. Sets/Book'
    },
    {
      'Order ID': 'CA-2015-112326',
      'Customer ID': 'PO-19195',
      Category: 'Office Supplies',
      'Product Name': 'Avery 508'
    },
    {
      'Order ID': 'CA-2015-112326',
      'Customer ID': 'PO-19195',
      Category: 'Office Supplies',
      'Product Name': 'SAFCO Boltless Steel Shelving'
    },
    {
      'Order ID': 'CA-2015-112326',
      'Customer ID': 'PO-19195',
      Category: 'Office Supplies',
      'Product Name': 'GBC Standard Plastic Binding Systems Combs'
    },
    {
      'Order ID': 'CA-2015-141817',
      'Customer ID': 'MB-18085',
      Category: 'Office Supplies',
      'Product Name': 'Avery Hi-Liter EverBold Pen Style Fluorescent Highlighters, 4/Pack'
    },
    {
      'Order ID': 'CA-2015-130813',
      'Customer ID': 'LS-17230',
      Category: 'Office Supplies',
      'Product Name': 'Xerox 225'
    },
    {
      'Order ID': 'CA-2015-106054',
      'Customer ID': 'JO-15145',
      Category: 'Office Supplies',
      'Product Name': 'Dixon Prang Watercolor Pencils, 10-Color Set with Brush'
    },
    {
      'Order ID': 'CA-2015-167199',
      'Customer ID': 'ME-17320',
      Category: 'Furniture',
      'Product Name': "Global Deluxe High-Back Manager's Chair"
    },
    {
      'Order ID': 'CA-2015-167199',
      'Customer ID': 'ME-17320',
      Category: 'Office Supplies',
      'Product Name': 'Ibico Hi-Tech Manual Binding System'
    },
    {
      'Order ID': 'CA-2015-167199',
      'Customer ID': 'ME-17320',
      Category: 'Office Supplies',
      'Product Name': 'Rogers Handheld Barrel Pencil Sharpener'
    },
    {
      'Order ID': 'CA-2015-167199',
      'Customer ID': 'ME-17320',
      Category: 'Technology',
      'Product Name': 'GE 30524EE4'
    },
    {
      'Order ID': 'CA-2015-167199',
      'Customer ID': 'ME-17320',
      Category: 'Technology',
      'Product Name': 'Wireless Extenders zBoost YX545 SOHO Signal Booster'
    },
    {
      'Order ID': 'CA-2015-167199',
      'Customer ID': 'ME-17320',
      Category: 'Office Supplies',
      'Product Name': 'Alliance Super-Size Bands, Assorted Sizes'
    },
    {
      'Order ID': 'CA-2015-167199',
      'Customer ID': 'ME-17320',
      Category: 'Office Supplies',
      'Product Name': 'Southworth 25% Cotton Granite Paper & Envelopes'
    },
    {
      'Order ID': 'CA-2015-105417',
      'Customer ID': 'VS-21820',
      Category: 'Furniture',
      'Product Name': 'Howard Miller 14-1/2" Diameter Chrome Round Wall Clock'
    },
    {
      'Order ID': 'CA-2015-105417',
      'Customer ID': 'VS-21820',
      Category: 'Office Supplies',
      'Product Name': 'Acco Four Pocket Poly Ring Binder with Label Holder, Smoke, 1"'
    },
    {
      'Order ID': 'CA-2015-135405',
      'Customer ID': 'MS-17830',
      Category: 'Office Supplies',
      'Product Name': 'Newell 312'
    },
    {
      'Order ID': 'CA-2015-135405',
      'Customer ID': 'MS-17830',
      Category: 'Technology',
      'Product Name': 'Memorex Micro Travel Drive 8 GB'
    },
    {
      'Order ID': 'CA-2015-149020',
      'Customer ID': 'AJ-10780',
      Category: 'Office Supplies',
      'Product Name': 'Avery 482'
    },
    {
      'Order ID': 'CA-2015-149020',
      'Customer ID': 'AJ-10780',
      Category: 'Furniture',
      'Product Name': 'Howard Miller 11-1/2" Diameter Ridgewood Wall Clock'
    }
  ],
  columns: [
    {
      field: 'Order ID',
      title: 'Order ID',
      width: 'auto',
      sort: true
    },
    {
      field: 'Customer ID',
      title: 'Customer ID',
      width: 'auto'
    },
    {
      field: 'Product Name',
      title: 'Product Name',
      width: 'auto'
    },
    {
      field: 'Category',
      title: 'Category',
      width: 'auto'
    }
  ],
  widthMode: 'standard'
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

5. Enter commands and click the Run button to execute test cases

- Execute interaction command: Click the sort button on the right side of Order ID in the first column

<div style="width: 40%; text-align: center;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/midscene-vtable-action.mp4" controls style="width: 100%"></video>
</div>

- Execute query command: Get the content of the first row in the first column currently displayed in the table

<div style="width: 40%; text-align: center;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/midscene-vtable-query.mp4" controls style="width: 100%"></video>
</div>

- Execute assertion command: Assert that the content of the first row in the second column is DP-13000

<div style="width: 40%; text-align: center;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/midscene-vtable-assert.mp4" controls style="width: 100%"></video>
</div>

## Writing Automated Test Scripts with Puppeteer

Example repository: [https://github.com/VisActor/midscene-test-demo](https://github.com/VisActor/midscene-test-demo)

### Running the Example Code

1. Clone the repository and run `pnpm install` to install dependencies
2. Create a `.env` file and configure the large language model

```
# replace by your own, example(qwen):
OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
OPENAI_API_KEY="YOUR_TOKEN"
MIDSCENE_MODEL_NAME="qwen-vl-max-latest"
MIDSCENE_USE_QWEN_VL=1
```

3. Run the tests

```
# run vchart demo
pnpm run start-test-vchart

# run vtable demo
pnpm run start-test-vtable
```

### Example Code Explanation

Test code is in `test/vtable-test.ts`

1. Create browser & page, open test URL

```ts
const browser = await puppeteer.launch({
  headless: false, // 'true' means we can't see the browser window
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({
  width: 1280,
  height: 768,
  deviceScaleFactor: os.platform() === 'darwin' ? 2 : 1 // this is used to avoid flashing on UI Mode when doing screenshot on Mac
});

await page.goto(URL);
```

2. Insert VTable code to create table

```ts
await page.evaluate(spec => {
  const CONTAINER_ID = 'visactor-container';

  // @ts-ignore
  const vtable = new window.VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  // @ts-ignore
  window.vtableInstance = vtable;
}, spec);

// Wait for canvas creation and table rendering completion
await page.waitForSelector('canvas');
```

3. Create Midscene agent and execute test commands

```ts
// init Midscene agent
const agent = new PuppeteerAgent(page);

// Get the content of the first row in the first column
const items = await agent.aiQuery('Get the content of the first row in the first column');
console.log('Content of first row in first column:', items);

// Click the sort button on the right side of Order ID in the first column
await agent.aiAction('Click the sort button on the right side of Order ID in the first column');

// Assert that the content of the second row in the first column is CA-2015-105417. Returns a Promise that resolves to void when assertion succeeds; throws an error with errorMsg and AI-generated reason if assertion fails
await agent.aiAssert('The content of the second row in the first column is CA-2015-105417');
```

4. Take screenshot and compare with standard image

```ts
const screenshot = await page.screenshot();

// Compare with standard image
await diffImage('./test/images/vtable-test.png', screenshot, 'vtable-diff');
```
