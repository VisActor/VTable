import * as VTable from '@visactor/vtable';
const CONTAINER_ID = 'vTable';
const generatePersons = count => {
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
  const records = generatePersons(10);
  // eslint-disable-next-line max-len, prettier/prettier
  records[0].id = `"/dev/nvme0n1", "max_speed": "16.0 GT/s", "max_width": "x4", "sta_speed": "8.0 GT/s", 
    "sta_width": "x2", "Vendor_ID": "144d", "Device_ID": "a80a", "SVendor_ID": "144d", "SDevice_ID": "aa8a", 
    "NUMANode": "0", "manufacturer": "0x144d", "sn": "S666NN0W404994", "model": "SAMSUNG MZ1L21T9HCLS-00A07", 
    "fw_version": "GDC7502Q", "power_mode": "0", "capacity": 1.92}}}, "host_type": "default"}\n\n辛苦安排处理下 可以停机`;
  const columns: VTable.ColumnsDefine = [
    {
      field: '',
      title: '行号',
      width: 80,
      fieldFormat(data, col, row, table) {
        return row - 1;
      }
    },
    {
      field: 'id',
      title: 'ID',
      width: '1%',
      minWidth: 200,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
    }
  ];
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    tooltip: {
      isShowOverflowTextTooltip: true
    }
    // frozenColCount: 1,
    // bottomFrozenRowCount: 2,
    // rightFrozenColCount: 2,
    // overscrollBehavior: 'none'
    // autoWrapText: true,
    // heightMode: 'autoHeight',
    // widthMode: 'adaptive'
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  window.csvOption = {
    escape: true
  };
  // tableInstance.on('sort_click', args => {
  //   tableInstance.updateSortState(
  //     {
  //       field: args.field,
  //       order: Date.now() % 3 === 0 ? 'desc' : Date.now() % 3 === 1 ? 'asc' : 'normal'
  //     },
  //     false
  //   );
  //   return false; //return false代表不执行内部排序逻辑
  // });
}
