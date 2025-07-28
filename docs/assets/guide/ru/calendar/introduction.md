# календарь

A календарь is a common таблица used к display dates и corresponding schedules. Vтаблица-календарь is a календарь компонент developed based на the Vтаблица компонент. Users can quickly implement a календарь tool или пользовательскийize related business functions based на the powerful capabilities из Vтаблица. Compared с traditional календарьs, Vтаблица-календарь has Следующий advantвозрастs:

- Stepless scrolling функция, supports scrolling across months и years

- Users familiar с Vтаблица апи can quickly get started с пользовательский functions

## базовый configuration из календарь

When creating a календарь, Вы можете pass в the configuration corresponding к the календарь day:

```js
import { календарь } от '@visactor/vтаблица-календарь';

const календарь = новый Vтаблицакалендарь.календарь(domContainer, options);
```

Among them, option supports Следующий attributes

| Attribute | тип | Description |
| --- | --- | --- |
| startDate | Date | календарь начало date |
| endDate | Date | календарь конец date |
| currentDate | Date | календарь day displayed |
| rangeDays | число | The range из days displayed в the календарь (if startDate&endDate is не configured, the dates из rangeDays before и after currentDate will be taken as startDate&endDate, the по умолчанию is 90 days) |
| dayTitles | строка[] | календарь title (can be replaced с different languвозрастs) |
| пользовательскийсобытиеOptions | IпользовательскийсобытиеOptions | пользовательский schedule configuration |
| пользовательскийсобытиеs | Iпользовательскийсобытие[] | массив из пользовательский schedules |
| таблицаOptions | списоктаблицаConstructorOptions | календарь таблица configuration (the configuration here will be passed к the corresponding Vтаблица instance для deep пользовательскийization) |

The свойства configured в `таблицаOptions` can be referred к [Vтаблица configuration](../../option/списоктаблица) для further configuration из the таблица. для пример, if you want Saturday к be displayed в blue и Sunday в red в the календарь title, Вы можете use Следующий configuration:

```javascript liveдемонстрация template=vтаблица
const календарьInstance = новый Vтаблицакалендарь.календарь(document.getElementById(CONTAINER_ID), {
  таблицаOptions: {
    тема: {
      headerStyle: {
        цвет: args => {
          if (args.col === 0) {
            возврат 'red'; 
          } else if (args.col === 6) {
            возврат 'blue';
          }
          возврат '#000';
        }
      }
    }
  },
});
window['календарьInstance'] = календарьInstance;
```

## пользовательскийized календарь

календарь supports two ways к пользовательскийize the календарь, one для a single day и one для a multi-day schedule. The configuration из пользовательский schedule is as follows:

```ts
export интерфейс Iпользовательскийсобытие {
  тип: 'список' | 'bar'; // Schedule тип, список is a schedule within a single day, bar is a schedule across multiple days
  id: строка; // Schedule id, used к distinguish different schedules

  startDate?: Date; // Schedule начало date (для schedules across multiple days)
  endDate?: Date; // Schedule конец date (для schedules across multiple days)
  date?: Date; // Schedule date (для schedules within a single day)

  текст: строка;
  цвет?: строка; // текст цвет
  bgColor?: строка; // bar фон цвет

  пользовательскийInfo?: любой; // user пользовательский данные
}
```

пользовательский schedules can be configured during initialization, или dynamically added, deleted, и updated through the апи.

Initialization configuration:
```ts
const календарь = новый календарь(document.getElementById(CONTAINER_ID), {
  пользовательскийсобытиеs: [
    {
      date: новый Date(2024, 9, 23),
      текст: 'событие A',
      id: 'событие A',
      тип: 'список',
      цвет: '#f99'
    },
    {
      id: 'событие B',
      startDate: новый Date(2024, 9, 21),
      endDate: новый Date(2024, 9, 23),
      текст: 'событие B',
      тип: 'bar',
      bgColor: '#f99',
      цвет: '#fff'
    }
  ]
});
```

Dynamic addition, deletion, update:
```ts
// Add
календарь.addпользовательскийсобытие({
  id: 'событие C',
  startDate: новый Date(2024, 9, 22),
  endDate: новый Date(2024, 10, 4),
  текст: 'событие C',
  тип: 'bar',
  bgColor: '#9f9',
  цвет: '#fff'
  });

// Delete
календарь.removeпользовательскийсобытие('событие C');

// Update
календарь.updateпользовательскийсобытие({
  id: 'событие C', // Update по id
  startDate: новый Date(2024, 9, 22),
  endDate: новый Date(2024, 9, 30),
});
```

пользовательскийized schedule апиs
| методы | Parameters | Description |
| --- | --- | --- |
| addпользовательскийсобытие | Iпользовательскийсобытие | Add a пользовательский schedule |
| addпользовательскийсобытиеs | Iпользовательскийсобытие[] | Add пользовательский schedules в batches |
| removeпользовательскийсобытие | строка | Delete пользовательский schedules |
| removeпользовательскийсобытиеs | строка[] | Delete пользовательский schedules в batches |
| updateпользовательскийсобытие | Iпользовательскийсобытие | Update пользовательский schedules |
| updateпользовательскийсобытиеs | Iпользовательскийсобытие[] | Update пользовательский schedules в batches |

## календарь событиеs

календарь supports Следующий событиеs:

| событие имя | Description |
| --- | --- |
| календарь_date_Нажать | Triggered when Нажатьing на a календарь date |
| selected_date | Triggered when a date is selected |
| selected_date_clear | Triggered when a date is unselected |
| drag_select_date_end | Triggered when dragging к выбрать a date ends |
| календарь_пользовательский_событие_Нажать | Triggered when Нажатьing на a пользовательский schedule |

If further событие processing is обязательный, все событиеs из Vтаблица can be monitored through `календарьInstance.таблица.на()`.