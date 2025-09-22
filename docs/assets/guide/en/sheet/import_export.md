# Import and Export Capabilities
The import and export functionality in VTable-Sheet relies on export plugins from VTable's plugin package @visactor/vtable-plugins.

Export plugin: @visactor/vtable-plugins/table-export-plugin, refer to the tutorial documentation: [Table Export](../plugin/table-export)

Import plugin: @visactor/vtable-plugins/excel-import-plugin, refer to the tutorial documentation: [Table Import](../plugin/excel-import)

Since VTable plugins only work on a single table instance, VTableSheet's current import and export capabilities are limited. It can only export data from the current sheet or import external data files into the current sheet. The export and import capabilities of VTableSheet will be expanded and improved in the future.

If you want to modify the plugin configuration options, you can configure various parameters for the import and export plugins through VTablePluginModules.