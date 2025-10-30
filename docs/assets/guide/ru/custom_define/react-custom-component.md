# React-Vтаблица пользовательский компонентs

## пользовательский cell компонентs

к help react developers quickly implement пользовательский cell content, React-Vтаблица provides the ability к encapsulate компонентs и use them в cells.

### компонент usвозраст

*к use пользовательский cell компонент, need к use react 18 version*

пользовательский cell компонентs are encapsulated based на [пользовательский макет](../пользовательский_define/пользовательский_макет), и their usвозраст is similar к пользовательский макет. к use компонентs в `списокColumn`, пользовательский компонентs need к pass в the `role` attribute к identify the компонент as a пользовательский cell компонент; the `пользовательский-макет` компонент will take effect в the таблица content part, и the `header-пользовательский-макет` компонент will take effect в the таблица header part. There can be в most one `пользовательский-макет` компонент в каждый column, и в most one `header-пользовательский-макет` компонент.

```tsx
  <списоктаблица records={records}>
    <списокColumn поле={'bloggerимя'} title={'bloggerимя'} ширина={330} disableHover={true}>
      <пользовательскиймакеткомпонент role={'пользовательский-макет'} информация={bodyInfo}/>
      <Headerпользовательскиймакеткомпонент role={'header-пользовательский-макет'} информация={headerInfo}/>
    </списокColumn>
    // ......
  </списоктаблица>
```

### компонент encapsulation

#### по умолчанию свойства

в the компонент, в addition к user-defined свойства, like пользовательский макетs, react-vтаблица also provides некоторые по умолчанию свойства для компонентs к use

```tsx
интерфейс пользовательскиймакетProps {
  таблица: списоктаблица; // 表格实例
  row: число; // 行号
  col: число; // 列号
  значение: поледанные; // 单元格展示数据
  данныеValue: поледанные; // 单元格原始数据
  rect?: RectProps; // 单元格布局信息
}
const пользовательскиймакеткомпонент = (props: пользовательскиймакетProps & UserProps) => {
  const { таблица, row, col, rect, текст } = props;
  // ......
}
```

#### Label

The label returned по the компонент must be based на the element label provided по react-vтаблица (HTML tags или DOM react компонентs cannot be used directly. If you need к use them, please refer к the следующий section)

```tsx
import { Group, текст } от '@visactor/react-vтаблица';

const пользовательскиймакеткомпонент = (props: пользовательскиймакетFunctionArg & { текст: строка }) => {
  const { таблица, row, col, rect, текст } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const [навести, setHover] = useState(false);

  const поледанные = [
    {
      значение: 'a',
      label: 'a'
    },
    {
      значение: 'b',
      label: 'b'
    }
  ];

  const groupRef = useRef(null);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'центр',
        alignContent: 'центр'
      }}
      ref={groupRef}
    >
      {поледанные.map(item => {
        возврат (
          <текст
            key={item.значение}
            attribute={{
              текст: `${текст}-${row}`,
              fill: навести ? 'red' : '#000'
            }}
            onMouseEnter={(событие: любой) => {
              // eslint-отключить-следующий-line no-console, no-undef
              console.log('groupRef', groupRef.текущий);
              setHover(true);
              событие.currentTarget.stвозраст.renderNextFrame();
            }}
            onMouseLeave={(событие: любой) => {
              setHover(false);
              событие.currentTarget.stвозраст.renderNextFrame();
            }}
          />
        );
      })}
      {навести && (
        <текст
          attribute={{
            текст: 'навести',
            fill: 'blue',
          }}
        />
      )}
    </Group>
  );
};
```

### базовый graphic компонент

базовый graphics:

* текст
* Rect
* Imвозраст
* Line
* ​​Arc
* Circle
* Group

