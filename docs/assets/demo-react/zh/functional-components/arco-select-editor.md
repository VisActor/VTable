---
category: examples
group: functional-components
title: 自定义编辑器中使用arco列表选择器
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
link: '../guide/Developer_Ecology/react'
---

# 自定义编辑器中使用 arco 列表选择器

可以直接使用可以直接使用 VTable 的完整 option，将 option 作为一个 prop 传入表格组件。

## 代码演示

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';
class ArcoListEditor {
  constructor() {
    this.root = null;
    this.element = null;
    this.container = null;
  }
  onStart(editorContext) {
    const { container, referencePosition, value } = editorContext;
    this.container = container;
    this.createElement(value);
    value && this.setValue(value);
    (null == referencePosition ? void 0 : referencePosition.rect) && this.adjustPosition(referencePosition.rect);
  }

  createElement(defaultValue) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.padding = '4px';
    div.style.boxSizing = 'border-box';
    div.style.backgroundColor = '#232324';
    this.container.appendChild(div);
    this.root = ReactDom.createRoot(div);
    const options = ['Beijing', 'Shanghai', 'Guangzhou'];
    this.root.render(
      <div>
        <ArcoDesign.Select
          placeholder="Select city"
          defaultValue={defaultValue}
          onChange={value => {
            this.currentValue = value;
          }}
        >
          {options.map((option, index) => (
            <ArcoDesign.Select.Option key={option} value={option}>
              {option}
            </ArcoDesign.Select.Option>
          ))}
        </ArcoDesign.Select>
      </div>
    );
    this.element = div;
  }

  getValue() {
    return this.currentValue;
  }

  setValue(value) {
    this.currentValue = value;
  }

  adjustPosition(rect) {
    if (this.element) {
      (this.element.style.top = rect.top + 'px'),
        (this.element.style.left = rect.left + 'px'),
        (this.element.style.width = rect.width + 'px'),
        (this.element.style.height = rect.height + 'px');
    }
  }

  onEnd() {
    this.container.removeChild(this.element);
  }

  isEditorElement(target) {
    // cascader创建时时在cavas后追加一个dom，而popup append在body尾部。不论popup还是dom，都应该被认为是点击到了editor区域
    return this.element.contains(target) || this.isClickPopUp(target);
  }

  isClickPopUp(target) {
    while (target) {
      if (target.classList && target.classList.contains('arco-select')) {
        return true;
      }
      // 如果到达了DOM树的顶部，则停止搜索
      target = target.parentNode;
    }
    // 如果遍历结束也没有找到符合条件的父元素，则返回false
    return false;
  }
}

const editor = new ArcoListEditor();
VTable.register.editor('list-editor', editor);
const option = {
  header: [
    {
      field: '0',
      caption: 'name'
    },
    {
      field: '1',
      caption: 'age'
    },
    {
      field: '2',
      caption: 'gender'
    },
    {
      field: '3',
      caption: 'hobby'
    },
    {
      field: '4',
      caption: 'city',
      width: 150,
      editor: 'list-editor'
    }
  ],
  records: new Array(1000).fill().map(() => ['张三', 18, '男', '🏀', 'Shanghai'])
};

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<ReactVTable.ListTable option={option} height={'500px'} />);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
