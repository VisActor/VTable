# Кнопка Cell тип

Кнопка cell тип is suiтаблица для providing Кнопка interactions в таблицаs, allowing users к Нажать Кнопкаs для specific operations. The interactive capability provided по Кнопка cell тип is widely used в many applications.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/Кнопка.png)

## Кнопка-specific Configuration Options

The Кнопка cell тип has Следующий specific configuration options:

1. `отключить`: Whether the Кнопка can be отключен для Нажатьing, по умолчанию значение is false. Supports функция configuration, can be different для different cells.
2. `текст`: Кнопка текст, supports функция configuration. If не configured, the Кнопка текст will be the значение corresponding к the `поле`.

пример:

```javascript
{
  поле: 'Кнопка',
  cellType: 'Кнопка',
  текст: 'выбрать'
}
```

## Кнопка Нажать событие

When the Кнопка is Нажатьed, it triggers the `Vтаблица.списоктаблица.событие_TYPE.Кнопка_Нажать` событие.

```javascript
instance.на(Vтаблица.списоктаблица.событие_TYPE.Кнопка_Нажать, e => {
  console.log(Vтаблица.списоктаблица.событие_TYPE.Кнопка_Нажать, e.col, e.row);
});
```

[Нажать к view complete пример](../../демонстрация/cell-тип/Кнопка)
Through the above introduction, you have learned how к use Кнопка cell тип для данные display в Vтаблица. We hope this helps.
