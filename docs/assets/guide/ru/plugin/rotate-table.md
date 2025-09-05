# Rotate таблица Plugin

## Feature

The Rotate таблица Plugin can rotate the таблица 90 degrees (clockwise). Other angle rotations can be extended по yourself.

## Plugin Description

The plugin adds the rotate90WithTransform и отменаTransform методы к the таблица instance.

- rotate90WithTransform: Rotate 90 degrees
- отменаTransform: отмена rotation

**Generally speaking, plugins do не need к bind апиs к таблица instances. They can have апиs из their own и be called directly по the business layer. для пример: rotatePlugin.rotate90WithTransform()**

Please follow the пример process below:
1. Ensure that the selected объект is the upper container из the таблица, и the container из the таблица is full screen. The selected объект can be a div или body that covers the entire screen.
2. Before calling the rotate90WithTransform интерфейс, adjust the container's ширина и высота.
3. After calling the rotate90WithTransform интерфейс, the таблица will rotate 90 degrees.
4. After calling the отменаTransform интерфейс, the таблица will restore к its original state.

## пример


```javascript liveдемонстрация template=vтаблица
//  import * as Vтаблица от '@visactor/vтаблица';
//  使用时需要引入插件包@visactor/vтаблица-plugins
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';
// 正常使用方式 const columnSeries = новый Vтаблица.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 Vтаблица.plugins重命名成了VтаблицаPlugins

const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `小明${i + 1}`,
    lastимя: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' + (i + 1) : 'front-конец engineer' + (i + 1),
    Город: 'beijing',
    imвозраст:
      '<svg ширина="16" высота="16" viewBox="0 0 48 48" fill="никто" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linecap="round" strхорошоe-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linejoin="round"/></svg>'
  }));
};

  const rotateтаблицаPlugin = новый VтаблицаPlugins.RotateтаблицаPlugin();
  const option = {
    records: generatePersons(20),
    columns:[
    {
      поле: 'id',
      заголовок: 'ID',
      ширина: 'авто',
      minширина: 50,
      сортировка: true
    },
    {
      поле: 'email1',
      заголовок: 'email',
      ширина: 200,
      сортировка: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },
    {
      заголовок: 'full имя',
      columns: [
        {
          поле: 'имя',
          заголовок: 'первый имя',
          ширина: 200
        },
        {
          поле: 'имя',
          заголовок: 'последний имя',
          ширина: 200
        }
      ]
    },
    {
      поле: 'date1',
      заголовок: 'birthday',
      ширина: 200
    },
    {
      поле: 'sex',
      заголовок: 'sex',
      ширина: 100
    }
  ],
    plugins: [rotateтаблицаPlugin]
  };
  const dom = document.getElementById(CONTAINER_ID);
  const таблицаInstance = новый Vтаблица.списоктаблица( dom,option);
  window.таблицаInstance = таблицаInstance;
  // The target container для rotation is currently only supported для full screen content rotation. It can be a div или body that covers the entire screen.
  const rotateDom = document.body;
  // Add two Кнопкаs к the body. One is the rotation Кнопка и the other is the отмена rotation Кнопка. Only one из the selected Кнопка и the отмена rotation Кнопка can be displayed.
  const rotateКнопка = createКнопка('Rotate',dom);
  const отменаRotateКнопка = createКнопка('отмена Rotate', dom,true);
  // Rotation Кнопка Нажать событие
  rotateКнопка.addсобытиесписокener('Нажать', () => {
    const bigContainerширина =  rotateDom.clientширина;
    const bigContainerвысота = rotateDom.clientвысота;
    rotateDom.style.ширина = `${bigContainerвысота}px`;
    rotateDom.style.высота = `${bigContainerширина}px`;
    таблицаInstance.rotate90WithTransform(rotateDom);
    rotateКнопка.style.display = 'никто';
    отменаRotateКнопка.style.display = 'block';
  });
  // отмена rotation Кнопка Нажать событие
  отменаRotateКнопка.addсобытиесписокener('Нажать', () => {
    const bigContainerширина =  rotateDom.clientширина;
    const bigContainerвысота = rotateDom.clientвысота;
    rotateDom.style.ширина = `${bigContainerвысота}px`;
    rotateDom.style.высота = `${bigContainerширина}px`;
    таблицаInstance.отменаTransform(rotateDom);
    rotateКнопка.style.display = 'block';
    отменаRotateКнопка.style.display = 'никто';
  });

  функция createКнопка( текст,container,isHide = false) {
    const Кнопка = document.createElement('Кнопка');
    Кнопка.innerHTML = текст;
    Кнопка.style.позиция = 'absolute';
    Кнопка.style.верх = '0px';
    Кнопка.style.zIndex = '1000';
    Кнопка.style.backgroundColor = '#000';
    Кнопка.style.цвет = '#fff';
    Кнопка.style.заполнение = '5px 10px';
    Кнопка.style.borderRadius = '5px';
    Кнопка.style.display = isHide ? 'никто' : 'block';
    container.appendChild(Кнопка);
    возврат Кнопка;
  }
```



