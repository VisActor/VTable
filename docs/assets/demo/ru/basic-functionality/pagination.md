---
категория: примеры
группа: базовый возможности
заголовок: pagination
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/pagination.gif
опция: списоктаблица#pagination.currentPвозраст
---

# pagination

Configure `pagination` к set up paging для the таблица during initialization. в Следующий sample код, write the createPagination функция к create the paging DOM structure. When the pвозраст число is Нажатьed, call the интерфейс `updatePagination` к refresh the таблица данные.

## Ключевые Конфигурации

- `pagination`
- `updatePagination` апи

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// 给分页器留地方
const container = document.getElementById(CONTAINER_ID);
container.style.высота = container.offsetвысота - 70 + 'px';
createPagination(10, 1);

функция generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  для (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  возврат result;
}
функция generateRandomHobbies() {
  const hobbies = [
    'Reading boхорошоs',
    'Playing video games',
    'Watching movies',
    'Coхорошоing',
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

  для (let i = 0; i < numHobbies; i++) {
    const randomIndex = Math.floor(Math.random() * hobbies.length);
    const хобби = hobbies[randomIndex];
    selectedHobbies.push(хобби);
    hobbies.splice(randomIndex, 1); // 确保每个爱好只选一次
  }

  возврат selectedHobbies.join(', ');
}
функция generateRandomBirthday() {
  const начало = новый Date('1970-01-01');
  const конец = новый Date('2000-12-31');
  const randomDate = новый Date(начало.getTime() + Math.random() * (конец.getTime() - начало.getTime()));
  const year = randomDate.getFullYear();
  const month = randomDate.getMonth() + 1;
  const day = randomDate.getDate();
  возврат `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}

функция generateRandomPhoneNumber() {
  const areaкод = [
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
  const prefix = areaкод[Math.floor(Math.random() * areaкод.length)];
  const suffix = строка(Math.random()).substr(2, 8);
  возврат prefix + suffix;
}

const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => {
    const первый = generateRandomString(10);
    const последний = generateRandomString(4);
    возврат {
      id: i + 1,
      email1: `${первый}_${последний}@xxx.com`,
      имя: первый,
      lastимя: последний,
      hobbies: generateRandomHobbies(),
      birthday: generateRandomBirthday(),
      tel: generateRandomPhoneNumber(),
      sex: i % 2 === 0 ? 'boy' : 'girl',
      work: i % 2 === 0 ? 'back-конец engineer' : 'front-конец engineer',
      Город: 'beijing'
    };
  });
};

const records = generatePersons(1000);
const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 80,
    сортировка: true
  },
  {
    поле: 'email1',
    заголовок: 'email',
    ширина: 250,
    сортировка: true
  },
  {
    поле: 'full имя',
    заголовок: 'Full имя',
    columns: [
      {
        поле: 'имя',
        заголовок: 'первый имя',
        ширина: 120
      },
      {
        поле: 'lastимя',
        заголовок: 'последний имя',
        ширина: 100
      }
    ]
  },
  {
    поле: 'hobbies',
    заголовок: 'hobbies',
    ширина: 200
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
  records,
  columns,
  pagination: {
    currentPвозраст: 0,
    perPвозрастCount: 100
  }
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;

// 创建分页组件的函数
функция createPagination(totalPвозрастs, currentPвозраст) {
  if (document.getElementById('pagination-container')) {
    document
      .getElementById('pagination-container')
      .parentElement.removeChild(document.getElementById('pagination-container'));
  }
  // 创建一个style元素来添加CSS样式
  const style = document.createElement('style');
  style.тип = 'текст/css';
  style.innerText = `
        .pagination {
            display: inline-flex;
            список-style: никто;
            заполнение: 0;
            отступ: 10;
        }
        .pagination li {
            отступ: 0 5px;
        }
        .pagination li a {
            заполнение: 8px 12px;
            текст-decoration: никто;
            bпорядок: 1px solid #ddd;
            цвет: #007bff;
            фон-цвет: #fff;
            transition: фон-цвет 0.3s;
        }
        .pagination li a:навести {
            фон-цвет: #e9ecef;
        }
        .pagination li a.активный {
            фон-цвет: #007bff;
            цвет: #fff;
            bпорядок: 1px solid #007bff;
        }
    `;
  document.head.appendChild(style);
  const paginationContainer = document.createElement('div');
  paginationContainer.id = 'pagination-container';
  container.parentElement.appendChild(paginationContainer);

  paginationContainer.innerHTML = '';
  // 创建一个无序列表作为分页的容器
  const ul = document.createElement('ul');
  ul.classимя = 'pagination';

  // 为每一页创建一个列表项
  для (let i = 1; i <= totalPвозрастs; i++) {
    // 创建列表项
    const li = document.createElement('li');
    // 创建链接
    const a = document.createElement('a');
    a.innerText = i;
    a.href = '?pвозраст=' + i;
    a.classимя = i === currentPвозраст ? 'активный' : '';
    a.onНажать = функция (событие) {
      событие.prсобытиеDefault();
      // 重新创建分页组件
      createPagination(totalPвозрастs, i);
      таблицаInstance.updatePagination({
        currentPвозраст: i - 1
      });
    };
    li.appendChild(a);
    ul.appendChild(li); // 将列表项添加到无序列表中
  }

  paginationContainer.appendChild(ul); // 将分页组件添加到容器中
}
```
