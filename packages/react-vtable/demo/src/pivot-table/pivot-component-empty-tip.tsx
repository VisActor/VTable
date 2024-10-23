import { PivotTable, EmptyTip } from '../../../src';

function App() {
  return (
    <PivotTable records={null}>
      <EmptyTip
        text="没有数据text测试"
        textStyle={{
          fontSize: 30
        }}
      />
    </PivotTable>
  );
}

export default App;
