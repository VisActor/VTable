import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const RECORD_COUNT = 5000;

function createIconDataUrl(index: number) {
  const color = index % 2 === 0 ? '#1664ff' : '#00a870';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <rect width="20" height="20" rx="4" fill="${color}"/>
    <text x="10" y="14" text-anchor="middle" font-size="10" fill="#fff">${index % 10}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createRecord(index: number) {
  return {
    icon: createIconDataUrl(index),
    name: `name-${index}`,
    desc: `row ${index}`
  };
}

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '800px';
  container.style.height = '500px';

  const status = document.createElement('div');
  status.style.cssText = 'height: 40px; line-height: 20px; font-size: 13px; color: #333;';
  container.parentElement?.insertBefore(status, container);

  const loadedIndexes = new Set<number>();
  let computationValueCount = 0;
  let customRenderCallCount = 0;

  const updateStatus = () => {
    const loadedRows = loadedIndexes.size;
    const lastRowLoaded = loadedIndexes.has(RECORD_COUNT - 1);
    status.innerHTML = [
      `loaded rows: ${loadedRows}/${RECORD_COUNT}, last row loaded: ${lastRowLoaded}`,
      `customRender calls: ${customRenderCallCount}, computation value count: ${computationValueCount}`
    ].join('<br>');
  };

  const dataSource = new VTable.data.CachedDataSource({
    get(index: number) {
      loadedIndexes.add(index);
      return createRecord(index);
    },
    length: RECORD_COUNT
  });

  const option: VTable.ListTableConstructorOptions = {
    container,
    dataSource,
    columns: [
      {
        field: 'icon',
        title: 'Icon',
        width: 'auto'
      },
      {
        field: 'name',
        title: 'Name',
        width: 160
      },
      {
        field: 'desc',
        title: 'Description',
        width: 220
      }
    ],
    heightMode: 'autoHeight',
    limitMaxAutoWidth: 600,
    customRender(args) {
      const { col, row, value, forComputation } = args;
      customRenderCallCount++;

      if (row === 0 || col !== 0) {
        return null;
      }

      if (forComputation && value !== undefined) {
        computationValueCount++;
      }

      return {
        renderDefault: false,
        expectedHeight: 40,
        expectedWidth: 120,
        elements: [
          {
            type: 'image',
            src: value,
            width: 20,
            height: 20,
            x: 35,
            y: 10
          }
        ]
      };
    }
  };

  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;
  (window as any).issue4964Status = {
    loadedIndexes,
    get loadedRows() {
      return loadedIndexes.size;
    },
    get computationValueCount() {
      return computationValueCount;
    }
  };

  updateStatus();
  setTimeout(updateStatus, 0);
}
