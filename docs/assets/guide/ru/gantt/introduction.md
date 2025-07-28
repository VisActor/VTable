# гантт график Introduction и Usвозраст Guide

A гантт график is a project manвозрастment tool used к display project plans, task progress, и schedules. It visually represents the начало и конец times из tasks using bar графикs, helping project manвозрастrs effectively track и manвозраст project progress. каждый task is displayed as a bar в the график, с the length из the bar representing the duration из the task и the позиция representing the начало и конец times из the task.

Vтаблица-гантт is a powerful гантт график drawing tool built на the Vтаблица таблица компонент и the canvas renderer VRender, enabling developers к easily create и manвозраст гантт графикs.

## компонентs из a гантт график

Task список на the лево: Displays the список из project tasks, usually на the лево side из the график.

верх Timeline: Displays the project's time range, usually в the верх или низ из the график.

Task Bars: Represent the начало и конец times из каждый task.

Grid Lines: Separate the timeline и task bars, making the график clearer.

Marker Lines: Mark important time points.

Divider Lines: Separate the task список и timeline, making the график clearer.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-structure.png)

**Note: The task information таблица на the лево corresponds к a complete списоктаблица в the implementation. It is attached к ганттInsтаблица.taskсписоктаблицаInstance, so the interfaces и событиеs corresponding к списоктаблица can be directly used through taskсписоктаблицаInstance. If you want к troubleshoot issues с the таблица на the лево, Вы можете also directly extract taskсписоктаблицаInstance.options к check if they meet expectations.**

 <div style="ширина: 40%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-guide-leftсписоктаблица-en.png" />
    <p>лево таблица</p>
  </div>

## Main Capabilities из гантт график

### Multi-column Information Display

