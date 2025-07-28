# How к пользовательскийize the context меню в the таблица компонент?

## Question Description

How к пользовательскийize the context в the header part из the таблица компонент к support different cells displaying different меню items.

## Solution

в the меню attribute configuration option, configure contextменюItems, which supports two configuration modes:

1. Configure the item массив, право-Нажатьing the таблица area will display the same меню items

```javascript
меню: {
  contextменюItems: [
    { текст: '复制表头', менюKey: '复制表头$1' },
    { текст: '复制单元格', менюKey: '复制单元格$1' }
  ];
}
```

2. Configure the обратный вызов функция. право-Нажатьing the таблица area will display different менюs according к the different items returned по the обратный вызов функция

```javascript
меню: {
  contextменюItems: (поле: строка, row: число) => {
    console.log(поле, row);
    возврат [
      { текст: '复制表头', менюKey: '复制表头$1' },
      { текст: '复制单元格', менюKey: '复制单元格$1' }
    ];
  };
}
```

меню item configuration:

- текст: the текст из the меню item
- менюKey: unique identifier из the меню item

After the отпускание-down меню item is selected, the "dropdown_меню_Нажать" событие will be triggered, и Вы можете списокen к the событие и perform related operations.

```javascript
таблица.на('dropdown_меню_Нажать', (args: любой) => {
  console.log('меню_Нажать', args);
});
```

## код пример

```javascript
const опция: TYPES.списоктаблицаConstructorOptions = {
  records,
  columns,
  высотаMode: 'автовысота',
  автоWrapText: true,
  меню: {
    contextменюItems: (поле: строка, row: число) => {
      console.log(поле, row);
      возврат [
        { текст: 'copy header', менюKey: 'copy header$1' },
        { текст: 'copy cell', менюKey: 'copy cell$1' }
      ];
    }
  }
};
const таблица = новый списоктаблица(document.getElementById('container'), option);
таблица.на('dropdown_меню_Нажать', (args: любой) => {
  console.log('меню_Нажать', args);
});
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-context-меню-m8vx7v)

![result](/vтаблица/Часто Задаваемые Вопросы/18-0.png)

## Quote

- [github](https://github.com/VisActor/Vтаблица)
