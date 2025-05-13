# 表格旋转插件

## 功能介绍

表格旋转插件可以实现表格的旋转，支持90度(顺时针)。其他角度旋转请自行扩展。

## 插件说明

该插件会向table实例添加rotate90WithTransform和cancelTransform方法。

- rotate90WithTransform：旋转90度
- cancelTransform：取消旋转

**一般情况下插件不需要将api绑定到table实例上，可以插件自身拥有api，然后由业务方直接调用。如：rotatePlugin.rotate90WithTransform( )**

请按照下面示例过程使用：
1. 确保选择对象是表格的上层容器，且表格的容器是全屏的。选择对象可以是覆盖整屏的div或者body。
2. 在调用rotate90WithTransform接口前，将容器的宽高调整好。
3. 调用rotate90WithTransform接口后，表格会旋转90度。
4. 调用cancelTransform接口后，表格会恢复到原来的状态。

## 使用示例


```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
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
  // 旋转的目标容器 目前仅支持全屏内容整体进行旋转，可以是覆盖整屏的div或者body
  const rotateDom = document.body;
  //向body上添加两个按钮 一个是旋转按钮 一个是取消旋转按钮。选中按钮和取消旋转按钮只能有一个显示 
  const rotateButton = createButton('旋转',dom);
  const cancelRotateButton = createButton('取消旋转', dom,true);
  // 旋转按钮点击事件
  rotateButton.addEventListener('click', () => {
    const bigContainerWidth =  rotateDom.clientWidth;
    const bigContainerHeight = rotateDom.clientHeight;
    rotateDom.style.width = `${bigContainerHeight}px`;
    rotateDom.style.height = `${bigContainerWidth}px`;
    tableInstance.rotate90WithTransform(rotateDom);
    rotateButton.style.display = 'none';
    cancelRotateButton.style.display = 'block';
  });
  // 取消旋转按钮点击事件
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



