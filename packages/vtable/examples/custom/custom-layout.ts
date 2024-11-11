import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { IconPosition } from '../../src/ts-types';
import { InputEditor } from '@visactor/vtable-editors';
import { bearImageUrl, birdImageUrl, catImageUrl, flowerImageUrl, rabbitImageUrl, wolfImageUrl } from '../resource-url';
const ListTable = VTable.ListTable;
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);
const CONTAINER_ID = 'vTable';
VTable.register.icon('location', {
  type: 'svg',
  name: 'location',
  positionType: IconPosition.left,
  svg: '<svg t="1684484908497" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2429" width="200" height="200"><path d="M512 512a136.533333 136.533333 0 1 1 136.533333-136.533333 136.533333 136.533333 0 0 1-136.533333 136.533333z m0-219.272533a81.92 81.92 0 1 0 81.92 81.92 81.92 81.92 0 0 0-81.92-81.92z" fill="#0073FF" p-id="2430"></path><path d="M512 831.214933a27.306667 27.306667 0 0 1-19.2512-8.055466l-214.493867-214.357334a330.5472 330.5472 0 1 1 467.490134 0l-214.357334 214.357334a27.306667 27.306667 0 0 1-19.387733 8.055466z m0-732.091733a275.933867 275.933867 0 0 0-195.106133 471.04L512 765.269333l195.106133-195.106133A275.933867 275.933867 0 0 0 512 99.1232z" fill="#0073FF" p-id="2431"></path><path d="M514.321067 979.490133c-147.456 0-306.107733-37.000533-306.107734-118.3744 0-45.602133 51.746133-81.92 145.681067-102.4a27.306667 27.306667 0 1 1 11.605333 53.384534c-78.370133 17.066667-102.673067 41.915733-102.673066 49.015466 0 18.432 88.064 63.761067 251.4944 63.761067s251.4944-45.192533 251.4944-63.761067c0-7.3728-25.258667-32.768-106.496-49.834666a27.306667 27.306667 0 1 1 11.195733-53.384534c96.6656 20.343467 150.186667 56.9344 150.186667 103.2192-0.273067 80.964267-158.9248 118.3744-306.3808 118.3744z" fill="#0073FF" p-id="2432"></path></svg>'
});
VTable.register.icon('favorite', {
  type: 'svg',
  name: 'favorite',
  positionType: IconPosition.left,
  width: 20,
  height: 20,
  cursor: 'pointer',
  tooltip: {
    placement: VTable.TYPES.Placement.top,
    title: '关注博主',
    style: {
      fontFamily: 'Arial',
      fontSize: 10,
      bgColor: 'white',
      color: '#333',
      arrowMark: true
    }
  },
  svg: '<svg t="1684492973577" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6052" width="200" height="200"><path d="M848.0256 652.5952h-79.872v-79.872a46.08 46.08 0 0 0-92.16 0v79.872h-79.872a46.08 46.08 0 0 0 0 92.16h79.872v79.872a46.08 46.08 0 0 0 92.16 0v-79.872h79.872a46.08 46.08 0 0 0 0-92.16z" fill="#F33B3D" p-id="6053"></path><path d="M842.3936 572.7744v5.632h5.632c10.8032 0 21.2992 1.4848 31.2832 4.1472l10.6496-10.6496-72.9088-72.9088c15.872 20.3776 25.344 45.9776 25.344 73.7792zM601.7536 824.6272v-5.632h-5.632c-66.3552 0-120.32-53.9648-120.32-120.32s53.9648-120.32 120.32-120.32h5.632v-5.632c0-66.3552 53.9648-120.32 120.32-120.32 27.8016 0 53.3504 9.472 73.728 25.344L500.736 182.6816c-103.2192-103.2192-270.5408-103.2192-373.76 0l-5.5296 5.5296c-103.2192 103.2192-103.2192 270.5408 0 373.76l312.0128 312.0128c42.6496 42.6496 111.8208 42.6496 154.4704 0l18.0736-18.0736c-2.7648-9.984-4.2496-20.48-4.2496-31.2832z" fill="#F85F69" p-id="6054"></path><path d="M601.7536 824.6272v-5.632h-5.632c-66.3552 0-120.32-53.9648-120.32-120.32s53.9648-120.32 120.32-120.32h5.632v-5.632c0-66.3552 53.9648-120.32 120.32-120.32s120.32 53.9648 120.32 120.32v5.632h5.632c10.8032 0 21.2992 1.4848 31.2832 4.1472l20.5824-20.5824c103.2192-103.2192 103.2192-270.5408 0-373.76l-5.5296-5.5296c-103.2192-103.2192-270.5408-103.2192-373.76 0l-389.0688 389.0688 302.08 302.08c42.6496 42.6496 111.8208 42.6496 154.4704 0l17.8688-17.8688c-2.7136-9.984-4.1984-20.48-4.1984-31.2832z" fill="#F85F69" p-id="6055"></path><path d="M842.3936 572.7744v5.632h5.632c10.8032 0 21.2992 1.4848 31.2832 4.1472l10.6496-10.6496-72.9088-72.9088c15.872 20.4288 25.344 45.9776 25.344 73.7792zM601.7536 824.6272v-5.632h-5.632c-66.3552 0-120.32-53.9648-120.32-120.32s53.9648-120.32 120.32-120.32h5.632v-5.632c0-66.3552 53.9648-120.32 120.32-120.32 27.7504 0 53.3504 9.472 73.728 25.344l-285.184-285.184-379.0848 379.0848 298.6496 298.6496c44.4928 44.4928 116.6336 44.544 161.1776 0.1024l14.5408-14.5408c-2.6624-9.9328-4.1472-20.4288-4.1472-31.232z" fill="#F33B3D" p-id="6056"></path><path d="M273.4592 544.6144c-8.3968 0-16.896-2.7648-23.9616-8.448-117.9648-94.4128-101.888-192.1024-73.7792-234.9056 11.6224-17.7152 35.4304-22.6816 53.1456-11.0592 17.7152 11.6224 22.6816 35.4304 11.0592 53.1456-3.7888 5.9392-33.9456 59.5968 57.5488 132.864a38.39488 38.39488 0 0 1 5.9392 53.9648 38.17472 38.17472 0 0 1-29.952 14.4384z" fill="#F7F8F8" p-id="6057"></path><path d="M848.0256 652.5952h-38.8096l-133.2224 133.2224v38.8096a46.08 46.08 0 0 0 92.16 0v-79.872h79.872a46.08 46.08 0 0 0 0-92.16z" fill="#F85F69" p-id="6058"></path></svg>'
});