The лево side из the entire structure из the гантт график is a complete таблица container, so it supports rich column information display. для specific configuration, please refer к [Configuration](../../option/гантт#taskсписоктаблица).

### пользовательский Rendering

пользовательский rendering requires understanding the graphic element свойства из VRender. для details, please refer к [пользовательский Rendering Tutorial](../../guide/гантт/гантт_пользовательскиймакет).

#### пользовательский Rendering из Task Bars

Вы можете пользовательскийize the rendering из task bars through the `taskBar.пользовательскиймакет` configuration item.

#### пользовательский Rendering из Date Headers

Вы можете пользовательскийize the rendering из date headers through the `timelineHeader.scales.пользовательскиймакет` configuration item.

#### пользовательский Rendering из Task Information таблица на the лево

Вы можете define the пользовательский rendering из каждый cell в каждый column through `taskсписоктаблица.columns.пользовательскиймакет` или globally define the пользовательский rendering из каждый cell through `taskсписоктаблица.пользовательскиймакет`.

### Support для Different Date Scale Granularity

в common business scenarios, multi-level time scale display may be обязательный. Vтаблица-гантт supports five time granularities: `'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second'`.

Вы можете set the row высота и time unit (such as day, week, month, etc.) из the date scale through the `timelineHeader.scale` configuration item.

### Date Header Style

Вы можете пользовательскийize the style из the date header through the `timelineHeader.scales.style` configuration item.

Вы можете set the row высота из the date scale through the `timelineHeader.scales.rowвысота` configuration item.

### Outer Frame

The граница из the таблица may have a different style от the internal grid lines. Вы можете пользовательскийize the outer frame из the гантт график through the `frame.outerFrameStyle` configuration item.

### Horizontal и Vertical Divider Lines

Supports horizontal divider lines для both the header и body, as well as divider lines between the лево information таблица и the право task список. Вы можете пользовательскийize the style из horizontal divider lines through the `frame.horizontalSplitLine` configuration item. Вы можете пользовательскийize the style из vertical divider lines through the `frame.verticalSplitLine` configuration item.

### Marker Lines

в the гантт график, it is often necessary к mark некоторые important dates. We configure this effect through the `markLine` configuration item. Вы можете specify key dates through `markLine.date` и пользовательскийize the style из marker lines through the `markLine.style` configuration item. If you need к ensure that the date is displayed в initialization, Вы можете set `markLine.scrollToMarkLine` к `true`. Marker lines support dynamic creation. для details, please refer к the [пример](../../демонстрация/гантт/гантт-interaction-create-mark-line).

### Container Grid Lines

Вы можете пользовательскийize the style из the фон grid lines из the право task bars through the `grid` configuration item, including фон цвет, line ширина, line тип, etc.

### Dependencies between tasks

Through the `dependency.links` configuration item, Вы можете set the dependencies between tasks. Note that the configuration данные format из the dependency is:

```
  export тип ITaskLink = {
    /** Dependency тип */
    тип: DependencyType;
    linkedFromTaskKey?: строка | число;
    linkedToTaskKey?: строка | число;
  };
```

для пример, Следующий configuration данные:

```
links:[
  {
    тип: Vтаблицагантт.TYPES.DependencyType.FinishToStart,
    linkedFromTaskKey: 1,
    linkedToTaskKey: 2
  },
  {
    тип: Vтаблицагантт.TYPES.DependencyType.StartToFinish,
    linkedFromTaskKey: 2,
    linkedToTaskKey: 3
  },
  {
    тип: Vтаблицагантт.TYPES.DependencyType.StartToStart,
    linkedFromTaskKey: 3,
    linkedToTaskKey: 4
  },
  {
    тип: Vтаблицагантт.TYPES.DependencyType.FinishToFinish,
    linkedFromTaskKey: 4,
    linkedToTaskKey: 5
  }
]
```

The values из `linkedFromTaskKey` и `linkedToTaskKey` need к correspond к the unique identifier поле в the `records`, с the по умолчанию поле имя being `id`. If you need к modify it, Вы можете do so through the `taskKeyполе` configuration item.

### Interaction

#### Dragging Task Bars

Вы можете set whether task bars are draggable through the `taskBar.moveable` configuration item.

#### Resizing Task Bars

Вы можете set whether task bars are resizable through the `taskBar.resizable` configuration item.

#### Adjusting the ширина из the лево таблица

Вы можете set the divider line к be draggable по configuring `frame.verticalSplitLineMoveable` к true.

#### Editing Task Information

Вы можете synchronize данные updates к the task bars through the editing capabilities из `списоктаблица`.

к включить editing capabilities, you need к регистрация the editor к Vтаблица в advance, as the editing capabilities here actually rely на the editing capabilities из `списоктаблица`.

#### Adjusting данные Order

к включить перетаскивание-и-отпускание reordering capabilities, you need к add `rowSeriesNumber` к the configuration из `списоктаблица`, which provides a row число. Вы можете configure the style из this column using `rowSeriesNumber.style` и `headerStyle`. к включить reordering, set `rowSeriesNumber.dragOrder` к true. `Vтаблица-гантт` will synchronize the order к the task bar area display when a reordering событие is detected.

#### Create association lines

Through the `dependency.linkCreaтаблица` configuration item, Вы можете set whether the association line can be created.

#### Creation Schedule

Configuration taskBar. ScheduleCreaтаблица.

If there is no поле данные для the task date в the original данные, Вы можете create a schedule к specify a начало time и конец time для the task. по по умолчанию, when you навести over a grid без date данные, a Кнопка к add a schedule will appear.

The Кнопка style can be configured via `taskBar.scheduleCreation.КнопкаStyle`.

If the текущий configuration does не meet your needs, Вы можете also пользовательскийize the display effect из the creation schedule through the `taskBar.scheduleCreation.пользовательскиймакет` configuration item.

**Note: Different гантт график instances have different capabilities к create schedules.**

When `tasksShowMode` is `TasksShowMode.Tasks_Separate` или `TasksShowMode.Sub_Tasks_Separate`, that is, каждый piece из данные has a corresponding row позиция display, but the данные does не set the `startDate` и `endDate` полеs, a create Кнопка will appear when the mouse hovers over the row, и Нажатьing the Кнопка will create a schedule и display the task bar.

When `tasksShowMode` is `TasksShowMode.Sub_Tasks_Inline`, `TasksShowMode.Sub_Tasks_Arrange`, или `TasksShowMode.Sub_Tasks_Compact`, it is necessary к explicitly set `scheduleCreaтаблица` к `true` для the create Кнопка к appear. When the mouse hovers over the blank area, the create Кнопка will be displayed, и Нажатьing the Кнопка will trigger the событие `гантт_событие_TYPE.CREATE_TASK_SCHEDULE`, but it will не actually create the task schedule. The user needs к списокen к this событие и create the schedule update данные according к business requirements.

## Leveraging the Capabilities из the таблица

The гантт график is implemented based на the списоктаблица из Vтаблица. It loхорошоs like a spliced form, с the task information таблица на the лево и the task bar список на the право.

The taskсписоктаблица is one из the most important configuration items в the vтаблица-гантт компонент. It is used к configure the макет и style из the task список таблица на the лево, corresponding к a complete списоктаблица configuration. в the гантт график instance, there is also such a списоктаблица instance, which can be directly obtained для operations.

The way к get the таблица instance is as follows:

```javascript
const ганттInstance = новый гантт(containerDom, options);
// Get the таблица instance на the лево
const таблицаInstance = ганттInstance.taskсписоктаблицаInstance;
```

The capabilities implemented по Vтаблицагантт using this таблица instance таблицаInstance include:

1. Using this indirectly obtained таблицаInstance, Вы можете списокen к событиеs или call the interfaces supported по списоктаблица. для details, refer к the списоктаблица [Документация](../../апи).
2. Using the editing capabilities из списоктаблица, the данные editing capabilities из the гантт график are implemented.
3. Using the сортировкаing capabilities из списоктаблица, the данные сортировкаing capabilities из the гантт график are implemented. Refer к the списоктаблица [tutorial](../../guide/базовый_function/сортировка/список_сортировка).
4. Using the tree structure capabilities из списоктаблица, the parent-child relationship данные из the гантт график is implemented. Refer к the списоктаблица [tutorial](../../guide/таблица_type/список_таблица/tree_список).

## Main Configuration из vтаблица-гантт

в the vтаблица-гантт компонент, the main supported configurations include:

1. данные Configuration `records`

2. Task Bar Configuration `taskBar`

   1. пользовательский Rendering: Вы можете пользовательскийize the rendering из task bars through the `пользовательскиймакет` configuration item.
   2. Style Configuration: Вы можете set the style из task bars, including цвет, ширина, граница radius, граница, etc., through configuration items `barStyle`.
   3. текст Style: Вы можете configure the displayed текст content information through `labelText` и configure the текст style through `labelTextStyle`, including шрифт, цвет, alignment, etc.
   4. Interaction Configuration: Вы можете set whether task bars are resizable и movable through the `resizable` и `moveable` configuration items.
   5. Interaction Style: Вы можете set the style из task bars when hovering и when selected through the `hoverBarStyle` и `selectedBarStyle` configuration item.

3. Dependency Line `dependency`

   Introduction к related configuration items для task dependencies:

   - `dependency.links`：Вы можете set the dependencies between tasks through the `dependency.links` configuration item.

   - `taskKeyполе`：Вы можете set the поле имя из the unique identifier поле для dependencies through the `taskKeyполе` configuration item.

   - `dependency.linkLineStyle`：Вы можете configure the style из dependency lines, including цвет, ширина, dashed style, etc., through `dependency.linkLineStyle`.

   - `dependency.linkLineSelectedStyle`：Вы можете пользовательскийize the style из dependencies when selected between tasks.

   - `dependency.linkCreaтаблица`：Вы можете set whether association lines can be created through the `dependency.linkCreaтаблица` configuration item.

   - `dependency.linkSelecтаблица`：Вы можете set whether association lines can be selected through the `dependency.linkSelecтаблица` configuration item.

   - `dependency.linkDeleтаблица`：Вы можете set whether association lines can be deleted through the `dependency.linkDeleтаблица` configuration item. If you want к delete association lines through the право-Нажать меню, Вы можете списокen к the `CONTEXTменю_DEPENDENCY_LINK` событие к actively call the deleteLink интерфейс к delete. If you configure shortcut keys `keyboardOptions.deleteLinkOnDel` или `keyboardOptions.deleteLinkOnBack` к delete association lines по pressing the 'del' или 'back' key на the keyboard.

   - Operation style during the creation из association lines: Вы можете set the style из the association line selection process, including цвет, ширина, dashed style, etc., through the `linkSelectedLineStyle` `linkCreatePointStyle` `linkCreatingPointStyle` `linkCreatingLineStyle` configuration items.

4. Date Header Configuration `timelineHeader`
   1. пользовательский Rendering: Вы можете пользовательскийize the rendering из date headers through the `пользовательскиймакет` configuration item.
   2. Style Configuration: Вы можете set the текст style из the header, including шрифт размер, цвет, alignment, etc., through the `style` configuration item.
5. Time Scale Configuration `timelineHeader.scales`
   1. Row высота и Time Unit: Вы можете set the row высота и time unit (such as day, week, month, etc.) из the time scale through the `rowвысота` и `unit` configuration items.
   2. Step Length и Week начало Day: Вы можете set the step length из the time scale и the начало day из the week through the `step` и `startOfWeek` configuration items.
   3. Date Formatting: Вы можете пользовательскийize the display format из dates through the `format` configuration item.
   4. Whether к display the corresponding date grid в the header part: Вы можете set whether к display the date grid в the header part through the `видимый` configuration item, the по умолчанию is displayed.
6. Grid Line Configuration `grid`
   1. Style Configuration: Вы можете set the цвет, ширина, dashed style, etc., из grid lines through the `verticalLine` и `horizontalLine` configuration items.
   2. фон цвет: Вы можете set the фон цвет из grid lines through the `backgroundColor` configuration item.
7. Task список таблица Configuration `taskсписоктаблица` (Configuration из the task information список списоктаблица на the лево, refer к [Configuration](../../option/гантт#taskсписоктаблица))
   1. Overall ширина из the таблица на the лево: Вы можете set the overall ширина из the task список таблица through the `таблицаширина` configuration item.
   2. Column Information: Вы можете define the column information и ширина из каждый column из the task information таблица through `columns`.
   3. Style Configuration: Вы можете set the style из the header и body through the `тема.headerStyle` и `тема.bodyStyle` configuration items.
   4. ширина Limit: Вы можете set the minimum и maximum ширина из the task список through the `minтаблицаширина` и `maxтаблицаширина` configuration items.
8. Divider Line Configuration `frame`
   1. Outer Frame Configuration: Вы можете set the цвет, ширина, etc., из the outer frame through the `outerFrameStyle` configuration item.
   2. Divider Line Style Configuration: Вы можете set the цвет, ширина, dashed style, etc., из divider lines through the `verticalSplitLine` и `horizontalSplitLine` configuration items.
   3. Dragging the ширина из the таблица на the лево: Вы можете set whether the divider line is draggable through the `verticalSplitLineMoveable` configuration item. Вы можете set the highlight line style when adjusting the column ширина through the `verticalSplitLineHighlight` configuration item.
9. Marker Line Configuration `markLine`
   1. Date Configuration: Вы можете set the date из the marker line through the `date` configuration item.
   2. Style Configuration: Вы можете set the цвет, ширина, dashed style, etc., из the marker line through the `style` configuration item.
   3. Marker Line позиция: Вы можете set the позиция из the marker line through the `позиция` configuration item.
   4. по умолчанию Display из Marker Line в the середина: Вы можете set whether the marker line is displayed в the середина по по умолчанию through the `scrollToMarkLine` configuration item.

These capabilities make the vтаблица-гантт компонент highly пользовательскийizable и flexible в task manвозрастment и project planning, meeting the needs из different scenarios.

## Summary

The гантт график is a very important tool в project manвозрастment. по visually displaying the progress и schedule из the project, it helps project manвозрастrs better plan и control the project. по reasonably configuring the various parameters из the гантт график, it can meet the needs из different projects и improve the efficiency из project manвозрастment.

I hope this tutorial can help you better understand и use the гантт график. If you have любой questions или suggestions, feel free к discuss и exchange ideas.
