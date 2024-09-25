---
title: 31. VTable表格组件实现单元格可编辑后，怎么控制退出编辑的时机？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件实现单元格可编辑后，怎么控制退出编辑的时机？</br>
## 问题描述

结合官网流程图所示，当再编辑状态下点击其他单元格或者按enter键后，VTable处理在接收到事件时，就一定会触发这个onEnd退出编辑状态吗？在我的项目中，有个场景是会在用户触发这两种交互时，不期望退出编辑状态，这个目前有办法吗？</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DKp2bRqkho3kGpxWd7cclU71nP5.gif' alt='' width='1302' height='913'>

## 解决方案 

### 点击不退出编辑

可以使用编写自定义编辑器来控制退出编辑状态的时机。因为VTable逻辑会调用编辑器的`isEditorElement`方法如果返回false则VTable会走退出编辑的逻辑，如果返回true则不退出编辑，所以我们可以利用这个方法来显示不退出的需求。具体教程地址：https://visactor.io/vtable/guide/edit/edit_cell</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/YS3Kb4MmHo8W2txQpLlccdhmnTi.gif' alt='' width='1948' height='1730'>

### 键入enter不退出编辑

这个可以监听编辑dom的keydown事件，直接组织冒泡，不让VTable监听到也就不会退出编辑了</br>
## 示例代码

```
let  tableInstance;
 class MyInputEditor {
  createElement() {
     const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.style.position = 'absolute';
    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    this.element = input;
    this.container.appendChild(input);
    // 监听键盘事件
    input.addEventListener('keydown', (e) => {
        // 阻止冒泡
        e.stopPropagation();
    });
  }
  setValue(value) {
    this.element.value = typeof value !== 'undefined' ? value : '';
  }
  getValue() {
    return this.element.value;
  }
  onStart({ value, referencePosition, container, endEdit }){
    this.container = container;
    this.successCallback = endEdit;
    if (!this.element) {
      this.createElement();

      if (value !== undefined && value !== null) {
        this.setValue(value);
      }
      if (referencePosition?.rect) {
        this.adjustPosition(referencePosition.rect);
      }
    }
    this.element.focus();
  }

  adjustPosition(rect) {
    this.element.style.top = rect.top + 'px';
    this.element.style.left = rect.left + 'px';
    this.element.style.width = rect.width + 'px';
    this.element.style.height = rect.height + 'px';
  }
  onEnd() {
    this.container.removeChild(this.element);
    this.element = undefined;
  }

  isEditorElement(target) {
    // 仅允许点击到表格外部才会结束编辑
    if(target.tagName === 'CANVAS')
      return true;
    return target === this.element;
  }
}

const my_editor = new MyInputEditor();
VTable.register.editor('my_editor', my_editor);

const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      field: 'bloggerName',
      title: 'bloggerName'
    },
    {
      field: 'fansCount',
      title: 'fansCount',
      fieldFormat(rec) {
        return rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      field: 'worksCount',
      title: 'worksCount',
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      field: 'viewCount',
      title: 'viewCount',
      fieldFormat(rec) {
        return rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      field: 'viewCount',
      title: 'viewCount',
      fieldFormat(rec) {
        return rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
  ],
  records: [
    {
      bloggerId: 1,
      bloggerName: 'Virtual Anchor Xiaohua',
     fansCount: 400,
      worksCount: 10,
      viewCount: 5,
      city: 'Dream City',
      tags: ['game', 'anime', 'food']
    },
    {
      bloggerId: 2,
      bloggerName: 'Virtual anchor little wolf',
      fansCount: 800,
      worksCount: 20,
      viewCount: 15,
      city: 'City of Music',
      tags: ['music', 'travel', 'photography']
    },
    {
      bloggerId: 3,
      bloggerName: 'Virtual anchor bunny',
      fansCount: 600,
      worksCount: 15,
      viewCount: 10,
      city: 'City of Art',
      tags: ['painting', 'handmade', 'beauty makeup']
    },
    {
      bloggerId: 4,
      bloggerName: 'Virtual anchor kitten',
      fansCount: 1000,
      worksCount: 30,
      viewCount: 20,
      city: 'Health City',
      tags: ['dance', 'fitness', 'cooking']
    },
    {
      bloggerId: 5,
      bloggerName: 'Virtual anchor Bear',
      fansCount: 1200,
      worksCount: 25,
      viewCount: 18,
      city: 'City of Wisdom',
      tags: ['Movie', 'Literature']
    },
    {
      bloggerId: 6,
      bloggerName: 'Virtual anchor bird',
      fansCount: 900,
      worksCount: 12,
      viewCount: 8,
      city: 'Happy City',
      tags: ['music', 'performance', 'variety']
    }
  ],
  enableLineBreak: true,

  editCellTrigger: 'click',
  editor:'my_editor'
};
tableInstance = new VTable.ListTable(option);
tableInstance.on('change_cell_value', arg => {
  console.log(arg);
});</br>
```


## 相关文档

编辑表格demo：https://visactor.io/vtable/demo/edit/edit-cell</br>
编辑表格教程：https://visactor.io/vtable/guide/edit/edit_cell</br>
相关api：</br>
https://visactor.io/vtable/option/ListTable#editor</br>
https://visactor.io/vtable/option/ListTable-columns-text#editor</br>
github：https://github.com/VisActor/VTable</br>



