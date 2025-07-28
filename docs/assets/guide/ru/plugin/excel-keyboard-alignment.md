# Excel Edit Cell Keyboard Behavior Alignment Plugin

`ExcelEditCellKeyboardPlugin` is a Vтаблица extension компонент that aligns keyboard behavior в cell editing с Excel функциональность.

## Plugin Capabilities
Regarding keyboard response settings, Vтаблица has Следующий two configuration entry points:

| keyboard   | Response                                                                                                                                                                                                                                                  |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enter      | If в edit state, confirms editing completion;<br> If keyboardOptions.moveFocusCellOnEnter is true, pressing enter switches the selected cell к the cell below.<br> If keyboardOptions.editCellOnEnter is true, pressing enter will enter edit mode when a cell is selected. |
| tab        | Requires keyboardOptions.moveFocusCellOnTab к be включен.<br> Pressing tab switches the selected cell, if currently editing a cell, the следующий cell will also be в edit mode. |
| лево       | Direction key, switches the selected cell.<br> If keyboardOptions.moveEditCellOnArrowKeys is включен, Вы можете also switch the editing cell в edit mode |
| право      | Same as above |
| верх        | Same as above |
| низ     | Same as above |
| ctrl+c     | The keybinding is не exact, this copy matches the browser's shortcut.<br> Copies selected cell content, requires keyboardOptions.copySelected к be включен |
| ctrl+v     | The keybinding is не exact, paste shortcut matches the browser's shortcut.<br> Pastes content к cells, requires keyboardOptions.pasteValueToCell к be включен, paste only works на cells configured с editor |
| ctrl+a     | выбрать все, requires keyboardOptions.selectAllOnCtrlA к be включен |
| shift      | Hold shift и лево mouse Кнопка к выбрать cells в a continuous area |
| ctrl       | Hold ctrl и лево mouse Кнопка к выбрать multiple areas |
| любой key    | Can списокen к таблицаInstance.на('keydown',(args)=>{ }) |

These settings can satisfy most editing таблица keyboard response requirements, but compared к Excel, Vтаблица's keyboard behavior still has некоторые differences, such as:

- в Vтаблица, when editing a cell, pressing arrow keys doesn't switch к the следующий cell, but moves the cursor within the editing cell.
- в Vтаблица, when editing a cell, pressing enter doesn't confirm editing completion, but switches к the следующий cell.
- в Vтаблица, when editing a cell, pressing tab doesn't switch к the следующий cell, but moves the cursor within the editing cell.
- в Vтаблица, when editing a cell, pressing shift и лево mouse Кнопка doesn't выбрать cells в a continuous area.
- в Vтаблица, when editing a cell, holding ctrl и лево mouse Кнопка doesn't выбрать multiple areas.


Combined с Vтаблица's existing capabilities that partially meet the requirements, we developed the `ExcelEditCellKeyboardPlugin` plugin к align cell editing keyboard behavior с Excel функциональность.

## Plugin Usвозраст пример

```javascript liveдемонстрация template=vтаблица
//  import * as Vтаблица от '@visactor/vтаблица';
// 使用时需要引入插件包@visactor/vтаблица-plugins
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';
// 正常使用方式 const columnSeries = новый Vтаблица.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 Vтаблица.plugins重命名成了VтаблицаPlugins

const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `小明${i + 1}`,
    lastимя: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' + (i + 1) : 'front-конец engineer' + (i + 1),
    Город: 'beijing',
    imвозраст:
      '<svg ширина="16" высота="16" viewBox="0 0 48 48" fill="никто" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linecap="round" strхорошоe-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linejoin="round"/></svg>'
  }));
};
  const excelEditCellKeyboardPlugin = новый VтаблицаPlugins.ExcelEditCellKeyboardPlugin();

  const option = {
    records: generatePersons(20),
    columns:[
    {
      поле: 'id',
      заголовок: 'ID',
      ширина: 'авто',
      minширина: 50,
      сортировка: true
    },
    {
      поле: 'email1',
      заголовок: 'email',
      ширина: 200,
      сортировка: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },
    {
      заголовок: 'full имя',
      columns: [
        {
          поле: 'имя',
          заголовок: 'первый имя',
          ширина: 200
        },
        {
          поле: 'имя',
          заголовок: 'последний имя',
          ширина: 200
        }
      ]
    },
    {
      поле: 'date1',
      заголовок: 'birthday',
      ширина: 200
    },
    {
      поле: 'sex',
      заголовок: 'sex',
      ширина: 100
    }
  ],
    editor: новый Vтаблица_editors.InputEditor(),
    editCellTrigger: ['keydown'],
    plugins: [excelEditCellKeyboardPlugin]
  };
  const таблицаInstance = новый Vтаблица.списоктаблица( document.getElementById(CONTAINER_ID),option);
  window.таблицаInstance = таблицаInstance;

  
```

## Future Plugin Improvements

Other keyboard behaviors that differ от Excel, such as:

- Support для configuration option к respond к the delete key
- Support для configuration option к respond к ctrl+c и ctrl+v
- Support для configuration option к respond к shift и лево mouse Кнопка
- Support для configuration option к respond к ctrl и лево mouse Кнопка

Whether каждый response behavior needs к be explicitly configured по users, such as providing configuration options:
```ts
const excelEditCellKeyboardPlugin = новый ExcelEditCellKeyboardPlugin({
    enableDeleteKey: false
});
const excelEditCellKeyboardPlugin = новый ExcelEditCellKeyboardPlugin(excelEditCellKeyboardPlugin);

```

We welcome your contributions к write more plugins! Let's build the Vтаблица ecosystem together!