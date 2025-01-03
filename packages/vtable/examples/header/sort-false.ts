import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    {
      230517143221027: 'CA-2018-10',
      230517143221030: 'JM-15580',
      230517143221032: 'Bagged Rubber Bands',
      230517143221023: 'Office Supplies',
      230517143221034: 'Fasteners',
      230517143221037: 'West',
      230517143221024: 'Loveland',
      230517143221029: '2018-12-30',
      230517143221042: '3',
      230517143221040: '3.024',
      230517143221041: '-0.605'
    },
    {
      230517143221027: 'CA-2018-70',
      230517143221030: 'EB-13975',
      230517143221032: 'GBC Binding covers',
      230517143221023: 'Office Supplies',
      230517143221034: 'Binders',
      230517143221037: 'West',
      230517143221024: 'Fairfield',
      230517143221029: '2018-12-30',
      230517143221042: '2',
      230517143221040: '20.72',
      230517143221041: '6.475'
    },
    {
      230517143221027: 'CA-2018-30',
      230517143221030: 'EB-13975',
      230517143221032: 'Cardinal Slant-D Ring Binder, Heavy Gauge Vinyl',
      230517143221023: 'Office Supplies',
      230517143221034: 'Binders',
      230517143221037: 'West',
      230517143221024: 'Fairfield',
      230517143221029: '2018-12-30',
      230517143221042: '2',
      230517143221040: '13.904',
      230517143221041: '4.519'
    },
    {
      230517143221027: 'CA-2018-80',
      230517143221030: 'PO-18865',
      230517143221032: 'Wilson Jones Legal Size Ring Binders',
      230517143221023: 'Office Supplies',
      230517143221034: 'Binders',
      230517143221037: 'East',
      230517143221024: 'New York City',
      230517143221029: '2018-12-30',
      230517143221042: '3',
      230517143221040: '52.776',
      230517143221041: '19.791'
    },
    {
      230517143221027: 'CA-2018-20',
      230517143221030: 'PO-18865',
      230517143221032: 'Gear Head AU3700S Headset',
      230517143221023: 'Technology',
      230517143221034: 'Phones',
      230517143221037: 'East',
      230517143221024: 'New York City',
      230517143221029: '2018-12-30',
      230517143221042: '7',
      230517143221040: '90.93',
      230517143221041: '2.728'
    },
    {
      230517143221027: 'CA-2018-40',
      230517143221030: 'PO-18865',
      230517143221032: 'Bush Westfield Collection Bookcases, Fully Assembled',
      230517143221023: 'Furniture',
      230517143221034: 'Bookcases',
      230517143221037: 'East',
      230517143221024: 'New York City',
      230517143221029: '2018-12-30',
      230517143221042: '4',
      230517143221040: '323.136',
      230517143221041: '12.118'
    },
    {
      230517143221027: 'CA-2018-60',
      230517143221030: 'CC-12430',
      230517143221032: 'Eureka The Boss Plus 12-Amp Hard Box Upright Vacuum, Red',
      230517143221023: 'Office Supplies',
      230517143221034: 'Appliances',
      230517143221037: 'Central',
      230517143221024: 'Columbus',
      230517143221029: '2018-12-30',
      230517143221042: '2',
      230517143221040: '209.3',
      230517143221041: '56.511'
    },
    {
      230517143221027: 'US-2018-50',
      230517143221030: 'KH-16360',
      230517143221032: 'Harbour Creations Steel Folding Chair',
      230517143221023: 'Furniture',
      230517143221034: 'Chairs',
      230517143221037: 'South',
      230517143221024: 'Louisville',
      230517143221029: '2018-12-29',
      230517143221042: '3',
      230517143221040: '258.75',
      230517143221041: '77.625'
    },
    {
      230517143221027: 'US-2018-90',
      230517143221030: 'KH-16360',
      230517143221032: 'Global Leather and Oak Executive Chair, Black',
      230517143221023: 'Furniture',
      230517143221034: 'Chairs',
      230517143221037: 'South',
      230517143221024: 'Louisville',
      230517143221029: '2018-12-29',
      230517143221042: '1',
      230517143221040: '300.98',
      230517143221041: '87.284'
    },
    {
      230517143221027: 'US-2018-10',
      230517143221030: 'KH-16360',
      230517143221032: 'Panasonic KP-350BK Electric Pencil Sharpener with Auto Stop',
      230517143221023: 'Office Supplies',
      230517143221034: 'Art',
      230517143221037: 'South',
      230517143221024: 'Louisville',
      230517143221029: '2018-12-29',
      230517143221042: '1',
      230517143221040: '34.58',
      230517143221041: '10.028'
    },
    {
      230517143221027: 'US-2018-40',
      230517143221030: 'KH-16360',
      230517143221032: 'GBC ProClick Spines for 32-Hole Punch',
      230517143221023: 'Office Supplies',
      230517143221034: 'Binders',
      230517143221037: 'South',
      230517143221024: 'Louisville',
      230517143221029: '2018-12-29',
      230517143221042: '1',
      230517143221040: '12.53',
      230517143221041: '5.889'
    },
    {
      230517143221027: 'US-2018-30',
      230517143221030: 'KH-16360',
      230517143221032: 'DMI Arturo Collection Mission-style Design Wood Chair',
      230517143221023: 'Furniture',
      230517143221034: 'Chairs',
      230517143221037: 'South',
      230517143221024: 'Louisville',
      230517143221029: '2018-12-29',
      230517143221042: '8',
      230517143221040: '1207.84',
      230517143221041: '314.038'
    },
    {
      230517143221027: 'CA-2018-99',
      230517143221030: 'BS-11755',
      230517143221032: 'Hand-Finished Solid Wood Document Frame',
      230517143221023: 'Furniture',
      230517143221034: 'Furnishings',
      230517143221037: 'West',
      230517143221024: 'Edmonds',
      230517143221029: '2018-12-29',
      230517143221042: '2',
      230517143221040: '68.46',
      230517143221041: '20.538'
    }
  ];

  const columns = [
    {
      field: '230517143221027',
      title: 'Order ID',
      width: 'auto',
      showSort: true,
      sort: false
    },
    {
      field: '230517143221030',
      title: 'Customer ID',
      width: 'auto',
      showSort: true
    },
    {
      field: '230517143221032',
      title: 'Product Name',
      width: 'auto'
    },
    {
      field: '230517143221023',
      title: 'Category',
      width: 'auto'
    },
    {
      field: '230517143221034',
      title: 'Sub-Category',
      width: 'auto'
    },
    {
      field: '230517143221037',
      title: 'Region',
      width: 'auto'
    },
    {
      field: '230517143221024',
      title: 'City',
      width: 'auto'
    },
    {
      field: '230517143221029',
      title: 'Order Date',
      width: 'auto'
    },
    {
      field: '230517143221042',
      title: 'Quantity',
      width: 'auto'
    },
    {
      field: '230517143221040',
      title: 'Sales',
      width: 'auto'
    },
    {
      field: '230517143221041',
      title: 'Profit',
      width: 'auto'
    }
  ];

  const option = {
    records,
    columns,
    widthMode: 'standard'
  };

  // 创建 VTable 实例
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = tableInstance;
  let clickCount = 0;
  tableInstance.on('sort_click', args => {
    clickCount++;
    const sortState = clickCount % 3 === 0 ? 'desc' : clickCount % 3 === 1 ? 'asc' : 'normal';
    sortRecords(args.field, sortState)
      .then(records => {
        tableInstance.setRecords(records, { sortState: null });
        tableInstance.updateSortState(
          {
            field: args.field,
            order: sortState
          },
          false
        );
      })
      .catch(e => {
        throw e;
      });
    // return false; //return false代表不执行内部排序逻辑
  });
  function sortRecords(field, sort) {
    const promise = new Promise((resolve, reject) => {
      records.sort((a, b) => {
        return sort === 'asc' ? b[field].localeCompare(a[field]) : a[field].localeCompare(b[field]);
      });
      resolve(records);
    });
    return promise;
  }
}
