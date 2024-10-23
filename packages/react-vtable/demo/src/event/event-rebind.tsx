/* eslint-disable no-undef */
/* eslint-disable no-console */
import { useCallback, useState } from 'react';
import { ListTable } from '../../../src';

const App = () => {
  const [transpose, setTranspose] = useState(false);
  const [cell, setCell] = useState({});

  const option = {
    transpose,
    columns: [
      {
        field: '0',
        caption: 'name'
      },
      {
        field: '1',
        caption: 'age'
      },
      {
        field: '2',
        caption: 'gender'
      },
      {
        field: '3',
        caption: 'hobby'
      }
    ],
    records: new Array(1000).fill(['John', 18, 'male', '🏀'])
  };

  console.log('transpose:', transpose);
  const handleCell = useCallback(args => setCell(args), []);
  return (
    <div>
      <button
        onClick={() => {
          setTranspose(v => !v);
        }}
      >
        transpose
      </button>
      <button
        onClick={() => {
          console.log('button transpose', transpose);
        }}
      >
        get transpose
      </button>
      <ListTable option={option} height={'500px'} onClickCell={handleCell} />
    </div>
  );
};

export default App;
