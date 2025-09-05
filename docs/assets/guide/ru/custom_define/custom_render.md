# пользовательский Rendering

в the поле из данные analysis, к present данные more intuitively, we often use графикs или grids. в некоторые specific scenarios, we wish к add more expressive и personalized display effects к certain cells из a таблица. в this time, the пользовательский rendering функция из таблица cell content becomes particularly important. Through пользовательский rendering из cell content, we can achieve Следующий types из scenario needs:

1. Rich текст display. Display текст с various styles и макетs within a cell, making it easy для users к quickly grasp key information.

2. Mixed текст и imвозраст display. Display imвозрастs или иконкаs в cells according к данные, making the данные more intuitive.

3. Graphical данные display. Display данные в a graphical way, such as circles, rectangles, etc., making данные comparison и analysis more intuitive.

4. пользовательский cell макет. Arrange пользовательский rendering elements в любой макет within a cell к meet special макет needs.

в the Vтаблица library, we can achieve the above scenario needs по defining `пользовательский rendering из таблица cell content`. Because it is more flexible, it can be пользовательскийized according к business данные, but the cost к the integrator is also higher, requiring their own calculation из positions, etc. (While drawing пользовательский content, if you want к draw the по умолчанию content according к the internal logic из Vтаблица, please set renderDefault к true.)

## Case Analysis

следующий, we will explain the implementation process using the effect shown в Следующий figure as an пример.
![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170d.png)

### Preparing данные:

The body данные cell part из the таблица в the figure above has two rows, corresponding к the two pieces из данные в our records.

```
    records:[
      {
        'тип': 'important',
        "urgency": ['crisis','urgent problem','tasks that must be completed within a limited time'],
        "not_urgency": ['prсобытиеive measures','development relationship','identify новый development opportunities','establish long-term goals'],
      },
      {
        'тип': 'не\nimportant',
        "urgency": ['Receive visitors','Certain calls, reports, letters, etc','Urgent matters','Public activities'],
        "not_urgency": ['Trivial busy work','некоторые letters','некоторые phone calls','Time-killing activities','некоторые pleasant activities'],
      },
    ],
```

### Content Decomposition

Let's analyze the composition из каждый cell's display content:

- Title
- список из items
- Title фон rectangle
- список symbols (circle, rectangle, star)

Therefore, we need к use a variety из пользовательский elements:

