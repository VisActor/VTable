# 异步懒加载数据
为了减轻后端请求数据的压力，建议使用异步懒加载数据。

## 基本使用
需要自定义一个VTable.data.CachedDataSource数据源实例。实例参数中设置好get方法，该方法接受一个索引参数，返回一个Promise，resolve时返回数据。
```
const loadedData = {}; // 缓存已请求批次数据
const dataSource = new VTable.data.CachedDataSource({
    get(index) {
      // 每一批次请求100条数据 0-99 100-199 200-299
      const loadStartIndex = Math.floor(index / 100) * 100;
      // 判断是否已请求过？
      if (!loadedData[loadStartIndex]) {
        const promiseObject = getRecordsWithAjax(loadStartIndex, 100); // return Promise Object
        loadedData[loadStartIndex] = promiseObject;
      }
      return loadedData[loadStartIndex].then((data) => {
        return data[index - loadStartIndex]; //获取批次数据列表中的index对应数据
      });
    },
    length: 10000 //all records count
  });
```
## 局限性
- 如果使用VTable内部排序的话，需要获取到全部数据才能排序，所以这个异步相当于失效，建议后端实现排序逻辑，前端仅展示排序图标。

- 如果开启自动列宽widthMode:'autoWidth'或者columns中设置了width:'auto', VTable也需要获取到列每个单元格的值才能取到最大内容宽度，所以也会导致异步失效。

## demo
可参考[demo](../../demo/performance/async-data)