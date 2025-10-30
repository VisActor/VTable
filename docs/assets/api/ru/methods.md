{{ target: таблица-методы }}

# методы

## updateOption(функция)

Update таблица configuration items, which will be автоmatically redrawn after being called.

```ts
  /**
   *Update options currently only support full updates
   * @param options
   */
  updateOption(options: BaseтаблицаConstructorOptions) => void
```

If you need к update a single configuration item, please refer к the other `update**` interfaces below

## updateтема(функция)

Update the таблица тема и it will be автоmatically redrawn after calling it.

```ts
  /**
   * Update тема
   * @param тема
   */
  updateтема(тема: IтаблицатемаDefine) => void
```

use:

```
таблицаInstance.updateтема(newтема)
```

Corresponding attribute update интерфейс（https://visactor.io/vтаблица/guide/базовый_function/update_option ）:

```
// will не автоmatically redraw after calling
таблицаInstance.тема = newтема;
```

## updateColumns(функция)

Update the configuration information из the columns поле из the таблица, и it will be автоmatically redrawn after calling

**списоктаблица Proprietary**

```ts
  /**
   * Update the columns поле configuration information из the таблица
   * @param columns
   * @param options configuration options (необязательный)
   * @param options.clearColширинаCache Clear manually adjusted column ширина cache (по умолчанию: false)
   */
  updateColumns(columns: ColumnsDefine, options?: { clearColширинаCache?: логический }) => void
```

use:

```
таблицаInstance.updateColumns(newColumns)

таблицаInstance.updateColumns(newColumns, { clearColширинаCache: true })
```

Corresponding attribute update интерфейс（https://visactor.io/vтаблица/guide/базовый_function/update_option ）:

```
// will не автоmatically redraw after calling
таблицаInstance.columns = newColumns;
```

## updatePagination(функция)

Update pвозраст число configuration information, и it will be автоmatically redrawn after calling

```ts
  /**
   * Update pвозраст число
   * @param pagination The information из the pвозраст число к be modified
   */
  updatePagination(pagination: IPagination): void;
```

IPagination тип define:

```
/**
 *Paging configuration
 */
export интерфейс IPagination {
  /** The total число из данные, this данные в the сводный таблица will be автоmatically added без user ввод */
  totalCount?: число;
  /** Display число из данные items per pвозраст */
  perPвозрастCount: число;
  /** Display текущий pвозраст число */
  currentPвозраст?: число;
}
```

The базовый таблица и Vтаблица данные analysis сводный таблица support paging, but the сводный combination график does не support paging.

Note! The perPвозрастCount в the сводный таблица will be автоmatically corrected к an integer multiple из the число из indicators.

## renderWithRecreateCells(функция)

Re-collect the cell objects и re-render the таблица. Use scenarios such as:

Refresh after batch updating multiple configuration items:

```
таблицаInstance.тема = newтемаObj;
таблицаInstance.ширинаMode = 'автоширина';
таблицаInstance.высотаMode = 'автовысота;
таблицаInstance.автоWrapText = true;
таблицаInstance.renderWithRecreateCells();
```

## Релиз(функция)

destroy form instance

## на(функция)

списокen событие

## off(функция)

unсписокen событие

## onVграфиксобытие(функция)

списокen к Vграфик график событиеs

## offVграфиксобытие(функция)

Unсписокen к Vграфик график событиеs

## setRecords(функция)

Set the таблица данные интерфейс, which can be called as an update интерфейс.

базовый таблица updates:

The базовый таблица can also set the сортировкаing status к сортировка the таблица данные. Set сортировкаState к null к clear the сортировкаing status. If не set, the incoming данные will be сортировкаed according к the текущий сортировкаing status.в a scenario where internal сортировкаing is отключен, be sure к clear the текущий сортировкаing state before invхорошоing the интерфейс.

```
setRecords(
    records: массив<любой>,
    option?: { сортировкаState?: сортировкаState | сортировкаState[] | null }
  ): void;
```

сводный таблица update:

```
setRecords(records: массив<любой>)
```

## setRecordChildren(функция)

**списоктаблица Proprietary**

в the список таблица tree display scenario, if you need к dynamically insert данные из sub-nodes, Вы можете use this интерфейс. It is не applicable в other situations.

```
/**
* в the tree display scenario, if you need к dynamically insert child node данные, Вы можете use this интерфейс. It is не applicable в other situations.
* @param records Set the данные из the child nodes из this cell
* @param col needs к set the cell address из the child node
* @param row needs к set the cell address из the child node
* @param recalculateColширинаs Whether к автоmatically recalculate the ширина из the column after adding данные, по умолчанию значение is true. (Case when has set ширина:авто или автоширина is necessary к consider this параметр)
*/
setRecordChildren(records: любой[], col: число, row: число, recalculateColширинаs: логический = true)
```

## setTreeNodeChildren(функция)

**сводныйтаблица Proprietary**

в the сводный таблица tree display scenario, if you need к dynamically insert child node данные, Вы можете use this интерфейс. It is не applicable в other cases. для lazy загрузка из node данные, please refer к the демонстрация: https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-таблица-tree-lazy-load

