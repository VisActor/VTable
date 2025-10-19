# Table Component Introduction

VTable-Sheet is a powerful spreadsheet component built on VTable, providing an Excel-like interactive experience. It not only supports basic data display functions but also includes advanced features such as multi-sheet management, cell editing, formula calculation, data filtering, and more.

## Feature Overview

- **Multi-sheet Management**: Support for creating and managing multiple sheets to easily organize large amounts of data
- **Formula Calculation**: Provides Excel-like formula functionality, supporting common functions such as SUM, AVERAGE, MAX, MIN, COUNT, etc.
- **Data Filtering**: Supports filtering by condition and value lists to quickly find needed data
- **Table Editing**: Supports cell content editing for easy data modification
- **Data Import/Export**: Supports importing and exporting data in CSV and XLSX formats
- **Data Persistence**: Supports saving and restoring table states
- **Cell Merging**: Supports merging cells for more flexible data presentation
- **Frozen Rows and Columns**: Supports freezing header rows and columns for convenient viewing of large datasets
- **Custom Menus**: Supports customizing the top menu bar to extend functionality

## Use Cases

The VTable-Sheet component is suitable for scenarios that require Excel-like table functionality in web applications, such as:

- Data analysis tools
- Financial reporting systems
- Project management tools
- Online spreadsheet applications
- Business data management systems

## Component Architecture

VTable-Sheet is built on VTable with a modular design, mainly consisting of the following core parts:

- Sheet Manager: Responsible for creating and switching between multiple sheets
- Formula Manager: Handles formula parsing and calculation
- Menu Manager: Handles custom menu operations
- Event Manager: Unifies user interaction event handling

The internal core functionality depends on VTable plugins. For details, please refer to: [VTable Plugins](../plugin/usge).

Plugins used in VTable-Sheet:
- [filter-plugin](../plugin/filter)
- [table-series-number-plugin](../plugin/table-series-number)
- [highlight-header-when-select-cell-plugin](../plugin/header-highlight)
- [context-menu-plugin](../plugin/context-menu)
- [table-export-plugin](../plugin/table-export)
- [table-import-plugin](../plugin/excel-import)


The following sections will introduce the basic usage and advanced features of VTable-Sheet in detail.