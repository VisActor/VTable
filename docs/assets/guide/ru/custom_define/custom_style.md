# пользовательский style

Vтаблица supports users к пользовательскийize styles для a certain cell и a certain range из cells в the таблица к highlight некоторые areas. Using пользовательский styles в Vтаблица is divided into two parts: регистрацияed styles и assigned styles.

## Registration style

к регистрация a пользовательский style, you need к define two attributes: `id` и `style`:

- id: the unique id из the пользовательский style
- style: пользовательский cell style, which is the same as the `style` configuration в `column`. The final rendering effect is the fusion из the original style из the cell и the пользовательский style.

There are two ways к регистрация пользовательский styles, configuring в `option` и configuring using апи:

\*option
The пользовательскийCellStyle property в option receives an массив composed из multiple пользовательский style objects, supports two configuration методы:

1. Configure `style` as a `ColumnStyleOption` объект, representing a static пользовательский style, the final rendering effect is the fusion из the original style из the cell и the пользовательский style
2. Configure `style` as a `((styleArg: StylePropertyFunctionArg) => ColumnStyleOption)` функция, representing a dynamic пользовательский style, the final rendering effect is the fusion из the original style из the cell и the пользовательский style

```js
// init option
const option = {
  //......
  пользовательскийCellStyle: [
    {
      id: 'пользовательский-1',
      style: {
        bgColor: 'red'
      }
    },
    {
      id: 'пользовательский-2',
      style: styleArg => {
        возврат {
          bgColor: styleArg.row % 2 === 0 ? 'red' : 'blue'
        };
      }
    }
  ]
};
```

- апи
  пользовательский styles can be регистрацияed through the `регистрацияпользовательскийCellStyle` method provided по the Vтаблица instance:

```js
instance.регистрацияпользовательскийCellStyle(id, style);
```

## Assign style

к use a регистрацияed пользовательский style, you need к assign the пользовательский style к the cell. The assignment needs к define two attributes: `cellPosition` и `пользовательскийStyleId`:

- cellPosition: cell позиция information, supports configuration из single cells и cell areas
  - Single cell: `{ row: число, col: число }`
  - Cell range: `{ range: { начало: { row: число, col: число }, конец: { row: число, col: число} } }`
- пользовательскийStyleId: пользовательский style id, the same as the id defined when регистрацияing the пользовательский style

There are two allocation методы, configuration в `option` и configuration using апи:

\*option
The `пользовательскийCellStyleArrangement` property в option receives an массив composed из multiple пользовательский assigned style objects:

```js
// init option
const option = {
  //......
  пользовательскийCellStyleArrangement: [
    {
      cellPosition: {
        col: 3,
        row: 4
      },
      пользовательскийStyleId: 'пользовательский-1'
    },
    {
      cellPosition: {
        range: {
          начало: {
            col: 5,
            row: 5
          },
          конец: {
            col: 7,
            row: 7
          }
        }
      },
      пользовательскийStyleId: 'пользовательский-2'
    }
  ]
};
```

- апи
  пользовательский styles can be assigned via the `arrangeпользовательскийCellStyle` method provided по the Vтаблица instance:

```js
instance.arrangeпользовательскийCellStyle(cellPosition, пользовательскийStyleId);
```

## Update и delete styles

- After the пользовательский style is регистрацияed, Вы можете update the пользовательский style с the same ID through the `регистрацияпользовательскийCellStyle` method. After the update, the cell style из the assigned пользовательский style will be updated; if `newStyle` is `undefined` | `null` means deleting the пользовательский style. After deletion, the cell style из the assigned пользовательский style will restore the по умолчанию style.

```js
instance.регистрацияпользовательскийCellStyle(id, newStyle);
```

- для the assigned пользовательский style cell area, Вы можете update the style assignment к the cell area through the `arrangeпользовательскийCellStyle` method. After the update, the cell style will be updated; if `пользовательскийStyleId` is `undefined` | `null `, it means restoring the cell style к the по умолчанию style

для specific usвозраст, please refer к [демонстрация](../../демонстрация/пользовательский-render/пользовательский-style)