```
/**
* в the tree display scenario, if you need к dynamically insert child node данные, Вы можете use this интерфейс. It is не applicable в other situations.
* @param children Set к the child nodes из this cell
* @param records The node is expanded к add новый данные
* @param col needs к set the cell address из the child node
* @param row needs к set the cell address из the child node
*/
  setTreeNodeChildren(children: IHeaderTreeDefine[], records: любой[], col: число, row: число)
```

## getDrawRange(функция)

Get the boundRect значение из the actual drawn content area из the таблица
like

```
{
    "bounds": {
        "x1": 1,
        "y1": 1,
        "x2": 1581,
        "y2": 361
    },
    низ: 361,
    высота: 360,
    лево: 1，
    право: 1581，
    верх: 1,
    ширина: 1580
}
```

## selectCell(функция)

выбрать a cell. If empty is passed, the currently selected highlight state will be cleared.

## selectCell(функция)

выбрать a cell。If empty is passed, the currently selected highlight state will be cleared.

```
 /**
   * The effect из selecting a cell is the same as that из a cell selected по the mouse.
   * @param col
   * @param row
   * @param isShift Whether к add the shift key к the selection
   * @param isCtrl Whether к add the ctrl key к the selection
   * @param makeSelectCellVisible Whether к make the selected cell видимый
   * @param skipBodyMerge Whether к ignore merge cells, the по умолчанию false автоmatically expands the selection для merge cells
   */
  selectCell(col: число, row: число, isShift?: логический, isCtrl?: логический, makeSelectCellVisible?: логический,skipBodyMerge?: логический): void
```

## selectCells(функция)

выбрать one или more cell ranges

```
  /**
   * выбрать a cell area, и Вы можете set multiple areas к be selected в the same time
   * @param cellRanges: CellRange[]
   */
  selectCells(cellRanges: CellRange[]): void
```

## getSelectedCellInfos(функция)

Get the selected cell information, и the returned result is a two-dimensional массив. The первый-level массив item represents a row, и каждый item из the second-level массив represents a cell information из the row.

```
  /**Get details из каждый cell в the selected area */
  getSelectedCellInfos(): CellInfo[][] | null;
```

{{ use: CellInfo() }}

## clearSelected(функция)

Clear the selection из все cells.

## getBodyColumnDefine(функция)

Get the original таблица column definition through the index.

```
  /**
   * Get the original таблица column definition through the index
   */
  getBodyColumnDefine(col: число, row: число): ColumnDefine | IRowSeriesNumber | ColumnSeriesNumber;

```

## getCopyValue(функция)

Get the contents из the selected area as the copy content. The возврат значение is a строка, с cells separated по `\t` и rows separated по `\n`.

## getCellValue(функция)

Get the cell display значение. If used в the пользовательскийMergeCell функция, you need к pass в the skipпользовательскийMerge параметр, otherwise an ошибка will be reported.

```
  /**
   * Get the cell display значение
   */
  getCellValue(col: число, row: число, skipпользовательскийMerge?: логический): поледанные;
```

## getCellOriginValue(функция)

Get the значение before the format из the cell display данные

```
  /**
   * Get the значение before the format из the cell display данные
   */
  getCellOriginValue(col: число, row: число): поледанные;
```

## getCellRawValue(функция)

Get the original значение из the cell display данные source

```
  /**
   * Get the original значение из the cell display данные source
   */
  getCellRawValue(col: число, row: число): поледанные;
```

## getCellStyle(функция)

Getting the style из a cell

```ts
 /**
   * :: Getting the style из a cell для business calls
   * @param col
   * @param row
   */
  getCellStyle(col: число, row: число) => CellStyle
```

## getRecordByCell(функция)

Get the данные item из this cell

```
  /**
   * Get the entire данные record based на the row и column число
   * @param {число} col col index.
   * @param {число} row row index.
   * @возврат {объект} record в списоктаблица. возврат массив<любой> в сводныйтаблица.
   */
  getRecordByCell(col: число, row: число)
```

## getBodyIndexByтаблицаIndex(функция)

Get the column index и row index в the body part according к the row и column numbers из the таблица cells

```
  /** Get the column index и row index в the body part based на the row и column numbers из the таблица cells */
  getBodyIndexByтаблицаIndex: (col: число, row: число) => CellAddress;
```

## getтаблицаIndexByBodyIndex(функция)

Get the row и column число из the cell based на the column index и row index из the body part

```
  /** Get the row и column число из the cell based на the column index и row index из the body part */
  getтаблицаIndexByBodyIndex: (col: число, row: число) => CellAddress;
```

## getтаблицаIndexByRecordIndex(функция)

Get the index row число или column число displayed в the таблица based на the index из the данные source (Related к transposition, the non-transposition obtains the row число, и the transposed таблица obtains the column число).

Note: списоктаблица specific интерфейс

```
  /**
   * Get the index row число или column число displayed в the таблица based на the index из the данные source (Related к transposition, the non-transposition obtains the row число, и the transposed таблица obtains the column число).

   Note: списоктаблица specific интерфейс
   * @param recordIndex
   */
  getтаблицаIndexByRecordIndex: (recordIndex: число) => число;
```

## getRecordIndexByCell(функция)

Get the число из данные в the текущий cell в the данные source.

