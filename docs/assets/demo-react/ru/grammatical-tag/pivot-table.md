---
категория: примеры
группа: grammatical-tag
заголовок: сводный таблица
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-таблица.png
порядок: 1-1
ссылка: Developer_Ecology/react
---

# сводный таблица

The props attributes accepted по сводныйтаблица&сводныйграфик are consistent с options. The semantic sub-компонентs are as follows:

- сводныйColumnDimension: The dimension configuration на the column is consistent с the definition из columns в option [апи](../../option/сводныйтаблица-columns-текст#headerType)
- сводныйRowDimension: The dimension configuration на the row is consistent с the definition из rows в option [апи](../../option/сводныйтаблица-rows-текст#headerType)
- сводныйIndicator: indicator configuration, consistent с the definition из indicators в option [апи](../../option/сводныйтаблица-indicators-текст#cellType)
- сводныйColumnHeaderзаголовок: column header title configuration, consistent с the definition из columnHeaderTitle в option [апи](../../option/сводныйтаблица#rowHeaderTitle)
- сводныйRowHeaderзаголовок: row header title configuration, consistent с the definition из rowHeaderTitle в option [апи](../../option/сводныйтаблица#columnHeaderTitle)
- сводныйCorner: Corner configuration, consistent с the definition из corner в option [апи](../../option/сводныйтаблица#corner)

## код демонстрация

```javascript liveдемонстрация template=vтаблица-react
// import * as ReactVтаблица от '@visactor/react-vтаблица';

fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
  .then(res => res.json())
  .then(данные => {
    const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
    root.render(
      <ReactVтаблица.сводныйтаблица records={данные}>
        <ReactVтаблица.сводныйColumnHeaderTitle
          title={true}
          headerStyle={{
            textStick: true
          }}
        />
        <ReactVтаблица.сводныйColumnDimension dimensionKey={'Категория'} title={'Категория'} ширина={'авто'} />
        <ReactVтаблица.сводныйRowDimension
          dimensionKey={'Город'}
          title={'Город'}
          drillUp={true}
          ширина={'авто'}
          headerStyle={{
            textStick: true
          }}
        />
        <ReactVтаблица.сводныйIndicator
          indicatorKey={'Количество'}
          title={'Количество'}
          ширина={'авто'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            }
          }}
        />
        <ReactVтаблица.сводныйIndicator
          indicatorKey={'Продажи'}
          title={'Продажи'}
          ширина={'авто'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            }
          }}
        />
        <ReactVтаблица.сводныйIndicator
          indicatorKey={'Прибыль'}
          title={'Прибыль'}
          ширина={'авто'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            }
          }}
        />
        <ReactVтаблица.сводныйCorner
          titleOnDimension={'row'}
          headerStyle={{
            fontWeight: 'bold'
          }}
        />
      </ReactVтаблица.сводныйтаблица>
    );
  });

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```