VTable.register.icon('message', {
  type: 'svg',
  name: 'message',
  positionType: IconPosition.left,
  width: 20,
  height: 20,
  marginLeft: 10,
  cursor: 'pointer',
  tooltip: {
    placement: VTable.TYPES.Placement.top,
    title: '发消息',
    style: {
      fontFamily: 'Arial',
      fontSize: 10,
      bgColor: 'white',
      color: '#333',
      arrowMark: true
    }
  },
  svg: '<svg t="1684493071077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7733" width="200" height="200"><path d="M64 512c0 160.055 85.388 307.952 224 387.98 138.612 80.027 309.388 80.027 448 0C874.612 819.951 960 672.054 960 512c0-247.424-200.576-448-448-448S64 264.576 64 512z" fill="#E78AF2" p-id="7734"></path><path d="M691.2 736H332.8c-56 0-100.8-44.8-100.8-99.4v-245c0-57.4 44.8-103.6 100.8-103.6h358.4c56 0 100.8 46.2 100.8 103.6v245c0 54.6-44.8 99.4-100.8 99.4m-16.8-317.8c-4.2-8.4-12.6-12.6-21-12.6-4.2 0-8.4 1.4-12.6 2.8l-133 81.2-120.4-81.2c-4.2-2.8-9.8-2.8-14-2.8-9.8 0-19.6 4.2-23.8 12.6-8.4 11.2-2.8 26.6 9.8 33.6L491 537.2c4.2 2.8 8.4 2.8 12.6 2.8h8.4c4.2 0 8.4-1.4 12.6-2.8l140-85.4c12.6-7 16.8-21 9.8-33.6" fill="#F9EFFF" p-id="7735"></path></svg>'
});

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'bloggerId',
        title: '序号'
      },
      {
        field: 'bloggerName',
        title: '主播昵称',
        width: 'auto',
        customLayout: (args: VTable.TYPES.CustomRenderFunctionArg) => {
          const { table, row, col, rect } = args;
          const record = table.getRecordByCell(col, row);
          const { height, width } = rect ?? table.getCellRect(col, row);
          const percentCalc = VTable.CustomLayout.percentCalc;
          const container = new VTable.CustomLayout.Group({
            height,
            width,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });
          const containerLeft = new VTable.CustomLayout.Group({
            height: percentCalc(100),
            width: 60,
            display: 'flex',
            direction: 'column',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'space-around',
            fill: 'blue'
            // clip: true
          });
          container.add(containerLeft);

          const iconGroup = new VTable.CustomLayout.Group({
            width: 50,
            height: 50,
            clip: true
          });
          containerLeft.add(iconGroup);

          const icon0 = new VTable.CustomLayout.Image({
            id: 'icon0',
            width: 50,
            height: 50,
            src: record.bloggerAvatar,
            shape: 'circle',
            anchor: [25, 25]
            // marginLeft: 10
          });
          iconGroup.add(icon0);

          const animation = icon0.animate();
          animation.setTimeline(table.animationManager.timeline);
          animation.to({ angle: 2 * Math.PI }, 1000, 'linear').loop(Infinity);
          // setTimeline

          const containerRight = new VTable.CustomLayout.Group({
            height: percentCalc(100),
            width: percentCalc(100, -50),
            display: 'flex',
            direction: 'column'
            // justifyContent: 'center'
          });
          container.add(containerRight);

          const containerRightTop = new VTable.CustomLayout.Group({
            id: 'containerRightTop',
            height: percentCalc(50),
            width: percentCalc(100),
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap'
          });

          const containerRightBottom = new VTable.CustomLayout.Group({
            height: percentCalc(50),
            width: percentCalc(100),
            display: 'flex',
            alignItems: 'center'
          });

          containerRight.add(containerRightTop);
          containerRight.add(containerRightBottom);

          const bloggerName = new VTable.CustomLayout.Text({
            text: record.bloggerName,
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: 'black',
            marginLeft: 10
          });
          containerRightTop.add(bloggerName);

          const location = new VTable.CustomLayout.Icon({
            id: 'location',
            iconName: 'location',
            width: 15,
            height: 15,
            marginLeft: 10
          });
          containerRightTop.add(location);

          const locationName = new VTable.CustomLayout.Text({
            text: record.city,
            fontSize: 11,
            fontFamily: 'sans-serif',
            fill: '#6f7070',
            boundsPadding: [0, 10, 0, 0]
          });
          containerRightTop.add(locationName);

          for (let i = 0; i < record?.tags?.length ?? 0; i++) {
            const tag = new VTable.CustomLayout.Tag({
              text: record.tags[i],
              textStyle: {
                fontSize: 10,
                fontFamily: 'sans-serif',
                fill: 'rgb(51, 101, 238)'
              },
              panel: {
                visible: true,
                fill: '#f4f4f2',
                cornerRadius: 5
              },
              space: 5,
              marginLeft: 5
            });
            // tag.getSize(table);
            containerRightBottom.add(tag);
          }
          return {
            rootContainer: container,
            renderDefault: false
          };
        }
      },
      {
        field: 'worksCount',
        title: '作品数',
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        title: 'sum',
        columns: [
          {
            field: 'fansCount',
            title: '粉丝数',
            style: {
              fontFamily: 'Arial',
              fontSize: 12,
              fontWeight: 'bold'
            },
            fieldFormat(rec) {
              return rec.fansCount + 'w';
            }
          },
          {
            field: 'viewCount',
            title: '播放量',
            fieldFormat(rec) {
              return rec.fansCount + 'w';
            },
            style: {
              fontFamily: 'Arial',
              fontSize: 12,
              fontWeight: 'bold'
            }
          }
        ]
      },
      {
        field: 'viewCount',
        title: '播放量',
        fieldFormat(rec) {
          return rec.fansCount + 'w';
        },
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        field: '',
        title: '选项',
        width: 200,
        customLayout: (args: VTable.TYPES.CustomRenderFunctionArg) => {
          const { table, row, col, rect } = args;
          const { height, width } = rect ?? table.getCellRect(col, row);

          const container = new VTable.CustomLayout.Group({
            height,
            width,
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            justifyContent: 'center'
          });

          const checkboxGroup = new VTable.CustomLayout.Group({
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'no-wrap',
            boundsPadding: [5, 0, 5, 10],
            justifyContent: 'center'
          });
          container.appendChild(checkboxGroup);

          const checkboxText = new VTable.CustomLayout.Text({
            text: 'operate: ',
            fontSize: 12,
            boundsPadding: [0, 10, 0, 0]
          });
          checkboxGroup.appendChild(checkboxText);

          const checkbox1 = new VTable.CustomLayout.CheckBox({
            text: {
              text: 'like',
              fontSize: 12
            },
            spaceBetweenTextAndIcon: 2,
            boundsPadding: [0, 10, 0, 0]
          });
          checkbox1.render();
          checkboxGroup.appendChild(checkbox1);
          checkbox1.addEventListener('checkbox_state_change', e => {
            console.log('checkbox_state_change', e);
          });

          const checkbox2 = new VTable.CustomLayout.CheckBox({
            text: {
              text: 'collect',
              fontSize: 12
            },
            spaceBetweenTextAndIcon: 2
            // boundsPadding: [10, 0, 0, 10]
          });
          checkbox2.render();
          checkboxGroup.appendChild(checkbox2);
          checkbox2.addEventListener('checkbox_state_change', e => {
            console.log('checkbox_state_change', e);
          });

          const radioGroup = new VTable.CustomLayout.Group({
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'no-wrap',
            boundsPadding: [5, 0, 5, 10]
          });
          container.appendChild(radioGroup);

          const radioText = new VTable.CustomLayout.Text({
            text: 'type: ',
            fontSize: 12,
            boundsPadding: [0, 10, 0, 0]
          });
          radioGroup.appendChild(radioText);

          const radio1 = new VTable.CustomLayout.Radio({
            text: {
              text: 'normal',
              fontSize: 12
            },
            checked: true,
            spaceBetweenTextAndIcon: 2,
            boundsPadding: [0, 10, 0, 0]
          });
          radio1.render();
          radioGroup.appendChild(radio1);
          radio1.addEventListener('radio_checked', () => {
            if (radio2.attribute.checked) {
              radio2.setAttribute('checked', false);
              table.scenegraph.updateNextFrame();
            }
          });

          const radio2 = new VTable.CustomLayout.Radio({
            text: {
              text: 'special',
              fontSize: 12
            },
            spaceBetweenTextAndIcon: 2
          });
          radio2.render();
          radioGroup.appendChild(radio2);
          radio2.addEventListener('radio_checked', () => {
            if (radio1.attribute.checked) {
              radio1.setAttribute('checked', false);
              table.scenegraph.updateNextFrame();
            }
          });

          return {
            rootContainer: container,
            renderDefault: false
          };
        }
      },
      {
        field: '',
        title: '操作',
        width: 100,
        icon: ['favorite', 'message'],
        headerCustomLayout: args => {
          const { table, row, col, rect } = args;
          const { height, width } = rect || table.getCellRect(col, row);
          const percentCalc = VTable.CustomLayout.percentCalc;
          const container = new VTable.CustomLayout.Group({
            height,
            width,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });
          const containerLeft = new VTable.CustomLayout.Group({
            height: percentCalc(100),
            width: 160,
            display: 'flex',
            direction: 'column',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'space-around',
            fill: 'blue',
            // dx: 200
            x: 200
          });
          container.add(containerLeft);

          containerLeft.addEventListener('click', () => {
            containerLeft.setAttributes({ fill: 'red' });
          });

          const containerRight = new VTable.CustomLayout.Group({
            height: percentCalc(100),
            width: percentCalc(100, -50),
            display: 'flex',
            direction: 'column'
            // justifyContent: 'center'
          });
          container.add(containerRight);

          const containerRightTop = new VTable.CustomLayout.Group({
            id: 'containerRightTop',
            height: percentCalc(50),
            width: percentCalc(100),
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap'
          });

          const containerRightBottom = new VTable.CustomLayout.Group({
            height: percentCalc(50),
            width: percentCalc(100),
            display: 'flex',
            alignItems: 'center'
          });

          containerRight.add(containerRightTop);
          containerRight.add(containerRightBottom);

          const bloggerName = new VTable.CustomLayout.Text({
            text: 'record.bloggerName',
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: 'black',
            marginLeft: 10
          });
          containerRightTop.add(bloggerName);

          const location = new VTable.CustomLayout.Icon({
            id: 'location',
            iconName: 'location',
            width: 15,
            height: 15,
            marginLeft: 10
          });
          containerRightTop.add(location);

          const locationName = new VTable.CustomLayout.Text({
            text: 'record.city',
            fontSize: 11,
            fontFamily: 'sans-serif',
            fill: '#6f7070',
            boundsPadding: [0, 10, 0, 0]
          });
          containerRightTop.add(locationName);

          return {
            rootContainer: container,
            renderDefault: false
          };
        }
      }
    ],
    records: [
      {
        bloggerId: 1,
        bloggerName: '虚拟主播小花',
        bloggerAvatar: flowerImageUrl,
        introduction: '大家好，我是虚拟主播小花。喜欢游戏、动漫和美食的小仙女，希望通过直播和大家分享快乐时光。',
        fansCount: 400,
        worksCount: 10,
        viewCount: 5,
        city: '梦幻之都',
        tags: ['游戏', '动漫', '美食']
      },
      {
        bloggerId: 2,
        bloggerName: '虚拟主播小狼',
        bloggerAvatar: wolfImageUrl,
        introduction: '大家好，我是虚拟主播小狼。喜欢音乐、旅行和摄影的小狼人，希望通过直播和大家一起探索世界的美好。',
        fansCount: 800,
        worksCount: 20,
        viewCount: 15,
        city: '音乐之城',
        tags: ['音乐', '旅行', '摄影']
      },
      {
        bloggerId: 3,
        bloggerName: '虚拟主播小兔',
        bloggerAvatar: rabbitImageUrl,
        introduction: '大家好，我是虚拟主播小兔。喜欢绘画、手工和美妆的小可爱，希望通过直播和大家一起分享创意和时尚。',
        fansCount: 600,
        worksCount: 15,
        viewCount: 10,
        city: '艺术之都',
        tags: ['绘画', '手工', '美妆']
      },
      {
        bloggerId: 4,
        bloggerName: '虚拟主播小猫',
        bloggerAvatar: catImageUrl,
        introduction: '大家好，我是虚拟主播小猫。喜欢舞蹈、健身和烹饪的小懒猫，希望通过直播和大家一起健康快乐地生活。',
        fansCount: 1000,
        worksCount: 30,
        viewCount: 20,
        city: '健康之城',
        tags: ['舞蹈', '健身', '烹饪']
      },
      {
        bloggerId: 5,
        bloggerName: '虚拟主播小熊',
        bloggerAvatar: bearImageUrl,
        introduction: '大家好，我是虚拟主播小熊。喜欢电影、读书和哲学的小智者，希望通过直播和大家一起探索人生的意义。',
        fansCount: 1200,
        worksCount: 25,
        viewCount: 18,
        city: '智慧之城',
        tags: ['电影', '文学']
      },
      {
        bloggerId: 6,
        bloggerName: '虚拟主播小鸟',
        bloggerAvatar: birdImageUrl,
        introduction: '大家好，我是虚拟主播小鸟。喜欢唱歌、表演和综艺的小嗨鸟，希望通过直播和大家一起嗨翻天。',
        fansCount: 900,
        worksCount: 12,
        viewCount: 8,
        city: '快乐之城',
        tags: ['音乐', '表演', '综艺']
      }
    ],
    editor: 'input',
    defaultRowHeight: 80
    // customMergeCell: (col, row, table) => {
    //   if (col >= 0 && col < table.colCount && row === table.rowCount - 2) {
    //     return {
    //       range: {
    //         start: {
    //           col: 0,
    //           row: table.rowCount - 2
    //         },
    //         end: {
    //           col: table.colCount - 1,
    //           row: table.rowCount - 2
    //         }
    //       },
    //       customLayout: args => {
    //         const { table, row, col, rect } = args;
    //         const { height, width } = rect || table.getCellRect(col, row);
    //         const percentCalc = VTable.CustomLayout.percentCalc;
    //         const container = new VTable.CustomLayout.Group({
    //           height,
    //           width,
    //           display: 'flex',
    //           flexDirection: 'row',
    //           flexWrap: 'nowrap'
    //         });
    //         const containerLeft = new VTable.CustomLayout.Group({
    //           height: percentCalc(100),
    //           width: 160,
    //           display: 'flex',
    //           direction: 'column',
    //           alignContent: 'center',
    //           alignItems: 'center',
    //           justifyContent: 'space-around',
    //           fill: 'blue',
    //           // dx: 200
    //           x: 200
    //         });
    //         container.add(containerLeft);

    //         containerLeft.addEventListener('click', () => {
    //           containerLeft.setAttributes({ fill: 'red' });
    //         });

    //         const containerRight = new VTable.CustomLayout.Group({
    //           height: percentCalc(100),
    //           width: percentCalc(100, -50),
    //           display: 'flex',
    //           direction: 'column'
    //           // justifyContent: 'center'
    //         });
    //         container.add(containerRight);

    //         const containerRightTop = new VTable.CustomLayout.Group({
    //           id: 'containerRightTop',
    //           height: percentCalc(50),
    //           width: percentCalc(100),
    //           display: 'flex',
    //           alignItems: 'center',
    //           flexWrap: 'nowrap'
    //         });

    //         const containerRightBottom = new VTable.CustomLayout.Group({
    //           height: percentCalc(50),
    //           width: percentCalc(100),
    //           display: 'flex',
    //           alignItems: 'center'
    //         });

    //         containerRight.add(containerRightTop);
    //         containerRight.add(containerRightBottom);

    //         const bloggerName = new VTable.CustomLayout.Text({
    //           text: 'record.bloggerName',
    //           fontSize: 13,
    //           fontFamily: 'sans-serif',
    //           fill: 'black',
    //           marginLeft: 10
    //         });
    //         containerRightTop.add(bloggerName);

    //         const location = new VTable.CustomLayout.Icon({
    //           id: 'location',
    //           iconName: 'location',
    //           width: 15,
    //           height: 15,
    //           marginLeft: 10
    //         });
    //         containerRightTop.add(location);

    //         const locationName = new VTable.CustomLayout.Text({
    //           text: 'record.city',
    //           fontSize: 11,
    //           fontFamily: 'sans-serif',
    //           fill: '#6f7070',
    //           boundsPadding: [0, 10, 0, 0]
    //         });
    //         containerRightTop.add(locationName);

    //         return {
    //           rootContainer: container,
    //           renderDefault: false
    //         };
    //       }
    //     };
    //   }
    // }
  };

  const instance = new ListTable(option);
  bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role']
  });

  // const { MOUSEMOVE_CELL } = VTable.ListTable.EVENT_TYPE;
  // instance.addEventListener(MOUSEMOVE_CELL, (...args) => {
  //   console.log('MOUSEMOVE_CELL', args[0]?.target);
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
