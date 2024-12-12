---
category: examples
group: performace
title: Async Lazy Load Data
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/asyncData.gif
link: data/async_data
---

# Async Lazy Load Data

In order to reduce the pressure on the backend to request data, you can use this method to lazy load data asynchronously.

Note: If you use VTable internal sorting, you need to obtain all the data before sorting, so this asynchronous is equivalent to invalidation. It is recommended that the backend implement sorting logic and the frontend only displays the sorting icon.

In addition, if automatic column width widthMode:'autoWidth' is turned on or width:'auto' is set in columns, VTable also needs to obtain the value of each cell in the column to obtain the maximum content width, so it will also cause asynchronous failure.

## Key Configurations

- dataSource custom implementation of data acquisition logic

## Code demo

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
