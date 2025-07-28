---
category: examples
group: Календарь
title: Календарь
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/calendar-basic.png
link: calendar/introduction
option: Calendar#startDate
---

# Календарь

Основное использование календаря.

## Ключевые конфигурации

- `Calendar`

## Code demo

```javascript livedemo template=VTable
const unicColorPool = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray'];

const customEvents = [];
// add 20 list event
для (let i = 0; i < 20; i++) {
  customEvents.push({
    date: новый Date(Date.now() + Math.floor((Math.random() - 0.5) * 2629800000)),
    текст: `List Event ${i}`,
    id: `list-event-${i}`,
    тип: 'list',
    цвет: unicColorPool[i % unicColorPool.length]
  });
}

// add 10 bar event
для (let i = 0; i < 10; i++) {
  const randomDate = Date.now() + Math.floor((Math.random() - 0.5) * 2629800000);
  const randomDays = 86400000 * Math.floor((Math.random() - 0.5) * 5);
  customEvents.push({
    startDate: новый Date(randomDate - randomDays),
    endDate: новый Date(randomDate + randomDays),
    тип: 'bar',
    текст: `Bar Event ${i}`,
    id: `bar-event-${i}`,
    цвет: '#FFF',
    bgColor: unicColorPool[i % unicColorPool.length]
  });
}

const calendar = новый VTableCalendar.Calendar(document.getElementById(CONTAINER_ID), {
  tableOptions: {
    theme: {
      headerStyle: {
        цвет: args => {
          if (args.col === 0) {
            возврат 'red';
          }
          возврат '#000';
        }
      }
    }
  },
  customEvents
});

window['calendar'] = calendar;
```
