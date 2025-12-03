# v1.19.3

2025-07-09


**🆕 новый feature**

- **@visactor/vтаблица**: add событиеOptions contextменюReturnAllSelectedCells [#4064](https://github.com/VisActor/Vтаблица/issues/4064)
-  **@visactor/vтаблица**: add batch развернуть или свернуть все tree nodes

**🐛 Bug fix**

- **@visactor/vтаблица**: Нажать к edit cell не work с groupBy [#4172](https://github.com/VisActor/Vтаблица/issues/4172)
- **@visactor/vтаблица**: fix validateCellVaule when paste cell [#4174](https://github.com/VisActor/Vтаблица/issues/4174) [#1797](https://github.com/VisActor/Vтаблица/issues/1797)
- **@visactor/vтаблица**: handle frozen column calculation when container is invisible
-  **@visactor/vтаблица**: fix: paste validateValue missing позиция таблица params [#4164](https://github.com/VisActor/Vтаблица/issues/4164)
-  **@visactor/vтаблица**: fix animation регистрация progress
-  **@visactor/vтаблица**: fix: fix after изменение размера container then frozen column invisible [#3836](https://github.com/VisActor/Vтаблица/issues/3836)




[more detail about v1.19.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.19.3)

# v1.19.2

2025-07-01


**🆕 новый feature**

- **@visactor/vтаблица**: списоктаблица support levelSpan для header
- **@visactor/vтаблица-plugins**: add import excel file plugin
- **@visactor/vтаблица-гантт**: гантт график's frame граница support set массив


**🐛 Bug fix**

- **@visactor/vтаблица**: fix templateLink в export excel [#4106](https://github.com/VisActor/Vтаблица/issues/4106)
- **@visactor/vтаблица**: список-tree delete root level ошибка when using deleteRecords
- **@visactor/vтаблица**: fix minширина & maxширина в автоFillширина status [#4100](https://github.com/VisActor/Vтаблица/issues/4100)
- **@visactor/vтаблица**: when updateColumns occor ошибка с aggregation
- **@visactor/vтаблица**: when edit сводный indicator значение the total значение should update synchronously
- **@visactor/vтаблица**: merge render ошибка when has пользовательский aggregation
- **@visactor/vтаблица**: список tree delete records bug [#3991](https://github.com/VisActor/Vтаблица/issues/3991)
- **@visactor/vтаблица**: group по логический cannot render false [#4059](https://github.com/VisActor/Vтаблица/issues/4059)



[more detail about v1.19.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.19.2)

# v1.19.1

2025-06-20


**🆕 новый feature**

- **@visactor/vтаблица**: fix when use containerFit прокрутка и низ граница ошибка [#3337](https://github.com/VisActor/Vтаблица/issues/3337)

**🐛 Bug fix**

- **@visactor/vтаблица**: copy не work when after copy Подсказка текст [#3968](https://github.com/VisActor/Vтаблица/issues/3968)
- **@visactor/vтаблица**: fix the issue where the иконка configuration is не effective when cellType is progressBar [#4047](https://github.com/VisActor/Vтаблица/issues/4047)

**🔧 Configuration releated**

- **@visactor/vтаблица**: update vrender 1.0.5 fix animation bug



[more detail about v1.19.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.19.1)

# v1.19.0

2025-06-16


**🆕 новый feature**

- **@visactor/vтаблица-гантт**: add task-bar minSize config [#4016](https://github.com/VisActor/Vтаблица/issues/4016)
- **@visactor/vтаблица-гантт**: support different dependency link line has differrent style [#4016](https://github.com/VisActor/Vтаблица/issues/4016)
- **@visactor/vтаблица**: add containerFit config к support таблица размер
- **@visactor/vтаблица**: add wps fill-handle plugin
- **@visactor/vтаблица**: add clearColширинаCache для updateColumns апи

**🐛 Bug fix**

- **@visactor/vтаблица**: некоторые taskShowMode should compute все row высота на vтаблица [#4011](https://github.com/VisActor/Vтаблица/issues/4011)
- **@visactor/vтаблица**: group Релиз so gif can stop animation [#4029](https://github.com/VisActor/Vтаблица/issues/4029)

**🔧 Configuration releated**

- **@visactor/vтаблица**: update vrender 1.0.0



[more detail about v1.19.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.19.0)

# v1.18.5

2025-06-09


**🆕 новый feature**

- **@visactor/vтаблица-vue**: add vue-таблица export тип /es/*.d.ts

**🐛 Bug fix**

- **@visactor/vтаблица**: fix node-canvas range в сводныйграфик [#3997](https://github.com/VisActor/Vтаблица/issues/3997)
- **@visactor/vтаблица**: when pointer up set isDown false
- **@visactor/vтаблица**: fix перетаскивание выбрать не stop problem [#3895](https://github.com/VisActor/Vтаблица/issues/3895)
- **@visactor/vтаблица**: fix scrollbar не показать when set видимый 'фокус' [#3914](https://github.com/VisActor/Vтаблица/issues/3914)
- **@visactor/vтаблица**: contextменю subменю показать postion should adjust по низ [#3867](https://github.com/VisActor/Vтаблица/issues/3867)
- **@visactor/vтаблица**: filter данные occor ошибка с сортировка state и groupby [#3961](https://github.com/VisActor/Vтаблица/issues/3961) 


[more detail about v1.18.5](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.18.5)

# v1.18.4

2025-05-27


**🆕 новый feature**

- **@visactor/vтаблица**: add pasted_данные событие [#3908](https://github.com/VisActor/Vтаблица/issues/3908)
- **@visactor/vтаблица-гантт**: add date позиция к markline
- **@visactor/vтаблица-гантт**: add milestone текст
- **@visactor/vтаблица-гантт**: support record тип 'project'
- **@visactor/vтаблица-гантт**:  add tasksShowMode 'Project_Sub_Tasks_Inline'

**🐛 Bug fix**

- **@visactor/vтаблица**: fix bug из график matrix when has scale



[more detail about v1.18.4](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.18.4)

# v1.18.3

2025-05-13


**🆕 новый feature**

- **@visactor/vтаблица**: add frozenColumnLine видимый на тема [#3828](https://github.com/VisActor/Vтаблица/issues/3828)
- **@visactor/vтаблица**: add touch событие для гантт график [#3864](https://github.com/VisActor/Vтаблица/issues/3864)
- **@visactor/vтаблица**: add support для текст не к be скрытый [#3802](https://github.com/VisActor/Vтаблица/issues/3802)
- **@visactor/vтаблица**: add exportAllданные к export таблица plugin [#3726](https://github.com/VisActor/Vтаблица/issues/3726)

**🐛 Bug fix**

- **@visactor/vтаблица**: when no rowTree treeMode occor ошибка [#3830](https://github.com/VisActor/Vтаблица/issues/3830)
- **@visactor/vтаблица**: unintended edit state activation на functional Кнопка Нажатьs
- **@visactor/vтаблица**: resolve taskBar ширина problem when Нажать linkPonitNode [#3829](https://github.com/VisActor/Vтаблица/issues/3829)



[more detail about v1.18.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.18.3)

# v1.18.2

2025-04-30


**🐛 Bug fix**

- **@visactor/vтаблица**: when records is blank updateColumns апи occor ошибка [#3766](https://github.com/VisActor/Vтаблица/issues/3766)
- **@visactor/vтаблица**: updateOption с данныеSource объект occor ошибка [#3768](https://github.com/VisActor/Vтаблица/issues/3768)
- **@visactor/vтаблица**: when скрыть сводный header find headerPath ошибка [#3791](https://github.com/VisActor/Vтаблица/issues/3791)
- **@visactor/vтаблица**: supplement adaptive ширинаAdaptiveMode logic [#3796](https://github.com/VisActor/Vтаблица/issues/3796)
- **@visactor/vтаблица**: transform rotate апи
- **@visactor/vтаблица**: after rotate изменение размера column interaction ошибка
- **@visactor/vтаблица**: skip serial число calculation для aggregation rows when groupBy is включен
- **@visactor/vтаблица**: скрыть rowSeriesNumber и флажок в aggregation [#2173](https://github.com/VisActor/Vтаблица/issues/2173)

**🔨 Refactor**

- **@visactor/vтаблица**: change событие списокener с vglobal [#3734](https://github.com/VisActor/Vтаблица/issues/3734)
- **@visactor/vтаблица**: plugins update progress [#3788](https://github.com/VisActor/Vтаблица/issues/3788)



[more detail about v1.18.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.18.2)

# v1.18.0
  v1.17.7 same content

2025-04-17

**💥 Breaking change**

- **@visactor/vтаблица**: fix switch по умолчанию direction [#3667](https://github.com/VisActor/Vтаблица/issues/3667)
- **@visactor/vтаблица-editors**: fix ввод editor по умолчанию style

**🆕 новый feature**

- **@visactor/vтаблица**: add onBeforeCacheграфикImвозраст событие
- **@visactor/vтаблица**: support пользовательскийConfig disableBuildInграфикActive
- **@visactor/vтаблица**: add dynamicUpdateSelectionSize config в тема.selectionStyle

**🐛 Bug fix**

- **@visactor/vтаблица**: fix таблица размер в getCellsRect() [#3681](https://github.com/VisActor/Vтаблица/issues/3681)
- **@visactor/vтаблица**: correct column index calculation when rowSeriesNumber is configured
- **@visactor/vтаблица**: fix imвозраст flash problem [#3588](https://github.com/VisActor/Vтаблица/issues/3588)
- **@visactor/vтаблица**: fix row/column update problem в текст-stick [#3744](https://github.com/VisActor/Vтаблица/issues/3744)
- **@visactor/vтаблица**: fix switch по умолчанию direction [#3667](https://github.com/VisActor/Vтаблица/issues/3667)



[more detail about v1.17.7](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.17.7)

# v1.17.6

2025-04-10


**🆕 новый feature**

- **@visactor/vтаблица**: списоктаблица added tiggerсобытие параметр к changeCellValue
- **@visactor/vтаблица**: список таблица header support hierarchy

**🐛 Bug fix**

- **@visactor/vтаблица**: when move tree node позиция код occor ошибка [#3645](https://github.com/VisActor/Vтаблица/issues/3645) [#3706](https://github.com/VisActor/Vтаблица/issues/3706)
- **@visactor/vтаблица**: frame граница set массив render низ line позиция ошибка [#3684](https://github.com/VisActor/Vтаблица/issues/3684)
- **@visactor/vтаблица**: mobile touch событие изменение размера column ширина [#3693](https://github.com/VisActor/Vтаблица/issues/3693)
- **@visactor/vтаблица**: when set frozen disableDragSelect не work [#3702](https://github.com/VisActor/Vтаблица/issues/3702)
- **@visactor/vтаблица**: fix flex макет update в react-пользовательский-макет компонент [#3696](https://github.com/VisActor/Vтаблица/issues/3696)
- **@visactor/vтаблица**: updateTaskRecord апи [#3639](https://github.com/VisActor/Vтаблица/issues/3639)
- **@visactor/vтаблица**: repeat call computeColsширина adaptive mode result ошибка



[more detail about v1.17.6](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.17.6)

# v1.17.5

2025-04-02


**🆕 новый feature**

- **@visactor/vтаблица**: cell support marked функция [#3583](https://github.com/VisActor/Vтаблица/issues/3583)
- **@visactor/vтаблица**: refactor сводныйтаблица corner с no columns или rows case [#3653](https://github.com/VisActor/Vтаблица/issues/3653)

**🐛 Bug fix**

- **@visactor/vтаблица**: гантт scale set quarter parser problem [#3612](https://github.com/VisActor/Vтаблица/issues/3612)
- **@visactor/vтаблица**: гантт overscrollBehavior никто work [#3638](https://github.com/VisActor/Vтаблица/issues/3638)
- **@visactor/vтаблица**: гантт график updateRecords ошибка when таблица is tree mode [#3639](https://github.com/VisActor/Vтаблица/issues/3639)
- **@visactor/vтаблица**: rowвысота ошибка when set adaptive высотаMode [#3640](https://github.com/VisActor/Vтаблица/issues/3640)
- **@visactor/vтаблица**: when set renderграфикAsync setRecords апи render ошибка [#3661](https://github.com/VisActor/Vтаблица/issues/3661)
- **@visactor/vтаблица**: fix merge cell флажок state update [#3668](https://github.com/VisActor/Vтаблица/issues/3668)

**🔨 Refactor**

- **@visactor/vтаблица**: fillHandle функция [#3582](https://github.com/VisActor/Vтаблица/issues/3582)



[more detail about v1.17.5](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.17.5)

# v1.17.4

2025-03-31


**🆕 новый feature**

- **@visactor/vтаблица**: add barMarkInBar style config в progressbar [#3616](https://github.com/VisActor/Vтаблица/issues/3616)

**🐛 Bug fix**

- **@visactor/vтаблица**: fix Кнопка style problem [#3614](https://github.com/VisActor/Vтаблица/issues/3614)
- **@visactor/vтаблица**: fix флажок state order update [#3606](https://github.com/VisActor/Vтаблица/issues/3606)
- **@visactor/vтаблица**: add isпользовательский tag для merge cell range [#3504](https://github.com/VisActor/Vтаблица/issues/3504)
- **@visactor/vтаблица**: fix tree флажок state update problem
- **@visactor/vтаблица**: отключить group title editor

[more detail about v1.17.4](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.17.4)

# v1.17.3

2025-03-24


**🆕 новый feature**

- **@visactor/vтаблица**: rowSeriesNumber support cell тип переключатель [#3558](https://github.com/VisActor/Vтаблица/issues/3558)
- **@visactor/vтаблица**: add пользовательский reactAttributePlugin в react-vтаблица
- **@visactor/vтаблица**: add maintainedColumnCount config

**🐛 Bug fix**

- **@visactor/vтаблица**: selection mergeCell extend range [#3529](https://github.com/VisActor/Vтаблица/issues/3529)
- **@visactor/vтаблица**: set cellInnerBorder false frame граница render ошибка [#3574](https://github.com/VisActor/Vтаблица/issues/3574)
- **@visactor/vтаблица**: fix cell граница в cell с corner-radius
- **@visactor/vтаблица**: fix axis label автоsize computation
- **@visactor/vтаблица**: fix small window размер frozen column count
- **@visactor/vтаблица**: columnширинаConfig match dimension ошибка
- **@visactor/vтаблица**: fix react компонент update [#3474](https://github.com/VisActor/Vтаблица/issues/3474)
- **@visactor/vтаблица**: fix право Кнопка выбрать problem
- **@visactor/vтаблица**: fix row update range [#3468](https://github.com/VisActor/Vтаблица/issues/3468)

[more detail about v1.17.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.17.3)

# v1.17.2

2025-03-11


**🐛 Bug fix**

- **@visactor/vue-vтаблица**: пользовательский container значение ошибка


[more detail about v1.17.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.17.2)

# v1.17.1

2025-03-10


**🆕 новый feature**

- **@visactor/vтаблица**: сводный таблица add апи setLoadingHierarchyState [#3469](https://github.com/VisActor/Vтаблица/issues/3469)
- **@visactor/vтаблица**: add validateDragOrderOnEnd на dragOrder option [#3493](https://github.com/VisActor/Vтаблица/issues/3493)
- **@visactor/vтаблица**: сортировкаByIndicatorRule support сортировкаFunc [#3508](https://github.com/VisActor/Vтаблица/issues/3508)
- **@visactor/vтаблица-гантт**: гантт график support create markline
- **@visactor/vтаблица**: пользовательскийCellStyle supports functional config [#3483](https://github.com/VisActor/Vтаблица/issues/3483)

**🐛 Bug fix**

- **@visactor/vтаблица**: mobile drill иконка state update [#3485](https://github.com/VisActor/Vтаблица/issues/3485)
- **@visactor/vтаблица**: активный право Кнопка interactive [#3482](https://github.com/VisActor/Vтаблица/issues/3482)

**🔧 Configuration releated**

- **@visactor/vтаблица**: update vrender version



[more detail about v1.17.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.17.1)

# v1.17.0

2025-02-26

**💥 Breaking change**

- **@visactor/vтаблица**: delete загрузка иконка авто регистрация, need к регистрация manually, please refer к the tutorial: /guide/таблица_type/список_таблица/tree_список

**🆕 новый feature**

- **@visactor/vтаблица-гантт**: гантт time scale support видимый [#3098](https://github.com/VisActor/Vтаблица/issues/3098)
- **@visactor/vтаблица**: dropdownменю support функция [#3443](https://github.com/VisActor/Vтаблица/issues/3443)
- **@visactor/vтаблица-гантт**: add verticalLineDependenceOnTimeScale [#3467](https://github.com/VisActor/Vтаблица/issues/3467)
- **@visactor/vтаблица**: add апи activateграфикInstance replaceграфикCacheImвозраст
- **@visactor/vтаблица**: add `specTransformInCell` для support modifying vграфик spec из каждый cell в сводныйграфик
- **@visactor/vтаблица**: add switch & Кнопка cell тип

**🐛 Bug fix**

- **@visactor/vтаблица**: after Релиз instance, изменение размера событие occor ошибка [#3459](https://github.com/VisActor/Vтаблица/issues/3459)
- **@visactor/vтаблица**: when set автоFillширина the rowSeriesNumber column не change his ширина [#3459](https://github.com/VisActor/Vтаблица/issues/3459)
- **@visactor/vтаблица-гантт**: when изменение размера taskbar начало или конец time tree node update ошибка [#3460](https://github.com/VisActor/Vтаблица/issues/3460)
- **@visactor/vтаблица**: fix node env config
- **@visactor/vтаблица**: fix row/col is decimal в animation [#3455](https://github.com/VisActor/Vтаблица/issues/3455)
- **@visactor/vтаблица**: fix высота is decimal в carousel [#3458](https://github.com/VisActor/Vтаблица/issues/3458)

**📖 Site / Документация update**

- **@visactor/vтаблица**: update changlog из rush



[more detail about v1.17.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.17.0)

# v1.16.2

2025-02-19


**🐛 Bug fix**

- **@visactor/vтаблица**: поле с dot occor ошибка # 3409
- **@visactor/vтаблица**: getграфикInstance log vграфик updateViewBox method [#3442](https://github.com/VisActor/Vтаблица/issues/3442)
- **@visactor/vтаблица**: computeAxisкомпонентширина значение ceil [#3444](https://github.com/VisActor/Vтаблица/issues/3444)
- **@visactor/vтаблица**: fix сортировка функция в getCheckboxState() [#3394](https://github.com/VisActor/Vтаблица/issues/3394)



[more detail about v1.16.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.16.2)

# v1.16.1

2025-02-14


**🆕 новый feature**

- **@visactor/vтаблица**: add visibleOnHover setting для columnResize [#3349](https://github.com/VisActor/Vтаблица/issues/3349)
- **@visactor/vтаблица**: гантт barStyle support функция [#3364](https://github.com/VisActor/Vтаблица/issues/3364)

**🐛 Bug fix**

- **@visactor/vтаблица**: when rowHierarchyType is tree total значение показать на верх no work [#3322](https://github.com/VisActor/Vтаблица/issues/3322)
- **@visactor/vтаблица**: when column has пользовательский aggregation edit cell update [#3333](https://github.com/VisActor/Vтаблица/issues/3333)
- **@visactor/vтаблица**: progress will only support число не decimals [#3401](https://github.com/VisActor/Vтаблица/issues/3401)
- **@visactor/vтаблица**: отключить авто изменение размера column ширина when double Нажатьing the column граница line
- **@visactor/vтаблица**: fix bodyGroup frame update [#3404](https://github.com/VisActor/Vтаблица/issues/3404)
- **@visactor/vтаблица**: fix dom позиция в react-vтаблица [#3314](https://github.com/VisActor/Vтаблица/issues/3314)
- **@visactor/vтаблица**: fix groupBy judgement в getHierarchyState() [#3406](https://github.com/VisActor/Vтаблица/issues/3406)
- **@visactor/vтаблица**: fix сортировкаed флажок state [#3394](https://github.com/VisActor/Vтаблица/issues/3394)

**🔨 Refactor**

- **@visactor/vтаблица**: progressbar тип cell support пользовательскийLayou [#3295](https://github.com/VisActor/Vтаблица/issues/3295)
- **@visactor/vтаблица**: supplement тема frozen frameStyle граница create [#3400](https://github.com/VisActor/Vтаблица/issues/3400)

[more detail about v1.16.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.16.1)

# v1.16.0

2025-02-08


**🆕 новый feature**

- **@visactor/vтаблица**: support async в downloadCsv&downloadExcel
- **@visactor/vтаблица**: linkJump & linkDetect support функция
- **@visactor/vтаблица**: support react17 в пользовательскиймакет функция
- **@visactor/vтаблица**: add keepColumnширинаChange в vue-vтаблица [#3346](https://github.com/VisActor/Vтаблица/issues/3346)
- **@visactor/vтаблица**: add grid-tree mode для сводный таблица

**🐛 Bug fix**

- **@visactor/vтаблица-гантт**: when изменение размера гантт view размер should update dependency node размер [#3287](https://github.com/VisActor/Vтаблица/issues/3287)
- **@visactor/vтаблица-гантт**: изменение размера или move taskbar update record problem [#3321](https://github.com/VisActor/Vтаблица/issues/3321)
- **@visactor/vтаблица-гантт**: updateScales к quarter taskbar размер ошибка [#3348](https://github.com/VisActor/Vтаблица/issues/3348)
- **@visactor/vтаблица-гантт**: mouseover последний date граница occor ошибка для гантт [#3373](https://github.com/VisActor/Vтаблица/issues/3373)
- **@visactor/vтаблица**: fix clipped judgement в getCellOverflowText()
- **@visactor/vтаблица**: fix rowданные ошибка в media-Нажать [#3342](https://github.com/VisActor/Vтаблица/issues/3342)
- **@visactor/vтаблица**: fix header флажок state в functional cellType [#3334](https://github.com/VisActor/Vтаблица/issues/3334)
- **@visactor/vтаблица**: fix текст vertical макет [#3353](https://github.com/VisActor/Vтаблица/issues/3353)
- **@visactor/vтаблица**: fix merge cell style update в vтаблица-search [#3327](https://github.com/VisActor/Vтаблица/issues/3327)

**🔨 Refactor**

- **@visactor/vтаблица**: rowSeriesNumber cell can use тема headerStyle [#3362](https://github.com/VisActor/Vтаблица/issues/3362)



[more detail about v1.16.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.16.0)

# v1.15.2

2025-01-26

**🆕 новый feature**

- **@visactor/vтаблица**: dependполе&batType support функция в progress-bar

[more detail about v1.15.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.15.2)

# v1.15.1

2025-01-17

**🆕 новый feature**

- **@visactor/vтаблица**: add emptyTip Нажать событие
- **@visactor/vтаблица**: canvasширина canvasвысота support авто setting [#3089](https://github.com/VisActor/Vтаблица/issues/3089)
- **@visactor/vтаблица**: add данные update в список-таблица tree(group) mode
- **@visactor/vтаблица**: add groupTitleполеFormat апи [#3092](https://github.com/VisActor/Vтаблица/issues/3092)

**🐛 Bug fix**

- **@visactor/vтаблица-гантт**: when mouse leave гантт should trigger mouseleave_taskbar [#3294](https://github.com/VisActor/Vтаблица/issues/3294)
- **@visactor/vтаблица**: fix empty-tip макет problem when изменение размера window [#3312](https://github.com/VisActor/Vтаблица/issues/3312)
- **@visactor/vтаблица**: remove tree limit в handleTextStick() [#3274](https://github.com/VisActor/Vтаблица/issues/3274)

[more detail about v1.15.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.15.1)

# v1.15.0

2025-01-09

**🆕 новый feature**

- **@visactor/vтаблица**: support регистрация aggregator [#1508](https://github.com/VisActor/Vтаблица/issues/1508)
- **@visactor/vтаблица**: frozenColCount work в сводный таблица [#3201](https://github.com/VisActor/Vтаблица/issues/3201)
- **@visactor/vтаблица-гантт**: add moveToExtendDateRange option [#3221](https://github.com/VisActor/Vтаблица/issues/3221)
- **@visactor/vтаблица-гантт**: add keyboardOptions и add delete_dependency_link contextменю_dependency_link событие [#3268](https://github.com/VisActor/Vтаблица/issues/3268)
- **@visactor/vтаблица**: пользовательскийMergeCell support массив config [#3202](https://github.com/VisActor/Vтаблица/issues/3202)
- **@visactor/vтаблица**: add displayMode в emptyTip
- **@visactor/vтаблица**: groupby support массив config
- **@visactor/vтаблица**: add penetrateсобытиесписок config в react-компонент
- **@visactor/vтаблица**: add keepColumnширинаChange props в react-vтаблица
- **@visactor/vтаблица**: add imвозрастAnonymous в пользовательскийConfig
- **@visactor/vтаблица**: aggregationType пользовательский work в сводный таблица [#1508](https://github.com/VisActor/Vтаблица/issues/1508)

**🐛 Bug fix**

- **@visactor/vтаблица**: when columns is все скрыть then should не generate cell ids [#3199](https://github.com/VisActor/Vтаблица/issues/3199)
- **@visactor/vтаблица**: when header tree indicator node has different значение, columnширинаConfig не work [#3258](https://github.com/VisActor/Vтаблица/issues/3258)
- **@visactor/vтаблица-гантт**: when изменение размера taskBar ширина the текст label should update [#3263](https://github.com/VisActor/Vтаблица/issues/3263)
- **@visactor/vтаблица-гантт**: when лево таблица set автоширина гантт график render ошибка [#3266](https://github.com/VisActor/Vтаблица/issues/3266)
- **@visactor/vтаблица-гантт**: change taskRecord тип от строка к любой
- **@visactor/vтаблица**: fix aggregation display issue в tree-structured таблица headers
- **@visactor/vтаблица**: fix свернуть флажок state update [#3171](https://github.com/VisActor/Vтаблица/issues/3171)
- **@visactor/vтаблица**: clear сортировка target when setRecords в данныеset
- **@visactor/vтаблица**: fix frozen update problem в react-dom-компонент
- **@visactor/vтаблица**: fix iterator map в getCheckboxState() [#3177](https://github.com/VisActor/Vтаблица/issues/3177) [#3239](https://github.com/VisActor/Vтаблица/issues/3239)

**📖 Site / Документация update**

- **@visactor/vтаблица**: add weather календарь демонстрация
- **@visactor/vтаблица**: add scheduleCreaтаблица doc

[more detail about v1.15.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.15.0)

# v1.14.3

2024-12-27

**🆕 новый feature**

- **@visactor/vтаблица**: showсортировка support функция тип [#2630](https://github.com/VisActor/Vтаблица/issues/2630)
- **@visactor/vтаблица**: add скрыть для indicator setting [#2257](https://github.com/VisActor/Vтаблица/issues/2257) [#2451](https://github.com/VisActor/Vтаблица/issues/2451)
- **@visactor/vтаблица**: add enableTreeCheckbox config

**🐛 Bug fix**

- **@visactor/vтаблица**: fix borderLineширина массив config [#3183](https://github.com/VisActor/Vтаблица/issues/3183)
- **@visactor/vтаблица**: when set resizable false навести taskbar occor ошибка [#3189](https://github.com/VisActor/Vтаблица/issues/3189)

[more detail about v1.14.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.14.3)

# v1.14.1

2024-12-23

**🆕 новый feature**

- **@visactor/vтаблица-гантт**: add grid rowBackgroundColor и columnBackgroundColor weekendBackgroundColor [#3155](https://github.com/VisActor/Vтаблица/issues/3155)

**🐛 Bug fix**

- **@visactor/vтаблица-гантт**: гантт taskbar изменение размера ширина interaction can не limit one time unit [#3161](https://github.com/VisActor/Vтаблица/issues/3161)
- **@visactor/vтаблица**: fix axes count ошибка в seriesIds config

**🔨 Refactor**

- **@visactor/vтаблица**: add option таблицаSizeAntiJitter [#3160](https://github.com/VisActor/Vтаблица/issues/3160)

[more detail about v1.14.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.14.1)

# v1.14.0

2024-12-20

**🆕 новый feature**

- **@visactor/vтаблица-гантт**: add contextменю_task_bar событие [#3013](https://github.com/VisActor/Vтаблица/issues/3013)
- **@visactor/vтаблица-гантт**: add milestone тип [#3097](https://github.com/VisActor/Vтаблица/issues/3097)
- **@visactor/vтаблица**: add mergeCell функция к support more detailed conditions
- **@visactor/vтаблица**: support tickAlign в сводныйграфик
- **@visactor/vтаблица-гантт**: add updateMarkLine
- **@visactor/vтаблица**: add enums в validateValue из vтаблица-editor [#3039](https://github.com/VisActor/Vтаблица/issues/3039)

**🐛 Bug fix**

- **@visactor/vтаблица**: validateValue не promise case can не be recalled [#3144](https://github.com/VisActor/Vтаблица/issues/3144)
- **@visactor/vтаблица**: adjust прокрутка hot area limited на таблица group [#3152](https://github.com/VisActor/Vтаблица/issues/3152)
- **@visactor/vтаблица**: fix react-компонент update в tree таблица
- **@visactor/vтаблица**: fix пользовательскийStyle update не work [#3068](https://github.com/VisActor/Vтаблица/issues/3068)
- **@visactor/vтаблица**: fix шрифт-weight в vтаблица-export [#3005](https://github.com/VisActor/Vтаблица/issues/3005)
- **@visactor/vтаблица**: fix graphic html attribute ошибка
- **@visactor/vтаблица**: application define в react-vтаблица umd file [#3093](https://github.com/VisActor/Vтаблица/issues/3093)
- **@visactor/vтаблица**: fix пользовательскийRender ошибка в react-vтаблица [#3142](https://github.com/VisActor/Vтаблица/issues/3142)
- **@visactor/vтаблица**: fix group title link Нажать [#3022](https://github.com/VisActor/Vтаблица/issues/3022)
- **@visactor/vтаблица**: fix cell group judgement when прокрутка [#3149](https://github.com/VisActor/Vтаблица/issues/3149)
- **@visactor/vтаблица**: fix undeline высота в текст measurement [#3112](https://github.com/VisActor/Vтаблица/issues/3112)
- **@visactor/vтаблица**: change checkboxState into Map

**🔨 Refactor**

- **@visactor/vтаблица**: пользовательскийComputeRowвысота logic

[more detail about v1.14.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.14.0)

# v1.13.2

2024-12-16

**🆕 новый feature**

- **@visactor/vтаблица-гантт**: resizable и moveable support функция [#3074](https://github.com/VisActor/Vтаблица/issues/3074)
- **@visactor/vтаблица-гантт**: add updateOption и updateScales апи

**🐛 Bug fix**

- **@visactor/vтаблица**: copy permission check when в iframe [#3077](https://github.com/VisActor/Vтаблица/issues/3077)
- **@visactor/vтаблица**: when has выбрать cells к изменение размера col ширина или row высота ошибка [#3085](https://github.com/VisActor/Vтаблица/issues/3085)
- **@visactor/vтаблица-гантт**: consider не set mindate maxdate call setRecords апи

[more detail about v1.13.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.13.2)

# v1.13.1

2024-12-13

**🆕 новый feature**

- **@visactor/vтаблица-гантт**: add time scale unit hour [#2976](https://github.com/VisActor/Vтаблица/issues/2976)

**🐛 Bug fix**

- **@visactor/vтаблица-гантт**: лево таблица ширина handle с таблицаширина set авто [#3033](https://github.com/VisActor/Vтаблица/issues/3033)

[more detail about v1.13.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.13.1)

# v1.13.0

2024-12-09

**🆕 новый feature**

- **@visactor/vтаблица**: add keybord ctrlMultiSelect config [#2995](https://github.com/VisActor/Vтаблица/issues/2995)
- **@visactor/vтаблица**: add panelStyle&arrowStyle config в Popover [#2988](https://github.com/VisActor/Vтаблица/issues/2988)

**🐛 Bug fix**

- **@visactor/vтаблица**: выбрать не work when выбрать set disableSelect [#2981](https://github.com/VisActor/Vтаблица/issues/2981)
- **@visactor/vтаблица**: fix textAlign в флажок/переключатель [#2908](https://github.com/VisActor/Vтаблица/issues/2908)
- **@visactor/vтаблица**: outsideНажатьDeselect событие в меню element
- **@visactor/vтаблица**: fix col&row range в getCellMergeRange() [#2906](https://github.com/VisActor/Vтаблица/issues/2906)
- **@visactor/vтаблица**: fix merge cell выбрать range update [#2944](https://github.com/VisActor/Vтаблица/issues/2944)
- **@visactor/vтаблица**: fix списокTreeStickCellPlugin update в tree_hierarchy_state_change событие [#2914](https://github.com/VisActor/Vтаблица/issues/2914)
- **@visactor/vтаблица**: fix row update range в \_refreshHierarchyState() [#2987](https://github.com/VisActor/Vтаблица/issues/2987)
- **@visactor/vтаблица**: fix текст baseline align problem

[more detail about v1.13.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.13.0)

# v1.12.0

2024-12-03

**🆕 новый feature**

- **@visactor/vтаблица**: add option пользовательскийComputeRowвысота и defaultRowвысота can set "авто"
- **@visactor/vтаблица-гантт**: add taskShowMode для гантт график [#2849](https://github.com/VisActor/Vтаблица/issues/2849)

**🐛 Bug fix**

- **@visactor/vтаблица-гантт**: when edit record task date update taskbar occor ошибка [#2938](https://github.com/VisActor/Vтаблица/issues/2938)
- **@visactor/vтаблица**: fix последний col&row editor размер [#2926](https://github.com/VisActor/Vтаблица/issues/2926)
- **@visactor/vтаблица**: fix cell update событие problem в пользовательскийCellStylePlugin [#2927](https://github.com/VisActor/Vтаблица/issues/2927)
- **@visactor/vтаблица**: fix react-компонент в tree mode update
- **@visactor/vтаблица**: fix по умолчанию row высота в computeRowвысота() [#2903](https://github.com/VisActor/Vтаблица/issues/2903)
- **@visactor/vтаблица**: fix легенда видимый problem when reize таблица
- **@visactor/vтаблица**: fix cache problem в иконка.loadGif() [#2905](https://github.com/VisActor/Vтаблица/issues/2905)
- **@visactor/vтаблица**: fix merge переключатель cell check update [#2881](https://github.com/VisActor/Vтаблица/issues/2881)
- **@visactor/vтаблица**: fix strхорошоeArrayширина update в updateCell() [#2811](https://github.com/VisActor/Vтаблица/issues/2811)

**📖 Site / Документация update**

- **@visactor/vтаблица-гантт**: add getTaskBarRelativeRect апи [#2920](https://github.com/VisActor/Vтаблица/issues/2920)

[more detail about v1.12.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.12.0)

# v1.11.5

2024-11-29

**🆕 новый feature**

- **@visactor/vтаблица**: add @visactor/vтаблица-plugins packвозраст

**📖 Site / Документация update**

- **@visactor/vтаблица**: 更新进入或离开节点时的事件文档
- **@visactor/vтаблица**: 更新甘特图事件文档，暴露整个 e 的信息

[more detail about v1.11.5](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.11.5)

# v1.11.3

2024-11-28

**🐛 Bug fix**

- **@visactor/vтаблица**: frozen график не update when изменение размера row или column ширина [#2876](https://github.com/VisActor/Vтаблица/issues/2876)
- **@visactor/vтаблица**: fix пользовательский-компонент update в deleteRecords апи

**🔨 Refactor**

- **@visactor/vтаблица**: when columnширинаConfig set wrong dimensions should judge this case [#2948](https://github.com/VisActor/Vтаблица/issues/2948)

[more detail about v1.11.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.11.3)

# v1.11.2

2024-11-26

**🆕 новый feature**

- **@visactor/vтаблица**: add выбрать makeSelectCellVisible [#2840](https://github.com/VisActor/Vтаблица/issues/2840)
- **@visactor/vтаблица**: add setпользовательскийSelectRanges в stateManвозрастr [#2750](https://github.com/VisActor/Vтаблица/issues/2750) [#2845](https://github.com/VisActor/Vтаблица/issues/2845)
- **@visactor/vтаблица**: optimize range выбрать в HeaderHighlightPlugin
- **@visactor/vтаблица**: isShowOverflowTextПодсказка support функция
- **@visactor/vтаблица**: cell support multi-пользовательский-style [#2841](https://github.com/VisActor/Vтаблица/issues/2841)
- **@visactor/vтаблица**: templateLink support функция [#2847](https://github.com/VisActor/Vтаблица/issues/2847)
- **@visactor/vтаблица**: add позиция в Подсказка config [#2869](https://github.com/VisActor/Vтаблица/issues/2869)
- **@visactor/vтаблица**: add parentElement в меню option

**🐛 Bug fix**

- **@visactor/vтаблица**: add isValidatingValue state к fix call validateValue апи repeatedly [#2830](https://github.com/VisActor/Vтаблица/issues/2830)
- **@visactor/vтаблица**: when up на canvas blank area не перетаскивание позиция rightly [#2831](https://github.com/VisActor/Vтаблица/issues/2831)
- **@visactor/vтаблица**: when изменение размера column ширина the выбрать state be cleared [#2861](https://github.com/VisActor/Vтаблица/issues/2861)
- **@visactor/vтаблица**: when container изменение размера trigger mark line изменение размера [#2883](https://github.com/VisActor/Vтаблица/issues/2883)
- **@visactor/vтаблица**: when не set minDate maxDate call setRecords render ошибка [#2892](https://github.com/VisActor/Vтаблица/issues/2892)
- **@visactor/vтаблица**: fix cell граница dash update [#2818](https://github.com/VisActor/Vтаблица/issues/2818)
- **@visactor/vтаблица**: fix merge cell текст позиция [#2858](https://github.com/VisActor/Vтаблица/issues/2858)
- **@visactor/vтаблица**: fix functional заполнение update [#2774](https://github.com/VisActor/Vтаблица/issues/2774)
- **@visactor/vтаблица**: fix выбрать все в row-series-число флажок [#2880](https://github.com/VisActor/Vтаблица/issues/2880)

**🔨 Refactor**

- **@visactor/vтаблица**: when set headerSelectMode body перетаскивание column order should work [#2860](https://github.com/VisActor/Vтаблица/issues/2860)

[more detail about v1.11.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.11.2)

# v1.11.1

2024-11-21

**🆕 новый feature**

- **@visactor/vтаблица**: add setпользовательскийSelectRanges в stateManвозрастr [#2750](https://github.com/VisActor/Vтаблица/issues/2750) [#2845](https://github.com/VisActor/Vтаблица/issues/2845)
- **@visactor/vтаблица**: optimize range выбрать в HeaderHighlightPlugin
- **@visactor/vтаблица**: isShowOverflowTextПодсказка support функция

**🐛 Bug fix**

- **@visactor/vтаблица**: add isValidatingValue state к fix call validateValue апи repeatedly [#2830](https://github.com/VisActor/Vтаблица/issues/2830)
- **@visactor/vтаблица**: when up на canvas blank area не перетаскивание позиция rightly [#2831](https://github.com/VisActor/Vтаблица/issues/2831)
- **@visactor/vтаблица**: fix cell граница dash update [#2818](https://github.com/VisActor/Vтаблица/issues/2818)
- **@visactor/vтаблица**: fix merge cell текст позиция [#2858](https://github.com/VisActor/Vтаблица/issues/2858)

[more detail about v1.11.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.11.1)

# v1.11.0

2024-11-15

**🆕 новый feature**

- **@visactor/vтаблица**: add событие changing_header_position
- **@visactor/vтаблица-гантт**: перетаскивание order highlight line render
- **@visactor/vтаблица**: add change_header_position_fail событие
- **@visactor/vтаблица**: add argument recalculateColширинаs для апи toggleHierarchyState [#2817](https://github.com/VisActor/Vтаблица/issues/2817)
- **@visactor/vтаблица**: add InvertHighlightPlugin
- **@visactor/vтаблица**: add vтаблица-календарь

**🐛 Bug fix**

- **@visactor/vтаблица**: сводный график pie тип selected state не work [#2178](https://github.com/VisActor/Vтаблица/issues/2178)
- **@visactor/vтаблица**: rose сводныйграфик Нажать легенда then навести график render ошибка [#2209](https://github.com/VisActor/Vтаблица/issues/2209)
- **@visactor/vтаблица**: when график row is frozen render ошибка [#2800](https://github.com/VisActor/Vтаблица/issues/2800)
- **@visactor/vтаблица**: when after выбрать range не exist [#2804](https://github.com/VisActor/Vтаблица/issues/2804)
- **@visactor/vтаблица**: call renderWithRecreateCells should не effect colширина when ширинаMode is adaptive [#2835](https://github.com/VisActor/Vтаблица/issues/2835)
- **@visactor/vтаблица**: add CarouselAnimationPlugin
- **@visactor/vтаблица**: add HeaderHighlightPlugin

**🔨 Refactor**

- **@visactor/vтаблица**: when set disableSelect but апи selectCell can work [#2799](https://github.com/VisActor/Vтаблица/issues/2799)

[more detail about v1.11.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.11.0)

# v1.10.5

2024-11-11

**🐛 Bug fix**

- **@visactor/vтаблица**: сводный график spec включить выбрать не work [#2210](https://github.com/VisActor/Vтаблица/issues/2210)
- **@visactor/vтаблица**: сортировкаState поле undefined occor ошибка

[more detail about v1.10.5](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.10.5)

# v1.10.4

2024-11-07

**🆕 новый feature**

- **@visactor/vтаблица-гантт**: гантт dependency line support tree node [#2701](https://github.com/VisActor/Vтаблица/issues/2701)
- **@visactor/vтаблица**: when перетаскивание на header can выбрать cells continuous [#2751](https://github.com/VisActor/Vтаблица/issues/2751)

**🐛 Bug fix**

- **@visactor/vтаблица-гантт**: when markline date less then minDate should не показать [#2689](https://github.com/VisActor/Vтаблица/issues/2689)
- **@visactor/vтаблица**: сводный таблица header иконка display incorrect [#2735](https://github.com/VisActor/Vтаблица/issues/2735)
- **@visactor/vтаблица**: parse axes config ошибка when user set axes [#2749](https://github.com/VisActor/Vтаблица/issues/2749)
- **@visactor/vтаблица**: cellType set funciton occor ошибка [#2754](https://github.com/VisActor/Vтаблица/issues/2754)
- **@visactor/vтаблица**: when сводный cell тип set график не данные cell render ошибка [#2758](https://github.com/VisActor/Vтаблица/issues/2758)
- **@visactor/vтаблица**: легенда problems [#2764](https://github.com/VisActor/Vтаблица/issues/2764) [#2755](https://github.com/VisActor/Vтаблица/issues/2755)
- **@visactor/vтаблица-гантт**: create task shedule date ошибка [#2771](https://github.com/VisActor/Vтаблица/issues/2771)
- **@visactor/vтаблица**: fix cellLocation в сводный-таблица [#2694](https://github.com/VisActor/Vтаблица/issues/2694)
- **@visactor/vтаблица**: fix меню scale pos problem [#2734](https://github.com/VisActor/Vтаблица/issues/2734)
- **@visactor/vтаблица**: fix tree frozen row problem [#2619](https://github.com/VisActor/Vтаблица/issues/2619)

[more detail about v1.10.4](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.10.4)

# v1.10.3

2024-11-01

**🐛 Bug fix**

- **@visactor/vтаблица**: тип define columnширинаConfig

[more detail about v1.10.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.10.3)

# v1.10.2

2024-11-01

**🆕 новый feature**

- **@visactor/vтаблица**: headerSelectMode option add body setting [#2491](https://github.com/VisActor/Vтаблица/issues/2491)
- **@visactor/vтаблица**: add freeze_Нажать событие [#2641](https://github.com/VisActor/Vтаблица/issues/2641)
- **@visactor/vтаблица**: add columnширинаConfig к set ширина по dimensions [#2696](https://github.com/VisActor/Vтаблица/issues/2696)

**🐛 Bug fix**

- **@visactor/vтаблица**: isColumnHeader апи judement logic [#2491](https://github.com/VisActor/Vтаблица/issues/2491)
- **@visactor/vтаблица**: when свернуть последний group occor ошибка [#2600](https://github.com/VisActor/Vтаблица/issues/2600)
- **@visactor/vтаблица**: when свернуть tree node occor ошибка [#2600](https://github.com/VisActor/Vтаблица/issues/2600)
- **@visactor/vтаблица**: min aggregator тип handle с NaN значение [#2627](https://github.com/VisActor/Vтаблица/issues/2627)
- **@visactor/vтаблица**: when перетаскивание row series число cells не прокрутка [#2647](https://github.com/VisActor/Vтаблица/issues/2647)
- **@visactor/vтаблица**: rowSeriesNumber when be frozen can render пользовательскиймакет [#2653](https://github.com/VisActor/Vтаблица/issues/2653)
- **@visactor/vтаблица**: when has empty tip scrollbar can не be Нажатьed [#2690](https://github.com/VisActor/Vтаблица/issues/2690)
- **@visactor/vтаблица**: when поле set массив，record no corresponding поле，occur ошибка [#2702](https://github.com/VisActor/Vтаблица/issues/2702)
- **@visactor/vтаблица**: when has гантт и таблица same time internal тема should не be changed [#2708](https://github.com/VisActor/Vтаблица/issues/2708)
- **@visactor/vтаблица**: fix check state update [#2667](https://github.com/VisActor/Vтаблица/issues/2667)
- **@visactor/vтаблица**: fix список-editor space problem
- **@visactor/vтаблица**: change pointerupoutside событие обратный вызов [#2674](https://github.com/VisActor/Vтаблица/issues/2674) [#2659](https://github.com/VisActor/Vтаблица/issues/2659)
- **@visactor/vтаблица**: add событие в react-vтаблица
- **@visactor/vтаблица**: add selected_cell событие в выбрать-все [#2664](https://github.com/VisActor/Vтаблица/issues/2664)
- **@visactor/vтаблица**: fix disableRowSeriesNumberSelect в выбрать-все [#2665](https://github.com/VisActor/Vтаблица/issues/2665)
- **@visactor/vтаблица**: fix title изменение размера в adaptive mode [#2704](https://github.com/VisActor/Vтаблица/issues/2704)

**🔨 Refactor**

- **@visactor/vтаблица**: пользовательский merge cell ignore check state jude [#2683](https://github.com/VisActor/Vтаблица/issues/2683)
- **@visactor/vтаблица**: paste cell значение should use editor validateValidate апи [#2691](https://github.com/VisActor/Vтаблица/issues/2691)

[more detail about v1.10.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.10.2)

# v1.10.1

2024-10-23

**🐛 Bug fix**

- **@visactor/vтаблица**: when set rowSeriesNumber then сортировка иконка не update [#2643](https://github.com/VisActor/Vтаблица/issues/2643)
- **@visactor/vтаблица**: отключить cellInnerBorder when no frame граница

[more detail about v1.10.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.10.1)

# v1.10.0

2024-10-18

**🆕 новый feature**

- **@visactor/vтаблица**: add maxвысота в меню container [#2602](https://github.com/VisActor/Vтаблица/issues/2602)
- **@visactor/vтаблица**: add after_сортировка событие
- **@visactor/vтаблица-гантт**: add creation buttom для не schedualed task record
- **@visactor/vтаблица-гантт**: add dependency line для гантт график
- **@visactor/vтаблица-гантт**: add task bar selected style
- **@visactor/vтаблица-гантт**: add dependency line selected style
- **@visactor/vтаблица-гантт**: add underlayBackgroundColor для гантт график [#2607](https://github.com/VisActor/Vтаблица/issues/2607)

**🐛 Bug fix**

- **@visactor/vтаблица**: when dimension paths has virtual не identify problem [#2510](https://github.com/VisActor/Vтаблица/issues/2510)
- **@visactor/vтаблица**: toggleHierarchyState апи can не update пользовательскиймакет cell [#2609](https://github.com/VisActor/Vтаблица/issues/2609)
- **@visactor/vтаблица**: fix легенда макет problem
- **@visactor/vтаблица**: fix граница rect missing when borderLineширина is 0
- **@visactor/vтаблица**: fix multi-сортировка иконка update в updateсортировкаState() [#2614](https://github.com/VisActor/Vтаблица/issues/2614)
- **@visactor/vтаблица**: fix col/row конец в createGroupForFirstScreen() [#2585](https://github.com/VisActor/Vтаблица/issues/2585)
- **@visactor/vтаблица**: fix пользовательскийConfig в react-vтаблица
- **@visactor/vтаблица**: fix row изменение размера mark позиция when scrolled vertically [#2606](https://github.com/VisActor/Vтаблица/issues/2606)
- **@visactor/vтаблица**: fix сортировка иконка update в transpose список-таблица

[more detail about v1.10.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.10.0)

# v1.9.1

2024-10-12

**🐛 Bug fix**

- **@visactor/vтаблица**: fix сортировка иконка update в merge cell

[more detail about v1.9.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.9.1)

# v1.9.0

2024-10-11

**🆕 новый feature**

- **@visactor/vтаблица**: add scrollTo animation функция

**🐛 Bug fix**

- **@visactor/vтаблица**: when dimension set ширина авто but no records, the col ширина не compute [#2515](https://github.com/VisActor/Vтаблица/issues/2515)
- **@visactor/vтаблица**: when call updateColumns should update aggregation [#2519](https://github.com/VisActor/Vтаблица/issues/2519)
- **@visactor/vтаблица**: change outsideНажатьDeselect trigger time when pointerdown [#2553](https://github.com/VisActor/Vтаблица/issues/2553)
- **@visactor/vтаблица**: when сортировка с row series число occor ошибка [#2558](https://github.com/VisActor/Vтаблица/issues/2558)
- **@visactor/vтаблица**: fix выбрать авто-прокрутка в низ [#2546](https://github.com/VisActor/Vтаблица/issues/2546)
- **@visactor/vтаблица**: fix авто размер в react пользовательский компонент
- **@visactor/vтаблица**: fix пользовательский компонент flash when cell resizes [#2516](https://github.com/VisActor/Vтаблица/issues/2516)
- **@visactor/vтаблица**: fix пользовательский компонент в forzen cell [#2568](https://github.com/VisActor/Vтаблица/issues/2568)
- **@visactor/vтаблица**: fix легенда с заполнение макет размер
- **@visactor/vтаблица**: fix cellLocation в createComplexColumn [#2517](https://github.com/VisActor/Vтаблица/issues/2517)
- **@visactor/vтаблица**: fix merge cell выбрать range [#2521](https://github.com/VisActor/Vтаблица/issues/2521)

**🔨 Refactor**

- **@visactor/vтаблица**: when значение is promise cell style функция should await [#2549](https://github.com/VisActor/Vтаблица/issues/2549)

[more detail about v1.9.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.9.0)

# v1.8.2

2024-10-08

**🐛 Bug fix**

- **@visactor/vтаблица**: fix richtext иконка update [#2281](https://github.com/VisActor/Vтаблица/issues/2281)

[more detail about v1.8.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.8.2)

# v1.8.1

2024-09-30

**🔨 Refactor**

- **@visactor/vue-vтаблица**: reимя vue компонент имя

[more detail about v1.8.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.8.1)

# v1.8.0

2024-09-29

**🆕 новый feature**

- **@visactor/vue-vтаблица**: add vue-vтаблица

**🐛 Bug fix**

- **@visactor/vтаблица**: fix estimate позиция в updateавтоRow() [#2494](https://github.com/VisActor/Vтаблица/issues/2494)
- **@visactor/vтаблица**: fix перетаскивание check state update [#2518](https://github.com/VisActor/Vтаблица/issues/2518)
- **@visactor/vтаблица**: fix group cell в vтаблица-export [#2487](https://github.com/VisActor/Vтаблица/issues/2487)
- **@visactor/vтаблица**: fix react компонент update problem when изменение размера column
- **@visactor/vтаблица**: add functionalиконкаsStyle на тема [#1308](https://github.com/VisActor/Vтаблица/issues/1308)

[more detail about v1.8.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.8.0)

[more detail about v1.7.9](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.9)

# v1.7.8

2024-09-24

**🆕 новый feature**

- **@visactor/vтаблица**: handle с пользовательскийTree в данныеset file к refactor processRecord функция [#2279](https://github.com/VisActor/Vтаблица/issues/2279)
- **@visactor/vтаблица**: add async support в vтаблица-export [#2460](https://github.com/VisActor/Vтаблица/issues/2460)

**🐛 Bug fix**

- **@visactor/vтаблица**: пользовательский total значение не work [#2455](https://github.com/VisActor/Vтаблица/issues/2455)
- **@visactor/vтаблица**: adjust сортировка иконка up и down [#2465](https://github.com/VisActor/Vтаблица/issues/2465)
- **@visactor/vтаблица**: when текущий edit не exit, could не trigger новый edit cell [#2469](https://github.com/VisActor/Vтаблица/issues/2469)
- **@visactor/vтаблица**: when no records edit cell значение occor ошибка [#2474](https://github.com/VisActor/Vтаблица/issues/2474)
- **@visactor/vтаблица**: set aggregation на option не work [#2459](https://github.com/VisActor/Vтаблица/issues/2459)
- **@visactor/vтаблица**: fix cell граница clip в 'низ-право' borde mode [#2442](https://github.com/VisActor/Vтаблица/issues/2442)
- **@visactor/vтаблица**: add children === true hierarchyState в initChildrenNodeHierarchy()
- **@visactor/vтаблица**: fix пользовательский компонент frozen update [#2432](https://github.com/VisActor/Vтаблица/issues/2432)
- **@visactor/vтаблица**: when изменение размера trigger Нажать_cell событие
- **@visactor/vтаблица**: fix proxy.colStart update в resetFrozen() [#2464](https://github.com/VisActor/Vтаблица/issues/2464)
- **@visactor/vтаблица**: add '——' в specialCharSet [#2470](https://github.com/VisActor/Vтаблица/issues/2470)

**🔨 Refactor**

- **@visactor/vтаблица**: update aggregator when update records [#2459](https://github.com/VisActor/Vтаблица/issues/2459)

[more detail about v1.7.8](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.8)

# v1.7.7

2024-09-13

**🔨 功能重构**

- **@visactor/vтаблица**: гантт project export vтаблица и vrender

[更多详情请查看 v1.7.7](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.7)

# v1.7.6

2024-09-12

**🐛 Bug fix**

- **@visactor/vтаблица-гантт**: fix: set таблица тема ошибка в гантт график [#2439](https://github.com/VisActor/Vтаблица/pull/2439)

[more detail about v1.7.6](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.6)

# v1.7.5

2024-09-12

**🆕 новый feature**

- **@visactor/vтаблица**: add getFilteredRecords апи [#2255](https://github.com/VisActor/Vтаблица/issues/2255)

**🐛 Bug fix**

- **@visactor/vтаблица**: выбрать range Нажать outside не отмена выбрать [#2355](https://github.com/VisActor/Vтаблица/issues/2355)
- **@visactor/vтаблица**: split line позиция fix [#2392](https://github.com/VisActor/Vтаблица/issues/2392)
- **@visactor/vтаблица**: levelSpan case front columnNode merge range ошибка [#2359](https://github.com/VisActor/Vтаблица/issues/2359)
- **@visactor/vтаблица**: judge значение is valid [#2402](https://github.com/VisActor/Vтаблица/issues/2402)
- **@visactor/vтаблица**: mousedown график go dealSelectCell и rerender it [#2419](https://github.com/VisActor/Vтаблица/issues/2419)
- **@visactor/vтаблица**: fix axis размер и макет [#2256](https://github.com/VisActor/Vтаблица/issues/2256)
- **@visactor/vтаблица**: fix series число в список-group [#2425](https://github.com/VisActor/Vтаблица/issues/2425)
- **@visactor/vтаблица**: fix recordIndex config из addRecord в список-group [#2426](https://github.com/VisActor/Vтаблица/issues/2426)

[more detail about v1.7.5](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.5)

# v1.7.4

2024-09-09

**🆕 новый feature**

- **@visactor/vтаблица**: add updateFilterRules апи [#2245](https://github.com/VisActor/Vтаблица/issues/2245)

**🐛 Bug fix**

- **@visactor/vтаблица**: when tree сводный таблица сортировка then развернуть tree node render ошибка [#2261](https://github.com/VisActor/Vтаблица/issues/2261)
- **@visactor/vтаблица**: fix interactive layer dom clear problem
- **@visactor/vтаблица**: when no records corner header показать dimention title [#2247](https://github.com/VisActor/Vтаблица/issues/2247)
- **@visactor/vтаблица**: fix sparkline range when данные has null

[more detail about v1.7.4](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.4)

# v1.7.3

2024-09-05

**🐛 Bug fix**

- **@visactor/vтаблица**: when keydown с ctrl meta и shift не trigger edit mode # 2372
- **@visactor/vтаблица**: fix пользовательский style arrangement duplicate [#2370](https://github.com/VisActor/Vтаблица/issues/2370)
- **@visactor/vтаблица**: fix no-текст cell пользовательский merge [#2343](https://github.com/VisActor/Vтаблица/issues/2343)
- **@visactor/vтаблица**: fix событие bind problem в react-vтаблица
- **@visactor/vтаблица**: fix право frozen mark позиция [#2344](https://github.com/VisActor/Vтаблица/issues/2344)
- **@visactor/vтаблица**: fix выбрать range judgement в cellBgColor [#2368](https://github.com/VisActor/Vтаблица/issues/2368)

[more detail about v1.7.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.3)

# v1.7.2

2024-09-02

**🐛 Bug fix**

- **@visactor/vтаблица**: when use groupBy then все merged cells set cellType текст [#2331](https://github.com/VisActor/Vтаблица/issues/2331)

[more detail about v1.7.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.2)

# v1.7.1

2024-09-02

**🐛 Bug fix**

- **@visactor/react-vтаблица**: fix envs тип в react-vтаблица

[more detail about v1.7.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.7.1)

# v1.7.0

2024-08-30

**🆕 новый feature**

- **@visactor/vтаблица-гантт**: add гантт график

# v1.6.3

2024-08-29

**🆕 новый feature**

- **@visactor/vтаблица**: add formatCopyValue config
- **@visactor/vтаблица**: add parentElement config в Подсказка [#2290](https://github.com/VisActor/Vтаблица/issues/2290)

**🐛 Bug fix**

- **@visactor/vтаблица**: handle с change header postion событие [#2299](https://github.com/VisActor/Vтаблица/issues/2299)
- **@visactor/vтаблица**: сводный tree can не показать значение и развернуть tree occor ошибка [#2306](https://github.com/VisActor/Vтаблица/issues/2306)
- **@visactor/vтаблица**: set titleOnDimension все сортировка can не run [#2278](https://github.com/VisActor/Vтаблица/issues/2278)
- **@visactor/vтаблица**: add judgement в массив find функция [#2289](https://github.com/VisActor/Vтаблица/issues/2289)
- **@visactor/vтаблица**: fix frozen column пользовательский компонент clip
- **@visactor/vтаблица**: fix cellLocation в верх frozen row [#2267](https://github.com/VisActor/Vтаблица/issues/2267)
- **@visactor/vтаблица**: fix список-таблица group mode style update problem
- **@visactor/vтаблица**: fix меню авто скрыть when pвозраст crolled [#2241](https://github.com/VisActor/Vтаблица/issues/2241)
- **@visactor/vтаблица**: fix progress bar cell textAlign update [#2225](https://github.com/VisActor/Vтаблица/issues/2225)
- **@visactor/vтаблица**: fix umd packвозраст problem в react-vтаблица [#2244](https://github.com/VisActor/Vтаблица/issues/2244)
- **@visactor/vтаблица**: fix право frozen размер в updateContainerAttrширинаAndX() [#2243](https://github.com/VisActor/Vтаблица/issues/2243)
- **@visactor/vтаблица**: fix leftRowSeriesNumberColumnCount ошибка в getBodyмакетRangeById() [#2234](https://github.com/VisActor/Vтаблица/issues/2234)
- **@visactor/vтаблица**: fix frozen column пользовательский компонент clip
- **@visactor/vтаблица**: fix меню авто скрыть when pвозраст crolled [#2241](https://github.com/VisActor/Vтаблица/issues/2241)

**🔨 Refactor**

- **@visactor/vтаблица**: прокрутка событие add argument [#2249](https://github.com/VisActor/Vтаблица/issues/2249)
- **@visactor/vтаблица**: changeCellValue can modify raw record [#2305](https://github.com/VisActor/Vтаблица/issues/2305)

[more detail about v1.6.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.6.3)

# v1.6.1

2024-08-19

**💥 Breaking change**

- **@visactor/react-vтаблица**: remove `Vтаблица` export в `react-vтаблица`, if you want к use `Vтаблица`, please add и import it от `@visactor/vтаблица` в the same version.
- **@visactor/react-vтаблица**: remove `VRender` export в `vтаблица`, if you want к use `VRender`, import it от `@visactor/vтаблица/es/vrender`.

**🆕 новый feature**

- **@visactor/vтаблица**: add option forceShowHeader
- **@visactor/vтаблица**: frameStyle cornerRadius support массив тип [#2207](https://github.com/VisActor/Vтаблица/issues/2207)
- **@visactor/vтаблица**: add таблица releated компонентs в react-vтаблица
- **@visactor/vтаблица**: add enum в textStick config
- **@visactor/vтаблица**: add frozenRowCount в transpose таблица [#2182](https://github.com/VisActor/Vтаблица/issues/2182)
- **@visactor/vтаблица**: add excelJSWorksheetCallback config в vтаблица-export
- **@visactor/vтаблица**: add group функция

**🐛 Bug fix**

- **@visactor/vтаблица**: corner header display dimension имя в некоторые case [#2180](https://github.com/VisActor/Vтаблица/issues/2180)
- **@visactor/vтаблица**: frameStyle borrerLineширина set массив, таблица render positon ошибка [#2200](https://github.com/VisActor/Vтаблица/issues/2200)
- **@visactor/vтаблица**: fix иконка отступ ошибка в update размер [#2206](https://github.com/VisActor/Vтаблица/issues/2206)
- **@visactor/vтаблица**: fix react пользовательский макет компонент container высота
- **@visactor/vтаблица**: fix jsx пользовательскиймакет размер compute mode [#2192](https://github.com/VisActor/Vтаблица/issues/2192)
- **@visactor/vтаблица**: add по умолчанию цвет в vтаблица-export
- **@visactor/vтаблица**: fix row-series cell тип [#2188](https://github.com/VisActor/Vтаблица/issues/2188)

**🔨 Refactor**

- **@visactor/vтаблица**: supplement backgroundColor для editor [#1518](https://github.com/VisActor/Vтаблица/issues/1518)

[more detail about v1.6.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.6.1)

# v1.5.6

2024-08-08

**🆕 новый feature**

- **@visactor/vтаблица**: add canvas & viewbox config

**🐛 Bug fix**

- **@visactor/vтаблица**: fix Релизd async problem [#2145](https://github.com/VisActor/Vтаблица/issues/2145)

[more detail about v1.5.6](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.5.6)

# v1.5.4

2024-08-02

**🆕 новый feature**

- **@visactor/vтаблица**: сводный таблица corner cell support иконка [#2120](https://github.com/VisActor/Vтаблица/issues/2120)
- **@visactor/vтаблица**: support editCellTrigger set keydown [#2136](https://github.com/VisActor/Vтаблица/issues/2136)
- **@visactor/vтаблица**: add react-компонент для option-emptyTip
- **@visactor/vтаблица**: add react-компонент для option-emptyTip - демонстрация
- **@visactor/vтаблица**: add escape config в csv-exporter
- **@visactor/vтаблица**: add selectionFillMode config в тема.selectionStyle [#2132](https://github.com/VisActor/Vтаблица/issues/2132) [#2027](https://github.com/VisActor/Vтаблица/issues/2027)

**🐛 Bug fix**

- **@visactor/vтаблица**: set сортировка rule occor ошибка [#2106](https://github.com/VisActor/Vтаблица/issues/2106)
- **@visactor/vтаблица**: clearSelected апи clear ctrl+a граница [#2115](https://github.com/VisActor/Vтаблица/issues/2115)
- **@visactor/vтаблица**: move header позиция не work не trigger change_header_position событие [#2129](https://github.com/VisActor/Vтаблица/issues/2129)
- **@visactor/vтаблица**: set cellType is функция, изменение размера col ширина график размер render ошибка [#2160](https://github.com/VisActor/Vтаблица/issues/2160)
- **@visactor/vтаблица**: when call setRowвысота should update график размер [#2155](https://github.com/VisActor/Vтаблица/issues/2155)
- **@visactor/vтаблица**: fix cell range clear в update record
- **@visactor/vтаблица**: fix пользовательский-element update problem [#2126](https://github.com/VisActor/Vтаблица/issues/2126)
- **@visactor/vтаблица**: fix пользовательскийMege cell update
- **@visactor/vтаблица**: fix CellContent pickable config [#2134](https://github.com/VisActor/Vтаблица/issues/2134)
- **@visactor/vтаблица**: fix легенда видимый config [#2137](https://github.com/VisActor/Vтаблица/issues/2137)
- **@visactor/vтаблица**: fix Релизd async problem [#2145](https://github.com/VisActor/Vтаблица/issues/2145)
- **@visactor/vтаблица**: remove resizing update в endResizeCol() [#2101](https://github.com/VisActor/Vтаблица/issues/2101)

[more detail about v1.5.4](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.5.4)

# v1.5.3

2024-07-19

**🆕 новый feature**

- **@visactor/vтаблица**: add param значение для startEditCell апи [#2089](https://github.com/VisActor/Vтаблица/issues/2089)

**🐛 Bug fix**

- **@visactor/vтаблица**: fix option config в vтаблица-export

[more detail about v1.5.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.5.3)

# v1.5.2

2024-07-15

**🆕 новый feature**

- **@visactor/vтаблица**: add апи disableScroll и enableScroll [#2073](https://github.com/VisActor/Vтаблица/issues/2073)
- **@visactor/vтаблица**: add renderDefault prop в react пользовательскиймакет компонент
- **@visactor/vтаблица**: support multiple columns tag в react-vтаблица

**🐛 Bug fix**

- **@visactor/vтаблица**: edit апи validateValue support async
- **@visactor/vтаблица**: апи changeполеValue occor errow when records has null [#2067](https://github.com/VisActor/Vтаблица/issues/2067)
- **@visactor/vтаблица**: fix react компонент ошибка в updateCell() [#2038](https://github.com/VisActor/Vтаблица/issues/2038)
- **@visactor/vтаблица**: fix axes по умолчанию config в scatter график [#2071](https://github.com/VisActor/Vтаблица/issues/2071)

[more detail about v1.5.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.5.2)

# v1.5.1

2024-07-10

**🐛 Bug fix**

- **@visactor/vтаблица**: getCellAtRelativePosition апи возврат значение [#2054](https://github.com/VisActor/Vтаблица/issues/2054)
- **@visactor/vтаблица**: add tolerance для прокрутка в \_disableColumnAndRowSizeRound mode

[more detail about v1.5.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.5.1)

# v1.5.0

2024-07-05

**🆕 новый feature**

- **@visactor/vтаблица**: add showMoverLine и hiдемонстрацияverLine апи [#2009](https://github.com/VisActor/Vтаблица/issues/2009)
- **@visactor/vтаблица**: add formatExcelJSCell config в vтаблица-export [#1989](https://github.com/VisActor/Vтаблица/issues/1989)
- **@visactor/vтаблица**: optimize packвозраст размер & add load на demand feature

**🐛 Bug fix**

- **@visactor/vтаблица**: сводный график выбрать state [#2017](https://github.com/VisActor/Vтаблица/issues/2017)
- **@visactor/vтаблица**: отключить выбрать и edit ввод should move when ввод is outside из таблица [#2039](https://github.com/VisActor/Vтаблица/issues/2039)
- **@visactor/vтаблица**: последний column изменение размера ширина ошибка [#2040](https://github.com/VisActor/Vтаблица/issues/2040)
- **@visactor/vтаблица**: fix test judgement в пользовательскийMergeCell [#2031](https://github.com/VisActor/Vтаблица/issues/2031)
- **@visactor/vтаблица**: fix selected highlight update when scrolling [#2028](https://github.com/VisActor/Vтаблица/issues/2028)
- **@visactor/vтаблица**: fix выбрать-rect update when прокрутка [#2015](https://github.com/VisActor/Vтаблица/issues/2015)
- **@visactor/vтаблица**: fix frozen cell update problem в сортировка [#1997](https://github.com/VisActor/Vтаблица/issues/1997)

[more detail about v1.5.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.5.0)

# v1.4.2

2024-07-05

**🆕 новый feature**

- **@visactor/vтаблица**: corner title can display row и column diemensionTitle [#1926](https://github.com/VisActor/Vтаблица/issues/1926)
- **@visactor/vтаблица**: add column скрыть config [#1991](https://github.com/VisActor/Vтаблица/issues/1991)
- **@visactor/vтаблица**: add getCellAtRelativePosition апи

**🐛 Bug fix**

- **@visactor/vтаблица**: when не exit edit state then can не выбрать other cells [#1974](https://github.com/VisActor/Vтаблица/issues/1974)
- **@visactor/vтаблица**: selected_clear событие trigger [#1981](https://github.com/VisActor/Vтаблица/issues/1981)
- **@visactor/vтаблица**: сводныйтаблица virtual node edit значение не work [#2002](https://github.com/VisActor/Vтаблица/issues/2002)
- **@visactor/vтаблица**: Подсказка content can не be selected [#2003](https://github.com/VisActor/Vтаблица/issues/2003)
- **@visactor/vтаблица**: fix vrender export module
- **@visactor/vтаблица**: fix merge cell update Производительность problem [#1972](https://github.com/VisActor/Vтаблица/issues/1972)
- **@visactor/vтаблица**: fix regexp format для webpack 3 [#2005](https://github.com/VisActor/Vтаблица/issues/2005)
- **@visactor/vтаблица**: fix ширина computation в shrinkSparklineFirst mode

**🔨 Refactor**

- **@visactor/vтаблица**: sparkline cellType set aggregationType никто автоmatically [#1999](https://github.com/VisActor/Vтаблица/issues/1999)

[more detail about v1.4.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.4.2)

# v1.4.0

2024-06-21

**🆕 новый feature**

- **@visactor/vтаблица**: support corner header cell edit значение [#1945](https://github.com/VisActor/Vтаблица/issues/1945)
- **@visactor/vтаблица**: add indent в vтаблица-export
- **@visactor/vтаблица**: add пользовательскийкомпонент в react-vтаблица
- **@visactor/vтаблица**: add пользовательскиймакет компонент в react-vтаблица
- **@visactor/vтаблица**: support calculate поле для сводныйтаблица [#1941](https://github.com/VisActor/Vтаблица/issues/1941)

**🐛 Bug fix**

- **@visactor/vтаблица**: updateсортировкаState апи occor ошибка [#1939](https://github.com/VisActor/Vтаблица/issues/1939)
- **@visactor/vтаблица**: when setRecords should update emptyTip [#1953](https://github.com/VisActor/Vтаблица/issues/1953)
- **@visactor/vтаблица**: getCellRect апи when cell is frozen get bounds ошибка [#1955](https://github.com/VisActor/Vтаблица/issues/1955)
- **@visactor/vтаблица**: when перетаскивание cell и enter edit state but can не exit edit rightly [#1956](https://github.com/VisActor/Vтаблица/issues/1956)
- **@visactor/vтаблица**: fix пользовательский ширина problem [#1905](https://github.com/VisActor/Vтаблица/issues/1905)
- **@visactor/vтаблица**: fix content judgement в getCellRange() [#1911](https://github.com/VisActor/Vтаблица/issues/1911)
- **@visactor/vтаблица**: fix размер update problem в сводный таблица сортировка [#1958](https://github.com/VisActor/Vтаблица/issues/1958)

**🔧 Configuration releated**

- **@visactor/vтаблица**: update vrender version

[more detail about v1.4.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.4.0)

# v1.3.2

2024-06-17

**🆕 новый feature**

- **@visactor/vтаблица**: add blankAreaНажатьDeselect и outsideНажатьDeselect config

**🐛 Bug fix**

- **@visactor/vтаблица**: cellIsInVisualView апи ошибка [#1864](https://github.com/VisActor/Vтаблица/issues/1864)
- **@visactor/vтаблица**: if set style автоWrapText, this config не wort when изменение размера column ширина [#1892](https://github.com/VisActor/Vтаблица/issues/1892)

**🔨 Refactor**

- **@visactor/vтаблица**: Подсказка support прокрутка [#1887](https://github.com/VisActor/Vтаблица/issues/1887)
- **@visactor/vтаблица**: when не records сводный таблица can показать corner header [#1895](https://github.com/VisActor/Vтаблица/issues/1895)
- **@visactor/vтаблица**: when rowTree children не set значение can supplement indicators [#1924](https://github.com/VisActor/Vтаблица/issues/1924)

[more detail about v1.3.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.3.2)

# v1.3.1

2024-06-14

**🐛 Bug fix**

- **@visactor/vтаблица**: fix frozenColCount large than colCount ошибка [#1872](https://github.com/VisActor/Vтаблица/issues/1872)
- **@visactor/vтаблица**: fix merge cell размер update [#1869](https://github.com/VisActor/Vтаблица/issues/1869)
- **@visactor/vтаблица**: optimize row высота update when useOneRowвысотаFillAll

**📖 Site / Документация update**

- **@visactor/vтаблица**: update changlog из rush

[more detail about v1.3.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.3.1)

# v1.3.0

2024-06-12

**🆕 новый feature**

- **@visactor/vтаблица**: add ignoreиконка&formatExportOutput config в vтаблица-export [#1813](https://github.com/VisActor/Vтаблица/issues/1813)
- **@visactor/vтаблица**: add textArea editor
- **@visactor/vтаблица**: add strхорошоeColor style [#1847](https://github.com/VisActor/Vтаблица/issues/1847)
- **@visactor/vтаблица**: add dx&dy в title компонент [#1874](https://github.com/VisActor/Vтаблица/issues/1874)
- **@visactor/vтаблица**: add shrinkSparklineFirst config [#1862](https://github.com/VisActor/Vтаблица/issues/1862)
- **@visactor/vтаблица**: Подсказка disappear delay time [#1848](https://github.com/VisActor/Vтаблица/issues/1848)
- **@visactor/vтаблица**: add сортировка config для сводныйтаблица [#1865](https://github.com/VisActor/Vтаблица/issues/1865)

**🐛 Bug fix**

- **@visactor/vтаблица**: иконка inlineEnd inlineFront x позиция compute ошибка [#1882](https://github.com/VisActor/Vтаблица/issues/1882)
- **@visactor/vтаблица**: drill down иконка can не be Нажать [#1899](https://github.com/VisActor/Vтаблица/issues/1899)
- **@visactor/vтаблица**: fix frozenColCount large than colCount ошибка [#1872](https://github.com/VisActor/Vтаблица/issues/1872)
- **@visactor/vтаблица**: fix ellipsis ошибка в \_disableColumnAndRowSizeRound mode [#1884](https://github.com/VisActor/Vтаблица/issues/1884)

**🔨 Refactor**

- **@visactor/vтаблица**: memory Релиз logic optimization [#1856](https://github.com/VisActor/Vтаблица/issues/1856)
- **@visactor/vтаблица**: arrow key с shift ctrl key к выбрать cells [#1873](https://github.com/VisActor/Vтаблица/issues/1873)

[more detail about v1.3.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.3.0)

# v1.2.0

2024-06-06

**🆕 новый feature**

- **@visactor/vтаблица**: support выбрать highlightMode effect [#1167](https://github.com/VisActor/Vтаблица/issues/1167)
- **@visactor/vтаблица**: add isAggregation апи [#1803](https://github.com/VisActor/Vтаблица/issues/1803)
- **@visactor/vтаблица**: optimize large column Производительность [#1840](https://github.com/VisActor/Vтаблица/issues/1840) [#1824](https://github.com/VisActor/Vтаблица/issues/1824)
- **@visactor/vтаблица**: add merge cell пользовательский graphic attribute sync [#1718](https://github.com/VisActor/Vтаблица/issues/1718)

**🐛 Bug fix**

- **@visactor/vтаблица**: when has no records should не has aggregation row [#1804](https://github.com/VisActor/Vтаблица/issues/1804)
- **@visactor/vтаблица**: updateColumns set editor ошибка [#1828](https://github.com/VisActor/Vтаблица/issues/1828)
- **@visactor/vтаблица**: fix maxCharactersNumber effect [#1830](https://github.com/VisActor/Vтаблица/issues/1830)

**🔨 Refactor**

- **@visactor/vтаблица**: update pixelRatio when изменение размера [#1823](https://github.com/VisActor/Vтаблица/issues/1823)
- **@visactor/vтаблица**: selectAllOnCtrlA option

**🔧 Configuration releated**

- **@visactor/vтаблица**: update vrender version

[more detail about v1.2.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.2.0)

# v1.1.2

2024-06-04

**🔧 Configuration releated**

- **@visactor/vтаблица**: update vrender version

[more detail about v1.1.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.1.2)

# v1.1.1

2024-05-30

**🐛 Bug fix**

- **@visactor/vтаблица**: when set emptyTip interaction не work well с has records [#1818](https://github.com/VisActor/Vтаблица/issues/1818)
- **@visactor/vтаблица**: fix таблица frame corner radius display problem [#1783](https://github.com/VisActor/Vтаблица/issues/1783)

**🔨 Refactor**

- **@visactor/vтаблица**: dimension значение same с indicator key cell значение ошибка [#1817](https://github.com/VisActor/Vтаблица/issues/1817)

[more detail about v1.1.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.1.1)

# v1.1.0

2024-05-28

**🆕 новый feature**

- **@visactor/vтаблица**: add empty tip [#1782](https://github.com/VisActor/Vтаблица/issues/1782)

**🐛 Bug fix**

- **@visactor/vтаблица**: add update delete record апи should maintain beforeChangedRecordsMap [#1780](https://github.com/VisActor/Vтаблица/issues/1780)
- **@visactor/vтаблица**: when set disableSelect таблица should support перетаскивание header [#1800](https://github.com/VisActor/Vтаблица/issues/1800)
- **@visactor/vтаблица**: fix tree create problem в getданныеCellPath()
- **@visactor/vтаблица**: fix лево axis index в horizontal сводный график

[more detail about v1.1.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.1.0)

# v1.0.3

2024-05-24

**🐛 Bug fix**

- **@visactor/vтаблица**: первый col tree mode compute col ширина ошибка [#1778](https://github.com/VisActor/Vтаблица/issues/1778)

**🔨 Refactor**

- **@visactor/vтаблица**: легендаs support ser массив form [#1740](https://github.com/VisActor/Vтаблица/issues/1740)

[more detail about v1.0.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.0.3)

# v1.0.2

2024-05-24

**🆕 новый feature**

- **@visactor/vтаблица**: add setRowвысота&setColширина апи

**🐛 Bug fix**

- **@visactor/vтаблица**: use таблица option в hasавтоImвозрастColumn()
- **@visactor/vтаблица**: axis размер align с vrender-компонент [#1784](https://github.com/VisActor/Vтаблица/issues/1784)
- **@visactor/vтаблица**: fix lineClamp config в computeRowsвысота() [#1772](https://github.com/VisActor/Vтаблица/issues/1772)
- **@visactor/vтаблица**: fix progress cell create problem в vтаблица-export [#1787](https://github.com/VisActor/Vтаблица/issues/1787)
- **@visactor/vтаблица**: ignore cell merge в selectCells()

[more detail about v1.0.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.0.2)

# v1.0.1

2024-05-23

**🆕 новый feature**

- **@visactor/vтаблица**: tree mode can set иконка [#1697](https://github.com/VisActor/Vтаблица/issues/1697)
- **@visactor/vтаблица**: add setRowвысота&setColширина апи

**🐛 Bug fix**

- **@visactor/vтаблица**: ignore cell merge в selectCells()

[more detail about v1.0.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.0.1)

# v1.0.0

2024-05-21

**💥 Breaking change**

- **@visactor/vтаблица**: The result returned по the сводный таблица getCellOriginRecord интерфейс becomes an массив structure.

**🆕 новый feature**

- **@visactor/vтаблица**: rows и tree can combined use [#1644](https://github.com/VisActor/Vтаблица/issues/1644)
- **@visactor/vтаблица**: add virtual option для rowTree и columnTree [#1644](https://github.com/VisActor/Vтаблица/issues/1644)

[more detail about v1.0.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.0.0)

# v0.25.9

2024-05-21

**🐛 Bug fix**

- **@visactor/vтаблица**: when body cell is blank строка,compute row высота ошибка [#1752](https://github.com/VisActor/Vтаблица/issues/1752)
- **@visactor/vтаблица**: fix пользовательский merge cell display problem when выбрать header

[more detail about v0.25.9](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.25.9)

# v0.25.8

2024-05-21

**🆕 новый feature**

- **@visactor/vтаблица**: add scrollSliderCornerRadius config [#1369](https://github.com/VisActor/Vтаблица/issues/1369)
- **@visactor/vтаблица**: add disableBackground & disableBorder в exportCellImg() [#1733](https://github.com/VisActor/Vтаблица/issues/1733)
- **@visactor/vтаблица**: add disableColumnResize для rowSeriesNumber

**🐛 Bug fix**

- **@visactor/vтаблица**: when set hideRowHeader, body cell значение is blank [#1732](https://github.com/VisActor/Vтаблица/issues/1732)
- **@visactor/vтаблица**: setтаблицаColumnsEditor occor ошибка when не set columns [#1747](https://github.com/VisActor/Vтаблица/issues/1747)
- **@visactor/vтаблица**: fix col & row order в cellInRanges()
- **@visactor/vтаблица**: add строка mark в csv-export [#1730](https://github.com/VisActor/Vтаблица/issues/1730)

[more detail about v0.25.8](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.25.8)

# v0.25.6

2024-05-17

**🆕 новый feature**

- **@visactor/vтаблица**: add selected_clear событие [#1705](https://github.com/VisActor/Vтаблица/issues/1705)
- **@visactor/vтаблица**: add mergeCellInfo arg в событие [#1667](https://github.com/VisActor/Vтаблица/issues/1667)

**🐛 Bug fix**

- **@visactor/vтаблица**: mouse down на прокрутка rail trigger mousedown_таблица [#1706](https://github.com/VisActor/Vтаблица/issues/1706)
- **@visactor/vтаблица**: merge cell значение can be edited [#1711](https://github.com/VisActor/Vтаблица/issues/1711)
- **@visactor/vтаблица**: sub colunms can не be edit when set editor instance [#1711](https://github.com/VisActor/Vтаблица/issues/1711)
- **@visactor/vтаблица**: fix флажок и переключатель state update when change row index [#1712](https://github.com/VisActor/Vтаблица/issues/1712)
- **@visactor/vтаблица**: fix veritial offset в текст stick
- **@visactor/vтаблица**: fix column ширина may be zero [#1708](https://github.com/VisActor/Vтаблица/issues/1708)
- **@visactor/vтаблица**: fix getCell Производительность
- **@visactor/vтаблица**: fix header скрыть func в сводный таблица
- **@visactor/vтаблица**: lineDash judgement в group-contribution-render [#1696](https://github.com/VisActor/Vтаблица/issues/1696)
- **@visactor/vтаблица**: trigger mousedown_таблица событие Регион need extend [#1668](https://github.com/VisActor/Vтаблица/issues/1668)

[more detail about v0.25.6](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.25.6)

# v0.25.1

2024-05-08

**🆕 новый feature**

- **@visactor/vтаблица**: сводный график support wordCloud rose radar gauge [#1614](https://github.com/VisActor/Vтаблица/issues/1614)
- **@visactor/vтаблица**: сводный график support scatter график тип [#1618](https://github.com/VisActor/Vтаблица/issues/1618)
- **@visactor/vтаблица**: add пользовательскийкомпонент в react-vтаблица

**🐛 Bug fix**

- **@visactor/vтаблица**: when copy blank cell paste не work [#1646](https://github.com/VisActor/Vтаблица/issues/1646)
- **@visactor/vтаблица**: fix пользовательский merge cell размер update [#1636](https://github.com/VisActor/Vтаблица/issues/1636)
- **@visactor/vтаблица**: add selecting cell range deduplication [#1628](https://github.com/VisActor/Vтаблица/issues/1628)
- **@visactor/vтаблица**: update @visactor/vutils-extension version

[more detail about v0.25.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.25.1)

# v0.25.0

2024-04-28

**🆕 новый feature**

- **@visactor/vтаблица**: сводный таблица header cell support edit [#1583](https://github.com/VisActor/Vтаблица/issues/1583)
- **@visactor/vтаблица**: пользовательскийrender или пользовательскиймакет support edit [#1596](https://github.com/VisActor/Vтаблица/issues/1596)
- **@visactor/vтаблица**: add row изменение размера функция

**🐛 Bug fix**

- **@visactor/vтаблица**: editor ввод значение handle с 0value [#1590](https://github.com/VisActor/Vтаблица/issues/1590)
- **@visactor/vтаблица**: when set textStick init и updateOption текст jump [#1592](https://github.com/VisActor/Vтаблица/issues/1592)
- **@visactor/vтаблица**: clear async contain изменение размера task before render [#1593](https://github.com/VisActor/Vтаблица/issues/1593)
- **@visactor/vтаблица**: hierarchy state иконка can не показать when only one level

**🔨 Refactor**

- **@visactor/vтаблица**: изменение размера последний column ширина can be more flexibly [#1567](https://github.com/VisActor/Vтаблица/issues/1567)

[more detail about v0.25.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.25.0)

# v0.24.1

2024-04-23

**🆕 новый feature**

- **@visactor/vтаблица**: add startEditCell апи [#1573](https://github.com/VisActor/Vтаблица/issues/1573)

**🐛 Bug fix**

- **@visactor/vтаблица**: when has rowSeriesNumber minширина maxширина ошибка [#1572](https://github.com/VisActor/Vтаблица/issues/1572)

**🔨 Refactor**

- **@visactor/vтаблица**: сводный lazy load modify setTreeNodeChildren апи [#1580](https://github.com/VisActor/Vтаблица/issues/1580)

**📖 Site / Документация update**

- **@visactor/vтаблица**: add drill down drill up демонстрация [#1556](https://github.com/VisActor/Vтаблица/issues/1556)

[more detail about v0.24.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.24.1)

# v0.24.0

2024-04-22

**🆕 новый feature**

- **@visactor/vтаблица**: add `переключатель` cell тип, и add setCellCheckboxState & setCellRadioState апи [#1504](https://github.com/VisActor/Vтаблица/issues/1504)
- **@visactor/vтаблица**: add lazy load для сводный таблица tree [#1521](https://github.com/VisActor/Vтаблица/issues/1521)

**🐛 Bug fix**

- **@visactor/vтаблица**: handle с editor ввод ctrl+a событие [#1552](https://github.com/VisActor/Vтаблица/issues/1552)
- **@visactor/vтаблица**: when изменение размера window размер the editor ввод размер не match cell размер [#1559](https://github.com/VisActor/Vтаблица/issues/1559)
- **@visactor/vтаблица**: fix multilines новый line style [#1531](https://github.com/VisActor/Vтаблица/issues/1531)
- **@visactor/vтаблица**: fix cell group order в async данные [#1517](https://github.com/VisActor/Vтаблица/issues/1517)
- **@visactor/vтаблица**: add skipпользовательскийMerge в getCellValue() [#1543](https://github.com/VisActor/Vтаблица/issues/1543)

**🔨 Refactor**

- **@visactor/vтаблица**: optimize Производительность when row tree node exceed 8000 nodes [#1557](https://github.com/VisActor/Vтаблица/issues/1557)

[more detail about v0.24.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.24.0)

# v0.23.3

2024-04-16

**🆕 новый feature**

- **@visactor/vтаблица**: add ширинаAdaptiveMode & высотаAdaptiveMode config [#1499](https://github.com/VisActor/Vтаблица/issues/1499)
- **@visactor/vтаблица**: add measureTextBounds апи

**🐛 Bug fix**

- **@visactor/vтаблица**: Релиз editor when Релиз таблицаInstance [#1495](https://github.com/VisActor/Vтаблица/issues/1495)
- **@visactor/vтаблица**: short таблица перетаскивание к out таблица occor ошибка [#1502](https://github.com/VisActor/Vтаблица/issues/1502)
- **@visactor/vтаблица**: row move funciton не work на mobile [#1503](https://github.com/VisActor/Vтаблица/issues/1503)
- **@visactor/vтаблица**: defaultHeaderRowвысота не work с rowSeriesNumber [#1520](https://github.com/VisActor/Vтаблица/issues/1520)
- **@visactor/vтаблица**: tree hierarchy state иконка use rowHierarchyTextStartAlignment children node render ошибка [#1525](https://github.com/VisActor/Vтаблица/issues/1525)
- **@visactor/vтаблица**: изменение размера col ширина trigger текст stick change [#1529](https://github.com/VisActor/Vтаблица/issues/1529)
- **@visactor/vтаблица**: fix тема textStick config в checkHaveTextStick() [#1490](https://github.com/VisActor/Vтаблица/issues/1490)
- **@visactor/vтаблица**: add Кнопка jedgement в Нажать_cell событие [#1484](https://github.com/VisActor/Vтаблица/issues/1484)
- **@visactor/vтаблица**: fix defalultQueryMethod в vтаблица-search [#1448](https://github.com/VisActor/Vтаблица/issues/1448)
- **@visactor/vтаблица**: update пользовательскийMergeCell в updateOption [#1493](https://github.com/VisActor/Vтаблица/issues/1493)

**🔨 Refactor**

- **@visactor/vтаблица**: add mousedown_таблица событие [#1470](https://github.com/VisActor/Vтаблица/issues/1470)
- **@visactor/vтаблица**: setRecords handle с Подсказка overflow [#1494](https://github.com/VisActor/Vтаблица/issues/1494)

[more detail about v0.23.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.23.3)

# v0.23.2

2024-04-11

**🆕 новый feature**

- **@visactor/vтаблица**: scrollbar видимый фокус [#1360](https://github.com/VisActor/Vтаблица/issues/1360)
- **@visactor/vтаблица**: add rowHierarchyTextStartAlignment для tree mode [#1417](https://github.com/VisActor/Vтаблица/issues/1417)

**🐛 Bug fix**

- **@visactor/vтаблица**: records апи when has merge cell render ошибка [#1286](https://github.com/VisActor/Vтаблица/issues/1286)
- **@visactor/vтаблица**: add isавтоRowвысота к handle ширина row высота compute [#1379](https://github.com/VisActor/Vтаблица/issues/1379)
- **@visactor/vтаблица**: график spec clone filtered dom problem [#1422](https://github.com/VisActor/Vтаблица/issues/1422)
- **@visactor/vтаблица**: borderlinedash effect ошибка handle с lineCap [#1436](https://github.com/VisActor/Vтаблица/issues/1436)
- **@visactor/vтаблица**: trigger событие selectedCell [#1444](https://github.com/VisActor/Vтаблица/issues/1444)
- **@visactor/vтаблица**: set disableSelect перетаскивание cells occor ошибка [#1461](https://github.com/VisActor/Vтаблица/issues/1461)
- **@visactor/vтаблица**: лево content ширина ошибка when tree hierarchy state иконка back rect showing [#1466](https://github.com/VisActor/Vтаблица/issues/1466)
- **@visactor/vтаблица**: fix domain order в horizontal [#1453](https://github.com/VisActor/Vтаблица/issues/1453)
- **@visactor/vтаблица**: add columnширинаComputeMode update в opdateOption [#1465](https://github.com/VisActor/Vтаблица/issues/1465)
- **@visactor/vтаблица**: fix inline иконка Подсказка config [#1456](https://github.com/VisActor/Vтаблица/issues/1456)
- **@visactor/vтаблица**: 修复进度图部分情况遮挡表格边缘单元格
- **@visactor/vтаблица**: fix transpose граница тема [#1463](https://github.com/VisActor/Vтаблица/issues/1463)

**🔨 Refactor**

- **@visactor/vтаблица**: update drilldown drillup svg
- **@visactor/vтаблица**: handle ширина графикSpce с markLine [#1420](https://github.com/VisActor/Vтаблица/issues/1420)
- **@visactor/vтаблица**: supplement событие тип для react таблица [#1434](https://github.com/VisActor/Vтаблица/issues/1434)

[more detail about v0.23.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.23.2)

# v0.23.1

2024-04-07

**🆕 новый feature**

- **@visactor/vтаблица**: выбрать range can extends during прокрутка [#1400](https://github.com/VisActor/Vтаблица/issues/1400)

**🐛 Bug fix**

- **@visactor/vтаблица**: maxLineширина значение should consider hierarchyOffset [#1224](https://github.com/VisActor/Vтаблица/issues/1224)
- **@visactor/vтаблица**: tree leaf node textAlign право render ошибка [#1393](https://github.com/VisActor/Vтаблица/issues/1393)
- **@visactor/vтаблица**: when copy или paste navigator.clipboard?.write occor undefined ошибка в не https [#1421](https://github.com/VisActor/Vтаблица/issues/1421)
- **@visactor/vтаблица**: fix header cell imвозраставтоSizing [#1339](https://github.com/VisActor/Vтаблица/issues/1339)
- **@visactor/vтаблица**: скрыть иконка фон when скрыть иконка
- **@visactor/vтаблица**: fix nan verticalBarPos [#1232](https://github.com/VisActor/Vтаблица/issues/1232)
- **@visactor/vтаблица**: fix progressbar cover cell граница [#1425](https://github.com/VisActor/Vтаблица/issues/1425)
- **@visactor/vтаблица**: remove container в таблица option
- **@visactor/vтаблица**: add sync render в exportCellImg [#1398](https://github.com/VisActor/Vтаблица/issues/1398)

**🔨 Refactor**

- **@visactor/vтаблица**: optimize Производительность when change tree hierarchy state [#1406](https://github.com/VisActor/Vтаблица/issues/1406)

[more detail about v0.23.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.23.1)

# v0.23.0

2024-03-29

**🆕 новый feature**

- **@visactor/vтаблица**: список tree mode support filter [#1376](https://github.com/VisActor/Vтаблица/issues/1376)
- **@visactor/vтаблица**: add прокрутка конец событие и barToSide option [#1304](https://github.com/VisActor/Vтаблица/issues/1304)
- **@visactor/vтаблица**: add excel options к support fill handle

**🐛 Bug fix**

- **@visactor/vтаблица**: transpose с frozenColCount shadowline render [#1366](https://github.com/VisActor/Vтаблица/issues/1366)
- **@visactor/vтаблица**: данныеsource support promise mode call addRecords и deleteRecords
- **@visactor/vтаблица**: when Нажать cell should не trigger drag_select_end событие [#1410](https://github.com/VisActor/Vтаблица/issues/1410)

[more detail about v0.23.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.23.0)

# v0.22.0

2024-03-22

**🆕 новый feature**

- **@visactor/vтаблица**: support row series число

[more detail about v0.22.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.22.0)

# v0.21.3

2024-03-20

**🐛 Bug fix**

- **@visactor/vтаблица**: mapping colorMap не work [#1295](https://github.com/VisActor/Vтаблица/issues/1295)
- **@visactor/vтаблица**: when copy blank cell и paste к cell change к undefined [#1298](https://github.com/VisActor/Vтаблица/issues/1298)
- **@visactor/vтаблица**: bug данныеsource lazy load edit cell значение invalid [#1302](https://github.com/VisActor/Vтаблица/issues/1302)
- **@visactor/vтаблица**: fix cell progress create content размер
- **@visactor/vтаблица**: fix row level в getCellAdressByHeaderPath()
- **@visactor/vтаблица**: use по умолчанию style в exportCellImg()
- **@visactor/vтаблица**: fix typeError в getCellMergeRange()

**📖 Site / Документация update**

- **@visactor/vтаблица**: add список таблица tree mode guide

[more detail about v0.21.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.21.3)

# v0.21.2

2024-03-14

**🆕 новый feature**

- **@visactor/vтаблица**: add textStickBaseOnAlign config

**🐛 Bug fix**

- **@visactor/vтаблица**: after change transpose изменение размера line render ошибка [#1239](https://github.com/VisActor/Vтаблица/issues/1239)
- **@visactor/vтаблица**: сводный tree mode when use headerиконка the indent значение invalid [#1269](https://github.com/VisActor/Vтаблица/issues/1269)
- **@visactor/vтаблица**: fix progress bar rect высота

[more detail about v0.21.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.21.2)

# v0.21.1

2024-03-11

**🐛 Bug fix**

- **@visactor/vтаблица**: merge cell render ошибка с summary и pagination [#1223](https://github.com/VisActor/Vтаблица/issues/1223)

**📖 Site / Документация update**

- **@visactor/vтаблица**: indicatorsAsCol support indicators display в rows [#1238](https://github.com/VisActor/Vтаблица/issues/1238)

[more detail about v0.21.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.21.1)

# v0.21.0

2024-03-11

**🆕 новый feature**

- **@visactor/vтаблица**: add текст measure ment config
- **@visactor/vтаблица**: add пользовательский cell style функция
- **@visactor/vтаблица**: add cellInnerBorder&cellBorderClipDirection&\_contentOffset в тема comfig
- **@visactor/vтаблица**: add search компонент

**🐛 Bug fix**

- **@visactor/vтаблица**: records change restoreHierarchyState occor ошибка [#1203](https://github.com/VisActor/Vтаблица/issues/1203)
- **@visactor/vтаблица**: call updatePagination mergeCell render ошибка [#1207](https://github.com/VisActor/Vтаблица/issues/1207)
- **@visactor/vтаблица**: перетаскивание header позиция cell ошибка [#1220](https://github.com/VisActor/Vтаблица/issues/1220)
- **@visactor/vтаблица**: fix флажок текст space problem
- **@visactor/vтаблица**: fix прокрутка позиция delta

**🔨 Refactor**

- **@visactor/vтаблица**: pasteValueToCell can only work на ediтаблица cell [#1063](https://github.com/VisActor/Vтаблица/issues/1063)
- **@visactor/vтаблица**: support underlineDash и underlineOffset [#1132](https://github.com/VisActor/Vтаблица/issues/1132) [#1135](https://github.com/VisActor/Vтаблица/issues/1135)
- **@visactor/vтаблица**: onStart funciton add col row arguments [#1214](https://github.com/VisActor/Vтаблица/issues/1214)

**✅ Test Case**

- **@visactor/vтаблица**: add unit test getCellAddressByHeaderPaths

[more detail about v0.21.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.21.0)

# v0.20.2

2024-03-04

**🆕 новый feature**

- **@visactor/vтаблица**: add флажок style тема

**🐛 Bug fix**

- **@visactor/vтаблица**: rightFrozenCol is bigger then colCount [#1162](https://github.com/VisActor/Vтаблица/issues/1162)
- **@visactor/vтаблица**: header description Подсказка flicker [#1173](https://github.com/VisActor/Vтаблица/issues/1173)
- **@visactor/vтаблица**: add fontStyle & fontVariant

[more detail about v0.20.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.20.2)

# v0.20.1

2024-02-29

**🆕 новый feature**

- **@visactor/vтаблица**: add апи getRecordIndexByCell [#1121](https://github.com/VisActor/Vтаблица/issues/1121)

**🐛 Bug fix**

- **@visactor/vтаблица**: hideColumnsSubheader с three levels показать ошибка [#1105](https://github.com/VisActor/Vтаблица/issues/1105)
- **@visactor/vтаблица**: пользовательскиймакет flex render ошибка [#1163](https://github.com/VisActor/Vтаблица/issues/1163)
- **@visactor/vтаблица**: when прокрутка Подсказка скрыть [#905](https://github.com/VisActor/Vтаблица/issues/905)
- **@visactor/vтаблица**: fix axis innerOffset
- **@visactor/vтаблица**: add skipFunctionDiff в react-vтаблица

**🔨 Refactor**

- **@visactor/vтаблица**: reимя resize_column_end событие arguments [#1129](https://github.com/VisActor/Vтаблица/issues/1129)
- **@visactor/vтаблица**: апи возврат значение тип
- **@visactor/vтаблица**: setRecords support restoreHierarchyState [#1148](https://github.com/VisActor/Vтаблица/issues/1148)
- **@visactor/vтаблица**: vтаблица не stop событие bubble [#892](https://github.com/VisActor/Vтаблица/issues/892)
- **@visactor/vтаблица**: remove Circular dependency

**🔖 other**

- **@visactor/vтаблица**: fix-contextменюItems-add-col-param

[more detail about v0.20.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.20.1)

# v0.20.0

2024-02-23

**🆕 новый feature**

- **@visactor/vтаблица**: add aggregation для список таблица column
- **@visactor/vтаблица**: add апи getAggregateValuesByполе
- **@visactor/vтаблица**: add пользовательский aggregation
- **@visactor/vтаблица**: графикSpec support функция [#1115](https://github.com/VisActor/Vтаблица/issues/1115)
- **@visactor/vтаблица**: add filter данные config [#607](https://github.com/VisActor/Vтаблица/issues/607)

**🐛 Bug fix**

- **@visactor/vтаблица**: edit право frozen cell ввод позиция ошибка
- **@visactor/vтаблица**: mouseleave_cell событие trigger [#1112](https://github.com/VisActor/Vтаблица/issues/1112)
- **@visactor/vтаблица**: fix cellBgColor judgement в isCellHover()
- **@visactor/vтаблица**: fix пользовательский merge cell computed высота&ширина
- **@visactor/vтаблица**: fix content позиция update problem
- **@visactor/vтаблица**: merge cell update в setDropDownменюHighlight()
- **@visactor/vтаблица**: fix react-vтаблица display ошибка в react strict mode [#990](https://github.com/VisActor/Vтаблица/issues/990)

[more detail about v0.20.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.20.0)

# v0.19.1

2024-02-06

**🆕 новый feature**

- **@visactor/vтаблица**: add update сортировка rule апи
- **@visactor/vтаблица**: add axis innerOffset config
- **@visactor/vтаблица**: add имя config в пользовательскийRender

**🐛 Bug fix**

- **@visactor/vтаблица**: when таблица has прокрутка then Нажать header к edit позиция ошибка [#1069](https://github.com/VisActor/Vтаблица/issues/1069)
- **@visactor/vтаблица**: fix column cell order problem в sync mode
- **@visactor/vтаблица**: fix граница lineDash в cell group [#1051](https://github.com/VisActor/Vтаблица/issues/1051)
- **@visactor/vтаблица**: fix textAlign значение в ширина update[#1065](https://github.com/VisActor/Vтаблица/issues/1065)
- **@visactor/vтаблица**: fix merge cell content позиция
- **@visactor/vтаблица**: fix merge cell update problem

**🔨 Refactor**

- **@visactor/vтаблица**: сводный таблица сортировка logic [#1033](https://github.com/VisActor/Vтаблица/issues/1033)
- **@visactor/vтаблица**: showсортировка option work well [#1077](https://github.com/VisActor/Vтаблица/issues/1077)

[more detail about v0.19.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.19.1)

# v0.19.0

2024-02-02

**🆕 новый feature**

- **@visactor/vтаблица**: support get сортировкаed columns [#986](https://github.com/VisActor/Vтаблица/issues/986)
- **@visactor/vтаблица**: add option frozenColDragHeaderMode

**🐛 Bug fix**

- **@visactor/vтаблица**: выбрать Регион saved problem [#1018](https://github.com/VisActor/Vтаблица/issues/1018)
- **@visactor/vтаблица**: when call updateColumns и discount col occor ошибка [#1015](https://github.com/VisActor/Vтаблица/issues/1015)
- **@visactor/vтаблица**: rightFrozenColCount перетаскивание header move more time the column ширина is ошибка [#1019](https://github.com/VisActor/Vтаблица/issues/1019)
- **@visactor/vтаблица**: empty строка compute row высота ошибка [#1031](https://github.com/VisActor/Vтаблица/issues/1031)
- **@visactor/vтаблица**: fix merge imвозраст cell update problem

**🔨 Refactor**

- **@visactor/vтаблица**: when перетаскивание header move к frozen Регион then markLine показать positon
- **@visactor/vтаблица**: optimize updateRow апи Производительность & изменение размера низ frozen row не право

[more detail about v0.19.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.19.0)

# v0.18.3

2024-01-25

**🐛 Bug fix**

- **@visactor/vтаблица**: Нажать outside из cells Нажать отмена выбрать state

[more detail about v0.18.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.18.3)

# v0.18.2

2024-01-24

**🆕 новый feature**

- **@visactor/vтаблица**: add компонент update

**🐛 Bug fix**

- **@visactor/vтаблица**: fix rowHeaderGroup attribute y when has no colHeaderGroup [#971](https://github.com/VisActor/Vтаблица/issues/971)
- **@visactor/vтаблица**: transpose bottomFrozenRow cell макет ошибка [#978](https://github.com/VisActor/Vтаблица/issues/978)
- **@visactor/vтаблица**: passte значение к последний row occur ошибка [#979](https://github.com/VisActor/Vтаблица/issues/979)
- **@visactor/vтаблица**: use updateColumns апи Нажать state не право [#975](https://github.com/VisActor/Vтаблица/issues/975)
- **@visactor/vтаблица**: record has nan строка значение сводныйграфик cell значение parse handle this case [#993](https://github.com/VisActor/Vтаблица/issues/993)
- **@visactor/vтаблица**: row высота compute для axis
- **@visactor/vтаблица**: fix deltaY col число в moveCell()

[more detail about v0.18.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.18.2)

# v0.18.0

2024-01-19

**🆕 новый feature**

- **@visactor/vтаблица**: сводныйграфик support pie
- **@visactor/vтаблица**: add пользовательскиймакет & пользовательскийRander в пользовательскийMergeCell
- **@visactor/vтаблица**: add событиеOptions [#914](https://github.com/VisActor/Vтаблица/issues/914)

**🐛 Bug fix**

- **@visactor/vтаблица**: handle с графикSpec barширина set строка тип
- **@visactor/vтаблица**: addRecords апи call when body no данные [#953](https://github.com/VisActor/Vтаблица/issues/953)
- **@visactor/vтаблица**: mouse перетаскивание к move Header позиция has ошибка when column has multi-levels [#957](https://github.com/VisActor/Vтаблица/issues/957)
- **@visactor/vтаблица**: when изменение размера column ширина bottomFrozenRow высота should update [#954](https://github.com/VisActor/Vтаблица/issues/954)

[more detail about v0.18.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.18.0)

# v0.17.10

2024-01-18

**🆕 новый feature**

- **@visactor/vтаблица**: use vrender-core

**🐛 Bug fix**

- **@visactor/vтаблица**: выбрать граница range ошибка [#911](https://github.com/VisActor/Vтаблица/issues/911)
- **@visactor/vтаблица**: when включить pasteValueToCell и событие change_cell_value arguments is ошибка [#919](https://github.com/VisActor/Vтаблица/issues/919)
- **@visactor/vтаблица**: fix tree structure авто merge update problem
- **@visactor/vтаблица**: toggele tree node updateграфикSize

[more detail about v0.17.10](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.10)

# v0.17.9

2024-01-18

**🆕 новый feature**

- **@visactor/vтаблица**: support excel данные paste к cells [#857](https://github.com/VisActor/Vтаблица/issues/857)
- **@visactor/vтаблица**: add апи getCellAddressByRecord
- **@visactor/vтаблица**: optimize getCellHeaderPath функция

**🐛 Bug fix**

- **@visactor/vтаблица**: showSubTotals can не work [#893](https://github.com/VisActor/Vтаблица/issues/893)
- **@visactor/vтаблица**: set display:никто trigger изменение размера logic
- **@visactor/vтаблица**: fix право frozen cell location

[more detail about v0.17.9](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.9)

# v0.17.8

2024-01-17

**🐛 Bug fix**

- **@visactor/vтаблица**: selectRange ошибка when near frozencol или frozenrow [#854](https://github.com/VisActor/Vтаблица/issues/854)
- **@visactor/vтаблица**: frozen shadowline should move позиция [#859](https://github.com/VisActor/Vтаблица/issues/859)
- **@visactor/vтаблица**: fix график cell dblНажать размер update
- **@visactor/vтаблица**: fix низ frozen row высота compute в createGroupForFirstScreen()
- **@visactor/vтаблица**: fix cellGroup merge range
- **@visactor/vтаблица**: fix react пользовательский jsx parse

[more detail about v0.17.8](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.8)

# v0.17.7

2024-01-05

**🆕 новый feature**

- **@visactor/vтаблица**: add cell imвозраст таблица export

**🐛 Bug fix**

- **@visactor/vтаблица**: fix jsx parse ошибка в react-vтаблица

[more detail about v0.17.7](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.7)

# v0.17.6

2024-01-04

**🐛 Bug fix**

- **@visactor/vтаблица**: fix изменение размера line позиция

[more detail about v0.17.6](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.6)

# v0.17.5

2024-01-04

**🆕 новый feature**

- **@visactor/vтаблица**: support edit header title [#819](https://github.com/VisActor/Vтаблица/issues/819)
- **@visactor/vтаблица**: add апи getCellHeaderTreeNodes для сводныйтаблица [#839](https://github.com/VisActor/Vтаблица/issues/839)

**🐛 Bug fix**

- **@visactor/vтаблица**: setRecords process scrollTop update scenegraph [#831](https://github.com/VisActor/Vтаблица/issues/831)
- **@visactor/vтаблица**: add group clip в body

**🔨 Refactor**

- **@visactor/vтаблица**: список таблица низ row can не use bottomFrozenStyle [#836](https://github.com/VisActor/Vтаблица/issues/836)
- **@visactor/vтаблица**: add onVграфиксобытие для Baseтаблица [#843](https://github.com/VisActor/Vтаблица/issues/843)

[more detail about v0.17.5](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.5)

# v0.17.3

2024-01-01

**🆕 новый feature**

- **@visactor/vтаблица**: add body index convert с таблица index [#789](https://github.com/VisActor/Vтаблица/issues/789)
- **@visactor/vтаблица**: mergeCell support пользовательский compare функция [#804](https://github.com/VisActor/Vтаблица/issues/804)
- **@visactor/vтаблица**: add column изменение размера label тема

**🐛 Bug fix**

- **@visactor/vтаблица**: setRecords lose навести state [#783](https://github.com/VisActor/Vтаблица/issues/783)
- **@visactor/vтаблица**: transpose список демонстрация when records has 10000 Производительность problem [#790](https://github.com/VisActor/Vтаблица/issues/790)
- **@visactor/vтаблица**: setRecords recomputeColширина problems [#796](https://github.com/VisActor/Vтаблица/issues/796)
- **@visactor/vтаблица**: set disableSelect перетаскивание interaction occor ошибка [#799](https://github.com/VisActor/Vтаблица/issues/799)
- **@visactor/vтаблица**: Подсказка style не work [#805](https://github.com/VisActor/Vтаблица/issues/805)
- **@visactor/vтаблица**: сводный таблица pagination.perPвозрастCount modify [#807](https://github.com/VisActor/Vтаблица/issues/807)
- **@visactor/vтаблица**: [Bug] adaptive mode compute problem when has frozencol и rightFrozenCol [#820](https://github.com/VisActor/Vтаблица/issues/820)
- **@visactor/vтаблица**: fix axis render update problem
- **@visactor/vтаблица**: fix выбрать update when change frozen
- **@visactor/vтаблица**: сводный таблица use иконка bug
- **@visactor/vтаблица**: fix сортировка иконка update

**🔨 Refactor**

- **@visactor/vтаблица**: update vrender событие verison use scrollDrag

**🔧 Configuration releated**

- **@visactor/vтаблица**: update vrender version [#785](https://github.com/VisActor/Vтаблица/issues/785)

[more detail about v0.17.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.3)

# v0.17.2

2023-12-21

**🐛 Bug fix**

- **@visactor/vтаблица**: edit bug [#771](https://github.com/VisActor/Vтаблица/issues/771)
- **@visactor/vтаблица**: add row высота round в resetRowвысота

[more detail about v0.17.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.2)

# v0.17.1

2023-12-21

**🆕 новый feature**

- **@visactor/vтаблица**: add arrowkeys interaction [#646](https://github.com/VisActor/Vтаблица/issues/646)

**🐛 Bug fix**

- **@visactor/vтаблица**: stopPropagation effect doubletap
- **@visactor/vтаблица**: dropdown_меню_Нажать trigger [#760](https://github.com/VisActor/Vтаблица/issues/760)
- **@visactor/vтаблица**: dblНажать occur ошибка [#758](https://github.com/VisActor/Vтаблица/issues/758)
- **@visactor/vтаблица**: fix richtext ошибка в getCellOverflowText()
- **@visactor/vтаблица**: add scrollBar событие к call completeEdit [#710](https://github.com/VisActor/Vтаблица/issues/710)
- **@visactor/vтаблица**: support tree mode adaptive
- **@visactor/vтаблица**: fix выпадающий список иконка display ошибка
- **@visactor/vтаблица**: fix право frozen columns ширина update problem

**🔨 Refactor**

- **@visactor/vтаблица**: 100W records прокрутка Производительность optimize when has выбрать Cell [#681](https://github.com/VisActor/Vтаблица/issues/681)
- **@visactor/vтаблица**: remove по умолчанию сортировка rule для сводный таблица [#759](https://github.com/VisActor/Vтаблица/issues/759)

**📖 Site / Документация update**

- **@visactor/vтаблица**: update changlog из rush

[more detail about v0.17.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.1)

# v0.17.0

2023-12-15

**🆕 новый feature**

- **@visactor/vтаблица**: add option showGrandTotalsOnTop [#650](https://github.com/VisActor/Vтаблица/issues/650)
- **@visactor/vтаблица**: optimize diffCellIndices в toggleHierarchyState()
- **@visactor/vтаблица**: add disableAxisHover config
- **@visactor/vтаблица**: optimize computeTextширина() в сводный таблица

**🐛 Bug fix**

- **@visactor/vтаблица**: fix право frozen adaptive problem
- **@visactor/vтаблица**: fix disableHover низ frozen навести ошибка
- **@visactor/vтаблица**: fix rowUpdatePos update в updateRow()

**🔨 Refactor**

- **@visactor/vтаблица**: dropdownменю скрыть [#727](https://github.com/VisActor/Vтаблица/issues/727)

[more detail about v0.17.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.17.0)

# v0.16.3

2023-12-14

**🆕 новый feature**

- **@visactor/vтаблица**: add enableCellPadding config в пользовательский макет
- **@visactor/vтаблица**: add column disableHover&disableSelect config

**🐛 Bug fix**

- **@visactor/vтаблица**: fix axis тема get функция
- **@visactor/vтаблица**: сводный таблица support не число тип [#718](https://github.com/VisActor/Vтаблица/issues/718)
- **@visactor/vтаблица**: edge cell selection граница clip [#716](https://github.com/VisActor/Vтаблица/issues/716)

[more detail about v0.16.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.16.3)

# v0.16.2

2023-12-14

**🐛 Bug fix**

- **@visactor/vтаблица**: blank cell edit invalid на сводныйtbale [#712](https://github.com/VisActor/Vтаблица/issues/712)
- **@visactor/vтаблица**: данные lazy load when перетаскивание header позиция [#705](https://github.com/VisActor/Vтаблица/issues/705)

**🔨 Refactor**

- **@visactor/vтаблица**: сводный таблица format arguments

**📖 Site / Документация update**

- **@visactor/vтаблица**: сводный таблица format usвозраст update

[more detail about v0.16.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.16.2)

# v0.16.0

2023-12-08

**🆕 новый feature**

- **@visactor/vтаблица**: axis support график заполнение config
- **@visactor/vтаблица**: optimize сводный header Производительность
- **@visactor/vтаблица**: add axis тема
- **@visactor/vтаблица**: overlay по умолчанию и навести colors
- **@visactor/vтаблица**: add апи addRecords

**🐛 Bug fix**

- **@visactor/vтаблица**: updateOption к update updateсобытиеBinder
- **@visactor/vтаблица**: columnResizeType: все invalid
- **@visactor/vтаблица**: fix tree structure низ frozen update
- **@visactor/vтаблица**: fix limit column ширина adaptive update
- **@visactor/vтаблица**: fix таблица range when container изменение размера
- **@visactor/vтаблица**: fix таблица frame shadow цвет
- **@visactor/vтаблица**: fix прокрутка позиция update problem

**📖 Site / Документация update**

- **@visactor/vтаблица**: refix lineвысота description

[more detail about v0.16.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.16.0)

# v0.15.4

2023-12-01

**🐛 Bug fix**

- **@visactor/vтаблица**: editor объект set в column be cloned
- **@visactor/vтаблица**: fix тема style get problem
- **@visactor/vтаблица**: fix список таблица frozen навести цвет
- **@visactor/vтаблица**: fix право низ frozen cell в getCellRect()
- **@visactor/vтаблица**: fix таблица изменение размера problem when column ширина limit
- **@visactor/vтаблица**: fix пользовательский render renderDefault авто размер problem
- **@visactor/vтаблица**: fix columnширинаComputeMode config problem
- **@visactor/vтаблица**: Релиз таблицаInstance after изменение размера событие trigger
- **@visactor/vтаблица**: columnширинаComputeMode only-header

**🔨 Refactor**

- **@visactor/vтаблица**: ts define optimize

[more detail about v0.15.4](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.15.4)

# v0.15.3

2023-12-01

**🆕 новый feature**

- **@visactor/vтаблица**: add setRecordChildren к lazy load tree node
- **@visactor/vтаблица**: сводный таблица support ediтаблица

**🐛 Bug fix**

- **@visactor/vтаблица**: fix cornerCellStyle update
- **@visactor/vтаблица**: fix график item выбрать problem
- **@visactor/vтаблица**: fix низ лево frozen cell style

[more detail about v0.15.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.15.3)

# v0.15.1

2023-11-28

**🐛 Bug fix**

- **@visactor/vтаблица**: перетаскивание выбрать первый cell seleted repeatly [#611](https://github.com/VisActor/Vтаблица/issues/611)
- **@visactor/vтаблица**: no indicators сводныйграфик render
- **@visactor/vтаблица**: compute график column ширина use Math.ceil bandSpace

**🔨 Refactor**

- **@visactor/vтаблица**: сортировкаState can не work when column has no сортировка setting [#622](https://github.com/VisActor/Vтаблица/issues/622)
- **@visactor/vтаблица**: remove keydown событие arguments cells
- **@visactor/vтаблица**: reимя maneger к manвозрастr

**📖 Site / Документация update**

- **@visactor/vтаблица**: add апи getCellCheckboxState

[more detail about v0.15.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.15.1)

# v0.15.0

2023-11-24

**🆕 новый feature**

- **@visactor/vтаблица**: add событие copy_данные [#551](https://github.com/VisActor/Vтаблица/issues/551)
- **@visactor/vтаблица**: add column с min limit [#590](https://github.com/VisActor/Vтаблица/issues/590)
- **@visactor/vтаблица**: edit текст значение с inputEditor
- **@visactor/vтаблица**: add react-vтаблица

**🐛 Bug fix**

- **@visactor/vтаблица**: compute col ширина when large count col с sampling the frozen низ rows is не computed
- **@visactor/vтаблица**: fix cell позиция mismatch problems when bodyRowCount is 0 [#596](https://github.com/VisActor/Vтаблица/issues/596)
- **@visactor/vтаблица**: fix текст mark x в updateCell()

**🔖 other**

- **@visactor/vтаблица**: fix/fix cell role judgement в updateCellGroupContent()

[more detail about v0.15.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.15.0)

# v0.14.2

2023-11-16

**🐛 Bug fix**

- **@visactor/vтаблица**: row header выбрать bound wrong [#572](https://github.com/VisActor/Vтаблица/issues/572)
- **@visactor/vтаблица**: selectHeader copy данные

[more detail about v0.14.2](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.14.2)

# v0.14.1

2023-11-13

**🔨 Refactor**

- **@visactor/vтаблица**: when перетаскивание к canvas blank area к конец выбрать [#556](https://github.com/VisActor/Vтаблица/issues/556)

[more detail about v0.14.1](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.14.1)

# v0.14.0

2023-11-10

**🆕 новый feature**

- **@visactor/vтаблица**: add jsx support в пользовательский макет
- **@visactor/vтаблица**: refactor merge cell strategy
- **@visactor/vтаблица**: add functionial tickCount config в axis
- **@visactor/vтаблица**: update пользовательскиймакет апи

[more detail about v0.14.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.14.0)

# v0.13.4

2023-11-08

**🆕 новый feature**

- **@visactor/vтаблица**: add option overscrollBehavior

**🐛 Bug fix**

- **@visactor/vтаблица**: перетаскивание выбрать out таблицаcell getSelectCellInfos null
- **@visactor/vтаблица**: выбрать граница render ошибка when frozen низ row [#508](https://github.com/VisActor/Vтаблица/issues/508)

**🔨 Refactor**

- **@visactor/vтаблица**: change styleElement add targetDom

[more detail about v0.13.4](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.13.4)

# v0.13.3

2023-11-03

**🐛 Bug fix**

- **@visactor/vтаблица**: fix frozen shadow update в tree mode [#525](https://github.com/VisActor/Vтаблица/issues/525)

[more detail about v0.13.3](https://github.com/VisActor/Vтаблица/Релизs/tag/v0.13.3)
