import { bindMediaClick } from '../src/event/media-click';
import { Env, type EnvMode } from '../src/tools/env';
import type { MousePointerCellEvent } from '../src/ts-types';
import type { BaseTableAPI } from '../src/ts-types/base-table';

describe('bindMediaClick', () => {
  let originalMode: EnvMode;

  beforeEach(() => {
    originalMode = Env.mode;
    Env.mode = 'browser';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    Env.mode = originalMode;
    document.body.innerHTML = '';
  });

  test.each(['image', 'audio', 'video'] as const)('does not open a %s preview for an empty cell', cellType => {
    let clickHandler: ((event: MousePointerCellEvent) => void) | undefined;
    const table = {
      addReleaseObj: jest.fn(),
      on: jest.fn((_event: string, handler: (event: MousePointerCellEvent) => void) => {
        clickHandler = handler;
      }),
      getCellType: jest.fn(() => cellType),
      isHeader: jest.fn(() => false),
      getBodyColumnDefine: jest.fn(() => ({ clickToPreview: true })),
      getCellValue: jest.fn(() => null),
      getCellOriginValue: jest.fn(() => null)
    } as unknown as BaseTableAPI;

    bindMediaClick(table);
    clickHandler?.({ col: 0, row: 0, target: { type: 'rect' } } as MousePointerCellEvent);

    expect(document.body.childElementCount).toBe(0);
  });
});
