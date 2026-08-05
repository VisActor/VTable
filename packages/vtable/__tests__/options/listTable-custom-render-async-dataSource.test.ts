import { ListTable, data } from '../../src';
import { createDiv, removeDom } from '../dom';

(global as any).__VERSION__ = 'none';

describe('ListTable customRender with lazy dataSource', () => {
  let containerDom: HTMLElement;

  beforeEach(() => {
    containerDom = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '300px';
    containerDom.style.height = '200px';
  });

  afterEach(() => {
    removeDom(containerDom);
  });

  test('does not load all lazy records when customRender reads value during auto size computation', () => {
    const loadedIndexes = new Set<number>();
    let computationBodyValueCount = 0;
    const recordsLength = 1000;
    const lazyDataSource = new data.CachedDataSource({
      get(index: number) {
        loadedIndexes.add(index);
        return {
          icon: `https://example.com/${index}.svg`,
          name: `name-${index}`
        };
      },
      length: recordsLength
    });

    const table = new ListTable(containerDom, {
      dataSource: lazyDataSource,
      columns: [
        {
          field: 'icon',
          title: 'Icon',
          width: 'auto'
        },
        {
          field: 'name',
          title: 'Name',
          width: 120
        }
      ],
      heightMode: 'autoHeight',
      limitMaxAutoWidth: 600,
      customRender(args) {
        const { col, row, value, forComputation } = args;
        if (row === 0 || col !== 0) {
          return null;
        }
        if (forComputation && value !== undefined) {
          computationBodyValueCount++;
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
    });

    expect(computationBodyValueCount).toBe(0);
    expect(loadedIndexes.has(recordsLength - 1)).toBe(false);
    expect(loadedIndexes.size).toBeLessThan(recordsLength);

    table.release();
  });
});
