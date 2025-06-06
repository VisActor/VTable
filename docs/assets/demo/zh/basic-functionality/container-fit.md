---
category: examples
group: Basic Features
title: 容器适配 - 表格框架适应容器大小
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-adaptive.png
order: 3-6
link: basic_function/container_fit
option: ListTable#containerFit
---

# 容器适配 - 表格框架适应容器大小

containerFit 配置允许表格框架适应容器大小，同时保持行高和列宽的原始尺寸。这与自适应模式不同，自适应模式会拉伸内容以填充容器。

## 关键配置

- `containerFit: { width: true, height: true }`

## 代码演示

```javascript livedemo template=vtable
let tableInstance;

const records = [
  { id: 1, name: '张三', age: 25, city: '北京' },
  { id: 2, name: '李四', age: 30, city: '上海' },
  { id: 3, name: '王五', age: 35, city: '广州' },
  { id: 4, name: '赵六', age: 40, city: '深圳' },
  { id: 5, name: '孙七', age: 45, city: '成都' },
  { id: 6, name: '周八', age: 50, city: '重庆' },
  { id: 7, name: '吴九', age: 55, city: '西安' },
  { id: 8, name: '郑十', age: 60, city: '长沙' },
  { id: 9, name: '孙十一', age: 65, city: '南京' },
  { id: 10, name: '周十二', age: 70, city: '杭州' },
  { id: 11, name: '吴十三', age: 75, city: '武汉' },
  { id: 12, name: '郑十四', age: 80, city: '郑州' },
  { id: 13, name: '孙十五', age: 85, city: '青岛' }
];

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 60
  },
  {
    field: 'name',
    title: '姓名',
    width: 100
  },
  {
    field: 'age',
    title: '年龄',
    width: 80
  },
  {
    field: 'city',
    title: '城市',
    width: 120
  }
];

const container = document.getElementById(CONTAINER_ID);
container.style.width = '800px';
container.style.height = '500px';
container.style.border = '2px solid #333';

const option = {
  records,
  columns,
  containerFit: {
    width: true,
    height: true
  },
  theme: {
    frameStyle: { borderLineWidth: 2, borderColor: 'red' },
    scrollStyle: { barToSide: true }
  }
};

tableInstance = new VTable.ListTable(container, option);
window['tableInstance'] = tableInstance;
```
