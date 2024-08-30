import { useRef, useState } from 'react';
import type { VTable } from '../../../src';
import { ListTable } from '../../../src';
import data from '../../data/list-data.json';

const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];
const bloggerAvatar = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg';

const option = {
  widthMode: 'standard',
  groupBy: ['groupName'],
  columns: [
    {
      field: 'name',
      title: 'Name',
      width: 'auto'
    },
    {
      field: 'position',
      title: 'Position',
      width: 'auto'
    },
    {
      field: 'salary',
      title: 'Salary',
      width: 'auto',
      style: {
        textAlign: 'right'
      }
    }
  ],
  records: [
    {
      name: 'John Smith',
      position: 'Recruiting Manager',
      salary: '$8000',
      groupName: 'Recruiting Group'
    },
    {
      name: 'Emily Johnson',
      position: 'Recruiting Supervisor',
      salary: '$6000',
      groupName: 'Recruiting Group'
    },
    {
      name: 'Michael Davis',
      position: 'Recruiting Specialist',
      salary: '$4000',
      groupName: 'Recruiting Group'
    },
    {
      name: 'Jessica Brown',
      position: 'Training Manager',
      salary: '$8000',
      groupName: 'Training Group'
    },
    {
      name: 'Andrew Wilson',
      position: 'Training Supervisor',
      salary: '$6000',
      groupName: null
    }
  ]
};
function App() {
  const [props, setProps] = useState<any>(null);

  const tableRef = useRef<VTable>(null);

  // setTimeout(() => {
  //   window.tableInstance = tableRef.current;
  //   setProps(option);
  // }, 1000);

  return <ListTable ref={tableRef} width={500} height={400} {...props} />;
}

export default App;
