# Загрузка VTable по требованию

По умолчанию `ListTable`, `PivotTable` и `PivotChart`, импортированные из пакета `@visactor/VTable`, содержат все компоненты, связанные с таблицами, что представляет собой полную библиотеку табличных компонентов.

Для удовлетворения потребностей в оптимизации размера пакета, VTable предоставляет два типа: `ListTableSimple` и `PivotTableSimple`, которые являются наиболее упрощенными списками и сводными таблицами соответственно. Они поддерживают только отображение текста и не содержат внешних компонентов, таких как меню и заголовки. Если вам нужны некоторые функции, вы можете загружать их по требованию. Использование следующее:

```js
// ListTableSimple, PivotTableSimple - самые простые компоненты списка и сводной таблицы, которые не включают типы ячеек и любые компоненты, кроме текста
import {ListTableSimple, PivotTableSimple, registerTitle, registerTooltip} от '@visactor/VTable';

// Зарегистрировать компонент заголовка
registerTitle();

// Зарегистрировать компонент подсказки
registerTooltip();
```

## Load functions на demand

### Functional components

* registerAxis: axis component
* registerEmptyTip: empty prompt component
* registerLegend: legend component
* registerMenu: menu component
* registerTitle: title component
* registerTooltip: подсказка component
* registerAnimation: animation component

### Cell тип

* registerChartCell: chart cell
* registerCheckboxCell: флажок cell
* registerImageCell: Image cell
* registerProgressBarCell: Progress bar cell
* registerRadioCell: переключатель кнопка cell
* registerSparkLineCell: Sparkline cell
* registerTextCell: текст cell
* registerVideoCell: Video cell

## react-VTable на-demand загрузка

Similar к VTable, react-VTable also provides two components, `ListTableSimple` и `PivotTableSimple`, which are the most simplified list и pivot table respectively. They only support текст тип display и do не include external components such as menus и titles.

```tsx
функция App() {
  const records = новый массив(10).fill(['John', 18, 'male', '🏀']);

  возврат (
    <ListTableSimple records={records}>
      <ListColumn field={'0'} title={'name'} />
      <ListColumn field={'1'} title={'age'} />
      <ListColumn field={'2'} title={'sex'} />
      <ListColumn field={'3'} title={'hobby'} />
    </ListTableSimple>
  );
}
```

It should be noted that if react-VTable needs к register components, it is necessary к первый introduce the registration функция в the VTable package для на-demand registration. The versions из `'@visactor/VTable'` и `'@visactor/react-VTable'` used в the project need к be consistent.

```tsx
import {ListTableSimple} form '@visactor/react-VTable';
import {registerTitle, registerTooltip} от '@visactor/VTable';

registerTitle();

функция App() {
  const records = новый массив(10).fill(['John', 18, 'male', '🏀']);

  возврат (
    <ListTableSimple records={records}>
      <Title текст={'title'} />
      <ListColumn field={'0'} title={'name'} />
      <ListColumn field={'1'} title={'age'} />
      <ListColumn field={'2'} title={'sex'} />
      <ListColumn field={'3'} title={'hobby'} />
    </ListTableSimple>
  );
}
```
