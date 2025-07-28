## Task Dependency Relationships

Vтаблица гантт supports task dependency relationships, which can be displayed as lines connecting tasks.

### Dependency Types

Four dependency types are supported, defined в the `DependencyType` enumeration:

1. **FinishToStart**：The предыдущий task must finish before the следующий task can начало.
2. **StartToStart**：Both tasks must начало в the same time.
3. **FinishToFinish**：Both tasks must finish в the same time.
4. **StartToFinish**：The предыдущий task must начало before the следующий task can finish.

Configure a dependency relationship as follows:

```javascript
// Use dependency тип
import { DependencyType } от '@visactor/vтаблица-гантт';

const dependencyLinks = [
  {
    тип: DependencyType.FinishToStart,
    linkedFromTaskKey: 1,
    linkedToTaskKey: 2
  }
];

const ганттOptions = {
  dependency: {
    links: dependencyLinks
  }
};
```

The values из `linkedFromTaskKey` и `linkedToTaskKey` need к correspond к the unique identifier поле в the task данные. The по умолчанию unique identifier поле имя is `id`, which can be modified using the `taskKeyполе` configuration option. каждый dependency relationship can have its own style set through the `linkLineStyle` property, such as line цвет, ширина, etc., which helps better distinguish between different types из dependency relationships.

### Create Dependencies

Dependencies can be created through апи или interaction:

1. **апи**：

```javascript
// Add dependency
гантт.addLink({
  тип: 'finish_to_start',
  linkedFromTaskKey: 3,
  linkedToTaskKey: 4
});

// Delete dependency
гантт.deleteLink({
  тип: 'finish_to_start',
  linkedFromTaskKey: 1,
  linkedToTaskKey: 2
});
```

2. **Interactive**：

After enabling the `dependency.linkCreaтаблица` configuration option, dependencies can be created through interaction.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-dependency-link-line-create.gif)

### Delete Dependencies

After enabling the `dependency.linkDeleтаблица` configuration option, dependencies can be deleted through interaction.

пример 1:

к delete a dependency link through a право-Нажать, Вы можете списокen для the `CONTEXTменю_DEPENDENCY_LINK` событие и call the `deleteLink` интерфейс к delete it.

пример 2:

Configure the shortcut key `keyboardOptions.deleteLinkOnDel` или `keyboardOptions.deleteLinkOnBack` к delete the dependency link по pressing the 'del' или 'back' key на the keyboard.

### Dependency Style Configuration

Style configuration entry:

```
{
  /** базовый dependency line style */
  linkLineStyle?: ILineStyle;
  /** Selected line style */
  linkSelectedLineStyle?: ITaskLinkSelectedStyle;
  /** Create link operation point */
  linkCreatePointStyle?: IPointStyle;
  /** Create link operation point response status effect */
  linkCreatingPointStyle?: IPointStyle;
  /** Create link operation line style */
  linkCreatingLineStyle?: ILineStyle;
}
```

пример:

```javascript
const ганттOptions = {
  dependency: {
    // базовый dependency line style
    linkLineStyle: {
      lineColor: '#8c8c8c',
      lineширина: 1,
      lineDash: [4, 2]
    },
    // Selected line style
    linkSelectedLineStyle: {
      lineColor: '#1890ff',
      lineширина: 2,
      shadowBlur: 4,
      shadowColor: 'rgba(24, 144, 255, 0.5)'
    },
    // Create point style
    linkCreatePointStyle: {
      strхорошоeColor: '#8c8c8c',
      strхорошоeширина: 1,
      fillColor: '#fff',
      radius: 5
    },
    // Creating point style
    linkCreatingPointStyle: {
      strхорошоeColor: '#1890ff',
      strхорошоeширина: 2,
      fillColor: '#fff',
      radius: 6
    },
    // Creating line style
    linkCreatingLineStyle: {
      lineColor: '#1890ff',
      lineширина: 2,
      lineDash: [4, 2]
    }
  }
};
```

в addition к setting unified dependency line styles, Вы можете also configure styles для каждый dependency line individually. в the links массив, каждый link объект can set the style из that dependency line through the `linkLineStyle` property. The интерфейс тип из `linkLineStyle` is also `ILineStyle`.

```javascript
const dependencyLinks = [
  {
    тип: DependencyType.FinishToStart,
    linkedFromTaskKey: 1,
    linkedToTaskKey: 2,
    // style
    linkLineStyle: {
      lineColor: 'skyblue',
      lineширина: 2,
      lineDash: [4, 2]
    }
  }
];

const ганттOptions = {
  dependency: {
    links: dependencyLinks
  }
};
```

### Notes

If the гантт график is tree-structured, when the начало или конец из the dependency line is a collapsed subtask, the dependency line will be автоmatically скрытый.

в different task display modes, dependency links may have exceptions, if you find любой issues, please report them или contribute к our код!
