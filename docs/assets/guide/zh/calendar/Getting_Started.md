# 快速上手

在本教程中，我们将介绍如何使用 @visactor/vtable-calendar 绘制一个简单的日历。

## 获取 @visactor/vtable-calendar

你可以通过以下几种方式获取 

### 使用 NPM 包

首先，你需要在项目根目录下使用以下命令安装：

```sh

# 使用 npm 安装
npm install @visactor/vtable-calendar

# 使用 yarn 安装
yarn add @visactor/vtable-calendar
```

### 使用 CDN

你还可以通过 CDN 获取构建好的 vtable-calendar 文件。

```html
<script src="https://unpkg.com/@visactor/vtable-calendar/dist/vtable-calendar.min.js"></script>
<script>
  const calendarInstance = new VTableCalendar.Calendar(domContainer, option);
</script>

## 引入 Calendar

### 通过 NPM 包引入

在 JavaScript 文件顶部使用 `import` 引入 vtable-calendar：

```js
import {Calendar} from '@visactor/vtable-calendar';

const calendarInstance = new Calendar(domContainer, option);
```

### 使用 script 标签引入

通过直接在 HTML 文件中添加 `<script>` 标签，引入构建好的 vtable-calendar 文件：

```html
<script src="https://unpkg.com/@visactor/vtable-calendar/dist/vtable-calendar.min.js"></script>
<script>
  const calendarInstance = new VTableCalendar.Calendar(domContainer, option);
</script>
```

## 绘制一个简单的日历图

在绘图前我们需要为 Calendar 准备一个具备高宽的 DOM 容器，且这个容器可以相对定位，即需要设置position为 'absolute' 或者 'relative'。

**请务必保证容器的宽高值为整数，VTable 内部逻辑中会用到容器的 offsetWidth、offsetHeight、clientWidth、clientHeight 属性，如果容器的 width 和 height 为小数会造成取值有误差，可能产生表格抖动问题。**
```html
<body>
  <div id="tableContainer" style="position: absolute; width: 600px;height:400px;"></div>
</body>
```

接下来，我们创建一个 `Calendar` 实例，传入日历图配置项：

```javascript livedemo template=vtable
const calendarInstance = new VTableCalendar.Calendar(document.getElementById(CONTAINER_ID));
window['calendarInstance'] = calendarInstance;
```

至此，你已经成功绘制出了一个简单的日历图！
