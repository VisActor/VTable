import * as VTable from '../../src';
import type { BaseTableAPI } from '../../src/ts-types/base-table';
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
  const records = generatePersons(1000000);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 120,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    title: {
      text: 'dsagf',
      align: 'center',
      subtext: '这是一个子标题\ndsag反馈第三个国际服大教室',
      orient: 'top',
      padding: 40
    },
    legends: {
      data: [
        {
          label: '公司-数量',
          shape: {
            fill: '#2E62F1',
            symbolType: 'circle'
          }
        },
        {
          label: '小型企业-数量',
          shape: {
            fill: '#4DC36A',
            symbolType: 'square'
          }
        },
        {
          label: '消费者-数量',
          shape: {
            fill: '#FF8406',
            symbolType: 'circle'
          }
        },
        {
          label: '公司-销售额',
          shape: {
            fill: '#FFCC00',
            symbolType: 'circle'
          }
        },
        {
          label: '小型企业-销售额',
          shape: {
            fill: '#4F44CF',
            symbolType: 'circle'
          }
        },
        {
          label: '消费者-销售额',
          shape: {
            fill: '#5AC8FA',
            symbolType: 'circle'
          }
        },
        {
          label: '公司-利润',
          shape: {
            fill: '#003A8C',
            symbolType: 'circle'
          }
        },
        {
          label: '小型企业-利润',
          shape: {
            fill: '#B08AE2',
            symbolType: 'circle'
          }
        },
        {
          label: '消费者-利润',
          shape: {
            fill: '#FF6341',
            symbolType: 'circle'
          }
        },
        {
          label: '公司-折扣',
          shape: {
            fill: '#98DD62',
            symbolType: 'circle'
          }
        },
        {
          label: '小型企业-折扣',
          shape: {
            fill: '#07A199',
            symbolType: 'circle'
          }
        },
        {
          label: '消费者-折扣',
          shape: {
            fill: '#87DBDD',
            symbolType: 'circle'
          }
        }
      ],
      orient: 'top',
      position: 'start',
      maxRow: 1,
      padding: [50, 0, 0, 0]
    },
    menu: {
      contextMenuItems: (field: string, row: number, col: number, table: BaseTableAPI) => {
        if (row === 0) {
          return [];
        }
        const data = table.getCellOriginRecord(col, row);
        if (data.id === 1) {
          return ['复制', '粘贴', '删除'];
        } else if (data.id === 3) {
          return [];
        }
        return ['复制', '粘贴'];
      }
    }
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  setTimeout(() => {
    delete option.legends;
    option.title = {
      text: 'dsagf',
      align: 'right',
      subtext:
        '这是一个子标题\ndsag反馈第三个国际服大教室这是一个子标题\ndsag反馈第三个国际服大教室这是一个子标题\ndsag反馈第三个国际服大教室这是一个子标题\ndsag反馈第三个国际服大教室',
      orient: 'top',
      padding: 40
    };
    option.theme = VTable.themes.DEFAULT.extends({
      underlayBackgroundColor: 'red'
    });
    tableInstance.updateOption(option);
  }, 6000);
}
