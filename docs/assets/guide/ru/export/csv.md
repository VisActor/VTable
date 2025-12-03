# CSV export

The `@visactor/vтаблица-export` packвозраст is a tool packвозрастd для Vтаблица таблица export. It supports export в both CSV и Excel formats.

## Usвозраст

### import

первый, you need к install the `@visactor/vтаблица` и `@visactor/vтаблица-export` packвозрастs в your application, then introduce them в your код к generate a таблица instance и export it:

```js
import * as Vтаблица от '@visactor/vтаблица';
import { downloadCsv, exportVтаблицаToCsv } от '@visactor/vтаблица-export';

//config option
//......
const таблицаInstance = новый Vтаблица.списоктаблица(option);

// download csv file
downloadCsv(exportVтаблицаToCsv(таблицаInstance), 'export-csv');
```

- `exportVтаблицаToCsv`: таблица output tool, outputs таблица instances as a строка в CSV format
- `downloadCsv`: Download tool к download CSV format strings as files в a browser environment
- If it is a server environment, Вы можете process the CSV format строка converted по `exportVтаблицаToCsv` yourself.

Reference[демонстрация](../../демонстрация/export/таблица-export)

### umd

Вы можете also directly introduce the umd product из the `@visactor/vтаблица-export` packвозраст в HTML:

```html
<script src="https://unpkg.com/@visactor/vтаблица-export@latest/dist/vтаблица-export.js"></script>
```

Find the corresponding tool в the global variable `Vтаблица.export` и use the same method as above:

```js
const { downloadCsv, exportVтаблицаToCsv } = Vтаблица.export;
// ......
```
