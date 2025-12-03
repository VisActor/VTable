# How к автоmatically calculate the ширина и высота из cells в a таблица компонент based на the content?

## Question Description

I have a requirement where the cell content в a таблица may contain line breaks, и the content length may vary для cells в the same column. Additionally, the style из cells в the same row may differ. However, I want the content к be fully displayed, so I need a таблица компонент that can автоmatically adjust the ширина и высота из cells based на their content. How can I achieve this effect в Vтаблица?

## Solution

Vтаблица supports a configurable авто-sizing mode для ширина и высота calculation!

## код пример

```javascript
const records = [
  {
    "230517143221027": "CA-2018-156720",
    "230517143221030": "JM-15580",
    "230517143221032": "Bagged Rubber Bands",
  },
  {
    "230517143221027": "CA-2018-115427",
    "230517143221030": "EB-13975",
    "230517143221032": "GBC Binding covers",
  },
  {
    "230517143221027": "CA-2018-115427",
    "230517143221030": "EB-13975",
    "230517143221032": "Cardinal Slant-D Ring Binder,\n Heavy Gauge Vinyl",
  },
  {
    "230517143221027": "CA-2018-143259",
    "230517143221030": "PO-18865",
    "230517143221032": "Bush Westполе Collection Boхорошоcases, Fully Assembled",
  },
  {
    "230517143221027": "CA-2018-126221",
    "230517143221030": "CC-12430",
    "230517143221032":
      "Eureka The Boss\n Plus 12-Amp Hard Box Upright Vacuum, Red"
  }
];

const columns = [
  {
    поле: "230517143221027",
    заголовок: "ID Заказа"
  },
  {
    поле: "230517143221030",
    заголовок: "пользовательскийer ID"
  },
  {
    поле: "230517143221032",
    заголовок: "Product имя",
    style: {
      fontSize(args: любой) {
        if (args.row % 2 === 1) возврат 20;
        возврат 12;
      }
    }
  }
];

const option = {
  records,
  columns,
  limitMaxавтоширина: 800,
  ширинаMode: "автоширина",
  высотаMode: "автовысота"
};

// 创建 Vтаблица 实例
const vтаблицаInstance = новый Vтаблица.списоктаблица(
  document.getElementById("container")!,
  option
);
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-ширинаmode-высотаmode-56m24x)

![result](/vтаблица/Часто Задаваемые Вопросы/3-0.png)

## Quote

- [список таблица демонстрация](https://visactor.io/vтаблица/демонстрация/таблица-тип/список-таблица)
- [rowвысота columnширина Tutorial](https://visactor.io/vтаблица/guide/базовый_function/row_высота_column_ширина)
- [Related апи](<https://visactor.io/vтаблица/option/списоктаблица#ширинаMode('standard'%20%7C%20'adaptive'%20%7C%20'автоширина')%20=%20'standard'>)
- [github](https://github.com/VisActor/Vтаблица)
