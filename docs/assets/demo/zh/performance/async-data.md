---
category: examples
group: performace
title: 异步懒加载数据源
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/asyncData.gif
link: data/async_data
---

# 异步懒加载数据

为了减轻后端请求数据的压力，可以使用该方式来异步懒加载数据。

注意：如果使用 VTable 内部排序的话，需要获取到全部数据才能排序，所以这个异步相当于失效，建议后端实现排序逻辑，前端仅展示排序图标。

另外，如果开启自动列宽 widthMode:'autoWidth'或者 columns 中设置了 width:'auto', VTable 也需要获取到列每个单元格的值才能取到最大内容宽度，所以也会导致异步失效。

## 关键配置

- dataSource 自定义实现获取数据逻辑

## 代码演示

```javascript livedemo template=vtable
const generatePersons = i => {
  return {
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
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
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('getRecordsWithAjax', startIndex, num);
      const records = [];
      for (let i = 0; i < num; i++) {
        records.push(generatePersons(startIndex + i));
      }
      resolve(records);
    }, 500);
  });
};

// create DataSource
const loadedData = {};
const dataSource = new VTable.data.CachedDataSource({
  get(index) {
    // 每一批次请求100条数据 0-99 100-199 200-299
    const loadStartIndex = Math.floor(index / 100) * 100;
    // 判断是否已请求过？
    if (!loadedData[loadStartIndex]) {
      const promiseObject = getRecordsWithAjax(loadStartIndex, 100); // return Promise Object
      loadedData[loadStartIndex] = promiseObject;
    }
    return loadedData[loadStartIndex].then(data => {
      return data[index - loadStartIndex]; //获取批次数据列表中的index对应数据
    });
  },
  length: 10000 //all records count
});
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 120
    // sort: true
  },
  {
    field: 'email1',
    title: 'email',
    width: 200
    // sort: true
  },
  {
    title: 'full name',
    columns: [
      {
        field: 'name',
        title: 'First Name',
        width: 200
      },
      {
        field: 'name',
        title: 'Last Name',
        width: 200
      }
    ]
  },
  {
    field: 'date1',
    title: 'birthday',
    width: 200
  },
  {
    field: 'sex',
    title: 'sex',
    width: 100
  },
  {
    field: 'tel',
    title: 'telephone',
    width: 150
  },
  {
    field: 'work',
    title: 'job',
    width: 200
  },
  {
    field: 'city',
    title: 'city',
    width: 150
  }
];
const option = {
  columns
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
tableInstance.dataSource = dataSource;
window['tableInstance'] = tableInstance;
```
