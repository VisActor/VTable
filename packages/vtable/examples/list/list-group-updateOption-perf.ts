import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const TOOLBAR_ID = 'toolbar';
const STATUS_ID = 'status';
const TOTAL_COLUMNS = 100;
const TOTAL_RECORDS = 1000;
const BENCHMARK_ROUNDS = 5;

const categoryPool = ['Office Supplies', 'Furniture', 'Technology', 'Appliances'];
const subCategoryPool = ['Paper', 'Labels', 'Phones', 'Chairs', 'Tables', 'Binders', 'Storage', 'Accessories'];

function createColumns() {
  const columns: VTable.ColumnsDefine = [
    { field: 'Category', title: 'Category', width: 'auto' },
    { field: 'Sub-Category', title: 'Sub-Category', width: 'auto' }
  ];

  for (let i = 0; i < TOTAL_COLUMNS - 2; i++) {
    columns.push({
      field: `field_${i}`,
      title: `Field ${i}`,
      width: 'auto'
    });
  }

  return columns;
}

function createRecords() {
  return Array.from({ length: TOTAL_RECORDS }, (_, rowIndex) => {
    const record: Record<string, string | number> = {
      Category: categoryPool[rowIndex % categoryPool.length],
      'Sub-Category': subCategoryPool[rowIndex % subCategoryPool.length]
    };

    for (let colIndex = 0; colIndex < TOTAL_COLUMNS - 2; colIndex++) {
      record[`field_${colIndex}`] = `R${rowIndex}-C${colIndex}-${(rowIndex + colIndex) % 97}`;
    }

    return record;
  });
}

function createShiftedRecords(baseRecords: Record<string, string | number>[]) {
  return baseRecords.map((record, index) => ({
    ...record,
    Category: categoryPool[(index + 1) % categoryPool.length],
    'Sub-Category': subCategoryPool[(index + 2) % subCategoryPool.length]
  }));
}

function createOption(
  records: Record<string, string | number>[],
  columns: VTable.ColumnsDefine,
  enableGroup: boolean
): VTable.ListTableConstructorOptions {
  return {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    widthMode: 'standard',
    defaultColWidth: 120,
    groupBy: enableGroup ? ['Category', 'Sub-Category'] : undefined
  };
}

export function createTable() {
  const mount = document.getElementById(CONTAINER_ID)?.parentElement ?? document.body;
  let toolbar = document.getElementById(TOOLBAR_ID);
  let status = document.getElementById(STATUS_ID);
  if (!toolbar) {
    toolbar = document.createElement('div');
    toolbar.id = TOOLBAR_ID;
    toolbar.style.margin = '12px 0';
    mount.insertBefore(toolbar, document.getElementById(CONTAINER_ID) ?? null);
  }
  if (!status) {
    status = document.createElement('div');
    status.id = STATUS_ID;
    status.style.margin = '8px 0 12px';
    status.style.fontFamily = 'monospace';
    mount.insertBefore(status, document.getElementById(CONTAINER_ID) ?? null);
  }
  const columns = createColumns();
  const fullRecords = createRecords();
  const shiftedRecords = createShiftedRecords(fullRecords);
  let currentRecords: Record<string, string | number>[] = fullRecords;
  let enableGroup = true;

  const table = new VTable.ListTable(createOption(currentRecords, columns, enableGroup));
  (window as any).tableInstance = table;

  const updateStatus = (message: string) => {
    if (status) {
      status.textContent = message;
    }
  };

  const applyOption = async (records: Record<string, string | number>[], nextEnableGroup: boolean, label: string) => {
    currentRecords = records;
    enableGroup = nextEnableGroup;
    const start = performance.now();
    updateStatus(`${label} 中...`);
    await table.updateOption(createOption(currentRecords, columns, enableGroup));
    const cost = (performance.now() - start).toFixed(2);
    updateStatus(
      `${label} 完成，耗时 ${cost}ms，records=${currentRecords.length}，group=${enableGroup ? 'on' : 'off'}`
    );
    return Number(cost);
  };

  const runBenchmark = async (rounds = BENCHMARK_ROUNDS) => {
    if (rounds <= 0) {
      const result = { samples: [], average: 0, min: 0, max: 0 };
      updateStatus('benchmark 跳过，rounds 需要大于 0');
      return result;
    }

    const samples: number[] = [];
    updateStatus(`benchmark 预热中...`);
    await applyOption(shiftedRecords, true, 'benchmark 预热切换到替换数据');
    await applyOption(fullRecords, true, 'benchmark 预热切换回原始数据');

    for (let i = 0; i < rounds; i++) {
      const targetRecords = i % 2 === 0 ? shiftedRecords : fullRecords;
      const label = `benchmark 第 ${i + 1} 次`;
      const cost = await applyOption(targetRecords, true, label);
      samples.push(cost);
    }

    const total = samples.reduce((sum, value) => sum + value, 0);
    const average = Number((total / samples.length).toFixed(2));
    const min = Number(Math.min(...samples).toFixed(2));
    const max = Number(Math.max(...samples).toFixed(2));
    const summary = `benchmark 完成，samples=${samples.join(', ')}，avg=${average}ms，min=${min}ms，max=${max}ms`;
    updateStatus(summary);
    return { samples, average, min, max };
  };

  const attachButton = (label: string, handler: () => void | Promise<void>) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.marginRight = '8px';
    button.onclick = () => {
      void handler();
    };
    toolbar?.appendChild(button);
  };

  attachButton('updateOption 替换数据', () =>
    applyOption(currentRecords === fullRecords ? shiftedRecords : fullRecords, true, 'updateOption 替换数据')
  );
  attachButton('updateOption 切分组', () => applyOption(currentRecords, !enableGroup, 'updateOption 切换分组'));
  attachButton('运行 benchmark x5', () => runBenchmark());
  attachButton('重置到初始场景', () => applyOption(fullRecords, true, '重置到 issue 初始场景'));

  (window as any).issue5183PerfDemo = {
    table,
    columns,
    fullRecords,
    shiftedRecords,
    createOption,
    applyOption,
    runBenchmark
  };

  updateStatus(
    '已按 issue #5183 场景初始化：1000x100、groupBy 开启。推荐先点“updateOption 替换数据”，再点“运行 benchmark x5”。'
  );
}
