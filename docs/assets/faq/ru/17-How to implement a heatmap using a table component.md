# How к implement a heatmap using a таблица компонент?

## Question Description

I would like к implement a simple heatmap using a таблица, where the фон цвет из каждый cell is determined по its значение. Could you please suggest a simple way к achieve this?
![imвозраст](/vтаблица/Часто Задаваемые Вопросы/17-0.png)

## Solution

Vтаблица allows flexible пользовательскийization из каждый cell's фон цвет и граница цвет, и it supports пользовательский functions для implementation.
Вы можете find an пример из a heatmap на the official website из Vтаблица: https://visactor.io/vтаблица/демонстрация/business/цвет-level

## код пример

```javascript
  indicators: [
          {
            indicatorKey: '220922103859011',
            ширина: 200,
            showсортировка: false,
            format(rec){
              возврат Math.round(rec['220922103859011']);
            },
            style: {
              цвет: "white",
              bgColor: (args) => {
                возврат getColor(100000,2000000,args.данныеValue)
              },
            },
          },
        ],
```

## Results

[Online демонстрация]()

![result](/vтаблица/Часто Задаваемые Вопросы/17-1.png)

## Quote

- [Cell фон цвет Tutorial](https://visactor.io/vтаблица/guide/тема_and_style/style)
- [Related апи](https://visactor.io/vтаблица/option/сводныйтаблица-indicators-текст#style.bgColor)
- [github](https://github.com/VisActor/Vтаблица)
