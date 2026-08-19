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

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '400px';
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  test('does not enter an update loop when a filter plugin is configured', async () => {
    let readyResolve!: () => void;
    const ready = new Promise<void>(resolve => {
      readyResolve = resolve;
    });
    const onReady = jest.fn();
    onReady.mockImplementationOnce(() => readyResolve());

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
    });
    await ready;

    expect(onReady).toHaveBeenCalledTimes(1);
  });
});
