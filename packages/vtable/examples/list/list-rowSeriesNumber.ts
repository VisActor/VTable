import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.icon('book', {
  type: 'svg', //指定svg格式图标，其他还支持path，image，font
  svg: `<svg t="1669210190896" class="icon" viewBox="0 0 1427 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4793" width="200" height="200"><path d="M1351.064977 123.555737h-107.862689V92.969424l-36.660345-14.396103C1199.192582 75.698424 1024.753324 7.932987 872.167608 7.932987c-71.440118 0-128.592212 14.720339-170.786193 43.880012-42.193982-29.159673-99.302844-43.880012-170.764578-43.880012-152.585716 0-327.024974 67.765437-334.374335 70.640334l-36.638729 14.396103v30.586313H54.291745A43.318002 43.318002 0 0 0 10.973743 166.873739v797.81643c0 23.928657 19.389345 43.318002 43.318002 43.318001h1296.773232a43.318002 43.318002 0 0 0 43.318002-43.318001V166.873739a43.318002 43.318002 0 0 0-43.318002-43.318002z m-165.620024 8.776003v633.169114c-89.446053-30.629545-327.003358-100.03778-455.184871-25.203987V102.566825c36.141566-26.998096 87.025087-36.898118 141.907526-36.898118 143.420629 0 313.277345 66.663033 313.277345 66.663033zM1120.035635 804.971249H739.295474c74.293399-70.467408 258.243596-36.595497 380.740161 0zM530.616837 65.668707c54.860823 0 105.765959 9.921638 141.88591 36.898118v637.730042c-128.181512-74.790562-365.695585-5.425558-455.163254 25.203987V132.33174s169.856715-66.663033 313.277344-66.663033z m132.850518 739.302542H282.662347c122.453333-36.638729 306.489993-70.575487 380.805008 0z m644.27962 116.400918H97.609746V210.170125h61.994027v652.536844H1243.202288V210.170125h64.544687v711.202042z" p-id="4794"></path></svg>`,
  width: 22,
  height: 22,
  // funcType: VTable.TYPES.IconFuncTypeEnum.sort,//对应内部特定功能的图标，目前有sort pin expand等
  name: 'book', //定义图标的名称，在内部会作为缓存的key值
  positionType: VTable.TYPES.IconPosition.contentLeft, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
  marginLeft: 2, // 左侧内容间隔 在特定位置position中起作用
  marginRight: 2, // 右侧内容间隔 在特定位置position中起作用
  visibleTime: 'always', // 显示时机， 'always' | 'mouseover_cell' | 'click_cell'
  hover: {
    // 热区大小
    width: 22,
    height: 22,
    bgColor: 'rgba(22,44,66,0.2)'
  },
  tooltip: {
    title: '书籍',
    placement: VTable.TYPES.Placement.left
  }
});

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function generateRandomHobbies() {
  const hobbies = [
    'Reading books',
    'Playing video games',
    'Watching movies',
    'Cooking',
    'Hiking',
    'Traveling',
    'Photography',
    'Playing musical instruments',
    'Gardening',
    'Painting',
    'Writing',
    'Swimming'
  ];

  const numHobbies = Math.floor(Math.random() * 3) + 1; // 生成 1-3 之间的随机整数
  const selectedHobbies: string[] = [];

  for (let i = 0; i < numHobbies; i++) {
    const randomIndex = Math.floor(Math.random() * hobbies.length);
    const hobby = hobbies[randomIndex];
    selectedHobbies.push(hobby);
    hobbies.splice(randomIndex, 1); // 确保每个爱好只选一次
  }

  return selectedHobbies.join(', ');
}
function generateRandomBirthday() {
  const start = new Date('1970-01-01');
  const end = new Date('2000-12-31');
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const year = randomDate.getFullYear();
  const month = randomDate.getMonth() + 1;
  const day = randomDate.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}
