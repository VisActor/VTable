# How к update configuration items?

When using the vтаблица компонент, updating configuration items is a common requirement. This tutorial will introduce three commonly used configuration item update методы и provide corresponding suggestions based на different usвозраст scenarios. We will discuss the usвозраст и applicable scenarios из full update, single update и batch update.

## Update все configuration items

Full update из configuration items is achieved по calling the updateOption() method. This method requires все configuration items к be provided, so it is suiтаблица для situations where the entire configuration needs к be changed. Here is sample код:

```
таблицаInstance. updateOption({
  columns: [],
  тема: {},
  ...
});
```

Note: A full update will reмакет и render the entire таблица.

**Applicable scene:**

When changes need к be made к multiple configuration items, using full updates can avoid multiple макетs и renderings, thus improving Производительность.

## Single item update configuration item

Single update configuration items are implemented по calling the corresponding интерфейс, such as `updateтема()`, `updateColumns()`, etc. These interfaces will автоmatically reмакет и render the таблица after being called. Here is sample код:

```
таблицаInstance. updateтема(newтема);
```

Note: автоmatically макет и render after calling.

**Applicable scene:**

When only one или a few configuration items need к be modified, single-item update can be used к update quickly и easily без wasting Производительность.

## Batch update configuration items

Batch update из configuration items is implemented through a special тип из интерфейс: the way к update таблица instance attributes. с this update method, we try our best к ensure that каждый item в the option can be updated. If there is no supported интерфейс but you need it, Вы можете contact us или directly raise an issue.

для пример `таблицаInstance.автоWrapText = true`, `таблицаInstance.тема = { bodyStyle: { цвет: 'red' } }`.

The таблица will не be автоmatically re-rendered after these interfaces are called. You need к cooperate с the `таблицаInstance.renderWithRecreateCells()` method к manually re-макет и render. Here is sample код:

```
таблицаInstance.тема = newтемаObj;
таблицаInstance.ширинаMode = 'автоширина';
таблицаInstance. высотаMode = 'автовысота;
таблицаInstance. автоWrapText = true;
таблицаInstance.renderWithRecreateCells();
```

Note: The above configuration items will не be re-макет и rendering after being updated using the assignment интерфейс. You need к manually call the renderWithRecreateCells() method к re-макет и render the таблица к effectively improve the Производительность из the update logic.

**Applicable scene:**

When multiple configuration items need к be updated в batches, batch update can avoid multiple макетs и renderings и improve Производительность.

## Summarize:

This tutorial introduces three update методы для vтаблица компонент configuration items: full update, single update и batch update. Depending на different usвозраст scenarios, choosing an appropriate update method can improve код efficiency и Производительность. Full update is suiтаблица для situations where the entire configuration needs к be changed, single update is suiтаблица для situations where a few configuration items are modified, и batch update is suiтаблица для situations where multiple configuration items are updated в batches, which requires calling the интерфейс к re-макет и render.

I hope this tutorial will help you understand the configuration item update из the vтаблица компонент. If you have любой questions, please feel free к ask.
