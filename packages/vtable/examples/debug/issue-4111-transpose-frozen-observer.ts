import * as VTable from '../../src';

interface Issue4111Window extends Window {
  BUGSERVER_SCREENSHOT?: () => void;
  __issue_4111_error__?: ErrorEvent | PromiseRejectionEvent;
  __issue_4111_table__?: VTable.ListTable;
  __issue_4111_race_table__?: VTable.ListTable;
}

const CONTAINER_ID = 'vTable';
const STATUS_ID = 'issue4111Status';

const columns = [
  { field: 'name', title: 'Name', width: 120 },
  { field: 'value', title: 'Value', width: 120 }
];
const records = Array.from({ length: 10 }, (_, index) => ({
  name: `name-${index}`,
  value: `value-${index}`
}));

function createTable(container: HTMLElement) {
  return new VTable.ListTable(container, {
    columns,
    records,
    defaultColWidth: 120,
    frozenColCount: 2,
    transpose: true
  });
}

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    throw new Error(`Missing #${CONTAINER_ID} container`);
  }

  const issueWindow = window as Issue4111Window;
  delete issueWindow.__issue_4111_error__;

  const onError = (event: ErrorEvent | PromiseRejectionEvent) => {
    issueWindow.__issue_4111_error__ = event;
  };
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onError);

  document.getElementById(STATUS_ID)?.remove();
  const status = document.createElement('div');
  status.id = STATUS_ID;
  status.style.cssText = 'margin: 0 0 12px; font: 600 14px/1.5 sans-serif;';
  status.textContent = 'RUNNING';
  container.parentElement?.insertBefore(status, container);

  container.style.width = '0px';
  container.style.height = '320px';
  const tableInstance = createTable(container);
  issueWindow.__issue_4111_table__ = tableInstance;

  const raceContainer = document.createElement('div');
  raceContainer.style.cssText = 'position: absolute; width: 0; height: 1px; overflow: hidden;';
  container.parentElement?.appendChild(raceContainer);
  const raceTable = createTable(raceContainer);
  issueWindow.__issue_4111_race_table__ = raceTable;

  const originalSetTimeout = window.setTimeout;
  const originalClearTimeout = window.clearTimeout;
  const frozenCheckTimers = new Map<ReturnType<typeof setTimeout>, () => void>();
  let captureFrozenCheck = false;
  let timerId = 0;
  let checkFrozenRanAfterRelease = false;
  const restoreTimers = () => {
    window.setTimeout = originalSetTimeout;
    window.clearTimeout = originalClearTimeout;
  };
  window.setTimeout = ((callback: TimerHandler, timeout?: number) => {
    if (captureFrozenCheck && timeout === 0) {
      const id = (timerId += 1) as unknown as ReturnType<typeof setTimeout>;
      frozenCheckTimers.set(id, () => {
        if (typeof callback === 'function') {
          callback();
        }
      });
      return id;
    }
    return originalSetTimeout(callback, timeout);
  }) as typeof window.setTimeout;
  window.clearTimeout = ((id?: ReturnType<typeof setTimeout>) => {
    if (id && frozenCheckTimers.delete(id)) {
      return;
    }
    originalClearTimeout(id);
  }) as typeof window.clearTimeout;

  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onError);
    restoreTimers();
    if (!raceTable.isReleased) {
      raceTable.release();
    }
    raceContainer.remove();
    delete issueWindow.__issue_4111_error__;
    delete issueWindow.__issue_4111_table__;
    delete issueWindow.__issue_4111_race_table__;
    document.getElementById(STATUS_ID)?.remove();
    release();
  };

  requestAnimationFrame(() => {
    container.style.width = '640px';
    captureFrozenCheck = true;
    raceContainer.style.width = '640px';

    requestAnimationFrame(() => {
      const raceObserverRecovered = !raceTable.stateManager._frozenObserver;
      raceTable.stateManager.checkFrozen = () => {
        checkFrozenRanAfterRelease = true;
      };
      const queuedFrozenCheckBeforeRelease = frozenCheckTimers.size;
      raceTable.release();
      const remainingTimerCallbacks = Array.from(frozenCheckTimers.values());
      restoreTimers();
      remainingTimerCallbacks.forEach(callback => callback());

      requestAnimationFrame(() => {
        tableInstance.setScrollLeft(240);
        const frozenColumnsRemainFixed =
          tableInstance.frozenColCount === 2 &&
          tableInstance.scenegraph.getColGroup(0).parent === tableInstance.scenegraph.rowHeaderGroup &&
          tableInstance.scenegraph.getColGroup(1).parent === tableInstance.scenegraph.rowHeaderGroup &&
          tableInstance.scrollLeft > 0;
        const visibleObserverRecovered = !tableInstance.stateManager._frozenObserver;
        const pass =
          visibleObserverRecovered &&
          raceObserverRecovered &&
          queuedFrozenCheckBeforeRelease > 0 &&
          !checkFrozenRanAfterRelease &&
          frozenColumnsRemainFixed &&
          !issueWindow.__issue_4111_error__;

        const observerRecovery = visibleObserverRecovered && raceObserverRecovered ? 'yes' : 'no';
        status.textContent =
          `${pass ? 'PASS' : 'FAIL'} | frozen=${tableInstance.frozenColCount} | ` +
          `scrollLeft=${tableInstance.scrollLeft} | observer recovery=${observerRecovery} | ` +
          `queued check cancelled=${queuedFrozenCheckBeforeRelease > 0 && !checkFrozenRanAfterRelease ? 'yes' : 'no'}`;
        status.style.color = pass ? '#237804' : '#a8071a';
        status.style.borderLeft = `4px solid ${pass ? '#52c41a' : '#ff4d4f'}`;
        status.style.paddingLeft = '8px';
        issueWindow.BUGSERVER_SCREENSHOT?.();
      });
    });
  });
}
