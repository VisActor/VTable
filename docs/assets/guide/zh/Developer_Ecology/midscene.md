# 使用 Midscene.js 通过 AI 简化测试

[Midscene.js](https://midscenejs.com/zh) 是一款由多模态 AI 驱动 UI 的自动化工具，Midscene.js 让 UI 自动化测试脚本变得更容易编写、更易维护。

<div style="width: 40%; text-align: center;">
  <video src="https://midscenejs.com/introduction/Midscene.mp4" controls style="width: 100%"></video>
</div>

在使用 VisActor 产品时，使用 Midscene.js 提供的 action 能力可以快速完成 UI 测试用例，Midscene.js 提供的 query 和 assert 也更加方便测试用例的编写。

## 使用 Chrome 插件体验

1. 参考 Midscene.js 站点教程完成插件安装：[https://midscenejs.com/zh/quick-experience.html](https://midscenejs.com/zh/quick-experience.html)

2. 参考说明文档配置模型参数：[https://midscenejs.com/zh/model-provider.html](https://midscenejs.com/zh/model-provider.html)（推荐使用 UI-TARS 或 Qwen-2.5-VL 模型，VisActor 组件都是基于 canvas 实现，所以没有办法使用 gpt-4o 模型）

3. 打开 playground：[https://www.visactor.com/vchart/playground](https://www.visactor.com/vchart/playground)，填充相应的测试用例，下面是一个简单例子：

示例代码：

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

5. 输入指令，点击 Run 按钮，运行测试用例

- 执行交互命令：点击表格第一列的 Order ID 右侧的排序按钮

<div style="width: 40%; text-align: center;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/midscene-vtable-action.mp4" controls style="width: 100%"></video>
</div>

- 执行查询命令：表格中第一列当前显示的第一行的内容

<div style="width: 40%; text-align: center;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/midscene-vtable-query.mp4" controls style="width: 100%"></video>
</div>

- 执行断言命令：表格中第二列第一行的内容为 DP-13000

<div style="width: 40%; text-align: center;">
  <video src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/midscene-vtable-assert.mp4" controls style="width: 100%"></video>
</div>

## 使用 puppeteer 编写自动化测试脚本

示例仓库：[https://github.com/VisActor/midscene-test-demo](https://github.com/VisActor/midscene-test-demo)

### 运行示例代码

1. 克隆仓库，运行`pnpm install`安装依赖
2. 新建`.env`文件，配置大模型

```
# replace by your own, example(qwen):
OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
OPENAI_API_KEY="YOUR_TOKEN"
MIDSCENE_MODEL_NAME="qwen-vl-max-latest"
MIDSCENE_USE_QWEN_VL=1
```

3. 运行测试

```
# run vchart demo
pnpm run start-test-vchart

# run vtable demo
pnpm run start-test-vtable
```

### 示例代码说明

测试代码在`test/vtable-test.ts`

1. 创建 browser & page，打开测试 url

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

2. 插入运行 VTable 代码，创建表格

```ts
await page.evaluate(spec => {
  const CONTAINER_ID = 'visactor-container';

  // @ts-ignore
  const vtable = new window.VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  // @ts-ignore
  window.vtableInstance = vtable;
}, spec);

// 等待canvas创建完成，表格完成渲染
await page.waitForSelector('canvas');
```

3. 创建 Midscene agent，执行测试命令

```ts
// init Midscene agent
const agent = new PuppeteerAgent(page);

// 获取表格中第一列第一行的内容
const items = await agent.aiQuery('表格中第一列第一行的内容');
console.log('表格中第一列第一行的内容', items);

// 点击表格第一列的 Order ID 右侧的排序按钮
await agent.aiAction('点击表格第一列的 Order ID 右侧的排序按钮');

// 断言表格中第一列第二行的内容为CA-2015-105417。返回一个 Promise，当断言成功时解析为 void；若断言失败，则抛出一个错误，错误信息包含 errorMsg 以及 AI 生成的原因
await agent.aiAssert('表格中第一列第二行的内容为 CA-2015-105417');
```

4. 截图，对比标准图片

```ts
const screenshot = await page.screenshot();

// 对比标准图片
await diffImage('./test/images/vtable-test.png', screenshot, 'vtable-diff');
```
