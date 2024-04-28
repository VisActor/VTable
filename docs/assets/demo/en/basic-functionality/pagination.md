---
category: examples
group: Basic Features
title: pagination
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pagination.gif
option: ListTable#pagination.currentPage
---

# pagination

Configure `pagination` to set up paging for the table during initialization. In the following sample code, write the createPagination function to create the paging DOM structure. When the page number is clicked, call the interface `updatePagination` to refresh the table data.

## Key Configurations

- `pagination`
- `updatePagination` api

## Code demo

```javascript livedemo template=vtable
// 给分页器留地方
const container = document.getElementById(CONTAINER_ID);
container.style.height = container.offsetHeight - 70 + 'px';
createPagination(10, 1);

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
  const areaCode = [
    '130',
    '131',
    '132',
    '133',
    '134',
    '135',
    '136',
    '137',
    '138',
    '139',
    '150',
    '151',
    '152',
    '153',
    '155',
    '156',
    '157',
    '158',
    '159',
    '170',
    '176',
    '177',
    '178',
    '180',
    '181',
    '182',
    '183',
    '184',
    '185',
    '186',
    '187',
    '188',
    '189'
  ];
  const prefix = areaCode[Math.floor(Math.random() * areaCode.length)];
  const suffix = String(Math.random()).substr(2, 8);
  return prefix + suffix;
}

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => {
    const first = generateRandomString(10);
    const last = generateRandomString(4);
    return {
      id: i + 1,
      email1: `${first}_${last}@xxx.com`,
      name: first,
      lastName: last,
      hobbies: generateRandomHobbies(),
      birthday: generateRandomBirthday(),
      tel: generateRandomPhoneNumber(),
      sex: i % 2 === 0 ? 'boy' : 'girl',
      work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
      city: 'beijing'
    };
  });
};

const records = generatePersons(1000);
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80,
    sort: true
  },
  {
    field: 'email1',
    title: 'email',
    width: 250,
    sort: true
  },
  {
    field: 'full name',
    title: 'Full name',
    columns: [
      {
        field: 'name',
        title: 'First Name',
        width: 120
      },
      {
        field: 'lastName',
        title: 'Last Name',
        width: 100
      }
    ]
  },
  {
    field: 'hobbies',
    title: 'hobbies',
    width: 200
  },
  {
    field: 'birthday',
    title: 'birthday',
    width: 120
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
  records,
  columns,
  pagination: {
    currentPage: 0,
    perPageCount: 100
  }
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;

// 创建分页组件的函数
function createPagination(totalPages, currentPage) {
  if (document.getElementById('pagination-container')) {
    document
      .getElementById('pagination-container')
      .parentElement.removeChild(document.getElementById('pagination-container'));
  }
  // 创建一个style元素来添加CSS样式
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerText = `
        .pagination {
            display: inline-flex;
            list-style: none;
            padding: 0;
            margin: 10;
        }
        .pagination li {
            margin: 0 5px;
        }
        .pagination li a {
            padding: 8px 12px;
            text-decoration: none;
            border: 1px solid #ddd;
            color: #007bff;
            background-color: #fff;
            transition: background-color 0.3s;
        }
        .pagination li a:hover {
            background-color: #e9ecef;
        }
        .pagination li a.active {
            background-color: #007bff;
            color: #fff;
            border: 1px solid #007bff;
        }
    `;
  document.head.appendChild(style);
  const paginationContainer = document.createElement('div');
  paginationContainer.id = 'pagination-container';
  container.parentElement.appendChild(paginationContainer);

  paginationContainer.innerHTML = '';
  // 创建一个无序列表作为分页的容器
  const ul = document.createElement('ul');
  ul.className = 'pagination';

  // 为每一页创建一个列表项
  for (let i = 1; i <= totalPages; i++) {
    // 创建列表项
    const li = document.createElement('li');
    // 创建链接
    const a = document.createElement('a');
    a.innerText = i;
    a.href = '?page=' + i;
    a.className = i === currentPage ? 'active' : '';
    a.onclick = function (event) {
      event.preventDefault();
      // 重新创建分页组件
      createPagination(totalPages, i);
      tableInstance.updatePagination({
        currentPage: i - 1
      });
    };
    li.appendChild(a);
    ul.appendChild(li); // 将列表项添加到无序列表中
  }

  paginationContainer.appendChild(ul); // 将分页组件添加到容器中
}
```
