# 搜索组件

`@visactor/vtable-search`包是为了 VTable 表格搜索功能所封装的组件，他支持搜索单元格的内容，并高亮和跳转相关搜索结果

## 使用方式

demo可以参考[demo](../../demo/search/search-component)

### 初始化
首先，你需要在你的应用中安装`@visactor/vtable`和`@visactor/vtable-search`包，然后在你的代码中引入它们生成一个表格实例，和一个搜索组件实例：

```ts
import * as VTable from '@visactor/vtable';
import { SearchComponent } from '@visactor/vtable-search';

// config option
// ......
const tableInstance = new VTable.ListTable(option);

// search component
const search = new SearchComponent({
  table: tableInstance,
  autoJump: true // 搜索完成后是否自动跳转到搜索结果的第一条
});
```

### 开始搜索
search组件提供`search`方法，用于搜索单元格的内容，高亮并返回搜索结果：

```ts
const searchResult = search.search('search content');
// searchResult: { index: number, results: { row: number, column: number }[] }
```

### 跳转搜索结果
search组件提供`next`和`prev`方法，用于跳转搜索结果：

```ts
const searchResult = search.next(); // 跳转到下一条搜索结果
const searchResult = search.prev(); // 跳转到上一条搜索结果
```

### 结束搜索
search组件提供`clear`方法，用于结束搜索：

```ts
search.clear();
```

## 配置
初始化配置
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| table | IVTable | 表格实例 |
| autoJump | boolean | 搜索完成后是否自动跳转到搜索 |
| skipHeader | boolean | 搜索是否跳过表头 |
| highlightCellStyle | ICellStyle | 全部搜索结果的高亮样式 |
| focuseHighlightCellStyle | ICellStyle | 当前目标搜索结果的高亮样式 |
| queryMethod | (queryStr: string, value: string, option?: { col: number; row: number; table: IVTable }) => boolean | 搜索匹配方法，默认使用`includes`方法 |
| callback | boolean | 搜索完成后的回调 |

注意

* `highlightCellStyle`和`focuseHighlightCellStyle`是两个不同的样式，前者用于高亮所有搜索结果，后者用于高亮当前目标搜索结果，这两个样式都是对搜索结果的目标单元格整体生效，目前还不支持对单元格内的部分文字进行高亮。

## 组件方法

* search 开始搜索，接收一个字符串，返回一个对象，包含当前搜索结果的索引和搜索结果数组，搜索结果数组的每一项包含当前搜索结果的列和行，以及当前单元格的内容
```js
{
  // ......
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

* next & prev 跳转搜索结果，返回一个对象，包含当前搜索结果的索引和搜索结果数组，搜索结果数组的每一项包含当前搜索结果的列和行，以及当前单元格的内容
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

* clear 清除搜索结果
```js
clear(): void
```
