/* eslint-env jest */
/* eslint-disable no-undef */
// @ts-nocheck
import { DynamicRenderEditor } from '../src/edit/editor';

jest.mock('@visactor/vtable', () => ({
  TYPES: {
    Placement: {
      top: 'top'
    }
  }
}));

describe('DynamicRenderEditor', () => {
  test('finishes synchronously without validation before a button updates the edited cell', async () => {
    let cellValue = 'original';
    const editor = new DynamicRenderEditor();
    editor.setValue('editor-value');

    const table = {
      getBodyColumnDefine: jest.fn().mockReturnValue({ field: 'name' })
    } as any;

    const finishEditing = () => {
      const validation = editor.validateValue(editor.getValue(), cellValue, { col: 0, row: 1 }, table);
      if (validation instanceof Promise) {
        return validation.then(valid => {
          if (valid) {
            cellValue = editor.getValue();
          }
        });
      }
      if (validation) {
        cellValue = editor.getValue();
      }
      return validation;
    };

    const completion = finishEditing();
    cellValue = 'button-value';
    await completion;

    expect(cellValue).toBe('button-value');
  });

  test('keeps configured synchronous validation synchronous', () => {
    const editor = new DynamicRenderEditor();
    const table = {
      getBodyColumnDefine: jest.fn().mockReturnValue({
        editConfig: {
          validateValue: () => false,
          invalidPrompt: 'invalid value'
        }
      }),
      getVisibleCellRangeRelativeRect: jest.fn().mockReturnValue({ left: 0, top: 0, width: 100, height: 40 }),
      showTooltip: jest.fn()
    } as any;

    const validation = editor.validateValue('next', 'previous', { col: 0, row: 1 }, table);

    expect(validation).toBe(false);
    expect(table.showTooltip).toHaveBeenCalledWith(
      0,
      1,
      expect.objectContaining({
        content: 'invalid value'
      })
    );
  });

  test('keeps configured asynchronous validation asynchronous', async () => {
    const editor = new DynamicRenderEditor();
    const table = {
      getBodyColumnDefine: jest.fn().mockReturnValue({
        editConfig: {
          validateValue: () => Promise.resolve(true)
        }
      })
    } as any;

    const validation = editor.validateValue('next', 'previous', { col: 0, row: 1 }, table);

    expect(validation).toBeInstanceOf(Promise);
    await expect(validation).resolves.toBe(true);
  });

  test('converts synchronous validation errors to rejected promises', async () => {
    const editor = new DynamicRenderEditor();
    const error = new Error('validation failed');
    const table = {
      getBodyColumnDefine: jest.fn().mockReturnValue({
        editConfig: {
          validateValue: () => {
            throw error;
          }
        }
      })
    } as any;

    const validation = editor.validateValue('next', 'previous', { col: 0, row: 1 }, table);

    expect(validation).toBeInstanceOf(Promise);
    await expect(validation).rejects.toBe(error);
  });

  test('handles promise-like validation results from another realm', async () => {
    const editor = new DynamicRenderEditor();
    const promiseLike = {
      then(resolve: (value: boolean) => boolean) {
        return Promise.resolve(resolve(false));
      }
    };
    const table = {
      getBodyColumnDefine: jest.fn().mockReturnValue({
        editConfig: {
          validateValue: () => promiseLike
        }
      }),
      getVisibleCellRangeRelativeRect: jest.fn().mockReturnValue({ left: 0, top: 0, width: 100, height: 40 }),
      showTooltip: jest.fn()
    } as any;

    const validation = editor.validateValue('next', 'previous', { col: 0, row: 1 }, table);

    await expect(validation).resolves.toBe(false);
    expect(table.showTooltip).toHaveBeenCalledWith(
      0,
      1,
      expect.objectContaining({
        content: 'invalid'
      })
    );
  });
});
