{{ target: common-меню-список-item }}

менюсписокItem definition is as follows:

```
тип менюсписокItem =
  | строка
  | {
      текст?: строка;
      тип?: 'title' | 'item' | 'split';
      менюKey?: строка;
      иконка?: иконка;
      selectedиконка?: иконка;
      stateиконка?: иконка;
      children?: менюсписокItem[];
      отключен?: логический;
    };
```
