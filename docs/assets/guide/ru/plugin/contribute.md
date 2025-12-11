# Участие в Разработке Plugins

When businesses use Vтаблица, they may need пользовательскийized функциональность, which can be implemented through plugins. Extracting common функциональность into plugins avoids reinventing the wheel и makes it easier для other businesses к use these возможности.

Sharing plugins can improve development efficiency и reduce maintenance costs! We encourвозраст everyone к actively contribute plugins и help improve the Vтаблица ecosystem!

## Guidelines для Участие в Разработке Plugins

1. Plugins must follow Vтаблица's plugin specifications.
2. Plugins must include detailed Документация, including параметр descriptions, usвозраст примеры, etc.

### Plugin Specifications
#### интерфейс Specifications

Plugins need к implement the `Vтаблица.plugins.IVтаблицаPlugin` интерфейс.

```ts
// Plugin unified интерфейс
export интерфейс IVтаблицаPlugin {
  // Plugin unique identifier
  id: строка;
  // Plugin имя
  имя: строка;
  // Plugin runtime trigger
  runTime: таблицасобытиеs[keyof таблицасобытиеs] | таблицасобытиеs[keyof таблицасобытиеs][];
  // Initialization method, called after Vтаблица instance creation и before первый render
  run: (...args: любой[]) => void;
  // Update method, called when таблица данные или configuration updates
  update?: () => void;
  // Destruction method, called before Vтаблица instance is destroyed
  Релиз?: (таблица: Baseтаблицаапи) => void;
}
```

The `runTime` параметр specifies when the plugin will run, configuring it с событие types от `таблицасобытиеs`.

The `гантт` plugin needs к implement the `Vтаблицагантт.plugins.IганттPlugin` интерфейс.

```ts
// Plugin unified интерфейс
export интерфейс IганттPlugin {
  // Plugin unique identifier
  id: строка;
  // Plugin имя
  имя: строка;
  // Plugin runtime trigger, if не passed в, will run directly during the гантт build по по умолчанию
  runTime?: событие_TYPES[keyof событие_TYPES][];
  // Initialization method
  run: (...args: любой[]) => void;
  // Update method, called when гантт данные или configuration updates
  update?: () => void;
  // Destruction method, called before гантт instance is destroyed
  Релиз?: (гантт: гантт) => void;   
}
```

The `runTime` параметр specifies when the plugin will run, configuring it с событие types от `событие_TYPES`.

####  компонент Lifecycle Process:

<div style="display: flex; justify-content: центр;  ширина: 100%;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/plugin-lifecycle.jpeg"  style="ширина: 100%; объект-fit: contain; заполнение: 10px;">
</div>

Attached Mermaid sequence diagram код (для future updates, Вы можете modify this код и update the imвозраст above):
```mermaid
sequenceDiagram
    participant User
    participant DOM
    participant списоктаблица
    participant событиеManвозрастr
    participant PluginManвозрастr
    participant Plugin as VтаблицаPlugin
    participant RenderManвозрастr
    
    %% Initialization
    списоктаблица->>PluginManвозрастr: регистрация plugins
    PluginManвозрастr->>Plugin: store plugin instances
    
    %% User interaction flow
    User->>DOM: interact (Нажать, прокрутка, etc.)
    DOM->>событиеManвозрастr: dispatch browser событие
    событиеManвозрастr->>PluginManвозрастr: notify(событиеType, args)
    PluginManвозрастr->>PluginManвозрастr: filter plugins по runTime
    
    loop для каждый matching plugin
        PluginManвозрастr->>Plugin: run(событиеArgs, runTime, таблицаапи)
        Plugin->>списоктаблица: read/modify таблица state
        Plugin->>Plugin: process событие logic
    конец
    
    Plugin->>списоктаблица: render request к update таблица
    списоктаблица->>DOM: update display


    %% таблица.updateOption
    списоктаблица->>PluginManвозрастr: updateOption
    PluginManвозрастr->>Plugin: updatePlugins()
    %% таблица.Релиз
    списоктаблица->>PluginManвозрастr: Релиз
    PluginManвозрастr->>Plugin: Релиз()

```

от the above diagram, Вы можете understand the runtime timing из plugins:
- The key role из `runTime` в plugins is к specify which Vтаблица событиеs they depend на.
- в the plugin's `run` method, Вы можете access the таблица instance, configuration, и данные; you should also handle the plugin's specific business logic в the `run` method.
- Remember к Релиз resources в the plugin's `Релиз` method к avoid memory leaks.

### Plugin Документация

Plugins need к provide detailed Документация, including параметр descriptions, usвозраст примеры, etc.

Документация generally should include Следующий:
- Plugin имя
- Plugin description
- Plugin параметр descriptions
- Plugin usвозраст примеры
- Plugin notes и considerations
- Plugin source код link

Документация should be placed в the `docs/assets/plugins` directory, с the fileимя `plugin-имя.md`.


