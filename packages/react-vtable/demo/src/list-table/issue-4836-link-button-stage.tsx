/* global window */
import type { Tag } from '@visactor/vtable/es/vrender';
import { useCallback, useLayoutEffect } from 'react';
import type { CustomLayoutFunctionArg } from '../../../src';
import { Button, Group, Link, ListColumn, ListTable } from '../../../src';

declare global {
  interface Window {
    __issue_4836_ready__?: boolean;
    __issue_4836_error__?: string;
  }
}

type ActionCellProps = CustomLayoutFunctionArg & {
  kind: 'link' | 'button';
};

const stagedControls = new Map<ActionCellProps['kind'], Tag>();
const observedKinds = new Set<ActionCellProps['kind']>();
const scheduledAnimationFrames = new Set<number>();
let readinessRun = 0;

const records = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Record ${index + 1}`
}));

function scheduleAnimationFrame(callback: () => void) {
  const frameId = window.requestAnimationFrame(() => {
    scheduledAnimationFrames.delete(frameId);
    callback();
  });
  scheduledAnimationFrames.add(frameId);
}

function cancelScheduledAnimationFrames() {
  scheduledAnimationFrames.forEach(frameId => window.cancelAnimationFrame(frameId));
  scheduledAnimationFrames.clear();
}

function observeStageAttachment(kind: ActionCellProps['kind'], control: Tag) {
  if (observedKinds.has(kind)) {
    return;
  }
  observedKinds.add(kind);
  const run = readinessRun;
  let remainingFrames = 120;

  const checkStage = () => {
    if (run !== readinessRun || window.__issue_4836_error__) {
      return;
    }
    if (!control.stage) {
      remainingFrames -= 1;
      if (remainingFrames === 0) {
        window.__issue_4836_error__ = `${kind} control was not attached to a stage`;
        return;
      }
      scheduleAnimationFrame(checkStage);
      return;
    }

    stagedControls.set(kind, control);
    if (stagedControls.size !== 2) {
      return;
    }

    stagedControls.forEach(item => item.stage?.renderNextFrame?.());
    scheduleAnimationFrame(() => {
      if (
        run === readinessRun &&
        !window.__issue_4836_error__ &&
        Array.from(stagedControls.values()).every(item => item.stage)
      ) {
        window.__issue_4836_ready__ = true;
      }
    });
  };

  scheduleAnimationFrame(checkStage);
}

function ActionCell(props: ActionCellProps) {
  const { table, row, col, rect, kind } = props;
  const handleControlRef = useCallback(
    (control: Tag | null) => {
      if (control) {
        observeStageAttachment(kind, control);
      }
    },
    [kind]
  );

  if (!table || row === undefined || col === undefined) {
    return null;
  }

  const { width, height } = rect || table.getCellRect(col, row);
  const content =
    kind === 'link' ? (
      <Link ref={handleControlRef} maxWidth={width - 30} panelStyle={{ visible: true, boundsPadding: [6, 12] }}>
        View
      </Link>
    ) : (
      <Button ref={handleControlRef} maxWidth={width - 30}>
        Open
      </Button>
    );

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Group
        attribute={{
          width: width - 16,
          height,
          display: 'flex',
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}
      >
        <Group
          attribute={{
            width: width - 30,
            height,
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            clip: true
          }}
        >
          {content}
        </Group>
      </Group>
    </Group>
  );
}

function App() {
  useLayoutEffect(() => {
    readinessRun += 1;
    stagedControls.clear();
    observedKinds.clear();
    window.__issue_4836_ready__ = false;
    delete window.__issue_4836_error__;

    return () => {
      readinessRun += 1;
      cancelScheduledAnimationFrames();
      stagedControls.clear();
      observedKinds.clear();
      window.__issue_4836_ready__ = false;
    };
  }, []);

  return (
    <ListTable
      records={records}
      height="100%"
      defaultRowHeight={44}
      onError={error => {
        window.__issue_4836_ready__ = false;
        window.__issue_4836_error__ = error instanceof Error ? error.message : String(error);
      }}
    >
      <ListColumn field="id" title="ID" width={70} />
      <ListColumn field="name" title="Name" width={140} />
      {Array.from({ length: 6 }, (_, index) => {
        const kind = index % 2 === 0 ? 'link' : 'button';
        return (
          <ListColumn key={index} field="name" title={`${kind} ${index + 1}`} width={140}>
            <ActionCell role="custom-layout" kind={kind} />
          </ListColumn>
        );
      })}
    </ListTable>
  );
}

export default App;
