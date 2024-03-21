import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

const handleClick = instance => {
  const arr: any[] = [];
  for (let i = 1; i <= 31; i++) {
    arr.push({
      field: i + '',
      title: i + ''
    });
  }

  const rows: any[] = [];
  for (let i = 0; i < 5; i++) {
    const obj = {};
    for (let x = 0; x < arr.length; x++) {
      obj[arr[x].field] = '';
    }
    rows.push(obj);
  }

  instance.updateColumns(arr);
  // instance.setRecords(rows);
};

const setData = () => {
  const cols: any[] = [];
  for (let i = 1; i <= 30; i++) {
    const obj = {
      field: i + '',
      title: i + ''
    };
    cols.push(obj);
  }
  const rows: any[] = [];
  for (let i = 0; i < 5; i++) {
    const obj = {};
    for (let x = 0; x < cols.length; x++) {
      obj[cols[x].field] = '';
    }

    rows.push(obj);
  }

  return {
    records: rows,
    columns: cols
  };
};

export function createTable() {
  const { records, columns } = setData();
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    widthMode: 'autoWidth',
    columnResizeMode: 'header',
    defaultRowHeight: 40,
    defaultHeaderRowHeight: 40,
    // maxCharactersNumber: 20,
    defaultColWidth: 200,
    limitMinWidth: 200,

    select: {
      headerSelectMode: 'cell'
    },
    keyboardOptions: {
      moveEditCellOnArrowKeys: true,
      copySelected: true,
      pasteValueToCell: true
    }
  };

  const instance = new ListTable(option);

  bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  window.update = () => {
    handleClick(instance);
  };

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
