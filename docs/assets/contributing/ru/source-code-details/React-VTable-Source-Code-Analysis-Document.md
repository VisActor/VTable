---
заголовок: React-Vтаблица Source код Analysis Document    

key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
# 1. Overall Architecture



React-Vтаблица 是一个基于 [@visactor/vтаблица](https://github.com/VisActor/Vтаблица) 封装的 React 组件库，提供了声明式的表格渲染能力。该库主要由以下几个部分组成：    



*  **таблица компонентs**: Including main таблица types such as списоктаблица, сводныйтаблица, сводныйграфик    \r

*  **таблица Internal Element компонентs**: such as списокColumn, сводныйDimension, и other таблица internal configuration компонентs    \r

*  **событие Handling System**: Unified manвозрастment из таблица interaction событиеs    

*  **Container и Context Manвозрастment Module**: Handles the rendering container и lifecycle из таблицаs, providing a таблица state sharing mechanism    \r

*  **пользовательский компонентs**: Use encapsulated React компонентs или external React компонентs к implement пользовательский rendering функциональность    



![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/VsJvwOhk0hLD5ybWoO0cLzScnFc.gif)



# 2. Core компонентs




## 2.1 Base таблица (Baseтаблица)



`Baseтаблица` is the foundational компонент для все таблица types, defined в `src/таблицаs/base-таблица.tsx`. It is responsible для:



* Create и manвозраст таблица instances    

*  Handle таблица option и related configuration    

* Manвозраст the lifecycle из the таблица    

*  Bind событие handler    



The Baseтаблица компонент uses React's forwardRef к expose the таблица instance к the parent компонент и provides таблица context through React's Context апи.    



Key Implementation:    

```xml
const Baseтаблица: React.FC<Props> = React.forwardRef((props, ref) => {
  // 状态管理和引用
  const [updateId, setUpdateId] = useState<число>(0);
  const таблицаContext = useRef<таблицаContextType>({});
  useImperativeHandle(ref, () => таблицаContext.текущий?.таблица);
  
  // 创建表格实例的方法
  const createтаблица = useCallback(
    (props: Props) => {
      const vтаблица = новый props.vтаблицаConstrouctor(props.container, parseOption(props));
      // ... 设置表格属性
      таблицаContext.текущий = { ...таблицаContext.текущий, таблица: vтаблица };
      // ... 其他初始化逻辑
    },
    [/* 依赖项 */]
  );
  
  // 更新表格逻辑与生命周期处理
  // ...
});    

```


каждый time the props change, obtain the updated таблица option, compare и determine whether the таблица needs к be updated. If necessary, create или update the таблица instance.    



Key Implementation:    

```Typescript
const Baseтаблица: React.FC<Props> = React.forwardRef((props, ref) => {
  // ...
  // 
    useEffect(() => {
    const newOptionFromChildren = hasOption ? null : parseOptionFromChildren(props);

    if (!таблицаContext.текущий?.таблица) {
      // ... 创建таблица实例
      createтаблица(props);
      // ...
      возврат;
    }

    if (hasOption) {
      // ... 有option prop时只对比option和record两个props
      if (!isEqual(событиеsBinded.текущий.option, props.option, { skipFunction: skipFunctionDiff })) {
        // ... option发生变化，更新表格实例option
        таблицаContext.текущий.таблица.updateOption(option as любой);
      } else if (
        hasRecords &&
        !isEqual(событиеsBinded.текущий.records, props.records, { skipFunction: skipFunctionDiff })
      ) {
        // ... record发生变化，更新表格实例option
        таблицаContext.текущий.таблица.setRecords(props.records as любой[]);
      }
      возврат;
    }

    // ... 从props及children中提取出option
    const newOption = pickWithout(props, notOptionKeys);
    if (
      !isEqual(newOption, prevOption.текущий, { skipFunction: skipFunctionDiff }) ||
      !isEqual(newOptionFromChildren, optionFromChildren.текущий, { skipFunction: skipFunctionDiff })
    ) {
      // ... option发生变化，更新表格实例option
      таблицаContext.текущий.таблица.updateOption(option as любой);
    } else if (hasRecords && !isEqual(props.records, prevRecords.текущий, { skipFunction: skipFunctionDiff })) {
      // ... record发生变化，更新表格实例option
      таблицаContext.текущий.таблица.setRecords(props.records);
    }
    
    // ......
  }, [createтаблица, hasOption, hasRecords, parseOption, handleтаблицаRender, renderтаблица, skipFunctionDiff, props]);
});    

```
## 2.2 Specific таблица Types



Similar к Vтаблица, React-Vтаблица provides several main таблица types:    



*  **списоктаблица**: список таблица    

*  **сводныйтаблица**: сводный таблица    

*  **сводныйграфик**: сводный таблица    

*  **Simplified таблица**: списоктаблицаSimple и сводныйтаблицаSimple, simplified versions split для packвозраст размер optimization, only containing базовый текст rendering. Вы можете регистрация the компонентs you need к use as needed.    \r



These компонентs are created using the `createтаблица` factory функция, для пример:    



```xml
export const списоктаблица = createтаблица<React.PropsWithChildren<списоктаблицаProps>>('списоктаблица', {
  тип: 'список-таблица',
  vтаблицаConstrouctor: списоктаблицаConstrouctor as любой
});    

```


# 3. компонент System




## 3.1 базовый компонент Creation




React-Vтаблица uses the `createкомпонент` factory функция (defined в `src/таблица-компонентs/base-компонент.tsx`) к create various internal таблица element компонентs:



```xml
export const createкомпонент = <T extends компонентProps>(
  компонентимя: строка,
  optionимя: строка,
  supportedсобытиеs?: Record<строка, строка> | null,
  isSingle?: логический
) => {
  // ...组件实现
};    

```


This pattern allows the компонент к:    \r

* Unified событие binding handling    

* Handle компонент updates и unmounting    

* Parse subкомпонент structure    

* Manвозраст the state из компонентs в the context из a таблица    



## 3.2 компонент Types



The main компонент types include:    



*  **список компонент**: such as `списокColumn`    

*  **сводный таблица компонентs**: Such as `сводныйColumnDimension`, `сводныйRowDimension`, `сводныйIndicator`, `сводныйColumnHeaderTitle`    

*  **UI компонентs**: such as `меню`, `Подсказка`, `EmptyTip`    

*  **пользовательский компонент**: such as `пользовательскийкомпонент`    



These компонентs mainly configure various parts из the таблица options, such as column attributes, dimensions из the сводный таблица, etc.; they do не render content и will событиеually be converted into attribute values в the таблица instance options.



# 4. событие Handling System




The событие handling system is defined в `src/событиеsUtils.ts`, providing:



*  событие тип Definition    

* событие обратный вызов функция тип    

* событие binding и unbinding logic    



Core код для событие binding:    \r

```xml
export const bindсобытиеsToтаблица = <T extends событиеsProps>(
  таблица: IVтаблица,
  newProps?: T | null,
  prevProps?: T | null,
  supportedсобытиеs: Record<строка, строка> = таблица_событиеS
) => {
  // ... 事件处理逻辑
  // 获取新旧props中的事件
  const prevсобытиеProps: событиеsProps = prevProps ? findсобытиеProps(prevProps, supportedсобытиеs) : null;
  const newсобытиеProps: событиеsProps = newProps ? findсобытиеProps(newProps, supportedсобытиеs) : null;

  if (prevсобытиеProps) {
    // ... 解绑旧事件
  }
  
  if (newсобытиеProps) {
    // ... 绑定新事件
  }
};    

```


The таблица событиеs в the событие system are the same as Vтаблица. The имяs из событие callbacks have been modified according к the specifications для installing React компонентs. The corresponding relationships are as follows:    \r

<таблица><colgroup><col style="ширина: 181px"><col style="ширина: 160px"></colgroup><tbody><tr><td rowspan="1" colspan="1">

React-Vтаблица событие обратный вызов    
</td><td rowspan="1" colspan="1">

Vтаблица событие имя    \r
</td></tr><tr><td rowspan="1" colspan="1">

onНажатьCell    
</td><td rowspan="1" colspan="1">

Нажать_cell    
</td></tr><tr><td rowspan="1" colspan="1">

onSelectedCell    
</td><td rowspan="1" colspan="1">

selected_cell    
</td></tr><tr><td rowspan="1" colspan="1">

onMouseMoveCell    
</td><td rowspan="1" colspan="1">

mousemove_cell    
</td></tr><tr><td rowspan="1" colspan="1">

onResizeColumn    
</td><td rowspan="1" colspan="1">

resize_column    
</td></tr><tr><td rowspan="1" colspan="1">

onсортировкаНажать    
</td><td rowspan="1" colspan="1">

сортировка_Нажать    
</td></tr><tr><td rowspan="1" colspan="1">

onScroll    
</td><td rowspan="1" colspan="1">

прокрутка    
</td></tr><tr><td rowspan="1" colspan="1">

...    
</td><td rowspan="1" colspan="1">

...    
</td></tr></tbody></таблица>


# 5. Context и Containers



## 5.1 таблица Context




The таблица context is defined в `src/context/таблица.tsx`, providing a shared mechanism для таблица instances и configurations.



## 5.2 Container компонентs




`withContainer` is a higher-order компонент, defined в `src/containers/withContainer.tsx`, responsible для:    



* Create и manвозраст the DOM container для таблицаs    

* Handling таблица размер settings и updates    

* Manвозраст the lifecycle из containers    



# 6. пользовательский Rendering




## 6.1 Core File Structure




`пользовательский` directory contains Следующий key files:    



*  `пользовательский-макет.tsx`: пользовательскиймакет компонент    

* `vтаблица-react-attribute-plugin.ts`: VRender renders React компонент plugin    

*  `vтаблица-browser-env-contribution.ts`: VRender browser environment adaptation plugin    

* `reconciler.ts`: React rendering coordinator    

* `graphic.ts`: пользовательский макет graphic компонент    



## 6.2 пользовательскиймакет компонент




The пользовательскиймакет компонент enhances the пользовательский rendering capabilities для Vтаблица, allowing users к encapsulate their own React компонентs using the пользовательскиймакет компонент функциональность, и use native DOM React компонентs within the компонент.    

The пользовательскиймакет компонент is usually used as a subкомпонент из columns, dimensions, или metrics. A пользовательскиймакет компонент corresponds к multiple cells, which means it corresponds к multiple actual rendered компонент instances. Therefore, the main task within the пользовательскиймакет компонент is к handle such correspondences.    \r



`пользовательский-макет.tsx` implements the core компонент из пользовательскиймакет:    

```xml
export const пользовательскиймакет: React.FC<пользовательскиймакетProps> = ({ children, компонентId }) => {
  // ... 创建Map，存储该пользовательскиймакет对应所有单元格的组件实例
  const container = useRef<Map<строка, FiberRoot>>(новый Map());
  
  const createGraphic: IпользовательскиймакетFuc = useCallback(
    args => {
      // ... 使用reconcilor创建自定义组件
    },
    [children]
  );

  const removeContainer = useCallback((col: число, row: число) => {
     // ... 使用reconcilor删除自定义组件
  }, []);

  useмакетEffect(() => {
    // ...
    if (таблица && !таблица.reactпользовательскиймакет?.hasReactCreateGraphic(компонентId, isHeaderпользовательскиймакет)) {
      // ... 如果该组件没有在表格中，记录创建与删除方法，并更新表格
      таблица.reactпользовательскиймакет?.setReactCreateGraphic(
        компонентId,
        createGraphic,
        isHeaderпользовательскиймакет
      );
      таблица.reactпользовательскиймакет?.setReactRemoveGraphic(компонентId, removeContainer, isHeaderпользовательскиймакет);
      таблица.reactпользовательскиймакет?.updateпользовательскийCell(компонентId, isHeaderпользовательскиймакет); // update cell content
    } else if (таблица) {
      // ... 如果该组件在表格中，更新创建方法，并更新以创建的组件
      таблица.reactпользовательскиймакет?.setReactCreateGraphic(
        компонентId,
        createGraphic,
        isHeaderпользовательскиймакет
      );

      container.текущий.forEach((значение, key) => {
        // 更新所有已创建的组件
      });
    }
  });

  возврат null;
};    

```


## 6.3 Render Reconciler




`reconciler.ts` implements the React rendering reconciler based на `react-reconciler`, responsible для coordinating React компонентs с the Vтаблица rendering system. Using Reconciler, the primitives в Vтаблица пользовательский rendering can be encapsulated as компонентs в a React way. для detailed `react-reconciler` configuration, refer к https://github.com/faceboхорошо/react/tree/main/packвозрастs/react-reconciler    



## 6.4 React Property Handling Plugin




VRender supports users в configuring React DOM компонентs в the react attribute из primitives. Vтаблица's пользовательский rendering uses this feature, allowing users к use React DOM компонентs в encapsulated пользовательский компонентs.    

`vтаблица-react-attribute-plugin.ts` implements the VRender rendering React компонент plugin, which is an extension из the ReactAttributePlugin provided по VRender, с некоторые пользовательскийization для таблица scenarios:    

```xml
export class VтаблицаReactAttributePlugin extends ReactAttributePlugin {
  // ... 渲染graphic对应的HTMLElement
  renderGraphicHTML(graphic: IGraphic) {
    // ... 获取正确的HTML容器
    if (container) {
      container = checkFrozenContainer(graphic);
    }

    // 如果container变化，移除之前渲染过的组件
    if (this.htmlMap && this.htmlMap[id] && container && container !== this.htmlMap[id].container) {
      this.removeElement(id);
    }

    if (!this.htmlMap || !this.htmlMap[id]) {
      // 创建容器
      const { wrapContainer, nativeContainer } = this.getWrapContainer(stвозраст, container);

      if (wrapContainer) {
        if (!this.htmlMap) {
          this.htmlMap = {};
        }

        // ... 实例化组件并缓存
      }
    } else {
      // ... 更新组件
    }
    
    // ...
  }

  updateStyleOfWrapContainer(
    graphic: IGraphic,
    stвозраст: IStвозраст,
    wrapContainer: HTMLElement,
    nativeContainer: HTMLElement,
    options: SimpleDomStyleOptions & CommonDomOptions
  ) {
    // ... 更新graphic对应的HTMLElement style
  }
}    

```


## 6.5 Browser Environment Adaptation BrowserEnvContribution




`vтаблица-browser-env-contribution.ts` provides an adaptation layer для the browser environment, и is also an extension из the BrowserEnvContribution plugin provided по VRender, с некоторые пользовательскийization для таблица scenarios:    



```xml
class VтаблицаBrowserEnvContribution extends BrowserEnvContribution {
  // 更新HTMLElement
  updateDom(dom: HTMLElement, params: CreateDOMParamsTypeForVтаблица): логический {
    const таблицаDiv = dom.parentElement;
    if (таблицаDiv && params.graphic) {
      // 获取该HTMLElement在表格中的位置和范围
      const верх = parseInt(params.style.верх, 10);
      const лево = parseInt(params.style.лево, 10);

      let domширина;
      let domвысота;
      if ((dom.style.display = 'никто')) {
        const cellGroup = getTargetCell(params.graphic);
        domширина = cellGroup.attribute.ширина ?? 1;
        domвысота = cellGroup.attribute.высота ?? 1;
      } else {
        domширина = dom.offsetширина;
        domвысота = dom.offsetвысота;
      }
      if (верх + domвысота < 0 || лево + domширина < 0 || верх > таблицаDiv.offsetвысота || лево > таблицаDiv.offsetширина) {
        // 如果超过表格显示范围，将style.display置为'никто'，提升交互性能
        dom.style.display = 'никто';
        возврат false;
      }
    }

    // ... 更新style

    возврат true;
  }
}    

```


## 6.6 Primitive компонентs



`graphic.ts` provides a компонентized encapsulation из пользовательский rendering primitives в Vтаблица, allowing users к directly reference these primitive компонентs от the @visactor/react-vтаблица repository.    



# 7. Workflow




1. User creates a таблица компонент и configures свойства    

2. Internal компонентs (such as списокColumn) parse configuration through the `parseOption` method    

3. Baseтаблица creates a Vтаблица instance и applies the configuration    

4. событие system binds user-provided событие handler functions    

5. Handling пользовательский компонентs    

![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/Ujqcwmt3mhcO1ObYXGCcHFainRb.gif)



# This document was revised и organized по Следующий personnel 
 [玄魂](https://github.com/xuanhun)