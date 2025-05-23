
## 任务依赖关系

VTable甘特图支持任务之间的依赖关系，可以通过连线展示任务之间的前后关系。

### 依赖类型

支持四种依赖类型，定义在`DependencyType`枚举中：

1. **完成到开始（FinishToStart）**：前一个任务结束后，下一个任务才能开始
2. **开始到开始（StartToStart）**：两个任务同时开始
3. **完成到完成（FinishToFinish）**：两个任务同时结束
4. **开始到完成（StartToFinish）**：前一个任务开始后，下一个任务才能结束

如下配置一个依赖关系：

```javascript
// 使用依赖类型
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

其中`linkedFromTaskKey` 和 `linkedToTaskKey` 的值需要对应任务数据中的唯一标识字段，唯一标识的字段名默认为`id`，如果需要修改可以通过`taskKeyField`配置项来修改。

### 创建依赖

可以通过API或者交互添加依赖关系：

1. **API方式**：

```javascript
// 添加依赖
gantt.addLink({
  type: 'finish_to_start',
  linkedFromTaskKey: 3,
  linkedToTaskKey: 4
});

// 删除依赖
gantt.deleteLink({
  type: 'finish_to_start',
  linkedFromTaskKey: 1,
  linkedToTaskKey: 2
});
```

2. **交互方式**：

开启`dependency.linkCreatable`配置项后，可以通过交互添加依赖关系。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-dependency-link-line-create.gif)

### 删除依赖

开启`dependency.linkDeletable`配置项后，可以通过交互删除依赖关系。

做法举例一：

想要通过鼠标右键删除关联线，可以监听`CONTEXTMENU_DEPENDENCY_LINK`事件，来主动调用接口`deleteLink`来删除。

做法举例二：

配置快捷键`keyboardOptions.deleteLinkOnDel`或者`keyboardOptions.deleteLinkOnBack`来通过按下键盘'del'或者'back'键来删除关联线。

### 依赖样式配置

样式配置入口：
```
{
  /** 依赖线基本样式 */
  linkLineStyle?: ILineStyle;
  /** 选中时的样式 */
  linkSelectedLineStyle?: ITaskLinkSelectedStyle;
  /** 创建关联线的操作点 */
  linkCreatePointStyle?: IPointStyle;
  /** 创建关联线的操作点响应状态效果 */
  linkCreatingPointStyle?: IPointStyle;
  /** 创建关联线的操作线样式 */
  linkCreatingLineStyle?: ILineStyle;
}
```

代码举例：

```javascript
const ganttOptions = {
  dependency: {
    // 依赖线基本样式
    linkLineStyle: {
      lineColor: '#8c8c8c',
      lineWidth: 1,
      lineDash: [4, 2]
    },
    // 选中时的样式
    linkSelectedLineStyle: {
      lineColor: '#1890ff',
      lineWidth: 2,
      shadowBlur: 4,
      shadowColor: 'rgba(24, 144, 255, 0.5)'
    },
    // 创建点样式
    linkCreatePointStyle: {
      strokeColor: '#8c8c8c',
      strokeWidth: 1,
      fillColor: '#fff',
      radius: 5
    },
    // 创建中点样式
    linkCreatingPointStyle: {
      strokeColor: '#1890ff',
      strokeWidth: 2,
      fillColor: '#fff',
      radius: 6
    },
    // 创建中线样式
    linkCreatingLineStyle: {
      lineColor: '#1890ff',
      lineWidth: 2,
      lineDash: [4, 2]
    }
  }
};
```
### 注意事项

如果是树形结构的甘特图，当依赖线的起点或者终点是被折叠起来的子任务时，依赖线会自动隐藏。

不同任务显示模式下，依懒关联线可能有异常，发现可以提issue或者排查我们的代码逻辑提pr给我们！