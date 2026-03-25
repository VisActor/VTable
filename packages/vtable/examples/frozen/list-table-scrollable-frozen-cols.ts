import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const generatePersons = (count: number) => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

export function createTable() {
  const records = generatePersons(100);
  const columns: VTable.ColumnsDefine = [
    { field: 'id', title: 'ID', width: 120, sort: true },
    { field: 'email1', title: 'email', width: 220, sort: true },
    { field: 'name', title: 'First Name', width: 160 },
    { field: 'lastName', title: 'Last Name', width: 160 },
    { field: 'date1', title: 'birthday', width: 160 },
    { field: 'sex', title: 'sex', width: 120 },
    { field: 'tel', title: 'telephone', width: 180 },
    { field: 'work', title: 'job', width: 200 },
    { field: 'city', title: 'city', width: 160 },
    { field: 'work', title: 'job2', width: 200 },
    { field: 'city', title: 'city2', width: 160 },
    { field: 'tel', title: 'telephone2', width: 180 },
    { field: 'work', title: 'job', width: 200 },
    { field: 'city', title: 'city', width: 160 },
    { field: 'work', title: 'job2', width: 200 },
    { field: 'city', title: 'city2', width: 160 },
    { field: 'tel', title: 'telephone2', width: 180 }
  ];

  const option: VTable.TYPES.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    frozenColCount: 6,
    rightFrozenColCount: 4,
    maxFrozenWidth: 320,
    scrollFrozenCols: true,
    maxRightFrozenWidth: 320,
    scrollRightFrozenCols: true,
    scrollFrozenColsPassThroughToBody: true,
    theme: VTable.themes.DEFAULT.extends({
      scrollStyle: {
        visible: 'scrolling'
      }
    }),
    excelOptions: {
      fillHandle: args => {
        const { selectRanges, table } = args;
        if (selectRanges.length === 1) {
          const { start, end } = selectRanges[0];
          console.log('fillHandle', start, end);
          const minCol = Math.min(start.col, end.col);
          const maxCol = Math.max(start.col, end.col);
          const minRow = Math.min(start.row, end.row);
          const maxRow = Math.max(start.row, end.row);
          //判断start到end 所有单元格有没有不能编辑的
          for (let col = minCol; col <= maxCol; col++) {
            for (let row = minRow; row <= maxRow; row++) {
              if (row === 2 && col === 2) {
                return false;
              }
            }
          }
          return true;
        }
        return false;
      }
    }
  };

  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;
}
