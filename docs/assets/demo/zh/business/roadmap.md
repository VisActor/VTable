---
category: examples
group: Business
title: 产品路线图
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/roadmap.png
order: 9-6
---

# 路线图

该示例展示了VTable后续的主要研发路线图

## 关键配置

- register.icon
- headerIcon
- icon

## 代码演示

```javascript livedemo template=vtable
// 注册里程碑的icon 小旗帜
  VTable.register.icon('milestone', {
    name: 'milestone',
    type: 'svg',
    width: 50,
    height: 50,
    marginRight: 10,
    positionType: VTable.TYPES.IconPosition.left,
    interactive: false,
    svg: '<svg t="1688180448442" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2478" width="200" height="200"><path d="M248.2 154.2s93.6-107.9 323.2-21.6C774.2 208.8 905.7 164 905.7 164l-75.1 212.5L905.7 580s-187.8 98.4-394.5-9c-150.3-83.4-263 22.1-263 22.1V154.2z" fill="#d81e06" p-id="2479"></path><path d="M116.7 960.2c-10.4 0-18.8-8.4-18.8-18.8V114.9c0-10.4 8.4-18.8 18.8-18.8s18.8 8.4 18.8 18.8v826.5c0 10.4-8.4 18.8-18.8 18.8zM716.1 640.3c-63.4 0-137-12.9-213.5-52.7-137.3-76.1-240.5 18.2-241.5 19.1-5.5 5.1-13.4 6.5-20.3 3.5s-11.3-9.7-11.3-17.2V154.2c0-4.5 1.6-8.9 4.6-12.3 4.2-4.8 105-116.8 343.9-26.9 193.2 72.6 320.4 31.6 321.7 31.2 6.9-2.3 14.3-0.5 19.4 4.6 5 5.1 6.7 12.7 4.3 19.4l-72.9 206.1 72.8 197.2c3.3 8.9-0.6 18.8-8.9 23.2-5.1 2.6-85.4 43.6-198.3 43.6z m-321-119.9c37.5 0 79.9 9 125.3 34.2C683 639.1 834.9 589.5 882 570.1L812.9 383c-1.5-4.1-1.5-8.6-0.1-12.8l63.7-180.3c-53.4 9-164.2 15.7-311.8-39.8C377.3 79.7 287.5 143.8 267 162v394.7c27.9-16.6 72.7-36.3 128.1-36.3z" fill="#d81e06" p-id="2480"></path></svg>'
  });
  // 注册动画功能图标
  VTable.register.icon('animation', {
    name: 'animation',
    type: 'svg',
    width: 20,
    height: 20,
    marginRight: 6,
    positionType: VTable.TYPES.IconPosition.contentLeft,
    interactive: false,
    svg: '<svg t="1688180606131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2767" width="200" height="200"><path d="M156 64v896l356-280 356 280V64H156z m511.8 556.4L512 538.5l-155.7 81.9L386 447 260 324.2l174.1-25.3L512 141.1l77.9 157.8L764 324.2 638 447l29.8 173.4z" fill="#1cdb11" p-id="2768"></path></svg>'
  });
  // 注册基础功能图标
  VTable.register.icon('function', {
    positionType: VTable.TYPES.IconPosition.contentLeft,
    name: 'function',
    type: 'svg',
    width: 20,
    height: 20,
    marginRight: 6,
    interactive: false,
    svg: '<svg t="1688187024984" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19029" width="200" height="200"><path d="M224.6 185.9H415v295.8H224.6zM591.793 333.786l156.481-156.48 156.482 156.48-156.482 156.482zM224.6 603.7H415v295.8H224.6zM653 603.7h190.4v295.8H653z" fill="#91B4FF" p-id="19030"></path><path d="M414.9 508H119.2c-14.6 0-26.3-11.8-26.3-26.3V185.9c0-14.5 11.8-26.3 26.3-26.3H415c14.6 0 26.3 11.8 26.3 26.3v295.8c0 14.5-11.8 26.3-26.4 26.3z m-269.4-52.7h243.1V212.2H145.5v243.1zM695.5 569.3c-7 0-13.7-2.8-18.6-7.7L467.7 352.4c-10.3-10.3-10.3-27 0-37.3L676.9 106c9.9-9.9 27.4-9.9 37.3 0l209.1 209.2c10.3 10.3 10.3 27 0 37.3L714.1 561.6c-4.9 4.9-11.6 7.7-18.6 7.7zM523.6 333.8l171.9 171.9 171.9-171.9-171.9-171.9-171.9 171.9zM414.9 925.8H119.2c-14.6 0-26.3-11.8-26.3-26.3v-36.9c0-14.5 11.8-26.3 26.3-26.3s26.3 11.8 26.3 26.3v10.6h243.1V630H145.5v41.5c0 14.5-11.8 26.3-26.3 26.3S92.8 686 92.8 671.5v-67.8c0-14.5 11.8-26.3 26.3-26.3h295.8c14.6 0 26.3 11.8 26.3 26.3v295.8c0.1 14.5-11.7 26.3-26.3 26.3z" fill="#3778FF" p-id="19031"></path><path d="M119.2 808.4c-14.6 0-26.3-11.8-26.3-26.3v-30.5c0-14.5 11.8-26.3 26.3-26.3s26.3 11.8 26.3 26.3V782c0 14.6-11.8 26.4-26.3 26.4zM843.4 925.8H547.6c-14.6 0-26.3-11.8-26.3-26.3V603.7c0-14.5 11.8-26.3 26.3-26.3h295.8c14.6 0 26.3 11.8 26.3 26.3v295.8c0 14.5-11.8 26.3-26.3 26.3z m-269.5-52.7H817V630H573.9v243.1z" fill="#3778FF" p-id="19032"></path></svg>'
  });
  // 注册可视化含义图标
  VTable.register.icon('visualize', {
    positionType: VTable.TYPES.IconPosition.contentLeft,
    name: 'visualize',
    type: 'svg',
    width: 20,
    height: 20,
    marginRight: 6,
    interactive: false,
    svg: '<svg t="1688287085629" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20392" width="200" height="200"><path d="M988.968421 512c0-61.978947-56.589474-118.568421-150.905263-158.989474 0-2.694737 0-2.694737 2.694737-5.389473 26.947368-99.705263 16.168421-172.463158-32.336842-210.189474-64.673684-51.2-177.852632-18.863158-296.421053 70.063158-118.568421-91.621053-231.747368-121.263158-296.421053-70.063158-48.505263 40.421053-56.589474 118.568421-29.642105 215.578947-91.621053 40.421053-150.905263 94.315789-150.905263 158.989474 0 61.978947 56.589474 118.568421 150.905263 158.989474-26.947368 97.010526-18.863158 175.157895 29.642105 215.578947 21.557895 16.168421 45.810526 24.252632 75.452632 24.252632 61.978947 0 140.126316-35.031579 220.968421-94.31579 80.842105 61.978947 158.989474 94.315789 220.968421 94.31579 29.642105 0 56.589474-8.084211 75.452632-24.252632 48.505263-37.726316 59.284211-113.178947 32.336842-210.189474 0-2.694737 0-2.694737-2.694737-5.389473 94.315789-40.421053 150.905263-97.010526 150.905263-158.989474zM730.273684 150.905263c21.557895 0 40.421053 5.389474 53.894737 16.168421 35.031579 26.947368 40.421053 88.926316 18.863158 172.463158-53.894737-18.863158-118.568421-32.336842-191.326316-40.421053-24.252632-24.252632-48.505263-45.810526-70.063158-67.368421 70.063158-51.2 140.126316-80.842105 188.631579-80.842105z m-78.147368 471.578948c-18.863158 21.557895-35.031579 43.115789-53.894737 64.673684-26.947368 2.694737-56.589474 2.694737-83.536842 2.694737-29.642105 0-56.589474 0-83.536842-2.694737-18.863158-18.863158-37.726316-40.421053-53.894737-64.673684-29.642105-37.726316-53.894737-72.757895-75.452632-110.484211 21.557895-37.726316 48.505263-75.452632 75.452632-110.484211 18.863158-21.557895 37.726316-43.115789 53.894737-64.673684 26.947368-2.694737 56.589474-2.694737 83.536842-2.694737s56.589474 0 83.536842 2.694737c18.863158 18.863158 37.726316 40.421053 53.894737 64.673684 29.642105 35.031579 53.894737 72.757895 75.452631 110.484211-21.557895 37.726316-48.505263 75.452632-75.452631 110.484211z m97.010526-72.757895c18.863158 32.336842 32.336842 67.368421 43.11579 97.010526-40.421053 13.473684-88.926316 24.252632-140.126316 32.336842 10.778947-10.778947 18.863158-21.557895 26.947368-35.031579 26.947368-29.642105 48.505263-61.978947 70.063158-94.315789zM555.115789 727.578947c-13.473684 13.473684-29.642105 26.947368-43.115789 40.421053-13.473684-13.473684-29.642105-24.252632-43.115789-40.421053h86.231578z m-183.242105-48.505263c-51.2-8.084211-99.705263-18.863158-140.126316-32.336842 10.778947-32.336842 26.947368-64.673684 43.11579-97.010526 18.863158 32.336842 43.115789 64.673684 67.368421 97.010526 10.778947 10.778947 18.863158 21.557895 29.642105 32.336842z m-97.010526-204.8C256 441.936842 242.526316 406.905263 231.747368 377.263158c40.421053-13.473684 88.926316-24.252632 140.126316-32.336842-10.778947 10.778947-18.863158 21.557895-26.947368 35.031579-26.947368 29.642105-48.505263 61.978947-70.063158 94.315789z m194.021053-177.852631c13.473684-13.473684 29.642105-26.947368 43.115789-40.421053 13.473684 13.473684 29.642105 24.252632 43.115789 40.421053h-86.231578z m212.88421 80.842105c-8.084211-10.778947-18.863158-21.557895-26.947368-35.031579 51.2 8.084211 99.705263 18.863158 140.126315 32.336842-10.778947 32.336842-26.947368 64.673684-43.115789 97.010526-24.252632-29.642105-45.810526-61.978947-70.063158-94.315789zM239.831579 167.073684c13.473684-10.778947 32.336842-16.168421 53.894737-16.168421 51.2 0 118.568421 29.642105 188.631579 83.536842-24.252632 18.863158-48.505263 43.115789-70.063158 67.368421-70.063158 5.389474-134.736842 21.557895-191.326316 40.421053-24.252632-80.842105-18.863158-145.515789 18.863158-175.157895zM72.757895 512c0-45.810526 48.505263-88.926316 123.957894-121.263158 13.473684 37.726316 32.336842 80.842105 56.589474 121.263158-24.252632 43.115789-43.115789 83.536842-56.589474 121.263158-75.452632-32.336842-123.957895-75.452632-123.957894-121.263158z m167.073684 344.926316c-37.726316-29.642105-40.421053-94.315789-18.863158-172.463158 53.894737 18.863158 118.568421 32.336842 191.326316 40.421053 24.252632 24.252632 48.505263 45.810526 70.063158 67.368421-102.4 72.757895-194.021053 102.4-242.526316 64.673684z m563.2-172.463158c21.557895 80.842105 16.168421 145.515789-18.863158 172.463158-48.505263 37.726316-142.821053 8.084211-242.526316-67.368421 24.252632-18.863158 48.505263-43.115789 70.063158-67.368421 72.757895-5.389474 137.431579-18.863158 191.326316-37.726316z m24.252632-51.2c-13.473684-40.421053-32.336842-80.842105-56.589474-121.263158 24.252632-40.421053 43.115789-83.536842 56.589474-121.263158 75.452632 32.336842 123.957895 75.452632 123.957894 121.263158s-48.505263 88.926316-123.957894 121.263158z" fill="#13227a" p-id="20393"></path><path d="M512 398.821053c-61.978947 0-113.178947 51.2-113.178947 113.178947s51.2 113.178947 113.178947 113.178947 113.178947-51.2 113.178947-113.178947-51.2-113.178947-113.178947-113.178947z m0 188.631579c-40.421053 0-75.452632-35.031579-75.452632-75.452632s35.031579-75.452632 75.452632-75.452632 75.452632 35.031579 75.452632 75.452632-35.031579 75.452632-75.452632 75.452632z" fill="#13227a" p-id="20394"></path></svg>'
  });
  // 注册可视化含义图标
  VTable.register.icon('component', {
    positionType: VTable.TYPES.IconPosition.contentLeft,
    name: 'component',
    type: 'svg',
    width: 20,
    height: 20,
    marginRight: 6,
    interactive: false,
    svg: '<svg t="1688287405560" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22623" width="200" height="200"><path d="M859.8 452.8h-46.5V308.1c0-51.7-41.3-98.2-98.2-98.2H570.5v-46.5c0-51.7-41.3-98.2-98.2-98.2-51.7 0-98.2 41.3-98.2 98.2v46.5H229.5c-51.7 0-98.2 41.3-98.2 98.2v144.7h46.5c51.7 0 98.2 41.3 98.2 98.2 0 51.7-41.3 98.2-98.2 98.2h-46.5v144.7c0 51.7 41.3 98.2 98.2 98.2h144.7v-46.5c0-51.7 41.3-98.2 98.2-98.2 51.7 0 98.2 41.3 98.2 98.2V892h144.7c51.7 0 98.2-41.3 98.2-98.2V649.1H860c51.7 0 98.2-41.3 98.2-98.2-0.2-56.8-46.7-98.1-98.4-98.1z" fill="#00AA88" p-id="22624"></path></svg>'
  });

  // 注册节点背景大箭头
  VTable.register.icon('arrow', {
    name: 'arrow',
    type: 'svg',
    width: 190,
    height: 50,
    positionType: VTable.TYPES.IconPosition.absoluteRight,
    marginRight: 90,
    interactive: false,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="67" height="11" viewBox="0 0 67 11" fill="none"><path d="M60 0.5H2L7 5L2 10H60L65.5 5L60 0.5Z" fill="#E13B9F" stroke="#E13B9F"/></svg>'
  });

  const records = [
    {
      month: 'JUL',
      Basic: 'Custom Layout'
      // Animation: ''
      // Component: 'animation  1'
      // Visualize: ''
    },
    {
      month: 'AUG',
      Basic: 'Custom Layout',
      Basic2: 'Row Frozen',
      // Animation: ''
      Component: 'Access Common Visual Component',
      Visualize: 'Extend Sparkline'
    },
    {
      month: 'SEP',
      Basic: 'Checkbox Type',
      Basic2: 'Row Frozen',
      Animation: 'Sort Animation',
      Component: 'Access Common Visual Component',
      Visualize: 'Pivot Chart'
    },
    {
      month: 'OCT',
      Basic: 'Download',
      Basic2: 'Pivot Analysis',
      Animation: 'Expand Animation',
      Component: 'Access Common Visual Component',
      Visualize: 'Pivot Chart'
    },
    {
      month: 'NOV',
      Basic: 'Editable',
      Basic2: 'Pivot Analysis',
      Animation: 'Drag Animation',
      // Component: '',
      Visualize: 'Other Table Type'
    },
    {
      month: 'DEC',
      Basic: 'Editable',
      // Animation: 'Drag Animation',
      // Component: '',
      Visualize: 'Other Table Type'
    }
  ];
  const option = {
    columns: [
      {
        field: 'month',
        title: '',
        // width: 'auto',
        style: {
          textAlign: 'center',
          color: 'white',
          borderLineWidth: 0
        },
        customRender(args) {
          const { width, height } = args.rect;
          const { dataValue, table, row, col } = args;
          const elements = [];
          elements.push({
            type: 'line',
            stroke: '#3c78d8',
            points: [
              { x: 0, y: height / 2 },
              { x: width, y: height / 2 }
            ]
          });
          elements.push({
            type: 'circle',
            fill: '#3c78d8',
            x: width / 2,
            y: height / 2,
            radius: 40
          });
          return {
            renderDefault: true,
            elements,
            expectedHeight: 100, // TODO 无效
            expectedWidth: 200
          };
        }
      },
      {
        field: '',
        title: ' ',
        style: {
          borderLineWidth: 0
        }
      },
      {
        title: 'BASIC\nFUNCTION',
        hideColumnsSubHeader: true,
        headerIcon: ['milestone'],
        columns: [
          //如果只有一行 可直接拿到外层columns中
          {
            field: 'Basic',
            mergeCell: true,
            icon(args) {
              const { col, row, table } = args;
              const style = table.getCellStyle(col, row);
              const cellValue = table.getCellValue(col, row);
              if (!cellValue) {
                return '';
              }
              const cellMergeRectW = table.getMergeCellRect(col, row).width;
              let textWidth = 0;
              if (cellValue) {
                textWidth = table.measureText(cellValue, {
                  fontFamily: style.fontFamily,
                  fontSize: style.fontSize
                }).width;
              }
              const bgWidth = Math.min(cellMergeRectW, Math.max(cellMergeRectW * 0.8, textWidth + 50));
              return [
                'function',
                {
                  name: 'arrow',
                  type: 'svg',
                  width: bgWidth,
                  height: 50,
                  positionType: VTable.TYPES.IconPosition.absoluteRight,
                  marginRight: (cellMergeRectW - bgWidth) / 2,
                  interactive: false,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="67" height="11" viewBox="0 0 67 11" fill="none"><path d="M60 0.5H2L7 5L2 10H60L65.5 5L60 0.5Z" fill="#E13B9F" stroke="#E13B9F"/></svg>'
                }
              ];
            },
            headerIcon: ['milestone'],
            title: 'BASIC\nFUNCTION',
            style: {
              borderLineWidth: 2,
              borderColor: ''
            },
            headerStyle: {
              color: 'black',
              textAlign: 'left',
              lineHeight: 30
            }
          },
          {
            field: 'Basic2',
            mergeCell: true,
            icon(args) {
              const { col, row, table } = args;
              const style = table.getCellStyle(col, row);
              const cellValue = table.getCellValue(col, row);
              if (!cellValue) {
                return '';
              }
              const cellMergeRectW = table.getMergeCellRect(col, row).width;
              let textWidth = 0;
              if (cellValue) {
                textWidth = table.measureText(cellValue, {
                  fontFamily: style.fontFamily,
                  fontSize: style.fontSize
                }).width;
              }
              const bgWidth = Math.min(cellMergeRectW, Math.max(cellMergeRectW * 0.8, textWidth + 50));
              return [
                'function',
                {
                  name: 'arrow',
                  type: 'svg',
                  width: bgWidth,
                  height: 50,
                  positionType: VTable.TYPES.IconPosition.absoluteRight,
                  marginRight: (cellMergeRectW - bgWidth) / 2,
                  interactive: false,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="67" height="11" viewBox="0 0 67 11" fill="none"><path d="M60 0.5H2L7 5L2 10H60L65.5 5L60 0.5Z" fill="#E13B9F" stroke="#E13B9F"/></svg>'
                }
              ];
            },

            title: '',
            style: {
              borderLineWidth: 2,
              borderColor: ''
            },
            headerStyle: {
              color: 'black',
              textAlign: 'left',
              lineHeight: 30
            }
          }
        ]
      },
      {
        field: '',
        title: ' ',
        style: {
          borderLineWidth: 0
        }
      },
      {
        field: 'Visualize',
        title: 'VISUALIZE',
        style: {
          borderLineWidth: 2,
          borderColor: ''
        },
        headerStyle: {
          color: 'black'
        },
        mergeCell: true,
        icon(args) {
          const { col, row, table } = args;
          const style = table.getCellStyle(col, row);
          const cellValue = table.getCellValue(col, row);
          if (!cellValue) {
            return '';
          }
          const cellMergeRectW = table.getMergeCellRect(col, row).width;
          let textWidth = 0;
          if (cellValue) {
            textWidth = table.measureText(cellValue, {
              fontFamily: style.fontFamily,
              fontSize: style.fontSize
            }).width;
          }
          const bgWidth = Math.min(cellMergeRectW, Math.max(cellMergeRectW * 0.8, textWidth + 50));
          return [
            'visualize',
            {
              name: 'arrow',
              type: 'svg',
              width: bgWidth,
              height: 50,
              positionType: VTable.TYPES.IconPosition.absoluteRight,
              marginRight: (cellMergeRectW - bgWidth) / 2,
              interactive: false,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="74" height="11" viewBox="0 0 74 11" fill="none"><path d="M67 0.5H2L7 5L2 10H67L72.5 5L67 0.5Z" fill="#2BC1F0" stroke="#2BC1F0"/></svg>'
            }
          ];
        },
        headerIcon: ['milestone']
      },
      {
        field: '',
        title: ' ',
       
        style: {
          borderLineWidth: 0
        }
      },
      {
        field: 'Animation',
        title: 'ANIMATION',
        style: {
          borderLineWidth: 2,
          borderColor: ''
        },
        headerStyle: {
          color: 'black'
        },
        mergeCell: true,
        icon(args) {
          const { col, row, table } = args;
          const style = table.getCellStyle(col, row);
          const cellValue = table.getCellValue(col, row);
          if (!cellValue) {
            return '';
          }
          const cellMergeRectW = table.getMergeCellRect(col, row).width;
          let textWidth = 0;
          if (cellValue) {
            textWidth = table.measureText(cellValue, {
              fontFamily: style.fontFamily,
              fontSize: style.fontSize
            }).width;
          }
          const bgWidth = Math.min(cellMergeRectW, Math.max(cellMergeRectW * 0.8, textWidth + 50));
          return [
            'animation',
            {
              name: 'arrow',
              type: 'svg',
              width: bgWidth,
              height: 50,
              positionType: VTable.TYPES.IconPosition.absoluteRight,
              marginRight: (cellMergeRectW - bgWidth) / 2,
              interactive: false,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="74" height="11" viewBox="0 0 74 11" fill="none"><path d="M67 0.5H2L7 5L2 10H67L72.5 5L67 0.5Z" fill="#A23BE1" stroke="#A23BE1"/></svg>'
            }
          ];
        },
        headerIcon: ['milestone']
      },
      {
        field: '',
        title: ' ',
        style: {
          borderLineWidth: 0
        }
      },
      {
        field: 'Component',
        title: 'COMPONENT',
        style: {
          borderLineWidth: 2,
          borderColor: ''
        },
        headerStyle: {
          color: 'black'
        },
        mergeCell: true,
        icon(args) {
          const { col, row, table } = args;
          const style = table.getCellStyle(col, row);
          const cellValue = table.getCellValue(col, row);
          if (!cellValue) {
            return '';
          }
          const cellMergeRectW = table.getMergeCellRect(col, row).width;
          let textWidth = 0;
          if (cellValue) {
            textWidth = table.measureText(cellValue, {
              fontFamily: style.fontFamily,
              fontSize: style.fontSize
            }).width;
          }
          const bgWidth = Math.min(cellMergeRectW, Math.max(cellMergeRectW * 0.8, textWidth + 50));
          return [
            'component',
            {
              name: 'arrow',
              type: 'svg',
              width: bgWidth,
              height: 50,
              positionType: VTable.TYPES.IconPosition.absoluteRight,
              marginRight: (cellMergeRectW - bgWidth) / 2,
              interactive: false,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="74" height="11" viewBox="0 0 74 11" fill="none"><path d="M67 0.5H2L7 5L2 10H67L72.5 5L67 0.5Z" fill="#F0B92B" stroke="#F0B92B"/></svg>'
            }
          ];
        },
        headerIcon: ['milestone']
      }
    ],
    theme: {
      bodyStyle: {
        padding: [20, 0, 20, 0],
        textAlign: 'center',
        color: 'white'
      },
      rowHeaderStyle: {
        borderLineWidth: 0
      },
      selectionStyle: {
        cellBorderColor: ''
      }
    },
    records,
    transpose: true,
    defaultRowHeight: 30,
    defaultHeaderColWidth: 200,
    defaultColWidth: 180,
    heightMode: 'autoHeight',
    columnResizeMode: 'none'
  };

  const tableInstance =  new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
```

## 相关教程

[性能优化](link)
