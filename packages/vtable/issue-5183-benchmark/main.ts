import * as VTable from '../src';

const TOTAL_COLUMNS = 100;
const TOTAL_RECORDS = 1000;
const BENCHMARK_ROUNDS = 5;

const container = document.getElementById('vTable') as HTMLElement;
const toolbar = document.getElementById('toolbar') as HTMLElement;
const status = document.getElementById('status') as HTMLElement;

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

const columns = createColumns();
const fullRecords = createRecords();
const shiftedRecords = createShiftedRecords(fullRecords);

function createOption(records: Record<string, string | number>[]) {
  return {
    container,
    records,
    columns,
    widthMode: 'standard' as const,
    defaultColWidth: 120,
    groupBy: ['Category', 'Sub-Category']
  };
}

let currentRecords = fullRecords;
const table = new VTable.ListTable(createOption(currentRecords));

function updateStatus(message: string) {
  status.textContent = message;
}

async function applyOption(records: Record<string, string | number>[], label: string) {
  currentRecords = records;
  updateStatus(`${label} 中...`);
  const start = performance.now();
  await table.updateOption(createOption(records));
  const cost = Number((performance.now() - start).toFixed(2));
  updateStatus(`${label} 完成，耗时 ${cost}ms，records=${records.length}`);
  return cost;
}

async function runBenchmark(rounds = BENCHMARK_ROUNDS) {
  if (rounds <= 0) {
    const result = { samples: [], average: 0, min: 0, max: 0 };
    updateStatus('benchmark 跳过，rounds 需要大于 0');
    return result;
  }

  const samples: number[] = [];
  await applyOption(shiftedRecords, 'benchmark 预热切换到替换数据');
  await applyOption(fullRecords, 'benchmark 预热切换回原始数据');

  for (let i = 0; i < rounds; i++) {
    const targetRecords = i % 2 === 0 ? shiftedRecords : fullRecords;
    const cost = await applyOption(targetRecords, `benchmark 第 ${i + 1} 次`);
    samples.push(cost);
  }

  const total = samples.reduce((sum, value) => sum + value, 0);
  const average = Number((total / samples.length).toFixed(2));
  const min = Number(Math.min(...samples).toFixed(2));
  const max = Number(Math.max(...samples).toFixed(2));
  const result = { samples, average, min, max };
  updateStatus(`benchmark 完成，samples=${samples.join(', ')}，avg=${average}ms，min=${min}ms，max=${max}ms`);
  return result;
}

function attachButton(label: string, handler: () => void | Promise<void>) {
  const button = document.createElement('button');
  button.textContent = label;
  button.onclick = () => {
    void handler();
  };
  toolbar.appendChild(button);
}

attachButton('updateOption 替换数据', () =>
  applyOption(currentRecords === fullRecords ? shiftedRecords : fullRecords, 'updateOption 替换数据')
);
attachButton('运行 benchmark x5', () => runBenchmark());
attachButton('重置初始数据', () => applyOption(fullRecords, '重置到初始场景'));

(window as any).issue5183Benchmark = {
  table,
  fullRecords,
  shiftedRecords,
  applyOption,
  runBenchmark
};

updateStatus(
  'issue #5183 benchmark 已初始化：1000x100、groupBy 开启，直接点击按钮即可测量 updateOption 替换数据耗时。'
);
