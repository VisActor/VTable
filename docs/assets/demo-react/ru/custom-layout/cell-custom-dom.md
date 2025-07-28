---
категория: примеры
группа: компонент
заголовок: cell пользовательский dom компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-vтаблица-cell-dom-компонент.jpeg
порядок: 1-1
ссылка: '../../guide/пользовательский_define/react-пользовательский-компонент'
---

# cell пользовательский dom компонент

Use Arкодsign в cells. для details, please refer к [пользовательский компонентs](../../guide/пользовательский_define/react-пользовательский-компонент)

## код демонстрация

```javascript liveдемонстрация template=vтаблица-react
// import * as ReactVтаблица от '@visactor/react-vтаблица';

const { useCallback, useRef, useState } = React;
const { списоктаблица, списокColumn, Group } = ReactVтаблица;
const { 
  Avatar,
  Comment,
  Card,
  Popover,
  Space,
  Кнопка,
  Подтверждение,
  Messвозраст,
  уведомление
 } = Arкодsign;
const { иконкаHeart, иконкаMessвозраст, иконкаStar, иконкаStarFill, иконкаHeartFill } = Arкодsignиконка;

const Commentкомпонент = (props) => {
  const { таблица, row, col, rect, данныеValue } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByCell(col, row);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        react: {
          pointerсобытиеs: true,
          penetrateсобытиесписок: ['wheel'],
          container: таблица.bodyDomContainer, // таблица.headerDomContainer
          // anchorType: 'низ-право',
          element: <CommentReactкомпонент имя={данныеValue} />
        }
      }}
    ></Group>
  );
};

const CommentReactкомпонент = (props) => {
  const { имя } = props;
  const [like, setLike] = useState();
  const [star, setStar] = useState();
  const actions = [
    <Кнопка classимя="пользовательский-comment-action" key="heart" onНажать={() => setLike(!like)}>
      {like ? <иконкаHeartFill style={{ цвет: '#f53f3f' }} /> : <иконкаHeart />}
      {83 + (like ? 1 : 0)}
    </Кнопка>,
    <Кнопка classимя="пользовательский-comment-action" key="star" onНажать={() => setStar(!star)}>
      {star ? <иконкаStarFill style={{ цвет: '#ffb400' }} /> : <иконкаStar />}
      {3 + (star ? 1 : 0)}
    </Кнопка>,
    <Кнопка classимя="пользовательский-comment-action" key="reply">
      <иконкаMessвозраст /> Reply
    </Кнопка>
  ];
  возврат (
    <Comment
      actions={actions}
      author={имя}
      avatar={
        <Popover
          title={имя}
          content={
            <span>
              <p>Here is the description из this user.</p>
            </span>
          }
        >
          <Avatar>{имя.slice(0, 1)}</Avatar>
        </Popover>
      }
      content={<div>Comment body content.</div>}
      datetime="1 hour"
      style={{ marginTop: 10, marginLeft: 10 }}
    />
  );
};

const Operationкомпонент = (props) => {
  const { таблица, row, col, rect, данныеValue } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByCell(col, row);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        react: {
          pointerсобытиеs: true,
          penetrateсобытиесписок: ['wheel'],
          container: таблица.bodyDomContainer, // таблица.headerDomContainer
          // anchorType: 'низ-право',
          element: <OperationReactкомпонент />
        }
      }}
    ></Group>
  );
};

const OperationReactкомпонент = () => {
  возврат (
    <Space размер="small" style={{ marginLeft: 10, marginTop: 40 }}>
      <Кнопка
        onНажать={() =>
          уведомление.информация({
            заголовок: 'Normal',
            content: 'Этоn ошибка уведомление!'
          })
        }
        тип="primary"
      >
        информация
      </Кнопка>
      <Подтверждение
        focusLock
        title="Confirm"
        content="Are you sure you want к delete?"
        onхорошо={() => {
          Messвозраст.информация({
            content: 'хорошо'
          });
        }}
        onотмена={() => {
          Messвозраст.ошибка({
            content: 'отмена'
          });
        }}
      >
        <Кнопка>Delete</Кнопка>
      </Подтверждение>
    </Space>
  );
};

функция generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  для (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  возврат result;
}

функция App() {
  const records = [];
  для (let i = 0; i < 50; i++) {
    records.push({
      id: i,
      имя: generateRandomString(8)
    });
  }

  возврат (
    <списоктаблица
      records={records}
      высота={900}
      defaultRowвысота={110}
      onReady={таблица => {
        // eslint-отключить-следующий-line no-undef
        // (window as любой).таблицаInstance = таблица;
      }}
      ReactDOM={ReactDom}
    >
      <списокColumn поле={'id'} title={'ID'} />
      <списокColumn поле={'имя'} title={'Comment'} ширина={300}>
        <Commentкомпонент role={'пользовательский-макет'} />
      </списокColumn>
      <списокColumn поле={''} title={'Operation'} ширина={160}>
        <Operationкомпонент role={'пользовательский-макет'} />
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
