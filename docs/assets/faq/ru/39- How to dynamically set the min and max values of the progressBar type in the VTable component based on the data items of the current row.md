---
заголовок: 17. How к dynamically set the min и max values из the progressBar тип в the Vтаблица компонент based на the данные items из the текущий row?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

How к dynamically set the min и max values из the progressBar тип в the Vтаблица компонент based на the данные items из the текущий row?</br>
## Question Description

Business Scenario: для пример, I have a column в my таблица that uses the progressBar cell тип, but the maximum и minimum values из the bar график в каждый row are different. That is, the max значение из каждый данные I get is не fixed. How can I achieve that the maximum и minimum values из the progressBar can be dynamically set в this case?</br>
## Solution

Currently, the专属配置项 max и min из the progressBar тип в Vтаблица support functional writing, so that Вы можете obtain the данные records needed к be combined according к the функция parameters.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ASikb8pQ2o60m7xSJP0c8HeZnEc.gif' alt='' ширина='949' высота='316'>

## код пример

```
const records = [
  {
   "имя":"pigeon",
   "introduction":"The pigeon is a common urban bird с gray feathers и a short, thick beak."
   "imвозраст":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/pigeon.jpeg",
   "video":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/pigeon.mp4",
   "YoY":60,
   "QoQ":10,
   "min":-20,
   "max":100
  }
];

const columns = [
  {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина:200,
    barType:'negative',
    min(args){
      const rowRecord=args.таблица.getCellOriginRecord(args.col,args.row);
      возврат rowRecord.min;
    },
    max(args){
      const rowRecord=args.таблица.getCellOriginRecord(args.col,args.row);
      возврат rowRecord.max;
    }
  },
];
const option = {
  records,
  columns
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;</br>
```
## Result Display

Related демонстрация reference: [https://visactor.io/vтаблица/демонстрация/cell-тип/progressbar](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fcell-тип%2Fprogressbar)</br>
Just paste the код в the пример into the official editor к present.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/FbWlbtKTloxfUIxxPMkcmYsPn7g.gif' alt='' ширина='1265' высота='605'>

## Relevant Documents

Progressbar usвозраст reference демонстрация: [https://visactor.io/vтаблица/демонстрация/cell-тип/progressbar](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fcell-тип%2Fprogressbar)</br>
Progressbar usвозраст tutorial: [https://visactor.io/vтаблица/guide/cell_type/progressbar](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fcell_type%2Fprogressbar)</br>
Related апи: [https://visactor.io/vтаблица/option/списоктаблица-columns-progressbar#min](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Foption%2Fсписоктаблица-columns-progressbar%23min)</br>
GitHub: [https://github.com/VisActor/Vтаблица](https%3A%2F%2Fgithub.com%2FVisActor%2FVтаблица)</br>

