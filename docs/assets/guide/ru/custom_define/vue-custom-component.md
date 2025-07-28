# Vue-Vтаблица пользовательский компонент

## пользовательский Cell компонент

к facilitate Vue developers в quickly implementing пользовательский cell content, Vue-Vтаблица provides the capability к encapsulate компонентs и use them within cells.

### компонент Usвозраст

The пользовательский cell компонент is encapsulated based на the [пользовательский макет](../пользовательский_define/пользовательский_макет) и is used similarly к пользовательский макетs. в `списокColumn`, Вы можете use the компонент through the `#пользовательскиймакет` slot и the `<списокColumn>` компонент к пользовательскийize column rendering using templates. The `#пользовательскиймакет` slot returns Следующий parameters:
```tsx
интерфейс пользовательскиймакетProps {
  таблица: списоктаблица; // таблица instance
  row: число; // Row число
  col: число; // Column число
  значение: поледанные; // Cell display данные
  данныеValue: поледанные; // Original cell данные
  rect?: RectProps; // Cell макет information
}
```

The пример код демонстрацияnstrates how к use the `списокColumn` компонент within the `списоктаблица` компонент и пользовательскийize column rendering through the `#пользовательскиймакет` slot. The specific implementation includes using the `Group` компонент к макет cell content.

```tsx
import { списоктаблица, списокColumn } от '@visactor/vue-vтаблица';
import { Group, текст, Imвозраст, переключатель, флажок, Tag } от '@visactor/vue-vтаблица';
import * as Vтаблица от '@visactor/vтаблица';

<списоктаблица>
  <списокColumn :поле="'bloggerимя'" :title="'anchor nickимя'" :ширина="330" :style="{ fontFamily: 'Arial', fontWeight: 500 }">

    <template #пользовательскиймакет="{ таблица, row, col, rect, record, высота, ширина }">

      <Group :высота="высота" :ширина="ширина" display="flex" flexDirection="row" flexWrap="nowrap">
        <!-- Avatar Group -->
        <Group :высота="высота" :ширина="60" display="flex" flexDirection="column" alignItems="центр" justifyContent="space-around">
          <Imвозраст id="иконка0" :ширина="50" :высота="50" :imвозраст="record.bloggerAvatar" :cornerRadius="25" />
        </Group>
        <!-- Blogger информация Group -->
        <Group :высота="высота" :ширина="ширина - 60" display="flex" flexDirection="column" flexWrap="nowrap">
          <!-- Blogger имя и Location -->
          <Group :высота="высота / 2" :ширина="ширина" display="flex" alignItems="flex-конец">
            <текст ref="textRef" :текст="record.bloggerимя" :fontSize="13" fontFamily="sans-serif" fill="black" />
            <Imвозраст id="location" imвозраст="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/location.svg"
              :ширина="15" :высота="15" :boundsPadding="[0, 0, 0, 10]" cursor="pointer"
              @mouseEnter="handleMoueEnter($событие)" @Нажать="handleMouseНажать($событие)" @mouseLeave="handleMoueLeave($событие)" />
            <текст :текст="record.Город" :fontSize="11" fontFamily="sans-serif" fill="#6f7070" />
          </Group>
          <!-- Tags Group -->
          <Group :высота="высота / 2" :ширина="ширина" display="flex" alignItems="центр">
            <Tag v-для="tag в record?.tags" :key="tag" :текст="tag" :textStyle="{ fontSize: 10, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }" :panel="{ видимый: true, fill: '#f4f4f2', cornerRadius: 5 }" :space="5" :boundsPadding="[0, 0, 0, 5]" />
          </Group>
        </Group>
      </Group>

    </template>

  </списокColumn>
</списоктаблица>
```

### компонент Encapsulation

#### Tags

The tags returned по the компонент must be based на the graphical tags provided по vue-vтаблица (HTML tags или Vue компонентs cannot be used directly).

```tsx
import { списоктаблица, списокColumn } от '@visactor/vue-vтаблица';
import { Group, текст, Imвозраст, переключатель, флажок, Tag } от '@visactor/vue-vтаблица';
import * as Vтаблица от '@visactor/vтаблица';

<списоктаблица>
  <списокColumn :поле="'bloggerимя'" :title="'anchor nickимя'" :ширина="330" :style="{ fontFamily: 'Arial', fontWeight: 500 }">

    <template #пользовательскиймакет="{ таблица, row, col, rect, record, высота, ширина }">

      <!-- Blogger имя и Location -->
      <Group :высота="высота / 2" :ширина="ширина" display="flex" alignItems="flex-конец">
        <текст ref="textRef" :текст="record.bloggerимя" :fontSize="13" fontFamily="sans-serif" fill="black" />
        <Imвозраст
          id="location"
          imвозраст="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/location.svg"
          :ширина="15"
          :высота="15"
          :boundsPadding="[0, 0, 0, 10]"
          cursor="pointer"
          @mouseEnter="handleMoueEnter($событие)"
          @Нажать="handleMouseНажать($событие)"
          @mouseLeave="handleMoueLeave($событие)"
        />
        <текст :текст="record.Город" :fontSize="11" fontFamily="sans-serif" fill="#6f7070" />
      </Group>

    </template>

  </списокColumn>
</списоктаблица>
```

### базовый Primitive компонентs

базовый primitives:

* Group 
* текст
* Imвозраст 
* переключатель
* флажок
* Tag

для specific configuration свойства, refer к [`VRender Primitive Configuration`](https://visactor.io/vrender/option/Group). для specific usвозраст и макет, refer к [пользовательский макет](../пользовательский_define/пользовательский_макет) и [reference примеры](../../демонстрация-vue/пользовательский-макет/cell-пользовательский-компонент).

<div style="display: flex; justify-content: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-cell-макет-jsx.png" style="flex: 0 0 50%; заполнение: 10px;">
</div>