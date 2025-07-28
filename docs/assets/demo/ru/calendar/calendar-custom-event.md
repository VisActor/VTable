---
категория: примеры
группа: календарь
заголовок: календарь пользовательский событие
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/календарь-пользовательский-событие.gif
ссылка: календарь/introduction
опция: календарь#startDate
---

# календарь пользовательский событие

пользовательский событие в календарь.

## Ключевые Конфигурации

- `addпользовательскийсобытие` Add пользовательский событие
- `removeпользовательскийсобытие` Remove пользовательский событие

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const unicColorPool = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray'];

const пользовательскийсобытиеs = [];
const container = document.getElementById(CONTAINER_ID);
const календарь = новый Vтаблицакалендарь.календарь(container, {
  таблицаOptions: {
    тема: {
      headerStyle: {
        цвет: args => {
          if (args.col === 0) {
            возврат 'red';
          }
          возврат '#000';
        }
      }
    }
  }
});

const информация = document.createElement('div');
информация.innerText = 'выбрать Date и Нажать Кнопка';
информация.style.позиция = 'absolute';
информация.style.верх = '10px';
информация.style.право = '210px';
информация.style.zIndex = '100';
информация.style.цвет = '#999';
container?.appendChild(информация);

const bottomAddКнопка = document.createElement('Кнопка');
bottomAddКнопка.innerText = 'Add событие';
bottomAddКнопка.style.позиция = 'absolute';
bottomAddКнопка.style.верх = '10px';
bottomAddКнопка.style.право = '110px';
bottomAddКнопка.style.zIndex = '100';
container?.appendChild(bottomAddКнопка);

let списоксобытиеIndex = 0;
let barсобытиеIndex = 0;
bottomAddКнопка.addсобытиесписокener('Нажать', () => {
  const selectedDates = календарь.selectedDate;
  if (selectedDates.length === 0) {
    возврат;
  }

  if (selectedDates.length > 1) {
    const startDate = selectedDates[0].date;
    const endDate = selectedDates[selectedDates.length - 1].date;
    календарь.addпользовательскийсобытие({
      id: `bar-событие-${barсобытиеIndex}`,
      startDate,
      endDate,
      текст: `Bar событие ${barсобытиеIndex}`,
      тип: 'bar',
      bgColor: unicColorPool[barсобытиеIndex % unicColorPool.length],
      цвет: '#fff'
    });
    barсобытиеIndex++;
  } else {
    const date = selectedDates[0].date;
    календарь.addпользовательскийсобытие({
      id: `список-событие-${списоксобытиеIndex}`,
      date,
      текст: `список событие ${списоксобытиеIndex}`,
      тип: 'список',
      цвет: unicColorPool[списоксобытиеIndex % unicColorPool.length]
    });
    списоксобытиеIndex++;
  }
});

const bottomDeleteКнопка = document.createElement('Кнопка');
bottomDeleteКнопка.innerText = 'Delete событие';
bottomDeleteКнопка.style.позиция = 'absolute';
bottomDeleteКнопка.style.верх = '10px';
bottomDeleteКнопка.style.право = '10px';
bottomDeleteКнопка.style.zIndex = '100';
container?.appendChild(bottomDeleteКнопка);
bottomDeleteКнопка.addсобытиесписокener('Нажать', () => {
  const selectedDates = календарь.selectedDate;
  if (selectedDates.length === 0) {
    возврат;
  }

  const idSet = новый Set();
  selectedDates.map(данные => {
    календарь.getCellпользовательскийсобытиеByLocation(данные.col, данные.row).map(событие => {
      событие.id && idSet.add(событие.id);
    });
  });

  календарь.removeпользовательскийсобытиеs(массив.от(idSet));
});

window['календарь'] = календарь;
```
