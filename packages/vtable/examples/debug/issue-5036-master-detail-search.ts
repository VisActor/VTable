import * as VTable from '../../src';
import { MasterDetailPlugin } from '@visactor/vtable-plugins';
import { SearchComponent } from '@visactor/vtable-search';

const CONTAINER_ID = 'vTable';
const CONTROLS_ID = 'issue5036Controls';

const records = Array.from({ length: 8 }, (_, index) => ({
  orderId: `ORDER-${String(index + 1).padStart(3, '0')}`,
  customer: index % 2 === 0 ? `Target customer ${index + 1}` : `Customer ${index + 1}`,
  status: index % 3 === 0 ? 'Review' : 'Ready',
  children: [
    {
      task: `Target task ${index + 1}`,
      owner: `Owner ${index + 1}`,
      children: [
        {
          task: `Target nested task ${index + 1}`,
          owner: `Reviewer ${index + 1}`
        }
      ]
    },
    {
      task: `Packaging ${index + 1}`,
      owner: `Operator ${index + 1}`
    }
  ]
}));

function createControls(container: HTMLElement) {
  document.getElementById(CONTROLS_ID)?.remove();

  const controls = document.createElement('div');
  controls.id = CONTROLS_ID;
  controls.style.cssText =
    'display:flex;align-items:center;gap:8px;height:52px;padding:0 12px;border-bottom:1px solid #e5e7eb;' +
    'box-sizing:border-box;font:13px/1.4 Arial,sans-serif;background:#fff;';

  const input = document.createElement('input');
  input.value = 'Target';
  input.placeholder = 'Search master and detail tables';
  input.style.cssText =
    'width:260px;height:30px;padding:0 9px;border:1px solid #c9cdd4;border-radius:4px;box-sizing:border-box;';

  const createButton = (label: string) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.cssText =
      'height:30px;padding:0 12px;border:1px solid #c9cdd4;border-radius:4px;background:#fff;cursor:pointer;';
    return button;
  };

  const searchButton = createButton('Search');
  const previousButton = createButton('Previous');
  const nextButton = createButton('Next');
  const clearButton = createButton('Clear');
  const result = document.createElement('span');
  result.style.cssText = 'min-width:110px;color:#4e5969;';
  result.textContent = 'Ready';

  controls.append(input, searchButton, previousButton, nextButton, clearButton, result);
  container.parentElement?.insertBefore(controls, container);
  return { input, searchButton, previousButton, nextButton, clearButton, result };
}

function updateResult(
  resultNode: HTMLElement,
  result: ReturnType<SearchComponent['search']>,
  emptyLabel: string = 'No matches'
) {
  resultNode.textContent =
    result.results.length > 0 ? `${Math.max(result.index + 1, 1)} / ${result.results.length}` : emptyLabel;
}

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    return;
  }

  document.getElementById('input-test')!.style.display = 'none';
  document.getElementById('textarea-test')!.style.display = 'none';
  container.style.height = 'calc(100% - 52px)';

  const controls = createControls(container);
  const masterDetailPlugin = new MasterDetailPlugin({
    detailTableOptions: {
      columns: [
        { field: 'task', title: 'Detail task', tree: true, width: 260 },
        { field: 'owner', title: 'Owner', width: 180 }
      ],
      hierarchyExpandLevel: 1,
      defaultRowHeight: 34,
      defaultHeaderRowHeight: 36,
      style: {
        margin: [8, 16],
        height: 150
      },
      theme: VTable.themes.BRIGHT
    }
  });

  const tableInstance = new VTable.ListTable({
    container,
    records,
    columns: [
      { field: 'orderId', title: 'Order', width: 150 },
      { field: 'customer', title: 'Customer', width: 220 },
      { field: 'status', title: 'Status', width: 120 }
    ],
    defaultRowHeight: 40,
    heightMode: 'standard',
    plugins: [masterDetailPlugin]
  });
  const search = new SearchComponent({
    table: tableInstance,
    autoJump: true,
    scrollOption: {
      duration: 350
    }
  });

  const runSearch = () => updateResult(controls.result, search.search(controls.input.value));
  controls.searchButton.onclick = runSearch;
  controls.previousButton.onclick = () => updateResult(controls.result, search.prev());
  controls.nextButton.onclick = () => updateResult(controls.result, search.next());
  controls.clearButton.onclick = () => {
    search.clear();
    controls.result.textContent = 'Cleared';
  };
  controls.input.onkeydown = event => {
    if (event.key === 'Enter') {
      runSearch();
    }
  };

  window.tableInstance = tableInstance;
  (window as any).search = search;
  (window as any).masterDetailPlugin = masterDetailPlugin;

  requestAnimationFrame(() => {
    if (tableInstance.isReleased) {
      return;
    }
    records.forEach((_record, recordIndex) => {
      const row = tableInstance.getTableIndexByRecordIndex(recordIndex);
      if (typeof row === 'number' && tableInstance.getHierarchyState(0, row) !== 'expand') {
        tableInstance.toggleHierarchyState(0, row);
      }
    });
    requestAnimationFrame(() => {
      if (!tableInstance.isReleased) {
        runSearch();
      }
    });
  });
}