function generateRandomPhoneNumber() {
  const areaCode = [
    '130',
    '131',
    '132',
    '133',
    '134',
    '135',
    '136',
    '137',
    '138',
    '139',
    '150',
    '151',
    '152',
    '153',
    '155',
    '156',
    '157',
    '158',
    '159',
    '170',
    '176',
    '177',
    '178',
    '180',
    '181',
    '182',
    '183',
    '184',
    '185',
    '186',
    '187',
    '188',
    '189'
  ];
  const prefix = areaCode[Math.floor(Math.random() * areaCode.length)];
  const suffix = String(Math.random()).substr(2, 8);
  return prefix + suffix;
}
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => {
    const first = generateRandomString(10);
    const last = generateRandomString(4);
    return {
      id: i + 1,
      email1: `${first}_${last}@xxx.com`,
      name: first,
      lastName: last,
      hobbies: generateRandomHobbies(),
      birthday: generateRandomBirthday(),
      tel: generateRandomPhoneNumber(),
      sex: Math.floor(Math.random() * 100) % 2 === 0 ? 'boy' : 'girl',
      work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
      city: 'beijing'
    };
  });
};

export function createTable() {
  const records = generatePersons(100);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'sex',
      title: 'sex',
      width: 100,
      mergeCell: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 250,
      sort: true
    },
    {
      title: 'Full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 120
        },
        {
          field: 'lastName',
          title: 'Last Name',
          width: 100
        }
      ]
    },
    {
      field: 'hobbies',
      title: 'hobbies',
      width: 200
    },
    {
      field: 'birthday',
      title: 'birthday',
      width: 120
    },

    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    }
  ];
  const option: VTable.TYPES.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    // heightMode: 'autoHeight',
    autoWrapText: false,
    defaultHeaderRowHeight: 50,
    defaultRowHeight: 28,
    frozenColCount: 1,
    keyboardOptions: {
      copySelected: true
    },
    theme: { headerStyle: { bgColor: 'yellow' } },
    dragHeaderMode: 'all',
    // sortState: {
    //   field: 'email1',
    //   order: 'asc'
    // },
    // pagination: {
    //   perPageCount: 20,
    //   currentPage: 1
    // },
    rowSeriesNumber: {
      title: '',
      // field: 'sex',
      dragOrder: true,
      headerIcon: 'book',
      width: 'auto',

      headerStyle: {
        color: 'black',
        bgColor: 'pink'
      },
      style: {
        color: 'red'
      },
      customLayout: (args: any) => {
        const { table, row, col, rect } = args;
        const record = table.getRecordByCell(col, row);
        const { height, width } = rect ?? table.getCellRect(col, row);
        const container = new VTable.CustomLayout.Group({
          height,
          width,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        });
        const bloggerName = new VTable.CustomLayout.Text({
          text: 'ttttttt ffff',
          fontSize: 13,
          fontFamily: 'sans-serif',
          fill: 'black',
          marginLeft: 10
        });
        container.add(bloggerName);
        return {
          rootContainer: container,
          renderDefault: true
        };
      },
      headerCustomLayout: (args: any) => {
        const { table, row, col, rect } = args;
        const record = table.getRecordByCell(col, row);
        const { height, width } = rect ?? table.getCellRect(col, row);
        const container = new VTable.CustomLayout.Group({
          height,
          width,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        });
        const bloggerName = new VTable.CustomLayout.Text({
          text: 'ttttttt ffff',
          fontSize: 13,
          fontFamily: 'sans-serif',
          fill: 'black',
          marginLeft: 10
        });
        container.add(bloggerName);
        return {
          rootContainer: container,
          renderDefault: true
        };
      }
    },
    bottomFrozenRowCount: 3
  };
  const tableInstance = new VTable.ListTable(option);
  tableInstance.on('change_header_position', args => {
    console.log('change_header_position');
  });
  window.tableInstance = tableInstance;
  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
