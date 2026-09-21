/* global window */
import type { CustomLayoutFunctionArg } from '../../../src';
import { Button, Group, Link, ListColumn, ListTable } from '../../../src';

declare global {
  interface Window {
    __issue_4836_ready__?: boolean;
  }
}

type ActionCellProps = CustomLayoutFunctionArg & {
  kind: 'link' | 'button';
};

const records = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Record ${index + 1}`
}));

function ActionCell(props: ActionCellProps) {
  const { table, row, col, rect, kind } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }

  const { width, height } = rect || table.getCellRect(col, row);
  const content =
    kind === 'link' ? (
      <Link maxWidth={width - 30} panelStyle={{ visible: true, boundsPadding: [6, 12] }}>
        View
      </Link>
    ) : (
      <Button maxWidth={width - 30}>Open</Button>
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
  return (
    <ListTable
      records={records}
      height="100%"
      defaultRowHeight={44}
      onReady={() => {
        window.__issue_4836_ready__ = true;
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
