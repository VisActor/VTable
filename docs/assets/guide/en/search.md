# Search component

The `@visactor/vtable-search` package is a component that encapsulates the VTable table search function. It supports searching the contents of cells and highlighting and jumping related search results.

## Usage

For demo, please refer to [demo](../../demo/search/search-component)

### Initialization
First, you need to install the `@visactor/vtable` and `@visactor/vtable-search` packages in your application, and then introduce them in your code to generate a table instance and a search component instance:

```ts
import * as VTable from '@visactor/vtable';
import { SearchComponent } from '@visactor/vtable-search';

//config option
//......
const tableInstance = new VTable.ListTable(option);

// search component
const search = new SearchComponent({
   table: tableInstance,
   autoJump: true // Whether to automatically jump to the first search result after the search is completed
});
```

### Start Search
The search component provides the `search` method, which is used to search the contents of cells, highlight and return search results:

```ts
const searchResult = search.search('search content');
// searchResult: { index: number, results: { row: number, column: number }[] }
```

### Jump to search results
The search component provides `next` and `prev` methods for jumping to search results:

```ts
const searchResult = search.next(); // Jump to the next search result
const searchResult = search.prev(); // Jump to the previous search result
```

### End search
The search component provides the `clear` method to end the search:

```ts
search.clear();
```

## Configuration
Initial configuration
| Parameters | Type | Description |
| --- | --- | --- |
| table | IVTable | Table instance |
| autoJump | boolean | Whether to automatically jump to the search after the search is completed |
| skipHeader | boolean | Search whether to skip the header |
| highlightCellStyle | ICellStyle | Highlight style for all search results |
| focuseHighlightCellStyle | ICellStyle | The highlight style of the current target search result |
| queryMethod | (queryStr: string, value: string, option?: { col: number; row: number; table: IVTable }) => boolean | Search matching method, the `includes` method is used by default |
| callback | boolean | callback after the search is completed |

Notice

* `highlightCellStyle` and `focuseHighlightCellStyle` are two different styles. The former is used to highlight all search results, and the latter is used to highlight the current target search results. Both styles take effect on the entire target cell of the search results. , currently does not support highlighting part of the text in the cell.

## Component methods

* search starts a search, receives a string, and returns an object containing the index of the current search result and a search result array. Each item of the search result array contains the column and row of the current search result, and the content of the current cell.
```js
{
   //......
   search(str: string): {
       index: number;
       results: {
           col: number;
           row: number;
           value: string;
       }[];
   }
}
```

* next & prev jumps to the search results and returns an object containing the index of the current search result and the search result array. Each item of the search result array contains the column and row of the current search result, as well as the content of the current cell.
```js
{
   next(): {
     index: number;
     results: {
         col: number;
         row: number;
         value: string;
     }[];
   }
   prev(): {
     index: number;
     results: {
         col: number;
         row: number;
         value: string;
     }[];
   }
}
```

* clear clear search results
```js
clear(): void
```