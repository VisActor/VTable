---
категория: примеры
группа: компонент
заголовок: меню компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-по умолчанию-новый.png
порядок: 1-1
ссылка: таблица_type/список_таблица/список_таблица_define_and_generate
опция: списоктаблица#меню
---

# меню компонент

Вы можете directly use `меню` к configure the меню компонент, и the configuration is consistent с option.меню.

## код демонстрация

```javascript liveдемонстрация template=vтаблица-openinula
// import * as InulaVтаблица от '@visactor/openinula-vтаблица';

const records = новый массив(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVтаблица.списоктаблица
    records={records}
    высота={'500px'}
    onDropdownменюНажать={args => {
      console.log('onDropdownменюНажать', args);
    }}
  >
    <InulaVтаблица.списокColumn поле={'0'} title={'имя'} />
    <InulaVтаблица.списокColumn поле={'1'} title={'возраст'} />
    <InulaVтаблица.списокColumn поле={'2'} title={'пол'} />
    <InulaVтаблица.списокColumn поле={'3'} title={'хобби'} />
    <InulaVтаблица.меню
      renderMode={'html'}
      defaultHeaderменюItems={['header меню 1', 'header меню 2']}
      contextменюItems={['context меню 1', 'context меню 2']}
    />
  </InulaVтаблица.списоктаблица>,
  root
);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  Inula.unmountкомпонентAtNode(root);
};
```
