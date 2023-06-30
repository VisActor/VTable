import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  const records = [
    {
      month: 'JUL',
      milestoneOne: 'basic funcitons 1',
      milestoneTwo: 'basic funcitons'
    },
    {
      month: 'AUG',
      milestoneOne: 'basic funcitons',
      milestoneTwo: 'basic funcitons'
    },
    {
      month: 'SEP',
      milestoneOne: 'basic funcitons',
      milestoneTwo: 'basic funcitons'
    },
    {
      month: 'OCT',
      milestoneOne: 'basic funcitons',
      milestoneTwo: 'basic funcitons'
    },
    {
      month: 'NOV',
      milestoneOne: 'basic funcitons',
      milestoneTwo: 'basic funcitons'
    },
    {
      month: 'DEC',
      milestoneOne: 'basic funcitons',
      milestoneTwo: 'basic funcitons'
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    columns: [
      {
        field: 'month',
        caption: 'MONTH',
        width: 200, // TODO  无效问题
        style: {
          textAlign: 'center',
          color: 'white',
          borderLineWidth: 0
        },
        customRender(args) {
          console.log(args);
          const { width, height } = args.rect;
          const { dataValue, table, row, col } = args;
          const elements: any[] = [];
          elements.push({
            type: 'circle',
            fill: '#3c78d8',
            x: width / 2,
            y: height / 2,
            radius: 20
          });
          return {
            renderDefault: true,
            elements,
            expectedHeight: 100, // TODO 无效
            expectedWidth: 200
          };
        }
      },
      {
        field: '',
        caption: '\n',
        width: 100,
        style: {
          borderLineWidth: 0
        }
      },
      {
        field: 'milestoneOne',
        headerIcon: {
          positionType: VTable.TYPES.IconPosition.contentLeft,
          name: 'milestone',
          type: 'svg',
          width: 50,
          height: 50,
          svg: '<svg t="1688125317435" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="656" width="200" height="200"><path d="M443.733333 307.2v136.533333h-136.533333c-18.773333 0-34.133333-15.36-34.133333-34.133333v-102.4c0-18.773333 15.36-34.133333 34.133333-34.133333h102.4c18.773333 0 34.133333 15.36 34.133333 34.133333z" fill="#3399FF" p-id="657"></path><path d="M716.8 273.066667h-102.4c-18.773333 0-34.133333 15.36-34.133333 34.133333v136.533333h136.533333c18.773333 0 34.133333-15.36 34.133333-34.133333v-102.4c0-18.773333-15.36-34.133333-34.133333-34.133333z m0 307.2h-136.533333v136.533333c0 18.773333 15.36 34.133333 34.133333 34.133333h102.4c18.773333 0 34.133333-15.36 34.133333-34.133333v-102.4c0-18.773333-15.36-34.133333-34.133333-34.133333z m0-307.2h-102.4c-18.773333 0-34.133333 15.36-34.133333 34.133333v136.533333h136.533333c18.773333 0 34.133333-15.36 34.133333-34.133333v-102.4c0-18.773333-15.36-34.133333-34.133333-34.133333z m0 307.2h-136.533333v136.533333c0 18.773333 15.36 34.133333 34.133333 34.133333h102.4c18.773333 0 34.133333-15.36 34.133333-34.133333v-102.4c0-18.773333-15.36-34.133333-34.133333-34.133333z m34.133333-580.266667H273.066667C122.88 0 0 122.88 0 273.066667v477.866666c0 150.186667 122.88 273.066667 273.066667 273.066667h477.866666c150.186667 0 273.066667-122.88 273.066667-273.066667V273.066667c0-150.186667-122.88-273.066667-273.066667-273.066667zM477.866667 716.8c0 37.546667-30.72 68.266667-68.266667 68.266667h-102.4c-37.546667 0-68.266667-30.72-68.266667-68.266667v-102.4c0-37.546667 30.72-68.266667 68.266667-68.266667h170.666667v170.666667z m0-238.933333H307.2c-37.546667 0-68.266667-30.72-68.266667-68.266667v-102.4c0-37.546667 30.72-68.266667 68.266667-68.266667h102.4c37.546667 0 68.266667 30.72 68.266667 68.266667v170.666667z m307.2 238.933333c0 37.546667-30.72 68.266667-68.266667 68.266667h-102.4c-37.546667 0-68.266667-30.72-68.266667-68.266667V546.133333h170.666667c37.546667 0 68.266667 30.72 68.266667 68.266667v102.4z m0-307.2c0 37.546667-30.72 68.266667-68.266667 68.266667H546.133333V307.2c0-37.546667 30.72-68.266667 68.266667-68.266667h102.4c37.546667 0 68.266667 30.72 68.266667 68.266667v102.4z m-68.266667 170.666667h-136.533333v136.533333c0 18.773333 15.36 34.133333 34.133333 34.133333h102.4c18.773333 0 34.133333-15.36 34.133333-34.133333v-102.4c0-18.773333-15.36-34.133333-34.133333-34.133333z m0-307.2h-102.4c-18.773333 0-34.133333 15.36-34.133333 34.133333v136.533333h136.533333c18.773333 0 34.133333-15.36 34.133333-34.133333v-102.4c0-18.773333-15.36-34.133333-34.133333-34.133333zM273.066667 614.4v102.4c0 18.773333 15.36 34.133333 34.133333 34.133333h102.4c18.773333 0 34.133333-15.36 34.133333-34.133333v-136.533333h-136.533333c-18.773333 0-34.133333 15.36-34.133333 34.133333z m443.733333-341.333333h-102.4c-18.773333 0-34.133333 15.36-34.133333 34.133333v136.533333h136.533333c18.773333 0 34.133333-15.36 34.133333-34.133333v-102.4c0-18.773333-15.36-34.133333-34.133333-34.133333z m0 0h-102.4c-18.773333 0-34.133333 15.36-34.133333 34.133333v136.533333h136.533333c18.773333 0 34.133333-15.36 34.133333-34.133333v-102.4c0-18.773333-15.36-34.133333-34.133333-34.133333z" fill="#3399FF" p-id="658"></path></svg>'
        },
        caption: 'BASIC\nFUNCTION',
        width: 'auto',
        style: {
          borderLineWidth: 2,
          borderColor: ''
        },
        headerStyle: {
          bgColor: '#9fc5e8',
          color: 'white',
          textAlign: 'center'
        }
      },
      {
        field: '',
        caption: '\n',
        width: 100,
        style: {
          borderLineWidth: 0
        }
      },
      {
        field: 'milestoneTwo',
        caption: 'basic functions',
        width: 'auto',
        style: {
          borderLineWidth: 2,
          borderColor: ''
        },
        headerStyle: {
          bgColor: '#2f9bfe',
          color: 'white'
        }
      }
    ],
    theme: {
      rowHeaderStyle: {
        borderLineWidth: 0,
        color: 'white'
      },
      frozenColumnLine: {
        shadow: {
          width: 24,
          startColor: 'rgba(00, 24, 47, 0.06)',
          endColor: 'rgba(00, 24, 47, 0)'
        }
      }
    },
    records,
    transpose: true,
    defaultRowHeight: 50,
    defaultHeaderColWidth: 200,
    autoRowHeight: true
  };

  const instance = new ListTable(option);

  // instance.setRecords(personsDataSource);

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag'],
  // });

  // instance.updateSortState({
  //   field: 'id',
  //   order: 'desc',
  // });

  // 只为了方便控制太调试用，不要拷贝
  (window as any).tableInstance = instance;
}
