/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option: VTable.PivotChartConstructorOptions = {
    indicatorsAsCol: false,

    defaultRowHeight: 200,
    defaultHeaderRowHeight: 50,
    defaultColWidth: 280,
    defaultHeaderColWidth: 100,

    theme: {
      bodyStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 0, 0, 1]
      },
      headerStyle: {
        borderColor: 'gray',
        borderLineWidth: [0, 0, 1, 1],
        hover: {
          cellBgColor: '#CCE0FF'
        }
      },
      rowHeaderStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 1, 0, 0],
        hover: {
          cellBgColor: '#CCE0FF'
        }
      },
      cornerHeaderStyle: {
        borderColor: 'gray',
        borderLineWidth: [0, 1, 1, 0],
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightTopCellStyle: {
        borderColor: 'gray',
        borderLineWidth: [0, 0, 1, 1],
        hover: {
          cellBgColor: ''
        }
      },
      cornerLeftBottomCellStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 1, 0, 0],
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightBottomCellStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 0, 0, 1],
        hover: {
          cellBgColor: ''
        }
      },
      rightFrozenStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 0, 1, 1],
        hover: {
          cellBgColor: ''
        }
      },
      bottomFrozenStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 1, 0, 1],
        hover: {
          cellBgColor: ''
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
    frozenColCount: 3
  };

  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID)!, option);
  tableInstance.updateOption({
    indicatorsAsCol: false,
    records: [
      {
        category: '用品',
        city: '阿里地区',
        sales: 5,
        province: '西藏自治区'
      },
      {
        category: '信封',
        city: '郑州市',
        sales: 26,
        province: '河南省'
      },
      {
        category: '装订机',
        city: '张家口市',
        sales: 27,
        province: '河北省'
      },
      {
        category: '用品',
        city: '邵阳市',
        sales: 17,
        province: '湖南省'
      },
      {
        category: '器具',
        city: '深圳市',
        sales: 8,
        province: '广东省'
      },
      {
        category: '设备',
        city: '崇左市',
        sales: 17,
        province: '广西壮族自治区'
      },
      {
        category: '装订机',
        city: '辽阳市',
        sales: 9,
        province: '辽宁省'
      },
      {
        category: '椅子',
        city: '广州市',
        sales: 23,
        province: '广东省'
      },
      {
        category: '纸张',
        city: '宜宾市',
        sales: 5,
        province: '四川省'
      },
      {
        category: '系固件',
        city: '滨州市',
        sales: 5,
        province: '山东省'
      },
      {
        category: '设备',
        city: '咸阳市',
        sales: 5,
        province: '陕西省'
      },
      {
        category: '复印机',
        city: '甘南藏族自治州',
        sales: 7,
        province: '甘肃省'
      },
      {
        category: '信封',
        city: '呼和浩特市',
        sales: 11,
        province: '内蒙古自治区'
      },
      {
        category: '配件',
        city: '石家庄市',
        sales: 24,
        province: '河北省'
      },
      {
        category: '电话',
        city: '吉林市',
        sales: 17,
        province: '吉林省'
      },
      {
        category: '器具',
        city: '西安市',
        sales: 33,
        province: '陕西省'
      },
      {
        category: '标签',
        city: '安庆市',
        sales: 25,
        province: '安徽省'
      },
      {
        category: '配件',
        city: '成都市',
        sales: 20,
        province: '四川省'
      },
      {
        category: '用品',
        city: '九江市',
        sales: 30,
        province: '江西省'
      },
      {
        category: '装订机',
        city: '衢州市',
        sales: 17,
        province: '浙江省'
      },
      {
        category: '装订机',
        city: '濮阳市',
        sales: 17,
        province: '河南省'
      },
      {
        category: '电话',
        city: '石家庄市',
        sales: 61,
        province: '河北省'
      },
      {
        category: '复印机',
        city: '双鸭山市',
        sales: 6,
        province: '黑龙江省'
      },
      {
        category: '用品',
        city: '三亚市',
        sales: 5,
        province: '海南省'
      },
      {
        category: '书架',
        city: '新乡市',
        sales: 4,
        province: '河南省'
      },
      {
        category: '椅子',
        city: '淄博市',
        sales: 20,
        province: '山东省'
      },
      {
        category: '系固件',
        city: '海西蒙古族藏族自治州☆',
        sales: 5,
        province: '青海省'
      },
      {
        category: '系固件',
        city: '曲靖市',
        sales: 16,
        province: '云南省'
      },
      {
        category: '用品',
        city: '大理白族自治州',
        sales: 13,
        province: '云南省'
      },
      {
        category: '配件',
        city: '淄博市',
        sales: 6,
        province: '山东省'
      },
      {
        category: '用具',
        city: '湛江市',
        sales: 10,
        province: '广东省'
      },
      {
        category: '装订机',
        city: '天水市',
        sales: 12,
        province: '甘肃省'
      },
      {
        category: '收纳具',
        city: '达州市',
        sales: 5,
        province: '四川省'
      },
      {
        category: '椅子',
        city: '长春市',
        sales: 20,
        province: '吉林省'
      },
      {
        category: '书架',
        city: '邢台市',
        sales: 28,
        province: '河北省'
      },
      {
        category: '用具',
        city: '忻州市',
        sales: 14,
        province: '山西省'
      },
      {
        category: '美术',
        city: '甘孜藏族自治州',
        sales: 6,
        province: '四川省'
      },
      {
        category: '纸张',
        city: '运城市',
        sales: 14,
        province: '山西省'
      },
      {
        category: '收纳具',
        city: '邯郸市',
        sales: 28,
        province: '河北省'
      },
      {
        category: '桌子',
        city: '巴彦淖尔市',
        sales: 1,
        province: '内蒙古自治区'
      },
      {
        category: '纸张',
        city: '定西市',
        sales: 14,
        province: '甘肃省'
      },
      {
        category: '器具',
        city: '金昌市',
        sales: 6,
        province: '甘肃省'
      },
      {
        category: '器具',
        city: '佳木斯市',
        sales: 22,
        province: '黑龙江省'
      },
      {
        category: '收纳具',
        city: '绥化市',
        sales: 11,
        province: '黑龙江省'
      },
      {
        category: '美术',
        city: '山南市',
        sales: 24,
        province: '西藏自治区'
      },
      {
        category: '装订机',
        city: '邯郸市',
        sales: 31,
        province: '河北省'
      },
      {
        category: '美术',
        city: '齐齐哈尔市',
        sales: 20,
        province: '黑龙江省'
      },
      {
        category: '电话',
        city: '西宁市',
        sales: 9,
        province: '青海省'
      },
      {
        category: '信封',
        city: '上饶市',
        sales: 16,
        province: '江西省'
      },
      {
        category: '电话',
        city: '红河哈尼族彝族自治州',
        sales: 7,
        province: '云南省'
      },
      {
        category: '复印机',
        city: '内江市',
        sales: 2,
        province: '四川省'
      },
      {
        category: '收纳具',
        city: '淄博市',
        sales: 5,
        province: '山东省'
      },
      {
        category: '器具',
        city: '安阳市',
        sales: 10,
        province: '河南省'
      },
      {
        category: '器具',
        city: '文山壮族苗族自治州',
        sales: 25,
        province: '云南省'
      },
      {
        category: '收纳具',
        city: '哈密市',
        sales: 1,
        province: '新疆维吾尔自治区'
      },
      {
        category: '用品',
        city: '张家界市',
        sales: 12,
        province: '湖南省'
      },
      {
        category: '系固件',
        city: '邢台市',
        sales: 15,
        province: '河北省'
      },
      {
        category: '系固件',
        city: '德阳市',
        sales: 8,
        province: '四川省'
      },
      {
        category: '书架',
        city: '临汾市',
        sales: 20,
        province: '山西省'
      },
      {
        category: '收纳具',
        city: '呼伦贝尔市',
        sales: 9,
        province: '内蒙古自治区'
      },
      {
        category: '复印机',
        city: '黑河市',
        sales: 2,
        province: '黑龙江省'
      },
      {
        category: '设备',
        city: '滁州市',
        sales: 7,
        province: '安徽省'
      },
      {
        category: '标签',
        city: '延安市',
        sales: 16,
        province: '陕西省'
      },
      {
        category: '系固件',
        city: '南平市',
        sales: 5,
        province: '福建省'
      },
      {
        category: '设备',
        city: '鹰潭市',
        sales: 4,
        province: '江西省'
      },
      {
        category: '器具',
        city: '晋城市',
        sales: 15,
        province: '山西省'
      },
      {
        category: '美术',
        city: '吉安市',
        sales: 14,
        province: '江西省'
      },
      {
        category: '纸张',
        city: '绍兴市',
        sales: 6,
        province: '浙江省'
      },
      {
        category: '配件',
        city: '日照市',
        sales: 8,
        province: '山东省'
      },
      {
        category: '标签',
        city: '洛阳市',
        sales: 25,
        province: '河南省'
      },
      {
        category: '信封',
        city: '克拉玛依市',
        sales: 14,
        province: '新疆维吾尔自治区'
      },
      {
        category: '书架',
        city: '吕梁市',
        sales: 1,
        province: '山西省'
      },
      {
        category: '电话',
        city: '白城市',
        sales: 6,
        province: '吉林省'
      },
      {
        category: '信封',
        city: '丽江市',
        sales: 4,
        province: '云南省'
      },
      {
        category: '电话',
        city: '河池市',
        sales: 11,
        province: '广西壮族自治区'
      },
      {
        category: '用品',
        city: '绍兴市',
        sales: 9,
        province: '浙江省'
      },
      {
        category: '系固件',
        city: '长治市',
        sales: 15,
        province: '山西省'
      },
      {
        category: '标签',
        city: '包头市',
        sales: 13,
        province: '内蒙古自治区'
      },
      {
        category: '标签',
        city: '太原市',
        sales: 10,
        province: '山西省'
      },
      {
        category: '标签',
        city: '惠州市',
        sales: 14,
        province: '广东省'
      },
      {
        category: '用品',
        city: '玉溪市',
        sales: 2,
        province: '云南省'
      },
      {
        category: '复印机',
        city: '四平市',
        sales: 4,
        province: '吉林省'
      },
      {
        category: '复印机',
        city: '营口市',
        sales: 2,
        province: '辽宁省'
      },
      {
        category: '标签',
        city: '黔西南布依族苗族自治州',
        sales: 6,
        province: '贵州省'
      },
      {
        category: '信封',
        city: '包头市',
        sales: 17,
        province: '内蒙古自治区'
      },
      {
        category: '用具',
        city: '乌兰察布市',
        sales: 9,
        province: '内蒙古自治区'
      },
      {
        category: '标签',
        city: '广州市',
        sales: 11,
        province: '广东省'
      },
      {
        category: '用具',
        city: '廊坊市',
        sales: 21,
        province: '河北省'
      },
      {
        category: '电话',
        city: '盐城市',
        sales: 6,
        province: '江苏省'
      },
      {
        category: '装订机',
        city: '南京市',
        sales: 13,
        province: '江苏省'
      },
      {
        category: '收纳具',
        city: '临沧市',
        sales: 13,
        province: '云南省'
      },
      {
        category: '收纳具',
        city: '咸宁市',
        sales: 9,
        province: '湖北省'
      },
      {
        category: '收纳具',
        city: '楚雄彝族自治州',
        sales: 17,
        province: '云南省'
      },
      {
        category: '用品',
        city: '吕梁市',
        sales: 21,
        province: '山西省'
      },
      {
        category: '椅子',
        city: '白银市',
        sales: 5,
        province: '甘肃省'
      },
      {
        category: '系固件',
        city: '武汉市',
        sales: 20,
        province: '湖北省'
      },
      {
        category: '信封',
        city: '安顺市',
        sales: 3,
        province: '贵州省'
      },
      {
        category: '美术',
        city: '菏泽市',
        sales: 15,
        province: '山东省'
      },
      {
        category: '设备',
        city: '渭南市',
        sales: 10,
        province: '陕西省'
      },
      {
        category: '用品',
        city: '南京市',
        sales: 8,
        province: '江苏省'
      }
    ],
    columns: [
      {
        dimensionKey: 'category',
        title: '子类别'
      }
    ],
    rows: [
      // {
      //   indicatorKey: "sales",
      //   title: "数量"
      // }
    ],
    indicators: [
      {
        indicatorKey: 'sales',
        title: '数量',
        width: 'auto',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'bar',
          data: {
            id: 'sales'
          },
          xField: ['category'],
          yField: 'sales'
        },
        style: {
          padding: 1
        }
      }
    ],
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 50,
    defaultColWidth: 280,
    defaultHeaderColWidth: 100,

    theme: {
      bodyStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 0, 0, 1]
      },
      headerStyle: {
        borderColor: 'gray',
        borderLineWidth: [0, 0, 1, 1],
        hover: {
          cellBgColor: '#CCE0FF'
        }
      },
      rowHeaderStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 1, 0, 0],
        hover: {
          cellBgColor: '#CCE0FF'
        }
      },
      cornerHeaderStyle: {
        borderColor: 'gray',
        borderLineWidth: [0, 1, 1, 0],
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightTopCellStyle: {
        borderColor: 'gray',
        borderLineWidth: [0, 0, 1, 1],
        hover: {
          cellBgColor: ''
        }
      },
      cornerLeftBottomCellStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 1, 0, 0],
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightBottomCellStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 0, 0, 1],
        hover: {
          cellBgColor: ''
        }
      },
      rightFrozenStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 0, 1, 1],
        hover: {
          cellBgColor: ''
        }
      },
      bottomFrozenStyle: {
        borderColor: 'gray',
        borderLineWidth: [1, 1, 0, 1],
        hover: {
          cellBgColor: ''
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
    frozenColCount: 3
  });
  tableInstance.onVChartEvent('click', args => {
    console.log('onVChartEvent click', args);
  });
  tableInstance.onVChartEvent('mouseover', args => {
    console.log('onVChartEvent mouseover', args);
  });
  window.tableInstance = tableInstance;
}
