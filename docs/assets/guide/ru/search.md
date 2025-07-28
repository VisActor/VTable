# Search компонент

The `@visactor/vтаблица-search` packвозраст is a компонент that encapsulates the Vтаблица таблица search функция. It supports searching the contents из cells и highlighting и jumping related search results.

## Usвозраст

для демонстрация, please refer к [демонстрация](/vтаблица/демонстрация/search/search-компонент)

### Initialization
первый, you need к install the `@visactor/vтаблица` и `@visactor/vтаблица-search` packвозрастs в your application, и then introduce them в your код к generate a таблица instance и a search компонент instance:

```ts
import * as Vтаблица от '@visactor/vтаблица';
import { Searchкомпонент } от '@visactor/vтаблица-search';

//config option
//......
const таблицаInstance = новый Vтаблица.списоктаблица(option);

// search компонент
const search = новый Searchкомпонент({
   таблица: таблицаInstance,
   автоJump: true // Whether к автоmatically jump к the первый search result after the search is completed
});
```

### начало Search
The search компонент provides the `search` method, which is used к search the contents из cells, highlight и возврат search results:

```ts
const searchResult = search.search('search content');
// searchResult: { index: число, results: { row: число, column: число }[] }
```

### Jump к search results
The search компонент provides `следующий` и `prev` методы для jumping к search results:

```ts
const searchResult = search.следующий(); // Jump к the следующий search result
const searchResult = search.prev(); // Jump к the предыдущий search result
```

### конец search
The search компонент provides the `clear` method к конец the search:

```ts
search.clear();
```

## Configuration
Initial configuration
| Parameters | тип | Description |
| --- | --- | --- |
| таблица | IVтаблица | таблица instance |
| автоJump | логический | Whether к автоmatically jump к the search after the search is completed |
| skipHeader | логический | Search whether к skip the header |
| highlightCellStyle | ICellStyle | Highlight style для все search results |
| focuseHighlightCellStyle | ICellStyle | The highlight style из the текущий target search result |
| queryMethod | (queryStr: строка, значение: строка, option?: { col: число; row: число; таблица: IVтаблица }) => логический | Search matching method, the `includes` method is used по по умолчанию |
| обратный вызов | (queryResult: QueryResult, таблица: IVтаблица) => void | обратный вызов after the search is completed |

Notice

* `highlightCellStyle` и `focuseHighlightCellStyle` are two different styles. The former is used к highlight все search results, и the latter is used к highlight the текущий target search results. Both styles take effect на the entire target cell из the search results. , currently does не support highlighting part из the текст в the cell.

## компонент методы

* search starts a search, receives a строка, и returns an объект containing the index из the текущий search result и a search result массив. каждый item из the search result массив contains the column и row из the текущий search result, и the content из the текущий cell.
```js
{
   //......
   search(str: строка): {
       index: число;
       results: {
           col: число;
           row: число;
           значение: строка;
       }[];
   }
}
```

* следующий & prev jumps к the search results и returns an объект containing the index из the текущий search result и the search result массив. каждый item из the search result массив contains the column и row из the текущий search result, as well as the content из the текущий cell.
```js
{
   следующий(): {
     index: число;
     results: {
         col: число;
         row: число;
         значение: строка;
     }[];
   }
   prev(): {
     index: число;
     results: {
         col: число;
         row: число;
         значение: строка;
     }[];
   }
}
```

* clear clear search results
```js
clear(): void
```
