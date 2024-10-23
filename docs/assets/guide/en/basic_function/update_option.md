# How to update configuration items?

When using the vtable component, updating configuration items is a common requirement. This tutorial will introduce three commonly used configuration item update methods and provide corresponding suggestions based on different usage scenarios. We will discuss the usage and applicable scenarios of full update, single update and batch update.

## Update all configuration items

Full update of configuration items is achieved by calling the updateOption() method. This method requires all configuration items to be provided, so it is suitable for situations where the entire configuration needs to be changed. Here is sample code:

```
tableInstance. updateOption({
  columns: [],
  theme: {},
  ...
});
```

Note: A full update will relayout and render the entire table.

**Applicable scene:**

When changes need to be made to multiple configuration items, using full updates can avoid multiple layouts and renderings, thus improving performance.

## Single item update configuration item

Single update configuration items are implemented by calling the corresponding interface, such as `updateTheme()`, `updateColumns()`, etc. These interfaces will automatically relayout and render the table after being called. Here is sample code:

```
tableInstance. updateTheme(newTheme);
```

Note: Automatically layout and render after calling.

**Applicable scene:**

When only one or a few configuration items need to be modified, single-item update can be used to update quickly and easily without wasting performance.

## Batch update configuration items

Batch update of configuration items is implemented through a special type of interface: the way to update table instance attributes. With this update method, we try our best to ensure that every item in the option can be updated. If there is no supported interface but you need it, you can contact us or directly raise an issue.

For example `tableInstance.autoWrapText = true`, `tableInstance.theme = { bodyStyle: { color: 'red' } }`.

The table will not be automatically re-rendered after these interfaces are called. You need to cooperate with the `tableInstance.renderWithRecreateCells()` method to manually re-layout and render. Here is sample code:

```
tableInstance.theme = newThemeObj;
tableInstance.widthMode = 'autoWidth';
tableInstance. heightMode = 'autoHeight;
tableInstance. autoWrapText = true;
tableInstance.renderWithRecreateCells();
```

Note: The above configuration items will not be re-layout and rendering after being updated using the assignment interface. You need to manually call the renderWithRecreateCells() method to re-layout and render the table to effectively improve the performance of the update logic.

**Applicable scene:**

When multiple configuration items need to be updated in batches, batch update can avoid multiple layouts and renderings and improve performance.

## Summarize:

This tutorial introduces three update methods for vtable component configuration items: full update, single update and batch update. Depending on different usage scenarios, choosing an appropriate update method can improve code efficiency and performance. Full update is suitable for situations where the entire configuration needs to be changed, single update is suitable for situations where a few configuration items are modified, and batch update is suitable for situations where multiple configuration items are updated in batches, which requires calling the interface to re-layout and render.

I hope this tutorial will help you understand the configuration item update of the vtable component. If you have any questions, please feel free to ask.
