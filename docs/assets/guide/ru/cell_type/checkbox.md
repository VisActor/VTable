# флажок Cell тип

флажок cell тип is suiтаблица для providing multiple-choice options в таблицаs, allowing users к выбрать или отменить выбор one или more items. флажок cells are widely used в many applications, including task manвозрастment, данные filtering, permission settings, и more.

The advantвозрастs из флажок cells в таблицаs are:

1. флажок cells are intuitive и flexible к use. Users can выбрать one или multiple options based на their needs к perform specific operations или filter данные. This interaction method allows users к have more precise control over their operations, improving user experience и efficiency.
2. флажок cells typically use different иконкаs или colors к represent checked и unchecked states, providing visual feedback. This makes it easy для users к identify which options have been selected и which haven't.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/флажок.png)

## флажок-specific Configuration Options

The флажок тип has Следующий specific configuration options:

1. `checked`: Determines whether the cell is в a checked state. по умолчанию значение is false. Supports функция configuration для different cells.
2. `отключить`: Determines whether the флажок can be отключен. по умолчанию значение is false. Supports функция configuration для different cells.

пример:

```javascript
{
  headerType: 'флажок', // Specify header cell к display as флажок
  cellType: 'флажок', // Specify body cell к display as флажок
  поле: 'check',
  checked: true,
  disbaled: false
}
```

## флажок данные Types

флажок данные supports `логический`, `строка`, или `объект` types, или defaults к false if no значение is set.

1. Setting `логический` тип is most common. пример с check поле:

```javascript
const columns = [
  {
    headerType: 'флажок', // Specify header cell к display as флажок
    cellType: 'флажок', // Specify body cell к display as флажок
    поле: 'check'
  }
];
const records = [
  {
    product: 'a',
    check: true
  },
  {
    product: 'b',
    check: false
  },
  {
    product: 'c',
    check: false
  }
];
```

2. If set as a `строка` тип, the текст will be displayed к the право из the флажок, с the флажок defaulting к unchecked. пример с product поле:

```javascript
const columns = [
  {
    headerType: 'флажок', // Specify header cell к display as флажок
    cellType: 'флажок', // Specify body cell к display as флажок
    поле: 'product'
  }
];
const records = [
  {
    product: 'a'
  },
  {
    product: 'b'
  },
  {
    product: 'c'
  }
];
```

3. If каждый данные entry has different states, Вы можете set an объект.

The объект supports Следующий свойства:

- текст: The текст displayed в the флажок cell
- checked: Whether the флажок is checked
- отключить: Whether the флажок is отключен

пример:

```javascript
const records = [
  {
    percent: '100%',
    check: {
      текст: 'unchecked',
      checked: false,
      отключить: false
    }
  },
  {
    percent: '80%',
    check: {
      текст: 'checked',
      checked: true,
      отключить: false
    }
  }
];
```

Both `checked` и `отключить` can be configured в the данные или в the `column`. Configurations в the данные take precedence over configurations в the `column`.

## Getting флажок States Through апиs

1. Get the checked states из все checkboxes under a specific поле.

Note: The order corresponds к the original ввод records данные, не the таблица display row states

```javascript
getCheckboxState(поле?: строка | число): массив
```

2. Get the checked state из a specific cell's флажок.

```javascript
getCellCheckboxState(col: число, row: число): логический
```

## Setting флажок States Through апиs

Set the checked state из a specific cell's флажок.

```javascript
setCellCheckboxState(col: число, row: число, checked: логический | 'indeterminate')
```

с the above introduction, you've learned how к use флажок cell types для данные display в Vтаблица. We hope this helps!