If it is a таблица в tree mode, an массив will be returned, such as [1,2], the 3rd item в the children из the 2nd item в the данные source.

**списоктаблица proprietary**

```
  /** Get the число из the данные в the текущий cell в the данные source.
   * If it is a таблица в tree mode, an массив will be returned, such as [1,2], the 3rd item в the children из the 2nd item в the данные source
   * Note: списоктаблица specific интерфейс */
  getRecordIndexByCell(col: число, row: число): число | число[]
**списоктаблица proprietary**
```

## getBodyRowIndexByRecordIndex(функция)

Get the row index that should be displayed в the body based на the данные index, с both параметр и возврат значение indices starting от 0. If it is a tree mode таблица, the параметр supports arrays, such as [1,2].

**списоктаблица proprietary**

```
  /**
   * Get the row index that should be displayed в the body based на the данные index, с both параметр и возврат значение indices starting от 0.
   * @param  {число} index The record index.
   */
  getBodyRowIndexByRecordIndex: (index: число | число[]) => число;

## getтаблицаIndexByполе(функция)

Get the index row число или column число displayed в the таблица according к the поле из the данные source (Related к transposition, the non-transposition obtains the row число, и the transposed таблица obtains the column число).

Note: списоктаблица specific интерфейс

```

/\*\*

- Get the index row число или column число displayed в the таблица according к the поле из the данные source (Related к transposition, the non-transposition obtains the row число, и the transposed таблица obtains the column число).

Note: списоктаблица specific интерфейс

- @param recordIndex
  \*/
  getтаблицаIndexByполе: (поле: полеDef) => число;

```

## getRecordShowIndexByCell(функция)

Get the index из the текущий cell данные в the body part, that is, remove the index из the header level число по the row и column число.(Related к transpose, the non-transpose gets the body row число, и the transpose таблица gets the body column число)

**списоктаблица proprietary**

```

/\*_ Get the display index из the текущий cell в the body part,it is ( row / col )- headerLevelCount. Note: списоктаблица specific интерфейс _/
getRecordShowIndexByCell(col: число, row: число): число

```

## getCellAddrByполеRecord(функция)

Get the cell row и column число based на the index и поле в the данные source.

Note: списоктаблица specific интерфейс

```

/\*\*

- Get the cell row и column число based на the index и поле в the данные source. Note: списоктаблица specific интерфейс
- @param поле
- @param recordIndex
- @returns
  \*/
  getCellAddrByполеRecord: (поле: полеDef, recordIndex: число) => CellAddress;

```

## getCellOriginRecord(функция)

Get the source данные item из this cell.

If it is a normal таблица, the source данные объект will be returned.

If it is a сводный analysis таблица (a сводный таблица с данные analysis turned на), an массив из source данные will be returned.

```

/\*\*

- Get source данные based на row и column numbers
- @param {число} col col index.
- @param {число} row row index.
- @возврат {объект} record или record массив. списоктаблица возврат one record, сводныйтаблица возврат an массив из records.
  \*/
  getCellOriginRecord(col: число, row: число)

```

## getAllCells(функция)

Get все cell context information

```

/\*\*

- :: Obtain information на все cell данные
- @param colMaxCount Limit the число из columns к be fetched.
- @param rowMaxCount Limit the число из rows к be fetched.
- @returns CellInfo[][]
  \*/
  getAllCells(colMaxCount?: число, rowMaxCount?: число) => CellInfo[][];

```

## getAllBodyCells(функция)

Get все body cell context information

```

/\*\*

- :: Get все body cell context information
- @param colMaxCount Limit the число из columns к be fetched.
- @param rowMaxCount Limit the число из rows к be fetched.
- @returns CellInfo[][]
  \*/
  getAllBodyCells(colMaxCount?: число, rowMaxCount?: число) => CellInfo[][];

```

## getAllColumnHeaderCells(функция)

Get все список header cell context information

```

/\*\*

- :: Obtain information на все список header cell данные
- @returns CellInfo[][]
  \*/
  getAllColumnHeaderCells(colMaxCount?: число, rowMaxCount?: число) => CellInfo[][];

```

## getAllRowHeaderCells(функция)

Get все row header cell context information

```

/\*\*

- :: Obtain все row header cell context information
- @returns CellInfo[][]
  \*/
  getAllRowHeaderCells(colMaxCount?: число, rowMaxCount?: число) => CellInfo[][];

```

## getCellOverflowText(функция)

Get the текст из the cell с omitted текст.

```

/\*\*

- :: Obtaining the текст content из cells с omitted текст
- :: cellTextOverflows stores values для which full текст cannot be displayed, для use по Подсказка
- @param {число} col column index.
- @param {число} row row index
- @возврат {строка | null}
  \*/
  getCellOverflowText(col: число, row: число) => строка | null

```

## getCellRect(функция)

Get the specific позиция из the cell в the entire таблица.

```

/\*\*

- Get the range из cells. The возврат значение is Rect тип. Regardless из whether it is a merged cell, the coordinates начало от 0
- @param {число} col column index
- @param {число} row row index
- @returns {Rect}
  \*/
  getCellRect(col: число, row: число): Rect

