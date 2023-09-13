import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

const generatePerson = (function () {
  const fnames = ['Sophia', 'Emma', 'Olivia', 'Isabella', 'Ava', 'Mia', 'Emily', 'Abigail', 'Madison', 'Elizabeth'];
  const lnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  const msOfYear = 365 * 24 * 60 * 60 * 1000;
  return function (index, longText = false) {
    const fname = fnames[index % fnames.length];
    const lname = lnames[index % lnames.length];
    let birthday = new Date('2022-3-30');
    birthday = new Date(birthday.getFullYear(), birthday.getMonth(), birthday.getDate(), 0, 0, 0, 0);
    // let long = '';
    // if (longText) {
    //   long = longTextList[index];
    // }
    const person = {
      personid: index + 1,
      fname,
      lname,
      birthday,
      // longtext: long,
      email: `${fname.replace('-', '_')}_${lname.replace('-', '_')}@example.com`.toLowerCase(),
      stars: index * 5 + 1,
      progress: index
    };
    return person;
  };
})();

function generatePersonsDataSource(num, longText = false) {
  const array = new Array(num);
  for (let i = 0; i < num; i++) {
    array[i] = generatePerson(i, longText);
  }
  return array;
}

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'progress',
        fieldKey: 'progress',
        fieldFormat(rec) {
          return `已完成${rec.progress}%`;
        },
        title: 'progress',
        description: '这是一个标题的详细描述',
        captionIcon: {
          type: 'svg',
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 50 50"><path d="M 25 3 C 19.923765 3 15.799157 4.8329838 13.003906 8.0429688 C 11.376688 7.7090996 10.048176 6.6197602 9.4316406 5.1875 C 9.1136666 4.4502862 8.4137807 4.0506086 7.6972656 4.0136719 C 6.9807506 3.9767351 6.2463213 4.3028249 5.859375 5.0117188 C 5.3428601 5.9578802 5.0488281 7.0426881 5.0488281 8.1894531 C 5.0488281 11.130702 6.9742012 13.631632 9.6484375 14.583984 C 9.2235695 16.246808 9 18.058949 9 20 L 9 21.464844 C 6.447 23.270844 3.0507813 27.486062 3.0507812 32.789062 C 3.0507812 33.919063 3.5290469 34.886219 4.3730469 35.449219 C 5.0790469 35.921219 5.9515781 36.062891 6.7675781 35.837891 C 7.6155781 35.604891 8.3249375 35.007219 8.7109375 34.199219 C 9.1859375 33.205219 9.7939531 32.1635 10.376953 31.3125 C 11.112953 35.0875 12.211859 38.180938 12.755859 39.585938 C 11.349859 40.519937 9 42.532078 9 45.580078 L 9 46 C 9 46.553 9.447 47 10 47 L 20 47 C 20.553 47 21 46.553 21 46 L 21 39.339844 C 22.111 39.638844 23.72 40 25 40 C 26.28 40 27.889 39.638844 29 39.339844 L 29 46 C 29 46.553 29.447 47 30 47 L 40 47 C 40.553 47 41 46.553 41 46 L 41 45.580078 C 41 42.539078 38.661141 40.527891 37.244141 39.587891 C 37.788141 38.182891 38.887047 35.090453 39.623047 31.314453 C 40.206047 32.165453 40.814063 33.207172 41.289062 34.201172 C 41.676063 35.009172 42.385422 35.605844 43.232422 35.839844 C 44.050422 36.063844 44.921719 35.921312 45.636719 35.445312 C 46.471719 34.887313 46.949219 33.919063 46.949219 32.789062 C 46.950219 27.486063 43.553 23.271844 41 21.464844 L 41 20 C 41 18.070345 40.779378 16.268082 40.359375 14.613281 C 43.079425 13.684441 45.048828 11.160748 45.048828 8.1875 C 45.048828 7.040735 44.752843 5.955927 44.236328 5.0097656 C 43.849004 4.3011956 43.114786 3.9764337 42.398438 4.0136719 C 41.682088 4.05091 40.982037 4.4502862 40.664062 5.1875 C 40.037352 6.6433987 38.675813 7.7469237 37.011719 8.0605469 C 34.216277 4.8395401 30.085569 3 25 3 z M 7.6074219 5.9960938 C 8.3727736 7.7576119 9.871471 9.1193049 11.720703 9.7558594 C 11.148015 10.652801 10.659142 11.626854 10.261719 12.675781 C 8.3755339 11.982565 7.0488281 10.237119 7.0488281 8.1894531 C 7.0488281 7.3942059 7.2523534 6.6557012 7.6074219 5.9960938 z M 42.488281 5.9960938 C 42.843344 6.6556973 43.048828 7.3922592 43.048828 8.1875 C 43.048828 10.265432 41.685081 12.039408 39.753906 12.710938 C 39.358396 11.659862 38.869893 10.684253 38.298828 9.7851562 C 40.183822 9.1606408 41.712264 7.7821595 42.488281 5.9960938 z M 18 16 C 19.104 16 20 16.895 20 18 C 20 19.105 19.104 20 18 20 C 16.896 20 16 19.105 16 18 C 16 16.895 16.896 16 18 16 z M 32 16 C 33.104 16 34 16.895 34 18 C 34 19.105 33.104 20 32 20 C 30.896 20 30 19.105 30 18 C 30 16.895 30.896 16 32 16 z M 22.058594 22.001953 C 22.447141 22.02525 22.804156 22.277219 22.941406 22.667969 C 23.206406 23.414969 24.111 24 25 24 C 25.889 24 26.793594 23.414969 27.058594 22.667969 C 27.242594 22.146969 27.815031 21.874594 28.332031 22.058594 C 28.853031 22.241594 29.126406 22.812031 28.941406 23.332031 C 28.395406 24.878031 26.738 26 25 26 C 23.262 26 21.604594 24.878031 21.058594 23.332031 C 20.873594 22.811031 21.146969 22.241594 21.667969 22.058594 C 21.797469 22.012594 21.929078 21.994187 22.058594 22.001953 z"></path></svg>',
          width: 14,
          height: 14,
          name: 'iconKey',
          positionType: VTable.TYPES.IconPosition.inlineFront
        },
        width: 'auto'
        // disableHeaderHover: true,
        // disableHeaderSelect: true,
      },
      {
        field: 'personid',
        fieldKey: 'personid999',
        title: 'ID',
        width: 'auto',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        }
      },
      {
        field: 'personid',
        fieldKey: 'personid88',
        fieldFormat(rec) {
          return `这是第${rec.personid}号`;
        },
        title: 'ID说明',
        description: '这是一个ID详细描述',
        width: 150,
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        }
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
            fieldKey: 'fnamehh',
            width: '20%',
            minWidth: 150,
            headerStyle: {
              textStick: true,
              autoWrapText: true
            },
            sort: (v1, v2, order) => {
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
            fieldKey: 'lname',
            title: 'Last Name',
            width: '20%',
            minWidth: 150
          }
        ]
      },
      {
        field: 'email',
        fieldKey: 'email',
        title: `it is this person's y y i Email ya
  haha`,
        width: 150,
        minWidth: 50,
        headerStyle: {
          autoWrapText: true
        },
        style: {
          textOverflow: 'ellipsis'
        },
        sort: true
      },
      {
        field: 'birthday',
        fieldKey: 'birthday',
        fieldFormat: {
          get(rec) {
            const d = rec.birthday;
            return isNaN(d) ? d : `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
          },
          set(rec, val) {
            const date = new Date(val);
            rec.birthday = isNaN(parseInt(date.toString(), 10)) ? val : date;
          }
        },
        title: 'Birthday',
        width: 100
      }
    ],
    theme: {
      scrollStyle: {
        hoverOn: true,
        scrollSliderColor: 'red',
        visible: 'always'
      }
    },
    widthMode: 'standard',
    heightMode: 'autoHeight',
    autoWrapText: true,
    transpose: true,
    defaultHeaderColWidth: [100, 150]
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(generatePersonsDataSource(50));

  VTable.bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
