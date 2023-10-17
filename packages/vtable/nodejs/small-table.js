"use strict";
exports.__esModule = true;
exports.createSmallTable = void 0;
/* eslint-disable */
var fs_1 = require("fs");
var canvas_1 = require("canvas");
var VTable = require("../cjs/index");
var resvg_js_1 = require("@resvg/resvg-js");
var generatePersons = function (count) {
    return Array.from(new Array(count)).map(function (_, i) { return ({
        id: i + 1,
        email1: "".concat(i + 1, "@xxx.com"),
        name: "\u5C0F\u660E".concat(i + 1),
        lastName: '王',
        date1: '2022年9月1日',
        tel: '000-0000-0000',
        sex: i % 2 === 0 ? 'boy' : 'girl',
        work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
        city: 'beijing'
    }); });
};
function createSmallTable() {
    var records = generatePersons(3);
    var columns = [
        {
            field: 'id',
            title: 'ID ff',
            width: '1%',
            minWidth: 200,
            sort: true
        },
        {
            field: 'email1',
            title: 'email',
            width: 200,
            sort: true
        }
    ];
    var option = {
        records: records,
        columns: columns,
        pixelRatio: 2,
        // for nodejs
        mode: 'node',
        modeParams: {
            createCanvas: canvas_1.createCanvas,
            createImageData: canvas_1.createImageData,
            loadImage: canvas_1.loadImage,
            Resvg: resvg_js_1.Resvg
        },
        canvasWidth: 500,
        canvasHeight: 300
    };
    var tableInstance = new VTable.ListTable(option);
    var buffer = tableInstance.getImageBuffer();
    fs_1.writeFileSync("".concat(__dirname, "/small-table.png"), buffer);
}
exports.createSmallTable = createSmallTable;
