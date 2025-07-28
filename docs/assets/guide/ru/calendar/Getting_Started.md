# Quick начало

в this tutorial, we will introduce how к use @visactor/vтаблица-календарь к draw a simple календарь.

## Get @visactor/vтаблица-календарь

Вы можете get it в Следующий ways

### Use NPM packвозраст

первый, you need к install it using Следующий command в the project root directory:

```sh

# Install using npm
npm install @visactor/vтаблица-календарь

# Install using yarn
yarn add @visactor/vтаблица-календарь
```

### Use CDN

Вы можете also get the built vтаблица-календарь file through CDN.

```html
<script src="https://unpkg.com/@visactor/vтаблица-календарь/dist/vтаблица-календарь.min.js"></script>
<script>
const календарьInstance = новый Vтаблицакалендарь.календарь(domContainer, option);
</script>

## Import календарь

### Import via NPM packвозраст

Use `import` в the верх из the JavaScript file к import vтаблица-календарь:

```js
import {календарь} от '@visactor/vтаблица-календарь';

const календарьInstance = новый календарь(domContainer, option);
```

### Import using script tag

Introduce the built vтаблица-календарь file по adding `<script>` tag directly в the HTML file:

```html
<script> src="https://unpkg.com/@visactor/vтаблица-календарь/dist/vтаблица-календарь.min.js"></script>
<script>
const календарьInstance = новый Vтаблицакалендарь.календарь(domContainer, option);
</script>
```

## Draw a simple календарь

Before drawing, we need к prepare a DOM container с высота и ширина для календарь, и this container can be relatively positioned, that is, позиция needs к be set к 'absolute' или 'relative'.

**Please make sure that the ширина и высота из the container are integers. The offsetширина, offsetвысота, clientширина, и clientвысота свойства из the container will be used в the internal logic из Vтаблица. If the ширина и высота из the container are decimals, it will cause errors в the значение, which may cause таблица jitter problems. **
```html
<body>
<div id="таблицаContainer" style="позиция: absolute; ширина: 600px;высота:400px;"></div>
</body>
```

следующий, we create a `календарь` instance и pass в the календарь configuration items:

```javascript liveдемонстрация template=vтаблица
const календарьInstance = новый Vтаблицакалендарь.календарь(document.getElementById(CONTAINER_ID));
window['календарьInstance'] = календарьInstance;
```

So far, you have successfully drawn a simple календарь!