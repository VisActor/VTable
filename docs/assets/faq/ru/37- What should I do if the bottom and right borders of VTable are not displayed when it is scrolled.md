---
заголовок: 15. What should I do if the низ и право borders из Vтаблица are не displayed when it is scrolled?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

What should I do if the низ и право borders из Vтаблица are не displayed when it is scrolled?</br>
## Problem description

As shown в the screenshot, the таблица contents в Vтаблица are не fully displayed (when there is a прокрутка bar). How can I display the право и низ borders из the таблица?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WqiUbPv03owU2Px1UVNciy8Anif.gif' alt='' ширина='432' высота='628'>

## Solution

Вы можете add borderLineширина и borderColor configurations в the frameStyle в the тема. However, after adding the above configurations, the borders на the верх и лево sides из the таблица и the borders из the cells will have two layers из borders, и the effect is не good.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/B9OwbT4N3oX3ZExrtcQcccOwndc.gif' alt='' ширина='437' высота='131'>

After further research на the configuration, I found the cellInnerBorder configuration item, which is specifically designed к handle this situation. If you set it к false, the граница lines из the cells на the edge will no longer be drawn.</br>
The configuration items used are defined as follows:</br>
```
/** frameStyle 是配置表格整体的样式 */
frameStyle ?:FrameStyle;
/** 单元格是否绘制内边框,如果为true，边界单元格靠近边界的边框会被隐藏 */
cellInnerBoder?:логический;  // true | false</br>
```


## код пример

```
  const option = {
    records,
    columns,
    автоWrapText: true,
    limitMaxавтоширина: 600,
    высотаMode: 'автовысота',
    тема:{
      frameStyle:{ // 配置的表格整体的边框
         borderLineширина: 1, //  设置边框宽度
         borderColor: "#CBCBCB" //  设置边框颜色
      },
      cellInnerBпорядок:true  // 单元格是否绘制内边框，可结合情况设置true或false
    }
  };
  const таблицаInstance = новый Vтаблица.списоктаблица(container, option);</br>
```
## Results показать

Complete пример：https://кодsandbox.io/p/sandbox/vтаблица-frame-граница-демонстрация-forked-zn4n9j</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/LYrkbUrwFoyKLrxJy5AcJnRHnge.gif' alt='' ширина='421' высота='615'>

## Related Documents

Set таблица frame демонстрация：https://кодsandbox.io/p/sandbox/vтаблица-frame-граница-демонстрация-forked-zn4n9j</br>
Related апи：https://www.visactor.io/vтаблица/option/списоктаблица#тема.cellInnerBorder </br>
https://www.visactor.io/vтаблица/option/списоктаблица#тема.frameStyle.borderLineширина</br>
https://www.visactor.io/vтаблица/option/списоктаблица#тема.frameStyle.borderColor</br>
github：https://github.com/VisActor/Vтаблица</br>