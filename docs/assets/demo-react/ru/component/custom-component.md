---
category: examples
group: component
title: Пользовательский Компонент
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-component.png
order: 1-1
link: Developer_Ecology/react
---

# Пользовательский Компонент

Компонент `CustomComponent` облегчает наложение внешних компонентов на компоненты React-VTable.

## Пример Кода

```javascript livedemo template=VTable-react
// import * as ReactVTable от '@visactor/react-VTable';

const { useCallback, useRef, useState } = React;
const { ListTable, CustomComponent } = ReactVTable;
const { Popconfirm, сообщение, кнопка } = ArcoDesign;

функция подсказка(props) {
  возврат (
    <div style={{ ширина: '100%', высота: '100%', граница: '1px solid #333', backgroundColor: '#ccc', fontSize: 10 }}>
      {`${props.значение}(нажмите, чтобы показать больше)`}
    </div>
  );
}

функция App() {
  const [hoverCol, setHoverCol] = useState(-1);
  const [hoverRow, setHoverRow] = useState(-1);
  const [clickCol, setClickCol] = useState(-1);
  const [clickRow, setClickRow] = useState(-1);
  const [значение, setValue] = useState('');
  const видимый = useRef(false);
  const tableInstance = useRef(null);

  const option = {
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
      }
    ],
    records: новый массив(1000).fill(['John', 18, 'male', '🏀'])
  };

  const updateHoverPos = useCallback(args => {
    if (видимый.текущий) {
      возврат;
    }
    setHoverCol(args.col);
    setHoverRow(args.row);
    const cellValue = tableInstance.текущий.getCellValue(args.col, args.row);
    setValue(cellValue);
  }, []);
  const скрыть = useCallback(() => {
    setHoverCol(-1);
    setHoverRow(-1);
  }, []);

  const updateClickPos = useCallback(args => {
    setClickCol(args.col);
    setClickRow(args.row);
  }, []);

  const ready = (instance, isInitial) => {
    if (isInitial) {
      tableInstance.текущий = instance;
    }
  };

  возврат (
    <ListTable
      option={option}
      onMouseEnterCell={updateHoverPos}
      onMouseLeaveTable={скрыть}
      onClickCell={updateClickPos}
      onReady={ready}
    >
      <CustomComponent
        ширина="80%"
        высота="100%"
        displayMode="cell"
        col={hoverCol}
        row={hoverRow}
        anchor="низ-право"
        dx="-80%"
      >
        <подсказка значение={значение} />
      </CustomComponent>
      <CustomComponent ширина="100%" высота="100%" displayMode="cell" col={clickCol} row={clickRow} anchor="верх-лево">
        <Popconfirm
          focusLock
          title="Подтверждение"
          content="Нажмите компонент!"
          onOk={() => {
            сообщение.информация({
              content: 'хорошо'
            });
            setClickCol(-1);
            setClickRow(-1);
          }}
          onCancel={() => {
            сообщение.ошибка({
              content: 'отмена'
            });
            setClickCol(-1);
            setClickRow(-1);
          }}
          onVisibleChange={popVisible => {
            видимый.текущий = popVisible;
          }}
        >
          <кнопка style={{ ширина: '100%', высота: '100%' }}>Нажать</кнопка>
        </Popconfirm>
      </CustomComponent>
    </ListTable>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// release react instance, do не copy
// освободить экземпляр react, не копировать
window.customRelease = () => {
  root.unmount();
};
```
