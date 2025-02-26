import * as VTable from '../../src';
import { animalImageUrl, flowerVideoUrl } from '../resource-url';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    [100, animalImageUrl, flowerVideoUrl, 500, animalImageUrl, flowerVideoUrl],
    [100, animalImageUrl, flowerVideoUrl, 500, animalImageUrl, flowerVideoUrl],
    [100, animalImageUrl, flowerVideoUrl, 500, animalImageUrl, flowerVideoUrl],
    [100, animalImageUrl, flowerVideoUrl, 500, animalImageUrl, flowerVideoUrl]
  ];
  const option: VTable.PivotTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columnTree: [
      {
        dimensionKey: '地区',
        value: '东北',
        children: [
          {
            dimensionKey: '邮寄方式',
            value: '一级',
            children: [
              {
                indicatorKey: '1',
                value: '销售额'
              },
              {
                indicatorKey: '2',
                value: '图片'
              },
              {
                indicatorKey: '3',
                value: '视频'
              }
            ]
          },
          {
            dimensionKey: '邮寄方式',

            value: '二级',
            children: [
              {
                indicatorKey: '1',
                value: '销售额'
              },
              {
                indicatorKey: '2',
                value: '图片'
              },
              {
                indicatorKey: '3',
                value: '视频'
              }
            ]
          }
        ]
      }
    ],
    rowTree: [
      {
        dimensionKey: '类别',
        //title: '类别',
        value: '办公用品',
        children: [
          {
            dimensionKey: '子类别', //title: '子类别',
            // value: '电脑',
            value: animalImageUrl
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            // value: '装订机',
            value: animalImageUrl
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            // value: '签字笔',
            value: animalImageUrl
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            // // value: '标签',
            value: animalImageUrl
          }
        ]
      }
    ],
    columns: [
      {
        dimensionKey: '地区',
        title: '地区',
        headerStyle: {
          textAlign: 'center',
          padding: 2
        },
        keepAspectRatio: true
      },
      {
        dimensionKey: '邮寄方式',
        title: '邮寄方式',
        headerStyle: {
          textAlign: 'center'
        }
      }
    ],
    rows: [
      {
        dimensionKey: '类别',
        title: '类别',
        headerStyle: {
          color: 'red',
          textAlign: 'center'
        }
      },
      {
        dimensionKey: '子类别',
        title: '子类别',
        headerStyle: {
          textAlign: 'center'
        },
        headerType: 'link',
        width: 'auto'
      }
    ],
    indicators: [
      {
        indicatorKey: '1',
        title: '销售额',
        // format(rec) { return rec + 4000 },
        style: { textAlign: 'center', color: 'red' },
        headerStyle: { textAlign: 'center' },
        cellType: 'link',
        linkJump: false,
        linkDetect: false
      },
      {
        indicatorKey: '2',
        title: '图片',
        // format(rec) { return rec + 4000 },
        // bodyStyle: { textAlign: 'center' as any, color: 'red' },
        cellType(args) {
          const row = args.row;
          if (row % 3 === 0) {
            return 'image';
          } else if (row % 3 === 1) {
            return 'link';
          }
          return 'text';
        },
        keepAspectRatio: true,
        headerStyle: { textAlign: 'center' },
        style: {
          textAlign: 'center',
          padding: 2
        },
        width: 200
        // pivot暂不支持模板链接
        // templateLink: 'https://www.google.com.hk/search?q={label}+{prop}',
      },
      {
        indicatorKey: '3',
        title: '视频',
        // format(rec) { return rec + 4000 },
        // bodyStyle: { textAlign: 'center' as any, color: 'red' },
        cellType: 'video',
        keepAspectRatio: true,
        style: {
          textAlign: 'center',
          padding: 2
        },
        width: 200
        // pivot暂不支持模板链接
        // templateLink: 'https://www.google.com.hk/search?q={label}+{prop}',
      }
    ],
    indicatorTitle: '指标名称',
    theme: VTable.themes.DEFAULT,
    records: records,
    // widthMode: 'autoWidth', // 宽度模式：standard 标准模式； adaptive 自动填满容器
    resize: {
      columnResizeType: 'indicator' // 'column' | 'indicator' | 'all'
    },
    defaultRowHeight: 100,
    defaultHeaderRowHeight: 40
  };

  const instance = new PivotTable(option);

  VTable.bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
