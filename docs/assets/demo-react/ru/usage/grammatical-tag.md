---
категория: примеры
группа: usвозраст
заголовок: grammatical tag
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-по умолчанию.png
порядок: 1-1
ссылка: Developer_Ecology/react
---

# grammatical tag

Use syntax tags к assemble a complete таблица configuration и generate таблицаs в the form из subкомпонентs.

- списокColumn: список column, consistent с the definition из columns в option [апи](../../option/списоктаблица-columns-текст#cellType)

## код демонстрация

```javascript liveдемонстрация template=vтаблица-react
// import * as ReactVтаблица от '@visactor/react-vтаблица';
const records = новый массив(1000).fill(['John', 18, 'male', '🏀']);

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVтаблица.списоктаблица records={records} высота={'500px'}>
    <ReactVтаблица.списокColumn поле={'0'} title={'имя'} />
    <ReactVтаблица.списокColumn поле={'1'} title={'возраст'} />
    <ReactVтаблица.списокColumn поле={'2'} title={'пол'} />
    <ReactVтаблица.списокColumn поле={'3'} title={'хобби'} />
  </ReactVтаблица.списоктаблица>
);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```
