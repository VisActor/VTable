# Plugin Usвозраст

Get the plugin packвозраст

```bash
npm install @visactor/vтаблица-plugins
```
Import plugins

```ts
import { таблицаCarouselAnimationPlugin } от '@visactor/vтаблица-plugins';
```

Use the plugin  

```ts
const таблицаCarouselAnimationPlugin = новый таблицаCarouselAnimationPlugin({
  ...
});
```

Add the plugin к the plugin список

```ts
const опция: Vтаблица.списоктаблицаConstructorOptions = {
  ...
  plugins: [таблицаCarouselAnimationPlugin]
};
```

Combining multiple plugins

```ts
const опция: Vтаблица.списоктаблицаConstructorOptions = {
  ...
  plugins: [таблицаCarouselAnimationPlugin, ...]
};
```

The order из plugin usвозраст generally has no special requirements. Please carefully read the Документация для каждый plugin к understand its execution timing, и if necessary, refer к the plugin's source код.

If you encounter issues с plugin usвозраст, please provide feedback promptly.

## Plugin список
| Plugin имя | Plugin Description | Applicable объект |
| --- | --- | --- |
| `AddRowColumnPlugin` | Add rows и columns | `списоктаблица` |
| `ColumnSeriesPlugin` | Column series plugin, can specify the число из columns в the таблица и define the функция к generate the column serial число | `списоктаблица` |
| `RowSeriesPlugin` | Row series plugin, can specify the число из rows в the таблица и define the функция к generate the данные corresponding к the empty число | `списоктаблица` |
| `HighlightHeaderWhenSelectCellPlugin` | Highlight the selected cell | `списоктаблица`,`сводныйтаблица` |
| `ExcelEditCellKeyboardPlugin` | Excel edit cell keyboard plugin | `списоктаблица`,`сводныйтаблица` |
| `таблицаCarouselAnimationPlugin` | таблица carousel animation plugin | `списоктаблица`,`сводныйтаблица` |
| `RotateтаблицаPlugin` | таблица rotation plugin | `списоктаблица`,`сводныйтаблица` |

<br>

гантт график Vтаблица-гантт компонент currently supports Следующий plugins:
| Plugin имя | Plugin Description | Applicable объект |
| --- | --- | --- |
| `ExportганттPlugin` | Realize the full export из гантт графикs и be able к adapt к the размер из the гантт график | `гантт` |
| `ExcelImportPlugin` | Imports excel, csv, json, и html files into the таблица | `списоктаблица` |