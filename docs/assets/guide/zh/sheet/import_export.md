# 导入导出能力
VTable-Sheet中导入导出依赖VTable的插件@visactor/vtable-plugins中的导出插件包来实现的。

导出插件：@visactor/vtable-plugins/table-export-plugin ，参考教程文档：[表格导出](../plugin/table-export)

导入插件：@visactor/vtable-plugins/excel-import-plugin, 参考教程文档：[表格导入](../plugin/excel-import)

因为VTable的插件只作用于单个表格实例，所以VTableSheet目前的导入导出能力不强，只能将当前sheet的数据导出，或将外部数据文件导入到当前sheet。后续会扩展完善 VTableSheet 的导出和导入能力。

如果想要修改插件的配置项，可以通过VTablePluginModules配置导入和导出插件的各个参数。