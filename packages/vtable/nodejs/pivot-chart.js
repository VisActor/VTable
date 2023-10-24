"use strict";
exports.__esModule = true;
exports.createPivotChart = void 0;
/* eslint-disable */
var fs_1 = require("fs");
var canvas_1 = require("canvas");
var VTable = require("../cjs/index");
var vchart_1 = require("@visactor/vchart");
var resvg_js_1 = require("@resvg/resvg-js");
VTable.register.chartModule('vchart', vchart_1.default);
function createPivotChart() {
    var option = {
        widthMode: 'adaptive',
        heightMode: 'adaptive',
        columnTree: [],
        rowTree: [
            {
                dimensionKey: '231010205143009',
                value: '一级',
                children: [
                    {
                        dimensionKey: '231010171607024',
                        value: '公司'
                    },
                    {
                        dimensionKey: '231010171607024',
                        value: '小型企业'
                    },
                    {
                        dimensionKey: '231010171607024',
                        value: '消费者'
                    }
                ]
            },
            {
                dimensionKey: '231010205143009',
                value: '二级',
                children: [
                    {
                        dimensionKey: '231010171607024',
                        value: '公司'
                    },
                    {
                        dimensionKey: '231010171607024',
                        value: '小型企业'
                    },
                    {
                        dimensionKey: '231010171607024',
                        value: '消费者'
                    }
                ]
            },
            {
                dimensionKey: '231010205143009',
                value: '当日',
                children: [
                    {
                        dimensionKey: '231010171607024',
                        value: '公司'
                    },
                    {
                        dimensionKey: '231010171607024',
                        value: '小型企业'
                    },
                    {
                        dimensionKey: '231010171607024',
                        value: '消费者'
                    }
                ]
            },
            {
                dimensionKey: '231010205143009',
                value: '标准级',
                children: [
                    {
                        dimensionKey: '231010171607024',
                        value: '公司'
                    },
                    {
                        dimensionKey: '231010171607024',
                        value: '小型企业'
                    },
                    {
                        dimensionKey: '231010171607024',
                        value: '消费者'
                    }
                ]
            }
        ],
        columns: [],
        rows: [
            {
                dimensionKey: '231010205143009',
                title: '邮寄方式'
            },
            {
                dimensionKey: '231010171607024',
                title: '细分'
            }
        ],
        axes: [
            {
                type: 'band',
                tick: {
                    visible: false
                },
                grid: {
                    visible: false,
                    style: {
                        zIndex: 150,
                        stroke: '#DADCDD',
                        lineWidth: 1,
                        lineDash: [4, 2]
                    }
                },
                orient: 'left',
                visible: true,
                domainLine: {
                    visible: true,
                    style: {
                        lineWidth: 1,
                        stroke: '#989999'
                    }
                },
                title: {
                    visible: false,
                    space: 5,
                    text: '地区',
                    style: {
                        fontSize: 12,
                        fill: '#363839',
                        fontWeight: 'normal'
                    }
                },
                sampling: false,
                zIndex: 200,
                label: {
                    visible: true,
                    space: 8,
                    style: {
                        fontSize: 12,
                        fill: '#6F6F6F',
                        angle: 0,
                        fontWeight: 'normal',
                        direction: 'horizontal'
                    },
                    autoHide: true,
                    autoHideMethod: 'greedy',
                    flush: true
                },
                hover: true,
                background: {
                    visible: true,
                    state: {
                        hover: {
                            fillOpacity: 0.08,
                            fill: '#141414'
                        },
                        hover_reverse: {
                            fillOpacity: 0.08,
                            fill: '#141414'
                        }
                    }
                },
                paddingInner: [0.15, 0.1],
                paddingOuter: [0.075, 0.1]
            }
        ],
        indicators: [
            {
                indicatorKey: '0',
                width: 'auto',
                title: '',
                cellType: 'chart',
                chartModule: 'vchart',
                chartSpec: {
                    type: 'common',
                    axes: [
                        {
                            id: 'main-0',
                            type: 'linear',
                            tick: {
                                visible: false,
                                tickMode: 'd3',
                                style: {
                                    stroke: 'rgba(255, 255, 255, 0)'
                                }
                            },
                            niceType: 'accurateFirst',
                            zIndex: 200,
                            grid: {
                                visible: true,
                                style: {
                                    zIndex: 150,
                                    stroke: '#DADCDD',
                                    lineWidth: 1,
                                    lineDash: [4, 2]
                                }
                            },
                            orient: 'bottom',
                            visible: true,
                            domainLine: {
                                visible: true,
                                style: {
                                    lineWidth: 1,
                                    stroke: 'rgba(255, 255, 255, 0)'
                                }
                            },
                            title: {
                                visible: true,
                                text: '利润',
                                space: 8,
                                style: {
                                    fontSize: 12,
                                    fill: '#363839',
                                    fontWeight: 'normal'
                                }
                            },
                            sampling: false,
                            label: {
                                visible: true,
                                space: 4,
                                flush: true,
                                padding: 0,
                                style: {
                                    fontSize: 12,
                                    maxLineWidth: 174,
                                    fill: '#6F6F6F',
                                    angle: 0,
                                    fontWeight: 'normal',
                                    dy: -1,
                                    direction: 'horizontal'
                                },
                                autoHide: true,
                                autoHideMethod: 'greedy'
                            },
                            hover: false,
                            background: {
                                visible: true,
                                state: {
                                    hover: {
                                        fillOpacity: 0.08,
                                        fill: '#141414'
                                    },
                                    hover_reverse: {
                                        fillOpacity: 0.08,
                                        fill: '#141414'
                                    }
                                }
                            },
                            zero: true,
                            sync: {
                                axisId: 'sub-0',
                                zeroAlign: true,
                                tickAlign: false
                            }
                        },
                        {
                            id: 'sub-0',
                            type: 'linear',
                            tick: {
                                visible: false,
                                tickMode: 'd3',
                                style: {
                                    stroke: 'rgba(255, 255, 255, 0)'
                                }
                            },
                            niceType: 'accurateFirst',
                            zIndex: 200,
                            grid: {
                                visible: false,
                                style: {
                                    zIndex: 150,
                                    stroke: '#DADCDD',
                                    lineWidth: 1,
                                    lineDash: [4, 2]
                                }
                            },
                            orient: 'top',
                            visible: true,
                            domainLine: {
                                visible: true,
                                style: {
                                    lineWidth: 1,
                                    stroke: 'rgba(255, 255, 255, 0)'
                                }
                            },
                            title: {
                                visible: true,
                                text: '利润',
                                space: 8,
                                style: {
                                    fontSize: 12,
                                    fill: '#363839',
                                    fontWeight: 'normal'
                                }
                            },
                            sampling: false,
                            label: {
                                visible: true,
                                space: 4,
                                flush: true,
                                padding: 0,
                                style: {
                                    fontSize: 12,
                                    maxLineWidth: 174,
                                    fill: '#6F6F6F',
                                    angle: 0,
                                    fontWeight: 'normal',
                                    dy: -1,
                                    direction: 'horizontal'
                                },
                                autoHide: true,
                                autoHideMethod: 'greedy'
                            },
                            hover: false,
                            background: {
                                visible: true,
                                state: {
                                    hover: {
                                        fillOpacity: 0.08,
                                        fill: '#141414'
                                    },
                                    hover_reverse: {
                                        fillOpacity: 0.08,
                                        fill: '#141414'
                                    }
                                }
                            },
                            zero: true,
                            nice: true
                        }
                    ],
                    stackInverse: false,
                    series: [
                        {
                            type: 'bar',
                            yField: ['231010112314020', '10001'],
                            xField: '10011',
                            seriesField: '20001',
                            direction: 'horizontal',
                            data: {
                                id: 'main-data',
                                fields: {
                                    '10001': {
                                        alias: '指标名称 '
                                    },
                                    '10011': {
                                        alias: '指标值(主轴) '
                                    },
                                    '10012': {
                                        alias: '指标值(次轴) '
                                    },
                                    '20001': {
                                        alias: '图例项 ',
                                        domain: ['利润'],
                                        sortIndex: 0,
                                        lockStatisticsByDomain: true
                                    },
                                    '231010112314020': {
                                        alias: '地区',
                                        domain: ['中南', '华东', '华北', '地区-dongbei', '西北', '西南'],
                                        sortIndex: 0,
                                        lockStatisticsByDomain: true
                                    },
                                    '231010171607024': {
                                        alias: '细分'
                                    },
                                    '231010190513015': {
                                        alias: '利润'
                                    },
                                    '231010205143009': {
                                        alias: '邮寄方式'
                                    },
                                    '231010205143014': {
                                        alias: '利润'
                                    }
                                }
                            },
                            stackInverse: false,
                            line: {
                                style: {
                                    curveType: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: ['linear'],
                                        domain: ['利润']
                                    },
                                    lineWidth: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [3],
                                        domain: ['利润']
                                    },
                                    lineDash: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [[0, 0]],
                                        domain: ['利润']
                                    }
                                }
                            },
                            area: {
                                style: {
                                    curveType: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: ['linear'],
                                        domain: ['利润']
                                    }
                                }
                            },
                            point: {
                                style: {
                                    shape: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: ['circle'],
                                        domain: ['利润']
                                    },
                                    size: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [7.0898154036220635],
                                        domain: ['利润']
                                    },
                                    strokeOpacity: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [1],
                                        domain: ['利润']
                                    },
                                    fillOpacity: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [1],
                                        domain: ['利润']
                                    }
                                },
                                state: {
                                    hover: {
                                        lineWidth: 2,
                                        fillOpacity: 1,
                                        strokeOpacity: 1,
                                        scaleX: 1.5,
                                        scaleY: 1.5
                                    }
                                }
                            },
                            invalidType: 'break',
                            hover: {
                                enable: true
                            },
                            select: {
                                enable: true
                            },
                            bar: {
                                state: {
                                    hover: {
                                        cursor: 'pointer',
                                        fillOpacity: 0.8,
                                        stroke: '#58595B',
                                        lineWidth: 1,
                                        zIndex: 500
                                    },
                                    selected: {
                                        cursor: 'pointer',
                                        fillOpacity: 1,
                                        stroke: '#58595B',
                                        lineWidth: 1
                                    },
                                    selected_reverse: {
                                        fillOpacity: 0.3,
                                        strokeWidth: 0.3
                                    }
                                }
                            },
                            label: {
                                visible: false,
                                overlap: {
                                    hideOnHit: true,
                                    avoidBaseMark: false,
                                    strategy: [
                                        {
                                            type: 'moveY',
                                            offset: [
                                                -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1,
                                                2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                                            ]
                                        },
                                        {
                                            type: 'moveX',
                                            offset: [
                                                -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1,
                                                2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                                            ]
                                        }
                                    ],
                                    clampForce: true
                                },
                                style: {
                                    fontSize: 12,
                                    fontWeight: 'normal',
                                    zIndex: 400,
                                    fill: '#363839',
                                    stroke: 'rgba(255, 255, 255, 0.8)',
                                    lineWidth: 2,
                                    strokeOpacity: 1
                                },
                                position: 'outside',
                                smartInvert: false
                            }
                        },
                        {
                            type: 'line',
                            yField: ['231010112314020', '10001'],
                            xField: '10012',
                            seriesField: '20001',
                            direction: 'horizontal',
                            data: {
                                sortIndex: 0,
                                id: 'sub-data',
                                fields: {
                                    '10001': {
                                        alias: '指标名称 '
                                    },
                                    '10011': {
                                        alias: '指标值(主轴) '
                                    },
                                    '10012': {
                                        alias: '指标值(次轴) '
                                    },
                                    '20001': {
                                        alias: '图例项 ',
                                        domain: ['利润'],
                                        sortIndex: 0,
                                        lockStatisticsByDomain: true
                                    },
                                    '231010112314020': {
                                        alias: '地区',
                                        domain: ['中南', '华东', '华北', '地区-dongbei', '西北', '西南'],
                                        sortIndex: 0,
                                        lockStatisticsByDomain: true
                                    },
                                    '231010171607024': {
                                        alias: '细分'
                                    },
                                    '231010190513015': {
                                        alias: '利润'
                                    },
                                    '231010205143009': {
                                        alias: '邮寄方式'
                                    },
                                    '231010205143014': {
                                        alias: '利润'
                                    }
                                }
                            },
                            stackInverse: false,
                            line: {
                                style: {
                                    curveType: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: ['linear'],
                                        domain: ['利润']
                                    },
                                    lineWidth: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [3],
                                        domain: ['利润']
                                    },
                                    lineDash: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [[0, 0]],
                                        domain: ['利润']
                                    }
                                }
                            },
                            area: {
                                style: {
                                    curveType: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: ['linear'],
                                        domain: ['利润']
                                    }
                                }
                            },
                            point: {
                                style: {
                                    shape: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: ['circle'],
                                        domain: ['利润']
                                    },
                                    size: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [7.0898154036220635],
                                        domain: ['利润']
                                    },
                                    strokeOpacity: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [1],
                                        domain: ['利润']
                                    },
                                    fillOpacity: {
                                        type: 'ordinal',
                                        field: '20001',
                                        range: [1],
                                        domain: ['利润']
                                    }
                                },
                                state: {
                                    hover: {
                                        lineWidth: 2,
                                        fillOpacity: 1,
                                        strokeOpacity: 1,
                                        scaleX: 1.5,
                                        scaleY: 1.5
                                    }
                                }
                            },
                            invalidType: 'break',
                            hover: {
                                enable: true
                            },
                            select: {
                                enable: true
                            },
                            bar: {
                                state: {
                                    hover: {
                                        cursor: 'pointer',
                                        fillOpacity: 0.8,
                                        stroke: '#58595B',
                                        lineWidth: 1,
                                        zIndex: 500
                                    },
                                    selected: {
                                        cursor: 'pointer',
                                        fillOpacity: 1,
                                        stroke: '#58595B',
                                        lineWidth: 1
                                    },
                                    selected_reverse: {
                                        fillOpacity: 0.3,
                                        strokeWidth: 0.3
                                    }
                                }
                            },
                            label: {
                                visible: false,
                                overlap: {
                                    hideOnHit: true,
                                    avoidBaseMark: false,
                                    strategy: [
                                        {
                                            type: 'moveY',
                                            offset: [
                                                -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1,
                                                2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                                            ]
                                        },
                                        {
                                            type: 'moveX',
                                            offset: [
                                                -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1,
                                                2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                                            ]
                                        }
                                    ],
                                    clampForce: true
                                },
                                style: {
                                    fontSize: 12,
                                    fontWeight: 'normal',
                                    zIndex: 400,
                                    fill: '#363839',
                                    stroke: 'rgba(255, 255, 255, 0.8)',
                                    lineWidth: 2,
                                    strokeOpacity: 1
                                },
                                position: 'outside',
                                smartInvert: false
                            }
                        }
                    ],
                    tooltip: {
                        handler: {}
                    },
                    seriesField: '20001',
                    color: {
                        field: '20001',
                        type: 'ordinal',
                        range: ['#2E62F1'],
                        specified: {},
                        domain: ['利润']
                    },
                    crosshair: {
                        yField: {
                            visible: true
                        },
                        gridZIndex: 100
                    }
                }
            }
        ],
        indicatorsAsCol: true,
        records: {
            '0': [
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '29552.69842272997',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '公司',
                    '231010190513015': '29552.69842272997',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '14869.259436711669',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '公司',
                    '231010190513015': '14869.259436711669',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '13720.042139291763',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '公司',
                    '231010190513015': '13720.042139291763',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '10807.019856154919',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '公司',
                    '231010190513015': '10807.019856154919',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '1502.228010892868',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '公司',
                    '231010190513015': '1502.228010892868',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '-10060.35078561306',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '公司',
                    '231010190513015': '-10060.35078561306',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '29552.69842272997',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '公司',
                    '231010205143009': '一级',
                    '231010205143014': '29552.69842272997'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '14869.259436711669',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '公司',
                    '231010205143009': '一级',
                    '231010205143014': '14869.259436711669'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '13720.042139291763',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '公司',
                    '231010205143009': '一级',
                    '231010205143014': '13720.042139291763'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '10807.019856154919',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '公司',
                    '231010205143009': '一级',
                    '231010205143014': '10807.019856154919'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '1502.228010892868',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '公司',
                    '231010205143009': '一级',
                    '231010205143014': '1502.228010892868'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '-10060.35078561306',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '公司',
                    '231010205143009': '一级',
                    '231010205143014': '-10060.35078561306'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '21340.899931192398',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '小型企业',
                    '231010190513015': '21340.899931192398',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '15056.691901683807',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '小型企业',
                    '231010190513015': '15056.691901683807',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '5877.844171881676',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '小型企业',
                    '231010190513015': '5877.844171881676',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '5169.304051876068',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '小型企业',
                    '231010190513015': '5169.304051876068',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '2820.3279762268066',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '小型企业',
                    '231010190513015': '2820.3279762268066',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '1471.259955406189',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '小型企业',
                    '231010190513015': '1471.259955406189',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '21340.899931192398',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '小型企业',
                    '231010205143009': '一级',
                    '231010205143014': '21340.899931192398'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '15056.691901683807',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '小型企业',
                    '231010205143009': '一级',
                    '231010205143014': '15056.691901683807'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '5877.844171881676',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '小型企业',
                    '231010205143009': '一级',
                    '231010205143014': '5877.844171881676'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '5169.304051876068',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '小型企业',
                    '231010205143009': '一级',
                    '231010205143014': '5169.304051876068'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '2820.3279762268066',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '小型企业',
                    '231010205143009': '一级',
                    '231010205143014': '2820.3279762268066'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '1471.259955406189',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '小型企业',
                    '231010205143009': '一级',
                    '231010205143014': '1471.259955406189'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '64387.98809123039',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '消费者',
                    '231010190513015': '64387.98809123039',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '48468.23799917102',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '消费者',
                    '231010190513015': '48468.23799917102',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '22280.20186841488',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '消费者',
                    '231010190513015': '22280.20186841488',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '20700.868910312653',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '消费者',
                    '231010190513015': '20700.868910312653',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '4222.623946420848',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '消费者',
                    '231010190513015': '4222.623946420848',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '4093.964047908783',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '消费者',
                    '231010190513015': '4093.964047908783',
                    '231010205143009': '一级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '64387.98809123039',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '消费者',
                    '231010205143009': '一级',
                    '231010205143014': '64387.98809123039'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '48468.23799917102',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '消费者',
                    '231010205143009': '一级',
                    '231010205143014': '48468.23799917102'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '22280.20186841488',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '消费者',
                    '231010205143009': '一级',
                    '231010205143014': '22280.20186841488'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '20700.868910312653',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '消费者',
                    '231010205143009': '一级',
                    '231010205143014': '20700.868910312653'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '4222.623946420848',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '消费者',
                    '231010205143009': '一级',
                    '231010205143014': '4222.623946420848'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '4093.964047908783',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '消费者',
                    '231010205143009': '一级',
                    '231010205143014': '4093.964047908783'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '39134.7112814188',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '公司',
                    '231010190513015': '39134.7112814188',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '39131.42789667845',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '公司',
                    '231010190513015': '39131.42789667845',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '34600.132201075554',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '公司',
                    '231010190513015': '34600.132201075554',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '24406.01051365584',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '公司',
                    '231010190513015': '24406.01051365584',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '1774.9199981689453',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '公司',
                    '231010190513015': '1774.9199981689453',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '-1690.0240671634674',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '公司',
                    '231010190513015': '-1690.0240671634674',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '39134.7112814188',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '公司',
                    '231010205143009': '二级',
                    '231010205143014': '39134.7112814188'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '39131.42789667845',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '公司',
                    '231010205143009': '二级',
                    '231010205143014': '39131.42789667845'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '34600.132201075554',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '公司',
                    '231010205143009': '二级',
                    '231010205143014': '34600.132201075554'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '24406.01051365584',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '公司',
                    '231010205143009': '二级',
                    '231010205143014': '24406.01051365584'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '1774.9199981689453',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '公司',
                    '231010205143009': '二级',
                    '231010205143014': '1774.9199981689453'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '-1690.0240671634674',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '公司',
                    '231010205143009': '二级',
                    '231010205143014': '-1690.0240671634674'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '36975.93182075024',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '小型企业',
                    '231010190513015': '36975.93182075024',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '23235.631998449564',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '小型企业',
                    '231010190513015': '23235.631998449564',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '14651.370790958405',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '小型企业',
                    '231010190513015': '14651.370790958405',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '12670.811906427145',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '小型企业',
                    '231010190513015': '12670.811906427145',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '4730.656059741974',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '小型企业',
                    '231010190513015': '4730.656059741974',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '-3066.671887397766',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '小型企业',
                    '231010190513015': '-3066.671887397766',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '36975.93182075024',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '小型企业',
                    '231010205143009': '二级',
                    '231010205143014': '36975.93182075024'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '23235.631998449564',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '小型企业',
                    '231010205143009': '二级',
                    '231010205143014': '23235.631998449564'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '14651.370790958405',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '小型企业',
                    '231010205143009': '二级',
                    '231010205143014': '14651.370790958405'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '12670.811906427145',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '小型企业',
                    '231010205143009': '二级',
                    '231010205143014': '12670.811906427145'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '4730.656059741974',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '小型企业',
                    '231010205143009': '二级',
                    '231010205143014': '4730.656059741974'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '-3066.671887397766',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '小型企业',
                    '231010205143009': '二级',
                    '231010205143014': '-3066.671887397766'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '82380.8867816925',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '消费者',
                    '231010190513015': '82380.8867816925',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '50585.779735803604',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '消费者',
                    '231010190513015': '50585.779735803604',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '44140.46036553383',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '消费者',
                    '231010190513015': '44140.46036553383',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '43945.29997563362',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '消费者',
                    '231010190513015': '43945.29997563362',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '17045.55988186598',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '消费者',
                    '231010190513015': '17045.55988186598',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '11236.2601313591',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '消费者',
                    '231010190513015': '11236.2601313591',
                    '231010205143009': '二级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '82380.8867816925',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '消费者',
                    '231010205143009': '二级',
                    '231010205143014': '82380.8867816925'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '50585.779735803604',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '消费者',
                    '231010205143009': '二级',
                    '231010205143014': '50585.779735803604'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '44140.46036553383',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '消费者',
                    '231010205143009': '二级',
                    '231010205143014': '44140.46036553383'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '43945.29997563362',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '消费者',
                    '231010205143009': '二级',
                    '231010205143014': '43945.29997563362'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '17045.55988186598',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '消费者',
                    '231010205143009': '二级',
                    '231010205143014': '17045.55988186598'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '11236.2601313591',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '消费者',
                    '231010205143009': '二级',
                    '231010205143014': '11236.2601313591'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '22255.897431716323',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '公司',
                    '231010190513015': '22255.897431716323',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '18356.99584555626',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '公司',
                    '231010190513015': '18356.99584555626',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '13119.539881706238',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '公司',
                    '231010190513015': '13119.539881706238',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '5692.119945526123',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '公司',
                    '231010190513015': '5692.119945526123',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '3108.4690698310733',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '公司',
                    '231010190513015': '3108.4690698310733',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '-3322.95596408844',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '公司',
                    '231010190513015': '-3322.95596408844',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '22255.897431716323',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '公司',
                    '231010205143009': '当日',
                    '231010205143014': '22255.897431716323'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '18356.99584555626',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '公司',
                    '231010205143009': '当日',
                    '231010205143014': '18356.99584555626'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '13119.539881706238',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '公司',
                    '231010205143009': '当日',
                    '231010205143014': '13119.539881706238'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '5692.119945526123',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '公司',
                    '231010205143009': '当日',
                    '231010205143014': '5692.119945526123'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '3108.4690698310733',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '公司',
                    '231010205143009': '当日',
                    '231010205143014': '3108.4690698310733'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '-3322.95596408844',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '公司',
                    '231010205143009': '当日',
                    '231010205143014': '-3322.95596408844'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '11269.272097229958',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '小型企业',
                    '231010190513015': '11269.272097229958',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '6759.164978027344',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '小型企业',
                    '231010190513015': '6759.164978027344',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '2055.508020401001',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '小型企业',
                    '231010190513015': '2055.508020401001',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '1721.5800495147705',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '小型企业',
                    '231010190513015': '1721.5800495147705',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '1248.3519949913025',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '小型企业',
                    '231010190513015': '1248.3519949913025',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '577.4999907016754',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '小型企业',
                    '231010190513015': '577.4999907016754',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '11269.272097229958',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '小型企业',
                    '231010205143009': '当日',
                    '231010205143014': '11269.272097229958'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '6759.164978027344',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '小型企业',
                    '231010205143009': '当日',
                    '231010205143014': '6759.164978027344'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '2055.508020401001',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '小型企业',
                    '231010205143009': '当日',
                    '231010205143014': '2055.508020401001'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '1721.5800495147705',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '小型企业',
                    '231010205143009': '当日',
                    '231010205143014': '1721.5800495147705'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '1248.3519949913025',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '小型企业',
                    '231010205143009': '当日',
                    '231010205143014': '1248.3519949913025'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '577.4999907016754',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '小型企业',
                    '231010205143009': '当日',
                    '231010205143014': '577.4999907016754'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '18896.080198287964',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '消费者',
                    '231010190513015': '18896.080198287964',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '16592.814119160175',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '消费者',
                    '231010190513015': '16592.814119160175',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '10673.79599237442',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '消费者',
                    '231010190513015': '10673.79599237442',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '2528.400135964155',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '消费者',
                    '231010190513015': '2528.400135964155',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '1458.996036529541',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '消费者',
                    '231010190513015': '1458.996036529541',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '1382.7799935340881',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '消费者',
                    '231010190513015': '1382.7799935340881',
                    '231010205143009': '当日'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '18896.080198287964',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '消费者',
                    '231010205143009': '当日',
                    '231010205143014': '18896.080198287964'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '16592.814119160175',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '消费者',
                    '231010205143009': '当日',
                    '231010205143014': '16592.814119160175'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '10673.79599237442',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '消费者',
                    '231010205143009': '当日',
                    '231010205143014': '10673.79599237442'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '2528.400135964155',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '消费者',
                    '231010205143009': '当日',
                    '231010205143014': '2528.400135964155'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '1458.996036529541',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '消费者',
                    '231010205143009': '当日',
                    '231010205143014': '1458.996036529541'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '1382.7799935340881',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '消费者',
                    '231010205143009': '当日',
                    '231010205143014': '1382.7799935340881'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '118087.98317557573',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '公司',
                    '231010190513015': '118087.98317557573',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '106918.77745839208',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '公司',
                    '231010190513015': '106918.77745839208',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '105005.49484279752',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '公司',
                    '231010190513015': '105005.49484279752',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '39524.19761827588',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '公司',
                    '231010190513015': '39524.19761827588',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '35121.29611492157',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '公司',
                    '231010190513015': '35121.29611492157',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '20351.74444913864',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '公司',
                    '231010190513015': '20351.74444913864',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '118087.98317557573',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '公司',
                    '231010205143009': '标准级',
                    '231010205143014': '118087.98317557573'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '106918.77745839208',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '公司',
                    '231010205143009': '标准级',
                    '231010205143014': '106918.77745839208'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '105005.49484279752',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '公司',
                    '231010205143009': '标准级',
                    '231010205143014': '105005.49484279752'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '39524.19761827588',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '公司',
                    '231010205143009': '标准级',
                    '231010205143014': '39524.19761827588'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '35121.29611492157',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '公司',
                    '231010205143009': '标准级',
                    '231010205143014': '35121.29611492157'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '20351.74444913864',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '公司',
                    '231010205143009': '标准级',
                    '231010205143014': '20351.74444913864'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '88442.71798437834',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '小型企业',
                    '231010190513015': '88442.71798437834',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '53928.448032945395',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '小型企业',
                    '231010190513015': '53928.448032945395',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '50717.0440325737',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '小型企业',
                    '231010190513015': '50717.0440325737',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '44391.907398581505',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '小型企业',
                    '231010190513015': '44391.907398581505',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '6468.615869402885',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '小型企业',
                    '231010190513015': '6468.615869402885',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '3964.4918270111084',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '小型企业',
                    '231010190513015': '3964.4918270111084',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '88442.71798437834',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '小型企业',
                    '231010205143009': '标准级',
                    '231010205143014': '88442.71798437834'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '53928.448032945395',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '小型企业',
                    '231010205143009': '标准级',
                    '231010205143014': '53928.448032945395'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '50717.0440325737',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '小型企业',
                    '231010205143009': '标准级',
                    '231010205143014': '50717.0440325737'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '44391.907398581505',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '小型企业',
                    '231010205143009': '标准级',
                    '231010205143014': '44391.907398581505'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '6468.615869402885',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '小型企业',
                    '231010205143009': '标准级',
                    '231010205143014': '6468.615869402885'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '3964.4918270111084',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '小型企业',
                    '231010205143009': '标准级',
                    '231010205143014': '3964.4918270111084'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '210141.89068495482',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '消费者',
                    '231010190513015': '210141.89068495482',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '145396.04913766682',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '消费者',
                    '231010190513015': '145396.04913766682',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '116499.65626353025',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '消费者',
                    '231010190513015': '116499.65626353025',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '52270.36535333097',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '消费者',
                    '231010190513015': '52270.36535333097',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '37391.45208977163',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '消费者',
                    '231010190513015': '37391.45208977163',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010190513015',
                    '10011': '26372.219661466777',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '消费者',
                    '231010190513015': '26372.219661466777',
                    '231010205143009': '标准级'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '210141.89068495482',
                    '20001': '利润',
                    '231010112314020': '中南',
                    '231010171607024': '消费者',
                    '231010205143009': '标准级',
                    '231010205143014': '210141.89068495482'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '145396.04913766682',
                    '20001': '利润',
                    '231010112314020': '华东',
                    '231010171607024': '消费者',
                    '231010205143009': '标准级',
                    '231010205143014': '145396.04913766682'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '116499.65626353025',
                    '20001': '利润',
                    '231010112314020': '华北',
                    '231010171607024': '消费者',
                    '231010205143009': '标准级',
                    '231010205143014': '116499.65626353025'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '52270.36535333097',
                    '20001': '利润',
                    '231010112314020': '地区-dongbei',
                    '231010171607024': '消费者',
                    '231010205143009': '标准级',
                    '231010205143014': '52270.36535333097'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '37391.45208977163',
                    '20001': '利润',
                    '231010112314020': '西南',
                    '231010171607024': '消费者',
                    '231010205143009': '标准级',
                    '231010205143014': '37391.45208977163'
                },
                {
                    '10001': '利润',
                    '10003': '231010205143014',
                    '10012': '26372.219661466777',
                    '20001': '利润',
                    '231010112314020': '西北',
                    '231010171607024': '消费者',
                    '231010205143009': '标准级',
                    '231010205143014': '26372.219661466777'
                }
            ]
        },
        defaultHeaderColWidth: [80, 'auto'],
        indicatorTitle: '',
        autoWrapText: true,
        legends: {
            type: 'discrete',
            id: 'legend-discrete',
            orient: 'bottom',
            position: 'middle',
            layoutType: 'normal',
            visible: true,
            maxRow: 1,
            title: {
                textStyle: {
                    fontSize: 12,
                    fill: '#6F6F6F'
                }
            },
            layoutLevel: 50,
            item: {
                focus: true,
                focusIconStyle: {
                    size: 14
                },
                maxWidth: 400,
                spaceRow: 0,
                spaceCol: 0,
                padding: {
                    top: 1,
                    bottom: 1,
                    left: 1,
                    right: 1
                },
                background: {
                    visible: false,
                    style: {
                        fillOpacity: 0.001
                    }
                },
                label: {
                    style: {
                        fontSize: 12,
                        fill: '#6F6F6F'
                    }
                },
                shape: {
                    style: {
                        lineWidth: 0,
                        symbolType: 'square'
                    }
                }
            },
            pager: {
                layout: 'horizontal',
                padding: 0,
                textStyle: {},
                space: 0,
                handler: {
                    preShape: 'triangleLeft',
                    nextShape: 'triangleRight',
                    style: {},
                    state: {
                        disable: {}
                    }
                }
            },
            padding: [16, 0, 0, 0],
            data: [
                {
                    label: '利润',
                    shape: {
                        fill: '#2E62F1',
                        symbolType: 'square'
                    }
                }
            ]
        },
        corner: {
            titleOnDimension: 'row'
        },
        title: {
            text: '',
            align: 'center',
            orient: 'top',
            padding: [3, 0, 5, 0],
            textStyle: {
                fontSize: 12,
                fill: '#333333',
                fontWeight: 'bold'
            }
        },
        theme: {
            bodyStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                borderLineWidth: [1, 0, 0, 1],
                padding: 1
            },
            headerStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                fontSize: 12,
                color: '#333333',
                textAlign: 'center',
                borderLineWidth: [0, 0, 1, 1],
                padding: [4, 0, 4, 0],
                hover: {
                    cellBgColor: '#eceded'
                }
            },
            rowHeaderStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                fontSize: 12,
                color: '#333333',
                padding: [0, 0, 0, 4],
                borderLineWidth: [1, 1, 0, 0],
                hover: {
                    cellBgColor: '#eceded'
                }
            },
            cornerHeaderStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                textAlign: 'center',
                fontSize: 12,
                color: '#333333',
                fontWeight: 'bold',
                borderLineWidth: [0, 1, 1, 0],
                padding: 0,
                hover: {
                    cellBgColor: ''
                }
            },
            cornerRightTopCellStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                borderLineWidth: [0, 0, 1, 1],
                padding: 0,
                hover: {
                    cellBgColor: ''
                }
            },
            cornerLeftBottomCellStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                borderLineWidth: [1, 0, 0, 0],
                hover: {
                    cellBgColor: ''
                }
            },
            cornerRightBottomCellStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                borderLineWidth: [1, 0, 0, 1],
                hover: {
                    cellBgColor: ''
                }
            },
            rightFrozenStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                borderLineWidth: [1, 0, 1, 1],
                hover: {
                    cellBgColor: '#eceded'
                }
            },
            bottomFrozenStyle: {
                borderColor: 'rgba(0,4,20,0.2)',
                borderLineWidth: [1, 0, 0, 1],
                padding: 0,
                hover: {
                    cellBgColor: '#eceded'
                }
            },
            selectionStyle: {
                cellBgColor: '',
                cellBorderColor: ''
            },
            frameStyle: {
                borderLineWidth: 0
            }
        },
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
    var tableInstance = new VTable.PivotChart(option);
    setTimeout(function () {
        var buffer = tableInstance.getImageBuffer();
        fs_1.writeFileSync("".concat(__dirname, "/pivot-chart.png"), buffer);
    }, 0);
}
exports.createPivotChart = createPivotChart;
