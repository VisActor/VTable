import * as VTable from '@visactor/vtable';
const CONTAINER_ID = 'vTable';
import { MasterDetailPlugin } from '../../src';
let tableInstance;
const masterDetailPlugin = new MasterDetailPlugin({
  id: 'employee-detail-plugin',
  detailGridOptions: ({ data, bodyRowIndex }) => {
    if (bodyRowIndex === 0) {
      return {
        columns: [
          {
            field: 'project',
            title: '项目名称',
            width: 180
          },
          {
            field: 'role',
            title: '项目角色',
            width: 120
          },
          {
            field: 'startDate',
            title: '开始日期',
            width: 100
          },
          {
            field: 'endDate',
            title: '结束日期',
            width: 100
          },
          {
            field: 'progress',
            title: '项目进度',
            width: 100,
            fieldFormat: (value: number) => `${value}%`
          }
        ],
        theme: VTable.themes.BRIGHT,
        style: {
          margin: 20,
          height: 300
        }
      };
    }
    return {
      columns: [
        {
          field: 'project',
          title: '项目名称',
          width: 180
        },
        {
          field: 'role',
          title: '项目角色',
          width: 120
        },
        {
          field: 'startDate',
          title: '开始日期',
          width: 100
        },
        {
          field: 'endDate',
          title: '结束日期',
          width: 100
        },
        {
          field: 'progress',
          title: '项目进度',
          width: 100,
          fieldFormat: (value: number) => `${value}%`
        }
      ],
      theme: VTable.themes.DARK,
      style: {
        margin: 20,
        height: 300
      }
    };
  }
});
const generatePersons = count => {
	return Array.from(new Array(count)).map((_, i) => ({
		id: i + 1,
		email1: `${i + 1}@xxx.com`,
		name: `name${i + 1}`,
		date1: '2022-9-1日',
		tel: '000-0000-0000',
		sex: i % 2 === 0 ? 'boy' : 'girl',
		work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
		city: 'beijing',
    children: [
    {
      project: `项目A-${1}`,
      role: '负责人',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      progress: 85
    },
      ]
	}));
};
const records = generatePersons(11);

const columns = [
	{
		field: 'id',
		title: 'ID ff',
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
	},
	{
		field: 'date1',
		title: 'birthday',
		width: 200
	},
	{
		field: 'sex',
		title: 'sex',
		width: 100
	},
	{
		field: 'tel',
		title: 'telephone',
		width: 150
	},
	{
		field: 'work',
		title: 'job',
		width: 200
	},
	{
		field: 'city',
		title: 'city',
		width: 150
	}

];

const option = {
	records,
	columns,
	widthMode: 'standard',
	bottomFrozenRowCount: 1,
  plugins: [masterDetailPlugin],
	customMergeCell: (col, row, table) => {
		if (col >= 0 && col < table.colCount && row === table.rowCount - 2) {
			return {
				text: '总结栏：此数据为一份人员基本信息',
				range: {
					start: {
						col: 0,
						row: table.rowCount - 2
					},
					end: {
						col: table.colCount - 2,
						row: table.rowCount - 2
					}
				},
				style: {
					borderLineWidth: [6, 1, 1, 1],
					borderColor: ['gray']
				}
			};
		}
	}
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
