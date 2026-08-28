---
category: examples
group: functional-components
title: 自定义编辑器中使用arco列表选择器
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/arco-select-editor.png
link: Developer_Ecology/react
---

# 自定义编辑器中使用 arco 列表选择器

创建自定义编辑器类 ArcoListEditor, 并实现 onStart 方法，创建一个 arco-design 的 Select 组件，并将组件挂载到编辑器容器中。完善 isEditorElement 和 onEnd 方法。

参考:

https://visactor.io/vtable/guide/edit/edit_cell

https://arco.design/react/components/select

## 代码演示

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';
const selectEditorPopupClassName = 'vtable-editor-select-popup';

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
    div.style.padding = '1px';
    div.style.boxSizing = 'border-box';
    div.style.backgroundColor = '#232324';
    this.container.appendChild(div);
    this.root = ReactDom.createRoot(div);
    const options = ['Beijing', 'Shanghai', 'Guangzhou'];
    this.root.render(
      <div>
        <ArcoDesign.Select
          placeholder="Select city"
          dropdownMenuClassName={selectEditorPopupClassName}
          defaultValue={defaultValue}
          onChange={value => {
            this.currentValue = value;
          }}
        >
          {options.map((option, index) => (
            <ArcoDesign.Select.Option key={option} value={option} className="arco-select-vtable">
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
    // popup append 在 body 尾部，不在编辑器容器内；点击 popup 时也应该被认为仍在编辑器区域。
    return this.element.contains(target) || this.isClickPopUp(target);
  }

  isClickPopUp(target) {
    while (target) {
      if (
        target.classList &&
        (target.classList.contains(selectEditorPopupClassName) || target.classList.contains('arco-select-vtable'))
      ) {
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
  defaultRowHeight: 34,
  columns: [
    {
      field: '0',
      title: 'name'
    },
    {
      field: '1',
      title: 'age'
    },
    {
      field: '2',
      title: 'gender'
    },
    {
      field: '3',
      title: 'hobby'
    },
    {
      field: '4',
      title: 'city',
      width: 150,
      editor: 'list-editor'
    }
  ],
  records: new Array(1000).fill().map(() => ['Join', 18, 'male', '🏀', 'Shanghai'])
};

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<ReactVTable.ListTable option={option} height={'500px'} />);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
