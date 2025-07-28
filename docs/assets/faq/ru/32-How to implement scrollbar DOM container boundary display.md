---
заголовок: Vтаблица usвозраст issue: How к implement scrollbar DOM container boundary display</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к implement scrollbar DOM container boundary display</br>


## Problem description

When the высота из the таблица content is low, the прокрутка bar will не display well в the таблица. I hope к display the прокрутка bar в the низ из the canvas.</br>


## Solution

Вы можете configure the `barToSide `property из the scrollbar в the тема к configure the display позиция из the scrollbar:</br>
*  true: The scrollbar is displayed в the edge из the container (canvas)</br>
*  false: The прокрутка bar is displayed в the edge из the таблица area</br>


## код пример

```
const option = {
  records,
  columns,
  тема: Vтаблица.темаs.по умолчанию.extends({
    scrollStyle: {
      barToSide: true
    }
  })
};

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);</br>
```
## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WKwwbraQsovzZVxnSEMcUjtSnZc.gif' alt='' ширина='1144' высота='724'>

Full sample код (Вы можете try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсписок-таблица-tree)):</br>
```
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
  const areaкод = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '170', '176', '177', '178', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
  const prefix = areaкод[Math.floor(Math.random() * areaкод.length)];
  const suffix = строка(Math.random()).substr(2, 8);
  возврат prefix + suffix;
}

const generatePersons = (count) => {
  возврат массив.от(новый массив(count)).map((_, i) => {
    const первый=generateRandomString(10);
    const последний=generateRandomString(4);
    возврат {
    id: i+1,
    email1: `${первый}_${последний}@xxx.com`,
    имя: первый,
    lastимя: последний,
    hobbies: generateRandomHobbies(),
    birthday: generateRandomBirthday(),
    tel: generateRandomPhoneNumber(),
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' : 'front-конец engineer',
    Город: 'beijing',
  }});
};

const records = generatePersons(1);
const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 80,
    сортировка: true,
  },
  {
    поле: 'email1',
    заголовок: 'email',
    ширина: 250,
    сортировка: false,
  },
  {
    поле: 'full имя',
    заголовок: 'Full имя',
    columns: [
      {
        поле: 'имя',
        заголовок: 'первый имя',
        ширина: 120,
      },
      {
        поле: 'lastимя',
        заголовок: 'последний имя',
        ширина: 100,
      },
    ],
  },
  {
    поле: 'hobbies',
    заголовок: 'hobbies',
    ширина: 200,
  },
  {
    поле: 'birthday',
    заголовок: 'birthday',
    ширина: 120,
  },
  {
    поле: 'sex',
    заголовок: 'sex',
    ширина: 100,
  },
  {
    поле: 'tel',
    заголовок: 'telephone',
    ширина: 150,
  },
  {
    поле: 'work',
    заголовок: 'job',
    ширина: 200,
  },
  {
    поле: 'Город',
    заголовок: 'Город',
    ширина: 150,
  },
];
const option = {
  records,
  columns,
  тема: Vтаблица.темаs.по умолчанию.extends({
    scrollStyle: {
      barToSide: true
    }
  })
};

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;</br>
```
## Related Documents

Related апи: https://www.visactor.io/vтаблица/option/списоктаблица#тема.scrollStyle.barToSide</br>
github：https://github.com/VisActor/Vтаблица</br>



