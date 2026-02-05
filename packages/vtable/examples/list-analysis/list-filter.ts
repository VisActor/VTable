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

  const createCheckbox = (text: string, initialChecked: boolean, onChange: (checked: boolean) => void) => {
    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '6px';
    label.style.cursor = 'pointer';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = initialChecked;
    input.addEventListener('change', () => onChange(input.checked));

    const span = document.createElement('span');
    span.textContent = text;

    label.appendChild(input);
    label.appendChild(span);
    return { label, input };
  };

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
    syncRecordOperationsToSourceRecords: true,
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
      preventDefaultContextMenu: true
    },
    menu: {
      renderMode: 'html',
      contextMenuItems: [
        {
          text: '向下插入行数…',
          menuKey: 'INSERT_ROW_BELOW'
        },
        '向下插入空行',
        '向右插入空列',
        '删除该行'
      ],
      contextMenuWorkOnlyCell: true
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
  let syncRecordOpsToSourceRecordsForTest = true;

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
record[${targetSourceIndex}].id=${record?.id} sex=${record?.sex}
syncRecordOpsToSourceRecordsForTest=${syncRecordOpsToSourceRecordsForTest}`;
  };

  const applyFilter = () => {
    tableInstance.updateFilterRules([
      {
        filterKey: 'sex',
        filteredValues: ['boy']
      },
      {
        filterKey: 'id',
        filteredValues: [3]
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
        noTriggerChangeCellValuesEvent: false,
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
        noTriggerChangeCellValuesEvent: false,
        autoRefresh: true
      }
    );
    updateStatus();
  };

  const runFilterAddRecordTest = () => {
    const testContainer = document.createElement('div');
    testContainer.style.position = 'fixed';
    testContainer.style.left = '-10000px';
    testContainer.style.top = '0';
    testContainer.style.width = '800px';
    testContainer.style.height = '600px';
    document.body.appendChild(testContainer);

    const testRecords = generatePersons(4000);
    const testColumns: VTable.ColumnsDefine = [
      { field: 'id', title: 'id', width: 120 },
      { field: 'sex', title: 'sex', width: 120 },
      { field: 'name', title: 'name', width: 180 }
    ];
    const testTable = new VTable.ListTable({
      container: testContainer,
      columns: testColumns,
      records: testRecords,
      syncRecordOperationsToSourceRecords: syncRecordOpsToSourceRecordsForTest,
      heightMode: 'standard'
    } as any);

    let calls = 0;
    const rules = [
      {
        filterFunc: () => {
          calls++;
          return true;
        }
      }
    ] as any;

    testTable.updateFilterRules(rules);
    const firstCalls = calls;

    const newRecord1 = { id: 4001, email1: '4001@xxx.com', name: '新增4001', sex: 'boy' };
    testTable.addRecord(newRecord1);
    calls = 0;
    testTable.updateFilterRules(rules);
    const secondCalls = calls;

    const newRecords = [
      { id: 4002, email1: '4002@xxx.com', name: '新增4002', sex: 'girl' },
      { id: 4003, email1: '4003@xxx.com', name: '新增4003', sex: 'boy' }
    ];
    testTable.addRecords(newRecords);
    calls = 0;
    testTable.updateFilterRules(rules);
    const thirdCalls = calls;

    testTable.updateSortState({ field: 'id', order: 'desc' } as any);
    const newRecord2 = { id: 4004, email1: '4004@xxx.com', name: '新增4004', sex: 'girl' };
    testTable.addRecord(newRecord2);
    calls = 0;
    testTable.updateFilterRules(rules);
    const fourthCalls = calls;

    testTable.deleteRecords([0] as any, false);
    calls = 0;
    testTable.updateFilterRules(rules);
    const fifthCalls = calls;

    testTable.release();
    testContainer.remove();

    statusDom.textContent = `${statusDom.textContent}\n\nfilter+addRecord test:
sync=${syncRecordOpsToSourceRecordsForTest}
first updateFilterRules calls=${firstCalls} expect=4000
after addRecord(4001) calls=${secondCalls} expect=4001
after addRecords(4002..4003) calls=${thirdCalls} expect=4003
after sort+addRecord(4004) calls=${fourthCalls} expect=4004
after deleteRecords([0]) calls=${fifthCalls} expect=4003`;
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
        noTriggerChangeCellValuesEvent: false,
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
        noTriggerChangeCellValuesEvent: false,
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
  const { label: syncLabel } = createCheckbox(
    'Sync record ops (test)',
    syncRecordOpsToSourceRecordsForTest,
    checked => {
      syncRecordOpsToSourceRecordsForTest = checked;
      updateStatus();
    }
  );
  buttonRowDom.appendChild(syncLabel);
  buttonRowDom.appendChild(createButton('Run Filter+AddRecord Test', runFilterAddRecordTest));
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

  tableInstance.on('dropdown_menu_click', (arg: any) => {
    const { menuKey, col, row } = arg || {};
    const cellLocation = tableInstance.getCellLocation(col, row);
    if (cellLocation !== 'body') {
      return;
    }

    const recordIndex = tableInstance.getRecordShowIndexByCell(col, row);
    if (typeof recordIndex !== 'number' || recordIndex < 0) {
      return;
    }

    if (menuKey === 'INSERT_ROW_BELOW') {
      const inputValueRaw = window.prompt('向下插入行数：', '1');
      const inputValue = Math.max(0, Number(inputValueRaw ?? 1) || 0);
      if (!inputValue) {
        return;
      }

      const newRecords = Array.from({ length: inputValue }, () => ({
        id: records.length + 1,
        email1: `${records.length + 1}@xxx.com`,
        name: `新增${records.length + 1}`,
        lastName: '王',
        date1: '2022年9月1日',
        tel: '000-0000-0000',
        sex: undefined,
        work: 'new row',
        city: 'beijing'
      }));
      tableInstance.addRecords(newRecords, recordIndex + 1);
      updateStatus();
      return;
    }

    if (menuKey === '向下插入空行') {
      const newRecord = {
        id: records.length + 1,
        email1: `${records.length + 1}@xxx.com`,
        name: `新增${records.length + 1}`,
        lastName: '王',
        date1: '2022年9月1日',
        tel: '000-0000-0000',
        sex: undefined,
        work: 'new row',
        city: 'beijing'
      };
      tableInstance.addRecord(newRecord, recordIndex + 1);
      updateStatus();
      return;
    }

    if (menuKey === '删除该行') {
      tableInstance.deleteRecords([recordIndex]);
      updateStatus();
      return;
    }

    if (menuKey === '向右插入空列') {
      const newField = `new_field_${Date.now()}`;
      const insertColIndex = typeof col === 'number' && col >= 0 ? col + 1 : undefined;
      tableInstance.addColumns(
        [
          {
            field: newField,
            title: newField,
            width: 160
          } as any
        ],
        insertColIndex,
        false
      );
      updateStatus();
      return;
    }
  });
}
