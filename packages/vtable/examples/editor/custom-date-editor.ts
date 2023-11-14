import * as VTable from '../../src';
import type { IEditor, RectProps, Placement } from '@visactor/vtable-editors';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
import * as luxon from 'luxon';
const CONTAINER_ID = 'vTable';
const date_editor = new DateInputEditor({});
VTable.register.editor('date', date_editor);
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);

class DateEditor implements IEditor {
  editorConfig: any;
  element: HTMLInputElement;
  container: HTMLElement;
  constructor(editorConfig: any) {
    this.editorConfig = editorConfig;
  }
  beginEditing(container: HTMLElement, referencePosition: { rect: RectProps; placement?: Placement }, value?: string) {
    this.container = container;
    const cellValue = luxon.DateTime.fromFormat(value, 'yyyy年MM月dd日').toFormat('yyyy-MM-dd');
    const input = document.createElement('input');

    input.setAttribute('type', 'date');

    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.position = 'absolute';
    input.value = cellValue;
    this.element = input;
    container.appendChild(input);

    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
    }
    this.element.focus();
  }
  adjustPosition(rect: RectProps) {
    this.element.style.top = rect.top + 'px';
    this.element.style.left = rect.left + 'px';
    this.element.style.width = rect.width + 'px';
    this.element.style.height = rect.height + 'px';
  }
  getValue() {
    const cellValue = luxon.DateTime.fromFormat(this.element.value, 'yyyy-MM-dd').toFormat('yyyy年MM月dd日');
    return cellValue;
  }
  exit() {
    this.container.removeChild(this.element);
  }
  targetIsOnEditor(target: HTMLElement) {
    if (target === this.element) {
      return true;
    }
    return false;
  }
}
const custom_date_editor = new DateEditor({});
VTable.register.editor('custom-date', custom_date_editor);
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
function generateEmployedSince() {
  const start = new Date('1970-01-01');
  const end = new Date('2000-12-31');
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const year = randomDate.getFullYear();
  const month = randomDate.getMonth() + 1;
  const day = randomDate.getDate();
  return `${year}年${month < 10 ? '0' + month : month}月${day < 10 ? '0' + day : day}日`;
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
      employedSince: generateEmployedSince(),
      tel: generateRandomPhoneNumber(),
      sex: i % 2 === 0 ? 'boy' : 'girl',
      work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
      city: 'beijing'
    };
  });
};

export function createTable() {
  const records = generatePersons(100);
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
      sort: true,
      editor: 'input'
    },
    {
      field: 'full name',
      title: 'Full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 120,
          editor: 'input'
        },
        {
          field: 'lastName',
          title: 'Last Name',
          width: 100,
          editor: 'input'
        }
      ]
    },
    {
      field: 'hobbies',
      title: 'hobbies',
      width: 200,
      editor: 'input'
    },
    {
      field: 'birthday',
      title: 'birthday',
      width: 120,
      editor: 'date'
    },
    {
      field: 'employedSince',
      title: 'employedSince',
      width: 120,
      editor: 'custom-date'
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
  const option: VTable.TYPES.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    heightMode: 'autoHeight',
    autoWrapText: true
  };
  const tableInstance = new VTable.ListTable(option);
  tableInstance.on('initialized', args => {
    console.log('initialized');
  });
  window.tableInstance = tableInstance;
}
