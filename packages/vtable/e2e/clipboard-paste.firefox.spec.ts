import { expect, test } from '@playwright/test';

interface Issue4699Table {
  columnHeaderLevelCount: number;
  getCellOriginValue: (col: number, row: number) => unknown;
  getElement: () => HTMLElement;
  selectCell: (col: number, row: number) => void;
}

interface Issue4699Window extends Window {
  __issue4699ClipboardState: {
    readCalls: number;
  };
  __issue4699Table: Issue4699Table;
}

test('pastes event clipboard data into a selected cell without an editor caret', async ({ page, browserName }) => {
  test.skip(browserName !== 'firefox', 'Firefox-only clipboard regression');

  await page.addInitScript(() => {
    const state = { readCalls: 0 };
    Object.defineProperty(window, '__issue4699ClipboardState', {
      configurable: true,
      value: state
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        read: () => {
          state.readCalls++;
          return Promise.reject(new Error('Firefox clipboard-read is unavailable'));
        }
      }
    });
  });

  await page.goto('/');
  await page.waitForFunction(() => Boolean((window as unknown as Issue4699Window).__issue4699Table));

  const activeElement = await page.evaluate(() => {
    const testWindow = window as unknown as Issue4699Window;
    const table = testWindow.__issue4699Table;
    const row = table.columnHeaderLevelCount;
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', 'pasted in Firefox');
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true
    });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: clipboardData
    });

    table.selectCell(0, row);
    table.getElement().focus();
    table.getElement().dispatchEvent(pasteEvent);
    return document.activeElement?.tagName;
  });

  expect(activeElement).not.toMatch(/^(INPUT|TEXTAREA)$/);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const table = (window as unknown as Issue4699Window).__issue4699Table;
        return table.getCellOriginValue(0, table.columnHeaderLevelCount);
      })
    )
    .toBe('pasted in Firefox');
  await expect
    .poll(() => page.evaluate(() => (window as unknown as Issue4699Window).__issue4699ClipboardState.readCalls))
    .toBe(0);
});
