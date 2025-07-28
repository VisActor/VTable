---
категория: примеры
группа: базовый возможности
заголовок: Pre сортировка
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/pre-сортировка.png
порядок: 3-2
ссылка: базовый_function/сортировка/список_сортировка
---

# Pre сортировка

в the case из large amounts из данные, the первый сортировкаing may take a long time, и pre-сортировкаing can be used к improve the Производительность из the сортировкаing функция.

## Ключевые Конфигурации

Set the pre-сортировкаed данные полеs и сортировка order through the `setсортировкаedIndexMap` method.

```
setсортировкаedIndexMap: (поле: полеDef, filedMap: IсортировкаedMапиtem) => void;

интерфейс IсортировкаedMапиtem {
  asc?: (число | число[])[];
  desc?: (число | число[])[];
  normal?: (число | число[])[];
}
```

## код демонстрация

```javascript liveдемонстрация template=vтаблица
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/test-демонстрация-данные/pre-сортировка.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'id',
        заголовок: 'ID',
        ширина: 80,
        сортировка: true
      },
      {
        поле: 'email1',
        заголовок: 'email(pre-сортировкаed)',
        ширина: 250,
        сортировка: true
      },
      {
        поле: 'hobbies',
        заголовок: 'hobbies(unсортировкаed)',
        ширина: 200,
        сортировка: true
      },
      {
        поле: 'birthday',
        заголовок: 'birthday',
        ширина: 120
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
      records: данные.данные,
      columns
    };
    const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;

    данные.сортировка.forEach(item => {
      таблицаInstance.setсортировкаedIndexMap(item.key, item.значение);
    });
  });
```
