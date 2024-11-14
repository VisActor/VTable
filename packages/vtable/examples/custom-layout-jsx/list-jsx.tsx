import * as VTable from '../../src';
import { VGroup, VSymbol, VRect, VImage, VText, VTag, jsx } from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { IconPosition } from '../../src/ts-types';
import { bearImageUrl, birdImageUrl, catImageUrl, flowerImageUrl, rabbitImageUrl, wolfImageUrl } from '../resource-url';
const ListTable = VTable.ListTable;
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  const option = {
    container: document.getElementById(Table_CONTAINER_DOM_ID),
    columns: [
      {
        field: 'bloggerId',
        caption: '序号'
      },
      {
        field: 'bloggerName',
        caption: '主播昵称',
        // width: 'auto',
        editor: '',
        customLayout: args => {
          const { table, row, col, rect } = args;
          const { height, width } = rect ?? table.getCellRect(col, row);
          const record = table.getRecordByCell(col, row);

          const container = (
            <VGroup
              attribute={{
                id: 'container',
                width,
                height,
                display: 'flex',
                flexWrap: 'no-wrap',
                justifyContent: 'flex-start',
                alignContent: 'center'
              }}
            >
              <VGroup
                attribute={{
                  id: 'container-left',
                  width: 60,
                  height,
                  fill: 'red',
                  opacity: 0.1,
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}
              >
                <VImage
                  attribute={{
                    id: 'icon0',
                    width: 50,
                    height: 50,
                    image: record.bloggerAvatar,
                    cornerRadius: 25
                  }}
                  // animation={[
                  //   ['to', { angle: 2 * Math.PI }, 1000, 'linear'],
                  //   ['loop', Infinity]
                  // ]}
                  // timeline={table.animationManager.timeline}
                ></VImage>
              </VGroup>
              <VGroup
                id="container-right"
                attribute={{
                  id: 'container-right',
                  width: width - 60,
                  height,
                  fill: 'yellow',
                  opacity: 0.1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'flex-start',
                  flexWrap: 'no-wrap'
                }}
              >
                <VGroup
                  attribute={{
                    id: 'container-right-top',
                    fill: 'red',
                    opacity: 0.1,
                    width: width - 60,
                    height: height / 2,
                    display: 'flex',
                    flexWrap: 'no-wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                >
                  <VText
                    attribute={{
                      id: 'bloggerName',
                      text: record.bloggerName,
                      fontSize: 13,
                      fontFamily: 'sans-serif',
                      fill: 'black',
                      textAlign: 'left',
                      textBaseline: 'top',
                      boundsPadding: [0, 0, 0, 10]
                    }}
                  ></VText>
                  <VImage
                    attribute={{
                      id: 'location-icon',
                      width: 15,
                      height: 15,
                      image:
                        '<svg t="1684484908497" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2429" width="200" height="200"><path d="M512 512a136.533333 136.533333 0 1 1 136.533333-136.533333 136.533333 136.533333 0 0 1-136.533333 136.533333z m0-219.272533a81.92 81.92 0 1 0 81.92 81.92 81.92 81.92 0 0 0-81.92-81.92z" fill="#0073FF" p-id="2430"></path><path d="M512 831.214933a27.306667 27.306667 0 0 1-19.2512-8.055466l-214.493867-214.357334a330.5472 330.5472 0 1 1 467.490134 0l-214.357334 214.357334a27.306667 27.306667 0 0 1-19.387733 8.055466z m0-732.091733a275.933867 275.933867 0 0 0-195.106133 471.04L512 765.269333l195.106133-195.106133A275.933867 275.933867 0 0 0 512 99.1232z" fill="#0073FF" p-id="2431"></path><path d="M514.321067 979.490133c-147.456 0-306.107733-37.000533-306.107734-118.3744 0-45.602133 51.746133-81.92 145.681067-102.4a27.306667 27.306667 0 1 1 11.605333 53.384534c-78.370133 17.066667-102.673067 41.915733-102.673066 49.015466 0 18.432 88.064 63.761067 251.4944 63.761067s251.4944-45.192533 251.4944-63.761067c0-7.3728-25.258667-32.768-106.496-49.834666a27.306667 27.306667 0 1 1 11.195733-53.384534c96.6656 20.343467 150.186667 56.9344 150.186667 103.2192-0.273067 80.964267-158.9248 118.3744-306.3808 118.3744z" fill="#0073FF" p-id="2432"></path></svg>',
                      boundsPadding: [0, 0, 0, 10]
                    }}
                  ></VImage>
                  <VText
                    attribute={{
                      id: 'locationName',
                      text: record.city,
                      fontSize: 11,
                      fontFamily: 'sans-serif',
                      fill: '#6f7070',
                      textAlign: 'left',
                      textBaseline: 'top',
                      boundsPadding: [0, 10, 0, 0]
                    }}
                  ></VText>
                </VGroup>
                <VGroup
                  attribute={{
                    id: 'container-right-bottom',
                    fill: 'green',
                    opacity: 0.1,
                    width: width - 60,
                    height: height / 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                >
                  {record?.tags?.length
                    ? record.tags.map((str, i) => (
                        // <VText attribute={{
                        //   text: str,
                        //   fontSize: 10,
                        //   fontFamily: 'sans-serif',
                        //   fill: 'rgb(51, 101, 238)',
                        //   textAlign: 'left',
                        //   textBaseline: 'rop',
                        // boundsPadding: [0, 0, 0, 10],
                        // }}></VText>
                        <VTag
                          attribute={{
                            text: str,
                            textStyle: {
                              fontSize: 10,
                              fontFamily: 'sans-serif',
                              fill: 'rgb(51, 101, 238)'
                              // textAlign: 'left',
                              // textBaseline: 'rop',
                            },
                            panel: {
                              visible: true,
                              fill: '#e6fffb',
                              lineWidth: 1,
                              cornerRadius: 4
                            },
                            boundsPadding: [0, 0, 0, 10]
                          }}
                        ></VTag>
                      ))
                    : null}
                </VGroup>
              </VGroup>
            </VGroup>
          );

          return {
            rootContainer: container,
            renderDefault: false
          };
        }
      },
      {
        field: 'fansCount',
        caption: '粉丝数',
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
        field: 'worksCount',
        caption: '作品数',
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        field: 'viewCount',
        caption: '播放量',
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
        field: 'viewCount',
        caption: '播放量',
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
        caption: '操作',
        width: 100,
        icon: ['favorite', 'message']
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
    defaultRowHeight: 80
  };

  const instance = new ListTable(document.getElementById(Table_CONTAINER_DOM_ID), option);
  bindDebugTool(instance.scenegraph.stage, {
    customGrapicKeys: ['role']
  });
  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
