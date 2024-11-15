# Quick Start

In this tutorial, we will introduce how to use @visactor/vtable-calendar to draw a simple calendar.

## Get @visactor/vtable-calendar

You can get it in the following ways

### Use NPM package

First, you need to install it using the following command in the project root directory:

```sh

# Install using npm
npm install @visactor/vtable-calendar

# Install using yarn
yarn add @visactor/vtable-calendar
```

### Use CDN

You can also get the built vtable-calendar file through CDN.

```html
<script src="https://unpkg.com/@visactor/vtable-calendar/dist/vtable-calendar.min.js"></script>
<script>
const calendarInstance = new VTableCalendar.Calendar(domContainer, option);
</script>

## Import Calendar

### Import via NPM package

Use `import` at the top of the JavaScript file to import vtable-calendar:

```js
import {Calendar} from '@visactor/vtable-calendar';

const calendarInstance = new Calendar(domContainer, option);
```

### Import using script tag

Introduce the built vtable-calendar file by adding `<script>` tag directly in the HTML file:

```html
<script> src="https://unpkg.com/@visactor/vtable-calendar/dist/vtable-calendar.min.js"></script>
<script>
const calendarInstance = new VTableCalendar.Calendar(domContainer, option);
</script>
```

## Draw a simple calendar

Before drawing, we need to prepare a DOM container with height and width for Calendar, and this container can be relatively positioned, that is, position needs to be set to 'absolute' or 'relative'.

**Please make sure that the width and height of the container are integers. The offsetWidth, offsetHeight, clientWidth, and clientHeight properties of the container will be used in the internal logic of VTable. If the width and height of the container are decimals, it will cause errors in the value, which may cause table jitter problems. **
```html
<body>
<div id="tableContainer" style="position: absolute; width: 600px;height:400px;"></div>
</body>
```

Next, we create a `Calendar` instance and pass in the calendar configuration items:

```javascript livedemo template=vtable
const calendarInstance = new VTableCalendar.Calendar(document.getElementById(CONTAINER_ID));
window['calendarInstance'] = calendarInstance;
```

So far, you have successfully drawn a simple calendar!