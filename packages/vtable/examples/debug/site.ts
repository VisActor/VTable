/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
const newData = [
  {
    id: 1,
    name: 'name1',
    department: 'IT',
    position: 'Manager',
    age: 30,
    children: [
      {
        key: 1,
        name: '子数据 1'
      },
      {
        key: 2,
        name: '子数据 2'
      }
    ]
  },
  {
    id: 2,
    name: 'name2',
    department: 'IT',
    position: 'Developer',
    age: 25,
    children: [
      {
        key: 3,
        name: '子数据 3'
      },
      {
        key: 4,
        name: '子数据 4'
      }
    ]
  },
  {
    id: 3,
    name: 'name3',
    department: 'IT',
    position: 'Developer',
    age: 28,
    children: [
      {
        key: 5,
        name: '子数据 5'
      }
    ]
  },
  {
    id: 4,
    name: 'name4',
    department: 'IT',
    position: 'Developer',
    age: 22,
    children: [
      {
        key: 6,
        name: '子数据 6'
      },
      {
        key: 7,
        name: '子数据 7'
      },
      {
        key: 8,
        name: '子数据 8'
      },
      {
        key: 9,
        name: '子数据 9'
      },
      {
        key: 10,
        name: '子数据 10'
      }
    ]
  }
];
export function createTable() {
  let tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/company_struct.json')
    .then(res => res.json())
    .then(data => {
      const columns: VTable.ColumnDefine[] = [
        {
          field: 'check',
          width: 60,
          cellType: 'checkbox',
          headerType: 'checkbox'
        },
        {
          field: 'name',
          title: 'name',
          width: 'auto',
          tree: true
        },
        {
          field: 'department',
          title: 'department',
          width: 'auto'
        },
        {
          field: 'position',
          title: 'position',
          width: 'auto'
        },
        {
          field: 'age',
          title: 'age',
          width: 'auto'
        }
      ];

      const option: VTable.ListTableConstructorOptions = {
        records: newData,
        columns,
        widthMode: 'standard',
        // groupBy: ['department'],
        rowSeriesNumber: {
          width: 'auto',
          title: '行号'
          // tree: true//
          // enableTreeCheckbox: true,
        }
      };
      const container = document.getElementById(CONTAINER_ID);
      if (!container) {
        throw new Error(`Container with id ${CONTAINER_ID} not found`);
      }
      tableInstance = new VTable.ListTable(container, option);
      tableInstance.on('checkbox_state_change', e => {
        // console.log('onCheckboxStateChange', e);
        console.log('getCheckboxState', tableInstance.getCheckboxState('check'));
        // console.log('tableInstance',tableInstance)
        const checkList = tableInstance.getCheckboxState('check');
        const list = tableInstance?.records || [];
        const isTree = list.length === checkList.length;

        const newList = list.filter((record: any, index: number) => {
          const checkState = checkList[index];
          return checkState === true;
        });
        console.log('已选数据', newList);
      });
      window['tableInstance'] = tableInstance;
    });
}
