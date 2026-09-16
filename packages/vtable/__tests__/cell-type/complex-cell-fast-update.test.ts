// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

describe('complex cell fast update', () => {
  test('reuses cell groups and component instances', () => {
    const container = createDiv();
    container.style.width = '1000px';
    container.style.height = '500px';

    const table = new ListTable(container, {
      records: [
        {
          checkbox: { text: 'Ready', checked: true, disable: false },
          switch: { text: '', checked: false, disable: false },
          button: 'Open',
          progress: 50
        }
      ],
      columns: [
        { field: 'checkbox', cellType: 'checkbox', width: 160 },
        { field: 'switch', cellType: 'switch', width: 160 },
        { field: 'button', cellType: 'button', width: 160 },
        { field: 'progress', cellType: 'progressbar', width: 160, min: 0, max: 100 }
      ],
      defaultRowHeight: 40
    });

    const componentNames = ['checkbox', 'switch', 'button', 'progress-bar'];
    const cellGroups = componentNames.map((_, col) => table.scenegraph.getCell(col, 1));
    const components = cellGroups.map((cellGroup, col) => cellGroup.getChildByName(componentNames[col]));
    const progressText = cellGroups[3].getChildByName('text');
    const progressMain = components[3].getChildByName('progress-bar-main');
    const initialProgressWidth = progressMain.attribute.width;

    table.updateRecords(
      [
        {
          checkbox: { text: 'Disabled', checked: false, disable: true },
          switch: { text: '', checked: true, disable: true },
          button: 'Close',
          progress: 75
        }
      ],
      [0]
    );

    cellGroups.forEach((cellGroup, col) => {
      expect(table.scenegraph.getCell(col, 1)).toBe(cellGroup);
      expect(cellGroup.getChildByName(componentNames[col])).toBe(components[col]);
    });
    expect(components[3].getChildByName('progress-bar-main')).toBe(progressMain);
    expect(cellGroups[3].getChildByName('text')).toBe(progressText);
    expect(components[2].attribute.text).toBe('Close');
    expect(progressText.attribute.text).toBe('75');
    expect(progressMain.attribute.width).toBeGreaterThan(initialProgressWidth);

    table.updateRecords(
      [
        {
          checkbox: { text: 'Ready', checked: false, disable: false },
          switch: { text: '', checked: false, disable: false },
          button: 'Open',
          progress: 25
        }
      ],
      [0]
    );
    cellGroups.forEach((cellGroup, col) => {
      expect(table.scenegraph.getCell(col, 1)).toBe(cellGroup);
      expect(cellGroup.getChildByName(componentNames[col])).toBe(components[col]);
    });
    expect(components[2].attribute.text).toBe('Open');
    expect(progressText.attribute.text).toBe('25');

    table.release();
  });

  test('reuses progress graphics and removes stale mode graphics', () => {
    const container = createDiv();
    container.style.width = '400px';
    container.style.height = '300px';

    const table = new ListTable(container, {
      records: [{ progress: 25, mode: 'default', show: true, background: false }],
      columns: [
        {
          field: 'progress',
          cellType: 'progressbar',
          width: 160,
          min: -100,
          max: 100,
          barType: args => args.table.getCellOriginRecord(args.col, args.row).mode,
          style: {
            barBgColor: args => (args.table.getCellOriginRecord(args.col, args.row).background ? '#eee' : undefined),
            showBar: args => args.table.getCellOriginRecord(args.col, args.row).show
          }
        }
      ],
      defaultRowHeight: 40
    });

    const progressGroup = table.scenegraph.getCell(0, 1).getChildByName('progress-bar');
    const main = progressGroup.getChildByName('progress-bar-main');
    expect(progressGroup.getChildByName('progress-bar-background')).toBeNull();

    table.updateRecords([{ progress: 50, mode: 'default', show: true, background: true }], [0]);
    const background = progressGroup.getChildByName('progress-bar-background');
    expect(progressGroup.firstChild).toBe(background);
    expect(progressGroup.getChildByName('progress-bar-main')).toBe(main);

    table.updateRecords([{ progress: -50, mode: 'negative', show: true, background: true }], [0]);
    expect(progressGroup.getChildByName('progress-bar-main')).toBeNull();
    const negative = progressGroup.getChildByName('progress-bar-negative');
    const positive = progressGroup.getChildByName('progress-bar-positive');
    const axis = progressGroup.getChildByName('progress-bar-axis');

    table.updateRecords([{ progress: 50, mode: 'negative', show: true, background: true }], [0]);
    expect(progressGroup.getChildByName('progress-bar-negative')).toBe(negative);
    expect(progressGroup.getChildByName('progress-bar-positive')).toBe(positive);
    expect(progressGroup.getChildByName('progress-bar-axis')).toBe(axis);

    table.updateRecords([{ progress: 50, mode: 'negative', show: false, background: true }], [0]);
    expect(progressGroup.childrenCount).toBe(0);

    table.updateRecords([{ progress: 'invalid', mode: 'default', show: true, background: true }], [0]);
    expect(progressGroup.childrenCount).toBe(0);

    table.release();
  });

  test('preserves progress text layout attributes during reuse', () => {
    const container = createDiv();
    container.style.width = '400px';
    container.style.height = '300px';

    const table = new ListTable(container, {
      records: [{ progress: 25 }],
      columns: [
        {
          field: 'progress',
          cellType: 'progressbar',
          width: 160,
          min: 0,
          max: 100,
          style: { textAlign: 'right' }
        }
      ],
      customConfig: { limitContentHeight: false },
      theme: { _contentOffset: 3 },
      defaultRowHeight: 40
    });

    const cellGroup = table.scenegraph.getCell(0, 1);
    const text = cellGroup.getChildByName('text');

    table.updateRecords([{ progress: 75 }], [0]);

    expect(table.scenegraph.getCell(0, 1)).toBe(cellGroup);
    expect(cellGroup.getChildByName('text')).toBe(text);
    expect(text.attribute).toMatchObject({
      text: '75',
      heightLimit: -1,
      whiteSpace: 'normal',
      dx: -3,
      keepCenterInLine: true
    });

    table.release();
  });

  test('falls back when table customRender is configured', () => {
    const container = createDiv();
    container.style.width = '400px';
    container.style.height = '300px';

    const table = new ListTable(container, {
      records: [{ progress: 25 }],
      columns: [{ field: 'progress', cellType: 'progressbar', width: 160, min: 0, max: 100 }],
      customRender: () => ({
        elements: [{ type: 'rect', x: 0, y: 0, width: 4, height: 4, fill: '#f00' }],
        renderDefault: true
      }),
      defaultRowHeight: 40
    });

    const cellGroup = table.scenegraph.getCell(0, 1);
    expect(cellGroup.getChildByName('custom-container')).not.toBeNull();

    table.updateRecords([{ progress: 75 }], [0]);

    const updatedCellGroup = table.scenegraph.getCell(0, 1);
    expect(updatedCellGroup).not.toBe(cellGroup);
    expect(updatedCellGroup.getChildByName('custom-container')).not.toBeNull();

    table.release();
  });

  test('falls back when a progress cell gains a mark', () => {
    const container = createDiv();
    container.style.width = '400px';
    container.style.height = '300px';

    const table = new ListTable(container, {
      records: [{ progress: 25 }],
      columns: [
        {
          field: 'progress',
          cellType: 'progressbar',
          width: 160,
          min: 0,
          max: 100,
          style: {
            marked: args => args.value >= 50
          }
        }
      ],
      defaultRowHeight: 40
    });

    const cellGroup = table.scenegraph.getCell(0, 1);
    expect(cellGroup.getChildByName('mark')).toBeNull();

    table.updateRecords([{ progress: 75 }], [0]);

    const updatedCellGroup = table.scenegraph.getCell(0, 1);
    expect(updatedCellGroup).not.toBe(cellGroup);
    expect(updatedCellGroup.getChildByName('mark')).not.toBeNull();

    table.updateRecords([{ progress: 25 }], [0]);

    const unmarkedCellGroup = table.scenegraph.getCell(0, 1);
    expect(unmarkedCellGroup).not.toBe(updatedCellGroup);
    expect(unmarkedCellGroup.getChildByName('mark')).toBeNull();

    table.release();
  });
});
