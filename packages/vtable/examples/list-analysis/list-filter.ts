import * as VTable from '../../src';
const CONTAINER_ID = 'vTable';
const generatePersons = (count: number) => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing'
  }));
};

export function createTable() {
  const controlDom = document.createElement('div');
  controlDom.style.position = 'fixed';
  controlDom.style.right = '12px';
  controlDom.style.bottom = '12px';
  controlDom.style.zIndex = '9999';
  controlDom.style.padding = '10px 12px';
  controlDom.style.background = 'rgba(0,0,0,0.65)';
  controlDom.style.color = '#fff';
  controlDom.style.fontSize = '12px';
  controlDom.style.whiteSpace = 'pre';
  controlDom.style.display = 'flex';
  controlDom.style.flexDirection = 'column';
  controlDom.style.gap = '8px';

  const buttonRowDom = document.createElement('div');
  buttonRowDom.style.display = 'flex';
  buttonRowDom.style.flexWrap = 'wrap';
  buttonRowDom.style.gap = '6px';

  const statusDom = document.createElement('div');
  statusDom.style.whiteSpace = 'pre';
  statusDom.textContent = 'source-change test: ready';

  const createButton = (text: string, onClick: () => void) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cursor = 'pointer';
    btn.style.padding = '4px 8px';
    btn.style.border = '1px solid rgba(255,255,255,0.35)';
    btn.style.borderRadius = '4px';
    btn.style.background = 'rgba(255,255,255,0.12)';
    btn.style.color = '#fff';
    btn.addEventListener('click', onClick);
    return btn;
  };

  controlDom.appendChild(buttonRowDom);
  controlDom.appendChild(statusDom);
  document.body.appendChild(controlDom);

  const records = generatePersons(1000000);
  const columns: VTable.ColumnsDefine = [
    {
      field: '',
      title: '行号',
      width: 80,
      fieldFormat(data: any, col?: number, row?: number, table?: any) {
        return (row ?? 0) - 1;
      }
    },
    {
      field: 'id',
      title: 'ID',
      width: '1%',
      minWidth: 200,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    // dataConfig: {
    //   filterRules: [
    //     {
    //       filterFunc: (record: Record<string, any>) => {
    //         return record.id % 2 === 0;
    //       }
    //     }
    //   ]
    // },
    columns,
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    frozenColCount: 1,
    bottomFrozenRowCount: 2,
    rightFrozenColCount: 2,
    overscrollBehavior: 'none',
    autoWrapText: true,
    heightMode: 'autoHeight',
    dragHeaderMode: 'all',
    keyboardOptions: {
      pasteValueToCell: true
    },
    eventOptions: {
      preventDefaultContextMenu: false
    },
    pagination: {
      perPageCount: 100,
      currentPage: 0
    }
    // widthMode: 'adaptive'
  };
  const tableInstance = new VTable.ListTable(option);

  const targetSourceIndex = 3;

  const undoStack: {
    changes: {
      recordIndex: number | number[];
      field: any;
      before: string | number;
      after: string | number;
    }[];
  }[] = [];

  const redoStack: {
    changes: {
      recordIndex: number | number[];
      field: any;
      before: string | number;
      after: string | number;
    }[];
  }[] = [];

  let suppressRecord = false;

  const updateStatus = () => {
    const filteredCount = tableInstance.getFilteredRecords().length;
    const sortState = tableInstance.sortState;
    const sortText =
      sortState && !Array.isArray(sortState) && sortState.order && sortState.order !== 'normal'
        ? `${sortState.field}:${sortState.order}`
        : Array.isArray(sortState) && sortState.length
        ? sortState.map(s => `${s.field}:${s.order}`).join(',')
        : 'none';
    const record = records[targetSourceIndex];
    statusDom.textContent = `filtered=${filteredCount}
sort=${sortText}
undo=${undoStack.length} redo=${redoStack.length}
record[${targetSourceIndex}].id=${record?.id} sex=${record?.sex}`;
  };

  const applyFilter = () => {
    tableInstance.updateFilterRules([
      {
        filterKey: 'sex',
        filteredValues: ['boy']
      }
    ]);
    updateStatus();
  };

  const clearFilter = () => {
    tableInstance.updateFilterRules([] as any);
    updateStatus();
  };

  const applySort = () => {
    tableInstance.updateSortState({
      field: 'id',
      order: 'desc'
    });
    updateStatus();
  };

  const clearSort = () => {
    tableInstance.updateSortState(null);
    updateStatus();
  };

  const runSourceChangeTest = () => {
    const before = tableInstance.getFilteredRecords().length;

    tableInstance.changeCellValuesByRecords(
      [
        {
          recordIndex: targetSourceIndex,
          field: 'sex',
          value: 'boy'
        },
        {
          recordIndex: targetSourceIndex,
          field: 'id',
          value: 99999999
        }
      ],
      {
        triggerEvent: true,
        silentChangeCellValuesEvent: false,
        autoRefresh: true
      }
    );

    const after = tableInstance.getFilteredRecords().length;
    const changedRecord = records[targetSourceIndex];
    const ok = changedRecord.sex === 'boy' && changedRecord.id === 3;
    statusDom.textContent = `${statusDom.textContent}\n\nsource-change: before=${before} after=${after} updated=${ok}`;
  };

  const resetTargetRecord = () => {
    tableInstance.changeCellValuesByRecords(
      [
        {
          recordIndex: targetSourceIndex,
          field: 'sex',
          value: 'girl'
        },
        {
          recordIndex: targetSourceIndex,
          field: 'id',
          value: 4
        }
      ],
      {
        triggerEvent: true,
        silentChangeCellValuesEvent: false,
        autoRefresh: true
      }
    );
    updateStatus();
  };

  const undo = () => {
    const entry = undoStack.pop();
    if (!entry) {
      return;
    }
    suppressRecord = true;
    tableInstance.changeCellValuesByRecords(
      entry.changes.map(change => ({
        recordIndex: change.recordIndex,
        field: change.field,
        value: change.before
      })),
      {
        triggerEvent: true,
        silentChangeCellValuesEvent: false,
        autoRefresh: true
      }
    );
    suppressRecord = false;
    redoStack.push(entry);
    updateStatus();
  };

  const redo = () => {
    const entry = redoStack.pop();
    if (!entry) {
      return;
    }
    suppressRecord = true;
    tableInstance.changeCellValuesByRecords(
      entry.changes.map(change => ({
        recordIndex: change.recordIndex,
        field: change.field,
        value: change.after
      })),
      {
        triggerEvent: true,
        silentChangeCellValuesEvent: false,
        autoRefresh: true
      }
    );
    suppressRecord = false;
    undoStack.push(entry);
    updateStatus();
  };

  buttonRowDom.appendChild(createButton('Apply Filter', applyFilter));
  buttonRowDom.appendChild(createButton('Clear Filter', clearFilter));
  buttonRowDom.appendChild(createButton('Apply Sort(id desc)', applySort));
  buttonRowDom.appendChild(createButton('Clear Sort', clearSort));
  buttonRowDom.appendChild(createButton('Run Source Change', runSourceChangeTest));
  buttonRowDom.appendChild(createButton('Reset Target', resetTargetRecord));
  buttonRowDom.appendChild(createButton('Undo', undo));
  buttonRowDom.appendChild(createButton('Redo', redo));

  updateStatus();
  (window as any).tableInstance = tableInstance;
  tableInstance.on('change_cell_values', (arg: any) => {
    if (suppressRecord) {
      return;
    }
    const values = arg?.values || [];
    const changes = values
      .filter((v: any) => v && v.recordIndex !== undefined && v.field !== undefined && v.rawValue !== v.changedValue)
      .map((v: any) => ({
        recordIndex: v.recordIndex as number | number[],
        field: v.field,
        before: v.rawValue as string | number,
        after: v.changedValue as string | number
      }));
    if (!changes.length) {
      return;
    }
    undoStack.push({ changes });
    redoStack.length = 0;
  });
}
