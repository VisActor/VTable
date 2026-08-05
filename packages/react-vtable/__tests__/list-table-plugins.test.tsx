/* eslint-env jest, browser */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { FilterPlugin } from '../../vtable-plugins/src/filter';
import { ListColumn, ListTable } from '../src';

describe('ListTable plugins', () => {
  let container: HTMLDivElement;
  let root: Root;
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '400px';
    document.body.appendChild(container);
    root = createRoot(container);
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    consoleError.mockRestore();
  });

  test('does not enter an update loop when a filter plugin is configured', async () => {
    const onReady = jest.fn();

    await act(async () => {
      root.render(
        <ListTable
          records={[
            { name: 'Alice', age: 28 },
            { name: 'Bob', age: 31 }
          ]}
          plugins={[new FilterPlugin({})]}
          onReady={onReady}
        >
          <ListColumn field="name" title="Name" />
          <ListColumn field="age" title="Age" />
        </ListTable>
      );
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(onReady).toHaveBeenCalledTimes(1);
    expect(consoleError.mock.calls.some(args => String(args[0]).includes('Maximum update depth exceeded'))).toBe(false);
  });
});
