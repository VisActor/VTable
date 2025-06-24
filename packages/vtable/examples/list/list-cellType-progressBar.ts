import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';

// 该文档修复 cellType为 progressbar 不展示icon问题 #4047
VTable.register.icon('order', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg',
  width: 22,
  height: 22,
  name: 'order',
  positionType: VTable.TYPES.IconPosition.left,
  marginLeft: -7,
  marginRight: 10,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});
export function createTable() {
  const records = [
    {
      name: '鸽子',
      introduction: '鸽子是一种常见的城市鸟类，具有灰色的羽毛和短而粗壮的喙',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.jpeg',
      video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.mp4',
      YoY: 50,
      QoQ: 10,
      trend: [
        { x: 1, y: 1500 },
        { x: 2, y: 1480 },
        { x: 3, y: 1520 },
        { x: 4, y: 1550 },
        { x: 5, y: 1600 }
      ]
      //  "trend":[1500,1480,1520,1550,1600],
    },
    {
      name: '燕子',
      introduction: '燕子是一种善于飞行的鸟类，通常栖息在房屋和建筑物的附近。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/swallow.jpeg',
      video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/swallow.mp4',
      YoY: 10,
      QoQ: -10,
      trend: [
        { x: 1, y: 800 },
        { x: 2, y: 780 },
        { x: 3, y: 700 },
        { x: 4, y: 800 },
        { x: 5, y: 900 }
      ]
    },
    {
      name: '喜鹊',
      introduction:
        '喜鹊是一种常见的小型鸟类，主要分布在亚洲地区。它们体型较小，具有黑色的头部和喉咙、灰色的背部和白色的腹部。喜鹊是群居动物，常常在树林中或城市公园中筑巢繁殖，以昆虫、果实和种子为食。它们还具有很高的智商和社交性，被认为是一种聪明、有趣的鸟类。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Magpie.jpeg',
      video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Magpie.mp4',
      YoY: -10,
      QoQ: -10,
      trend: [
        { x: 1, y: 500 },
        { x: 2, y: 680 },
        { x: 3, y: 400 },
        { x: 4, y: 600 },
        { x: 5, y: 800 }
      ]
    },
    {
      name: '孔雀',
      introduction:
        '孔雀是一种美丽的大型鸟类，拥有灿烂的蓝绿色羽毛和长长的尾羽。主要生活在南亚地区，以昆虫、水果和种子为食。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/peacock.jpeg',
      video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/peacock.mp4',
      YoY: 5,
      QoQ: -10,
      trend: [
        { x: 1, y: 500 },
        { x: 2, y: 680 },
        { x: 3, y: 400 },
        { x: 4, y: 600 },
        { x: 5, y: 800 }
      ]
    }
  ];
  const columns: VTable.ColumnsDefine = [
    {
      field: 'YoY',
      title: 'count Year-over-Year',
      cellType: 'progressbar',
      width: 200,
      fieldFormat(rec) {
        if (typeof rec.YoY === 'number') {
          return rec.YoY + '%';
        }
        return rec.YoY;
      },
      icon: 'order'
    },
    {
      field: 'YoY',
      title: 'count Year-over-Year',
      cellType: 'progressbar',
      width: 200,
      style: {
        barHeight: '100%',
        // barBgColor: '#aaa',
        // barColor: '#444',
        barBgColor: data => {
          return `rgb(${200 + 50 * (1 - data.percentile)},${255 * (1 - data.percentile)},${
            255 * (1 - data.percentile)
          })`;
        },
        barColor: 'transparent'
      }
    },
    {
      field: 'YoY',
      title: 'count Year-over-Year',
      cellType: 'progressbar',
      width: 200,
      fieldFormat() {
        return '';
      },
      min: -20,
      max: 60,
      style: {
        showBar: true,
        barColor: data => {
          return `rgb(${200 + 50 * (1 - data.percentile)},${255 * (1 - data.percentile)},${
            255 * (1 - data.percentile)
          })`;
        },
        barHeight: 20,
        barBottom: '30%'
      }
    },
    {
      field: 'YoY',
      title: 'count Year-over-Year',
      cellType: 'progressbar',
      width: 200,
      fieldFormat() {
        return '';
      },
      barType: 'negative',
      min: -20,
      max: 60,
      style: {
        barHeight: 20,
        barBottom: '30%'
      }
    },
    {
      field: 'YoY',
      title: 'count Year-over-Year',
      cellType: 'progressbar',
      width: 200,
      barType: 'negative_no_axis',
      min: -20,
      max: 60,
      style: {
        textAlign: 'right',
        barHeight: 20,
        barBottom: '30%',
        barBgColor: 'rgba(217,217,217,0.3)'
      }
    },
    {
      field: 'YoY',
      title: 'count Year-over-Year',
      cellType: 'progressbar',
      width: 200,
      barType: 'negative_no_axis',
      min: -20,
      max: 60,
      style: {
        showBar: false
      }
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    autoWrapText: true
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  // bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
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
