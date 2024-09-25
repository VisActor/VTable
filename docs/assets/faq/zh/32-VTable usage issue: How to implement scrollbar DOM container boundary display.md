---
title: 10. VTable使用问题：如何实现滚动条贴DOM容器边界展示</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何实现滚动条贴DOM容器边界展示</br>


## 问题描述

在表格内容高度较低时，滚动条在表格内显示会效果不好，希望将滚动条显示在canvas底部。</br>


## 解决方案 

主题中可以配置滚动条的`barToSide`属性，配置滚动条的显示位置：</br>
*  true: 滚动条显示在容器（canvas）边缘</br>
*  false:  滚动条显示在表格区域边缘</br>


## 代码示例  

```
const option = {
  records,
  columns,
  theme: VTable.themes.DEFAULT.extends({
    scrollStyle: {
      barToSide: true
    }
  })
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);</br>
```
## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/T1VKbEdFLowgKIxhrOncJPJQnTb.gif' alt='' width='1144' height='724'>

完整示例代码（可以粘贴到 [编辑器](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree) 上尝试一下）：</br>
```
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function generateRandomHobbies() {
  const hobbies = [
    'Reading books',
    'Playing video games',
    'Watching movies',
    'Cooking',
    'Hiking',
    'Traveling',
    'Photography',
    'Playing musical instruments',
    'Gardening',
    'Painting',
    'Writing',
    'Swimming'
  ];

  const numHobbies = Math.floor(Math.random() * 3) + 1; // 生成 1-3 之间的随机整数
  const selectedHobbies = [];

  for (let i = 0; i < numHobbies; i++) {
    const randomIndex = Math.floor(Math.random() * hobbies.length);
    const hobby = hobbies[randomIndex];
    selectedHobbies.push(hobby);
    hobbies.splice(randomIndex, 1); // 确保每个爱好只选一次
  }

  return selectedHobbies.join(', ');
}
function generateRandomBirthday() {
  const start = new Date('1970-01-01');
  const end = new Date('2000-12-31');
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const year = randomDate.getFullYear();
  const month = randomDate.getMonth() + 1;
  const day = randomDate.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}

function generateRandomPhoneNumber() {
  const areaCode = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '170', '176', '177', '178', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
  const prefix = areaCode[Math.floor(Math.random() * areaCode.length)];
  const suffix = String(Math.random()).substr(2, 8);
  return prefix + suffix;
}

const generatePersons = (count) => {
  return Array.from(new Array(count)).map((_, i) => {
    const first=generateRandomString(10);
    const last=generateRandomString(4);
    return {
    id: i+1,
    email1: `${first}_${last}@xxx.com`,
    name: first,
    lastName: last,
    hobbies: generateRandomHobbies(),
    birthday: generateRandomBirthday(),
    tel: generateRandomPhoneNumber(),
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing',
  }});
};

const records = generatePersons(1);
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80,
    sort: true,
  },
  {
    field: 'email1',
    title: 'email',
    width: 250,
    sort: false,
  },
  {
    field: 'full name',
    title: 'Full name',
    columns: [
      {
        field: 'name',
        title: 'First Name',
        width: 120,
      },
      {
        field: 'lastName',
        title: 'Last Name',
        width: 100,
      },
    ],
  },
  {
    field: 'hobbies',
    title: 'hobbies',
    width: 200,
  },
  {
    field: 'birthday',
    title: 'birthday',
    width: 120,
  },
  {
    field: 'sex',
    title: 'sex',
    width: 100,
  },
  {
    field: 'tel',
    title: 'telephone',
    width: 150,
  },
  {
    field: 'work',
    title: 'job',
    width: 200,
  },
  {
    field: 'city',
    title: 'city',
    width: 150,
  },
];
const option = {
  records,
  columns,
  theme: VTable.themes.DEFAULT.extends({
    scrollStyle: {
      barToSide: true
    }
  })
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;</br>
```
## 相关文档

相关api：https://www.visactor.io/vtable/option/ListTable#theme.scrollStyle.barToSide</br>
github：https://github.com/VisActor/VTable</br>