- The title corresponds к the [текст](../../option/списоктаблица#пользовательскийRender.elements.текст.тип) тип
- The текст part из the item список uses [текст](../../option/списоктаблица#пользовательскийRender.elements.текст.тип)
- The title фон rectangle uses [rect](../../option/списоктаблица#пользовательскийRender.elements.rect.тип) element
- список symbols (circle, rectangle, star) correspond к [circle](../../option/списоктаблица#пользовательскийRender.elements.circle.тип), [rect](../../option/списоктаблица#пользовательскийRender.elements.rect.тип), [иконка](../../option/списоктаблица#пользовательскийRender.elements.иконка.тип) types respectively

### How к Use пользовательский Rendering интерфейс

в Vтаблица, we can define пользовательский rendering в Следующий two ways:

- `пользовательскийRender` для global пользовательский rendering settings, recommended if the макет из каждый column is базовыйally consistent;
- `columns.пользовательскийRender` для column-specific пользовательский rendering, recommended if the макет из каждый column is different;

The configuration content supports two forms:

- объект form
- функция form, which can возврат different results combined с business logic

для specific параметр descriptions, refer к the апи Документация [пользовательскийRender](https://visactor.io/vтаблица/option/списоктаблица#пользовательскийRender.elements)

от the пример effect diagram above, it can be seen that the макетs из the `urgency` и `не urgency` columns are consistent, so here I adopt the global setting method.

```javascript liveдемонстрация  template=vтаблица
const option = {
  columns: [
    {
      поле: 'тип',
      заголовок: '',
      ширина: 170,
      headerStyle: {
        bgColor: '#a23be1'
      },
      style: {
        fontFamily: 'Arial',
        fontWeight: 600,
        bgColor: '#a23be1',
        fontSize: 26,
        заполнение: 20,
        lineвысота: 32,
        цвет: 'white'
      }
    },
    {
      поле: 'urgency',
      заголовок: 'urgency',
      ширина: 400,
      headerStyle: {
        lineвысота: 50,
        fontSize: 26,
        fontWeight: 600,
        bgColor: '#a23be1',
        цвет: 'white',
        textAlign: 'центр'
      }
    },
    {
      поле: 'not_urgency',
      заголовок: 'не urgency',
      ширина: 400,
      headerStyle: {
        lineвысота: 50,
        bgColor: '#a23be1',
        цвет: 'white',
        textAlign: 'центр',
        fontSize: 26,
        fontWeight: 600
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    }
  ],
  records: [
    {
      тип: 'important',
      urgency: ['crisis', 'urgent problem', 'tasks that must be completed within a limited time'],
      not_urgency: [
        'prсобытиеive measures',
        'development relationship',
        'identify новый development opportunities',
        'establish long-term goals'
      ]
    },
    {
      тип: 'не\nimportant',
      urgency: ['Receive visitors', 'Certain calls, reports, letters, etc', 'Urgent matters', 'Public activities'],
      not_urgency: [
        'Trivial busy work',
        'некоторые letters',
        'некоторые phone calls',
        'Time-killing activities',
        'некоторые pleasant activities'
      ]
    }
  ],
  defaultRowвысота: 80,
  автоRowвысота: true,
  ширинаMode: 'standard',
  автоWrapText: true,
  пользовательскийRender(args) {
    if (args.row === 0 || args.col === 0) возврат null;
    console.log(args);
    const { ширина, высота } = args.rect;
    const { данныеValue, таблица, row, col } = args;
    const elements = [];
    let верх = 30;
    const лево = 15;
    let maxширина = 0;
    elements.push({
      тип: 'rect',
      fill: '#a23be1',
      x: лево + 20,
      y: верх - 20,
      ширина: 300,
      высота: 28
    });
    elements.push({
      тип: 'текст',
      fill: 'white',
      fontSize: 20,
      fontWeight: 500,
      textBaseline: 'середина',
      текст:
        col === 1
          ? row === 1
            ? 'important & urgency'
            : 'не important but urgency'
          : row === 1
          ? 'important but не urgency'
          : 'не important & не urgency',
      x: лево + 50,
      y: верх - 5
    });
    данныеValue.forEach((item, i) => {
      верх += 35;
      if (col == 1) {
        if (row === 1)
          elements.push({
            тип: 'иконка',
            svg: '<svg t="1687586728544" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1480" ширина="200" высота="200"><path d="M576.4 203.3c46.7 90.9 118.6 145.5 215.7 163.9 97.1 18.4 111.5 64.9 43.3 139.5s-95.6 162.9-82.3 265.2c13.2 102.3-24.6 131-113.4 86.2s-177.7-44.8-266.6 0-126.6 16-113.4-86.2c13.2-102.3-14.2-190.7-82.4-265.2-68.2-74.6-53.7-121.1 43.3-139.5 97.1-18.4 169-73 215.7-163.9 46.6-90.9 93.4-90.9 140.1 0z" fill="#733FF1" p-id="1481"></path></svg>',
            x: лево - 6,
            y: верх - 6,
            ширина: 12,
            высота: 12
          });
        else
          elements.push({
            тип: 'circle',
            strхорошоe: '#000',
            fill: 'yellow',
            x: лево,
            y: верх,
            radius: 3
          });
      } else {
        elements.push({
          тип: 'rect',
          strхорошоe: '#000',
          fill: 'blue',
          x: лево - 3,
          y: верх - 3,
          ширина: 6,
          высота: 6
        });
      }
      elements.push({
        тип: 'текст',
        fill: 'blue',
        шрифт: '14px sans-serif',
        baseline: 'верх',
        текст: item,
        x: лево + 10,
        y: верх + 5
      });
      maxширина = Math.max(maxширина, таблица.measureText(item, { fontSize: '15' }).ширина);
    });
    возврат {
      elements,
      expectedвысота: верх + 20,
      expectedширина: maxширина + 20
    };
  }
};

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
```

## пользовательский Rendering для Header Cells

к пользовательскийize the rendering из header cells, Вы можете use `columns.headerпользовательскийRender`. Its usвозраст is similar к `columns.пользовательскийRender`.

## пользовательский Rendering для Body Cells

The демонстрация mentioned above, `пользовательскийRender`, is для пользовательский rendering из body cells.

## авто макет Usвозраст

в некоторые scenarios, we want the пользовательский-rendered elements к автоmatically макет к fit the cell размер. или, if you prefer к макет в a more flexible way, using an approach closer к html/react для coding, then Вы можете refer к the tutorial [пользовательский Rendering авто макет](../пользовательский_define/пользовательский_макет).
