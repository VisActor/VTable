---
категория: примеры
группа: performace
заголовок: Async Lazy Load данные
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/asyncданные.gif
ссылка: данные/async_данные
---

# Async Lazy Load данные

в order к reduce the pressure на the backend к request данные, Вы можете use this method к lazy load данные asynchronously.

Note: If you use Vтаблица internal сортировкаing, you need к obtain все the данные before сортировкаing, so this asynchronous is equivalent к invalidation. It is recommended that the backend implement сортировкаing logic и the frontend only displays the сортировкаing иконка.

в addition, if автоmatic column ширина ширинаMode:'автоширина' is turned на или ширина:'авто' is set в columns, Vтаблица also needs к obtain the значение из каждый cell в the column к obtain the maximum content ширина, so it will also cause asynchronous failure.

## Ключевые Конфигурации

- данныеSource пользовательский implementation из данные acquisition logic

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const generatePersons = i => {
  возврат {
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `小明${i + 1}`,
    lastимя: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' : 'front-конец engineer',
    Город: 'beijing'
  };
};

/**
 * 模拟接口请求数据
 * @param startIndex
 * @param num
 * @returns
 */
const getRecordsWithAjax = (startIndex, num) => {
  // console.log('getRecordsWithAjax', startIndex, num);
  возврат новый Promise(resolve => {
    setTimeout(() => {
      console.log('getRecordsWithAjax', startIndex, num);
      const records = [];
      для (let i = 0; i < num; i++) {
        records.push(generatePersons(startIndex + i));
      }
      resolve(records);
    }, 500);
  });
};

// create данныеSource
const loadedданные = {};
const данныеSource = новый Vтаблица.данные.CachedданныеSource({
  get(index) {
    // 每一批次请求100条数据 0-99 100-199 200-299
    const loadStartIndex = Math.floor(index / 100) * 100;
    // 判断是否已请求过？
    if (!loadedданные[loadStartIndex]) {
      const promiseObject = getRecordsWithAjax(loadStartIndex, 100); // возврат Promise объект
      loadedданные[loadStartIndex] = promiseObject;
    }
    возврат loadedданные[loadStartIndex].then(данные => {
      возврат данные[index - loadStartIndex]; //获取批次数据列表中的index对应数据
    });
  },
  length: 10000 //все records count
});
const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 120
    // сортировка: true
  },
  {
    поле: 'email1',
    заголовок: 'email',
    ширина: 200
    // сортировка: true
  },
  {
    заголовок: 'full имя',
    columns: [
      {
        поле: 'имя',
        заголовок: 'первый имя',
        ширина: 200
      },
      {
        поле: 'имя',
        заголовок: 'последний имя',
        ширина: 200
      }
    ]
  },
  {
    поле: 'date1',
    заголовок: 'birthday',
    ширина: 200
  },
  {
    поле: 'sex',
    заголовок: 'sex',
    ширина: 100
  },
  {
    поле: 'tel',
    заголовок: 'telephone',
    ширина: 150
  },
  {
    поле: 'work',
    заголовок: 'job',
    ширина: 200
  },
  {
    поле: 'Город',
    заголовок: 'Город',
    ширина: 150
  }
];
const option = {
  columns
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
таблицаInstance.данныеSource = данныеSource;
window['таблицаInstance'] = таблицаInstance;
```