```

## getCellRelativeRect(функция)

Get the specific позиция из the cell в the entire таблица. Relative позиция is based на the upper лево corner из the таблица (прокрутка condition minus прокрутка значение)

```

/\*\*

- The obtained позиция is relative к the upper лево corner из the таблица display интерфейс. в case из scrolling, if the cell has rolled out из the верх из the таблица, the y из this cell will be a negative значение.
- @param {число} col index из column, из the cell
- @param {число} row index из row, из the cell
- @returns {Rect} the rect из the cell.
  \*/
  getCellRelativeRect(col: число, row: число): Rect

```

## getCellRange(функция)

Gets the merge range для the cell

```

/\*\*

- @param {число} col column index
- @param {число} row row index
- @returns {Rect}
  \*/
  getCellRange(col: число, row: число): CellRange

export интерфейс CellRange {
начало: CellAddress;
конец: CellAddress;
}

export интерфейс CellAddress {
col: число;
row: число;
}

```

## getCellHeaderPaths(функция)

Get the path к the row список header

```

/\*\*

- :: Get the path к the header из the line список
- @param col
- @param row
- @returns ICellHeaderPaths
  \*/
  getCellHeaderPaths(col: число, row: число) => ICellHeaderPaths

```

{{ use: ICellHeaderPaths() }}

## getCellHeaderTreeNodes(функция)

Obtain the header tree node based на the row и column число, which includes the user's пользовательский attributes на the пользовательский tree rowTree и columnTree trees (it is also the node из the internal макет tree, please do не modify it в will after obtaining it).Under normal circumstances, just use getCellHeaderPaths.

```

/\*\*

- Obtain the header tree node based на the row и column число, which includes the user's пользовательский attributes на the пользовательский tree rowTree и columnTree trees (it is also the node из the internal макет tree, please do не modify it в will after obtaining it)
- @param col
- @param row
- @returns ICellHeaderPaths
  \*/
  getCellHeaderTreeNodes(col: число, row: число)=> ICellHeaderPaths

```

## getCellAddress(функция)

Get the row и column число из a piece из данные в the body based на the данные и поле attribute поле имяs. Currently only the базовый таблица списоктаблица is supported.

```

/\*_
The _ method is used к get the row и column число из a piece из данные в the body.

- @param findTargetRecord Calculates the index из a данные entry от a данные объект или a specified функция.
- @param поле
- @returns
  \*/
  getCellAddress(findTargetRecord: любой | ((record: любой) => логический), поле: полеDef) => CellAddress

```

## getCellAddressByHeaderPaths(функция)

для сводный таблица interfaces, get specific cell addresses based на the header dimension path к be matched.

```

/\*\*

- :: Calculation из cell positions through dimension значение paths в таблица headers
- @param dimensionPaths
- @returns
  \*/
  getCellAddressByHeaderPaths(
  dimensionPaths.
  | {
  colHeaderPaths: IDimensionInfo[].
  rowHeaderPaths: IDimensionInfo[];
  }
  | IDimensionInfo[]
  ) => CellAddress

```

## getScrollTop(функция)

Get the текущий vertical прокрутка позиция

## getScrollLeft(функция)

Get the текущий horizontal прокрутка позиция

## setScrollTop(функция)

Set the vertical прокрутка позиция (the rendering интерфейс will be updated)

## setScrollLeft(функция)

Set the horizontal прокрутка позиция (the rendering интерфейс will be updated)

## scrollToCell(функция)

прокрутка к a specific cell location

```

/\*\*

- :: Scrolling к a specific cell location
- @param cellAddr The cell позиция к прокрутка к.
  \*/
  scrollToCell(cellAddr: { col?: число; row?: число })=>void

```

## toggleHierarchyState(функция)

Tree развернуть и свернуть state switch

```

/\*\*

- Header switches level status
- @param col
- @param row
- @param recalculateColширинаs Whether к recalculate the column ширина. по умолчанию is true. (Case when has set ширина:авто или автоширина is necessary к consider this параметр)
  \*/
  toggleHierarchyState(col: число, row: число,recalculateColширинаs: логический = true)

```

## getHierarchyState(функция)

Get the tree-shaped expanded или collapsed status из a certain cell

```

/\*\*

- Get the collapsed и expanded status из hierarchical nodes
- @param col
- @param row
- @returns
  \*/
  getHierarchyState(col: число, row: число) : HierarchyState | null;

enum HierarchyState {
развернуть = 'развернуть',
свернуть = 'свернуть',
никто = 'никто'
}

```

## getмакетRowTree(функция)

**сводныйтаблица Proprietary**

Get the таблица row header tree structure

```

/\*\*

- Get the таблица row tree structure
- @returns
  \*/
  getмакетRowTree() : макетTreeNode[]

```

## getмакетRowTreeCount(функция)

**сводныйтаблица Proprietary**

Get the total число из nodes occupying the таблица row header tree structure.

Note: The logic distinguishes between flat и tree hierarchies.

```

/\*\*

- Get the total число из nodes occupying the таблица row header tree structure.
- @returns
  \*/
  getмакетRowTreeCount() : число

```

## getмакетColumnTree(функция)

**сводныйтаблица Exclusive**

Get the таблица column header tree structure

```

/\*\*

- Get the таблица column header tree structure
- @returns
  \*/
  getмакетColumnTree() : макетreeNode[]

