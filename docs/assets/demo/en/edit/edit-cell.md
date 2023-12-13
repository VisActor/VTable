---
category: examples
group: edit
title: edit cell
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/input-editor.gif
link: '../guide/edit/edit_cell'
option: ListTable-columns-text#editor
---

# edit cell

This example demonstrates the editability of the table

## Key Configurations

- `VTable.register.editor` register editor
- `column.editor` editor config

## Code demo

```javascript livedemo template=vtable
let  tableInstance;
// Need to introduce the plug-in package @visactor/vtable-editors when using it
// import * as VTable_editors from '@visactor/vtable-editors';
//Normal usage const input_editor = new VTable.editors.InputEditor();
//VTable.editors is renamed to VTable_editors in the official website editor
const input_editor = new VTable_editors.InputEditor();
const date_input_editor = new VTable_editors.DateInputEditor();
const list_editor = new VTable_editors.ListEditor({values: ['girl', 'boy']});
VTable.register.editor('input-editor', input_editor);
VTable.register.editor('date-input-editor', date_input_editor);
VTable.register.editor('list-editor', list_editor);

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
        sex: i % 2 === 0 ? 'boy' : 'girl',
        work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
        city: 'beijing'
      };
    });
  };
  const records = generatePersons(10);
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      sort: true
    },
    // {
    //   field: 'email1',
    //   title: 'email',
    //   width: 'auto',
    //   sort: true,
    //   editor: 'input-editor'
    // },
    {
      field: 'full name',
      title: 'Full name',
      columns: [
        {
          field: 'name',
          title: 'First Name\n(input editor)',
          width: 120,
          editor: 'input-editor'
        },
        {
          field: 'lastName',
          title: 'Last Name\n(input editor)',
          width: 100,
          editor: 'input-editor'
        }
      ]
    },
    // {
    //   field: 'hobbies',
    //   title: 'hobbies',
    //   width: 100,
    //   editor: 'input-editor'
    // },
    {
      field: 'birthday',
      title: 'birthday\n(date editor)',
      width: 120,
      editor: 'date-input-editor'
    },
    {
      field: 'sex',
      title: 'sex\n(list editor)',
      width: 100,
      editor: 'list-editor'
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
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    autoWrapText: true,
    limitMaxAutoWidth: 600,
    heightMode: 'autoHeight'
  };
  tableInstance = new VTable.ListTable(option);
  window['tableInstance'] = tableInstance;

```
