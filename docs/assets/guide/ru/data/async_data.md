# Lazy load данные asynchronously
в order к reduce the pressure на the backend к request данные, it is recommended к use asynchronous lazy загрузка из данные.

## базовый usвозраст
You need к пользовательскийize a Vтаблица.данные.CachedданныеSource данные source instance. Set the get method в the instance parameters. This method accepts an index параметр, returns a Promise, и returns данные when resolving.
```
const loadedданные = {}; // Cache requested batch данные
const данныеSource = новый Vтаблица.данные.CachedданныеSource({
    get(index) {
      //Request 100 pieces из данные в каждый batch 0-99 100-199 200-299
      const loadStartIndex = Math.floor(index / 100) * 100;
      // Determine whether it has been requested?
      if (!loadedданные[loadStartIndex]) {
        const promiseObject = getRecordsWithAjax(loadStartIndex, 100); // возврат Promise объект
        loadedданные[loadStartIndex] = promiseObject;
      }
      возврат loadedданные[loadStartIndex].then((данные) => {
        возврат данные[index - loadStartIndex]; //Get the данные corresponding к index в the batch данные список
      });
    },
    length: 10000 //все records count
  });
```
## Limitations
- If you use Vтаблица internal сортировкаing, you need к obtain все the данные before сортировкаing, so this asynchronous is equivalent к invalidation. It is recommended that the backend implement сортировкаing logic и the frontend only displays the сортировкаing иконка.

- If автоmatic column ширина ширинаMode:'автоширина' is turned на или ширина:'авто' is set в columns, Vтаблица also needs к obtain the значение из каждый cell в the column к obtain the maximum content ширина, so it will also cause asynchronous failure.

- Currently, if you double-Нажать the column interval line, there is a logic к calculate the column ширина, which will cause все данные к be requested, Вы можете configure изменение размера.disableDblНажатьавтоResizeColширина к true.

- If you право-Нажать на the header, the entire column will be selected, и the право-Нажать событие will organize все selected cells information, which will also cause все данные к be requested, so you need к configure событиеOptions.contextменюReturnAllSelectedCells к false.

## демонстрация
Please refer к [демонстрация](../../демонстрация/Производительность/async-данные)