---
категория: примеры
группа: usвозраст
заголовок: grammatical tag
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-по умолчанию-новый.png
порядок: 1-1
ссылка: Developer_Ecology/openinula
---

# grammatical tag

Use syntax tags к assemble a complete таблица configuration и generate таблицаs в the form из subкомпонентs.

- списокColumn: список column, consistent с the definition из columns в option [апи](../../option/списоктаблица-columns-текст#cellType)

## код демонстрация

```javascript liveдемонстрация template=vтаблица-openinula
// import * as InulaVтаблица от '@visactor/openinula-vтаблица';
const records = новый массив(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVтаблица.списоктаблица records={records} высота={'500px'}>
    <InulaVтаблица.списокColumn поле={'0'} title={'имя'} />
    <InulaVтаблица.списокColumn поле={'1'} title={'возраст'} />
    <InulaVтаблица.списокColumn поле={'2'} title={'пол'} />
    <InulaVтаблица.списокColumn поле={'3'} title={'хобби'} />
  </InulaVтаблица.списоктаблица>,
  root
);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  Inula.unmountкомпонентAtNode(root);
};
```
