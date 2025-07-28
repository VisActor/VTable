# Progressbar данные bar тип

в the scenario из данные analytics, we usually need к display various types из данные. Among them, progress bar types (such as progressbar) are very useful в некоторые scenarios, such as task progress manвозрастment, Продажи achievement, etc. They can visually display progress данные и help users quickly understand the completion из the текущий данные. по displaying progress bar types в таблицаs, the effect из данные display и user experience can be effectively improved.

The advantвозрастs из displaying progress bar тип данные в a таблица are as follows:

1.  Visual display из данные completion rate: Use the progress bar к directly display the данные completion rate, без loхорошоing в the значение, the user can quickly understand the degree из completion из the данные.
2.  Highlight differences в данные: по using different colored progress bars, it is easier для users к distinguish differences в данные и quickly identify данные that needs attention.
3.  Dynamic display из данные changes: When the данные changes, the length из the progress bar can be dynamically adjusted к facilitate users к keep abreast из данные changes.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a222eb3ecfe32db85220dda02.png)

## Introduction из exclusive configuration items для progressbar данные strips

The specific configuration items из the progressbar stripe тип в the configuration are as follows:

1.  `min`: The progress bar displays the minimum данные из the range, the по умолчанию значение is 0.
2.  `max`: The progress bar displays the maximum данные из the range, the по умолчанию значение is 100.
3.  `barType`: Progress bar тип, the по умолчанию значение is'по умолчанию '. необязательный values include:
    *   'по умолчанию ': normal progress bar;
    *   'Negative ': Considering the progress bar с negative значение, the progress bar will display the progress bar в both positive и negative directions divided по 0;
    *   negative\_no\_axis ': Similar к'negative', but без a 0-valued axis.
4.  `dependполе`: If you need the текст displayed в the cell и the данные поле used по the progress bar are different, в `dependполе` The данные поле used к configure the progress bar в.

пример:

```javascript
{
  cellType: 'progressbar',
  поле: 'Продажи_progress',
  заголовок: '销售进度',
  min: 0,
  max: 100,
  barType: 'по умолчанию',
  dependполе: 'Продажи_rate'
}
```

## Introduction к style style configuration из progressbar данные strips

Progressbar stripe тип в style `style` There are many exclusive configuration items such as: barColor, barвысота, barAxisColor, barMarkXXX, etc. Please pass Следующий примеры и[данные Bar апи](../../option/списоктаблица-columns-progressbar)к learn more about the use из каждый configuration:

пример:

```javascript liveдемонстрация template=vтаблица

const records = [
  {
   "YoY":"50",
  },
  {
   "YoY":10,
  },
   {
   "YoY":-10,
  },
   {
   "YoY":5,
  }
];

const columns = [
 {
       поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
     ширина:200,
      полеFormat(rec){
        debugger;
        if(typeof rec['YoY'] === 'число')
        возврат rec['YoY']+'%'
      возврат rec['YoY'];
    },
  },
  {
       поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
     ширина:200,
      style: {
        barвысота: '100%',
        // barBgColor: '#aaa',
        // barColor: '#444',
        barBgColor: (данные) => {
          возврат `rgb(${200 + 50 * (1 - данные.percentile)},${ 255 * (1 - данные.percentile)
            },${255 * (1 - данные.percentile)})`;
        },
        barColor: 'transparent',
      },
    },
 {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина:200,
    полеFormat(){
      возврат '';
    },
    min:-20,
    max:60,
    style: {
      showBar:true,
      barColor: (данные) => {
          возврат `rgb(${200 + 50 * (1 - данные.percentile)},${ 255 * (1 - данные.percentile)
            },${255 * (1 - данные.percentile)})`;
        },
        barвысота: 20,
        barBottom:'30%',
    },
  },
  {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина:200,
    полеFormat(){
      возврат '';
    },
    barType:'negative',
    min:-20,
    max:60,
    style: {
        barвысота: 20,
        barBottom:'30%',
      },
  },
    {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина:200,
    barType:'negative_no_axis',
    min:-20,
    max:60,
    style: {
        textAlign:'право',
        barвысота: 20,
        barBottom:'30%',
        barBgColor:'rgba(217,217,217,0.3)'
    },
  },
  {
    поле: 'YoY',
    заголовок: 'count Year-over-Year',
    cellType: 'progressbar',
    ширина:200,
    barType:'negative_no_axis',
    min:-20,
    max:60,
    style: {
        showBar:false,
        barвысота: 20,
        barBottom:'30%',
        barBgColor:'rgba(217,217,217,0.3)'
    },
  },
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
};
const таблицаInstance = новый Vтаблица.списоктаблица(option);
window['таблицаInstance'] = таблицаInstance;
```

Through the above introduction, you have learned how к use the progressbar данные strip тип в the Vтаблица таблица для данные display, I hope it will be helpful к you.
