"use strict";
exports.__esModule = true;
exports.createListTable = void 0;
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
function createListTable() {
    var records = generatePersons(20);
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
        },
        {
            title: 'full name',
            columns: [
                {
                    field: 'name',
                    title: 'First Name',
                    width: 200
                },
                {
                    field: 'name',
                    title: 'Last Name',
                    width: 200
                }
            ]
        },
        {
            field: 'date1',
            title: 'birthday',
            width: 200
        },
        {
            field: 'sex',
            title: 'sex',
            width: 100
        },
        {
            field: 'tel',
            title: 'telephone',
            width: 150
        },
        {
            field: 'work',
            title: 'job',
            width: 200
        },
        {
            field: 'city',
            title: 'city',
            width: 150
        }
    ];
    var option = {
        records: records,
        columns: columns,
        // pixelRatio: 2,
        // for nodejs
        mode: 'node',
        modeParams: {
            createCanvas: canvas_1.createCanvas,
            createImageData: canvas_1.createImageData,
            loadImage: canvas_1.loadImage,
            Resvg: resvg_js_1.Resvg
        },
        canvasWidth: 1000,
        canvasHeight: 700
    };
    var tableInstance = new VTable.ListTable(option);
    var buffer = tableInstance.getImageBuffer();
    fs_1.writeFileSync("".concat(__dirname, "/list-table.png"), buffer);
}
exports.createListTable = createListTable;
