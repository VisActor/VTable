import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option: VTable.PivotTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    rows: [
      {
        dimensionKey: '221205165418024',
        title: '子类别',
        width: 'auto',
        showSort: false,
        drillDown: false,
        drillUp: false,
        headerType: 'link',
        linkDetect: true,
        linkJump: false
      }
    ],
    columns: [
      {
        dimensionKey: '221205165418035',
        title: '邮寄方式',
        headerStyle: {
          textAlign: 'right'
        },
        showSort: false,
        drillDown: false,
        drillUp: false,
        headerType: 'link',
        linkDetect: true,
        linkJump: false
      }
    ],
    rowTree: [
      {
        dimensionKey: '221205165418024',
        value: '书架'
      },
      {
        dimensionKey: '221205165418024',
        value: '信封'
      },
      {
        dimensionKey: '221205165418024',
        value: '器具'
      },
      {
        dimensionKey: '221205165418024',
        value: '复印机'
      },
      {
        dimensionKey: '221205165418024',
        value: '收纳具'
      },
      {
        dimensionKey: '221205165418024',
        value: '标签'
      },
      {
        dimensionKey: '221205165418024',
        value: '桌子'
      },
      {
        dimensionKey: '221205165418024',
        value: '椅子'
      },
      {
        dimensionKey: '221205165418024',
        value: '用具'
      },
      {
        dimensionKey: '221205165418024',
        value: '用品'
      },
      {
        dimensionKey: '221205165418024',
        value: '电话'
      },
      {
        dimensionKey: '221205165418024',
        value: '系固件'
      },
      {
        dimensionKey: '221205165418024',
        value: '纸张'
      },
      {
        dimensionKey: '221205165418024',
        value: '美术'
      },
      {
        dimensionKey: '221205165418024',
        value: '装订机'
      },
      {
        dimensionKey: '221205165418024',
        value: '设备'
      },
      {
        dimensionKey: '221205165418024',
        value: '配件'
      }
    ],
    columnTree: [
      {
        dimensionKey: '221205165418035',
        value: '二级'
      },
      {
        dimensionKey: '221205165418035',
        value: '标准级'
      },
      {
        dimensionKey: '221205165418035',
        value: '一级'
      },
      {
        dimensionKey: '221205165418035',
        value: '当日'
      }
    ],
    theme: {
      headerStyle: {
        borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
        borderLineWidth: 1,
        padding: [8.6, 19, 8.6, 19],
        textAlign: 'center',
        hover: {
          cellBgColor: 'rgba(0, 100, 250, 0.16)',
          inlineRowBgColor: 'rgba(255, 255, 255, 0)',
          inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
        },
        frameStyle: {
          borderColor: [null, null, 'rgb(224, 224, 224)', null],
          borderLineWidth: 2
        },
        fontSize: 12,
        fontStyle: 'bold',
        fontFamily:
          // eslint-disable-next-line max-len
          '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        lineHeight: 18
      },
      bodyStyle: {
        borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
        borderLineWidth: 1,
        padding: [8.6, 19, 8.6, 19],
        textAlign: 'right',
        hover: {
          cellBgColor: 'rgba(186, 215, 255, 0.2)',
          inlineRowBgColor: 'rgba(186, 215, 255, 0.2)',
          inlineColumnBgColor: 'rgba(186, 215, 255, 0.2)'
        },
        fontSize: 12,
        fontFamily:
          // eslint-disable-next-line max-len
          '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        lineHeight: 18
      },
      rowHeaderStyle: {
        borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
        borderLineWidth: 1,
        padding: [8.6, 19, 8.6, 19],
        textAlign: 'left',
        hover: {
          cellBgColor: 'rgba(0, 100, 250, 0.16)',
          inlineRowBgColor: 'rgba(255, 255, 255, 0)',
          inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
        },
        frameStyle: {
          borderColor: [null, 'rgb(224, 224, 224)', null, null],
          borderLineWidth: 2
        },
        fontSize: 12,
        fontStyle: 'bold',
        fontFamily:
          // eslint-disable-next-line max-len
          '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        lineHeight: 18
      },
      cornerHeaderStyle: {
        borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
        borderLineWidth: 1,
        padding: [8.6, 19, 8.6, 19],
        textAlign: 'left',
        hover: {
          cellBgColor: 'rgba(0, 100, 250, 0.16)',
          inlineRowBgColor: 'rgba(255, 255, 255, 0)',
          inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
        },
        frameStyle: {
          borderColor: [null, 'rgb(224, 224, 224)', 'rgb(224, 224, 224)', null],
          borderLineWidth: 2
        },
        fontSize: 12,
        fontFamily:
          // eslint-disable-next-line max-len
          '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        lineHeight: 18
      },
      menuStyle: {
        color: '#1B1F23',
        highlightColor: '#1E54C9',
        // eslint-disable-next-line max-len
        font: 'normal normal normal 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        highlightFont:
          // eslint-disable-next-line max-len
          'normal normal bold 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"'
      },
      underlayBackgroundColor: 'rgba(255,255,255,0)',
      frameStyle: {
        borderColor: 'rgb(224, 224, 224)',
        borderLineWidth: 1
      },
      scrollStyle: {
        scrollSliderColor: '#C0C0C0',
        visible: 'scrolling',
        width: 7,
        hoverOn: true
      },
      selectionStyle: {
        cellBorderColor: '#3073F2',
        cellBorderLineWidth: 2,
        cellBgColor: 'rgba(0, 100, 250, 0.16)'
      }
    },
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textStick: true
      }
    },
    hideIndicatorName: true,
    showFrozenIcon: false, //显示VTable内置冻结列图标
    allowFrozenColCount: 2,
    // widthMode: 'autoWidth', // 宽度模式：standard 标准模式； adaptive 自动填满容器
    columnResizeType: 'indicator' // 'column' | 'indicator' | 'all'
  };

  const instance = new PivotTable(option);

  const { PIVOT_SORT_CLICK } = VTable.PivotTable.EVENT_TYPE;
  instance.on(PIVOT_SORT_CLICK, e => {
    const order = e.order === 'asc' ? 'desc' : e.order === 'desc' ? 'normal' : 'asc';
    instance.updatePivotSortState([{ dimensions: e.dimensionInfo, order }]);
  });

  bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
