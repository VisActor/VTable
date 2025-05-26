
## Task Dependency Relationships

VTable Gantt supports task dependency relationships, which can be displayed as lines connecting tasks.

### Dependency Types

Four dependency types are supported, defined in the `DependencyType` enumeration:

1. **FinishToStart**：The previous task must finish before the next task can start.
2. **StartToStart**：Both tasks must start at the same time.
3. **FinishToFinish**：Both tasks must finish at the same time.
4. **StartToFinish**：The previous task must start before the next task can finish.

Configure a dependency relationship as follows:

```javascript
// Use dependency type
import { DependencyType } from '@visactor/vtable-gantt';

const dependencyLinks = [
  {
    type: DependencyType.FinishToStart,
    linkedFromTaskKey: 1,
    linkedToTaskKey: 2
  }
];

const ganttOptions = {
  dependency: {
    links: dependencyLinks
  }
};
```

The values of `linkedFromTaskKey` and `linkedToTaskKey` need to correspond to the unique identifier field in the task data. The default unique identifier field name is `id`, which can be modified using the `taskKeyField` configuration option.

### Create Dependencies

Dependencies can be created through API or interaction:

1. **API**：

```javascript
// Add dependency
gantt.addLink({
  type: 'finish_to_start',
  linkedFromTaskKey: 3,
  linkedToTaskKey: 4
});

// Delete dependency
gantt.deleteLink({
  type: 'finish_to_start',
  linkedFromTaskKey: 1,
  linkedToTaskKey: 2
});
```

2. **Interactive**：

After enabling the `dependency.linkCreatable` configuration option, dependencies can be created through interaction.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-dependency-link-line-create.gif)

### Delete Dependencies

After enabling the `dependency.linkDeletable` configuration option, dependencies can be deleted through interaction.

Example 1:

To delete a dependency link through a right-click, you can listen for the `CONTEXTMENU_DEPENDENCY_LINK` event and call the `deleteLink` interface to delete it.

Example 2:

Configure the shortcut key `keyboardOptions.deleteLinkOnDel` or `keyboardOptions.deleteLinkOnBack` to delete the dependency link by pressing the 'del' or 'back' key on the keyboard.

### Dependency Style Configuration

Style configuration entry:
```
{
  /** Basic dependency line style */
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

Example:

```javascript
const ganttOptions = {
  dependency: {
    // Basic dependency line style
    linkLineStyle: {
      lineColor: '#8c8c8c',
      lineWidth: 1,
      lineDash: [4, 2]
    },
    // Selected line style
    linkSelectedLineStyle: {
      lineColor: '#1890ff',
      lineWidth: 2,
      shadowBlur: 4,
      shadowColor: 'rgba(24, 144, 255, 0.5)'
    },
    // Create point style
    linkCreatePointStyle: {
      strokeColor: '#8c8c8c',
      strokeWidth: 1,
      fillColor: '#fff',
      radius: 5
    },
    // Creating point style
    linkCreatingPointStyle: {
      strokeColor: '#1890ff',
      strokeWidth: 2,
      fillColor: '#fff',
      radius: 6
    },
    // Creating line style
    linkCreatingLineStyle: {
      lineColor: '#1890ff',
      lineWidth: 2,
      lineDash: [4, 2]
    }
  }
};
```
### Notes

If the Gantt chart is tree-structured, when the start or end of the dependency line is a collapsed subtask, the dependency line will be automatically hidden.

In different task display modes, dependency links may have exceptions, if you find any issues, please report them or contribute to our code!