---
категория: примеры
группа: компонент
заголовок: Подсказка компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-по умолчанию.png
порядок: 1-1
ссылка: таблица_type/список_таблица/список_таблица_define_and_generate
опция: списоктаблица#Подсказка
---

# Подсказка компонент

Вы можете directly use `Подсказка` к configure the меню компонент, и the configuration is consistent с option.Подсказка.

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
    <ReactVтаблица.Подсказка renderMode={'html'} isShowOverflowTextПодсказка={true} />
  </ReactVтаблица.списоктаблица>
);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```
