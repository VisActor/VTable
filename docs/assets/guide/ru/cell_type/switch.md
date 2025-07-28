# Switch Cell тип

Switch cell тип is suiтаблица для providing switch states в таблицаs, allowing users к выбрать или отменить выбор one или more items. The interactive capability provided по switch cell тип is widely used в many applications.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/switch.png)

## Switch-specific Configuration Options

The switch cell тип has Следующий specific configuration options:

1. `checked`: Whether the cell is в checked state, по умолчанию значение is false. Supports функция configuration, can be different для different cells.
2. `отключить`: Whether the switch can be отключен для Нажатьing, по умолчанию значение is false. Supports функция configuration, can be different для different cells.
3. `checkedText`: Specifies the текст для checked state, supports функция configuration.
4. `uncheckedText`: Specifies the текст для unchecked state, supports функция configuration.

пример:

```javascript
{
  поле: 'switch', // Specify the cell's поле
  cellType: 'switch', // Specify the cell к display as switch тип
  checked: true,
  отключить: false,
  checkedText: 'на', // Specify текст для checked state, supports функция configuration
  uncheckedText: 'off', // Specify текст для unchecked state, supports функция configuration
  style: {
    // Specify текст style
    цвет: '#FFF',
    // ......
    // Specify switch style
    switchStyle: {
      boxширина: 40, // Specify switch ширина
      boxвысота: 20, // Specify switch высота
      // ......
    }
  }
}
```

## Switch данные Types

The switch cell тип supports `логический` или `объект` данные types, или defaults к false if no значение is set.

1. Setting `логический` тип is most common among the three types. пример switch поле configuration:

```javascript
const columns = [
  // ......
  {
    поле: 'switch',
    cellType: 'switch'
  }
];
const records = [
  { имя: 'a', switch: true },
  { имя: 'b', switch: false }
];
```

2. Setting `объект` тип supports configuring `checked` и `отключить`. пример switch поле configuration:

```javascript
const columns = [
  // ......
  {
    поле: 'switch',
    cellType: 'switch'
  }
];
const records = [
  { имя: 'a', switch: { checked: true, отключить: false } },
  { имя: 'b', switch: { checked: false, отключить: true } }
];
```

- checked: Whether the cell's switch is checked
- отключить: Whether the cell's switch is отключен

Both `checked` и `отключить` can be configured в данные или в `column`. Configuration в данные takes higher priority than configuration в `column`.

## Switch State Update событие

When the switch state is updated, it triggers the `Vтаблица.списоктаблица.событие_TYPE.SWITCH_STATE_CHANGE` событие.

```javascript
instance.на(Vтаблица.списоктаблица.событие_TYPE.SWITCH_STATE_CHANGE, e => {
  console.log(Vтаблица.списоктаблица.событие_TYPE.SWITCH_STATE_CHANGE, e.col, e.row, e.checked);
});
```

## Getting Switch States via апи

1. Get switch states для все данные under a specific поле.

Note: The order corresponds к the original ввод records данные, не the таблица display row state values

```
getSwitchState(поле?: строка | число): массив
```

2. Get switch state для a specific cell.

```
getCellSwitchState(col: число, row: число): логический
```

## Setting Switch States via апи

Set switch state для a specific cell.

```
setCellSwitchState(col: число, row: число, checked: логический)
```

[Нажать к view complete пример](../../демонстрация/cell-тип/switch)
Through the above introduction, you have learned how к use switch cell тип для данные display в Vтаблица. We hope this helps.