```

## getмакетColumnTreeCount(функция)

**сводныйтаблица Exclusive**

Get the total число из nodes occupying the таблица column header tree structure.

```

/\*\*

- Get the total число из nodes occupying the таблица column header tree structure.
- @returns
  \*/
  getмакетColumnTreeCount() : число

```

## updateсортировкаState(функция)

Update the сортировка status, списоктаблица exclusive

```

/\*\*

- Update сортировка status
- @param сортировкаState the сортировкаing state к be set
- @param executeсортировка Whether к execute the internal сортировкаing logic, setting false will only update the иконка state
  \*/
  updateсортировкаState(сортировкаState: сортировкаState[] | сортировкаState | null, executeсортировка: логический = true)

```

## updateсортировкаRules(функция)

сводный таблица update сортировкаing rules, exclusive к сводныйтаблица

```

/\*\*

- Full update из сортировкаing rules
- @param сортировкаRules
  \*/
  updateсортировкаRules(сортировкаRules: сортировкаRules)

```

## updateсводныйсортировкаState(функция)

Update сортировка status, The vтаблица itself does не perform сортировкаing logic. сводныйтаблица exclusive

```

/\*\*

- Update сортировка status
- @param сводныйсортировкаStateConfig.dimensions сортировкаing state dimension correspondence; сводныйсортировкаStateConfig.order сортировкаing state
  \*/
  updateсводныйсортировкаState(сводныйсортировкаStateConfig: {
  dimensions: IDimensionInfo[];
  порядок: сортировкаOrder;
  }[])

```

The таблица will не be redrawn автоmatically after updating, и the интерфейс renderWithRecreateCells needs к be configured к refresh

## setDropDownменюHighlight(функция)

Set the selected state из the отпускание-down меню. The cell will also display the corresponding иконка

```

setDropDownменюHighlight(dropDownменюInfo: DropDownменюHighlightInfo[]): void

```

## showПодсказка(функция)

показать Подсказка information prompt box

```

/\*\*

- Display Подсказка information prompt box
- @param col The column число из the cell where the prompt box is displayed
- @param row The row число из the cell where the prompt box is displayed
- @param ПодсказкаOptions Подсказка content configuration
  \*/
  showПодсказка(col: число, row: число, ПодсказкаOptions?: ПодсказкаOptions) => void

```

Note: для the time being, it only supports setting Подсказка.renderMode='html' globally, и calling this интерфейс is valid

If you want the Подсказка к be навести по the mouse, you need к configure the интерфейс Подсказка.disappearDelay so that it does не disappear immediately.

Where the ПодсказкаOptions тип is:

```