для specific configuration свойства, please refer к [`VRender element configuration`](https://visactor.io/vrender/option/Group), и для specific usвозраст и макет, please refer к [пользовательский макет](../пользовательский_define/пользовательский_макет), [reference пример](../../демонстрация-react/компонент/cell-пользовательский-макет-dom).

<div style="display: flex; justify-content: центр;">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-cell-макет-jsx.png" style="flex: 0 0 50%; заполнение: 10px;">
</div>

### React-Vтаблица компонент

в order к facilitate users к quickly implement пользовательскийized cell content, React-Vтаблица provides некоторые commonly used компонентs в таблица scenarios:

#### Tag

```javascript liveдемонстрация template=vтаблица-react
const { useCallback, useRef, useState } = React;
const { списоктаблица, списокColumn, Group, Tag } = ReactVтаблица;

функция Cell(props) {
  const { таблица, row, col, rect, текст } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByRowCol(col, row);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'центр',
        alignContent: 'центр',
        justifyContent: 'space-around'
      }}
    >
      <Tag 
        textStyle={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)'
        }}
        заполнение={[8, 10]}
        panelStyle={{
          видимый: true,
          fill: '#e6fffb',
          lineширина: 1,
          cornerRadius: 4
        }}
      >tag-1</Tag>
      <Tag 
        textStyle={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 141, 38)'
        }}
        заполнение={[8, 10]}
        panelStyle={{
          видимый: true,
          fill: '#e6fffb',
          lineширина: 1,
          cornerRadius: 4
        }}
      >tag-2</Tag>
    </Group>
  );
}

функция App() {
  const видимый = useRef(false);
  const таблицаInstance = useRef(null);

  возврат (
    <списоктаблица
      ref={таблицаInstance}
      records={[{имя: 1}]}
    >
      <списокColumn поле={'имя'} title={'Tag компонент'} ширина={200}>
        <Cell role={'пользовательский-макет'}/>
      </списокColumn>
    </списоктаблица>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// Релиз react instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```

апи

| Property | тип | Description |
| --- | --- | --- |
| текст | строка | текст content |
| textStyle | [TextStyleOption](https://visactor.io/vrender/option/текст#attribute) | текст style |
| panelStyle | [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute) | Label фон style |
| заполнение | число \| число[] | заполнение |
| minширина | число | Maximum ширина из label |
| maxширина | число | Minimum ширина из label |

#### переключатель

```javascript liveдемонстрация template=vтаблица-react
const { useCallback, useRef, useState, useEffect } = React;
const { списоктаблица, списокColumn, Group, переключатель } = ReactVтаблица;

функция Cell(props) {
  const { таблица, row, col, rect, текст } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByRowCol(col, row);

  const [checkedIndex, setCheckedIndex] = useState(0);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'центр',
        alignContent: 'центр',
        justifyContent: 'space-around'
      }}
    >
      <переключатель 
        textStyle={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)'
        }}
        checked={checkedIndex === 0}
        onChange={(checked) => {
          if (checked) {
            setCheckedIndex(0);
          }
        }}
      >переключатель-1</переключатель>
      <переключатель 
        textStyle={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)'
        }}
        checked={checkedIndex === 1}
        onChange={(checked) => {
          if (checked) {
            setCheckedIndex(1);
          }
        }}
      >переключатель-2</переключатель>
      <переключатель 
        textStyle={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)'
        }}
        interactive={false}
        checked={checkedIndex === 2}
        onChange={(checked) => {
          if (checked) {
            setCheckedIndex(2);
          }
        }}
      >переключатель-3</переключатель>
      <переключатель 
        текст={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)'
        }}
        отключен={true}
        checked={checkedIndex === 3}
        onChange={(checked) => {
          if (checked) {
            setCheckedIndex(3);
          }
        }}
      >переключатель-4</переключатель>
    </Group>
  );
}

функция App() {
  const видимый = useRef(false);
  const таблицаInstance = useRef(null);

  возврат (
    <списоктаблица
      ref={таблицаInstance}
      records={[{имя: 1}]}
      выбрать={{disableSelect: true}}
    >
      <списокColumn поле={'имя'} title={'переключатель компонент'} ширина={330}>
        <Cell role={'пользовательский-макет'}/>
      </списокColumn>
    </списоктаблица>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// Релиз react instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```

апи

| Property | тип | Description |
| --- | --- | --- |
| текст | строка | текст content |
| textStyle | [TextStyleOption](https://visactor.io/vrender/option/текст#attribute) & {disableFill?: строка} | текст style |
| circleStyle | [ArcStyleOption](https://visactor.io/vrender/option/Arc#attribute) & {disableFill?: строка;checkedFill?: строка;checkedStrхорошоe?: строка;disableCheckedFill?: строка;disableCheckedStrхорошоe?: строка;} | Circular check иконка style |
| interactive | логический | Interactive |
| отключен | логический | отключить переключатель Кнопка |
| checked | логический | Checked |
| cursor | Cursor | cursor style |
| disableCursor | Cursor | отключить cursor style |
| spaceBetweenTextAndиконка | число | иконка текст spacing |
| onChange | (checked: логический) => void | Checked state change обратный вызов |

#### флажок

```javascript liveдемонстрация template=vтаблица-react
const { useCallback, useRef, useState, useEffect } = React;
const { списоктаблица, списокColumn, Group, флажок } = ReactVтаблица;

функция Cell(props) {
  const { таблица, row, col, rect, текст } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByRowCol(col, row);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'центр',
        alignContent: 'центр',
        justifyContent: 'space-around'
      }}
    >
      <флажок 
        textStyle={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)'
        }}
      >флажок-1</флажок>
      <флажок 
        textStyle={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)'
        }}
      >флажок-2</флажок>
    </Group>
  );
}

функция App() {
  const видимый = useRef(false);
  const таблицаInstance = useRef(null);

  возврат (
    <списоктаблица
      ref={таблицаInstance}
      records={[{имя: 1}]}
      выбрать={{disableSelect: true}}
    >
      <списокColumn поле={'имя'} title={'переключатель компонент'} ширина={330}>
        <Cell role={'пользовательский-макет'}/>
      </списокColumn>
    </списоктаблица>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// Релиз react instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```

апи

| Attributes | тип | Description | --- | --- | --- | | текст | строка | текст content | | textStyle | [TextStyleOption](https://visactor.io/vrender/option/текст#attribute ) & {disableFill?: строка} | текст style | | boxStyle | [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute) & {disableFill?: строка;checkedFill?: строка;checkedStrхорошоe?: строка;disableCheckedFill?: строка;disableCheckedStrхорошоe?: строка;} | Check иконка style | | иконкаStyle | [ImвозрастStyleOption](https://visactor.io/vrender/option/Imвозраст#attribute) & {{checkиконкаImвозраст?: строка \| HTMLImвозрастElement \| HTMLCanvasElement;indeterminateиконкаImвозраст?: строка \| HTMLImвозрастElement \| HTMLCanvasElement;}} | Check иконка фон style|
| interactive | логический | Is it interactive?|
| отключен | логический | Is the переключатель Кнопка отключен?|
| checked | логический | Is it checked?|
| indeterminate | логический | Is the indeterminate state displayed? |
| cursor | Cursor | cursor style|
| disableCursor | Cursor | Cursor style when отключен|
| spaceBetweenTextAndиконка | число | иконка текст spacing|
| onChange | (checked: логический) => void | Selected state change обратный вызов |

#### Кнопка

```javascript liveдемонстрация template=vтаблица-react
const { useCallback, useRef, useState, useEffect } = React;
const { списоктаблица, списокColumn, Group, Кнопка } = ReactVтаблица;

функция Cell(props) {
  const { таблица, row, col, rect, текст } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByRowCol(col, row);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'центр',
        alignContent: 'центр',
        justifyContent: 'space-around'
      }}
    >
      <Кнопка>Кнопка-1</Кнопка>
      <Кнопка отключен={true}>Кнопка-2</Кнопка>
    </Group>
  );
}

функция App() {
  const видимый = useRef(false);
  const таблицаInstance = useRef(null);

  возврат (
    <списоктаблица
      ref={таблицаInstance}
      records={[{имя: 1}]}
      выбрать={{disableSelect: true}}
    >
      <списокColumn поле={'имя'} title={'переключатель компонент'} ширина={330}>
        <Cell role={'пользовательский-макет'}/>
      </списокColumn>
    </списоктаблица>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// Релиз react instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```

апи

| Property | тип | Description |
| --- | --- | --- |
| textStyle | [TextStyleOption](https://visactor.io/vrender/option/текст#attribute) | текст style |
| panelStyle | [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute) | фон style |
| заполнение | число \| число[] | заполнение |
| отключен | логический | отключен |
| cursor | Cursor | cursor style |
| minширина | число | Minimum Кнопка ширина |
| maxширина | число | Maximum Кнопка ширина |
| onНажать | (событие: Mouseсобытие) => void | Нажать событие обратный вызов |
| state | {textStyle?: {навести?: [TextStyleOption](https://visactor.io/vrender/option/текст#attribute); отключен?: [TextStyleOption](https://visactor.io/vrender/option/текст#attribute);};panelStyle?: {навести?: [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute);отключен?: [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute);};} | State Style |

#### Link

```javascript liveдемонстрация template=vтаблица-react
const { useCallback, useRef, useState, useEffect } = React;
const { списоктаблица, списокColumn, Group, Link } = ReactVтаблица;

функция Cell(props) {
  const { таблица, row, col, rect, текст } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByRowCol(col, row);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'центр',
        alignContent: 'центр',
        justifyContent: 'space-around'
      }}
    >
      <Link href="#">link-1</Link>
      <Link href="#" отключен={true}>link-2</Link>
      <Link href="#" иконка>link-3</Link>
    </Group>
  );
}

функция App() {
  const видимый = useRef(false);
  const таблицаInstance = useRef(null);

  возврат (
    <списоктаблица
      ref={таблицаInstance}
      records={[{имя: 1}]}
      выбрать={{disableSelect: true}}
    >
      <списокColumn поле={'имя'} title={'переключатель компонент'} ширина={330}>
        <Cell role={'пользовательский-макет'}/>
      </списокColumn>
    </списоктаблица>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// Релиз react instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```

апи

| Property | тип | Description |
| --- | --- | --- |
| textStyle | [TextStyleOption](https://visactor.io/vrender/option/текст#attribute) | текст style |
| panelStyle | [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute) | фон style |
| отключен | логический | отключен |
| cursor | Cursor | cursor style |
| minширина | число | Minimum link ширина |
| maxширина | число | Maximum link ширина |
| onНажать | (событие: Mouseсобытие) => void | Нажать событие обратный вызов |
| state | {textStyle?: {навести?: [TextStyleOption](https://visactor.io/vrender/option/текст#attribute); отключен?: [TextStyleOption](https://visactor.io/vrender/option/текст#attribute);};panelStyle?: {навести?: [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute);отключен?: [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute);};} | Status style |
| иконка | логический | Whether к display the лево иконка |
| space | число | Spacing between иконка и текст |
| href | строка | Link address |

#### Avatar

```javascript liveдемонстрация template=vтаблица-react
const { useCallback, useRef, useState, useEffect } = React;
const { списоктаблица, списокColumn, Group, Avatar, Imвозраст } = ReactVтаблица;

функция Cell(props) {
  const { таблица, row, col, rect, текст } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByRowCol(col, row);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'центр',
        alignContent: 'центр',
        justifyContent: 'space-around'
      }}
    >
      <Avatar>A-1</Avatar>
      <Avatar shape={'square'}>A-2</Avatar>
      <Avatar>
        <Imвозраст
          attribute={{
            imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
          }}
        />
      </Avatar>
    </Group>
  );
}

функция App() {
  const видимый = useRef(false);
  const таблицаInstance = useRef(null);

  возврат (
    <списоктаблица
      ref={таблицаInstance}
      records={[{имя: 1}]}
      выбрать={{disableSelect: true}}
    >
      <списокColumn поле={'имя'} title={'переключатель компонент'} ширина={330}>
        <Cell role={'пользовательский-макет'}/>
      </списокColumn>
    </списоктаблица>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// Релиз react instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```

апи

| Property | тип | Description |
| --- | --- | --- |
| textStyle | [TextStyleOption](https://visactor.io/vrender/option/текст#attribute) | текст style |
| panelStyle | [RectStyleOption](https://visactor.io/vrender/option/Rect#attribute) | фон style |
| размер | число | размер |
| shape | 'circle' \| 'square' | Shape |
| автоFixFontSize | логический | Whether к автоmatically adjust the шрифт размер |
| onНажать | (событие: Mouseсобытие) => void | Нажать событие обратный вызов |

#### Popover

```javascript liveдемонстрация template=vтаблица-react
const { useCallback, useRef, useState, useEffect } = React;
const { списоктаблица, списокColumn, Group, Avatar, Popover } = ReactVтаблица;

функция Cell(props) {
  const { таблица, row, col, rect, текст } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByRowCol(col, row);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'центр',
        alignContent: 'центр',
        justifyContent: 'space-around'
      }}
    >
      <Popover
        content={
          <span>
            <p>Here is the текст content</p>
          </span>
        }
        позиция={'низ'}
      >
        <Avatar>A-1</Avatar>
      </Popover>
    </Group>
  );
}

функция App() {
  const видимый = useRef(false);
  const таблицаInstance = useRef(null);

  возврат (
    <списоктаблица
      ref={таблицаInstance}
      records={[{имя: 1}]}
      выбрать={{disableSelect: true}}
      ReactDOM={ReactDom}
    >
      <списокColumn поле={'имя'} title={'переключатель компонент'} ширина={330}>
        <Cell role={'пользовательский-макет'}/>
      </списокColumn>
    </списоктаблица>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// Релиз react instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```

It should be noted that the `Popover` компонент uses the DOM solution, и `ReactDom` needs к be passed в the `ReactDOM` attribute, otherwise it cannot be rendered normally; the `ReactNode` тип received по the `content` attribute needs к be a DOM tag или компонент, otherwise it cannot be rendered normally.

апи

| Property | тип | Description |
| --- | --- | --- |
| defaultPopupVisible | логический | Whether к display the bubble card по по умолчанию |
| popupVisible | логический | Whether к display the bubble card |
| позиция | 'верх' \| 'tl' \| 'tr' \| 'низ' \| 'bl' \| 'br' \| 'лево' \| 'lt' \| 'lb' \| 'право' \| 'rt' \| 'rb' | Bubble card позиция |
| content | ReactNode | Bubble card content (DOM tag или компонент) |

The React-Vтаблица компонент library is being continuously enriched. Developers are welcome к encapsulate новый компонентs during use и build a компонент library ecosystem together.

#### Use DOM react компонентs

If you need к use DOM react компонентs в компонентs, Вы можете specify the `react` attribute в the `attribute` property из the element компонент и pass the react компонент as the `element` property:

```tsx
<Group
  attribute={{
    // ......
    react: {
      pointerсобытиеs: true,
      container: таблица.bodyDomContainer, // таблица.headerDomContainer
      anchorType: 'низ-право',
      element: <CardInfo record={record} навести={навести} row={row} />
    }
  }}
  onMouseEnter={(событие) => {
    setHover(true);
    событие.currentTarget.stвозраст.renderNextFrame();
  }}
  onMouseLeave={(событие) => {
    setHover(false);
    событие.currentTarget.stвозраст.renderNextFrame();
  }}
>
// ...
</Group>
```

<div style="display: flex; justify-content: центр;">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-vтаблица-dom-компонент.gif" style="flex: 0 0 50%; заполнение: 10px;">
</div>

Следующий свойства are also supported в react:
* `pointerсобытиеs` whether к respond к mouse событиеs
* `penetrateсобытиесписок` Mouse событие penetration список, used к specify which mouse событиеs need к be penetrated к the Vтаблица (currently only supports `wheel`)
* `container` Container, used к limit the компонент display area в the таблица when scrolling. If you need к limit the компонент display в the таблица content area, you need к specify it as `таблица.bodyDomContainer`; if you need к limit the компонент display в the таблица header area, you need к specify it as `таблица.headerDomContainer`; if it is a pop-up window или меню компонент, you do не need к configure this property
* `anchorType` Anchor тип, used к specify the anchor позиция из the upper лево corner из the компонент relative к the cell
  * 'верх'
  * 'низ'
  * 'лево'
  * 'право'
  * 'верх-право'
  * 'верх-лево'
  * 'низ-право'
  * 'низ-лево'
  * 'центр'

We recommend that users use the meta tags provided по react-vтаблица для the content displayed в the cell. для pop-ups, менюs и other компонентs triggered в the cell, Вы можете use DOM react компонентs. This is the best Производительность solution. [Reference пример](../../демонстрация-react/компонент/cell-пользовательский-компонент).

If you need к display content в a cell, use DOM react компонентs. You need к specify `react.container` according к the restrictions на компонентs displayed в the таблица content area. It should be noted that this method requires frequent updates из компонент-related DOM, which will have a certain impact на Производительность. Вы можете refer к [пользовательский макет](../пользовательский_define/пользовательский_макет). We strongly recommend that the content компонентs в the cell use the meta tags provided по react-vтаблица, which is the best solution для Производительность.

## пользовательский external компонентs

в order к facilitate the overlay из external компонентs на the React-Vтаблица компонент, React-Vтаблица provides the `пользовательскийкомпонент` tool компонент, which allows you к quickly locate external компонентs в the таблица, и can be used к quickly implement functional компонентs such as pop-ups и менюs.

```jsx
<списоктаблица option={option} onMouseEnterCell={updatePos} onMouseLeaveтаблица={скрыть} onReady={ready}>
  <пользовательскийкомпонент ширина="50%" высота="100%" displayMode="cell" col={col} row={row} anchor="низ-право" dx="-50%">
    <Userкомпонент значение={значение} />
  </пользовательскийкомпонент>
</списоктаблица>
```

Among them, `пользовательскийкомпонент` is used as a container к позиция в the таблица и автоmatically match the размер (based на the anchored cell). There are two specific ways к use it:

1. Absolute positioning

для absolute positioning, you need к specify `displayMode` as `позиция`, и you need к specify `x` и `y` attributes к позиция the container к the specified pixel позиция в the таблица (based на the upper лево corner). The `ширина` и `высота` attributes specify the pixel размер из the container.

2. Relative positioning

для relative positioning, you need к specify `displayMode` as `cell`, the container is positioned relative к the cell, the `col` и `row` attributes are used к specify the anchored cell coordinates, the `anchor` attribute specifies the anchor позиция из the container relative к the cell, the `dx` и `dy` attributes specify the offset из the container relative к the anchored cell, и the `ширина` и `высота` attributes specify the размер из the container. The `dx` `dy` `ширина` и `высота` attributes все support units из pixels или percentвозрастs. When the percentвозраст is calculated relative к the размер из the cell.

### апи

```ts
интерфейс пользовательскийкомпонентProps {
   children: React.ReactNode;
   displayMode: 'позиция' | 'cell'; // Positioning mode
   col?: число; // Anchored column coordinates
   row?: число; // Anchored row coordinates
   anchor?:
   | 'верх-лево'
   | 'верх-центр'
   | 'верх-право'
   | 'середина-лево'
   | 'середина-центр'
   | 'середина-право'
   | 'низ-лево'
   | 'низ-центр'
   | 'низ-право'; // Anchored позиция
   dx?: число | строка; // x-direction offset
   dy?: число | строка; // y-direction offset
   ширина?: число | строка; // container ширина
   высота?: число | строка; // container высота
}
```

пользовательский external компонент демонстрация: [пользовательский компонент демонстрация](../../демонстрация-react/компонент/пользовательский-компонент)