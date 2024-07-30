<template>
  <vue-list-table :options="tableOptions" ref="tableRef" :height="500" />
  <div id="pagination-container"></div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const tableOptions = ref({});
const tableRef = ref(null);
const copyData = ref(null);

const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateRandomHobbies = () => {
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

  const numHobbies = Math.floor(Math.random() * 3) + 1;
  const selectedHobbies = [];

  for (let i = 0; i < numHobbies; i++) {
    const randomIndex = Math.floor(Math.random() * hobbies.length);
    const hobby = hobbies[randomIndex];
    selectedHobbies.push(hobby);
    hobbies.splice(randomIndex, 1);
  }

  return selectedHobbies.join(', ');
};

const generateRandomBirthday = () => {
  const start = new Date('1970-01-01');
  const end = new Date('2000-12-31');
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const year = randomDate.getFullYear();
  const month = randomDate.getMonth() + 1;
  const day = randomDate.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

const generateRandomPhoneNumber = () => {
  const areaCode = [
    '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
    '150', '151', '152', '153', '155', '156', '157', '158', '159', '170',
    '176', '177', '178', '180', '181', '182', '183', '184', '185', '186',
    '187', '188', '189'
  ];
  const prefix = areaCode[Math.floor(Math.random() * areaCode.length)];
  const suffix = String(Math.random()).substr(2, 8);
  return prefix + suffix;
};

const generatePersons = (count) => {
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

onMounted(async () => {
  const records = generatePersons(1000);
  const columns = [
    { field: 'id', title: 'ID', width: 80, sort: true },
    { field: 'email1', title: 'Email', width: 250, sort: true },
    {
      field: 'full name', title: 'Full name', columns: [
        { field: 'name', title: 'First Name', width: 120 },
        { field: 'lastName', title: 'Last Name', width: 100 }
      ]
    },
    { field: 'hobbies', title: 'Hobbies', width: 200 },
    { field: 'birthday', title: 'Birthday', width: 120 },
    { field: 'sex', title: 'Sex', width: 100 },
    { field: 'tel', title: 'Telephone', width: 150 },
    { field: 'work', title: 'Job', width: 200 },
    { field: 'city', title: 'City', width: 150 }
  ];

  const options = {
    records,
    columns,
    pagination: {
      currentPage: 0,
      perPageCount: 100
    }
  };

  tableOptions.value = options;
  await nextTick();
  createPagination(10, 1, tableRef.value.vTableInstance);


  tableRef.value.vTableInstance.on('dropdown_menu_click', args => {
    console.log('menu click', args);
    if (args.menuKey === 'copy') {
      copyData.value = tableRef.value.vTableInstance.getCopyValue();
    } else if (args.menuKey === 'paste') {
      const rows = copyData.value.split('\n');
      const values = rows.map(row => row.split('\t').map(cell => cell.trim()));
      tableRef.value.vTableInstance.changeCellValues(args.col, args.row, values);
    } else if (args.menuKey === 'delete') {
      const selectCells = tableRef.value.vTableInstance.getSelectedCellInfos();
      if (selectCells?.length > 0 && cellIsSelectRange(args.col, args.row, selectCells)) {
        deleteSelectRange(selectCells);
      } else {
        tableRef.value.vTableInstance.changeCellValue(args.col, args.row, '');
      }
    }
  });
});

const deleteSelectRange = (selectCells) => {
  selectCells.forEach(row => {
    row.forEach(cell => {
      tableRef.value.vTableInstance.changeCellValue(cell.col, cell.row, '');
    });
  });
};

const cellIsSelectRange = (col, row, selectCells) => {
  return selectCells.some(row => row.some(cell => cell.col === col && cell.row === row));
};

// 创建分页组件的函数
function createPagination(totalPages, currentPage, tableInstance) {
  const container = document.getElementById('pagination-container');
  container.innerHTML = '';

  // 创建一个无序列表作为分页的容器
  const ul = document.createElement('ul');
  ul.className = 'pagination';

  // 为每一页创建一个列表项
  for (let i = 1; i <= totalPages; i++) {
    // 创建列表项
    const li = document.createElement('li');
    // 创建链接
    const a = document.createElement('a');
    a.innerText = i;
    a.href = '?page=' + i;
    a.className = i === currentPage ? 'active' : '';
    a.onclick = function (event) {
      event.preventDefault();
      // 重新创建分页组件
      createPagination(totalPages, i, tableInstance);
      tableInstance.updatePagination({
        currentPage: i - 1
      });
    };
    li.appendChild(a);
    ul.appendChild(li); // 将列表项添加到无序列表中
  }

  container.appendChild(ul); // 将分页组件添加到容器中
}
</script>
