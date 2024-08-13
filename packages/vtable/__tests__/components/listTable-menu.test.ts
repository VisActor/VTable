// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from '../data/marketsales.json';
import { ListTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-menu init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';
  const columns = [
    {
      field: '订单 ID',
      caption: '订单 ID',
      sort: true,
      width: 'auto',
      description: '这是订单的描述信息',
      style: {
        fontFamily: 'Arial',
        fontSize: 14
      }
    },
    {
      field: '订单日期',
      caption: '订单日期'
    },
    {
      field: '发货日期',
      caption: '发货日期'
    },
    {
      field: '客户名称',
      caption: '客户名称',
      style: {
        padding: [10, 0, 10, 60]
      }
    },
    {
      field: '邮寄方式',
      caption: '邮寄方式'
    },
    {
      field: '省/自治区',
      caption: '省/自治区'
    },
    {
      field: '产品名称',
      caption: '产品名称'
    },
    {
      field: '类别',
      caption: '类别'
    },
    {
      field: '子类别',
      caption: '子类别'
    },
    {
      field: '销售额',
      caption: '销售额'
    },
    {
      field: '数量',
      caption: '数量'
    },
    {
      field: '折扣',
      caption: '折扣'
    },
    {
      field: '利润',
      caption: '利润'
    }
  ];
  const option = {
    columns,
    defaultColWidth: 150,
    allowFrozenColCount: 5
  };

  option.container = containerDom;
  option.records = records;
  const listTable = new ListTable(option);
  test('listTable-menu getCell', () => {
    expect(listTable.stateManager.menu.isShow).toBe(false);
    const col = 0;
    const row = 2;
    listTable.showDropDownMenu(col, row, {
      content: [
        {
          type: 'title',
          text: 'action'
        },
        {
          text: 'delete',
          menuKey: 'delete',
          // icon: {
          //   svg:  "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg",
          // },
          icon: {
            svg: '<svg t="1684643332116" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11284" width="200" height="200"><path d="M912.526651 867.741144 555.540144 510.712681l356.986507-357.000833c11.171434-11.18576 11.171434-29.257348 0-40.443108-11.20111-11.18576-29.272697-11.18576-40.444131 0L515.096013 470.267527 158.096203 113.267716c-11.187807-11.159154-29.258371-11.159154-40.444131 0-11.186783 11.186783-11.186783 29.286 0 40.47176L474.623229 510.712681 117.623419 867.741144c-11.159154 11.172457-11.159154 29.216415 0 40.443108 11.18576 11.17348 29.284977 11.17348 40.47176 0l357.000833-357.027439 356.985484 357.027439c11.171434 11.17348 29.243021 11.17348 40.444131 0C923.698085 896.957559 923.725714 878.913601 912.526651 867.741144z" fill="#5D5D5D" p-id="11285"></path></svg>',
            width: 15,
            height: 15
          }
        },
        {
          text: 'modify',
          menuKey: 'modify',
          icon: {
            width: 15,
            height: 15,
            svg: '<svg t="1684643607026" class="icon" viewBox="0 0 1069 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13141" width="200" height="200"><path d="M960.206979 1024H43.574468A43.620948 43.620948 0 0 1 0 980.425532V117.871841a43.620948 43.620948 0 0 1 43.574468-43.574468h516.421356a20.334752 20.334752 0 0 1 0 40.669504H43.574468a2.904965 2.904965 0 0 0-2.904964 2.904964v862.565311a2.904965 2.904965 0 0 0 2.904964 2.904964h916.644131a2.904965 2.904965 0 0 0 2.904964-2.904964V515.340709a20.334752 20.334752 0 0 1 40.669504 0v465.096443a43.620948 43.620948 0 0 1-43.586088 43.562848z" p-id="13142"></path><path d="M518.687228 570.418837a20.334752 20.334752 0 0 1-14.362144-34.731756L1035.120204 5.949367a20.334752 20.334752 0 0 1 28.72429 28.782389l-530.795121 529.737714a20.276652 20.276652 0 0 1-14.362145 5.949367z" p-id="13143"></path></svg>'
          }
        },
        {
          text: 'aggregation',
          menuKey: 'aggregation',
          icon: {
            width: 15,
            height: 15,
            svg: '<svg t="1684644028228" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15087" width="200" height="200"><path d="M390.208 300.5696h95.573333a32 32 0 0 1 0 64h-123.690666l-46.203734 105.169067H412.330667a32 32 0 0 1 0 64H287.773867L241.088 640h78.062933a32 32 0 1 1 0 64H212.970667l-61.8368 140.753067A21.333333 21.333333 0 0 0 170.666667 874.666667h245.969066a34.133333 34.133333 0 0 0 31.249067-20.4032L744.4352 179.242667A21.333333 21.333333 0 0 0 724.9024 149.333333h-254.3232a21.333333 21.333333 0 0 0-19.5328 12.753067L390.208 300.5696zM508.821333 874.666667H906.666667a32 32 0 1 1 0 64H170.666667c-47.1296 0-85.333333-38.203733-85.333334-85.333334a85.333333 85.333333 0 0 1 7.210667-34.321066l299.908267-682.666667A85.333333 85.333333 0 0 1 470.574933 85.333333H724.906667c47.1296 0 85.333333 38.203733 85.333333 85.333334a85.333333 85.333333 0 0 1-7.2064 34.321066L508.8256 874.666667z" fill="#333333" p-id="15088"></path></svg>'
          },
          children: [
            {
              text: 'average',
              menuKey: 'average'
            },
            {
              text: 'sum',
              menuKey: 'sum'
            }
          ]
        }
      ],
      referencePosition: {
        rect: {
          left: 17,
          right: 39,
          top: 90,
          bottom: 112,
          width: 22,
          height: 22
        }
      }
    });

    expect(listTable.stateManager.menu.isShow).toBe(true);
    listTable.release();
  });
});
