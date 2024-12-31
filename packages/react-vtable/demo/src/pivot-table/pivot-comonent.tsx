import { useState } from 'react';
import {
  PivotColumnDimension,
  PivotRowDimension,
  PivotIndicator,
  PivotColumnHeaderTitle,
  PivotTable,
  PivotCorner,
  Title
} from '../../../src';
import data from './pivot-data.json';

function App() {
  const [title, setTitle] = useState('title');

  return (
    <>
      <button
        onClick={() => {
          setTitle('title' + Math.floor(10 * Math.random()));
          // const records = new Array(15).fill(['李四', 16, '男', 'icon']);
          // setRecords(records);
        }}
      >
        点击
      </button>
      <PivotTable records={data} keepColumnWidthChange={true}>
        <Title text={title} />
        <PivotColumnHeaderTitle
          title={true}
          headerStyle={{
            textStick: true
          }}
        />
        <PivotColumnDimension dimensionKey={'Category'} title={'Category'} width={'auto'} />
        <PivotRowDimension
          dimensionKey={'City'}
          title={'City'}
          drillUp={true}
          width={'auto'}
          headerStyle={{
            textStick: true
          }}
        />
        <PivotIndicator
          indicatorKey={'Quantity'}
          title={'Quantity'}
          width={'auto'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) {
                return 'black';
              }
              return 'red';
            }
          }}
        />
        <PivotIndicator
          indicatorKey={'Sales'}
          title={'Sales'}
          width={'auto'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) {
                return 'black';
              }
              return 'red';
            }
          }}
        />
        <PivotIndicator
          indicatorKey={'Profit'}
          title={'Profit'}
          width={'auto'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) {
                return 'black';
              }
              return 'red';
            }
          }}
        />
        <PivotCorner
          titleOnDimension={'row'}
          headerStyle={{
            fontWeight: 'bold'
          }}
        />
      </PivotTable>
    </>
  );
}

export default App;
