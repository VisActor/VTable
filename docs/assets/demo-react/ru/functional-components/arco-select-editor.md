---
категория: примеры
группа: функциональные-компоненты
заголовок: Use arco-design select компонент in cell editor
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/arco-select-editor.png
ссылка: edit/edit_cell
---

# Use arco-design select компонент in cell editor

Create a custom editor class, ArcoListEditor, and implement the onStart method, create an arco-design Select компонент, and mount the компонент into the editor container. Refine the isEditorElement and onEnd methods.

reference:

https://visactor.io/vtable/guide/edit/edit_cell

https://arco.design/react/компонентs/select

## Code Demo

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
    // cascader创建时时在cavas后追加一个dom，而popup append在body尾部。不论popup还是dom，都应该被认为是点击到了editor区域
    return this.element.contains(target) || this.isClickPopUp(target);
  }

  isClickPopUp(target) {
    while (target) {
      if (target.classList && target.classList.contains('arco-select-vtable')) {
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
      title: 'имя'
    },
    {
      field: '1',
      title: 'возраст'
    },
    {
      field: '2',
      title: 'пол'
    },
    {
      field: '3',
      title: 'хобби'
    },
    {
      field: '4',
      title: 'city',
      width: 150,
      editor: 'list-editor'
    }
  ],
  records: new Array(1000).fill().map(() => ['Join', 18, 'мужской', '🏀', 'Shanghai'])
};

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<ReactVTable.ListTable option={option} height={'500px'} />);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
