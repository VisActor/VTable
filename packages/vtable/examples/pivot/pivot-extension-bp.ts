import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
// import expandIcons from './Close.svg';
// import collapseIcons from './Open.svg';

const PivotTable = VTable.PivotTable;

export const expandIcon: any = {
  type: 'svg',
  // svg: expandIcons,
  width: 12,
  height: 12,
  name: 'expand',
  positionType: VTable.TYPES.IconPosition.contentLeft,
  funcType: VTable.TYPES.IconFuncTypeEnum.expand,
  hover: {
    width: 12,
    height: 12,
    bgColor: 'rgba(31, 35, 41, 0.12)'
  },
  cursor: 'pointer'
};

export const collapseIcon: any = {
  type: 'svg',
  // svg: collapseIcons,
  width: 12,
  height: 12,
  name: 'collapse',
  positionType: VTable.TYPES.IconPosition.contentLeft,
  funcType: VTable.TYPES.IconFuncTypeEnum.collapse,

  hover: {
    width: 12,
    height: 12,
    bgColor: 'rgba(31, 35, 41, 0.12)'
  },
  cursor: 'pointer'
};
// VTable.register.icon('expand', expandIcon);
// VTable.register.icon('collapse', collapseIcon);
const CONTAINER_ID = 'vTable';
const records = [];
export function createTable() {
  const option: VTable.PivotTableConstructorOptions = {
    rowHierarchyType: 'tree',

    autoRowHeight: true,
    widthMode: 'standard',
    disableColumnResize: false,
    autoWrapText: false,
    enableColumnResizeOnAllRows: true,
    maxCharactersNumber: 256,
    keyboardOptions: {
      copySelected: false
    },
    columnResizerType: 'all',
    dropDownMenu: {
      renderMode: 'html',
      dropDownMenuHighlight: []
    },
    records: [],
    rowTree: [
      {
        dimensionKey: 'region_row_level_1',
        value: '全球',
        sentryKey: 'R0100',
        hierarchyState: 'expand',
        children: [
          {
            dimensionKey: 'region_row_level_2',
            value: '中国大陆',
            sentryKey: 'R0102',
            hierarchyState: 'expand'
          },
          {
            dimensionKey: 'region_row_level_2',
            value: '非中国大陆',
            sentryKey: 'R010100',
            hierarchyState: 'expand',
            children: [
              {
                dimensionKey: 'region_row_level_3',
                value: '北美洲',
                sentryKey: 'R01010200',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '加拿大',
                    sentryKey: 'R01010201'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '美国',
                    sentryKey: 'R01010202'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '美属维尔京群岛',
                    sentryKey: 'R01010203'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣马丁',
                    sentryKey: 'R01010205'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '特克斯和凯科斯群岛',
                    sentryKey: 'R01010207'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '特立尼达和多巴哥',
                    sentryKey: 'R01010206'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '泽西',
                    sentryKey: 'R01010835'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '东南亚',
                sentryKey: 'R01010500',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '东帝汶',
                    sentryKey: 'R01010501'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '菲律宾',
                    sentryKey: 'R01010507'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '柬埔寨',
                    sentryKey: 'R01010503'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马来西亚',
                    sentryKey: 'R01010505'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '缅甸',
                    sentryKey: 'R01010502'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '泰国',
                    sentryKey: 'R01010508'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '新加坡',
                    sentryKey: 'R01010506'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '印度尼西亚',
                    sentryKey: 'R01010504'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '越南',
                    sentryKey: 'R01010509'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '亚洲其它',
                sentryKey: 'R01010600',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '阿富汗',
                    sentryKey: 'R01010611'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '阿曼',
                    sentryKey: 'R01010601'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '阿塞拜疆',
                    sentryKey: 'R01010613'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴基斯坦',
                    sentryKey: 'R01010631'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴勒斯坦',
                    sentryKey: 'R01010603'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴林',
                    sentryKey: 'R01010602'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '不丹',
                    sentryKey: 'R01010615'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '朝鲜',
                    sentryKey: 'R01010626'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '格鲁吉亚',
                    sentryKey: 'R01010618'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '哈萨克斯坦',
                    sentryKey: 'R01010621'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '韩国',
                    sentryKey: 'R01010633'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '吉尔吉斯斯坦',
                    sentryKey: 'R01010622'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '老挝',
                    sentryKey: 'R01010623'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '黎巴嫩',
                    sentryKey: 'R01010604'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马尔代夫',
                    sentryKey: 'R01010624'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '蒙古',
                    sentryKey: 'R01010625'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '孟加拉国',
                    sentryKey: 'R01010614'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '尼泊尔',
                    sentryKey: 'R01010632'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '日本',
                    sentryKey: 'R01010634'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '塞浦路斯',
                    sentryKey: 'R01010617'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣诞岛',
                    sentryKey: 'R01010635'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '斯里兰卡',
                    sentryKey: 'R01010627'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '塔吉克斯坦',
                    sentryKey: 'R01010628'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '突尼斯',
                    sentryKey: 'R01010605'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '土库曼斯坦',
                    sentryKey: 'R01010629'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '文莱',
                    sentryKey: 'R01010616'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '乌兹别克斯坦',
                    sentryKey: 'R01010630'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '叙利亚',
                    sentryKey: 'R01010606'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '亚美尼亚',
                    sentryKey: 'R01010612'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '也门',
                    sentryKey: 'R01010607'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '伊拉克',
                    sentryKey: 'R01010608'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '伊朗',
                    sentryKey: 'R01010619'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '以色列',
                    sentryKey: 'R01010620'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '印度',
                    sentryKey: 'R01010610'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '约旦',
                    sentryKey: 'R01010609'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '东欧',
                sentryKey: 'R01010700',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '阿尔巴尼亚',
                    sentryKey: 'R01010710'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '爱沙尼亚',
                    sentryKey: 'R01010705'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '安道尔',
                    sentryKey: 'R01010711'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '白俄罗斯',
                    sentryKey: 'R01010704'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '保加利亚',
                    sentryKey: 'R01010713'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '波兰',
                    sentryKey: 'R01010701'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '波黑',
                    sentryKey: 'R01010712'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '俄罗斯',
                    sentryKey: 'R01010702'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '黑山',
                    sentryKey: 'R01010715'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '拉脱维亚',
                    sentryKey: 'R01010706'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '立陶宛',
                    sentryKey: 'R01010707'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '罗马尼亚',
                    sentryKey: 'R01010716'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '摩尔多瓦',
                    sentryKey: 'R01010708'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '塞尔维亚',
                    sentryKey: 'R01010717'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '土耳其',
                    sentryKey: 'R01010703'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '乌克兰',
                    sentryKey: 'R01010709'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '希腊',
                    sentryKey: 'R01010714'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '科索沃',
                    sentryKey: 'R01010718'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '西欧',
                sentryKey: 'R01010800',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '西班牙',
                    sentryKey: 'R01010834'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '爱尔兰',
                    sentryKey: 'R01010809'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '奥地利',
                    sentryKey: 'R01010819'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '北马其顿',
                    sentryKey: 'R01010815'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '比利时',
                    sentryKey: 'R01010807'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '冰岛',
                    sentryKey: 'R01010825'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '丹麦',
                    sentryKey: 'R01010827'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '德国',
                    sentryKey: 'R01010804'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '法国',
                    sentryKey: 'R01010803'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '法罗群岛',
                    sentryKey: 'R01010824'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '法属圣马丁',
                    sentryKey: 'R01010801'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '梵蒂冈',
                    sentryKey: 'R01010833'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '芬兰',
                    sentryKey: 'R01010828'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '根西',
                    sentryKey: 'R01010832'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '荷兰',
                    sentryKey: 'R01010812'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '捷克',
                    sentryKey: 'R01010820'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '克罗地亚',
                    sentryKey: 'R01010814'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '列支敦士登',
                    sentryKey: 'R01010822'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '卢森堡',
                    sentryKey: 'R01010810'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马恩岛',
                    sentryKey: 'R01010831'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马耳他',
                    sentryKey: 'R01010816'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '摩纳哥',
                    sentryKey: 'R01010811'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '挪威',
                    sentryKey: 'R01010826'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '葡萄牙',
                    sentryKey: 'R01010806'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '瑞典',
                    sentryKey: 'R01010830'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '瑞士',
                    sentryKey: 'R01010813'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣马力诺',
                    sentryKey: 'R01010817'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '斯洛伐克',
                    sentryKey: 'R01010823'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '斯洛文尼亚',
                    sentryKey: 'R01010818'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '斯瓦尔巴和扬马延',
                    sentryKey: 'R01010829'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '匈牙利',
                    sentryKey: 'R01010821'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '意大利',
                    sentryKey: 'R01010802'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '英国',
                    sentryKey: 'R01010805'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '直布罗陀',
                    sentryKey: 'R01010808'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '南美洲',
                sentryKey: 'R01011000',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '阿根廷',
                    sentryKey: 'R01011003'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '阿鲁巴',
                    sentryKey: 'R01011004'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '安圭拉',
                    sentryKey: 'R01011001'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '安提瓜和巴布达',
                    sentryKey: 'R01011002'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴巴多斯',
                    sentryKey: 'R01011006'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴哈马',
                    sentryKey: 'R01011005'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴拉圭',
                    sentryKey: 'R01011035'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴拿马',
                    sentryKey: 'R01011034'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴西',
                    sentryKey: 'R01011010'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '百慕大',
                    sentryKey: 'R01011008'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '波多黎各',
                    sentryKey: 'R01011037'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '玻利维亚',
                    sentryKey: 'R01011009'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '伯利兹',
                    sentryKey: 'R01011007'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '赤道几内亚',
                    sentryKey: 'R01011022'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '多米尼加',
                    sentryKey: 'R01011019'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '多米尼克',
                    sentryKey: 'R01011018'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '厄瓜多尔',
                    sentryKey: 'R01011020'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '福克兰群岛（马尔维纳斯）',
                    sentryKey: 'R01011023'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '哥伦比亚',
                    sentryKey: 'R01011014'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '哥斯达黎加',
                    sentryKey: 'R01011015'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '格林纳达',
                    sentryKey: 'R01011025'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '格陵兰',
                    sentryKey: 'R01011024'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '古巴',
                    sentryKey: 'R01011016'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圭亚那',
                    sentryKey: 'R01011027'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '海地',
                    sentryKey: 'R01011028'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '洪都拉斯',
                    sentryKey: 'R01011029'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '开曼群岛',
                    sentryKey: 'R01011012'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '库拉索',
                    sentryKey: 'R01011017'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '蒙特塞拉特',
                    sentryKey: 'R01011032'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '秘鲁',
                    sentryKey: 'R01011036'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '墨西哥',
                    sentryKey: 'R01011031'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '尼加拉瓜',
                    sentryKey: 'R01011033'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '萨尔瓦多',
                    sentryKey: 'R01011021'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣巴泰勒米',
                    sentryKey: 'R01011038'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣基茨和尼维斯',
                    sentryKey: 'R01011039'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣卢西亚',
                    sentryKey: 'R01011040'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣文森特和格林纳丁斯',
                    sentryKey: 'R01011041'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '苏里南',
                    sentryKey: 'R01011043'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '危地马拉',
                    sentryKey: 'R01011026'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '委内瑞拉',
                    sentryKey: 'R01011045'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '乌拉圭',
                    sentryKey: 'R01011044'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '牙买加',
                    sentryKey: 'R01011030'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '英属维尔京群岛',
                    sentryKey: 'R01011011'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '智利',
                    sentryKey: 'R01011013'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '阿语地区ARAB',
                sentryKey: 'R01010900',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '阿联酋',
                    sentryKey: 'R01010902'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '埃及',
                    sentryKey: 'R01010905'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '卡塔尔',
                    sentryKey: 'R01010901'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '科威特',
                    sentryKey: 'R01010904'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '摩洛哥',
                    sentryKey: 'R01010906'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '沙特阿拉伯',
                    sentryKey: 'R01010903'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '大洋洲',
                sentryKey: 'R01010100',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '澳大利亚',
                    sentryKey: 'R01010102'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '巴布亚新几内亚',
                    sentryKey: 'R01010117'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '北马里亚纳群岛',
                    sentryKey: 'R01010115'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '法属波利尼西亚',
                    sentryKey: 'R01010106'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '斐济',
                    sentryKey: 'R01010105'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '关岛',
                    sentryKey: 'R01010107'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '基里巴斯',
                    sentryKey: 'R01010108'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '科科斯（基林）群岛',
                    sentryKey: 'R01010103'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '库克群岛',
                    sentryKey: 'R01010104'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马绍尔群岛',
                    sentryKey: 'R01010109'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '美属萨摩亚',
                    sentryKey: 'R01010101'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '密克罗尼西亚联邦',
                    sentryKey: 'R01010110'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '瑙鲁',
                    sentryKey: 'R01010111'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '纽埃',
                    sentryKey: 'R01010114'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '帕劳',
                    sentryKey: 'R01010116'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '皮特凯恩',
                    sentryKey: 'R01010118'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '萨摩亚',
                    sentryKey: 'R01010119'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '所罗门群岛',
                    sentryKey: 'R01010120'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '汤加',
                    sentryKey: 'R01010122'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '图瓦卢',
                    sentryKey: 'R01010123'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '托克劳',
                    sentryKey: 'R01010121'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '瓦利斯和富图纳',
                    sentryKey: 'R01010125'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '瓦努阿图',
                    sentryKey: 'R01010124'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '新喀里多尼亚',
                    sentryKey: 'R01010112'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '新西兰',
                    sentryKey: 'R01010113'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '非洲',
                sentryKey: 'R01010300',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '阿尔及利亚',
                    sentryKey: 'R01010301'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '埃塞俄比亚',
                    sentryKey: 'R01010321'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '安哥拉',
                    sentryKey: 'R01010312'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '贝宁',
                    sentryKey: 'R01010352'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '博茨瓦纳',
                    sentryKey: 'R01010313'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '布基纳法索',
                    sentryKey: 'R01010317'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '布隆迪',
                    sentryKey: 'R01010318'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '多哥',
                    sentryKey: 'R01010345'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '厄立特里亚',
                    sentryKey: 'R01010309'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '佛得角',
                    sentryKey: 'R01010320'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '冈比亚',
                    sentryKey: 'R01010324'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '刚果（布）',
                    sentryKey: 'R01010338'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '刚果（金）',
                    sentryKey: 'R01010314'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '吉布提',
                    sentryKey: 'R01010307'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '几内亚',
                    sentryKey: 'R01010326'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '几内亚比绍',
                    sentryKey: 'R01010327'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '加纳',
                    sentryKey: 'R01010325'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '加蓬',
                    sentryKey: 'R01010323'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '津巴布韦',
                    sentryKey: 'R01010350'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '喀麦隆',
                    sentryKey: 'R01010319'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '科摩罗',
                    sentryKey: 'R01010310'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '科特迪瓦',
                    sentryKey: 'R01010328'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '肯尼亚',
                    sentryKey: 'R01010329'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '莱索托',
                    sentryKey: 'R01010330'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '利比里亚',
                    sentryKey: 'R01010331'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '利比亚',
                    sentryKey: 'R01010302'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '留尼汪',
                    sentryKey: 'R01010339'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '卢旺达',
                    sentryKey: 'R01010340'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马达加斯加',
                    sentryKey: 'R01010332'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马拉维',
                    sentryKey: 'R01010333'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马里',
                    sentryKey: 'R01010334'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马约特',
                    sentryKey: 'R01010336'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '毛里求斯',
                    sentryKey: 'R01010335'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '毛里塔尼亚',
                    sentryKey: 'R01010303'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '莫桑比克',
                    sentryKey: 'R01010337'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '纳米比亚',
                    sentryKey: 'R01010351'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '南非',
                    sentryKey: 'R01010308'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '南苏丹',
                    sentryKey: 'R01010306'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '尼日尔',
                    sentryKey: 'R01010315'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '尼日利亚',
                    sentryKey: 'R01010316'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '塞拉利昂',
                    sentryKey: 'R01010347'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '塞内加尔',
                    sentryKey: 'R01010342'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '塞舌尔',
                    sentryKey: 'R01010346'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣多美和普林西比',
                    sentryKey: 'R01010341'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣赫勒拿、阿森松和特里斯坦-达库尼亚',
                    sentryKey: 'R01010354'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '斯威士兰',
                    sentryKey: 'R01010343'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '苏丹',
                    sentryKey: 'R01010304'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '索马里',
                    sentryKey: 'R01010305'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '坦桑尼亚',
                    sentryKey: 'R01010344'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '乌干达',
                    sentryKey: 'R01010348'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '西撒哈拉',
                    sentryKey: 'R01010355'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '英属印度洋领地',
                    sentryKey: 'R01010353'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '赞比亚',
                    sentryKey: 'R01010349'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '乍得',
                    sentryKey: 'R01010311'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '中非',
                    sentryKey: 'R01010322'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '港澳台',
                sentryKey: 'R01010400',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '中国澳门',
                    sentryKey: 'R01010402'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '中国台湾',
                    sentryKey: 'R01010401'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '中国香港',
                    sentryKey: 'R01010403'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '南极洲AQ',
                sentryKey: 'R010111',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '南极洲',
                    sentryKey: 'R01011101'
                  }
                ]
              },
              {
                dimensionKey: 'region_row_level_3',
                value: '其他汇总',
                sentryKey: 'R010112',
                children: [
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '奥兰群岛',
                    sentryKey: 'R01011202'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '荷兰加勒比区',
                    sentryKey: 'R01011203'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '圣皮埃尔和密克隆',
                    sentryKey: 'R01011201'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '布韦岛',
                    sentryKey: 'R01011204'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '法属圭亚那',
                    sentryKey: 'R01011205'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '法属南部领地',
                    sentryKey: 'R01011206'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '瓜德罗普',
                    sentryKey: 'R01011207'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '赫德岛和麦克唐纳群岛',
                    sentryKey: 'R01011208'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '马提尼克',
                    sentryKey: 'R01011209'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '美国本土外小岛屿',
                    sentryKey: 'R01011212'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '其他',
                    sentryKey: 'R01011299'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '南乔治亚和南桑威奇群岛',
                    sentryKey: 'R01011211'
                  },
                  {
                    dimensionKey: 'region_row_level_4',
                    value: '诺福克岛',
                    sentryKey: 'R01011210'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: 'region_row_level_2',
            value: '全球公共',
            sentryKey: 'R30',
            hierarchyState: 'expand'
          }
        ]
      }
    ],
    columnTree: [
      {
        dimensionKey: 'date',
        value: '2023年 1月',
        sentryKey: '2023_month1',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 2月',
        sentryKey: '2023_month2',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 3月',
        sentryKey: '2023_month3',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 4月',
        sentryKey: '2023_month4',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 5月',
        sentryKey: '2023_month5',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 6月',
        sentryKey: '2023_month6',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 7月',
        sentryKey: '2023_month7',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 8月',
        sentryKey: '2023_month8',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 9月',
        sentryKey: '2023_month9',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 10月',
        sentryKey: '2023_month10',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 11月',
        sentryKey: '2023_month11',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      },
      {
        dimensionKey: 'date',
        value: '2023年 12月',
        sentryKey: '2023_month12',
        hierarchyState: 'expand',
        children: [
          {
            value: '实际预估',
            indicatorKey: 'fin'
          }
        ]
      }
    ],
    rows: [
      {
        dimensionKey: 'region_row_level_1',
        title: '区域',
        width: 'auto',
        headerStyle: {
          bgColor: '#FFF',
          color: '#1F2329',
          fontSize: 12,
          fontFamily: 'PingFang SC',
          fontWeight: '500',
          fontStyle: 'normal',
          borderColor: '#DEE0E3',
          borderLineWidth: 1,
          lineHeight: 20
        }
      },
      {
        dimensionKey: 'region_row_level_2',
        title: '区域',
        width: 'auto',
        headerStyle: {
          bgColor: '#FFF',
          color: '#1F2329',
          fontSize: 12,
          fontFamily: 'PingFang SC',
          fontWeight: '500',
          fontStyle: 'normal',
          borderColor: '#DEE0E3',
          borderLineWidth: 1,
          lineHeight: 20
        }
      },
      {
        dimensionKey: 'region_row_level_3',
        title: '区域',
        width: 'auto',
        headerStyle: {
          bgColor: '#FFF',
          color: '#1F2329',
          fontSize: 12,
          fontFamily: 'PingFang SC',
          fontWeight: '500',
          fontStyle: 'normal',
          borderColor: '#DEE0E3',
          borderLineWidth: 1,
          lineHeight: 20
        }
      },
      {
        dimensionKey: 'region_row_level_4',
        title: '区域',
        width: 'auto',
        headerStyle: {
          bgColor: '#FFF',
          color: '#1F2329',
          fontSize: 12,
          fontFamily: 'PingFang SC',
          fontWeight: '500',
          fontStyle: 'normal',
          borderColor: '#DEE0E3',
          borderLineWidth: 1,
          lineHeight: 20
        }
      }
    ],
    columns: [
      {
        dimensionKey: 'date',
        title: 'date',
        headerStyle: {
          textStick: true,
          bgColor: '#F2F3F5',
          textAlign: 'center',
          color: '#646A73',
          fontSize: 12,
          fontFamily: 'PingFang SC',
          fontWeight: '500',
          fontStyle: 'normal',
          borderColor: '#DEE0E3',
          borderLineWidth: 1,
          lineHeight: 30
        }
      }
    ],
    indicators: [
      {
        indicatorKey: 'fin',
        title: 'fin',
        width: 'auto',
        showSort: false,
        minWidth: 150,
        headerStyle: {
          textStick: true,
          textAlign: 'right',
          bgColor: '#F2F3F5',
          color: '#646A73',
          fontSize: 12,
          fontFamily: 'PingFang SC',
          fontWeight: '500',
          fontStyle: 'normal',
          borderColor: '#DEE0E3',
          borderLineWidth: 1,
          lineHeight: 20
        },
        style: {
          bgColor: '#FFF',
          textAlign: 'right',
          fontSize: 12,
          color: '#1F2329',
          fontWeight: 400,
          fontStyle: 'normal',
          fontFamily: 'SF Pro Text'
        }
      }
    ],
    extensionRows: [
      {
        rows: [
          {
            dimensionKey: 'biSubject_row_level_2',
            title: '管报科目',
            width: 'auto',
            headerStyle: {
              bgColor: '#FFF',
              color: '#1F2329',
              fontSize: 12,
              fontFamily: 'PingFang SC',
              fontWeight: '500',
              fontStyle: 'normal',
              borderColor: '#DEE0E3',
              borderLineWidth: 1,
              lineHeight: 20
            }
          },
          {
            dimensionKey: 'biSubject_row_level_3',
            title: '管报科目',
            width: 'auto',
            headerStyle: {
              bgColor: '#FFF',
              color: '#1F2329',
              fontSize: 12,
              fontFamily: 'PingFang SC',
              fontWeight: '500',
              fontStyle: 'normal',
              borderColor: '#DEE0E3',
              borderLineWidth: 1,
              lineHeight: 20
            }
          }
        ],
        rowTree: [
          {
            dimensionKey: 'biSubject_row_level_2',
            value: '收入',
            sentryKey: 'A101',
            hierarchyState: 'expand',
            children: [
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '广告收入',
                sentryKey: 'A1010101'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '直播收入',
                sentryKey: 'A1010102'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '电商收入',
                sentryKey: 'A1010103'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '游戏收入',
                sentryKey: 'A1010105'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '其他收入',
                sentryKey: 'A1010106'
              }
            ]
          },
          {
            dimensionKey: 'biSubject_row_level_2',
            value: '成本费用',
            sentryKey: 'A102',
            hierarchyState: 'expand',
            children: [
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '市场费',
                sentryKey: 'A1020102'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '用户获取成本',
                sentryKey: 'A1020101'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '内容获取成本',
                sentryKey: 'A10202'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '直播成本',
                sentryKey: 'A10203'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '数据中心成本',
                sentryKey: 'A10204'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '人力成本',
                sentryKey: 'A10205'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '期权成本',
                sentryKey: 'A131729'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '流量获取成本',
                sentryKey: 'A10207'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '第三方服务费',
                sentryKey: 'A10208'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '人头相关费用',
                sentryKey: 'A10209'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '商业化变现成本',
                sentryKey: 'A10210'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '内容质量安全服务成本',
                sentryKey: 'A1335'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '平台渠道费',
                sentryKey: 'A10211'
              },
              {
                dimensionKey: 'biSubject_row_level_3',
                value: '其他成本费用',
                sentryKey: 'A10213'
              }
            ]
          },
          {
            dimensionKey: 'biSubject_row_level_2',
            value: '经营利润',
            sentryKey: 'A14',
            hierarchyState: 'expand'
          },
          {
            dimensionKey: 'biSubject_row_level_2',
            value: '经营利润率',
            sentryKey: 'A15',
            hierarchyState: 'expand'
          }
        ]
      }
    ],
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textStick: true,
        bgColor: '#F2F3F5',
        textAlign: 'center',
        color: '#646A73',
        fontSize: 12,
        fontFamily: 'PingFang SC',
        fontWeight: '500',
        fontStyle: 'normal',
        borderColor: '#DEE0E3',
        borderLineWidth: 1,
        lineHeight: 30
      }
    },
    hideIndicatorName: false
  };

  const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
  window.tableInstance = instance;

  bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
