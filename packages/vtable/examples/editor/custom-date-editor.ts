import * as VTable from '../../src';
import type { IEditor, RectProps, Placement, EditContext } from '@visactor/vtable-editors';
import { DateInputEditor, InputEditor, ListEditor } from '@visactor/vtable-editors';
import * as luxon from 'luxon';
import * as Pikaday from 'pikaday';
import '../../node_modules/pikaday/css/pikaday.css';
const CONTAINER_ID = 'vTable';
const date_editor = new DateInputEditor({});
VTable.register.editor('date', date_editor);
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);
const list_editor = new ListEditor({ values: ['girl', 'boy'] });
VTable.register.editor('list', list_editor);

class DateEditor implements IEditor {
  editorConfig: any;
  element: HTMLInputElement;
  container: HTMLElement;
  successCallback: Function;
  picker: any;
  constructor(editorConfig: any) {
    this.editorConfig = editorConfig;
  }
  onStart({ container, value, referencePosition, endEdit }: EditContext) {
    const that = this;
    this.container = container;
    this.successCallback = endEdit;
    // const cellValue = luxon.DateTime.fromFormat(value, 'yyyy年MM月dd日').toFormat('yyyy-MM-dd');
    const input = document.createElement('input');

    input.setAttribute('type', 'text');

    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.position = 'absolute';
    input.value = value as string;
    this.element = input;
    container.appendChild(input);

    const picker = new Pikaday({
      field: input,
      format: 'D/M/YYYY',
      toString(date, format) {
        // you should do formatting based on the passed format,
        // but we will just return 'D/M/YYYY' for simplicity
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}年${month}月${day}日`;
      },
      parse(dateString, format) {
        // dateString is the result of `toString` method
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      },
      onSelect: function () {
        const date = this.getDate();
        that.successCallback();
      }
    });
    this.picker = picker;
    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
    }
    this.picker.show();
    // this.element.focus();
  }

  adjustPosition(rect: RectProps) {
    this.element.style.top = rect.top + 'px';
    this.element.style.left = rect.left + 'px';
    this.element.style.width = rect.width + 'px';
    this.element.style.height = rect.height + 'px';
  }
  getValue() {
    // const cellValue = luxon.DateTime.fromFormat(this.element.value, 'yyyy-MM-dd').toFormat('yyyy年MM月dd日');
    return this.element.value;
  }
  onEnd() {
    this.picker.destroy();
    this.container.removeChild(this.element);
  }
  isEditorElement(target: HTMLElement) {
    if (target === this.element || this.picker.el.contains(target)) {
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
    'Playing \n musical /n instruments',
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
  const records = generatePersons(10);
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      sort: true
    },
    {
      field: '',
      title: 'ID',
      width: 80,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 'auto',
      sort: true,
      headerEditor: 'input',
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
      width: 100,
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
      width: 100,
      editor: 'list',
      values: ['girl', 'body']
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200,
      editor: 'input'
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
    keyboardOptions: {
      copySelected: true,
      pasteValueToCell: true,
      moveFocusCellOnTab: true,
      // editCellOnEnter: false,
      moveEditCellOnArrowKeys: true
    },

    // heightMode: 'autoHeight',
    customMergeCell: (col, row, table) => {
      if (col >= 0 && col <= 5 && row === 2) {
        return {
          text: table.getCellOriginValue(0, 2),
          range: {
            start: {
              col: 0,
              row: 2
            },
            end: {
              col: 5,
              row: 2
            }
          }
          // style: {
          //   bgColor: 'white'
          // }
        };
      }
    },
    theme: VTable.themes.ARCO.extends({
      bodyStyle: {
        bgColor(args) {
          if (args.row >= 8) {
            return '#282a2e';
          }
          return '#fbfbfc';
        },
        color(args) {
          if (args.row >= 8) {
            return '#e5e7ea';
          }
          return '#141414';
        },
        hover: {
          cellBgColor(args) {
            if (args.row >= 8) {
              return '#29364D';
            }
            return '#F7F8FA';
          }
        }
      }
    }),
    autoWrapText: true,
    limitMaxAutoWidth: 600,
    menu: {
      contextMenuItems: ['向下插入数据', '向下插入空行', '向右插入空列', '修改值', '删除该行']
    },
    dragHeaderMode: 'all',
    heightMode: 'autoHeight',
    editor: arg => {
      return '';
    }
  };
  const tableInstance = new VTable.ListTable(option);
  tableInstance.on('initialized', args => {
    console.log('initialized');
  });
  tableInstance.on('change_cell_value', arg => {
    console.log(arg);
  });
  window.tableInstance = tableInstance;
  tableInstance.on('dropdown_menu_click', args => {
    console.log('dropdown_menu_click', args);
    if (args.menuKey === '向下插入数据') {
      const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
      tableInstance.addRecords(generatePersons(1), recordIndex + 1);
    } else if (args.menuKey === '向下插入空行') {
      const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
      tableInstance.addRecord({}, recordIndex + 1);
    } else if (args.menuKey === '向右插入空列') {
      columns.splice(args.col + 1, 0, { field: Date.now().toString(), headerEditor: 'input', editor: 'input' });
      tableInstance.updateColumns(columns);
    } else if (args.menuKey === '删除该行') {
      const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
      tableInstance.deleteRecords([recordIndex]);
    } else if (args.menuKey === '修改值') {
      tableInstance.startEditCell(args.col, args.row);
    }
  });
}
