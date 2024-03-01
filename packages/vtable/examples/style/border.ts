import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    {
      personid: 1,
      fname: 'Aria',
      lname: 'Jenkins',
      birthday: '1999-03-12T16:00:00.000Z',
      longtext: '',
      email: 'aria_jenkins@example.com',
      stars: 5,
      progress: 20
    },
    {
      personid: 2,
      fname: 'Isaac',
      lname: 'Evans',
      birthday: '1990-03-22T16:00:00.000Z',
      longtext: '',
      email: 'isaac_evans@example.com',
      stars: 4,
      progress: 13
    },
    {
      personid: 3,
      fname: 'Gabriella',
      lname: 'Hall',
      birthday: '1990-12-17T16:00:00.000Z',
      longtext: '',
      email: 'gabriella_hall@example.com',
      stars: 2,
      progress: 39
    },
    {
      personid: 4,
      fname: 'Harper',
      lname: 'Walker',
      birthday: '2000-03-30T16:00:00.000Z',
      longtext: '',
      email: 'harper_walker@example.com',
      stars: 4,
      progress: 87
    },
    {
      personid: 5,
      fname: 'Jackson',
      lname: 'Barnes',
      birthday: '1994-11-14T16:00:00.000Z',
      longtext: '',
      email: 'jackson_barnes@example.com',
      stars: 3,
      progress: 34
    },
    {
      personid: 6,
      fname: 'Audrey',
      lname: 'Kelly',
      birthday: '1997-01-19T16:00:00.000Z',
      longtext: '',
      email: 'audrey_kelly@example.com',
      stars: 3,
      progress: 97
    },
    {
      personid: 7,
      fname: 'Christian',
      lname: 'Gomez',
      birthday: '1990-10-26T16:00:00.000Z',
      longtext: '',
      email: 'christian_gomez@example.com',
      stars: 2,
      progress: 34
    },
    {
      personid: 8,
      fname: 'Joshua',
      lname: 'Cook',
      birthday: '1998-05-22T16:00:00.000Z',
      longtext: '',
      email: 'joshua_cook@example.com',
      stars: 4,
      progress: 50
    },
    {
      personid: 9,
      fname: 'Mason',
      lname: 'Sanders',
      birthday: '2001-10-09T16:00:00.000Z',
      longtext: '',
      email: 'mason_sanders@example.com',
      stars: 5,
      progress: 100
    },
    {
      personid: 10,
      fname: 'Evelyn',
      lname: 'Price',
      birthday: '1998-09-11T16:00:00.000Z',
      longtext: '',
      email: 'evelyn_price@example.com',
      stars: 3,
      progress: 79
    }
  ];
  const header: VTable.TYPES.ColumnsDefine = [
    {
      field: 'p',
      fieldFormat(rec) {
        return `i已完成${rec.progress}%`;
      },
      headerStyle: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontSize: 12,
        fontWeight: 'bold'
      },
      title: 'progress',
      description: '这是一个标题的详细描述',
      width: 'calc(20% - 20px)',
      dropDownMenu: [
        {
          text: '升序排序',
          icon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
          },
          selectedIcon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
          },
          stateIcon: {
            svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="dp-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
          }
        },
        {
          text: '降序排序',
          icon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
          },
          selectedIcon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
          },
          stateIcon: {
            svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="dp-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 38.5314L34.9864 48.5634L34.9864 4.01538H28.9864L28.9864 48.4974L18.9864 38.5014V46.9854L27.776 55.7727H27.7732L32.0158 60.0154L45.0144 47.0174V38.5314Z" fill="#161616" fill-opacity="0.9"></path></svg>'
          }
        },
        {
          text: '冻结列',
          icon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
          }
        }
      ]
    },
    {
      title: 'Name',
      headerStyle: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontSize: 13,
        fontWeight: 'bold'
      },
      columns: [
        {
          field: 'fname',
          title: 'First Name',
          width: '20%',
          minWidth: 150,
          headerStyle: {
            textAlign: 'center'
          },
          sort: (v1: any, v2: any, order: any) => {
            if (order === 'desc') {
              if (v1 > v2) {
                return 1;
              } else if (v1 < v2) {
                return -1;
              }
              return 0;
            }
            if (v1 < v2) {
              return 1;
            } else if (v1 > v2) {
              return -1;
            }
            return 0;
          }
        },
        {
          field: 'lname',
          // fieldKey: 'lname',
          title: 'Last Name',
          width: '20%',
          minWidth: 150
        }
      ]
    },
    {
      field: 'email',
      title: 'email',
      // title: `it is this person's y y i Email ya haha`,
      // width: 'calc(50% - 505px - 20px)',
      // minWidth: 350,
      width: 200,
      headerStyle: {
        autoWrapText: true,
        textAlign: 'center'
      },
      style: {
        textOverflow: 'ellipsis',
        lineClamp: 2
      },
      // cellType: 'link',
      // headerType: 'default',
      // sort: true,
      headerIcon: [
        // 'more',
        // 'phone',
        {
          type: 'svg',
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 50 50"><path d="M 25 3 C 19.923765 3 15.799157 4.8329838 13.003906 8.0429688 C 11.376688 7.7090996 10.048176 6.6197602 9.4316406 5.1875 C 9.1136666 4.4502862 8.4137807 4.0506086 7.6972656 4.0136719 C 6.9807506 3.9767351 6.2463213 4.3028249 5.859375 5.0117188 C 5.3428601 5.9578802 5.0488281 7.0426881 5.0488281 8.1894531 C 5.0488281 11.130702 6.9742012 13.631632 9.6484375 14.583984 C 9.2235695 16.246808 9 18.058949 9 20 L 9 21.464844 C 6.447 23.270844 3.0507813 27.486062 3.0507812 32.789062 C 3.0507812 33.919063 3.5290469 34.886219 4.3730469 35.449219 C 5.0790469 35.921219 5.9515781 36.062891 6.7675781 35.837891 C 7.6155781 35.604891 8.3249375 35.007219 8.7109375 34.199219 C 9.1859375 33.205219 9.7939531 32.1635 10.376953 31.3125 C 11.112953 35.0875 12.211859 38.180938 12.755859 39.585938 C 11.349859 40.519937 9 42.532078 9 45.580078 L 9 46 C 9 46.553 9.447 47 10 47 L 20 47 C 20.553 47 21 46.553 21 46 L 21 39.339844 C 22.111 39.638844 23.72 40 25 40 C 26.28 40 27.889 39.638844 29 39.339844 L 29 46 C 29 46.553 29.447 47 30 47 L 40 47 C 40.553 47 41 46.553 41 46 L 41 45.580078 C 41 42.539078 38.661141 40.527891 37.244141 39.587891 C 37.788141 38.182891 38.887047 35.090453 39.623047 31.314453 C 40.206047 32.165453 40.814063 33.207172 41.289062 34.201172 C 41.676063 35.009172 42.385422 35.605844 43.232422 35.839844 C 44.050422 36.063844 44.921719 35.921312 45.636719 35.445312 C 46.471719 34.887313 46.949219 33.919063 46.949219 32.789062 C 46.950219 27.486063 43.553 23.271844 41 21.464844 L 41 20 C 41 18.070345 40.779378 16.268082 40.359375 14.613281 C 43.079425 13.684441 45.048828 11.160748 45.048828 8.1875 C 45.048828 7.040735 44.752843 5.955927 44.236328 5.0097656 C 43.849004 4.3011956 43.114786 3.9764337 42.398438 4.0136719 C 41.682088 4.05091 40.982037 4.4502862 40.664062 5.1875 C 40.037352 6.6433987 38.675813 7.7469237 37.011719 8.0605469 C 34.216277 4.8395401 30.085569 3 25 3 z M 7.6074219 5.9960938 C 8.3727736 7.7576119 9.871471 9.1193049 11.720703 9.7558594 C 11.148015 10.652801 10.659142 11.626854 10.261719 12.675781 C 8.3755339 11.982565 7.0488281 10.237119 7.0488281 8.1894531 C 7.0488281 7.3942059 7.2523534 6.6557012 7.6074219 5.9960938 z M 42.488281 5.9960938 C 42.843344 6.6556973 43.048828 7.3922592 43.048828 8.1875 C 43.048828 10.265432 41.685081 12.039408 39.753906 12.710938 C 39.358396 11.659862 38.869893 10.684253 38.298828 9.7851562 C 40.183822 9.1606408 41.712264 7.7821595 42.488281 5.9960938 z M 18 16 C 19.104 16 20 16.895 20 18 C 20 19.105 19.104 20 18 20 C 16.896 20 16 19.105 16 18 C 16 16.895 16.896 16 18 16 z M 32 16 C 33.104 16 34 16.895 34 18 C 34 19.105 33.104 20 32 20 C 30.896 20 30 19.105 30 18 C 30 16.895 30.896 16 32 16 z M 22.058594 22.001953 C 22.447141 22.02525 22.804156 22.277219 22.941406 22.667969 C 23.206406 23.414969 24.111 24 25 24 C 25.889 24 26.793594 23.414969 27.058594 22.667969 C 27.242594 22.146969 27.815031 21.874594 28.332031 22.058594 C 28.853031 22.241594 29.126406 22.812031 28.941406 23.332031 C 28.395406 24.878031 26.738 26 25 26 C 23.262 26 21.604594 24.878031 21.058594 23.332031 C 20.873594 22.811031 21.146969 22.241594 21.667969 22.058594 C 21.797469 22.012594 21.929078 21.994187 22.058594 22.001953 z"></path></svg>',
          width: 14,
          height: 14,
          name: 'iconKey',
          positionType: VTable.TYPES.IconPosition.contentLeft
        },
        {
          type: 'svg', //指定svg格式图标，其他还支持path，image，font
          svg: `<svg t="1669210764476" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9160" width="200" height="200"><path d="M512.5 214c39.6 0 71.7-32.1 71.7-71.7s-32.1-71.7-71.7-71.7-71.7 32.1-71.7 71.7 32.1 71.7 71.7 71.7zM501.9 668.7v250.8c0 45.1-67.6 45.1-67.6 0V668.7h-89.6l95.9-332.6h-15.1l-56.5 190c-13.4 41.4-70.3 24.4-57.3-20l62.7-206.4c6.7-23.5 36.5-65.3 88-65.3H561c51.1 0 81 42.1 88.7 65.3l62.7 206.2c12.5 44.3-43.9 62.7-57.3 19.5l-56.4-189.3h-16.3l96.9 332.6h-90v251.2c0 44.8-67.3 44.6-67.3 0V668.7h-20.1z" p-id="9161"></path></svg>`,
          width: 22,
          height: 22,
          // funcType: VTable.TYPES.IconFuncTypeEnum.sort,//对应内部特定功能的图标，目前有sort frozen expand等
          name: 'woman', //定义图标的名称，在内部会作为缓存的key值
          positionType: VTable.TYPES.IconPosition.contentRight, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
          marginLeft: 0, // 左侧内容间隔 在特定位置position中起作用
          marginRight: 0, // 右侧内容间隔 在特定位置position中起作用
          visibleTime: 'always', // 显示时机， 'always' | 'mouseover_cell' | 'click_cell'
          hover: {
            // 热区大小
            width: 40,
            height: 40,
            bgColor: 'rgba(144,144,144,0.2)'
          },
          tooltip: {
            // 气泡框，按钮的的解释信息
            title: '女生'
          }
        }
      ],
      dropDownMenu: ['升序排序b', '降序排序b', '冻结列b']
    },
    {
      field: 'birthday',
      // fieldKey: 'birthday',
      fieldFormat: {
        get(rec: any) {
          const d = rec.birthday;
          return isNaN(d) ? d : `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
        },
        set(rec: any, val: any) {
          const date = new Date(val);
          rec.birthday = isNaN(parseInt(date.toString(), 10)) ? val : date;
        }
      },
      title: 'Birthday',
      width: 150
      // cellType: 'default',
      // headerType: 'default',
    }
  ];

  const option: VTable.TYPES.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    header, //关联表头定义
    frozenColCount: 0, //冻结列
    allowFrozenColCount: 5, //最多允许冻结的列数，设置5列显示冻结图标
    // theme: VTable.themes.DEFAULT,
    theme: VTable.themes.DEFAULT.extends({
      frameStyle: {
        cornerRadius: 10,
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'black',
        borderColor: 'black',
        borderLineWidth: 4
      },
      bodyStyle: {
        frameStyle: {
          borderColor: ['green', 'red'],
          // borderColor: 'green',
          borderLineWidth: 4
        }
      },
      headerStyle: {
        frameStyle: {
          borderColor: 'yellow',
          borderLineWidth: 4
        }
      }
    }),
    showFrozenIcon: true, //显示VTable内置冻结列图标
    padding: { top: 10, bottom: 10, left: 10, right: 20 }, //整体表格的内边距 与parentElement的定位
    hover: {
      highlightMode: 'cross',
      disableHeaderHover: false
    },
    defaultRowHeight: 80,
    menu: {
      renderMode: 'html',
      defaultHeaderMenuItems: ['升序排序', '降序排序', '冻结列'],
      contextMenuItems: (field: string, row: number, col: number) => {
        console.log(field, row, col);
        return [
          { text: '复制表头', menuKey: '复制表头$1' },
          { text: '复制单元格', menuKey: '复制单元格$1' }
        ];
      },
      dropDownMenuHighlight: [
        {
          col: 0,
          row: 0,
          menuKey: '升序排序'
        }
      ]
    },
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    records: [...personsDataSource],
    dragHeaderMode: 'column' as any
  };
  //初始化表格
  const instance = new ListTable(option);

  bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
