---
категория: примеры
группа: functional-компонентs
заголовок: Use arco-design выбрать компонент в cell editor
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/arco-выбрать-editor.png
ссылка: edit/edit_cell
---

# Use arco-design выбрать компонент в cell editor

Create a пользовательский editor class, ArcoсписокEditor, и implement the onStart method, create an arco-design выбрать компонент, и mount the компонент into the editor container. Refine the isEditorElement и onEnd методы.

reference:

https://visactor.io/vтаблица/guide/edit/edit_cell

https://arco.design/react/компонентs/выбрать

## код демонстрация

```javascript liveдемонстрация template=vтаблица-react
// import * as ReactVтаблица от '@visactor/react-vтаблица';
class ArcoсписокEditor {
  constructor() {
    this.root = null;
    this.element = null;
    this.container = null;
  }
  onStart(editorContext) {
    const { container, referencePosition, значение } = editorContext;
    this.container = container;
    this.createElement(значение);
    значение && this.setValue(значение);
    (null == referencePosition ? void 0 : referencePosition.rect) && this.adjustPosition(referencePosition.rect);
  }

  createElement(defaultValue) {
    const div = document.createElement('div');
    div.style.позиция = 'absolute';
    div.style.ширина = '100%';
    div.style.заполнение = '1px';
    div.style.boxSizing = 'граница-box';
    div.style.backgroundColor = '#232324';
    this.container.appendChild(div);
    this.root = ReactDom.createRoot(div);
    const options = ['Beijing', 'Shanghai', 'Guangzhou'];
    this.root.render(
      <div>
        <Arкодsign.выбрать
          placeholder="выбрать Город"
          defaultValue={defaultValue}
          onChange={значение => {
            this.currentValue = значение;
          }}
        >
          {options.map((option, index) => (
            <Arкодsign.выбрать.Option key={option} значение={option} classимя="arco-выбрать-vтаблица">
              {option}
            </Arкодsign.выбрать.Option>
          ))}
        </Arкодsign.выбрать>
      </div>
    );
    this.element = div;
  }

  getValue() {
    возврат this.currentValue;
  }

  setValue(значение) {
    this.currentValue = значение;
  }

  adjustPosition(rect) {
    if (this.element) {
      (this.element.style.верх = rect.верх + 'px'),
        (this.element.style.лево = rect.лево + 'px'),
        (this.element.style.ширина = rect.ширина + 'px'),
        (this.element.style.высота = rect.высота + 'px');
    }
  }

  onEnd() {
    this.container.removeChild(this.element);
  }

  isEditorElement(target) {
    // cascader创建时时在cavas后追加一个dom，而popup append在body尾部。不论popup还是dom，都应该被认为是点击到了editor区域
    возврат this.element.contains(target) || this.isНажатьPopUp(target);
  }

  isНажатьPopUp(target) {
    while (target) {
      if (target.classсписок && target.classсписок.contains('arco-выбрать-vтаблица')) {
        возврат true;
      }
      // 如果到达了DOM树的顶部，则停止搜索
      target = target.parentNode;
    }
    // 如果遍历结束也没有找到符合条件的父元素，则返回false
    возврат false;
  }
}

const editor = новый ArcoсписокEditor();
Vтаблица.регистрация.editor('список-editor', editor);
const option = {
  defaultRowвысота: 34,
  columns: [
    {
      поле: '0',
      заголовок: 'имя'
    },
    {
      поле: '1',
      заголовок: 'возраст'
    },
    {
      поле: '2',
      заголовок: 'пол'
    },
    {
      поле: '3',
      заголовок: 'хобби'
    },
    {
      поле: '4',
      заголовок: 'Город',
      ширина: 150,
      editor: 'список-editor'
    }
  ],
  records: новый массив(1000).fill().map(() => ['Join', 18, 'male', '🏀', 'Shanghai'])
};

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<ReactVтаблица.списоктаблица option={option} высота={'500px'} />);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```
