"use strict";
exports.__esModule = true;
var small_table = require("./small-table");
var list_table = require("./list-table");
var pivot_table = require("./pivot-table");
var pivot_chart = require("./pivot-chart");
try{
  small_table.createSmallTable();

// list_table.createListTable();
// pivot_table.createPivotTable();
// pivot_chart.createPivotChart();
}catch(e){
  debugger
}