/** Display всплывающее окно prompt content \*/
export тип ПодсказкаOptions = {
/** Подсказка content _/
content: строка;
/\*\* The позиция из the Подсказка box has priority over referencePosition _/
позиция?: { x: число; y: число };
/** The reference позиция из the Подсказка box If the позиция is set, the configuration will не take effect \*/
referencePosition?: {
/** The reference позиция is set к a rectangular boundary, и the placement is set к specify the orientation в the boundary позиция*/
rect: RectProps;
/\*\* Specify the orientation в the boundary позиция */
placement?: Placement;
};
/** Need пользовательский style к specify classимя dom Подсказка к take effect \*/
classимя?: строка;
/** Set the Подсказка style _/
style?: {
bgColor?: строка;
шрифт?: строка;
цвет?: строка;
заполнение?: число[];
arrowMark?: логический;
};
/\*\* set Подсказка's vanishing time _/
disappearDelay?: число;
};

```

## showDropdownменю(функция)
Display выпадающий список меню, the content can be the меню items already set в the option, или display specific dom content. Use [демонстрация](../демонстрация/компонент/выпадающий список)
```

/\*\*

- Display выпадающий список меню
- @param col The column число из the cell where the выпадающий список меню is displayed
- @param row The row число из the cell where the выпадающий список меню is displayed
- @param менюOptions The content configuration из the выпадающий список меню
  \*/
  showDropdownменю(col: число, row: число, менюOptions?: DropDownменюOptions) => void;

/** Display выпадающий список меню settings или display specific dom content \*/
export тип DropDownменюOptions = {
// менюсписок?: менюсписокItem[];
content: HTMLElement | менюсписокItem[];
позиция?: { x: число; y: число };
referencePosition?: {
rect: RectProps;
/** Currently, the выпадающий список меню иконка is aligned к the право, but the specified позиция is не yet implemented \*/
placement?: Placement;
};
};

```
## updateFilterRules(функция)

Update данные filtering rules

```

/\*_ Update данные filtering rules _/
updateFilterRules(filterRules: FilterRules) => void

```

use case: для the сводныйграфик scene, after Нажатьing the легенда item, update the filter rules к update the график

## getFilteredRecords(функция)

Get filtered данные

**Exclusive к сводныйтаблица**

## setлегендаSelected(функция)

Sets the selection state из the легенда.

Note: After setting, if you need к synchronize the state из the график, you need к use the updateFilterRules интерфейс

```

/\*_ Set the selection state из the легенда. After setting, the status из the synchronization график needs к be used в conjunction с the updateFilterRules интерфейс _/
setлегендаSelected(selectedданные: (строка | число)[])

```

## getграфикDatumPosition(функция)

Get the позиция из a certain primitive на the график

```

/\*\*

- Get the позиция из a certain primitive на the график
- @param datum данные corresponding к the primitive
- @param cellHeaderPaths header path из the cell
- @returns The coordinate позиция из the primitive на the entire таблица (relative к the visual coordinates из the upper лево corner из the таблица)
  \*/
  getграфикDatumPosition(datum:любой,cellHeaderPaths:IсводныйтаблицаCellHeaderPaths):{x:число,y:число}

```

## exportImg(функция)

Export a picture из the currently видимый area в the таблица.

```

/\*\*

- Export pictures из the currently видимый area в the таблица
- @returns base64 picture
  \*/
  exportImg(): строка

```

## exportCellImg(функция)

Export a cell picture

```

/\*\*

- Export a cell picture
- @returns base64 picture
  \*/
  exportCellImg(col: число, row: число, options?: { disableBackground?: логический; disableBorder?: логический }): строка

```

## exportCellRangeImg(функция)

Export a picture из a certain cell range

```

/\*\*

- Export pictures из a certain area
- @returns base64 picture
  \*/
  exportCellRangeImg(cellRange: CellRange): строка

```

## changeCellValue(функция)

Change the значение из a cell:

```

/\*_ Set the значение из the cell. Note that it corresponds к the original значение из the source данные, и the vтаблица instance records will be modified accordingly _/
changeCellValue: (col: число, row: число, значение: строка | число | null, workOnEdiтаблицаCell = false, triggerсобытие = true) => void;

```

## changeCellValues(функция)

Change the значение из cells в batches:

```

/\*\*

- Batch update данные из multiple cells
- @param col The starting column число из pasted данные
- @param row The starting row число из pasted данные
- @param values данные массив из multiple cells
  \*/
  changeCellValues(startCol: число, startRow: число, values: строка[][], workOnEdiтаблицаCell = false, triggerсобытие=true) => void;

```

## getEditor(функция)

Get the editor для the cell configuration

```

/\*_ Get the editor из cell configuration _/
getEditor: (col: число, row: число) => IEditor;

```

## startEditCell(функция)

включить cell editing.

If you want к change the значение displayed в the edit box, Вы можете configure the значение к set the change

```

/\*_ включить cell editing _/
startEditCell: (col?: число, row?: число, значение?: строка | число) => void;

```

## completeEditCell(функция)

конец editing

```

/\*_ конец editing _/
completeEditCell: () => void;

```

## records

Get все данные из the текущий таблица

## данныеSource(CachedданныеSource)

Set the данные source для the Vтаблица таблица компонент instance. для specific usвозраст, please refer к [Asynchronous данные lazy загрузка демонстрация](../демонстрация/Производительность/async-данные) и [Tutorial](../guide/данные/async_данные)

## addRecords(функция)

Add данные, support multiple pieces из данные

**Note: списоктаблица specific интерфейс**

```

/\*\*

- Add данные к support multiple pieces из данные
- @param records multiple данные
- @param recordIndex The позиция к be inserted into the данные source, starting от 0. If recordIndex is не set, it will be appended к the конец по по умолчанию. в the tree (group) structure, recordIndex may be an массив, representing the index из каждый node от the root node.
- If the сортировкаing rule recordIndex is set к be invalid, the сортировкаing logic will be автоmatically adapted к determine the insertion order.
- recordIndex can be obtained through the интерфейс getRecordShowIndexByCell
  \*/
  addRecords(records: любой[], recordIndex?: число | число[])

```

## addRecord(функция)

Add данные, single piece из данные

**Note: списоктаблица specific интерфейс**

```

/\*\*

- Add данные single данные
- @param record данные
- @param recordIndex The позиция к be inserted into the данные source, starting от 0. If recordIndex is не set, it will be appended к the конец по по умолчанию. в the tree (group) structure, recordIndex may be an массив, representing the index из каждый node от the root node.
- If the сортировкаing rule recordIndex is set к be invalid, the сортировкаing logic will be автоmatically adapted к determine the insertion order.
- recordIndex can be obtained through the интерфейс getRecordShowIndexByCell
  \*/
  addRecord(record: любой, recordIndex?: число | число[])

```

## deleteRecords(функция)

Delete данные supports multiple pieces из данные

**Note: списоктаблица specific интерфейс**

```

/\*\*

- Delete данные supports multiple pieces из данные
- @param recordIndexs The index из the данные к be deleted (the entry index displayed в the body), в the tree (group) structure, recordIndex may be an массив, representing the index из каждый node от the root node.
  \*/
  deleteRecords(recordIndexs: число[] | число[][])

```

## updateRecords(функция)

Modify данные к support multiple pieces из данные

**списоктаблица proprietary**

```

/\*\*

- Modify данные к support multiple pieces из данные
- @param records Modify данные entries
- @param recordIndexs The index corresponding к the modified данные (the index displayed в the body, that is, which row из данные в the body part is к be modified), в the tree (group) structure, recordIndex may be an массив, representing the index из каждый node от the root node.
  \*/
  updateRecords(records: любой[], recordIndexs: число[] | число[][])

```

## getBodyVisibleCellRange(функция)

Get the display cell range из the таблица body part

```

/\*_ Get the display cell range из the таблица body _/
getBodyVisibleCellRange: () => { rowStart: число; colStart: число; rowEnd: число; colEnd: число };

```

## getBodyVisibleColRange(функция)

Get the displayed column число range в the body part из the таблица

```

/\*_ Get the displayed column число range в the body part из the таблица _/
getBodyVisibleColRange: () => { colStart: число; colEnd: число };

```

## getBodyVisibleRowRange(функция)

Get the displayed row число range из the таблица body part

```

/\*_ Get the displayed row число range из the таблица body _/
getBodyVisibleRowRange: () => { rowStart: число; rowEnd: число };

```

## getAggregateValuesByполе(функция)

Get aggregation summary значение

```

/\*\*

- Get the aggregate значение based на the поле
- @param поле поле имя
- Returns an массив, including the column число и the aggregate значение массив из каждый column
  \*/
  getAggregateValuesByполе(поле: строка | число)

```

**списоктаблица Proprietary**

## isAggregation(функция)

Determine whether it is an aggregate cell

```

isAggregation(col: число, row: число): логический

```

**списоктаблица Proprietary**

## регистрацияпользовательскийCellStyle(функция)

регистрация a пользовательский style

```

регистрацияпользовательскийCellStyle: (пользовательскийStyleId: строка, пользовательскийStyle: ColumnStyleOption | undefined | null) => void

```

пользовательский cell style

- пользовательскийStyleId: the unique id из the пользовательский style
- пользовательскийStyle: пользовательский cell style, which is the same as the `style` configuration в `column`. The final rendering effect is the fusion из the original style из the cell и the пользовательский style.

## arrangeпользовательскийCellStyle(функция)

Assign пользовательский styles

```

arrangeпользовательскийCellStyle: (cellPosition: { col?: число; row?: число; range?: CellRange }, пользовательскийStyleId: строка) => void

```

- cellPosition: cell позиция information, supports configuration из single cells и cell areas
  - Single cell: `{ row: число, col: число }`
  - Cell range: `{ range: { начало: { row: число, col: число }, конец: { row: число, col: число} } }`
- пользовательскийStyleId: пользовательский style id, the same as the id defined when регистрацияing the пользовательский style

## getCheckboxState(функция)

Get the selected status из все данные в the флажок under a certain поле. The order corresponds к the original incoming данные records. It does не correspond к the status значение из the row displayed в the таблица.

```

getCheckboxState(поле?: строка | число): массив

```

## getCellCheckboxState(функция)

Get the status из a cell флажок

```

getCellCheckboxState(col: число, row: число): массив

```

## getRadioState(функция)

Get the selected status из все переключатель данные under a certain поле. The order corresponds к the original incoming данные records. It does не correspond к the status значение из the row displayed в the таблица.

```

getRadioState(поле?: строка | число): число | Record<число, логический | число>

```

## getCellRadioState(функция)

Get the status из a cell переключатель. If a cell contains multiple переключатель Кнопкаs, the возврат значение is число, which refers к the index из the selected переключатель в the cell. Otherwise, the возврат значение is логический.

```

getCellRadioState(col: число, row: число): логический | число

```

## setCellCheckboxState(функция)

Set the флажок state из a cell

```

setCellCheckboxState(col: число, row: число, checked: логический) => void

```

- col: column число
- row: row число
- checked: whether checked

## setCellRadioState(функция)

Set the cell's переключатель state к selected

```

setCellRadioState(col: число, row: число, index?: число) => void

```

- col: column число
- row: row число
- index: the index из the updated target переключатель в the cell

## getSwitchState(функция)

Get the selected status из все switch данные under a certain поле. The order corresponds к the original incoming данные records. It does не correspond к the status значение из the row displayed в the таблица.

```

getSwitchState(поле?: строка | число): массив

```

## getCellSwitchState(функция)

Get the status из a cell switch

```

getCellSwitchState(col: число, row: число): логический

```

## setCellSwitchState(функция)

Set the switch state из a cell

```

setCellSwitchState(col: число, row: число, checked: логический) => void

```

- col: column число
- row: row число
- checked: whether checked

## getAllRowsвысота(функция)

get все rows высота

```

getAllRowsвысота: () => число;

```

## getAllColsширина(функция)

get все columns ширина

```

getAllColsширина: () => число;

```

## getColsширинаs(функция)

get все columns ширина список

```

getColsширинаs: () => число[];

```

## setсортировкаedIndexMap(функция)

Set up a pre-сортировка index к improve initial сортировкаing Производительность в scenarios where large amounts из данные are сортировкаed.

```

setсортировкаedIndexMap: (поле: полеDef, filedMap: IсортировкаedMапиtem) => void;

интерфейс IсортировкаedMапиtem {
asc?: (число | число[])[];
desc?: (число | число[])[];
normal?: (число | число[])[];
}

```

## getHeaderполе(функция)

в **списоктаблица** can get header's поле.
в **сводныйтаблица** get indicatorKey.

```

/\*_get поле из header _/
getHeaderполе: (col: число, row: число)

```

## getColширина(функция)

get column ширина.

```

/\*_get column ширина _/
getColширина: (col: число)

```

## getRowвысота(функция)

get row высота.

```

/\*_get row высота _/
getRowвысота: (row: число)

```

## setColширина(функция)

set column ширина.

```

/\*_set column ширина _/
setColширина: (col: число, ширина: число)

```

## setRowвысота(функция)

set row высота.

```

/\*_set row высота _/
setRowвысота: (row: число, высота: число)

```

## cellIsInVisualView(функция)

Determines whether the cell is в the видимый area из the cell. If the cell is completely в the видимый area, it returns true. If part или все из the cell is outside the видимый area, it returns false.

```

cellIsInVisualView(col: число, row: число)

```

## getCellAtRelativePosition(функция)

Gets the cell позиция relative к the upper лево corner из the таблица.

в the case из scrolling, the cells obtained are those after scrolling. для пример, if the currently displayed rows are 100-120, the cell позиция relative к the upper лево corner из the таблица (10,100) is (первый column, 103rd row), assuming the row высота is 40px.

```

/\*\*

- Get the cell information corresponding к the screen coordinates, taking scrolling into account
- @param this
- @param relativeX The лево x значение, relative к the upper лево corner из the container, taking into account the scrolling из the grid
- @param relativeY The лево y значение, relative к the upper лево corner из the container, taking into account the scrolling из the grid
- @returns
  \*/
  getCellAtRelativePosition(relativeX: число, relativeY: число): CellAddressWithBound

```

## showMoverLine(функция)

Displays a highlighted line для moving columns или rows

```

/\*\*

- Display the highlight line из the moving column или row If the (col, row) cell is the column header, the highlight column line is displayed; If the (col, row) cell is the row header, the highlight row line is displayed
- @param col Which column в the таблица header should be highlighted after?
- @param row The row after which the highlighted line is displayed
  \*/
  showMoverLine(col: число, row: число)

```

## hiдемонстрацияverLine(функция)

скрыть the highlight line из the moved column или row

```

/\*\*

- скрыть the highlight line из the moved column или row
- @param col
- @param row
  \*/
  hiдемонстрацияverLine(col: число, row: число)

```

## disableScroll(функция)

закрыть the scrolling из the таблица. If you do не want the таблица content к прокрутка в the business scenario, Вы можете call this method.

```

/\*_ Turn off scrolling из the таблица _/
disableScroll() {
this.событиеManвозрастr.disableScroll();
}

```

## enableScroll(функция)

включить scrolling из the таблица

```

/\*_ включить scrolling из the таблица _/
enableScroll() {
this.событиеManвозрастr.enableScroll();
}

```

## setCanvasSize(функция)

Directly set the ширина и высота из the canvas instead из determining the размер из the таблица based на the container ширина и высота

```

/\*_ Directly set the ширина и высота из the canvas instead из determining the размер из the таблица based на the ширина и высота из the container _/
setCanvasSize: (ширина: число, высота: число) => void;

```

## setLoadingHierarchyState(функция)

Set the загрузка state из the tree expansion и свернуть из the cell, Note that you need к manually регистрация the загрузка иконка before using it.

```

// регистрация the загрузка иконка
Vтаблица.регистрация.иконка('загрузка', {
тип: 'imвозраст',
ширина: 16,
высота: 16,
src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/загрузка-circle.gif',
имя: 'загрузка', // Define the имя из the иконка, which will be used as the key значение для caching в the internal cache
positionType: Vтаблица.TYPES.иконкаPosition.absoluteRight, // Specify the позиция, which can be before или after the текст, или лево или право из the cell
marginLeft: 0, // The лево content interval в the specific позиция
marginRight: 4, // The право content interval в the specific позиция
visibleTime: 'always', // The display time, 'always' | 'mouseover_cell' | 'Нажать_cell'
навести: {
// The размер из the hot area
ширина: 22,
высота: 22,
bgColor: 'rgba(101,117,168,0.1)'
},
isGif: true
});

/\*_ Set the загрузка state из the tree expansion и свернуть из the cell _/
setLoadingHierarchyState: (col: число, row: число) => void;

```

## setPixelRatio(функция)

Sets the pixel ratio из the canvas. The по умолчанию internal logic is window.devicePixelRatio. If the drawing feels fuzzy, try setting this значение higher.

The pixelRatio can be obtained directly от the instance's pixelRatio property.

```

/\*_ Set the canvas pixel ratio _/
setPixelRatio: (pixelRatio: число) => void;

````

## expandAllTreeNode(функция)

развернуть все tree nodes (including headers и данные rows).

**списоктаблица Proprietary**

```ts
  /**
   * развернуть все tree nodes (including headers и данные rows).
   */
  expandAllTreeNode(): void
````

Usвозраст:

```ts
// развернуть все nodes
таблицаInstance.expandAllTreeNode();
```

## collapseAllTreeNode(функция)

свернуть все tree nodes (including headers и данные rows).

**списоктаблица Proprietary**

```ts
  /**
   * свернуть все tree nodes (including headers и данные rows).
   */
  collapseAllTreeNode(): void
```

Usвозраст:

```ts
// свернуть все nodes
таблицаInstance.collapseAllTreeNode();
```
