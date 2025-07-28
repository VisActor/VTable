# Vтаблица Usвозраст Issue: How к сортировка таблица contents по данные records?

## Question Description

The таблица is сортировкаed according к certain column данные. How к implement this requirement using Vтаблица?

## Solution

в Vтаблица, сортировкаing функция can be realized в three ways:

1. Implemented through UI в the таблица
   Configure the `сортировка` attribute в `columns`. It supports configuring `true` к use the по умолчанию сортировкаing rules. Вы можете also configure a функция к пользовательскийize the сортировкаing rules:

```javascript
// ......
columns: [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 120,
    сортировка: true
  },
  {
    поле: 'имя',
    заголовок: 'имя',
    ширина: 120,
    сортировка: (a, b) => {
      возврат a - b;
    }
  }
];
```

в this time, the сортировка Кнопка will be displayed на the header из the corresponding column:
![](/vтаблица/Часто Задаваемые Вопросы/6-0.png)
Нажать the сортировка Кнопка к switch among three states: no сортировкаing, ascending сортировка и descending сортировка.

2. по configuring `сортировкаState` в the initialization `option`
   After configuring the `сортировка` attribute в `columns`, Вы можете configure the `сортировкаState` attribute в `option`:

```javascript
сортировкаState:{
    поле: 'Категория',
    порядок: 'asc'
}
```

поле is the данные source corresponding к сортировкаing; order is the сортировкаing rule, which supports asc ascending order, desc descending order и normal non-сортировкаing.

3. Configure `сортировкаState` through `updateсортировкаState` апи
   After configuring the `сортировка` attribute в `columns`, Вы можете configure `сортировкаState` в любой time through the `updateсортировкаState` апи из the таблица instance к update the сортировкаing effect:

```javascript
instance.updateсортировкаState({
  поле: 'id',
  порядок: 'desc'
});
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-сортировка-w869fk)

![result](/vтаблица/Часто Задаваемые Вопросы/6-1.png)

## Quote

- [таблица сортировка демонстрация](https://visactor.io/vтаблица/демонстрация/базовый-функциональность/сортировка)
- [сортировка Tutorial](https://visactor.io/vтаблица/guide/базовый_function/сортировка/список_сортировка)
- [github](https://github.com/VisActor/Vтаблица)
