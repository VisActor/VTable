// @ts-nocheck
// 有问题可对照demo unitTestListTable
import { ListTable } from '../src';
import * as VTable from '../src/index';
import { createDiv } from './dom';
global.__VERSION__ = 'none';
describe('listTable-1W init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

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
    const selectedHobbies = [];

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
      const first = 'felisgh';
      const last = 'jonn';
      return {
        id: i + 1,
        email1: `${first}_${last}@xxx.com`,
        name: first,
        lastName: last,
        hobbies: generateRandomHobbies(),
        birthday: generateRandomBirthday(),
        tel: generateRandomPhoneNumber(),
        sex: i % 2 === 0 ? 'boy' : 'girl',
        work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
        city: 'beijing'
      };
    });
  };

  const records = generatePersons(10000);
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 250,
      sort: true
    },
    {
      field: 'full name',
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
      field: 'sex',
      title: 'sex',
      width: 100
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
  const option = {
    records,
    columns,
    theme: VTable.themes.DEFAULT.extends({
      defaultStyle: { fontFamily: 'Arial' },
      headerStyle: { fontFamily: 'Arial' },
      bodyStyle: { fontFamily: 'Arial' }
    })
    // widthMode:"autoWidth",
    // heightMode:'autoHeight'
  };
  const listTable = new ListTable(containerDom, option);
  test('listTable-1W getCellStyle', () => {
    expect(listTable.getCellStyle(5, 5)).toEqual({
      autoWrapText: false,
      bgColor: '#FDFDFD',
      borderColor: '#E1E4E8',
      borderLineDash: [],
      borderLineWidth: 1,
      color: '#000',
      fontFamily: 'Arial',
      fontSize: 14,
      fontStyle: undefined,
      fontVariant: undefined,
      fontWeight: undefined,
      lineClamp: 'auto',
      lineHeight: 14,
      lineThrough: false,
      lineThroughLineWidth: undefined,
      padding: [10, 16, 10, 16],
      textAlign: 'left',
      textBaseline: 'middle',
      textOverflow: 'ellipsis',
      underline: false,
      underlineDash: undefined,
      underlineOffset: undefined,
      underlineWidth: undefined,
      _linkColor: '#3772ff',
      _strokeArrayColor: undefined,
      _strokeArrayWidth: undefined
    });
  });
  test('listTable-1W getRowHeight colWidth', () => {
    expect(listTable.getRowHeight(3)).toBe(40);
    expect(listTable.getColWidth(3)).toBe(100);
  });
  test('listTable-1W getAllRowsHeight coslWidth', () => {
    expect(listTable.getAllRowsHeight()).toBe(400080);
    expect(listTable.getAllColsWidth()).toBe(1470);
  });
  test('listTable-1W scrollToCell', async () => {
    listTable.scrollToCell({ col: 3, row: 3000 });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    expect(listTable.scrollTop).toBe(119920);
  });
  test('listTable-1W update widthMode', async () => {
    listTable.widthMode = 'autoWidth';
    listTable.renderWithRecreateCells();
    // 使用setTimeout延迟执行验证语句
    // setTimeout(() => {
    // await new Promise(resolve => setTimeout(resolve, 1000));
    expect(listTable.getAllColsWidth()).toBe(1457);
    // }, 1000); // 延迟1秒
  });

  test('listTable-1W update heightMode', () => {
    listTable.heightMode = 'autoHeight';
    listTable.renderWithRecreateCells();
    expect(listTable.getAllRowsHeight()).toBe(340072);
  });
});
