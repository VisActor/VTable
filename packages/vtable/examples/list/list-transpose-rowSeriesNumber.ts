import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';

VTable.register.icon('dragReorder', {
  type: 'svg',
  svg: '<svg t="1710225663128" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4310" width="200" height="200"><path d="M362.316909 663.71333l398.407895 0 0 62.828954-398.407895 0 0-62.828954Z" p-id="4311"></path><path d="M362.316909 478.750735l398.407895 0 0 62.828954-398.407895 0 0-62.828954Z" p-id="4312"></path><path d="M362.316909 293.78814l398.407895 0 0 62.828954-398.407895 0 0-62.828954Z" p-id="4313"></path><path d="M296.052716 360.614128l-9.593496 0 0-67.154469 9.593496 0L296.052716 360.614128z" p-id="4314"></path><path d="M320.036967 496.009817c0 6.664793-2.267647 11.592013-6.795776 14.789844-3.735068 2.935865-8.794293 4.397147-15.189957 4.397147l-13.990642 0c-4.266164 0-7.194866 0.668219-8.794293 1.998517-1.598404 1.598404-2.39863 4.666276-2.39863 9.193383l0 9.593496 46.36805 0 0 9.593496-55.962569 0 0-19.186991c0-13.853519 6.92676-20.785396 20.785396-20.785396l13.990642 0c8.257058 0 12.391215-3.197832 12.391215-9.593496 0-2.1295-1.068332-3.997034-3.197832-5.596462-2.13564-1.598404-4.797259-2.39863-7.994068-2.39863l-35.176151 0 0-9.593496 35.176151 0c5.059226 0 9.593496 1.336438 13.59053 3.997034C317.638337 485.886249 320.036967 490.413356 320.036967 496.009817z" p-id="4315"></path><path d="M319.236741 710.953238c0 6.395664-2.267647 11.329023-6.795776 14.789844-3.997034 3.197832-8.931416 4.797259-14.789844 4.797259l-32.378431 0 0-9.593496 31.978319 0c7.994068 0 11.992125-3.328815 11.992125-9.993608 0-6.92676-4.397147-10.392698-13.19144-10.392698l-30.379914 0 0-9.593496 31.578206 0c7.725962 0 11.592013-3.197832 11.592013-9.593496 0-5.596462-3.735068-8.394181-11.192923-8.394181l-33.576723 0 0-9.593496 33.576723 0c5.059226 0 9.324366 1.068332 12.791327 3.197832 5.327332 2.934842 7.994068 7.864108 7.994068 14.789844 0 6.664793-2.13564 11.592013-6.395664 14.789844C316.839135 699.098235 319.236741 704.026478 319.236741 710.953238z" p-id="4316"></path></svg>',
  width: 22,
  height: 22,
  name: 'dragReorder',
  funcType: VTable.TYPES.IconFuncTypeEnum.dragReorder,
  positionType: VTable.TYPES.IconPosition.right,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
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
  const records = generatePersons(5);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'sex',
      title: 'sex',
      width: 100
      // mergeCell: true
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
      title: 'Full name 1',
      columns: [
        {
          field: 'name',
          title: 'First Name 1',
          width: 120
        },
        {
          field: 'lastName',
          title: 'Last Name 1',
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
    heightMode: 'autoHeight',
    autoWrapText: true,
    // frozenColCount: 4,
    keyboardOptions: {
      copySelected: true
    },
    transpose: true,
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
      enable: true,
      title: '行号',
      field: 'name',
      dragOrder: true,
      // format: (args: any) => {
      //   return args.value;
      // },
      style: {
        color: 'red'
      }
    }
  };
  const tableInstance = new VTable.ListTable(option);
  tableInstance.on('initialized', args => {
    console.log('initialized');
  });
  window.tableInstance = tableInstance;
  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
