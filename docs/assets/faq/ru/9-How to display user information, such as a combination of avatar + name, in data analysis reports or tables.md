# How к display user information, such as a combination из "avatar + имя," в данные analysis reports или таблицаs?

## Question Description

I would like к display both an avatar и a имя в a single cell из a данные report таблица в a simple manner. Are there любой примеры I can refer к?

![](/vтаблица/Часто Задаваемые Вопросы/9-0.png)

## Solution

в Vтаблица, there are two ways к accomplish this. The первый и simplest approach is к use иконкаs. Вы можете directly set the иконка source as the resource поле. для more details, Вы можете refer к the демонстрация I provided. The second approach involves пользовательский rendering, which requires familiarity с the syntax. However, it allows для more complex effects.

## код пример

```javascript
const columns: Vтаблица.ColumnsDefine = [
  {
    поле: "имя",
    заголовок: "имя",
    ширина: "авто",
    cellType: "link",
    templateссылка: "https://www.google.com.hk/search?q={имя}",
    linkJump: true,
    иконка: {
      тип: "imвозраст",
      src: "imвозраст1",
      имя: "Avatar",
      shape: "circle",
      //定义文本内容行内图标，第一个字符展示
      ширина: 30, // необязательный
      высота: 30,
      positionType: Vтаблица.TYPES.иконкаPosition.contentLeft,
      marginRight: 20,
      marginLeft: 0,
      cursor: "pointer"
    }
  },
  ...
  ]
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-photo-userимя-ypndvm?file=/src/index.ts)

![result](/vтаблица/Часто Задаваемые Вопросы/9-1.png)

## Quote

- [Define иконка Tutorial](https://visactor.io/vтаблица/guide/пользовательский_define/пользовательский_иконка)
- [пользовательский cell макет демонстрация](https://visactor.io/vтаблица/демонстрация/пользовательский-render/пользовательский-cell-макет)
- [Related апи](https://visactor.io/vтаблица/option/списоктаблица-columns-текст#иконка.Imвозрастиконка.src)
- [github](https://github.com/VisActor/Vтаблица)
