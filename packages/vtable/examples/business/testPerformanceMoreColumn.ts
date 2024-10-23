/* eslint-disable */
import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/performanceMoreColumn.json')
    .then(res => res.json())
    .then(data => {
      const { records, rowTree, columnTree } = data;
      const option: VTable.PivotTableConstructorOptions = {
        rowTree,
        columnTree,
        rows: [
          {
            dimensionKey: 'job_typee6810c80_7e60_4991_9ab3_1bf46fba2cb9',
            title: '职位类别',
            headerStyle: {
              textStick: true
            },
            width: 100,
            showSort: false,
            drillDown: false,
            drillUp: false
          },
          {
            dimensionKey: 'job_idcb651b6d_20c2_4660_9d31_1da23111a0e6',
            title: '职位名称',
            headerStyle: {
              textStick: true
            },
            width: 100,
            showSort: false,
            drillDown: false,
            drillUp: false
          }
        ],
        columns: [
          {
            dimensionKey: '__BI__col_header_id__',
            title: '职位名称',
            headerStyle: {
              textStick: true,
              textAlign: 'center'
            },
            showSort: false,
            drillDown: false,
            drillUp: false
          },
          {
            dimensionKey: 'job_id6b5ab4f7_597c_4d89_b79a_fe4ce3312845',
            title: '职位名称',
            headerStyle: {
              textStick: true
            },
            showSort: false,
            drillDown: false,
            drillUp: false
          }
        ],
        indicators: [
          {
            indicatorKey: 'talent_basic_age4f8cb265_955c_442f_bf86_af4fb0776b67',
            value: '年龄',
            width: 'auto',
            showSort: true,
            style: {}
          },
          {
            indicatorKey: 'job_status57737112_93d0_4252_adba_1e6986d622c7',
            value: '职位状态',
            width: 'auto',
            showSort: true,
            style: {}
          }
        ],

        corner: {
          titleOnDimension: 'row'
        },
        showColumnHeader: true,
        showRowHeader: true,
        hideIndicatorName: false,

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
            click: {
              cellBorderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)', '#3073F2', 'rgb(224, 224, 224)'],
              cellBorderLineWidth: [0, 0, 2, 0],
              cellBgColor: 'rgba(0, 100, 250, 0.16)'
            },
            frameStyle: {
              borderColor: [null, null, 'rgb(224, 224, 224)', null],
              borderLineWidth: [0, 0, 2, 0]
            },
            fontSize: 12,
            fontWeight: 'bold',
            fontFamily:
              '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
            font: 'normal normal bold 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
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
            click: {
              cellBorderColor: '#3073F2',
              cellBorderLineWidth: [2],
              cellBgColor: 'rgba(186, 215, 255, 0.2)'
            },
            fontSize: 12,
            fontWeight: 'normal',
            fontFamily:
              '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
            font: 'normal normal normal 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
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
            click: {
              cellBorderColor: ['rgb(224, 224, 224)', '#3073F2', 'rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
              cellBorderLineWidth: [0, 2, 0, 0],
              cellBgColor: 'rgba(0, 100, 250, 0.16)'
            },
            frameStyle: {
              borderColor: [null, 'rgb(224, 224, 224)', null, null],
              borderLineWidth: [0, 2, 0, 0]
            },
            fontSize: 12,
            fontWeight: 'bold',
            fontFamily:
              '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
            font: 'normal normal bold 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
            lineHeight: 18
          },
          cornerHeaderStyle: {
            borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
            borderLineWidth: 1,
            padding: [8.6, 19, 8.6, 19],
            textAlign: 'left',

            frameStyle: {
              borderColor: [null, 'rgb(224, 224, 224)', 'rgb(224, 224, 224)', null],
              borderLineWidth: [0, 2, 2, 0]
            },
            fontSize: 12,
            fontWeight: 'bold',
            fontFamily:
              '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
            //"font": "normal normal bold -apple-system,\"Helvetica Neue\",\"PingFang SC\",\"Microsoft YaHei\",\"Hiragino Sans GB\",Helvetica,Arial,sans-serif,\"apple color emoji\",\"segoe ui emoji\",\"segoe ui\",\"segoe ui symbol\"",
            lineHeight: 18
          },
          menuStyle: {
            color: '#1B1F23',
            highlightColor: '#1E54C9',
            font: 'normal normal normal 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
            highlightFont:
              'normal normal bold 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"'
          },
          underlayBackgroundColor: 'rgba(255,255,255,0)',
          frameStyle: {
            borderColor: 'rgb(224, 224, 224)',
            borderLineWidth: 1
          },
          scrollStyle: {
            visible: 'focus',
            width: 7,
            hoverOn: true
          }
        },
        records,

        autoRowHeight: true,
        widthMode: 'standard',
        disableColumnResize: false,
        autoWrapText: false,
        enableColumnResizeOnAllRows: true,
        resizeColumnEventAllInfo: true,
        maxCharactersNumber: 256,
        keyboardOptions: {
          copySelected: false
        },
        columnResizerType: 'all',
        menuType: 'dom',
        pivotSortState: [],
        hover: {
          isShowTooltip: true,
          enableColumnHighlight: false,
          enableRowHighlight: true,
          enableSingalCellHighlight: true
        },
        click: {
          enableColumnHighlight: false,
          enableRowHighlight: false,
          enableSingalCellHighlight: true
        },
        container: document.getElementById(CONTAINER_ID)
      };
      const t0 = window.performance.now();
      const instance = new PivotTable(option);
      window.tableInstance = instance;
      console.log('new table', window.performance.now() - t0);
      // bindDebugTool(instance.scenegraph.stage as any, {
      //   customGrapicKeys: ['role', '_updateTag']
      // });

      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = instance;
    });
}
