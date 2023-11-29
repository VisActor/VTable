# Lazy load data asynchronously
In order to reduce the pressure on the backend to request data, it is recommended to use asynchronous lazy loading of data.

## Basic usage
You need to customize a VTable.data.CachedDataSource data source instance. Set the get method in the instance parameters. This method accepts an index parameter, returns a Promise, and returns data when resolving.
```
const loadedData = {}; // Cache requested batch data
const dataSource = new VTable.data.CachedDataSource({
    get(index) {
      //Request 100 pieces of data in each batch 0-99 100-199 200-299
      const loadStartIndex = Math.floor(index / 100) * 100;
      // Determine whether it has been requested?
      if (!loadedData[loadStartIndex]) {
        const promiseObject = getRecordsWithAjax(loadStartIndex, 100); // return Promise Object
        loadedData[loadStartIndex] = promiseObject;
      }
      return loadedData[loadStartIndex].then((data) => {
        return data[index - loadStartIndex]; //Get the data corresponding to index in the batch data list
      });
    },
    length: 10000 //all records count
  });
```
## Limitations
- If you use VTable internal sorting, you need to obtain all the data before sorting, so this asynchronous is equivalent to invalidation. It is recommended that the backend implement sorting logic and the frontend only displays the sorting icon.

- If automatic column width widthMode:'autoWidth' is turned on or width:'auto' is set in columns, VTable also needs to obtain the value of each cell in the column to obtain the maximum content width, so it will also cause asynchronous failure.

## demo
Please refer to [demo](../../demo/performance/async-data)