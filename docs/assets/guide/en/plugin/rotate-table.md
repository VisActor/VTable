# Rotate Table Plugin

## Feature

The Rotate Table Plugin can rotate the table 90 degrees (clockwise). Other angle rotations can be extended by yourself.

## Plugin Description

The plugin adds the rotate90WithTransform and cancelTransform methods to the table instance.

- rotate90WithTransform: Rotate 90 degrees
- cancelTransform: Cancel rotation

Please follow the example process below:
1. Ensure that the selected object is the upper container of the table, and the container of the table is full screen. The selected object can be a div or body that covers the entire screen.
2. Before calling the rotate90WithTransform interface, adjust the container's width and height.
3. After calling the rotate90WithTransform interface, the table will rotate 90 degrees.
4. After calling the cancelTransform interface, the table will restore to its original state.

## Example


```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
//  使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 正常使用方式 const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 VTable.plugins重命名成了VTablePlugins

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing',
    image:
      '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" stroke="#f5a623" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" stroke="#f5a623" stroke-width="1" stroke-linejoin="round"/></svg>'
  }));
};

  const rotateTablePlugin = new VTablePlugins.RotateTablePlugin();
  const option = {
    records: generatePersons(20),
    columns:[
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      minWidth: 50,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    }
  ],
    plugins: [rotateTablePlugin]
  };
  const dom = document.getElementById(CONTAINER_ID);
  const tableInstance = new VTable.ListTable( dom,option);
  window.tableInstance = tableInstance;
  // The target container for rotation is currently only supported for full screen content rotation. It can be a div or body that covers the entire screen.
  const rotateDom = document.body;
  // Add two buttons to the body. One is the rotation button and the other is the cancel rotation button. Only one of the selected button and the cancel rotation button can be displayed.
  const rotateButton = createButton('Rotate',dom);
  const cancelRotateButton = createButton('Cancel Rotate', dom,true);
  // Rotation button click event
  rotateButton.addEventListener('click', () => {
    const bigContainerWidth =  rotateDom.clientWidth;
    const bigContainerHeight = rotateDom.clientHeight;
    rotateDom.style.width = `${bigContainerHeight}px`;
    rotateDom.style.height = `${bigContainerWidth}px`;
    tableInstance.rotate90WithTransform(rotateDom);
    rotateButton.style.display = 'none';
    cancelRotateButton.style.display = 'block';
  });
  // Cancel rotation button click event
  cancelRotateButton.addEventListener('click', () => {
    const bigContainerWidth =  rotateDom.clientWidth;
    const bigContainerHeight = rotateDom.clientHeight;
    rotateDom.style.width = `${bigContainerHeight}px`;
    rotateDom.style.height = `${bigContainerWidth}px`;
    tableInstance.cancelTransform(rotateDom);
    rotateButton.style.display = 'block';
    cancelRotateButton.style.display = 'none';
  });

  function createButton( text,container,isHide = false) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.style.position = 'absolute';
    button.style.top = '0px';
    button.style.zIndex = '1000';
    button.style.backgroundColor = '#000';
    button.style.color = '#fff';
    button.style.padding = '5px 10px';
    button.style.borderRadius = '5px';
    button.style.display = isHide ? 'none' : 'block';
    container.appendChild(button);
    return button;
  }
```



