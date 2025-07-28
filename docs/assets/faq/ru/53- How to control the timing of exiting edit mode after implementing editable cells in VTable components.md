---
title: 31. How to control the timing of exiting edit mode after implementing editable cells in VTable components?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

How to control the timing of exiting edit mode after implementing editable cells in VTable components?</br>
## Question Description

Referring to the flowchart provided on the official website, if a user clicks another cell or presses the Enter key while in edit mode, will VTable definitely trigger the onEnd event to exit edit mode? In my project, there is a scenario where I do not want the edit mode to be exited when these interactions are triggered. Is there a way to achieve this currently?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PIhobUXZwocx7Ax1u73cFjIun8d.gif' alt='' width='1302' height='913'>

## Solution

### Click without exit edit

You can use a custom editor to control when to exit the edit state. Because the VTable logic calls the editor's `isEditorElement` method, if it returns false, the VTable will follow the exit edit logic; if it returns true, it will not exit the edit mode. Therefore, we can use this method to meet the requirement of not exiting the edit mode. The specific tutorial address is: [https://visactor.io/vtable/guide/edit/edit_cell](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Fedit%2Fedit_cell)</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/NFmkbzUyFoRNiBxUbd5cxIqanHe.gif' alt='' width='1948' height='1730'>

### Type enter without exiting edit

This can listen to the keydown event of editing `dom`, directly organize bubbling, and prevent `VTable` from listening, so it will not exit editing.</br>
## Example code

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


## Related documents

*  Editing form demo: [https://visactor.io/vtable/demo/edit/edit-cell](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Fedit%2Fedit-cell)</br>
*  Editing form tutorial: [https://visactor.io/vtable/guide/edit/edit_cell](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Fedit%2Fedit_cell)</br>
*  Related API: </br>
https://visactor.io/vtable/option/ListTable#editor</br>
https://visactor.io/vtable/option/ListTable-columns-text#editor</br>
github：https://github.com/VisActor/VTable</br>



