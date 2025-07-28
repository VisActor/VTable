---
категория: примеры
группа: search
заголовок: Search компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-таблица.png
ссылка: search
---

# Search компонент

Search компонент

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard'
    };
    const dom = document.getElementById(CONTAINER_ID);
    таблицаInstance = новый Vтаблица.списоктаблица(dom, option);
    window['таблицаInstance'] = таблицаInstance;

    const search = новый Searchкомпонент({
      таблица: таблицаInstance,
      автоJump: true
    });
    window.search = search;

    const searchContainer = document.createElement('div');
    searchContainer.style.позиция = 'absolute';
    searchContainer.style.верх = '0';
    searchContainer.style.право = '0';
    searchContainer.style.backgroundColor = '#FFF';
    const ввод = document.createElement('ввод');
    searchContainer.appendChild(ввод);
    const result = document.createElement('span');
    result.innerText = '0/0';
    searchContainer.appendChild(result);
    const searchBtn = document.createElement('Кнопка');
    searchBtn.innerText = 'search';
    searchContainer.appendChild(searchBtn);
    const nextBtn = document.createElement('Кнопка');
    nextBtn.innerText = 'следующий';
    searchContainer.appendChild(nextBtn);
    const prevBtn = document.createElement('Кнопка');
    prevBtn.innerText = 'prev';
    searchContainer.appendChild(prevBtn);
    searchBtn.addсобытиесписокener('Нажать', () => {
      const searchResult = search.search(ввод.значение);
      result.innerText =
        searchResult.results.length === 0 ? '0/0' : `${searchResult.index + 1}/${searchResult.results.length}`;
    });
    prevBtn.addсобытиесписокener('Нажать', () => {
      const searchResult = search.prev();
      result.innerText =
        searchResult.results.length === 0 ? '0/0' : `${searchResult.index + 1}/${searchResult.results.length}`;
    });
    nextBtn.addсобытиесписокener('Нажать', () => {
      const searchResult = search.следующий();
      result.innerText =
        searchResult.results.length === 0 ? '0/0' : `${searchResult.index + 1}/${searchResult.results.length}`;
    });
    dom.appendChild(searchContainer);
  });
```
