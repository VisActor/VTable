---
category: examples
group: edit
title: add or delete records
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/add-delete-records.png
---

# Add and delete data dynamically

Add and delete data dynamically，Right-click and the Modify Data menu is displayed

## Key Configurations

- addRecords api
- addRecord api
- deleteRecords api
- updateRecords api
- changeCellValue api

## Code demo

```javascript livedemo template=vtable
// Need to introduce the plug-in package @visactor/vtable-editors when using it
// import * as VTable_editors from '@visactor/vtable-editors';
//Normal usage const input_editor = new VTable.editors.InputEditor();
//VTable.editors is renamed to VTable_editors in the official website editor
const input_editor = new VTable_editors.InputEditor();
VTable.register.editor('input-editor', input_editor);
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
  const areaCode = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '170', '176', '177', '178', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
  const prefix = areaCode[Math.floor(Math.random() * areaCode.length)];
  const suffix = String(Math.random()).substr(2, 8);
  return prefix + suffix;
}

const generatePersons = (count) => {
  return Array.from(new Array(count)).map((_, i) => {
    const first=generateRandomString(10);
    const last=generateRandomString(4);
    return {
    id: i+1,
    email1: `${first}_${last}@xxx.com`,
    name: first,
    lastName: last,
    hobbies: generateRandomHobbies(),
    birthday: generateRandomBirthday(),
    tel: generateRandomPhoneNumber(),
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing',
  }});
};


const records = generatePersons(1000);
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80,
    sort: true,
  },
  {
    field: 'email1',
    title: 'email',
    width: 250,
    sort: true,
  },
  {
    field: 'full name',
    title: 'Full name',
    columns: [
      {
        field: 'name',
        title: 'First Name',
        width: 120,
      },
      {
        field: 'lastName',
        title: 'Last Name',
        width: 100,
      },
    ],
  },
  {
    field: 'hobbies',
    title: 'hobbies',
    width: 200,
  },
  {
    field: 'birthday',
    title: 'birthday',
    width: 120,
  },
  {
    field: 'sex',
    title: 'sex',
    width: 100,
  },
  {
    field: 'tel',
    title: 'telephone',
    width: 150,
  },
  {
    field: 'work',
    title: 'job',
    width: 200,
  },
  {
    field: 'city',
    title: 'city',
    width: 150,
  },
];
const option = {
  records,
  columns,
  menu:{
    contextMenuItems:["insert records bellow","insert blank row bellow",'update row data','modify cell value','delete records']
  },
  editor: 'input-editor'
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;

tableInstance.on('dropdown_menu_click', (args) => {
  console.log('dropdown_menu_click',args);
  if(args.menuKey==="insert records bellow"){
    const recordIndex=tableInstance.getRecordShowIndexByCell(args.col,args.row);
    tableInstance.addRecords(generatePersons(1),recordIndex+1);
  }else if(args.menuKey==="insert blank row bellow"){
    const recordIndex=tableInstance.getRecordShowIndexByCell(args.col,args.row);
    tableInstance.addRecord({},recordIndex+1);
  }else if(args.menuKey==="delete records"){
    const recordIndex=tableInstance.getRecordShowIndexByCell(args.col,args.row);
    tableInstance.deleteRecords([recordIndex]);
  }else if(args.menuKey==="update row data"){
    const recordIndex=tableInstance.getRecordShowIndexByCell(args.col,args.row);
    tableInstance.updateRecords([{
      "id": 1111,
      "email1": "changed Value",
      "name": "changed Value",
      "lastName": "changed Value",
      "hobbies": "changed Value",
      "birthday": "1974-09-25",
      "tel": "13237599651",
      "sex": "boy",
      "work": "back-end engineer",
      "city": "beijing"
    }],[recordIndex]);
  }else if(args.menuKey==="modify cell value"){
    tableInstance.startEditCell(args.col,args.row);
  }
})
```
