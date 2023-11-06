/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option = {
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    // widthMode: 'autoWidth',
    // heightMode: 'autoHeight',
    columnTree: [
      {
        dimensionKey: '231102144451025',
        value: '七台河1'
      },
      {
        dimensionKey: '231102144451025',
        value: '万县1'
      },
      {
        dimensionKey: '231102144451025',
        value: '三亚1'
      },
      {
        dimensionKey: '231102144451025',
        value: '三岔子'
      },
      {
        dimensionKey: '231102144451025',
        value: '三明'
      },
      {
        dimensionKey: '231102144451025',
        value: '上梅'
      },
      {
        dimensionKey: '231102144451025',
        value: '上海'
      },
      {
        dimensionKey: '231102144451025',
        value: '上虞'
      },
      {
        dimensionKey: '231102144451025',
        value: '东丰'
      },
      {
        dimensionKey: '231102144451025',
        value: '东台'
      },
      {
        dimensionKey: '231102144451025',
        value: '东宁'
      },
      {
        dimensionKey: '231102144451025',
        value: '东村'
      },
      {
        dimensionKey: '231102144451025',
        value: '东海'
      },
      {
        dimensionKey: '231102144451025',
        value: '东胜'
      },
      {
        dimensionKey: '231102144451025',
        value: '东莞'
      },
      {
        dimensionKey: '231102144451025',
        value: '东营'
      },
      {
        dimensionKey: '231102144451025',
        value: '中枢'
      },
      {
        dimensionKey: '231102144451025',
        value: '丰县'
      },
      {
        dimensionKey: '231102144451025',
        value: '丰润'
      },
      {
        dimensionKey: '231102144451025',
        value: '丰镇'
      },
      {
        dimensionKey: '231102144451025',
        value: '临朐'
      },
      {
        dimensionKey: '231102144451025',
        value: '临水'
      },
      {
        dimensionKey: '231102144451025',
        value: '临江'
      },
      {
        dimensionKey: '231102144451025',
        value: '临汾'
      },
      {
        dimensionKey: '231102144451025',
        value: '临沂'
      },
      {
        dimensionKey: '231102144451025',
        value: '临海'
      },
      {
        dimensionKey: '231102144451025',
        value: '临清'
      },
      {
        dimensionKey: '231102144451025',
        value: '丹东'
      },
      {
        dimensionKey: '231102144451025',
        value: '丹江口'
      },
      {
        dimensionKey: '231102144451025',
        value: '丽水'
      },
      {
        dimensionKey: '231102144451025',
        value: '义乌'
      },
      {
        dimensionKey: '231102144451025',
        value: '义马'
      },
      {
        dimensionKey: '231102144451025',
        value: '乌海'
      },
      {
        dimensionKey: '231102144451025',
        value: '乌达'
      },
      {
        dimensionKey: '231102144451025',
        value: '乐城'
      },
      {
        dimensionKey: '231102144451025',
        value: '乐山'
      },
      {
        dimensionKey: '231102144451025',
        value: '九台'
      },
      {
        dimensionKey: '231102144451025',
        value: '九江'
      },
      {
        dimensionKey: '231102144451025',
        value: '二道江'
      },
      {
        dimensionKey: '231102144451025',
        value: '云浮'
      },
      {
        dimensionKey: '231102144451025',
        value: '云阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '五常'
      },
      {
        dimensionKey: '231102144451025',
        value: '亳州'
      },
      {
        dimensionKey: '231102144451025',
        value: '仙居'
      },
      {
        dimensionKey: '231102144451025',
        value: '仙桃'
      },
      {
        dimensionKey: '231102144451025',
        value: '仪征'
      },
      {
        dimensionKey: '231102144451025',
        value: '任丘'
      },
      {
        dimensionKey: '231102144451025',
        value: '余下'
      },
      {
        dimensionKey: '231102144451025',
        value: '余姚'
      },
      {
        dimensionKey: '231102144451025',
        value: '佛山'
      },
      {
        dimensionKey: '231102144451025',
        value: '佳木斯'
      },
      {
        dimensionKey: '231102144451025',
        value: '依兰'
      },
      {
        dimensionKey: '231102144451025',
        value: '保定'
      },
      {
        dimensionKey: '231102144451025',
        value: '信宜'
      },
      {
        dimensionKey: '231102144451025',
        value: '信阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '兖州'
      },
      {
        dimensionKey: '231102144451025',
        value: '八步'
      },
      {
        dimensionKey: '231102144451025',
        value: '八面通'
      },
      {
        dimensionKey: '231102144451025',
        value: '公主岭'
      },
      {
        dimensionKey: '231102144451025',
        value: '六合'
      },
      {
        dimensionKey: '231102144451025',
        value: '兰州'
      },
      {
        dimensionKey: '231102144451025',
        value: '兰溪'
      },
      {
        dimensionKey: '231102144451025',
        value: '兰西'
      },
      {
        dimensionKey: '231102144451025',
        value: '兴化'
      },
      {
        dimensionKey: '231102144451025',
        value: '兴城'
      },
      {
        dimensionKey: '231102144451025',
        value: '内江'
      },
      {
        dimensionKey: '231102144451025',
        value: '冷水江'
      },
      {
        dimensionKey: '231102144451025',
        value: '冷水滩'
      },
      {
        dimensionKey: '231102144451025',
        value: '凌源'
      },
      {
        dimensionKey: '231102144451025',
        value: '凤城'
      },
      {
        dimensionKey: '231102144451025',
        value: '利川'
      },
      {
        dimensionKey: '231102144451025',
        value: '前郭'
      },
      {
        dimensionKey: '231102144451025',
        value: '剑光'
      },
      {
        dimensionKey: '231102144451025',
        value: '加格达奇'
      },
      {
        dimensionKey: '231102144451025',
        value: '包头'
      },
      {
        dimensionKey: '231102144451025',
        value: '化州'
      },
      {
        dimensionKey: '231102144451025',
        value: '北京'
      },
      {
        dimensionKey: '231102144451025',
        value: '北海'
      },
      {
        dimensionKey: '231102144451025',
        value: '北碚'
      },
      {
        dimensionKey: '231102144451025',
        value: '北票'
      },
      {
        dimensionKey: '231102144451025',
        value: '十字路'
      },
      {
        dimensionKey: '231102144451025',
        value: '南京'
      },
      {
        dimensionKey: '231102144451025',
        value: '南充'
      },
      {
        dimensionKey: '231102144451025',
        value: '南台'
      },
      {
        dimensionKey: '231102144451025',
        value: '南宁'
      },
      {
        dimensionKey: '231102144451025',
        value: '南宫'
      },
      {
        dimensionKey: '231102144451025',
        value: '南岔'
      },
      {
        dimensionKey: '231102144451025',
        value: '南平'
      },
      {
        dimensionKey: '231102144451025',
        value: '南昌'
      },
      {
        dimensionKey: '231102144451025',
        value: '南洲'
      },
      {
        dimensionKey: '231102144451025',
        value: '南渡'
      },
      {
        dimensionKey: '231102144451025',
        value: '南票'
      },
      {
        dimensionKey: '231102144451025',
        value: '南通'
      },
      {
        dimensionKey: '231102144451025',
        value: '南阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '南隆'
      },
      {
        dimensionKey: '231102144451025',
        value: '南麻'
      },
      {
        dimensionKey: '231102144451025',
        value: '即墨'
      },
      {
        dimensionKey: '231102144451025',
        value: '原平'
      },
      {
        dimensionKey: '231102144451025',
        value: '厦门'
      },
      {
        dimensionKey: '231102144451025',
        value: '友好'
      },
      {
        dimensionKey: '231102144451025',
        value: '双城'
      },
      {
        dimensionKey: '231102144451025',
        value: '双阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '双鸭山'
      },
      {
        dimensionKey: '231102144451025',
        value: '台城'
      },
      {
        dimensionKey: '231102144451025',
        value: '叶柏寿'
      },
      {
        dimensionKey: '231102144451025',
        value: '合川'
      },
      {
        dimensionKey: '231102144451025',
        value: '合德'
      },
      {
        dimensionKey: '231102144451025',
        value: '合肥'
      },
      {
        dimensionKey: '231102144451025',
        value: '吉林市'
      },
      {
        dimensionKey: '231102144451025',
        value: '吉舒'
      },
      {
        dimensionKey: '231102144451025',
        value: '吉首'
      },
      {
        dimensionKey: '231102144451025',
        value: '启东'
      },
      {
        dimensionKey: '231102144451025',
        value: '吴川'
      },
      {
        dimensionKey: '231102144451025',
        value: '周口'
      },
      {
        dimensionKey: '231102144451025',
        value: '周村'
      },
      {
        dimensionKey: '231102144451025',
        value: '呼兰'
      },
      {
        dimensionKey: '231102144451025',
        value: '呼和浩特'
      },
      {
        dimensionKey: '231102144451025',
        value: '和田'
      },
      {
        dimensionKey: '231102144451025',
        value: '和龙'
      },
      {
        dimensionKey: '231102144451025',
        value: '咸宁'
      },
      {
        dimensionKey: '231102144451025',
        value: '咸水沽'
      },
      {
        dimensionKey: '231102144451025',
        value: '咸阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '哈尔滨'
      },
      {
        dimensionKey: '231102144451025',
        value: '唐家庄'
      },
      {
        dimensionKey: '231102144451025',
        value: '唐寨'
      },
      {
        dimensionKey: '231102144451025',
        value: '唐山'
      },
      {
        dimensionKey: '231102144451025',
        value: '唐河'
      },
      {
        dimensionKey: '231102144451025',
        value: '商丘'
      },
      {
        dimensionKey: '231102144451025',
        value: '嘉兴'
      },
      {
        dimensionKey: '231102144451025',
        value: '嘉善'
      },
      {
        dimensionKey: '231102144451025',
        value: '嘉峪关'
      },
      {
        dimensionKey: '231102144451025',
        value: '四平'
      },
      {
        dimensionKey: '231102144451025',
        value: '图们'
      },
      {
        dimensionKey: '231102144451025',
        value: '坪山'
      },
      {
        dimensionKey: '231102144451025',
        value: '埠河'
      },
      {
        dimensionKey: '231102144451025',
        value: '塔河'
      },
      {
        dimensionKey: '231102144451025',
        value: '塘坪'
      },
      {
        dimensionKey: '231102144451025',
        value: '塘沽'
      },
      {
        dimensionKey: '231102144451025',
        value: '夏镇'
      },
      {
        dimensionKey: '231102144451025',
        value: '大冶'
      },
      {
        dimensionKey: '231102144451025',
        value: '大同'
      },
      {
        dimensionKey: '231102144451025',
        value: '大庆'
      },
      {
        dimensionKey: '231102144451025',
        value: '大理'
      },
      {
        dimensionKey: '231102144451025',
        value: '大连'
      },
      {
        dimensionKey: '231102144451025',
        value: '大连湾'
      },
      {
        dimensionKey: '231102144451025',
        value: '天津'
      },
      {
        dimensionKey: '231102144451025',
        value: '天长'
      },
      {
        dimensionKey: '231102144451025',
        value: '太原'
      },
      {
        dimensionKey: '231102144451025',
        value: '姜堰'
      },
      {
        dimensionKey: '231102144451025',
        value: '威宁'
      },
      {
        dimensionKey: '231102144451025',
        value: '威海'
      },
      {
        dimensionKey: '231102144451025',
        value: '娄底'
      },
      {
        dimensionKey: '231102144451025',
        value: '嫩江'
      },
      {
        dimensionKey: '231102144451025',
        value: '孝感'
      },
      {
        dimensionKey: '231102144451025',
        value: '宁波'
      },
      {
        dimensionKey: '231102144451025',
        value: '宁海'
      },
      {
        dimensionKey: '231102144451025',
        value: '宁阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '安丘'
      },
      {
        dimensionKey: '231102144451025',
        value: '安埠'
      },
      {
        dimensionKey: '231102144451025',
        value: '安庆'
      },
      {
        dimensionKey: '231102144451025',
        value: '安康'
      },
      {
        dimensionKey: '231102144451025',
        value: '安达'
      },
      {
        dimensionKey: '231102144451025',
        value: '安阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '安顺'
      },
      {
        dimensionKey: '231102144451025',
        value: '定州'
      },
      {
        dimensionKey: '231102144451025',
        value: '定陶'
      },
      {
        dimensionKey: '231102144451025',
        value: '宜城'
      },
      {
        dimensionKey: '231102144451025',
        value: '宜宾'
      },
      {
        dimensionKey: '231102144451025',
        value: '宜昌'
      },
      {
        dimensionKey: '231102144451025',
        value: '宜春'
      },
      {
        dimensionKey: '231102144451025',
        value: '宝山'
      },
      {
        dimensionKey: '231102144451025',
        value: '宝应'
      },
      {
        dimensionKey: '231102144451025',
        value: '宣化'
      },
      {
        dimensionKey: '231102144451025',
        value: '宣州'
      },
      {
        dimensionKey: '231102144451025',
        value: '宽甸'
      },
      {
        dimensionKey: '231102144451025',
        value: '宾州'
      },
      {
        dimensionKey: '231102144451025',
        value: '宿州'
      },
      {
        dimensionKey: '231102144451025',
        value: '密山'
      },
      {
        dimensionKey: '231102144451025',
        value: '富拉尔基区'
      },
      {
        dimensionKey: '231102144451025',
        value: '富锦'
      },
      {
        dimensionKey: '231102144451025',
        value: '富阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '寒亭'
      },
      {
        dimensionKey: '231102144451025',
        value: '寿光'
      },
      {
        dimensionKey: '231102144451025',
        value: '小围寨'
      },
      {
        dimensionKey: '231102144451025',
        value: '尚志'
      },
      {
        dimensionKey: '231102144451025',
        value: '山亭'
      },
      {
        dimensionKey: '231102144451025',
        value: '山城'
      },
      {
        dimensionKey: '231102144451025',
        value: '山河屯'
      },
      {
        dimensionKey: '231102144451025',
        value: '岫岩'
      },
      {
        dimensionKey: '231102144451025',
        value: '岭东'
      },
      {
        dimensionKey: '231102144451025',
        value: '岳阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '州城'
      },
      {
        dimensionKey: '231102144451025',
        value: '巢湖'
      },
      {
        dimensionKey: '231102144451025',
        value: '巨野'
      },
      {
        dimensionKey: '231102144451025',
        value: '常州'
      },
      {
        dimensionKey: '231102144451025',
        value: '常德'
      },
      {
        dimensionKey: '231102144451025',
        value: '常熟市'
      },
      {
        dimensionKey: '231102144451025',
        value: '平凉'
      },
      {
        dimensionKey: '231102144451025',
        value: '平南'
      },
      {
        dimensionKey: '231102144451025',
        value: '平庄'
      },
      {
        dimensionKey: '231102144451025',
        value: '平度'
      },
      {
        dimensionKey: '231102144451025',
        value: '平遥'
      },
      {
        dimensionKey: '231102144451025',
        value: '平邑'
      },
      {
        dimensionKey: '231102144451025',
        value: '平阴'
      },
      {
        dimensionKey: '231102144451025',
        value: '平顶山'
      },
      {
        dimensionKey: '231102144451025',
        value: '广元'
      },
      {
        dimensionKey: '231102144451025',
        value: '广州'
      },
      {
        dimensionKey: '231102144451025',
        value: '广水'
      },
      {
        dimensionKey: '231102144451025',
        value: '庄河'
      },
      {
        dimensionKey: '231102144451025',
        value: '库尔勒'
      },
      {
        dimensionKey: '231102144451025',
        value: '应城'
      },
      {
        dimensionKey: '231102144451025',
        value: '廉州镇'
      },
      {
        dimensionKey: '231102144451025',
        value: '廉江'
      },
      {
        dimensionKey: '231102144451025',
        value: '廉洲'
      },
      {
        dimensionKey: '231102144451025',
        value: '廊坊'
      },
      {
        dimensionKey: '231102144451025',
        value: '延吉'
      },
      {
        dimensionKey: '231102144451025',
        value: '开化'
      },
      {
        dimensionKey: '231102144451025',
        value: '开原'
      },
      {
        dimensionKey: '231102144451025',
        value: '开封'
      },
      {
        dimensionKey: '231102144451025',
        value: '开远'
      },
      {
        dimensionKey: '231102144451025',
        value: '开通'
      },
      {
        dimensionKey: '231102144451025',
        value: '张家口'
      },
      {
        dimensionKey: '231102144451025',
        value: '张家港'
      },
      {
        dimensionKey: '231102144451025',
        value: '张掖'
      },
      {
        dimensionKey: '231102144451025',
        value: '弥阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '归仁'
      },
      {
        dimensionKey: '231102144451025',
        value: '彭城'
      },
      {
        dimensionKey: '231102144451025',
        value: '徐州'
      },
      {
        dimensionKey: '231102144451025',
        value: '德州'
      },
      {
        dimensionKey: '231102144451025',
        value: '德惠'
      },
      {
        dimensionKey: '231102144451025',
        value: '德阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '忻州'
      },
      {
        dimensionKey: '231102144451025',
        value: '怀化'
      },
      {
        dimensionKey: '231102144451025',
        value: '怀城'
      },
      {
        dimensionKey: '231102144451025',
        value: '恒山'
      },
      {
        dimensionKey: '231102144451025',
        value: '恩城'
      },
      {
        dimensionKey: '231102144451025',
        value: '恩施'
      },
      {
        dimensionKey: '231102144451025',
        value: '惠城'
      },
      {
        dimensionKey: '231102144451025',
        value: '惠州'
      },
      {
        dimensionKey: '231102144451025',
        value: '成都'
      },
      {
        dimensionKey: '231102144451025',
        value: '扬州'
      },
      {
        dimensionKey: '231102144451025',
        value: '扶余'
      },
      {
        dimensionKey: '231102144451025',
        value: '承德'
      },
      {
        dimensionKey: '231102144451025',
        value: '抚顺'
      },
      {
        dimensionKey: '231102144451025',
        value: '拉萨'
      },
      {
        dimensionKey: '231102144451025',
        value: '招远'
      },
      {
        dimensionKey: '231102144451025',
        value: '拜泉'
      },
      {
        dimensionKey: '231102144451025',
        value: '揭阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '敦化'
      },
      {
        dimensionKey: '231102144451025',
        value: '文登'
      },
      {
        dimensionKey: '231102144451025',
        value: '新乡'
      },
      {
        dimensionKey: '231102144451025',
        value: '新余'
      },
      {
        dimensionKey: '231102144451025',
        value: '新民'
      },
      {
        dimensionKey: '231102144451025',
        value: '新泰'
      },
      {
        dimensionKey: '231102144451025',
        value: '新石'
      },
      {
        dimensionKey: '231102144451025',
        value: '新野'
      },
      {
        dimensionKey: '231102144451025',
        value: '无城'
      },
      {
        dimensionKey: '231102144451025',
        value: '无锡'
      },
      {
        dimensionKey: '231102144451025',
        value: '日照'
      },
      {
        dimensionKey: '231102144451025',
        value: '昆明'
      },
      {
        dimensionKey: '231102144451025',
        value: '昆阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '昌吉'
      },
      {
        dimensionKey: '231102144451025',
        value: '昌图'
      },
      {
        dimensionKey: '231102144451025',
        value: '昌平'
      },
      {
        dimensionKey: '231102144451025',
        value: '昌黎'
      },
      {
        dimensionKey: '231102144451025',
        value: '明光'
      },
      {
        dimensionKey: '231102144451025',
        value: '明月'
      },
      {
        dimensionKey: '231102144451025',
        value: '明水'
      },
      {
        dimensionKey: '231102144451025',
        value: '昭通'
      },
      {
        dimensionKey: '231102144451025',
        value: '晋城'
      },
      {
        dimensionKey: '231102144451025',
        value: '晋江'
      },
      {
        dimensionKey: '231102144451025',
        value: '普兰店'
      },
      {
        dimensionKey: '231102144451025',
        value: '景德镇'
      },
      {
        dimensionKey: '231102144451025',
        value: '景洪'
      },
      {
        dimensionKey: '231102144451025',
        value: '曲阜'
      },
      {
        dimensionKey: '231102144451025',
        value: '曲靖'
      },
      {
        dimensionKey: '231102144451025',
        value: '朗乡'
      },
      {
        dimensionKey: '231102144451025',
        value: '望奎'
      },
      {
        dimensionKey: '231102144451025',
        value: '朝阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '本溪'
      },
      {
        dimensionKey: '231102144451025',
        value: '来宾'
      },
      {
        dimensionKey: '231102144451025',
        value: '杨村'
      },
      {
        dimensionKey: '231102144451025',
        value: '杨柳青'
      },
      {
        dimensionKey: '231102144451025',
        value: '杭州'
      },
      {
        dimensionKey: '231102144451025',
        value: '松江河'
      },
      {
        dimensionKey: '231102144451025',
        value: '松陵'
      },
      {
        dimensionKey: '231102144451025',
        value: '林口'
      },
      {
        dimensionKey: '231102144451025',
        value: '枝城'
      },
      {
        dimensionKey: '231102144451025',
        value: '枝江'
      },
      {
        dimensionKey: '231102144451025',
        value: '枣庄'
      },
      {
        dimensionKey: '231102144451025',
        value: '枣阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '栖霞'
      },
      {
        dimensionKey: '231102144451025',
        value: '株洲'
      },
      {
        dimensionKey: '231102144451025',
        value: '栾城'
      },
      {
        dimensionKey: '231102144451025',
        value: '桂平'
      },
      {
        dimensionKey: '231102144451025',
        value: '桂林'
      },
      {
        dimensionKey: '231102144451025',
        value: '桓仁'
      },
      {
        dimensionKey: '231102144451025',
        value: '桦南'
      },
      {
        dimensionKey: '231102144451025',
        value: '桦甸'
      },
      {
        dimensionKey: '231102144451025',
        value: '梅州'
      },
      {
        dimensionKey: '231102144451025',
        value: '梅河口'
      },
      {
        dimensionKey: '231102144451025',
        value: '梧州'
      },
      {
        dimensionKey: '231102144451025',
        value: '梨树'
      },
      {
        dimensionKey: '231102144451025',
        value: '椒江'
      },
      {
        dimensionKey: '231102144451025',
        value: '榆林'
      },
      {
        dimensionKey: '231102144451025',
        value: '榆树'
      },
      {
        dimensionKey: '231102144451025',
        value: '榆次'
      },
      {
        dimensionKey: '231102144451025',
        value: '武汉'
      },
      {
        dimensionKey: '231102144451025',
        value: '武穴'
      },
      {
        dimensionKey: '231102144451025',
        value: '毕节'
      },
      {
        dimensionKey: '231102144451025',
        value: '永丰'
      },
      {
        dimensionKey: '231102144451025',
        value: '永川'
      },
      {
        dimensionKey: '231102144451025',
        value: '汉中'
      },
      {
        dimensionKey: '231102144451025',
        value: '汉川'
      },
      {
        dimensionKey: '231102144451025',
        value: '汉沽'
      },
      {
        dimensionKey: '231102144451025',
        value: '汕头'
      },
      {
        dimensionKey: '231102144451025',
        value: '汕尾'
      },
      {
        dimensionKey: '231102144451025',
        value: '江口'
      },
      {
        dimensionKey: '231102144451025',
        value: '江油'
      },
      {
        dimensionKey: '231102144451025',
        value: '江都'
      },
      {
        dimensionKey: '231102144451025',
        value: '江门'
      },
      {
        dimensionKey: '231102144451025',
        value: '池州'
      },
      {
        dimensionKey: '231102144451025',
        value: '汪清'
      },
      {
        dimensionKey: '231102144451025',
        value: '汶上'
      },
      {
        dimensionKey: '231102144451025',
        value: '沂水'
      },
      {
        dimensionKey: '231102144451025',
        value: '沅江'
      },
      {
        dimensionKey: '231102144451025',
        value: '沈阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '沙市'
      },
      {
        dimensionKey: '231102144451025',
        value: '沧州'
      },
      {
        dimensionKey: '231102144451025',
        value: '河坡'
      },
      {
        dimensionKey: '231102144451025',
        value: '河源'
      },
      {
        dimensionKey: '231102144451025',
        value: '泉州'
      },
      {
        dimensionKey: '231102144451025',
        value: '泗水'
      },
      {
        dimensionKey: '231102144451025',
        value: '泰兴'
      },
      {
        dimensionKey: '231102144451025',
        value: '泰州'
      },
      {
        dimensionKey: '231102144451025',
        value: '泰来'
      },
      {
        dimensionKey: '231102144451025',
        value: '洛阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '津市'
      },
      {
        dimensionKey: '231102144451025',
        value: '洪江'
      },
      {
        dimensionKey: '231102144451025',
        value: '洮南'
      },
      {
        dimensionKey: '231102144451025',
        value: '济南'
      },
      {
        dimensionKey: '231102144451025',
        value: '济宁'
      },
      {
        dimensionKey: '231102144451025',
        value: '济水'
      },
      {
        dimensionKey: '231102144451025',
        value: '浏阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '浦城'
      },
      {
        dimensionKey: '231102144451025',
        value: '浦阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '浯溪'
      },
      {
        dimensionKey: '231102144451025',
        value: '海口'
      },
      {
        dimensionKey: '231102144451025',
        value: '海城'
      },
      {
        dimensionKey: '231102144451025',
        value: '海州'
      },
      {
        dimensionKey: '231102144451025',
        value: '海拉尔'
      },
      {
        dimensionKey: '231102144451025',
        value: '海林'
      },
      {
        dimensionKey: '231102144451025',
        value: '海门'
      },
      {
        dimensionKey: '231102144451025',
        value: '涟源'
      },
      {
        dimensionKey: '231102144451025',
        value: '涪陵'
      },
      {
        dimensionKey: '231102144451025',
        value: '淡水'
      },
      {
        dimensionKey: '231102144451025',
        value: '淮北'
      },
      {
        dimensionKey: '231102144451025',
        value: '淮南'
      },
      {
        dimensionKey: '231102144451025',
        value: '淮阴'
      },
      {
        dimensionKey: '231102144451025',
        value: '深圳'
      },
      {
        dimensionKey: '231102144451025',
        value: '清远'
      },
      {
        dimensionKey: '231102144451025',
        value: '温岭'
      },
      {
        dimensionKey: '231102144451025',
        value: '温州'
      },
      {
        dimensionKey: '231102144451025',
        value: '渭南'
      },
      {
        dimensionKey: '231102144451025',
        value: '湖州'
      },
      {
        dimensionKey: '231102144451025',
        value: '湘乡'
      },
      {
        dimensionKey: '231102144451025',
        value: '湘潭'
      },
      {
        dimensionKey: '231102144451025',
        value: '湛江'
      },
      {
        dimensionKey: '231102144451025',
        value: '溪美'
      },
      {
        dimensionKey: '231102144451025',
        value: '滁州'
      },
      {
        dimensionKey: '231102144451025',
        value: '滕州'
      },
      {
        dimensionKey: '231102144451025',
        value: '满洲里'
      },
      {
        dimensionKey: '231102144451025',
        value: '滴道'
      },
      {
        dimensionKey: '231102144451025',
        value: '漯河'
      },
      {
        dimensionKey: '231102144451025',
        value: '漳州'
      },
      {
        dimensionKey: '231102144451025',
        value: '潍坊'
      },
      {
        dimensionKey: '231102144451025',
        value: '潮州'
      },
      {
        dimensionKey: '231102144451025',
        value: '潼川'
      },
      {
        dimensionKey: '231102144451025',
        value: '澄江'
      },
      {
        dimensionKey: '231102144451025',
        value: '濉溪'
      },
      {
        dimensionKey: '231102144451025',
        value: '濮阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '烟台'
      },
      {
        dimensionKey: '231102144451025',
        value: '烟筒山'
      },
      {
        dimensionKey: '231102144451025',
        value: '焦作'
      },
      {
        dimensionKey: '231102144451025',
        value: '牙克石'
      },
      {
        dimensionKey: '231102144451025',
        value: '牡丹江'
      },
      {
        dimensionKey: '231102144451025',
        value: '玉林'
      },
      {
        dimensionKey: '231102144451025',
        value: '玉溪'
      },
      {
        dimensionKey: '231102144451025',
        value: '珠海'
      },
      {
        dimensionKey: '231102144451025',
        value: '珲春'
      },
      {
        dimensionKey: '231102144451025',
        value: '琼山'
      },
      {
        dimensionKey: '231102144451025',
        value: '瓦房店'
      },
      {
        dimensionKey: '231102144451025',
        value: '甘南'
      },
      {
        dimensionKey: '231102144451025',
        value: '界首'
      },
      {
        dimensionKey: '231102144451025',
        value: '登封'
      },
      {
        dimensionKey: '231102144451025',
        value: '白城'
      },
      {
        dimensionKey: '231102144451025',
        value: '白山'
      },
      {
        dimensionKey: '231102144451025',
        value: '白银'
      },
      {
        dimensionKey: '231102144451025',
        value: '百色'
      },
      {
        dimensionKey: '231102144451025',
        value: '皇岗'
      },
      {
        dimensionKey: '231102144451025',
        value: '益阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '盐城'
      },
      {
        dimensionKey: '231102144451025',
        value: '睢城'
      },
      {
        dimensionKey: '231102144451025',
        value: '石嘴山'
      },
      {
        dimensionKey: '231102144451025',
        value: '石家庄'
      },
      {
        dimensionKey: '231102144451025',
        value: '石桥'
      },
      {
        dimensionKey: '231102144451025',
        value: '石河子'
      },
      {
        dimensionKey: '231102144451025',
        value: '石炭井'
      },
      {
        dimensionKey: '231102144451025',
        value: '石马'
      },
      {
        dimensionKey: '231102144451025',
        value: '石龙'
      },
      {
        dimensionKey: '231102144451025',
        value: '碣石'
      },
      {
        dimensionKey: '231102144451025',
        value: '磐石'
      },
      {
        dimensionKey: '231102144451025',
        value: '禄步'
      },
      {
        dimensionKey: '231102144451025',
        value: '福州'
      },
      {
        dimensionKey: '231102144451025',
        value: '禹城'
      },
      {
        dimensionKey: '231102144451025',
        value: '禹州'
      },
      {
        dimensionKey: '231102144451025',
        value: '秦皇岛'
      },
      {
        dimensionKey: '231102144451025',
        value: '绍兴'
      },
      {
        dimensionKey: '231102144451025',
        value: '绥化'
      },
      {
        dimensionKey: '231102144451025',
        value: '绥棱'
      },
      {
        dimensionKey: '231102144451025',
        value: '绥芬河'
      },
      {
        dimensionKey: '231102144451025',
        value: '绵阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '罗城'
      },
      {
        dimensionKey: '231102144451025',
        value: '罗容'
      },
      {
        dimensionKey: '231102144451025',
        value: '老河口'
      },
      {
        dimensionKey: '231102144451025',
        value: '耒阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '聊城'
      },
      {
        dimensionKey: '231102144451025',
        value: '肃州'
      },
      {
        dimensionKey: '231102144451025',
        value: '肇东'
      },
      {
        dimensionKey: '231102144451025',
        value: '肇庆'
      },
      {
        dimensionKey: '231102144451025',
        value: '肇源'
      },
      {
        dimensionKey: '231102144451025',
        value: '胶南'
      },
      {
        dimensionKey: '231102144451025',
        value: '胶州'
      },
      {
        dimensionKey: '231102144451025',
        value: '自贡'
      },
      {
        dimensionKey: '231102144451025',
        value: '舒兰'
      },
      {
        dimensionKey: '231102144451025',
        value: '良乡'
      },
      {
        dimensionKey: '231102144451025',
        value: '芜湖'
      },
      {
        dimensionKey: '231102144451025',
        value: '苏家屯'
      },
      {
        dimensionKey: '231102144451025',
        value: '苏州'
      },
      {
        dimensionKey: '231102144451025',
        value: '荆州'
      },
      {
        dimensionKey: '231102144451025',
        value: '荆门'
      },
      {
        dimensionKey: '231102144451025',
        value: '荔城'
      },
      {
        dimensionKey: '231102144451025',
        value: '莆田'
      },
      {
        dimensionKey: '231102144451025',
        value: '莎车'
      },
      {
        dimensionKey: '231102144451025',
        value: '莘县'
      },
      {
        dimensionKey: '231102144451025',
        value: '莱州'
      },
      {
        dimensionKey: '231102144451025',
        value: '莱芜'
      },
      {
        dimensionKey: '231102144451025',
        value: '莱阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '菏泽'
      },
      {
        dimensionKey: '231102144451025',
        value: '萍乡'
      },
      {
        dimensionKey: '231102144451025',
        value: '营口'
      },
      {
        dimensionKey: '231102144451025',
        value: '蒙阴'
      },
      {
        dimensionKey: '231102144451025',
        value: '蒲圻'
      },
      {
        dimensionKey: '231102144451025',
        value: '蒲庙'
      },
      {
        dimensionKey: '231102144451025',
        value: '蓬莱'
      },
      {
        dimensionKey: '231102144451025',
        value: '蔡甸'
      },
      {
        dimensionKey: '231102144451025',
        value: '虎石台'
      },
      {
        dimensionKey: '231102144451025',
        value: '虎门'
      },
      {
        dimensionKey: '231102144451025',
        value: '虢镇'
      },
      {
        dimensionKey: '231102144451025',
        value: '蚌埠'
      },
      {
        dimensionKey: '231102144451025',
        value: '蛟河'
      },
      {
        dimensionKey: '231102144451025',
        value: '衡水'
      },
      {
        dimensionKey: '231102144451025',
        value: '衡阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '衢州'
      },
      {
        dimensionKey: '231102144451025',
        value: '襄城'
      },
      {
        dimensionKey: '231102144451025',
        value: '襄樊'
      },
      {
        dimensionKey: '231102144451025',
        value: '西丰'
      },
      {
        dimensionKey: '231102144451025',
        value: '西乡'
      },
      {
        dimensionKey: '231102144451025',
        value: '西华'
      },
      {
        dimensionKey: '231102144451025',
        value: '西宁'
      },
      {
        dimensionKey: '231102144451025',
        value: '西安'
      },
      {
        dimensionKey: '231102144451025',
        value: '西昌'
      },
      {
        dimensionKey: '231102144451025',
        value: '让胡路'
      },
      {
        dimensionKey: '231102144451025',
        value: '讷河'
      },
      {
        dimensionKey: '231102144451025',
        value: '许昌'
      },
      {
        dimensionKey: '231102144451025',
        value: '诸暨'
      },
      {
        dimensionKey: '231102144451025',
        value: '贵溪'
      },
      {
        dimensionKey: '231102144451025',
        value: '贵阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '赤峰'
      },
      {
        dimensionKey: '231102144451025',
        value: '辉南'
      },
      {
        dimensionKey: '231102144451025',
        value: '辛置'
      },
      {
        dimensionKey: '231102144451025',
        value: '辛集'
      },
      {
        dimensionKey: '231102144451025',
        value: '边庄'
      },
      {
        dimensionKey: '231102144451025',
        value: '辽中'
      },
      {
        dimensionKey: '231102144451025',
        value: '辽源'
      },
      {
        dimensionKey: '231102144451025',
        value: '辽阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '运城'
      },
      {
        dimensionKey: '231102144451025',
        value: '连然'
      },
      {
        dimensionKey: '231102144451025',
        value: '通州'
      },
      {
        dimensionKey: '231102144451025',
        value: '通辽'
      },
      {
        dimensionKey: '231102144451025',
        value: '遂宁'
      },
      {
        dimensionKey: '231102144451025',
        value: '遵义'
      },
      {
        dimensionKey: '231102144451025',
        value: '邓州'
      },
      {
        dimensionKey: '231102144451025',
        value: '邢台'
      },
      {
        dimensionKey: '231102144451025',
        value: '那曲'
      },
      {
        dimensionKey: '231102144451025',
        value: '邯郸'
      },
      {
        dimensionKey: '231102144451025',
        value: '邳州'
      },
      {
        dimensionKey: '231102144451025',
        value: '邵武'
      },
      {
        dimensionKey: '231102144451025',
        value: '郑家屯'
      },
      {
        dimensionKey: '231102144451025',
        value: '郑州'
      },
      {
        dimensionKey: '231102144451025',
        value: '郴州'
      },
      {
        dimensionKey: '231102144451025',
        value: '郸城'
      },
      {
        dimensionKey: '231102144451025',
        value: '都匀'
      },
      {
        dimensionKey: '231102144451025',
        value: '鄂州'
      },
      {
        dimensionKey: '231102144451025',
        value: '鄱阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '醴陵'
      },
      {
        dimensionKey: '231102144451025',
        value: '重庆'
      },
      {
        dimensionKey: '231102144451025',
        value: '金乡'
      },
      {
        dimensionKey: '231102144451025',
        value: '金华'
      },
      {
        dimensionKey: '231102144451025',
        value: '金昌'
      },
      {
        dimensionKey: '231102144451025',
        value: '金沙'
      },
      {
        dimensionKey: '231102144451025',
        value: '钟祥'
      },
      {
        dimensionKey: '231102144451025',
        value: '钦州'
      },
      {
        dimensionKey: '231102144451025',
        value: '铁力'
      },
      {
        dimensionKey: '231102144451025',
        value: '铁岭'
      },
      {
        dimensionKey: '231102144451025',
        value: '铜仁'
      },
      {
        dimensionKey: '231102144451025',
        value: '铜川'
      },
      {
        dimensionKey: '231102144451025',
        value: '铜陵'
      },
      {
        dimensionKey: '231102144451025',
        value: '银川'
      },
      {
        dimensionKey: '231102144451025',
        value: '锡林浩特'
      },
      {
        dimensionKey: '231102144451025',
        value: '镇江'
      },
      {
        dimensionKey: '231102144451025',
        value: '镇赉'
      },
      {
        dimensionKey: '231102144451025',
        value: '长春'
      },
      {
        dimensionKey: '231102144451025',
        value: '长沙'
      },
      {
        dimensionKey: '231102144451025',
        value: '长治'
      },
      {
        dimensionKey: '231102144451025',
        value: '长清'
      },
      {
        dimensionKey: '231102144451025',
        value: '门头沟'
      },
      {
        dimensionKey: '231102144451025',
        value: '阆中'
      },
      {
        dimensionKey: '231102144451025',
        value: '阜阳'
      },
      {
        dimensionKey: '231102144451025',
        value: '阳春'
      },
      {
        dimensionKey: '231102144451025',
        value: '阳江'
      },
      {
        dimensionKey: '231102144451025',
        value: '阳泉'
      },
      {
        dimensionKey: '231102144451025',
        value: '阳谷'
      },
      {
        dimensionKey: '231102144451025',
        value: '阿克苏'
      },
      {
        dimensionKey: '231102144451025',
        value: '阿城'
      },
      {
        dimensionKey: '231102144451025',
        value: '阿里河'
      },
      {
        dimensionKey: '231102144451025',
        value: '随州'
      },
      {
        dimensionKey: '231102144451025',
        value: '雄州'
      },
      {
        dimensionKey: '231102144451025',
        value: '集宁'
      },
      {
        dimensionKey: '231102144451025',
        value: '青冈'
      },
      {
        dimensionKey: '231102144451025',
        value: '青岛'
      },
      {
        dimensionKey: '231102144451025',
        value: '青州'
      },
      {
        dimensionKey: '231102144451025',
        value: '鞍山'
      },
      {
        dimensionKey: '231102144451025',
        value: '韩城'
      },
      {
        dimensionKey: '231102144451025',
        value: '韶关'
      },
      {
        dimensionKey: '231102144451025',
        value: '顺义'
      },
      {
        dimensionKey: '231102144451025',
        value: '颍上城关镇'
      },
      {
        dimensionKey: '231102144451025',
        value: '马坝'
      },
      {
        dimensionKey: '231102144451025',
        value: '驻马店'
      },
      {
        dimensionKey: '231102144451025',
        value: '高密'
      },
      {
        dimensionKey: '231102144451025',
        value: '高州'
      },
      {
        dimensionKey: '231102144451025',
        value: '高邮'
      },
      {
        dimensionKey: '231102144451025',
        value: '鱼洞'
      },
      {
        dimensionKey: '231102144451025',
        value: '鸡东'
      },
      {
        dimensionKey: '231102144451025',
        value: '鸡西'
      },
      {
        dimensionKey: '231102144451025',
        value: '鹤壁'
      },
      {
        dimensionKey: '231102144451025',
        value: '鹤岗'
      },
      {
        dimensionKey: '231102144451025',
        value: '鹿城'
      },
      {
        dimensionKey: '231102144451025',
        value: '麻城'
      },
      {
        dimensionKey: '231102144451025',
        value: '黄山'
      },
      {
        dimensionKey: '231102144451025',
        value: '黄岩'
      },
      {
        dimensionKey: '231102144451025',
        value: '黄州'
      },
      {
        dimensionKey: '231102144451025',
        value: '黄梅'
      },
      {
        dimensionKey: '231102144451025',
        value: '黄石'
      },
      {
        dimensionKey: '231102144451025',
        value: '黄陂'
      },
      {
        dimensionKey: '231102144451025',
        value: '黎城'
      },
      {
        dimensionKey: '231102144451025',
        value: '黑山'
      },
      {
        dimensionKey: '231102144451025',
        value: '齐齐哈尔'
      },
      {
        dimensionKey: '231102144451025',
        value: '龙井'
      },
      {
        dimensionKey: '231102144451025',
        value: '龙凤'
      },
      {
        dimensionKey: '231102144451025',
        value: '龙口'
      },
      {
        dimensionKey: '231102144451025',
        value: '龙江'
      },
      {
        dimensionKey: '231102144451025',
        value: '龙泉'
      }
    ],
    rowTree: [],
    columns: [
      {
        dimensionKey: '231102144451025',
        title: '城市_测试'
      }
    ],
    rows: [],
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
        orient: 'bottom',
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
          text: '类别',
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
          space: 4,
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
        paddingInner: [0, 0.1],
        paddingOuter: [0, 0.25],
        autoRegionSize: true,
        bandSize: 20
      },
      {
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
        orient: 'left',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        title: {
          visible: false,
          text: '销售额',
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
          space: 6,
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
        zero: true,
        nice: true
      }
    ],
    indicators: [
      {
        indicatorKey: '10002',
        title: '',
        width: 'auto',
        cellType: 'chart',
        chartModule: 'vchart',
        style: {
          padding: [1, 1, 0, 1]
        },
        chartSpec: {
          type: 'bar',
          xField: ['231102144451020', '10001'],
          yField: ['10002'],
          direction: 'vertical',
          sortDataByAxis: true,
          seriesField: '20001',
          padding: 0,
          labelLayout: 'region',
          data: {
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '10002': {
                alias: '指标值 '
              },
              '20001': {
                alias: '图例项 ',
                domain: ['销售额'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '231102144451017': {
                alias: '销售额'
              },
              '231102144451020': {
                alias: '类别'
              },
              '231102144451025': {
                alias: '城市_测试'
              }
            }
          },
          stackInverse: true,
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
              orient: 'bottom',
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
                text: '类别',
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
                space: 4,
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
              paddingInner: [0, 0.1],
              paddingOuter: [0, 0.25],
              autoRegionSize: true,
              bandSize: 20
            },
            {
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
              orient: 'left',
              visible: true,
              domainLine: {
                visible: true,
                style: {
                  lineWidth: 1,
                  stroke: 'rgba(255, 255, 255, 0)'
                }
              },
              title: {
                visible: false,
                text: '销售额',
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
                space: 6,
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
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1'],
            specified: {},
            domain: ['销售额']
          },
          label: {
            visible: false,
            offset: 0,
            overlap: {
              hideOnHit: true,
              avoidBaseMark: false,
              strategy: [
                {
                  type: 'position',
                  position: []
                },
                {
                  type: 'moveY',
                  offset: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
                },
                {
                  type: 'moveX',
                  offset: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
                }
              ],
              clampForce: true
            },
            style: {
              fontSize: 12,
              fontWeight: 'normal',
              zIndex: 400,
              fill: null,
              lineWidth: 1,
              strokeOpacity: 1
            },
            position: 'inside',
            smartInvert: {
              fillStrategy: 'invertBase',
              strokeStrategy: 'similarBase',
              outsideEnable: true
            }
          },
          tooltip: {
            handler: {}
          },
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
          region: [
            {
              clip: true
            }
          ],
          background: 'rgba(255, 255, 255, 0)',
          scrollBar: [
            {
              orient: 'bottom',
              start: 0,
              auto: true,
              roamScroll: true,
              filterMode: 'axis'
            }
          ],
          dataZoom: [],
          animation: false
        }
      }
    ],
    indicatorsAsCol: false,
    records: [
      {
        '10001': '销售额',
        '10002': '3459.5400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3459.5400390625',
        '231102144451020': '家具',
        '231102144451025': '七台河1'
      },
      {
        '10001': '销售额',
        '10002': '41896.67889404297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '41896.67889404297',
        '231102144451020': '技术',
        '231102144451025': '七台河1'
      },
      {
        '10001': '销售额',
        '10002': '7471.100036621094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7471.100036621094',
        '231102144451020': '办公用品',
        '231102144451025': '七台河1'
      },
      {
        '10001': '销售额',
        '10002': '10928.84814453125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10928.84814453125',
        '231102144451020': '家具',
        '231102144451025': '万县1'
      },
      {
        '10001': '销售额',
        '10002': '3359.327880859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3359.327880859375',
        '231102144451020': '技术',
        '231102144451025': '万县1'
      },
      {
        '10001': '销售额',
        '10002': '2633.4000091552734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2633.4000091552734',
        '231102144451020': '办公用品',
        '231102144451025': '万县1'
      },
      {
        '10001': '销售额',
        '10002': '8399.299995422363',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8399.299995422363',
        '231102144451020': '办公用品',
        '231102144451025': '三亚1'
      },
      {
        '10001': '销售额',
        '10002': '6501.8800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6501.8800048828125',
        '231102144451020': '技术',
        '231102144451025': '三亚1'
      },
      {
        '10001': '销售额',
        '10002': '7797.216049194336',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7797.216049194336',
        '231102144451020': '家具',
        '231102144451025': '三亚1'
      },
      {
        '10001': '销售额',
        '10002': '927.7800140380859',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '927.7800140380859',
        '231102144451020': '办公用品',
        '231102144451025': '三岔子'
      },
      {
        '10001': '销售额',
        '10002': '2335.199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2335.199951171875',
        '231102144451020': '技术',
        '231102144451025': '三岔子'
      },
      {
        '10001': '销售额',
        '10002': '1458.7999725341797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1458.7999725341797',
        '231102144451020': '办公用品',
        '231102144451025': '三明'
      },
      {
        '10001': '销售额',
        '10002': '6100.164093017578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6100.164093017578',
        '231102144451020': '家具',
        '231102144451025': '上梅'
      },
      {
        '10001': '销售额',
        '10002': '1086.5400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1086.5400390625',
        '231102144451020': '技术',
        '231102144451025': '上梅'
      },
      {
        '10001': '销售额',
        '10002': '4517.772083282471',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4517.772083282471',
        '231102144451020': '办公用品',
        '231102144451025': '上梅'
      },
      {
        '10001': '销售额',
        '10002': '204081.7786102295',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '204081.7786102295',
        '231102144451020': '技术',
        '231102144451025': '上海'
      },
      {
        '10001': '销售额',
        '10002': '180672.12799072266',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '180672.12799072266',
        '231102144451020': '家具',
        '231102144451025': '上海'
      },
      {
        '10001': '销售额',
        '10002': '197696.65970230103',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '197696.65970230103',
        '231102144451020': '办公用品',
        '231102144451025': '上海'
      },
      {
        '10001': '销售额',
        '10002': '5229.672058105469',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5229.672058105469',
        '231102144451020': '技术',
        '231102144451025': '上虞'
      },
      {
        '10001': '销售额',
        '10002': '4391.0999183654785',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4391.0999183654785',
        '231102144451020': '办公用品',
        '231102144451025': '上虞'
      },
      {
        '10001': '销售额',
        '10002': '1052.0999755859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1052.0999755859375',
        '231102144451020': '家具',
        '231102144451025': '上虞'
      },
      {
        '10001': '销售额',
        '10002': '529.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '529.47998046875',
        '231102144451020': '家具',
        '231102144451025': '东丰'
      },
      {
        '10001': '销售额',
        '10002': '1256.3599853515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1256.3599853515625',
        '231102144451020': '办公用品',
        '231102144451025': '东丰'
      },
      {
        '10001': '销售额',
        '10002': '2633.904052734375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2633.904052734375',
        '231102144451020': '技术',
        '231102144451025': '东台'
      },
      {
        '10001': '销售额',
        '10002': '155.9880027770996',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '155.9880027770996',
        '231102144451020': '办公用品',
        '231102144451025': '东台'
      },
      {
        '10001': '销售额',
        '10002': '1296.6799926757812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1296.6799926757812',
        '231102144451020': '家具',
        '231102144451025': '东宁'
      },
      {
        '10001': '销售额',
        '10002': '1409.52001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1409.52001953125',
        '231102144451020': '办公用品',
        '231102144451025': '东宁'
      },
      {
        '10001': '销售额',
        '10002': '1064.7000122070312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1064.7000122070312',
        '231102144451020': '办公用品',
        '231102144451025': '东村'
      },
      {
        '10001': '销售额',
        '10002': '12627.440032958984',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12627.440032958984',
        '231102144451020': '家具',
        '231102144451025': '东村'
      },
      {
        '10001': '销售额',
        '10002': '4508.280029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4508.280029296875',
        '231102144451020': '家具',
        '231102144451025': '东海'
      },
      {
        '10001': '销售额',
        '10002': '6081.908012390137',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6081.908012390137',
        '231102144451020': '办公用品',
        '231102144451025': '东胜'
      },
      {
        '10001': '销售额',
        '10002': '3939.8519287109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3939.8519287109375',
        '231102144451020': '技术',
        '231102144451025': '东胜'
      },
      {
        '10001': '销售额',
        '10002': '2744.307891845703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2744.307891845703',
        '231102144451020': '家具',
        '231102144451025': '东胜'
      },
      {
        '10001': '销售额',
        '10002': '2517.1999740600586',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2517.1999740600586',
        '231102144451020': '办公用品',
        '231102144451025': '东莞'
      },
      {
        '10001': '销售额',
        '10002': '7648.690055847168',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7648.690055847168',
        '231102144451020': '家具',
        '231102144451025': '东莞'
      },
      {
        '10001': '销售额',
        '10002': '2082.0800247192383',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2082.0800247192383',
        '231102144451020': '办公用品',
        '231102144451025': '东营'
      },
      {
        '10001': '销售额',
        '10002': '5600.139892578125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5600.139892578125',
        '231102144451020': '家具',
        '231102144451025': '东营'
      },
      {
        '10001': '销售额',
        '10002': '9471.7001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9471.7001953125',
        '231102144451020': '技术',
        '231102144451025': '东营'
      },
      {
        '10001': '销售额',
        '10002': '1050.4199981689453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1050.4199981689453',
        '231102144451020': '办公用品',
        '231102144451025': '中枢'
      },
      {
        '10001': '销售额',
        '10002': '8917.63591003418',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8917.63591003418',
        '231102144451020': '办公用品',
        '231102144451025': '丰县'
      },
      {
        '10001': '销售额',
        '10002': '949.031982421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '949.031982421875',
        '231102144451020': '家具',
        '231102144451025': '丰县'
      },
      {
        '10001': '销售额',
        '10002': '442.8479919433594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '442.8479919433594',
        '231102144451020': '技术',
        '231102144451025': '丰县'
      },
      {
        '10001': '销售额',
        '10002': '82.04000091552734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '82.04000091552734',
        '231102144451020': '办公用品',
        '231102144451025': '丰润'
      },
      {
        '10001': '销售额',
        '10002': '3507.3360443115234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3507.3360443115234',
        '231102144451020': '办公用品',
        '231102144451025': '丰镇'
      },
      {
        '10001': '销售额',
        '10002': '367.21999740600586',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '367.21999740600586',
        '231102144451020': '办公用品',
        '231102144451025': '临朐'
      },
      {
        '10001': '销售额',
        '10002': '466.4800109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '466.4800109863281',
        '231102144451020': '家具',
        '231102144451025': '临朐'
      },
      {
        '10001': '销售额',
        '10002': '1169.8400115966797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1169.8400115966797',
        '231102144451020': '办公用品',
        '231102144451025': '临水'
      },
      {
        '10001': '销售额',
        '10002': '5910.520080566406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5910.520080566406',
        '231102144451020': '家具',
        '231102144451025': '临水'
      },
      {
        '10001': '销售额',
        '10002': '14362.740295410156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14362.740295410156',
        '231102144451020': '技术',
        '231102144451025': '临水'
      },
      {
        '10001': '销售额',
        '10002': '766.5000228881836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '766.5000228881836',
        '231102144451020': '办公用品',
        '231102144451025': '临江'
      },
      {
        '10001': '销售额',
        '10002': '34022.2392578125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '34022.2392578125',
        '231102144451020': '家具',
        '231102144451025': '临江'
      },
      {
        '10001': '销售额',
        '10002': '1708',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1708',
        '231102144451020': '技术',
        '231102144451025': '临江'
      },
      {
        '10001': '销售额',
        '10002': '10048.77978515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10048.77978515625',
        '231102144451020': '技术',
        '231102144451025': '临汾'
      },
      {
        '10001': '销售额',
        '10002': '3187.9399795532227',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3187.9399795532227',
        '231102144451020': '办公用品',
        '231102144451025': '临汾'
      },
      {
        '10001': '销售额',
        '10002': '12968.76025390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12968.76025390625',
        '231102144451020': '家具',
        '231102144451025': '临汾'
      },
      {
        '10001': '销售额',
        '10002': '32163.18034362793',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '32163.18034362793',
        '231102144451020': '办公用品',
        '231102144451025': '临沂'
      },
      {
        '10001': '销售额',
        '10002': '32226.040100097656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '32226.040100097656',
        '231102144451020': '技术',
        '231102144451025': '临沂'
      },
      {
        '10001': '销售额',
        '10002': '32811.52020263672',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '32811.52020263672',
        '231102144451020': '家具',
        '231102144451025': '临沂'
      },
      {
        '10001': '销售额',
        '10002': '374.05199432373047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '374.05199432373047',
        '231102144451020': '办公用品',
        '231102144451025': '临海'
      },
      {
        '10001': '销售额',
        '10002': '1761.8999328613281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1761.8999328613281',
        '231102144451020': '技术',
        '231102144451025': '临海'
      },
      {
        '10001': '销售额',
        '10002': '4935.50390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4935.50390625',
        '231102144451020': '家具',
        '231102144451025': '临海'
      },
      {
        '10001': '销售额',
        '10002': '7663.179969787598',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7663.179969787598',
        '231102144451020': '办公用品',
        '231102144451025': '临清'
      },
      {
        '10001': '销售额',
        '10002': '27144.31982421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '27144.31982421875',
        '231102144451020': '家具',
        '231102144451025': '临清'
      },
      {
        '10001': '销售额',
        '10002': '3868.6200561523438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3868.6200561523438',
        '231102144451020': '技术',
        '231102144451025': '临清'
      },
      {
        '10001': '销售额',
        '10002': '13745.676452636719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13745.676452636719',
        '231102144451020': '家具',
        '231102144451025': '丹东'
      },
      {
        '10001': '销售额',
        '10002': '13540.547969818115',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13540.547969818115',
        '231102144451020': '办公用品',
        '231102144451025': '丹东'
      },
      {
        '10001': '销售额',
        '10002': '18161.388305664062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18161.388305664062',
        '231102144451020': '技术',
        '231102144451025': '丹东'
      },
      {
        '10001': '销售额',
        '10002': '1644.0479736328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1644.0479736328125',
        '231102144451020': '技术',
        '231102144451025': '丹江口'
      },
      {
        '10001': '销售额',
        '10002': '1200.5840377807617',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1200.5840377807617',
        '231102144451020': '办公用品',
        '231102144451025': '丹江口'
      },
      {
        '10001': '销售额',
        '10002': '2034.9840087890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2034.9840087890625',
        '231102144451020': '家具',
        '231102144451025': '丹江口'
      },
      {
        '10001': '销售额',
        '10002': '3983.615966796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3983.615966796875',
        '231102144451020': '家具',
        '231102144451025': '丽水'
      },
      {
        '10001': '销售额',
        '10002': '8703.155792236328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8703.155792236328',
        '231102144451020': '家具',
        '231102144451025': '义乌'
      },
      {
        '10001': '销售额',
        '10002': '7639.940002441406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7639.940002441406',
        '231102144451020': '办公用品',
        '231102144451025': '义乌'
      },
      {
        '10001': '销售额',
        '10002': '18168.52783203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18168.52783203125',
        '231102144451020': '技术',
        '231102144451025': '义乌'
      },
      {
        '10001': '销售额',
        '10002': '1144.0240097045898',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1144.0240097045898',
        '231102144451020': '办公用品',
        '231102144451025': '义马'
      },
      {
        '10001': '销售额',
        '10002': '5003.011922836304',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5003.011922836304',
        '231102144451020': '办公用品',
        '231102144451025': '乌海'
      },
      {
        '10001': '销售额',
        '10002': '599.2559814453125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '599.2559814453125',
        '231102144451020': '技术',
        '231102144451025': '乌海'
      },
      {
        '10001': '销售额',
        '10002': '10494.372100830078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10494.372100830078',
        '231102144451020': '家具',
        '231102144451025': '乌海'
      },
      {
        '10001': '销售额',
        '10002': '3474.659912109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3474.659912109375',
        '231102144451020': '办公用品',
        '231102144451025': '乌达'
      },
      {
        '10001': '销售额',
        '10002': '2026.0799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2026.0799560546875',
        '231102144451020': '家具',
        '231102144451025': '乐城'
      },
      {
        '10001': '销售额',
        '10002': '1214.9200134277344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1214.9200134277344',
        '231102144451020': '办公用品',
        '231102144451025': '乐城'
      },
      {
        '10001': '销售额',
        '10002': '5731.57194519043',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5731.57194519043',
        '231102144451020': '家具',
        '231102144451025': '乐山'
      },
      {
        '10001': '销售额',
        '10002': '4392.360107421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4392.360107421875',
        '231102144451020': '技术',
        '231102144451025': '乐山'
      },
      {
        '10001': '销售额',
        '10002': '2437.959991455078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2437.959991455078',
        '231102144451020': '办公用品',
        '231102144451025': '乐山'
      },
      {
        '10001': '销售额',
        '10002': '3011.9039459228516',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3011.9039459228516',
        '231102144451020': '办公用品',
        '231102144451025': '九台'
      },
      {
        '10001': '销售额',
        '10002': '23441.599670410156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23441.599670410156',
        '231102144451020': '技术',
        '231102144451025': '九台'
      },
      {
        '10001': '销售额',
        '10002': '6082.439880371094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6082.439880371094',
        '231102144451020': '家具',
        '231102144451025': '九台'
      },
      {
        '10001': '销售额',
        '10002': '1287.2999725341797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1287.2999725341797',
        '231102144451020': '办公用品',
        '231102144451025': '九江'
      },
      {
        '10001': '销售额',
        '10002': '17662.82032775879',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17662.82032775879',
        '231102144451020': '技术',
        '231102144451025': '九江'
      },
      {
        '10001': '销售额',
        '10002': '10940.580078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10940.580078125',
        '231102144451020': '家具',
        '231102144451025': '九江'
      },
      {
        '10001': '销售额',
        '10002': '4461.2398681640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4461.2398681640625',
        '231102144451020': '技术',
        '231102144451025': '二道江'
      },
      {
        '10001': '销售额',
        '10002': '1998.3599853515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1998.3599853515625',
        '231102144451020': '技术',
        '231102144451025': '云浮'
      },
      {
        '10001': '销售额',
        '10002': '2267.300048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2267.300048828125',
        '231102144451020': '办公用品',
        '231102144451025': '云浮'
      },
      {
        '10001': '销售额',
        '10002': '2085.552001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2085.552001953125',
        '231102144451020': '家具',
        '231102144451025': '云浮'
      },
      {
        '10001': '销售额',
        '10002': '625.5199966430664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '625.5199966430664',
        '231102144451020': '办公用品',
        '231102144451025': '云阳'
      },
      {
        '10001': '销售额',
        '10002': '20335.700073242188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20335.700073242188',
        '231102144451020': '技术',
        '231102144451025': '云阳'
      },
      {
        '10001': '销售额',
        '10002': '3738.419921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3738.419921875',
        '231102144451020': '家具',
        '231102144451025': '云阳'
      },
      {
        '10001': '销售额',
        '10002': '1141.1399993896484',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1141.1399993896484',
        '231102144451020': '办公用品',
        '231102144451025': '五常'
      },
      {
        '10001': '销售额',
        '10002': '2630.320068359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2630.320068359375',
        '231102144451020': '家具',
        '231102144451025': '五常'
      },
      {
        '10001': '销售额',
        '10002': '14525.560302734375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14525.560302734375',
        '231102144451020': '家具',
        '231102144451025': '亳州'
      },
      {
        '10001': '销售额',
        '10002': '1035.8600158691406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1035.8600158691406',
        '231102144451020': '办公用品',
        '231102144451025': '亳州'
      },
      {
        '10001': '销售额',
        '10002': '1399.719970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1399.719970703125',
        '231102144451020': '技术',
        '231102144451025': '亳州'
      },
      {
        '10001': '销售额',
        '10002': '6666.912048339844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6666.912048339844',
        '231102144451020': '技术',
        '231102144451025': '仙居'
      },
      {
        '10001': '销售额',
        '10002': '201.60000610351562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '201.60000610351562',
        '231102144451020': '办公用品',
        '231102144451025': '仙居'
      },
      {
        '10001': '销售额',
        '10002': '3707.8719482421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3707.8719482421875',
        '231102144451020': '家具',
        '231102144451025': '仙桃'
      },
      {
        '10001': '销售额',
        '10002': '3952.5360412597656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3952.5360412597656',
        '231102144451020': '技术',
        '231102144451025': '仙桃'
      },
      {
        '10001': '销售额',
        '10002': '8939.755996704102',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8939.755996704102',
        '231102144451020': '办公用品',
        '231102144451025': '仙桃'
      },
      {
        '10001': '销售额',
        '10002': '4174.100067138672',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4174.100067138672',
        '231102144451020': '办公用品',
        '231102144451025': '仪征'
      },
      {
        '10001': '销售额',
        '10002': '2573.2559204101562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2573.2559204101562',
        '231102144451020': '家具',
        '231102144451025': '仪征'
      },
      {
        '10001': '销售额',
        '10002': '1819.27197265625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1819.27197265625',
        '231102144451020': '技术',
        '231102144451025': '仪征'
      },
      {
        '10001': '销售额',
        '10002': '1252.0199966430664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1252.0199966430664',
        '231102144451020': '办公用品',
        '231102144451025': '任丘'
      },
      {
        '10001': '销售额',
        '10002': '7557.760009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7557.760009765625',
        '231102144451020': '家具',
        '231102144451025': '任丘'
      },
      {
        '10001': '销售额',
        '10002': '3297.0001220703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3297.0001220703125',
        '231102144451020': '技术',
        '231102144451025': '任丘'
      },
      {
        '10001': '销售额',
        '10002': '103.04000091552734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '103.04000091552734',
        '231102144451020': '办公用品',
        '231102144451025': '余下'
      },
      {
        '10001': '销售额',
        '10002': '1003.4640121459961',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1003.4640121459961',
        '231102144451020': '办公用品',
        '231102144451025': '余姚'
      },
      {
        '10001': '销售额',
        '10002': '10502.01577758789',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10502.01577758789',
        '231102144451020': '家具',
        '231102144451025': '余姚'
      },
      {
        '10001': '销售额',
        '10002': '1116.3599853515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1116.3599853515625',
        '231102144451020': '技术',
        '231102144451025': '余姚'
      },
      {
        '10001': '销售额',
        '10002': '5664.456092834473',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5664.456092834473',
        '231102144451020': '办公用品',
        '231102144451025': '佛山'
      },
      {
        '10001': '销售额',
        '10002': '1302.5320129394531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1302.5320129394531',
        '231102144451020': '家具',
        '231102144451025': '佛山'
      },
      {
        '10001': '销售额',
        '10002': '533.4000244140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '533.4000244140625',
        '231102144451020': '技术',
        '231102144451025': '佛山'
      },
      {
        '10001': '销售额',
        '10002': '22753.35986328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '22753.35986328125',
        '231102144451020': '技术',
        '231102144451025': '佳木斯'
      },
      {
        '10001': '销售额',
        '10002': '17489.220153808594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17489.220153808594',
        '231102144451020': '家具',
        '231102144451025': '佳木斯'
      },
      {
        '10001': '销售额',
        '10002': '23020.759727478027',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23020.759727478027',
        '231102144451020': '办公用品',
        '231102144451025': '佳木斯'
      },
      {
        '10001': '销售额',
        '10002': '19240.619567871094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19240.619567871094',
        '231102144451020': '家具',
        '231102144451025': '依兰'
      },
      {
        '10001': '销售额',
        '10002': '7634.200119018555',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7634.200119018555',
        '231102144451020': '办公用品',
        '231102144451025': '依兰'
      },
      {
        '10001': '销售额',
        '10002': '13278.16015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13278.16015625',
        '231102144451020': '家具',
        '231102144451025': '保定'
      },
      {
        '10001': '销售额',
        '10002': '53412.799377441406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '53412.799377441406',
        '231102144451020': '办公用品',
        '231102144451025': '保定'
      },
      {
        '10001': '销售额',
        '10002': '57442.13977050781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '57442.13977050781',
        '231102144451020': '技术',
        '231102144451025': '保定'
      },
      {
        '10001': '销售额',
        '10002': '395.9200134277344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '395.9200134277344',
        '231102144451020': '家具',
        '231102144451025': '信宜'
      },
      {
        '10001': '销售额',
        '10002': '2002.9800415039062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2002.9800415039062',
        '231102144451020': '办公用品',
        '231102144451025': '信宜'
      },
      {
        '10001': '销售额',
        '10002': '2372.159912109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2372.159912109375',
        '231102144451020': '技术',
        '231102144451025': '信宜'
      },
      {
        '10001': '销售额',
        '10002': '7127.399787902832',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7127.399787902832',
        '231102144451020': '办公用品',
        '231102144451025': '信阳'
      },
      {
        '10001': '销售额',
        '10002': '16329.600341796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16329.600341796875',
        '231102144451020': '技术',
        '231102144451025': '信阳'
      },
      {
        '10001': '销售额',
        '10002': '15392.41195678711',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15392.41195678711',
        '231102144451020': '家具',
        '231102144451025': '信阳'
      },
      {
        '10001': '销售额',
        '10002': '5468.680076599121',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5468.680076599121',
        '231102144451020': '办公用品',
        '231102144451025': '兖州'
      },
      {
        '10001': '销售额',
        '10002': '12497.379943847656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12497.379943847656',
        '231102144451020': '家具',
        '231102144451025': '兖州'
      },
      {
        '10001': '销售额',
        '10002': '10682.140197753906',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10682.140197753906',
        '231102144451020': '技术',
        '231102144451025': '兖州'
      },
      {
        '10001': '销售额',
        '10002': '241.63999938964844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '241.63999938964844',
        '231102144451020': '办公用品',
        '231102144451025': '八步'
      },
      {
        '10001': '销售额',
        '10002': '2650.199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2650.199951171875',
        '231102144451020': '办公用品',
        '231102144451025': '八面通'
      },
      {
        '10001': '销售额',
        '10002': '8974.280029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8974.280029296875',
        '231102144451020': '家具',
        '231102144451025': '公主岭'
      },
      {
        '10001': '销售额',
        '10002': '7337.3997802734375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7337.3997802734375',
        '231102144451020': '技术',
        '231102144451025': '公主岭'
      },
      {
        '10001': '销售额',
        '10002': '4899.075969696045',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4899.075969696045',
        '231102144451020': '办公用品',
        '231102144451025': '公主岭'
      },
      {
        '10001': '销售额',
        '10002': '3042.4801025390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3042.4801025390625',
        '231102144451020': '家具',
        '231102144451025': '六合'
      },
      {
        '10001': '销售额',
        '10002': '2733.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2733.5',
        '231102144451020': '办公用品',
        '231102144451025': '六合'
      },
      {
        '10001': '销售额',
        '10002': '7861.224090576172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7861.224090576172',
        '231102144451020': '家具',
        '231102144451025': '兰州'
      },
      {
        '10001': '销售额',
        '10002': '24322.620040893555',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24322.620040893555',
        '231102144451020': '技术',
        '231102144451025': '兰州'
      },
      {
        '10001': '销售额',
        '10002': '10359.299909591675',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10359.299909591675',
        '231102144451020': '办公用品',
        '231102144451025': '兰州'
      },
      {
        '10001': '销售额',
        '10002': '1204.3919830322266',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1204.3919830322266',
        '231102144451020': '办公用品',
        '231102144451025': '兰溪'
      },
      {
        '10001': '销售额',
        '10002': '13964.63623046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13964.63623046875',
        '231102144451020': '家具',
        '231102144451025': '兰溪'
      },
      {
        '10001': '销售额',
        '10002': '9249.239807128906',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9249.239807128906',
        '231102144451020': '家具',
        '231102144451025': '兰西'
      },
      {
        '10001': '销售额',
        '10002': '1141',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1141',
        '231102144451020': '技术',
        '231102144451025': '兰西'
      },
      {
        '10001': '销售额',
        '10002': '10487.680252075195',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10487.680252075195',
        '231102144451020': '办公用品',
        '231102144451025': '兰西'
      },
      {
        '10001': '销售额',
        '10002': '2270.2679443359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2270.2679443359375',
        '231102144451020': '技术',
        '231102144451025': '兴化'
      },
      {
        '10001': '销售额',
        '10002': '4143.832004547119',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4143.832004547119',
        '231102144451020': '办公用品',
        '231102144451025': '兴化'
      },
      {
        '10001': '销售额',
        '10002': '1434.551986694336',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1434.551986694336',
        '231102144451020': '家具',
        '231102144451025': '兴化'
      },
      {
        '10001': '销售额',
        '10002': '3394.6080932617188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3394.6080932617188',
        '231102144451020': '技术',
        '231102144451025': '兴城'
      },
      {
        '10001': '销售额',
        '10002': '1376.927978515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1376.927978515625',
        '231102144451020': '家具',
        '231102144451025': '兴城'
      },
      {
        '10001': '销售额',
        '10002': '461.4960060119629',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '461.4960060119629',
        '231102144451020': '办公用品',
        '231102144451025': '兴城'
      },
      {
        '10001': '销售额',
        '10002': '7379.484130859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7379.484130859375',
        '231102144451020': '技术',
        '231102144451025': '内江'
      },
      {
        '10001': '销售额',
        '10002': '11764.479862213135',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11764.479862213135',
        '231102144451020': '办公用品',
        '231102144451025': '内江'
      },
      {
        '10001': '销售额',
        '10002': '24358.824005126953',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24358.824005126953',
        '231102144451020': '家具',
        '231102144451025': '内江'
      },
      {
        '10001': '销售额',
        '10002': '16371.1796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16371.1796875',
        '231102144451020': '家具',
        '231102144451025': '冷水江'
      },
      {
        '10001': '销售额',
        '10002': '4166.39990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4166.39990234375',
        '231102144451020': '技术',
        '231102144451025': '冷水江'
      },
      {
        '10001': '销售额',
        '10002': '812.6159973144531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '812.6159973144531',
        '231102144451020': '办公用品',
        '231102144451025': '冷水江'
      },
      {
        '10001': '销售额',
        '10002': '4608.93994140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4608.93994140625',
        '231102144451020': '技术',
        '231102144451025': '冷水滩'
      },
      {
        '10001': '销售额',
        '10002': '9866.47232055664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9866.47232055664',
        '231102144451020': '技术',
        '231102144451025': '凌源'
      },
      {
        '10001': '销售额',
        '10002': '1787.1000366210938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1787.1000366210938',
        '231102144451020': '家具',
        '231102144451025': '凌源'
      },
      {
        '10001': '销售额',
        '10002': '297.02399826049805',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '297.02399826049805',
        '231102144451020': '办公用品',
        '231102144451025': '凌源'
      },
      {
        '10001': '销售额',
        '10002': '6019.692092895508',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6019.692092895508',
        '231102144451020': '办公用品',
        '231102144451025': '凤城'
      },
      {
        '10001': '销售额',
        '10002': '7969.583923339844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7969.583923339844',
        '231102144451020': '技术',
        '231102144451025': '凤城'
      },
      {
        '10001': '销售额',
        '10002': '6999.887840270996',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6999.887840270996',
        '231102144451020': '家具',
        '231102144451025': '凤城'
      },
      {
        '10001': '销售额',
        '10002': '24.695999145507812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24.695999145507812',
        '231102144451020': '办公用品',
        '231102144451025': '利川'
      },
      {
        '10001': '销售额',
        '10002': '346.6400146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '346.6400146484375',
        '231102144451020': '办公用品',
        '231102144451025': '前郭'
      },
      {
        '10001': '销售额',
        '10002': '3557.1200561523438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3557.1200561523438',
        '231102144451020': '技术',
        '231102144451025': '前郭'
      },
      {
        '10001': '销售额',
        '10002': '1811.3199615478516',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1811.3199615478516',
        '231102144451020': '办公用品',
        '231102144451025': '剑光'
      },
      {
        '10001': '销售额',
        '10002': '400.9599914550781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '400.9599914550781',
        '231102144451020': '办公用品',
        '231102144451025': '加格达奇'
      },
      {
        '10001': '销售额',
        '10002': '1400.364013671875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1400.364013671875',
        '231102144451020': '家具',
        '231102144451025': '加格达奇'
      },
      {
        '10001': '销售额',
        '10002': '19541.4520111084',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19541.4520111084',
        '231102144451020': '家具',
        '231102144451025': '包头'
      },
      {
        '10001': '销售额',
        '10002': '18076.2964553833',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18076.2964553833',
        '231102144451020': '办公用品',
        '231102144451025': '包头'
      },
      {
        '10001': '销售额',
        '10002': '5599.776092529297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5599.776092529297',
        '231102144451020': '技术',
        '231102144451025': '包头'
      },
      {
        '10001': '销售额',
        '10002': '6072.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6072.5',
        '231102144451020': '技术',
        '231102144451025': '化州'
      },
      {
        '10001': '销售额',
        '10002': '1881.6839599609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1881.6839599609375',
        '231102144451020': '家具',
        '231102144451025': '化州'
      },
      {
        '10001': '销售额',
        '10002': '1124.7600059509277',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1124.7600059509277',
        '231102144451020': '办公用品',
        '231102144451025': '化州'
      },
      {
        '10001': '销售额',
        '10002': '105192.21940612793',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '105192.21940612793',
        '231102144451020': '技术',
        '231102144451025': '北京'
      },
      {
        '10001': '销售额',
        '10002': '124451.31977844238',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '124451.31977844238',
        '231102144451020': '办公用品',
        '231102144451025': '北京'
      },
      {
        '10001': '销售额',
        '10002': '147171.35977172852',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '147171.35977172852',
        '231102144451020': '家具',
        '231102144451025': '北京'
      },
      {
        '10001': '销售额',
        '10002': '160.02000045776367',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '160.02000045776367',
        '231102144451020': '办公用品',
        '231102144451025': '北海'
      },
      {
        '10001': '销售额',
        '10002': '365.6520080566406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '365.6520080566406',
        '231102144451020': '家具',
        '231102144451025': '北海'
      },
      {
        '10001': '销售额',
        '10002': '780.6400146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '780.6400146484375',
        '231102144451020': '办公用品',
        '231102144451025': '北碚'
      },
      {
        '10001': '销售额',
        '10002': '4557.4200439453125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4557.4200439453125',
        '231102144451020': '技术',
        '231102144451025': '北碚'
      },
      {
        '10001': '销售额',
        '10002': '7948.163879394531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7948.163879394531',
        '231102144451020': '办公用品',
        '231102144451025': '北票'
      },
      {
        '10001': '销售额',
        '10002': '5683.7198486328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5683.7198486328125',
        '231102144451020': '技术',
        '231102144451025': '十字路'
      },
      {
        '10001': '销售额',
        '10002': '734.1600036621094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '734.1600036621094',
        '231102144451020': '办公用品',
        '231102144451025': '十字路'
      },
      {
        '10001': '销售额',
        '10002': '2935.744083404541',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2935.744083404541',
        '231102144451020': '办公用品',
        '231102144451025': '南京'
      },
      {
        '10001': '销售额',
        '10002': '5364.324005126953',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5364.324005126953',
        '231102144451020': '家具',
        '231102144451025': '南京'
      },
      {
        '10001': '销售额',
        '10002': '1957.9560165405273',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1957.9560165405273',
        '231102144451020': '办公用品',
        '231102144451025': '南充'
      },
      {
        '10001': '销售额',
        '10002': '8630.915878295898',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8630.915878295898',
        '231102144451020': '家具',
        '231102144451025': '南充'
      },
      {
        '10001': '销售额',
        '10002': '13208.411926269531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13208.411926269531',
        '231102144451020': '技术',
        '231102144451025': '南充'
      },
      {
        '10001': '销售额',
        '10002': '90.21600341796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '90.21600341796875',
        '231102144451020': '办公用品',
        '231102144451025': '南台'
      },
      {
        '10001': '销售额',
        '10002': '5749.632141113281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5749.632141113281',
        '231102144451020': '技术',
        '231102144451025': '南台'
      },
      {
        '10001': '销售额',
        '10002': '50714.76112365723',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '50714.76112365723',
        '231102144451020': '家具',
        '231102144451025': '南宁'
      },
      {
        '10001': '销售额',
        '10002': '32285.95945739746',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '32285.95945739746',
        '231102144451020': '技术',
        '231102144451025': '南宁'
      },
      {
        '10001': '销售额',
        '10002': '35153.356174468994',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '35153.356174468994',
        '231102144451020': '办公用品',
        '231102144451025': '南宁'
      },
      {
        '10001': '销售额',
        '10002': '14286.4404296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14286.4404296875',
        '231102144451020': '家具',
        '231102144451025': '南宫'
      },
      {
        '10001': '销售额',
        '10002': '439.0400085449219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '439.0400085449219',
        '231102144451020': '办公用品',
        '231102144451025': '南宫'
      },
      {
        '10001': '销售额',
        '10002': '449.9599914550781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '449.9599914550781',
        '231102144451020': '家具',
        '231102144451025': '南岔'
      },
      {
        '10001': '销售额',
        '10002': '23552.20046234131',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23552.20046234131',
        '231102144451020': '办公用品',
        '231102144451025': '南岔'
      },
      {
        '10001': '销售额',
        '10002': '1482.6000213623047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1482.6000213623047',
        '231102144451020': '办公用品',
        '231102144451025': '南平'
      },
      {
        '10001': '销售额',
        '10002': '1019.760009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1019.760009765625',
        '231102144451020': '技术',
        '231102144451025': '南平'
      },
      {
        '10001': '销售额',
        '10002': '8763.860168457031',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8763.860168457031',
        '231102144451020': '家具',
        '231102144451025': '南平'
      },
      {
        '10001': '销售额',
        '10002': '14462.280002593994',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14462.280002593994',
        '231102144451020': '办公用品',
        '231102144451025': '南昌'
      },
      {
        '10001': '销售额',
        '10002': '17365.739868164062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17365.739868164062',
        '231102144451020': '家具',
        '231102144451025': '南昌'
      },
      {
        '10001': '销售额',
        '10002': '14362.600189208984',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14362.600189208984',
        '231102144451020': '技术',
        '231102144451025': '南昌'
      },
      {
        '10001': '销售额',
        '10002': '1039.0799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1039.0799560546875',
        '231102144451020': '技术',
        '231102144451025': '南洲'
      },
      {
        '10001': '销售额',
        '10002': '72.23999786376953',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '72.23999786376953',
        '231102144451020': '办公用品',
        '231102144451025': '南洲'
      },
      {
        '10001': '销售额',
        '10002': '12017.880493164062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12017.880493164062',
        '231102144451020': '技术',
        '231102144451025': '南渡'
      },
      {
        '10001': '销售额',
        '10002': '11789.680252075195',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11789.680252075195',
        '231102144451020': '办公用品',
        '231102144451025': '南渡'
      },
      {
        '10001': '销售额',
        '10002': '2412.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2412.47998046875',
        '231102144451020': '技术',
        '231102144451025': '南票'
      },
      {
        '10001': '销售额',
        '10002': '647.3879699707031',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '647.3879699707031',
        '231102144451020': '办公用品',
        '231102144451025': '南票'
      },
      {
        '10001': '销售额',
        '10002': '6175.3438720703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6175.3438720703125',
        '231102144451020': '技术',
        '231102144451025': '南通'
      },
      {
        '10001': '销售额',
        '10002': '2969.679931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2969.679931640625',
        '231102144451020': '家具',
        '231102144451025': '南通'
      },
      {
        '10001': '销售额',
        '10002': '17413.480056762695',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17413.480056762695',
        '231102144451020': '办公用品',
        '231102144451025': '南通'
      },
      {
        '10001': '销售额',
        '10002': '21914.900314331055',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21914.900314331055',
        '231102144451020': '办公用品',
        '231102144451025': '南阳'
      },
      {
        '10001': '销售额',
        '10002': '24146.780029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24146.780029296875',
        '231102144451020': '技术',
        '231102144451025': '南阳'
      },
      {
        '10001': '销售额',
        '10002': '16042.866149902344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16042.866149902344',
        '231102144451020': '家具',
        '231102144451025': '南阳'
      },
      {
        '10001': '销售额',
        '10002': '546',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '546',
        '231102144451020': '办公用品',
        '231102144451025': '南隆'
      },
      {
        '10001': '销售额',
        '10002': '2372.159912109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2372.159912109375',
        '231102144451020': '家具',
        '231102144451025': '南麻'
      },
      {
        '10001': '销售额',
        '10002': '3568.3199462890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3568.3199462890625',
        '231102144451020': '办公用品',
        '231102144451025': '南麻'
      },
      {
        '10001': '销售额',
        '10002': '9413.87973022461',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9413.87973022461',
        '231102144451020': '技术',
        '231102144451025': '即墨'
      },
      {
        '10001': '销售额',
        '10002': '1038.7999801635742',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1038.7999801635742',
        '231102144451020': '办公用品',
        '231102144451025': '即墨'
      },
      {
        '10001': '销售额',
        '10002': '3798.899871826172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3798.899871826172',
        '231102144451020': '家具',
        '231102144451025': '即墨'
      },
      {
        '10001': '销售额',
        '10002': '97.57999801635742',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '97.57999801635742',
        '231102144451020': '办公用品',
        '231102144451025': '原平'
      },
      {
        '10001': '销售额',
        '10002': '48376.29916381836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '48376.29916381836',
        '231102144451020': '技术',
        '231102144451025': '厦门'
      },
      {
        '10001': '销售额',
        '10002': '33793.62034988403',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '33793.62034988403',
        '231102144451020': '办公用品',
        '231102144451025': '厦门'
      },
      {
        '10001': '销售额',
        '10002': '62632.0234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '62632.0234375',
        '231102144451020': '家具',
        '231102144451025': '厦门'
      },
      {
        '10001': '销售额',
        '10002': '9571.7998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9571.7998046875',
        '231102144451020': '家具',
        '231102144451025': '友好'
      },
      {
        '10001': '销售额',
        '10002': '784.8400268554688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '784.8400268554688',
        '231102144451020': '技术',
        '231102144451025': '双城'
      },
      {
        '10001': '销售额',
        '10002': '2416.9599609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2416.9599609375',
        '231102144451020': '技术',
        '231102144451025': '双阳'
      },
      {
        '10001': '销售额',
        '10002': '2369.6399993896484',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2369.6399993896484',
        '231102144451020': '办公用品',
        '231102144451025': '双阳'
      },
      {
        '10001': '销售额',
        '10002': '3452.4000244140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3452.4000244140625',
        '231102144451020': '技术',
        '231102144451025': '双鸭山'
      },
      {
        '10001': '销售额',
        '10002': '6347.0399169921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6347.0399169921875',
        '231102144451020': '家具',
        '231102144451025': '双鸭山'
      },
      {
        '10001': '销售额',
        '10002': '3596.3199615478516',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3596.3199615478516',
        '231102144451020': '办公用品',
        '231102144451025': '双鸭山'
      },
      {
        '10001': '销售额',
        '10002': '2156.419921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2156.419921875',
        '231102144451020': '技术',
        '231102144451025': '台城'
      },
      {
        '10001': '销售额',
        '10002': '1385.02001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1385.02001953125',
        '231102144451020': '办公用品',
        '231102144451025': '台城'
      },
      {
        '10001': '销售额',
        '10002': '503.02001571655273',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '503.02001571655273',
        '231102144451020': '办公用品',
        '231102144451025': '叶柏寿'
      },
      {
        '10001': '销售额',
        '10002': '696.6959838867188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '696.6959838867188',
        '231102144451020': '技术',
        '231102144451025': '叶柏寿'
      },
      {
        '10001': '销售额',
        '10002': '23741.115509033203',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23741.115509033203',
        '231102144451020': '技术',
        '231102144451025': '合川'
      },
      {
        '10001': '销售额',
        '10002': '7677.460113525391',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7677.460113525391',
        '231102144451020': '办公用品',
        '231102144451025': '合川'
      },
      {
        '10001': '销售额',
        '10002': '3328.5000610351562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3328.5000610351562',
        '231102144451020': '家具',
        '231102144451025': '合川'
      },
      {
        '10001': '销售额',
        '10002': '6786.864196777344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6786.864196777344',
        '231102144451020': '技术',
        '231102144451025': '合德'
      },
      {
        '10001': '销售额',
        '10002': '2753.7720947265625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2753.7720947265625',
        '231102144451020': '家具',
        '231102144451025': '合德'
      },
      {
        '10001': '销售额',
        '10002': '5175.743804931641',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5175.743804931641',
        '231102144451020': '办公用品',
        '231102144451025': '合德'
      },
      {
        '10001': '销售额',
        '10002': '54454.54016113281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '54454.54016113281',
        '231102144451020': '技术',
        '231102144451025': '合肥'
      },
      {
        '10001': '销售额',
        '10002': '11229.568008422852',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11229.568008422852',
        '231102144451020': '办公用品',
        '231102144451025': '合肥'
      },
      {
        '10001': '销售额',
        '10002': '16736.440368652344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16736.440368652344',
        '231102144451020': '家具',
        '231102144451025': '合肥'
      },
      {
        '10001': '销售额',
        '10002': '14108.044982910156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14108.044982910156',
        '231102144451020': '家具',
        '231102144451025': '吉林市'
      },
      {
        '10001': '销售额',
        '10002': '24469.199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24469.199951171875',
        '231102144451020': '技术',
        '231102144451025': '吉林市'
      },
      {
        '10001': '销售额',
        '10002': '7920.583984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7920.583984375',
        '231102144451020': '办公用品',
        '231102144451025': '吉林市'
      },
      {
        '10001': '销售额',
        '10002': '88.33999633789062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '88.33999633789062',
        '231102144451020': '家具',
        '231102144451025': '吉舒'
      },
      {
        '10001': '销售额',
        '10002': '1921.1220092773438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1921.1220092773438',
        '231102144451020': '家具',
        '231102144451025': '吉首'
      },
      {
        '10001': '销售额',
        '10002': '1149.1200256347656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1149.1200256347656',
        '231102144451020': '办公用品',
        '231102144451025': '吉首'
      },
      {
        '10001': '销售额',
        '10002': '5937.39990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5937.39990234375',
        '231102144451020': '技术',
        '231102144451025': '吉首'
      },
      {
        '10001': '销售额',
        '10002': '11441.135986328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11441.135986328125',
        '231102144451020': '家具',
        '231102144451025': '启东'
      },
      {
        '10001': '销售额',
        '10002': '5295.8638916015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5295.8638916015625',
        '231102144451020': '技术',
        '231102144451025': '启东'
      },
      {
        '10001': '销售额',
        '10002': '5285.671951293945',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5285.671951293945',
        '231102144451020': '办公用品',
        '231102144451025': '启东'
      },
      {
        '10001': '销售额',
        '10002': '1935.024055480957',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1935.024055480957',
        '231102144451020': '办公用品',
        '231102144451025': '吴川'
      },
      {
        '10001': '销售额',
        '10002': '7060.620178222656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7060.620178222656',
        '231102144451020': '技术',
        '231102144451025': '吴川'
      },
      {
        '10001': '销售额',
        '10002': '14314.72006225586',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14314.72006225586',
        '231102144451020': '技术',
        '231102144451025': '周口'
      },
      {
        '10001': '销售额',
        '10002': '3685.416046142578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3685.416046142578',
        '231102144451020': '办公用品',
        '231102144451025': '周口'
      },
      {
        '10001': '销售额',
        '10002': '26941.305786132812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '26941.305786132812',
        '231102144451020': '家具',
        '231102144451025': '周口'
      },
      {
        '10001': '销售额',
        '10002': '1769.0400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1769.0400390625',
        '231102144451020': '技术',
        '231102144451025': '周村'
      },
      {
        '10001': '销售额',
        '10002': '6244.139923095703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6244.139923095703',
        '231102144451020': '办公用品',
        '231102144451025': '周村'
      },
      {
        '10001': '销售额',
        '10002': '2399.8798828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2399.8798828125',
        '231102144451020': '家具',
        '231102144451025': '周村'
      },
      {
        '10001': '销售额',
        '10002': '6661.480163574219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6661.480163574219',
        '231102144451020': '家具',
        '231102144451025': '呼兰'
      },
      {
        '10001': '销售额',
        '10002': '2533.1600341796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2533.1600341796875',
        '231102144451020': '办公用品',
        '231102144451025': '呼兰'
      },
      {
        '10001': '销售额',
        '10002': '9554.999877929688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9554.999877929688',
        '231102144451020': '技术',
        '231102144451025': '呼兰'
      },
      {
        '10001': '销售额',
        '10002': '11437.607940673828',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11437.607940673828',
        '231102144451020': '家具',
        '231102144451025': '呼和浩特'
      },
      {
        '10001': '销售额',
        '10002': '1604.8200073242188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1604.8200073242188',
        '231102144451020': '技术',
        '231102144451025': '呼和浩特'
      },
      {
        '10001': '销售额',
        '10002': '14713.831783294678',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14713.831783294678',
        '231102144451020': '办公用品',
        '231102144451025': '呼和浩特'
      },
      {
        '10001': '销售额',
        '10002': '44.52000045776367',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '44.52000045776367',
        '231102144451020': '办公用品',
        '231102144451025': '和田'
      },
      {
        '10001': '销售额',
        '10002': '2105.907958984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2105.907958984375',
        '231102144451020': '家具',
        '231102144451025': '和田'
      },
      {
        '10001': '销售额',
        '10002': '4085.760009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4085.760009765625',
        '231102144451020': '技术',
        '231102144451025': '和田'
      },
      {
        '10001': '销售额',
        '10002': '274.4000015258789',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '274.4000015258789',
        '231102144451020': '办公用品',
        '231102144451025': '和龙'
      },
      {
        '10001': '销售额',
        '10002': '2234.39990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2234.39990234375',
        '231102144451020': '技术',
        '231102144451025': '和龙'
      },
      {
        '10001': '销售额',
        '10002': '494.7880172729492',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '494.7880172729492',
        '231102144451020': '办公用品',
        '231102144451025': '咸宁'
      },
      {
        '10001': '销售额',
        '10002': '3146.387939453125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3146.387939453125',
        '231102144451020': '技术',
        '231102144451025': '咸宁'
      },
      {
        '10001': '销售额',
        '10002': '3289.4400634765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3289.4400634765625',
        '231102144451020': '家具',
        '231102144451025': '咸水沽'
      },
      {
        '10001': '销售额',
        '10002': '5980.10009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5980.10009765625',
        '231102144451020': '技术',
        '231102144451025': '咸水沽'
      },
      {
        '10001': '销售额',
        '10002': '4713.2401123046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4713.2401123046875',
        '231102144451020': '技术',
        '231102144451025': '咸阳'
      },
      {
        '10001': '销售额',
        '10002': '28899.22088623047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '28899.22088623047',
        '231102144451020': '办公用品',
        '231102144451025': '咸阳'
      },
      {
        '10001': '销售额',
        '10002': '15109.219848632812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15109.219848632812',
        '231102144451020': '家具',
        '231102144451025': '咸阳'
      },
      {
        '10001': '销售额',
        '10002': '70975.24002075195',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '70975.24002075195',
        '231102144451020': '技术',
        '231102144451025': '哈尔滨'
      },
      {
        '10001': '销售额',
        '10002': '70434.616355896',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '70434.616355896',
        '231102144451020': '办公用品',
        '231102144451025': '哈尔滨'
      },
      {
        '10001': '销售额',
        '10002': '64278.37466430664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '64278.37466430664',
        '231102144451020': '家具',
        '231102144451025': '哈尔滨'
      },
      {
        '10001': '销售额',
        '10002': '10473.15512084961',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10473.15512084961',
        '231102144451020': '家具',
        '231102144451025': '唐家庄'
      },
      {
        '10001': '销售额',
        '10002': '1871.52001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1871.52001953125',
        '231102144451020': '家具',
        '231102144451025': '唐寨'
      },
      {
        '10001': '销售额',
        '10002': '423.9200134277344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '423.9200134277344',
        '231102144451020': '技术',
        '231102144451025': '唐寨'
      },
      {
        '10001': '销售额',
        '10002': '2689.820068359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2689.820068359375',
        '231102144451020': '办公用品',
        '231102144451025': '唐寨'
      },
      {
        '10001': '销售额',
        '10002': '43192.51963806152',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '43192.51963806152',
        '231102144451020': '技术',
        '231102144451025': '唐山'
      },
      {
        '10001': '销售额',
        '10002': '36953.28025054932',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '36953.28025054932',
        '231102144451020': '办公用品',
        '231102144451025': '唐山'
      },
      {
        '10001': '销售额',
        '10002': '14756.139923095703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14756.139923095703',
        '231102144451020': '家具',
        '231102144451025': '唐山'
      },
      {
        '10001': '销售额',
        '10002': '700.4480094909668',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '700.4480094909668',
        '231102144451020': '办公用品',
        '231102144451025': '唐河'
      },
      {
        '10001': '销售额',
        '10002': '1064.447998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1064.447998046875',
        '231102144451020': '家具',
        '231102144451025': '唐河'
      },
      {
        '10001': '销售额',
        '10002': '11209.275024414062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11209.275024414062',
        '231102144451020': '家具',
        '231102144451025': '商丘'
      },
      {
        '10001': '销售额',
        '10002': '6572.300109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6572.300109863281',
        '231102144451020': '技术',
        '231102144451025': '商丘'
      },
      {
        '10001': '销售额',
        '10002': '18886.69984436035',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18886.69984436035',
        '231102144451020': '办公用品',
        '231102144451025': '商丘'
      },
      {
        '10001': '销售额',
        '10002': '8240.931898117065',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8240.931898117065',
        '231102144451020': '办公用品',
        '231102144451025': '嘉兴'
      },
      {
        '10001': '销售额',
        '10002': '2854.0679931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2854.0679931640625',
        '231102144451020': '技术',
        '231102144451025': '嘉兴'
      },
      {
        '10001': '销售额',
        '10002': '13817.411865234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13817.411865234375',
        '231102144451020': '家具',
        '231102144451025': '嘉兴'
      },
      {
        '10001': '销售额',
        '10002': '1051.0919799804688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1051.0919799804688',
        '231102144451020': '家具',
        '231102144451025': '嘉善'
      },
      {
        '10001': '销售额',
        '10002': '659.9879989624023',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '659.9879989624023',
        '231102144451020': '办公用品',
        '231102144451025': '嘉善'
      },
      {
        '10001': '销售额',
        '10002': '3732.035934448242',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3732.035934448242',
        '231102144451020': '办公用品',
        '231102144451025': '嘉峪关'
      },
      {
        '10001': '销售额',
        '10002': '3787.476043701172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3787.476043701172',
        '231102144451020': '技术',
        '231102144451025': '嘉峪关'
      },
      {
        '10001': '销售额',
        '10002': '12687.415771484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12687.415771484375',
        '231102144451020': '家具',
        '231102144451025': '嘉峪关'
      },
      {
        '10001': '销售额',
        '10002': '7926.939788818359',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7926.939788818359',
        '231102144451020': '技术',
        '231102144451025': '四平'
      },
      {
        '10001': '销售额',
        '10002': '7107.65998840332',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7107.65998840332',
        '231102144451020': '办公用品',
        '231102144451025': '四平'
      },
      {
        '10001': '销售额',
        '10002': '13675.620056152344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13675.620056152344',
        '231102144451020': '家具',
        '231102144451025': '四平'
      },
      {
        '10001': '销售额',
        '10002': '1393.4200134277344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1393.4200134277344',
        '231102144451020': '家具',
        '231102144451025': '图们'
      },
      {
        '10001': '销售额',
        '10002': '461.1600036621094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '461.1600036621094',
        '231102144451020': '办公用品',
        '231102144451025': '图们'
      },
      {
        '10001': '销售额',
        '10002': '6078.10009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6078.10009765625',
        '231102144451020': '技术',
        '231102144451025': '图们'
      },
      {
        '10001': '销售额',
        '10002': '791.8400039672852',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '791.8400039672852',
        '231102144451020': '办公用品',
        '231102144451025': '坪山'
      },
      {
        '10001': '销售额',
        '10002': '1923.3900146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1923.3900146484375',
        '231102144451020': '家具',
        '231102144451025': '坪山'
      },
      {
        '10001': '销售额',
        '10002': '8027.040054321289',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8027.040054321289',
        '231102144451020': '办公用品',
        '231102144451025': '埠河'
      },
      {
        '10001': '销售额',
        '10002': '3341.1839599609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3341.1839599609375',
        '231102144451020': '技术',
        '231102144451025': '埠河'
      },
      {
        '10001': '销售额',
        '10002': '724.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '724.5',
        '231102144451020': '家具',
        '231102144451025': '塔河'
      },
      {
        '10001': '销售额',
        '10002': '2094.456024169922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2094.456024169922',
        '231102144451020': '办公用品',
        '231102144451025': '塘坪'
      },
      {
        '10001': '销售额',
        '10002': '5390.280029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5390.280029296875',
        '231102144451020': '技术',
        '231102144451025': '塘坪'
      },
      {
        '10001': '销售额',
        '10002': '242.1999969482422',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '242.1999969482422',
        '231102144451020': '家具',
        '231102144451025': '塘坪'
      },
      {
        '10001': '销售额',
        '10002': '6986.699981689453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6986.699981689453',
        '231102144451020': '办公用品',
        '231102144451025': '塘沽'
      },
      {
        '10001': '销售额',
        '10002': '20728.260009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20728.260009765625',
        '231102144451020': '技术',
        '231102144451025': '塘沽'
      },
      {
        '10001': '销售额',
        '10002': '17545.49984741211',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17545.49984741211',
        '231102144451020': '家具',
        '231102144451025': '塘沽'
      },
      {
        '10001': '销售额',
        '10002': '2257.080078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2257.080078125',
        '231102144451020': '家具',
        '231102144451025': '夏镇'
      },
      {
        '10001': '销售额',
        '10002': '2013.4800109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2013.4800109863281',
        '231102144451020': '办公用品',
        '231102144451025': '夏镇'
      },
      {
        '10001': '销售额',
        '10002': '319.7879943847656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '319.7879943847656',
        '231102144451020': '办公用品',
        '231102144451025': '大冶'
      },
      {
        '10001': '销售额',
        '10002': '44855.16051483154',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '44855.16051483154',
        '231102144451020': '办公用品',
        '231102144451025': '大同'
      },
      {
        '10001': '销售额',
        '10002': '38091.89956665039',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '38091.89956665039',
        '231102144451020': '技术',
        '231102144451025': '大同'
      },
      {
        '10001': '销售额',
        '10002': '50309.349548339844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '50309.349548339844',
        '231102144451020': '家具',
        '231102144451025': '大同'
      },
      {
        '10001': '销售额',
        '10002': '21811.510314941406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21811.510314941406',
        '231102144451020': '家具',
        '231102144451025': '大庆'
      },
      {
        '10001': '销售额',
        '10002': '17872.540382385254',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17872.540382385254',
        '231102144451020': '办公用品',
        '231102144451025': '大庆'
      },
      {
        '10001': '销售额',
        '10002': '18661.720458984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18661.720458984375',
        '231102144451020': '技术',
        '231102144451025': '大庆'
      },
      {
        '10001': '销售额',
        '10002': '1194.4800186157227',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1194.4800186157227',
        '231102144451020': '办公用品',
        '231102144451025': '大理'
      },
      {
        '10001': '销售额',
        '10002': '2058.8400268554688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2058.8400268554688',
        '231102144451020': '技术',
        '231102144451025': '大理'
      },
      {
        '10001': '销售额',
        '10002': '23211.299896240234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23211.299896240234',
        '231102144451020': '技术',
        '231102144451025': '大连'
      },
      {
        '10001': '销售额',
        '10002': '36756.94369506836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '36756.94369506836',
        '231102144451020': '家具',
        '231102144451025': '大连'
      },
      {
        '10001': '销售额',
        '10002': '34417.45941448212',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '34417.45941448212',
        '231102144451020': '办公用品',
        '231102144451025': '大连'
      },
      {
        '10001': '销售额',
        '10002': '2326.6880493164062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2326.6880493164062',
        '231102144451020': '办公用品',
        '231102144451025': '大连湾'
      },
      {
        '10001': '销售额',
        '10002': '932.9039916992188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '932.9039916992188',
        '231102144451020': '家具',
        '231102144451025': '大连湾'
      },
      {
        '10001': '销售额',
        '10002': '183314.87915039062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '183314.87915039062',
        '231102144451020': '技术',
        '231102144451025': '天津'
      },
      {
        '10001': '销售额',
        '10002': '153733.6486968994',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '153733.6486968994',
        '231102144451020': '家具',
        '231102144451025': '天津'
      },
      {
        '10001': '销售额',
        '10002': '134134.9806137085',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '134134.9806137085',
        '231102144451020': '办公用品',
        '231102144451025': '天津'
      },
      {
        '10001': '销售额',
        '10002': '16180.220230102539',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16180.220230102539',
        '231102144451020': '办公用品',
        '231102144451025': '天长'
      },
      {
        '10001': '销售额',
        '10002': '6432.369873046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6432.369873046875',
        '231102144451020': '家具',
        '231102144451025': '天长'
      },
      {
        '10001': '销售额',
        '10002': '43054.90036010742',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '43054.90036010742',
        '231102144451020': '技术',
        '231102144451025': '太原'
      },
      {
        '10001': '销售额',
        '10002': '58390.219818115234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '58390.219818115234',
        '231102144451020': '家具',
        '231102144451025': '太原'
      },
      {
        '10001': '销售额',
        '10002': '69597.5001449585',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '69597.5001449585',
        '231102144451020': '办公用品',
        '231102144451025': '太原'
      },
      {
        '10001': '销售额',
        '10002': '8361.919910430908',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8361.919910430908',
        '231102144451020': '办公用品',
        '231102144451025': '姜堰'
      },
      {
        '10001': '销售额',
        '10002': '2059.260009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2059.260009765625',
        '231102144451020': '家具',
        '231102144451025': '威宁'
      },
      {
        '10001': '销售额',
        '10002': '4457.1800537109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4457.1800537109375',
        '231102144451020': '办公用品',
        '231102144451025': '威宁'
      },
      {
        '10001': '销售额',
        '10002': '2567.8799896240234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2567.8799896240234',
        '231102144451020': '办公用品',
        '231102144451025': '威海'
      },
      {
        '10001': '销售额',
        '10002': '2855.43994140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2855.43994140625',
        '231102144451020': '家具',
        '231102144451025': '威海'
      },
      {
        '10001': '销售额',
        '10002': '10661.000183105469',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10661.000183105469',
        '231102144451020': '技术',
        '231102144451025': '威海'
      },
      {
        '10001': '销售额',
        '10002': '1836.2399978637695',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1836.2399978637695',
        '231102144451020': '办公用品',
        '231102144451025': '娄底'
      },
      {
        '10001': '销售额',
        '10002': '701.5399780273438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '701.5399780273438',
        '231102144451020': '家具',
        '231102144451025': '娄底'
      },
      {
        '10001': '销售额',
        '10002': '253.26000595092773',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '253.26000595092773',
        '231102144451020': '办公用品',
        '231102144451025': '嫩江'
      },
      {
        '10001': '销售额',
        '10002': '4205.6279296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4205.6279296875',
        '231102144451020': '技术',
        '231102144451025': '孝感'
      },
      {
        '10001': '销售额',
        '10002': '13923.224086761475',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13923.224086761475',
        '231102144451020': '办公用品',
        '231102144451025': '孝感'
      },
      {
        '10001': '销售额',
        '10002': '523.4039916992188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '523.4039916992188',
        '231102144451020': '家具',
        '231102144451025': '孝感'
      },
      {
        '10001': '销售额',
        '10002': '9877.308044433594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9877.308044433594',
        '231102144451020': '技术',
        '231102144451025': '宁波'
      },
      {
        '10001': '销售额',
        '10002': '10146.751739501953',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10146.751739501953',
        '231102144451020': '家具',
        '231102144451025': '宁波'
      },
      {
        '10001': '销售额',
        '10002': '11015.899898529053',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11015.899898529053',
        '231102144451020': '办公用品',
        '231102144451025': '宁波'
      },
      {
        '10001': '销售额',
        '10002': '10117.212036132812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10117.212036132812',
        '231102144451020': '技术',
        '231102144451025': '宁海'
      },
      {
        '10001': '销售额',
        '10002': '6841.8282470703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6841.8282470703125',
        '231102144451020': '家具',
        '231102144451025': '宁海'
      },
      {
        '10001': '销售额',
        '10002': '29049.86032485962',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '29049.86032485962',
        '231102144451020': '办公用品',
        '231102144451025': '宁海'
      },
      {
        '10001': '销售额',
        '10002': '1680.699951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1680.699951171875',
        '231102144451020': '家具',
        '231102144451025': '宁阳'
      },
      {
        '10001': '销售额',
        '10002': '382.4800109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '382.4800109863281',
        '231102144451020': '办公用品',
        '231102144451025': '宁阳'
      },
      {
        '10001': '销售额',
        '10002': '382.4800109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '382.4800109863281',
        '231102144451020': '家具',
        '231102144451025': '安丘'
      },
      {
        '10001': '销售额',
        '10002': '796.8800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '796.8800048828125',
        '231102144451020': '技术',
        '231102144451025': '安丘'
      },
      {
        '10001': '销售额',
        '10002': '1221.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1221.5',
        '231102144451020': '办公用品',
        '231102144451025': '安丘'
      },
      {
        '10001': '销售额',
        '10002': '3861.199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3861.199951171875',
        '231102144451020': '技术',
        '231102144451025': '安埠'
      },
      {
        '10001': '销售额',
        '10002': '282.79998779296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '282.79998779296875',
        '231102144451020': '办公用品',
        '231102144451025': '安埠'
      },
      {
        '10001': '销售额',
        '10002': '7163.9400634765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7163.9400634765625',
        '231102144451020': '家具',
        '231102144451025': '安庆'
      },
      {
        '10001': '销售额',
        '10002': '2043.1599731445312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2043.1599731445312',
        '231102144451020': '技术',
        '231102144451025': '安庆'
      },
      {
        '10001': '销售额',
        '10002': '1032.1920166015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1032.1920166015625',
        '231102144451020': '办公用品',
        '231102144451025': '安庆'
      },
      {
        '10001': '销售额',
        '10002': '95.76000213623047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '95.76000213623047',
        '231102144451020': '办公用品',
        '231102144451025': '安康'
      },
      {
        '10001': '销售额',
        '10002': '1938.1879577636719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1938.1879577636719',
        '231102144451020': '办公用品',
        '231102144451025': '安达'
      },
      {
        '10001': '销售额',
        '10002': '17150.560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17150.560546875',
        '231102144451020': '家具',
        '231102144451025': '安达'
      },
      {
        '10001': '销售额',
        '10002': '10616.339965820312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10616.339965820312',
        '231102144451020': '技术',
        '231102144451025': '安达'
      },
      {
        '10001': '销售额',
        '10002': '15280.720031738281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15280.720031738281',
        '231102144451020': '技术',
        '231102144451025': '安阳'
      },
      {
        '10001': '销售额',
        '10002': '5445.160003662109',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5445.160003662109',
        '231102144451020': '办公用品',
        '231102144451025': '安阳'
      },
      {
        '10001': '销售额',
        '10002': '17594.444122314453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17594.444122314453',
        '231102144451020': '家具',
        '231102144451025': '安阳'
      },
      {
        '10001': '销售额',
        '10002': '2614.360107421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2614.360107421875',
        '231102144451020': '技术',
        '231102144451025': '安顺'
      },
      {
        '10001': '销售额',
        '10002': '5085.500091552734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5085.500091552734',
        '231102144451020': '家具',
        '231102144451025': '安顺'
      },
      {
        '10001': '销售额',
        '10002': '4597.040023803711',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4597.040023803711',
        '231102144451020': '办公用品',
        '231102144451025': '安顺'
      },
      {
        '10001': '销售额',
        '10002': '8742.300216674805',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8742.300216674805',
        '231102144451020': '办公用品',
        '231102144451025': '定州'
      },
      {
        '10001': '销售额',
        '10002': '1735.02001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1735.02001953125',
        '231102144451020': '技术',
        '231102144451025': '定州'
      },
      {
        '10001': '销售额',
        '10002': '2372.159912109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2372.159912109375',
        '231102144451020': '技术',
        '231102144451025': '定陶'
      },
      {
        '10001': '销售额',
        '10002': '2255.679958343506',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2255.679958343506',
        '231102144451020': '办公用品',
        '231102144451025': '定陶'
      },
      {
        '10001': '销售额',
        '10002': '3101.783935546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3101.783935546875',
        '231102144451020': '家具',
        '231102144451025': '宜城'
      },
      {
        '10001': '销售额',
        '10002': '3785.711944580078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3785.711944580078',
        '231102144451020': '技术',
        '231102144451025': '宜城'
      },
      {
        '10001': '销售额',
        '10002': '2695.447967529297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2695.447967529297',
        '231102144451020': '办公用品',
        '231102144451025': '宜城'
      },
      {
        '10001': '销售额',
        '10002': '9462.180221557617',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9462.180221557617',
        '231102144451020': '办公用品',
        '231102144451025': '宜宾'
      },
      {
        '10001': '销售额',
        '10002': '9043.524169921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9043.524169921875',
        '231102144451020': '家具',
        '231102144451025': '宜宾'
      },
      {
        '10001': '销售额',
        '10002': '5498.723937988281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5498.723937988281',
        '231102144451020': '技术',
        '231102144451025': '宜宾'
      },
      {
        '10001': '销售额',
        '10002': '18180.53985595703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18180.53985595703',
        '231102144451020': '技术',
        '231102144451025': '宜昌'
      },
      {
        '10001': '销售额',
        '10002': '11304.719848632812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11304.719848632812',
        '231102144451020': '家具',
        '231102144451025': '宜昌'
      },
      {
        '10001': '销售额',
        '10002': '5435.332082748413',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5435.332082748413',
        '231102144451020': '办公用品',
        '231102144451025': '宜昌'
      },
      {
        '10001': '销售额',
        '10002': '23975.56024169922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23975.56024169922',
        '231102144451020': '技术',
        '231102144451025': '宜春'
      },
      {
        '10001': '销售额',
        '10002': '38362.80049133301',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '38362.80049133301',
        '231102144451020': '家具',
        '231102144451025': '宜春'
      },
      {
        '10001': '销售额',
        '10002': '53449.92762756348',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '53449.92762756348',
        '231102144451020': '办公用品',
        '231102144451025': '宜春'
      },
      {
        '10001': '销售额',
        '10002': '5666.220031738281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5666.220031738281',
        '231102144451020': '家具',
        '231102144451025': '宝山'
      },
      {
        '10001': '销售额',
        '10002': '892.4440002441406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '892.4440002441406',
        '231102144451020': '办公用品',
        '231102144451025': '宝山'
      },
      {
        '10001': '销售额',
        '10002': '7421.400146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7421.400146484375',
        '231102144451020': '技术',
        '231102144451025': '宝山'
      },
      {
        '10001': '销售额',
        '10002': '2760.5759887695312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2760.5759887695312',
        '231102144451020': '家具',
        '231102144451025': '宝应'
      },
      {
        '10001': '销售额',
        '10002': '2074.8840255737305',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2074.8840255737305',
        '231102144451020': '办公用品',
        '231102144451025': '宝应'
      },
      {
        '10001': '销售额',
        '10002': '12283.039581298828',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12283.039581298828',
        '231102144451020': '办公用品',
        '231102144451025': '宣化'
      },
      {
        '10001': '销售额',
        '10002': '43451.83526611328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '43451.83526611328',
        '231102144451020': '家具',
        '231102144451025': '宣化'
      },
      {
        '10001': '销售额',
        '10002': '1007.9440002441406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1007.9440002441406',
        '231102144451020': '办公用品',
        '231102144451025': '宣州'
      },
      {
        '10001': '销售额',
        '10002': '2316.719970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2316.719970703125',
        '231102144451020': '技术',
        '231102144451025': '宽甸'
      },
      {
        '10001': '销售额',
        '10002': '7023.2398681640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7023.2398681640625',
        '231102144451020': '家具',
        '231102144451025': '宽甸'
      },
      {
        '10001': '销售额',
        '10002': '1081.948013305664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1081.948013305664',
        '231102144451020': '办公用品',
        '231102144451025': '宽甸'
      },
      {
        '10001': '销售额',
        '10002': '281.1199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '281.1199951171875',
        '231102144451020': '家具',
        '231102144451025': '宾州'
      },
      {
        '10001': '销售额',
        '10002': '4730.3199462890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4730.3199462890625',
        '231102144451020': '技术',
        '231102144451025': '宾州'
      },
      {
        '10001': '销售额',
        '10002': '4802.980133056641',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4802.980133056641',
        '231102144451020': '办公用品',
        '231102144451025': '宾州'
      },
      {
        '10001': '销售额',
        '10002': '41494.039611816406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '41494.039611816406',
        '231102144451020': '技术',
        '231102144451025': '宿州'
      },
      {
        '10001': '销售额',
        '10002': '36089.23486328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '36089.23486328125',
        '231102144451020': '家具',
        '231102144451025': '宿州'
      },
      {
        '10001': '销售额',
        '10002': '59529.12131500244',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '59529.12131500244',
        '231102144451020': '办公用品',
        '231102144451025': '宿州'
      },
      {
        '10001': '销售额',
        '10002': '15982.295349121094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15982.295349121094',
        '231102144451020': '家具',
        '231102144451025': '密山'
      },
      {
        '10001': '销售额',
        '10002': '8603.69985961914',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8603.69985961914',
        '231102144451020': '办公用品',
        '231102144451025': '密山'
      },
      {
        '10001': '销售额',
        '10002': '3940.859893798828',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3940.859893798828',
        '231102144451020': '办公用品',
        '231102144451025': '富拉尔基区'
      },
      {
        '10001': '销售额',
        '10002': '3141.60009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3141.60009765625',
        '231102144451020': '技术',
        '231102144451025': '富拉尔基区'
      },
      {
        '10001': '销售额',
        '10002': '7819.6649169921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7819.6649169921875',
        '231102144451020': '家具',
        '231102144451025': '富拉尔基区'
      },
      {
        '10001': '销售额',
        '10002': '11096.120056152344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11096.120056152344',
        '231102144451020': '技术',
        '231102144451025': '富锦'
      },
      {
        '10001': '销售额',
        '10002': '754.3199768066406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '754.3199768066406',
        '231102144451020': '办公用品',
        '231102144451025': '富锦'
      },
      {
        '10001': '销售额',
        '10002': '742.1400146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '742.1400146484375',
        '231102144451020': '家具',
        '231102144451025': '富锦'
      },
      {
        '10001': '销售额',
        '10002': '4804.212066650391',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4804.212066650391',
        '231102144451020': '技术',
        '231102144451025': '富阳'
      },
      {
        '10001': '销售额',
        '10002': '6567.9039306640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6567.9039306640625',
        '231102144451020': '办公用品',
        '231102144451025': '富阳'
      },
      {
        '10001': '销售额',
        '10002': '1409.0159606933594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1409.0159606933594',
        '231102144451020': '家具',
        '231102144451025': '富阳'
      },
      {
        '10001': '销售额',
        '10002': '11876.48046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11876.48046875',
        '231102144451020': '技术',
        '231102144451025': '寒亭'
      },
      {
        '10001': '销售额',
        '10002': '120.4000015258789',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '120.4000015258789',
        '231102144451020': '办公用品',
        '231102144451025': '寒亭'
      },
      {
        '10001': '销售额',
        '10002': '4215.400054931641',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4215.400054931641',
        '231102144451020': '家具',
        '231102144451025': '寿光'
      },
      {
        '10001': '销售额',
        '10002': '11747.96044921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11747.96044921875',
        '231102144451020': '技术',
        '231102144451025': '寿光'
      },
      {
        '10001': '销售额',
        '10002': '13051.220069885254',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13051.220069885254',
        '231102144451020': '办公用品',
        '231102144451025': '寿光'
      },
      {
        '10001': '销售额',
        '10002': '1912.9599609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1912.9599609375',
        '231102144451020': '技术',
        '231102144451025': '小围寨'
      },
      {
        '10001': '销售额',
        '10002': '7556.780029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7556.780029296875',
        '231102144451020': '技术',
        '231102144451025': '尚志'
      },
      {
        '10001': '销售额',
        '10002': '13551.230102539062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13551.230102539062',
        '231102144451020': '家具',
        '231102144451025': '尚志'
      },
      {
        '10001': '销售额',
        '10002': '1084.3000183105469',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1084.3000183105469',
        '231102144451020': '办公用品',
        '231102144451025': '尚志'
      },
      {
        '10001': '销售额',
        '10002': '1022',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1022',
        '231102144451020': '家具',
        '231102144451025': '山亭'
      },
      {
        '10001': '销售额',
        '10002': '19905.90005493164',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19905.90005493164',
        '231102144451020': '家具',
        '231102144451025': '山城'
      },
      {
        '10001': '销售额',
        '10002': '11074.1396484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11074.1396484375',
        '231102144451020': '技术',
        '231102144451025': '山城'
      },
      {
        '10001': '销售额',
        '10002': '4699.7998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4699.7998046875',
        '231102144451020': '家具',
        '231102144451025': '山河屯'
      },
      {
        '10001': '销售额',
        '10002': '7305.227897644043',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7305.227897644043',
        '231102144451020': '办公用品',
        '231102144451025': '岫岩'
      },
      {
        '10001': '销售额',
        '10002': '2719.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2719.5',
        '231102144451020': '技术',
        '231102144451025': '岭东'
      },
      {
        '10001': '销售额',
        '10002': '633.6399955749512',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '633.6399955749512',
        '231102144451020': '办公用品',
        '231102144451025': '岭东'
      },
      {
        '10001': '销售额',
        '10002': '35791.98052787781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '35791.98052787781',
        '231102144451020': '办公用品',
        '231102144451025': '岳阳'
      },
      {
        '10001': '销售额',
        '10002': '43092.86865234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '43092.86865234375',
        '231102144451020': '家具',
        '231102144451025': '岳阳'
      },
      {
        '10001': '销售额',
        '10002': '40862.63934326172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '40862.63934326172',
        '231102144451020': '技术',
        '231102144451025': '岳阳'
      },
      {
        '10001': '销售额',
        '10002': '2716.56005859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2716.56005859375',
        '231102144451020': '家具',
        '231102144451025': '州城'
      },
      {
        '10001': '销售额',
        '10002': '912.239990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '912.239990234375',
        '231102144451020': '办公用品',
        '231102144451025': '州城'
      },
      {
        '10001': '销售额',
        '10002': '18892.019622802734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18892.019622802734',
        '231102144451020': '家具',
        '231102144451025': '巢湖'
      },
      {
        '10001': '销售额',
        '10002': '10862.0400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10862.0400390625',
        '231102144451020': '技术',
        '231102144451025': '巢湖'
      },
      {
        '10001': '销售额',
        '10002': '10812.563995361328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10812.563995361328',
        '231102144451020': '办公用品',
        '231102144451025': '巢湖'
      },
      {
        '10001': '销售额',
        '10002': '270.05999755859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '270.05999755859375',
        '231102144451020': '办公用品',
        '231102144451025': '巨野'
      },
      {
        '10001': '销售额',
        '10002': '7149.324035644531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7149.324035644531',
        '231102144451020': '技术',
        '231102144451025': '常州'
      },
      {
        '10001': '销售额',
        '10002': '23481.136016845703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23481.136016845703',
        '231102144451020': '办公用品',
        '231102144451025': '常州'
      },
      {
        '10001': '销售额',
        '10002': '41919.779724121094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '41919.779724121094',
        '231102144451020': '家具',
        '231102144451025': '常州'
      },
      {
        '10001': '销售额',
        '10002': '9928.659851074219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9928.659851074219',
        '231102144451020': '技术',
        '231102144451025': '常德'
      },
      {
        '10001': '销售额',
        '10002': '11771.060028076172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11771.060028076172',
        '231102144451020': '办公用品',
        '231102144451025': '常德'
      },
      {
        '10001': '销售额',
        '10002': '28577.43017578125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '28577.43017578125',
        '231102144451020': '家具',
        '231102144451025': '常德'
      },
      {
        '10001': '销售额',
        '10002': '1683.0520095825195',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1683.0520095825195',
        '231102144451020': '办公用品',
        '231102144451025': '常熟市'
      },
      {
        '10001': '销售额',
        '10002': '858.4800109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '858.4800109863281',
        '231102144451020': '技术',
        '231102144451025': '常熟市'
      },
      {
        '10001': '销售额',
        '10002': '2703.623992919922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2703.623992919922',
        '231102144451020': '家具',
        '231102144451025': '常熟市'
      },
      {
        '10001': '销售额',
        '10002': '9429.33578491211',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9429.33578491211',
        '231102144451020': '家具',
        '231102144451025': '平凉'
      },
      {
        '10001': '销售额',
        '10002': '7657.85986328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7657.85986328125',
        '231102144451020': '技术',
        '231102144451025': '平凉'
      },
      {
        '10001': '销售额',
        '10002': '2046.0439529418945',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2046.0439529418945',
        '231102144451020': '办公用品',
        '231102144451025': '平凉'
      },
      {
        '10001': '销售额',
        '10002': '784.0000228881836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '784.0000228881836',
        '231102144451020': '办公用品',
        '231102144451025': '平南'
      },
      {
        '10001': '销售额',
        '10002': '4515.27978515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4515.27978515625',
        '231102144451020': '技术',
        '231102144451025': '平南'
      },
      {
        '10001': '销售额',
        '10002': '411.2640075683594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '411.2640075683594',
        '231102144451020': '办公用品',
        '231102144451025': '平庄'
      },
      {
        '10001': '销售额',
        '10002': '2802.239990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2802.239990234375',
        '231102144451020': '技术',
        '231102144451025': '平度'
      },
      {
        '10001': '销售额',
        '10002': '8630.579956054688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8630.579956054688',
        '231102144451020': '办公用品',
        '231102144451025': '平度'
      },
      {
        '10001': '销售额',
        '10002': '7420.840026855469',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7420.840026855469',
        '231102144451020': '家具',
        '231102144451025': '平度'
      },
      {
        '10001': '销售额',
        '10002': '2268',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2268',
        '231102144451020': '家具',
        '231102144451025': '平遥'
      },
      {
        '10001': '销售额',
        '10002': '442.67999267578125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '442.67999267578125',
        '231102144451020': '办公用品',
        '231102144451025': '平遥'
      },
      {
        '10001': '销售额',
        '10002': '11604.235900878906',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11604.235900878906',
        '231102144451020': '家具',
        '231102144451025': '平邑'
      },
      {
        '10001': '销售额',
        '10002': '5042.93994140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5042.93994140625',
        '231102144451020': '技术',
        '231102144451025': '平邑'
      },
      {
        '10001': '销售额',
        '10002': '1748.3199462890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1748.3199462890625',
        '231102144451020': '办公用品',
        '231102144451025': '平邑'
      },
      {
        '10001': '销售额',
        '10002': '364',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '364',
        '231102144451020': '办公用品',
        '231102144451025': '平阴'
      },
      {
        '10001': '销售额',
        '10002': '6638.800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6638.800048828125',
        '231102144451020': '家具',
        '231102144451025': '平顶山'
      },
      {
        '10001': '销售额',
        '10002': '29604.680694580078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '29604.680694580078',
        '231102144451020': '技术',
        '231102144451025': '平顶山'
      },
      {
        '10001': '销售额',
        '10002': '9239.468002319336',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9239.468002319336',
        '231102144451020': '办公用品',
        '231102144451025': '平顶山'
      },
      {
        '10001': '销售额',
        '10002': '18085.199737548828',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18085.199737548828',
        '231102144451020': '技术',
        '231102144451025': '广元'
      },
      {
        '10001': '销售额',
        '10002': '7986.412010192871',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7986.412010192871',
        '231102144451020': '家具',
        '231102144451025': '广元'
      },
      {
        '10001': '销售额',
        '10002': '12529.411754608154',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12529.411754608154',
        '231102144451020': '办公用品',
        '231102144451025': '广元'
      },
      {
        '10001': '销售额',
        '10002': '105595.28729248047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '105595.28729248047',
        '231102144451020': '家具',
        '231102144451025': '广州'
      },
      {
        '10001': '销售额',
        '10002': '100316.02069091797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '100316.02069091797',
        '231102144451020': '技术',
        '231102144451025': '广州'
      },
      {
        '10001': '销售额',
        '10002': '67049.36019134521',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '67049.36019134521',
        '231102144451020': '办公用品',
        '231102144451025': '广州'
      },
      {
        '10001': '销售额',
        '10002': '6783.83984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6783.83984375',
        '231102144451020': '家具',
        '231102144451025': '广水'
      },
      {
        '10001': '销售额',
        '10002': '4421.620002746582',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4421.620002746582',
        '231102144451020': '办公用品',
        '231102144451025': '广水'
      },
      {
        '10001': '销售额',
        '10002': '2016.5879516601562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2016.5879516601562',
        '231102144451020': '家具',
        '231102144451025': '庄河'
      },
      {
        '10001': '销售额',
        '10002': '1025.723991394043',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1025.723991394043',
        '231102144451020': '办公用品',
        '231102144451025': '庄河'
      },
      {
        '10001': '销售额',
        '10002': '2450.196029663086',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2450.196029663086',
        '231102144451020': '技术',
        '231102144451025': '庄河'
      },
      {
        '10001': '销售额',
        '10002': '8396.499816894531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8396.499816894531',
        '231102144451020': '办公用品',
        '231102144451025': '库尔勒'
      },
      {
        '10001': '销售额',
        '10002': '9025.212188720703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9025.212188720703',
        '231102144451020': '办公用品',
        '231102144451025': '应城'
      },
      {
        '10001': '销售额',
        '10002': '3787.81201171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3787.81201171875',
        '231102144451020': '技术',
        '231102144451025': '应城'
      },
      {
        '10001': '销售额',
        '10002': '5029.723861694336',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5029.723861694336',
        '231102144451020': '办公用品',
        '231102144451025': '廉州镇'
      },
      {
        '10001': '销售额',
        '10002': '2164.5540161132812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2164.5540161132812',
        '231102144451020': '家具',
        '231102144451025': '廉州镇'
      },
      {
        '10001': '销售额',
        '10002': '1423.60400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1423.60400390625',
        '231102144451020': '办公用品',
        '231102144451025': '廉江'
      },
      {
        '10001': '销售额',
        '10002': '2360.39990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2360.39990234375',
        '231102144451020': '技术',
        '231102144451025': '廉江'
      },
      {
        '10001': '销售额',
        '10002': '13270.8798828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13270.8798828125',
        '231102144451020': '技术',
        '231102144451025': '廉洲'
      },
      {
        '10001': '销售额',
        '10002': '1864.52001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1864.52001953125',
        '231102144451020': '办公用品',
        '231102144451025': '廉洲'
      },
      {
        '10001': '销售额',
        '10002': '5040.94482421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5040.94482421875',
        '231102144451020': '家具',
        '231102144451025': '廉洲'
      },
      {
        '10001': '销售额',
        '10002': '6943.160217285156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6943.160217285156',
        '231102144451020': '技术',
        '231102144451025': '廊坊'
      },
      {
        '10001': '销售额',
        '10002': '13505.799896240234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13505.799896240234',
        '231102144451020': '家具',
        '231102144451025': '廊坊'
      },
      {
        '10001': '销售额',
        '10002': '9151.09992980957',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9151.09992980957',
        '231102144451020': '办公用品',
        '231102144451025': '廊坊'
      },
      {
        '10001': '销售额',
        '10002': '5540.220062255859',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5540.220062255859',
        '231102144451020': '办公用品',
        '231102144451025': '延吉'
      },
      {
        '10001': '销售额',
        '10002': '16816.380249023438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16816.380249023438',
        '231102144451020': '家具',
        '231102144451025': '延吉'
      },
      {
        '10001': '销售额',
        '10002': '4050.199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4050.199951171875',
        '231102144451020': '技术',
        '231102144451025': '延吉'
      },
      {
        '10001': '销售额',
        '10002': '12081.4404296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12081.4404296875',
        '231102144451020': '技术',
        '231102144451025': '开化'
      },
      {
        '10001': '销售额',
        '10002': '17330.711791992188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17330.711791992188',
        '231102144451020': '家具',
        '231102144451025': '开化'
      },
      {
        '10001': '销售额',
        '10002': '18585.420318603516',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18585.420318603516',
        '231102144451020': '办公用品',
        '231102144451025': '开化'
      },
      {
        '10001': '销售额',
        '10002': '5605.179908752441',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5605.179908752441',
        '231102144451020': '办公用品',
        '231102144451025': '开原'
      },
      {
        '10001': '销售额',
        '10002': '27281.80010986328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '27281.80010986328',
        '231102144451020': '办公用品',
        '231102144451025': '开封'
      },
      {
        '10001': '销售额',
        '10002': '24268.439819335938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24268.439819335938',
        '231102144451020': '技术',
        '231102144451025': '开封'
      },
      {
        '10001': '销售额',
        '10002': '25726.959747314453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '25726.959747314453',
        '231102144451020': '家具',
        '231102144451025': '开封'
      },
      {
        '10001': '销售额',
        '10002': '6963.739990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6963.739990234375',
        '231102144451020': '技术',
        '231102144451025': '开远'
      },
      {
        '10001': '销售额',
        '10002': '7984.760013580322',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7984.760013580322',
        '231102144451020': '办公用品',
        '231102144451025': '开远'
      },
      {
        '10001': '销售额',
        '10002': '9894.219970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9894.219970703125',
        '231102144451020': '家具',
        '231102144451025': '开远'
      },
      {
        '10001': '销售额',
        '10002': '3537.519973754883',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3537.519973754883',
        '231102144451020': '办公用品',
        '231102144451025': '开通'
      },
      {
        '10001': '销售额',
        '10002': '17216.22021484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17216.22021484375',
        '231102144451020': '家具',
        '231102144451025': '开通'
      },
      {
        '10001': '销售额',
        '10002': '2792.5799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2792.5799560546875',
        '231102144451020': '技术',
        '231102144451025': '开通'
      },
      {
        '10001': '销售额',
        '10002': '7289.799835205078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7289.799835205078',
        '231102144451020': '办公用品',
        '231102144451025': '张家口'
      },
      {
        '10001': '销售额',
        '10002': '18727.02978515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18727.02978515625',
        '231102144451020': '家具',
        '231102144451025': '张家口'
      },
      {
        '10001': '销售额',
        '10002': '13270.179992675781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13270.179992675781',
        '231102144451020': '技术',
        '231102144451025': '张家口'
      },
      {
        '10001': '销售额',
        '10002': '8055.60009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8055.60009765625',
        '231102144451020': '家具',
        '231102144451025': '张家港'
      },
      {
        '10001': '销售额',
        '10002': '2320.6399993896484',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2320.6399993896484',
        '231102144451020': '办公用品',
        '231102144451025': '张家港'
      },
      {
        '10001': '销售额',
        '10002': '4614.960021972656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4614.960021972656',
        '231102144451020': '家具',
        '231102144451025': '张掖'
      },
      {
        '10001': '销售额',
        '10002': '1012.7040100097656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1012.7040100097656',
        '231102144451020': '办公用品',
        '231102144451025': '张掖'
      },
      {
        '10001': '销售额',
        '10002': '1212.3719787597656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1212.3719787597656',
        '231102144451020': '技术',
        '231102144451025': '张掖'
      },
      {
        '10001': '销售额',
        '10002': '584.0800018310547',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '584.0800018310547',
        '231102144451020': '办公用品',
        '231102144451025': '弥阳'
      },
      {
        '10001': '销售额',
        '10002': '11281.200439453125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11281.200439453125',
        '231102144451020': '技术',
        '231102144451025': '弥阳'
      },
      {
        '10001': '销售额',
        '10002': '2620.1279296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2620.1279296875',
        '231102144451020': '家具',
        '231102144451025': '归仁'
      },
      {
        '10001': '销售额',
        '10002': '1183.280029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1183.280029296875',
        '231102144451020': '家具',
        '231102144451025': '彭城'
      },
      {
        '10001': '销售额',
        '10002': '21883.93228149414',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21883.93228149414',
        '231102144451020': '技术',
        '231102144451025': '徐州'
      },
      {
        '10001': '销售额',
        '10002': '47924.63217163086',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '47924.63217163086',
        '231102144451020': '办公用品',
        '231102144451025': '徐州'
      },
      {
        '10001': '销售额',
        '10002': '19994.07196044922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19994.07196044922',
        '231102144451020': '家具',
        '231102144451025': '徐州'
      },
      {
        '10001': '销售额',
        '10002': '2111.200019836426',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2111.200019836426',
        '231102144451020': '办公用品',
        '231102144451025': '德州'
      },
      {
        '10001': '销售额',
        '10002': '7064.540016174316',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7064.540016174316',
        '231102144451020': '家具',
        '231102144451025': '德州'
      },
      {
        '10001': '销售额',
        '10002': '8758.260009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8758.260009765625',
        '231102144451020': '技术',
        '231102144451025': '德州'
      },
      {
        '10001': '销售额',
        '10002': '3311',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3311',
        '231102144451020': '家具',
        '231102144451025': '德惠'
      },
      {
        '10001': '销售额',
        '10002': '2415.699951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2415.699951171875',
        '231102144451020': '技术',
        '231102144451025': '德惠'
      },
      {
        '10001': '销售额',
        '10002': '3655.1198806762695',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3655.1198806762695',
        '231102144451020': '办公用品',
        '231102144451025': '德惠'
      },
      {
        '10001': '销售额',
        '10002': '8579.003845214844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8579.003845214844',
        '231102144451020': '家具',
        '231102144451025': '德阳'
      },
      {
        '10001': '销售额',
        '10002': '1644.1320190429688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1644.1320190429688',
        '231102144451020': '技术',
        '231102144451025': '德阳'
      },
      {
        '10001': '销售额',
        '10002': '1600.2840309143066',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1600.2840309143066',
        '231102144451020': '办公用品',
        '231102144451025': '德阳'
      },
      {
        '10001': '销售额',
        '10002': '6921.684020996094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6921.684020996094',
        '231102144451020': '家具',
        '231102144451025': '忻州'
      },
      {
        '10001': '销售额',
        '10002': '5088.832015991211',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5088.832015991211',
        '231102144451020': '办公用品',
        '231102144451025': '忻州'
      },
      {
        '10001': '销售额',
        '10002': '7822.107849121094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7822.107849121094',
        '231102144451020': '技术',
        '231102144451025': '忻州'
      },
      {
        '10001': '销售额',
        '10002': '6342.783935546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6342.783935546875',
        '231102144451020': '家具',
        '231102144451025': '怀化'
      },
      {
        '10001': '销售额',
        '10002': '1276.239990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1276.239990234375',
        '231102144451020': '技术',
        '231102144451025': '怀化'
      },
      {
        '10001': '销售额',
        '10002': '7984.984107971191',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7984.984107971191',
        '231102144451020': '办公用品',
        '231102144451025': '怀化'
      },
      {
        '10001': '销售额',
        '10002': '1470.4199829101562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1470.4199829101562',
        '231102144451020': '办公用品',
        '231102144451025': '怀城'
      },
      {
        '10001': '销售额',
        '10002': '4623.247863769531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4623.247863769531',
        '231102144451020': '家具',
        '231102144451025': '怀城'
      },
      {
        '10001': '销售额',
        '10002': '4237.239990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4237.239990234375',
        '231102144451020': '家具',
        '231102144451025': '恒山'
      },
      {
        '10001': '销售额',
        '10002': '6313.01993560791',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6313.01993560791',
        '231102144451020': '办公用品',
        '231102144451025': '恒山'
      },
      {
        '10001': '销售额',
        '10002': '7393.119873046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7393.119873046875',
        '231102144451020': '技术',
        '231102144451025': '恒山'
      },
      {
        '10001': '销售额',
        '10002': '8218.349609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8218.349609375',
        '231102144451020': '家具',
        '231102144451025': '恩城'
      },
      {
        '10001': '销售额',
        '10002': '8304.7998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8304.7998046875',
        '231102144451020': '技术',
        '231102144451025': '恩城'
      },
      {
        '10001': '销售额',
        '10002': '1096.3399658203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1096.3399658203125',
        '231102144451020': '办公用品',
        '231102144451025': '恩城'
      },
      {
        '10001': '销售额',
        '10002': '799.931978225708',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '799.931978225708',
        '231102144451020': '办公用品',
        '231102144451025': '恩施'
      },
      {
        '10001': '销售额',
        '10002': '8171.9398193359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8171.9398193359375',
        '231102144451020': '技术',
        '231102144451025': '惠城'
      },
      {
        '10001': '销售额',
        '10002': '4236.008102416992',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4236.008102416992',
        '231102144451020': '办公用品',
        '231102144451025': '惠城'
      },
      {
        '10001': '销售额',
        '10002': '20489.532470703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20489.532470703125',
        '231102144451020': '家具',
        '231102144451025': '惠城'
      },
      {
        '10001': '销售额',
        '10002': '1911.2799682617188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1911.2799682617188',
        '231102144451020': '技术',
        '231102144451025': '惠州'
      },
      {
        '10001': '销售额',
        '10002': '7835.211959838867',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7835.211959838867',
        '231102144451020': '办公用品',
        '231102144451025': '惠州'
      },
      {
        '10001': '销售额',
        '10002': '12258.785278320312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12258.785278320312',
        '231102144451020': '家具',
        '231102144451025': '惠州'
      },
      {
        '10001': '销售额',
        '10002': '48949.74005126953',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '48949.74005126953',
        '231102144451020': '技术',
        '231102144451025': '成都'
      },
      {
        '10001': '销售额',
        '10002': '29689.015920639038',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '29689.015920639038',
        '231102144451020': '办公用品',
        '231102144451025': '成都'
      },
      {
        '10001': '销售额',
        '10002': '45137.17596435547',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '45137.17596435547',
        '231102144451020': '家具',
        '231102144451025': '成都'
      },
      {
        '10001': '销售额',
        '10002': '19201.98028564453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19201.98028564453',
        '231102144451020': '技术',
        '231102144451025': '扬州'
      },
      {
        '10001': '销售额',
        '10002': '4131.680004119873',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4131.680004119873',
        '231102144451020': '办公用品',
        '231102144451025': '扬州'
      },
      {
        '10001': '销售额',
        '10002': '17526.515563964844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17526.515563964844',
        '231102144451020': '家具',
        '231102144451025': '扬州'
      },
      {
        '10001': '销售额',
        '10002': '8554.280029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8554.280029296875',
        '231102144451020': '技术',
        '231102144451025': '扶余'
      },
      {
        '10001': '销售额',
        '10002': '5839.680206298828',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5839.680206298828',
        '231102144451020': '家具',
        '231102144451025': '扶余'
      },
      {
        '10001': '销售额',
        '10002': '837.7599792480469',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '837.7599792480469',
        '231102144451020': '办公用品',
        '231102144451025': '扶余'
      },
      {
        '10001': '销售额',
        '10002': '3770.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3770.47998046875',
        '231102144451020': '家具',
        '231102144451025': '承德'
      },
      {
        '10001': '销售额',
        '10002': '1100.4000244140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1100.4000244140625',
        '231102144451020': '技术',
        '231102144451025': '承德'
      },
      {
        '10001': '销售额',
        '10002': '1712.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1712.47998046875',
        '231102144451020': '办公用品',
        '231102144451025': '承德'
      },
      {
        '10001': '销售额',
        '10002': '35449.26020050049',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '35449.26020050049',
        '231102144451020': '家具',
        '231102144451025': '抚顺'
      },
      {
        '10001': '销售额',
        '10002': '19139.651824951172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19139.651824951172',
        '231102144451020': '技术',
        '231102144451025': '抚顺'
      },
      {
        '10001': '销售额',
        '10002': '38648.904504776',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '38648.904504776',
        '231102144451020': '办公用品',
        '231102144451025': '抚顺'
      },
      {
        '10001': '销售额',
        '10002': '1596.8399810791016',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1596.8399810791016',
        '231102144451020': '办公用品',
        '231102144451025': '拉萨'
      },
      {
        '10001': '销售额',
        '10002': '2839.4799194335938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2839.4799194335938',
        '231102144451020': '家具',
        '231102144451025': '拉萨'
      },
      {
        '10001': '销售额',
        '10002': '21230.580139160156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21230.580139160156',
        '231102144451020': '家具',
        '231102144451025': '招远'
      },
      {
        '10001': '销售额',
        '10002': '10319.119934082031',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10319.119934082031',
        '231102144451020': '技术',
        '231102144451025': '招远'
      },
      {
        '10001': '销售额',
        '10002': '7318.7799072265625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7318.7799072265625',
        '231102144451020': '办公用品',
        '231102144451025': '招远'
      },
      {
        '10001': '销售额',
        '10002': '3225.60009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3225.60009765625',
        '231102144451020': '办公用品',
        '231102144451025': '拜泉'
      },
      {
        '10001': '销售额',
        '10002': '14757.820030212402',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14757.820030212402',
        '231102144451020': '办公用品',
        '231102144451025': '揭阳'
      },
      {
        '10001': '销售额',
        '10002': '18667.740478515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18667.740478515625',
        '231102144451020': '技术',
        '231102144451025': '揭阳'
      },
      {
        '10001': '销售额',
        '10002': '1165.2620239257812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1165.2620239257812',
        '231102144451020': '家具',
        '231102144451025': '揭阳'
      },
      {
        '10001': '销售额',
        '10002': '2668.0639724731445',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2668.0639724731445',
        '231102144451020': '办公用品',
        '231102144451025': '敦化'
      },
      {
        '10001': '销售额',
        '10002': '18697.595069885254',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18697.595069885254',
        '231102144451020': '家具',
        '231102144451025': '敦化'
      },
      {
        '10001': '销售额',
        '10002': '2275.56005859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2275.56005859375',
        '231102144451020': '技术',
        '231102144451025': '敦化'
      },
      {
        '10001': '销售额',
        '10002': '13973.6796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13973.6796875',
        '231102144451020': '技术',
        '231102144451025': '文登'
      },
      {
        '10001': '销售额',
        '10002': '12729.359848022461',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12729.359848022461',
        '231102144451020': '家具',
        '231102144451025': '文登'
      },
      {
        '10001': '销售额',
        '10002': '6593.019866943359',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6593.019866943359',
        '231102144451020': '办公用品',
        '231102144451025': '文登'
      },
      {
        '10001': '销售额',
        '10002': '17449.740234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17449.740234375',
        '231102144451020': '技术',
        '231102144451025': '新乡'
      },
      {
        '10001': '销售额',
        '10002': '12383.056144714355',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12383.056144714355',
        '231102144451020': '办公用品',
        '231102144451025': '新乡'
      },
      {
        '10001': '销售额',
        '10002': '9069.53598022461',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9069.53598022461',
        '231102144451020': '家具',
        '231102144451025': '新乡'
      },
      {
        '10001': '销售额',
        '10002': '198.8000030517578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '198.8000030517578',
        '231102144451020': '办公用品',
        '231102144451025': '新余'
      },
      {
        '10001': '销售额',
        '10002': '18280.359924316406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18280.359924316406',
        '231102144451020': '家具',
        '231102144451025': '新余'
      },
      {
        '10001': '销售额',
        '10002': '2037.16796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2037.16796875',
        '231102144451020': '家具',
        '231102144451025': '新民'
      },
      {
        '10001': '销售额',
        '10002': '2315.4600219726562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2315.4600219726562',
        '231102144451020': '家具',
        '231102144451025': '新泰'
      },
      {
        '10001': '销售额',
        '10002': '7466.33984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7466.33984375',
        '231102144451020': '技术',
        '231102144451025': '新泰'
      },
      {
        '10001': '销售额',
        '10002': '19641.15985107422',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19641.15985107422',
        '231102144451020': '办公用品',
        '231102144451025': '新泰'
      },
      {
        '10001': '销售额',
        '10002': '1620.892002105713',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1620.892002105713',
        '231102144451020': '办公用品',
        '231102144451025': '新石'
      },
      {
        '10001': '销售额',
        '10002': '1505.280029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1505.280029296875',
        '231102144451020': '家具',
        '231102144451025': '新石'
      },
      {
        '10001': '销售额',
        '10002': '1412.7120361328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1412.7120361328125',
        '231102144451020': '技术',
        '231102144451025': '新石'
      },
      {
        '10001': '销售额',
        '10002': '122.91999816894531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '122.91999816894531',
        '231102144451020': '办公用品',
        '231102144451025': '新野'
      },
      {
        '10001': '销售额',
        '10002': '3140.235107421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3140.235107421875',
        '231102144451020': '家具',
        '231102144451025': '无城'
      },
      {
        '10001': '销售额',
        '10002': '1625.5400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1625.5400390625',
        '231102144451020': '办公用品',
        '231102144451025': '无城'
      },
      {
        '10001': '销售额',
        '10002': '26559.288208007812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '26559.288208007812',
        '231102144451020': '家具',
        '231102144451025': '无锡'
      },
      {
        '10001': '销售额',
        '10002': '14816.843841552734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14816.843841552734',
        '231102144451020': '技术',
        '231102144451025': '无锡'
      },
      {
        '10001': '销售额',
        '10002': '16278.50008392334',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16278.50008392334',
        '231102144451020': '办公用品',
        '231102144451025': '无锡'
      },
      {
        '10001': '销售额',
        '10002': '2775.2200088500977',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2775.2200088500977',
        '231102144451020': '办公用品',
        '231102144451025': '日照'
      },
      {
        '10001': '销售额',
        '10002': '3544.659912109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3544.659912109375',
        '231102144451020': '家具',
        '231102144451025': '日照'
      },
      {
        '10001': '销售额',
        '10002': '2395.260009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2395.260009765625',
        '231102144451020': '技术',
        '231102144451025': '日照'
      },
      {
        '10001': '销售额',
        '10002': '30930.62074279785',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '30930.62074279785',
        '231102144451020': '办公用品',
        '231102144451025': '昆明'
      },
      {
        '10001': '销售额',
        '10002': '39752.88833618164',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '39752.88833618164',
        '231102144451020': '技术',
        '231102144451025': '昆明'
      },
      {
        '10001': '销售额',
        '10002': '65854.31990814209',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '65854.31990814209',
        '231102144451020': '家具',
        '231102144451025': '昆明'
      },
      {
        '10001': '销售额',
        '10002': '319.5360107421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '319.5360107421875',
        '231102144451020': '办公用品',
        '231102144451025': '昆阳'
      },
      {
        '10001': '销售额',
        '10002': '1088.5000228881836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1088.5000228881836',
        '231102144451020': '办公用品',
        '231102144451025': '昌吉'
      },
      {
        '10001': '销售额',
        '10002': '6135.64013671875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6135.64013671875',
        '231102144451020': '家具',
        '231102144451025': '昌吉'
      },
      {
        '10001': '销售额',
        '10002': '3891.2998275756836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3891.2998275756836',
        '231102144451020': '家具',
        '231102144451025': '昌图'
      },
      {
        '10001': '销售额',
        '10002': '3326.147918701172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3326.147918701172',
        '231102144451020': '技术',
        '231102144451025': '昌图'
      },
      {
        '10001': '销售额',
        '10002': '1927.8840141296387',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1927.8840141296387',
        '231102144451020': '办公用品',
        '231102144451025': '昌图'
      },
      {
        '10001': '销售额',
        '10002': '13264.2998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13264.2998046875',
        '231102144451020': '办公用品',
        '231102144451025': '昌平'
      },
      {
        '10001': '销售额',
        '10002': '6302.240234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6302.240234375',
        '231102144451020': '家具',
        '231102144451025': '昌黎'
      },
      {
        '10001': '销售额',
        '10002': '2354.800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2354.800048828125',
        '231102144451020': '技术',
        '231102144451025': '明光'
      },
      {
        '10001': '销售额',
        '10002': '340.8999938964844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '340.8999938964844',
        '231102144451020': '办公用品',
        '231102144451025': '明月'
      },
      {
        '10001': '销售额',
        '10002': '2271.080078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2271.080078125',
        '231102144451020': '技术',
        '231102144451025': '明月'
      },
      {
        '10001': '销售额',
        '10002': '11548.040222167969',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11548.040222167969',
        '231102144451020': '办公用品',
        '231102144451025': '明水'
      },
      {
        '10001': '销售额',
        '10002': '4933.31982421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4933.31982421875',
        '231102144451020': '家具',
        '231102144451025': '明水'
      },
      {
        '10001': '销售额',
        '10002': '1125.1799926757812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1125.1799926757812',
        '231102144451020': '技术',
        '231102144451025': '明水'
      },
      {
        '10001': '销售额',
        '10002': '11766.523803710938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11766.523803710938',
        '231102144451020': '技术',
        '231102144451025': '昭通'
      },
      {
        '10001': '销售额',
        '10002': '11474.539855957031',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11474.539855957031',
        '231102144451020': '家具',
        '231102144451025': '昭通'
      },
      {
        '10001': '销售额',
        '10002': '3895.3600006103516',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3895.3600006103516',
        '231102144451020': '办公用品',
        '231102144451025': '昭通'
      },
      {
        '10001': '销售额',
        '10002': '25187.435424804688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '25187.435424804688',
        '231102144451020': '家具',
        '231102144451025': '晋城'
      },
      {
        '10001': '销售额',
        '10002': '8447.039855957031',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8447.039855957031',
        '231102144451020': '技术',
        '231102144451025': '晋城'
      },
      {
        '10001': '销售额',
        '10002': '2600.9199829101562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2600.9199829101562',
        '231102144451020': '办公用品',
        '231102144451025': '晋城'
      },
      {
        '10001': '销售额',
        '10002': '18065.578552246094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18065.578552246094',
        '231102144451020': '家具',
        '231102144451025': '晋江'
      },
      {
        '10001': '销售额',
        '10002': '15275.120239257812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15275.120239257812',
        '231102144451020': '技术',
        '231102144451025': '晋江'
      },
      {
        '10001': '销售额',
        '10002': '15660.679901123047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15660.679901123047',
        '231102144451020': '办公用品',
        '231102144451025': '晋江'
      },
      {
        '10001': '销售额',
        '10002': '779.0999755859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '779.0999755859375',
        '231102144451020': '技术',
        '231102144451025': '普兰店'
      },
      {
        '10001': '销售额',
        '10002': '49351.12030029297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '49351.12030029297',
        '231102144451020': '家具',
        '231102144451025': '景德镇'
      },
      {
        '10001': '销售额',
        '10002': '13069.980041503906',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13069.980041503906',
        '231102144451020': '技术',
        '231102144451025': '景德镇'
      },
      {
        '10001': '销售额',
        '10002': '6486.199996948242',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6486.199996948242',
        '231102144451020': '办公用品',
        '231102144451025': '景德镇'
      },
      {
        '10001': '销售额',
        '10002': '3582.5999145507812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3582.5999145507812',
        '231102144451020': '办公用品',
        '231102144451025': '景洪'
      },
      {
        '10001': '销售额',
        '10002': '5625.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5625.47998046875',
        '231102144451020': '家具',
        '231102144451025': '景洪'
      },
      {
        '10001': '销售额',
        '10002': '3760.679931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3760.679931640625',
        '231102144451020': '技术',
        '231102144451025': '曲阜'
      },
      {
        '10001': '销售额',
        '10002': '4781.280044555664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4781.280044555664',
        '231102144451020': '办公用品',
        '231102144451025': '曲阜'
      },
      {
        '10001': '销售额',
        '10002': '17613.81982421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17613.81982421875',
        '231102144451020': '家具',
        '231102144451025': '曲靖'
      },
      {
        '10001': '销售额',
        '10002': '12120.86376953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12120.86376953125',
        '231102144451020': '技术',
        '231102144451025': '曲靖'
      },
      {
        '10001': '销售额',
        '10002': '10907.96021270752',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10907.96021270752',
        '231102144451020': '办公用品',
        '231102144451025': '曲靖'
      },
      {
        '10001': '销售额',
        '10002': '6695.556045532227',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6695.556045532227',
        '231102144451020': '办公用品',
        '231102144451025': '朗乡'
      },
      {
        '10001': '销售额',
        '10002': '2704.6600341796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2704.6600341796875',
        '231102144451020': '技术',
        '231102144451025': '朗乡'
      },
      {
        '10001': '销售额',
        '10002': '2672.320068359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2672.320068359375',
        '231102144451020': '家具',
        '231102144451025': '朗乡'
      },
      {
        '10001': '销售额',
        '10002': '618.5199890136719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '618.5199890136719',
        '231102144451020': '办公用品',
        '231102144451025': '望奎'
      },
      {
        '10001': '销售额',
        '10002': '1141',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1141',
        '231102144451020': '技术',
        '231102144451025': '望奎'
      },
      {
        '10001': '销售额',
        '10002': '15359.792007446289',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15359.792007446289',
        '231102144451020': '办公用品',
        '231102144451025': '朝阳'
      },
      {
        '10001': '销售额',
        '10002': '19107.591827392578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19107.591827392578',
        '231102144451020': '技术',
        '231102144451025': '朝阳'
      },
      {
        '10001': '销售额',
        '10002': '17141.68392944336',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17141.68392944336',
        '231102144451020': '家具',
        '231102144451025': '朝阳'
      },
      {
        '10001': '销售额',
        '10002': '17684.492277145386',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17684.492277145386',
        '231102144451020': '办公用品',
        '231102144451025': '本溪'
      },
      {
        '10001': '销售额',
        '10002': '6051.276184082031',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6051.276184082031',
        '231102144451020': '技术',
        '231102144451025': '本溪'
      },
      {
        '10001': '销售额',
        '10002': '31129.140014648438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '31129.140014648438',
        '231102144451020': '家具',
        '231102144451025': '本溪'
      },
      {
        '10001': '销售额',
        '10002': '9466.800033569336',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9466.800033569336',
        '231102144451020': '办公用品',
        '231102144451025': '来宾'
      },
      {
        '10001': '销售额',
        '10002': '4289.60009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4289.60009765625',
        '231102144451020': '技术',
        '231102144451025': '来宾'
      },
      {
        '10001': '销售额',
        '10002': '385.13999938964844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '385.13999938964844',
        '231102144451020': '办公用品',
        '231102144451025': '杨村'
      },
      {
        '10001': '销售额',
        '10002': '340.89999771118164',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '340.89999771118164',
        '231102144451020': '办公用品',
        '231102144451025': '杨柳青'
      },
      {
        '10001': '销售额',
        '10002': '59729.795837402344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '59729.795837402344',
        '231102144451020': '技术',
        '231102144451025': '杭州'
      },
      {
        '10001': '销售额',
        '10002': '26511.4637298584',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '26511.4637298584',
        '231102144451020': '家具',
        '231102144451025': '杭州'
      },
      {
        '10001': '销售额',
        '10002': '22517.684017181396',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '22517.684017181396',
        '231102144451020': '办公用品',
        '231102144451025': '杭州'
      },
      {
        '10001': '销售额',
        '10002': '3399.89990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3399.89990234375',
        '231102144451020': '技术',
        '231102144451025': '松江河'
      },
      {
        '10001': '销售额',
        '10002': '4528.1881103515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4528.1881103515625',
        '231102144451020': '技术',
        '231102144451025': '松陵'
      },
      {
        '10001': '销售额',
        '10002': '740.0959930419922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '740.0959930419922',
        '231102144451020': '办公用品',
        '231102144451025': '松陵'
      },
      {
        '10001': '销售额',
        '10002': '10078.319946289062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10078.319946289062',
        '231102144451020': '技术',
        '231102144451025': '林口'
      },
      {
        '10001': '销售额',
        '10002': '6087.304779052734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6087.304779052734',
        '231102144451020': '家具',
        '231102144451025': '林口'
      },
      {
        '10001': '销售额',
        '10002': '2462.8799896240234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2462.8799896240234',
        '231102144451020': '办公用品',
        '231102144451025': '林口'
      },
      {
        '10001': '销售额',
        '10002': '2326.2960205078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2326.2960205078125',
        '231102144451020': '技术',
        '231102144451025': '枝城'
      },
      {
        '10001': '销售额',
        '10002': '18343.640007019043',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18343.640007019043',
        '231102144451020': '办公用品',
        '231102144451025': '枝城'
      },
      {
        '10001': '销售额',
        '10002': '670.3200073242188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '670.3200073242188',
        '231102144451020': '家具',
        '231102144451025': '枝城'
      },
      {
        '10001': '销售额',
        '10002': '2666.3279724121094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2666.3279724121094',
        '231102144451020': '技术',
        '231102144451025': '枝江'
      },
      {
        '10001': '销售额',
        '10002': '712.5999755859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '712.5999755859375',
        '231102144451020': '办公用品',
        '231102144451025': '枝江'
      },
      {
        '10001': '销售额',
        '10002': '539.9519958496094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '539.9519958496094',
        '231102144451020': '家具',
        '231102144451025': '枝江'
      },
      {
        '10001': '销售额',
        '10002': '8176.97998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8176.97998046875',
        '231102144451020': '家具',
        '231102144451025': '枣庄'
      },
      {
        '10001': '销售额',
        '10002': '6649.860010147095',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6649.860010147095',
        '231102144451020': '办公用品',
        '231102144451025': '枣庄'
      },
      {
        '10001': '销售额',
        '10002': '21356.16033935547',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21356.16033935547',
        '231102144451020': '技术',
        '231102144451025': '枣庄'
      },
      {
        '10001': '销售额',
        '10002': '5949.5799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5949.5799560546875',
        '231102144451020': '家具',
        '231102144451025': '枣阳'
      },
      {
        '10001': '销售额',
        '10002': '3327.771987915039',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3327.771987915039',
        '231102144451020': '办公用品',
        '231102144451025': '枣阳'
      },
      {
        '10001': '销售额',
        '10002': '4977.83984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4977.83984375',
        '231102144451020': '技术',
        '231102144451025': '枣阳'
      },
      {
        '10001': '销售额',
        '10002': '10132.919929504395',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10132.919929504395',
        '231102144451020': '办公用品',
        '231102144451025': '栖霞'
      },
      {
        '10001': '销售额',
        '10002': '8659.83984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8659.83984375',
        '231102144451020': '家具',
        '231102144451025': '栖霞'
      },
      {
        '10001': '销售额',
        '10002': '11963.559692382812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11963.559692382812',
        '231102144451020': '技术',
        '231102144451025': '株洲'
      },
      {
        '10001': '销售额',
        '10002': '20099.268295288086',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20099.268295288086',
        '231102144451020': '家具',
        '231102144451025': '株洲'
      },
      {
        '10001': '销售额',
        '10002': '9381.876113891602',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9381.876113891602',
        '231102144451020': '办公用品',
        '231102144451025': '株洲'
      },
      {
        '10001': '销售额',
        '10002': '333.4800109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '333.4800109863281',
        '231102144451020': '家具',
        '231102144451025': '栾城'
      },
      {
        '10001': '销售额',
        '10002': '14798.405654907227',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14798.405654907227',
        '231102144451020': '家具',
        '231102144451025': '桂平'
      },
      {
        '10001': '销售额',
        '10002': '1085.5600051879883',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1085.5600051879883',
        '231102144451020': '办公用品',
        '231102144451025': '桂平'
      },
      {
        '10001': '销售额',
        '10002': '5999.27978515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5999.27978515625',
        '231102144451020': '技术',
        '231102144451025': '桂平'
      },
      {
        '10001': '销售额',
        '10002': '22480.7802734375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '22480.7802734375',
        '231102144451020': '技术',
        '231102144451025': '桂林'
      },
      {
        '10001': '销售额',
        '10002': '29547.05562210083',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '29547.05562210083',
        '231102144451020': '办公用品',
        '231102144451025': '桂林'
      },
      {
        '10001': '销售额',
        '10002': '21766.16387939453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21766.16387939453',
        '231102144451020': '家具',
        '231102144451025': '桂林'
      },
      {
        '10001': '销售额',
        '10002': '2226.1680297851562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2226.1680297851562',
        '231102144451020': '家具',
        '231102144451025': '桓仁'
      },
      {
        '10001': '销售额',
        '10002': '4485.767883300781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4485.767883300781',
        '231102144451020': '技术',
        '231102144451025': '桓仁'
      },
      {
        '10001': '销售额',
        '10002': '12174.204299926758',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12174.204299926758',
        '231102144451020': '办公用品',
        '231102144451025': '桓仁'
      },
      {
        '10001': '销售额',
        '10002': '7349.579803466797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7349.579803466797',
        '231102144451020': '办公用品',
        '231102144451025': '桦南'
      },
      {
        '10001': '销售额',
        '10002': '3276.980010986328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3276.980010986328',
        '231102144451020': '办公用品',
        '231102144451025': '桦甸'
      },
      {
        '10001': '销售额',
        '10002': '3893.399971008301',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3893.399971008301',
        '231102144451020': '家具',
        '231102144451025': '桦甸'
      },
      {
        '10001': '销售额',
        '10002': '6342.840087890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6342.840087890625',
        '231102144451020': '技术',
        '231102144451025': '桦甸'
      },
      {
        '10001': '销售额',
        '10002': '4710.7760009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4710.7760009765625',
        '231102144451020': '家具',
        '231102144451025': '梅州'
      },
      {
        '10001': '销售额',
        '10002': '2066.8199462890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2066.8199462890625',
        '231102144451020': '技术',
        '231102144451025': '梅州'
      },
      {
        '10001': '销售额',
        '10002': '16777.040130615234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16777.040130615234',
        '231102144451020': '办公用品',
        '231102144451025': '梅州'
      },
      {
        '10001': '销售额',
        '10002': '1388.6600341796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1388.6600341796875',
        '231102144451020': '家具',
        '231102144451025': '梅河口'
      },
      {
        '10001': '销售额',
        '10002': '4453.68017578125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4453.68017578125',
        '231102144451020': '技术',
        '231102144451025': '梅河口'
      },
      {
        '10001': '销售额',
        '10002': '504.5600128173828',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '504.5600128173828',
        '231102144451020': '办公用品',
        '231102144451025': '梅河口'
      },
      {
        '10001': '销售额',
        '10002': '10926.194946289062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10926.194946289062',
        '231102144451020': '家具',
        '231102144451025': '梧州'
      },
      {
        '10001': '销售额',
        '10002': '12410.580047607422',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12410.580047607422',
        '231102144451020': '技术',
        '231102144451025': '梧州'
      },
      {
        '10001': '销售额',
        '10002': '3181.723976135254',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3181.723976135254',
        '231102144451020': '办公用品',
        '231102144451025': '梧州'
      },
      {
        '10001': '销售额',
        '10002': '2501.2399826049805',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2501.2399826049805',
        '231102144451020': '办公用品',
        '231102144451025': '梨树'
      },
      {
        '10001': '销售额',
        '10002': '6493.339950561523',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6493.339950561523',
        '231102144451020': '技术',
        '231102144451025': '梨树'
      },
      {
        '10001': '销售额',
        '10002': '2812.1800537109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2812.1800537109375',
        '231102144451020': '家具',
        '231102144451025': '梨树'
      },
      {
        '10001': '销售额',
        '10002': '1486.2120361328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1486.2120361328125',
        '231102144451020': '技术',
        '231102144451025': '椒江'
      },
      {
        '10001': '销售额',
        '10002': '400.59600830078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '400.59600830078125',
        '231102144451020': '家具',
        '231102144451025': '椒江'
      },
      {
        '10001': '销售额',
        '10002': '7339.080028533936',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7339.080028533936',
        '231102144451020': '办公用品',
        '231102144451025': '椒江'
      },
      {
        '10001': '销售额',
        '10002': '9733.920021057129',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9733.920021057129',
        '231102144451020': '办公用品',
        '231102144451025': '榆林'
      },
      {
        '10001': '销售额',
        '10002': '24350.340087890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24350.340087890625',
        '231102144451020': '技术',
        '231102144451025': '榆林'
      },
      {
        '10001': '销售额',
        '10002': '8300.460144042969',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8300.460144042969',
        '231102144451020': '家具',
        '231102144451025': '榆林'
      },
      {
        '10001': '销售额',
        '10002': '2358.580062866211',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2358.580062866211',
        '231102144451020': '办公用品',
        '231102144451025': '榆树'
      },
      {
        '10001': '销售额',
        '10002': '1583.6800537109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1583.6800537109375',
        '231102144451020': '技术',
        '231102144451025': '榆树'
      },
      {
        '10001': '销售额',
        '10002': '7868.2801513671875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7868.2801513671875',
        '231102144451020': '技术',
        '231102144451025': '榆次'
      },
      {
        '10001': '销售额',
        '10002': '3373.7201232910156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3373.7201232910156',
        '231102144451020': '办公用品',
        '231102144451025': '榆次'
      },
      {
        '10001': '销售额',
        '10002': '4954.460021972656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4954.460021972656',
        '231102144451020': '家具',
        '231102144451025': '榆次'
      },
      {
        '10001': '销售额',
        '10002': '68795.94406890869',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '68795.94406890869',
        '231102144451020': '家具',
        '231102144451025': '武汉'
      },
      {
        '10001': '销售额',
        '10002': '66143.53215026855',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '66143.53215026855',
        '231102144451020': '技术',
        '231102144451025': '武汉'
      },
      {
        '10001': '销售额',
        '10002': '94963.17569160461',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '94963.17569160461',
        '231102144451020': '办公用品',
        '231102144451025': '武汉'
      },
      {
        '10001': '销售额',
        '10002': '624.9600219726562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '624.9600219726562',
        '231102144451020': '技术',
        '231102144451025': '武穴'
      },
      {
        '10001': '销售额',
        '10002': '221.1999969482422',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '221.1999969482422',
        '231102144451020': '办公用品',
        '231102144451025': '武穴'
      },
      {
        '10001': '销售额',
        '10002': '1534.3440551757812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1534.3440551757812',
        '231102144451020': '家具',
        '231102144451025': '武穴'
      },
      {
        '10001': '销售额',
        '10002': '6060.628173828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6060.628173828125',
        '231102144451020': '技术',
        '231102144451025': '毕节'
      },
      {
        '10001': '销售额',
        '10002': '792.1199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '792.1199951171875',
        '231102144451020': '家具',
        '231102144451025': '毕节'
      },
      {
        '10001': '销售额',
        '10002': '2643.2000274658203',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2643.2000274658203',
        '231102144451020': '办公用品',
        '231102144451025': '毕节'
      },
      {
        '10001': '销售额',
        '10002': '2295.1599731445312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2295.1599731445312',
        '231102144451020': '技术',
        '231102144451025': '永丰'
      },
      {
        '10001': '销售额',
        '10002': '5316.359802246094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5316.359802246094',
        '231102144451020': '办公用品',
        '231102144451025': '永丰'
      },
      {
        '10001': '销售额',
        '10002': '14347.059967041016',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14347.059967041016',
        '231102144451020': '家具',
        '231102144451025': '永川'
      },
      {
        '10001': '销售额',
        '10002': '4440.744140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4440.744140625',
        '231102144451020': '技术',
        '231102144451025': '永川'
      },
      {
        '10001': '销售额',
        '10002': '5278.420032501221',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5278.420032501221',
        '231102144451020': '办公用品',
        '231102144451025': '永川'
      },
      {
        '10001': '销售额',
        '10002': '4098.92008972168',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4098.92008972168',
        '231102144451020': '办公用品',
        '231102144451025': '汉中'
      },
      {
        '10001': '销售额',
        '10002': '27222.16064453125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '27222.16064453125',
        '231102144451020': '家具',
        '231102144451025': '汉中'
      },
      {
        '10001': '销售额',
        '10002': '20574.53970336914',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20574.53970336914',
        '231102144451020': '技术',
        '231102144451025': '汉中'
      },
      {
        '10001': '销售额',
        '10002': '1364.6639404296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1364.6639404296875',
        '231102144451020': '技术',
        '231102144451025': '汉川'
      },
      {
        '10001': '销售额',
        '10002': '304.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '304.5',
        '231102144451020': '办公用品',
        '231102144451025': '汉川'
      },
      {
        '10001': '销售额',
        '10002': '1219.5399780273438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1219.5399780273438',
        '231102144451020': '家具',
        '231102144451025': '汉沽'
      },
      {
        '10001': '销售额',
        '10002': '20869.940505981445',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20869.940505981445',
        '231102144451020': '技术',
        '231102144451025': '汉沽'
      },
      {
        '10001': '销售额',
        '10002': '1377.6000137329102',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1377.6000137329102',
        '231102144451020': '办公用品',
        '231102144451025': '汉沽'
      },
      {
        '10001': '销售额',
        '10002': '35727.97207260132',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '35727.97207260132',
        '231102144451020': '办公用品',
        '231102144451025': '汕头'
      },
      {
        '10001': '销售额',
        '10002': '56769.16082763672',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '56769.16082763672',
        '231102144451020': '家具',
        '231102144451025': '汕头'
      },
      {
        '10001': '销售额',
        '10002': '26207.43994140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '26207.43994140625',
        '231102144451020': '技术',
        '231102144451025': '汕头'
      },
      {
        '10001': '销售额',
        '10002': '4257.5400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4257.5400390625',
        '231102144451020': '技术',
        '231102144451025': '汕尾'
      },
      {
        '10001': '销售额',
        '10002': '3556.699981689453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3556.699981689453',
        '231102144451020': '办公用品',
        '231102144451025': '汕尾'
      },
      {
        '10001': '销售额',
        '10002': '8126.411865234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8126.411865234375',
        '231102144451020': '家具',
        '231102144451025': '汕尾'
      },
      {
        '10001': '销售额',
        '10002': '23158.800567626953',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23158.800567626953',
        '231102144451020': '技术',
        '231102144451025': '江口'
      },
      {
        '10001': '销售额',
        '10002': '388.6400146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '388.6400146484375',
        '231102144451020': '家具',
        '231102144451025': '江口'
      },
      {
        '10001': '销售额',
        '10002': '456.3999938964844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '456.3999938964844',
        '231102144451020': '办公用品',
        '231102144451025': '江口'
      },
      {
        '10001': '销售额',
        '10002': '7777.811950683594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7777.811950683594',
        '231102144451020': '家具',
        '231102144451025': '江油'
      },
      {
        '10001': '销售额',
        '10002': '1867.572021484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1867.572021484375',
        '231102144451020': '技术',
        '231102144451025': '江油'
      },
      {
        '10001': '销售额',
        '10002': '15542.911937713623',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15542.911937713623',
        '231102144451020': '办公用品',
        '231102144451025': '江油'
      },
      {
        '10001': '销售额',
        '10002': '15095.051797866821',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15095.051797866821',
        '231102144451020': '办公用品',
        '231102144451025': '江都'
      },
      {
        '10001': '销售额',
        '10002': '415.6319885253906',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '415.6319885253906',
        '231102144451020': '家具',
        '231102144451025': '江都'
      },
      {
        '10001': '销售额',
        '10002': '9110.97607421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9110.97607421875',
        '231102144451020': '技术',
        '231102144451025': '江都'
      },
      {
        '10001': '销售额',
        '10002': '21042.811798095703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21042.811798095703',
        '231102144451020': '家具',
        '231102144451025': '江门'
      },
      {
        '10001': '销售额',
        '10002': '11029.3401222229',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11029.3401222229',
        '231102144451020': '办公用品',
        '231102144451025': '江门'
      },
      {
        '10001': '销售额',
        '10002': '11398.379760742188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11398.379760742188',
        '231102144451020': '技术',
        '231102144451025': '江门'
      },
      {
        '10001': '销售额',
        '10002': '6382.320068359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6382.320068359375',
        '231102144451020': '办公用品',
        '231102144451025': '池州'
      },
      {
        '10001': '销售额',
        '10002': '6129.7601318359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6129.7601318359375',
        '231102144451020': '家具',
        '231102144451025': '池州'
      },
      {
        '10001': '销售额',
        '10002': '1121.1199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1121.1199951171875',
        '231102144451020': '办公用品',
        '231102144451025': '汪清'
      },
      {
        '10001': '销售额',
        '10002': '550.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '550.47998046875',
        '231102144451020': '技术',
        '231102144451025': '汪清'
      },
      {
        '10001': '销售额',
        '10002': '6476.60986328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6476.60986328125',
        '231102144451020': '家具',
        '231102144451025': '汪清'
      },
      {
        '10001': '销售额',
        '10002': '732.760009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '732.760009765625',
        '231102144451020': '办公用品',
        '231102144451025': '汶上'
      },
      {
        '10001': '销售额',
        '10002': '2368.800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2368.800048828125',
        '231102144451020': '办公用品',
        '231102144451025': '沂水'
      },
      {
        '10001': '销售额',
        '10002': '2730.56005859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2730.56005859375',
        '231102144451020': '家具',
        '231102144451025': '沂水'
      },
      {
        '10001': '销售额',
        '10002': '2236.304000854492',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2236.304000854492',
        '231102144451020': '办公用品',
        '231102144451025': '沅江'
      },
      {
        '10001': '销售额',
        '10002': '375.4800109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '375.4800109863281',
        '231102144451020': '技术',
        '231102144451025': '沅江'
      },
      {
        '10001': '销售额',
        '10002': '71159.4807395935',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '71159.4807395935',
        '231102144451020': '家具',
        '231102144451025': '沈阳'
      },
      {
        '10001': '销售额',
        '10002': '78539.24482727051',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '78539.24482727051',
        '231102144451020': '技术',
        '231102144451025': '沈阳'
      },
      {
        '10001': '销售额',
        '10002': '89550.07666778564',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '89550.07666778564',
        '231102144451020': '办公用品',
        '231102144451025': '沈阳'
      },
      {
        '10001': '销售额',
        '10002': '1285.5359735488892',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1285.5359735488892',
        '231102144451020': '办公用品',
        '231102144451025': '沙市'
      },
      {
        '10001': '销售额',
        '10002': '1116.3599853515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1116.3599853515625',
        '231102144451020': '家具',
        '231102144451025': '沙市'
      },
      {
        '10001': '销售额',
        '10002': '4326.839981079102',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4326.839981079102',
        '231102144451020': '办公用品',
        '231102144451025': '沧州'
      },
      {
        '10001': '销售额',
        '10002': '3930.6400146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3930.6400146484375',
        '231102144451020': '家具',
        '231102144451025': '沧州'
      },
      {
        '10001': '销售额',
        '10002': '16657.199584960938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16657.199584960938',
        '231102144451020': '技术',
        '231102144451025': '沧州'
      },
      {
        '10001': '销售额',
        '10002': '269.3599853515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '269.3599853515625',
        '231102144451020': '办公用品',
        '231102144451025': '河坡'
      },
      {
        '10001': '销售额',
        '10002': '1711.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1711.5',
        '231102144451020': '技术',
        '231102144451025': '河坡'
      },
      {
        '10001': '销售额',
        '10002': '2832.060089111328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2832.060089111328',
        '231102144451020': '技术',
        '231102144451025': '河源'
      },
      {
        '10001': '销售额',
        '10002': '15924.0341796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15924.0341796875',
        '231102144451020': '家具',
        '231102144451025': '河源'
      },
      {
        '10001': '销售额',
        '10002': '1743.4199752807617',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1743.4199752807617',
        '231102144451020': '办公用品',
        '231102144451025': '河源'
      },
      {
        '10001': '销售额',
        '10002': '66622.08059692383',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '66622.08059692383',
        '231102144451020': '家具',
        '231102144451025': '泉州'
      },
      {
        '10001': '销售额',
        '10002': '15976.099758148193',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15976.099758148193',
        '231102144451020': '办公用品',
        '231102144451025': '泉州'
      },
      {
        '10001': '销售额',
        '10002': '19210.66015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19210.66015625',
        '231102144451020': '技术',
        '231102144451025': '泉州'
      },
      {
        '10001': '销售额',
        '10002': '401.5199890136719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '401.5199890136719',
        '231102144451020': '技术',
        '231102144451025': '泗水'
      },
      {
        '10001': '销售额',
        '10002': '897.2600021362305',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '897.2600021362305',
        '231102144451020': '办公用品',
        '231102144451025': '泗水'
      },
      {
        '10001': '销售额',
        '10002': '8990.184204101562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8990.184204101562',
        '231102144451020': '技术',
        '231102144451025': '泰兴'
      },
      {
        '10001': '销售额',
        '10002': '6701.519973754883',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6701.519973754883',
        '231102144451020': '办公用品',
        '231102144451025': '泰兴'
      },
      {
        '10001': '销售额',
        '10002': '354.9840087890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '354.9840087890625',
        '231102144451020': '家具',
        '231102144451025': '泰兴'
      },
      {
        '10001': '销售额',
        '10002': '7801.948123931885',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7801.948123931885',
        '231102144451020': '办公用品',
        '231102144451025': '泰州'
      },
      {
        '10001': '销售额',
        '10002': '6297.647979736328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6297.647979736328',
        '231102144451020': '技术',
        '231102144451025': '泰州'
      },
      {
        '10001': '销售额',
        '10002': '12756.967956542969',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12756.967956542969',
        '231102144451020': '家具',
        '231102144451025': '泰州'
      },
      {
        '10001': '销售额',
        '10002': '3848.543975830078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3848.543975830078',
        '231102144451020': '办公用品',
        '231102144451025': '泰来'
      },
      {
        '10001': '销售额',
        '10002': '2433.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2433.47998046875',
        '231102144451020': '技术',
        '231102144451025': '泰来'
      },
      {
        '10001': '销售额',
        '10002': '965.1600036621094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '965.1600036621094',
        '231102144451020': '家具',
        '231102144451025': '泰来'
      },
      {
        '10001': '销售额',
        '10002': '77100.33827972412',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '77100.33827972412',
        '231102144451020': '家具',
        '231102144451025': '洛阳'
      },
      {
        '10001': '销售额',
        '10002': '97148.79922485352',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '97148.79922485352',
        '231102144451020': '技术',
        '231102144451025': '洛阳'
      },
      {
        '10001': '销售额',
        '10002': '57146.71243286133',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '57146.71243286133',
        '231102144451020': '办公用品',
        '231102144451025': '洛阳'
      },
      {
        '10001': '销售额',
        '10002': '1462.9999694824219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1462.9999694824219',
        '231102144451020': '办公用品',
        '231102144451025': '津市'
      },
      {
        '10001': '销售额',
        '10002': '1347.0799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1347.0799560546875',
        '231102144451020': '技术',
        '231102144451025': '津市'
      },
      {
        '10001': '销售额',
        '10002': '1704.0799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1704.0799560546875',
        '231102144451020': '技术',
        '231102144451025': '洪江'
      },
      {
        '10001': '销售额',
        '10002': '515.6199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '515.6199951171875',
        '231102144451020': '办公用品',
        '231102144451025': '洪江'
      },
      {
        '10001': '销售额',
        '10002': '3405.919921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3405.919921875',
        '231102144451020': '家具',
        '231102144451025': '洪江'
      },
      {
        '10001': '销售额',
        '10002': '12264.83984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12264.83984375',
        '231102144451020': '技术',
        '231102144451025': '洮南'
      },
      {
        '10001': '销售额',
        '10002': '11423.804359436035',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11423.804359436035',
        '231102144451020': '办公用品',
        '231102144451025': '洮南'
      },
      {
        '10001': '销售额',
        '10002': '49167.9158782959',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '49167.9158782959',
        '231102144451020': '家具',
        '231102144451025': '济南'
      },
      {
        '10001': '销售额',
        '10002': '39526.480712890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '39526.480712890625',
        '231102144451020': '技术',
        '231102144451025': '济南'
      },
      {
        '10001': '销售额',
        '10002': '46679.08017539978',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '46679.08017539978',
        '231102144451020': '办公用品',
        '231102144451025': '济南'
      },
      {
        '10001': '销售额',
        '10002': '25973.78012084961',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '25973.78012084961',
        '231102144451020': '技术',
        '231102144451025': '济宁'
      },
      {
        '10001': '销售额',
        '10002': '37441.459899902344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '37441.459899902344',
        '231102144451020': '家具',
        '231102144451025': '济宁'
      },
      {
        '10001': '销售额',
        '10002': '23138.779872894287',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23138.779872894287',
        '231102144451020': '办公用品',
        '231102144451025': '济宁'
      },
      {
        '10001': '销售额',
        '10002': '1323.5599822998047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1323.5599822998047',
        '231102144451020': '办公用品',
        '231102144451025': '济水'
      },
      {
        '10001': '销售额',
        '10002': '3165.1201171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3165.1201171875',
        '231102144451020': '家具',
        '231102144451025': '济水'
      },
      {
        '10001': '销售额',
        '10002': '1197.8399658203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1197.8399658203125',
        '231102144451020': '技术',
        '231102144451025': '济水'
      },
      {
        '10001': '销售额',
        '10002': '4318.831970214844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4318.831970214844',
        '231102144451020': '家具',
        '231102144451025': '浏阳'
      },
      {
        '10001': '销售额',
        '10002': '2969.679931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2969.679931640625',
        '231102144451020': '技术',
        '231102144451025': '浏阳'
      },
      {
        '10001': '销售额',
        '10002': '1965.6839904785156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1965.6839904785156',
        '231102144451020': '办公用品',
        '231102144451025': '浏阳'
      },
      {
        '10001': '销售额',
        '10002': '3166.100067138672',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3166.100067138672',
        '231102144451020': '办公用品',
        '231102144451025': '浦城'
      },
      {
        '10001': '销售额',
        '10002': '3620.39990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3620.39990234375',
        '231102144451020': '技术',
        '231102144451025': '浦城'
      },
      {
        '10001': '销售额',
        '10002': '3612.50390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3612.50390625',
        '231102144451020': '家具',
        '231102144451025': '浦阳'
      },
      {
        '10001': '销售额',
        '10002': '2267.495994567871',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2267.495994567871',
        '231102144451020': '办公用品',
        '231102144451025': '浦阳'
      },
      {
        '10001': '销售额',
        '10002': '34816.48838806152',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '34816.48838806152',
        '231102144451020': '办公用品',
        '231102144451025': '浯溪'
      },
      {
        '10001': '销售额',
        '10002': '33023.914291381836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '33023.914291381836',
        '231102144451020': '家具',
        '231102144451025': '浯溪'
      },
      {
        '10001': '销售额',
        '10002': '26283.32012939453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '26283.32012939453',
        '231102144451020': '技术',
        '231102144451025': '浯溪'
      },
      {
        '10001': '销售额',
        '10002': '33831.112365722656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '33831.112365722656',
        '231102144451020': '技术',
        '231102144451025': '海口'
      },
      {
        '10001': '销售额',
        '10002': '46056.97550582886',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '46056.97550582886',
        '231102144451020': '办公用品',
        '231102144451025': '海口'
      },
      {
        '10001': '销售额',
        '10002': '41873.57958984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '41873.57958984375',
        '231102144451020': '家具',
        '231102144451025': '海口'
      },
      {
        '10001': '销售额',
        '10002': '3978.239990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3978.239990234375',
        '231102144451020': '家具',
        '231102144451025': '海城'
      },
      {
        '10001': '销售额',
        '10002': '195.38400268554688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '195.38400268554688',
        '231102144451020': '办公用品',
        '231102144451025': '海城'
      },
      {
        '10001': '销售额',
        '10002': '4073.916015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4073.916015625',
        '231102144451020': '技术',
        '231102144451025': '海城'
      },
      {
        '10001': '销售额',
        '10002': '327.8519973754883',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '327.8519973754883',
        '231102144451020': '办公用品',
        '231102144451025': '海州'
      },
      {
        '10001': '销售额',
        '10002': '3094.0560455322266',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3094.0560455322266',
        '231102144451020': '技术',
        '231102144451025': '海拉尔'
      },
      {
        '10001': '销售额',
        '10002': '7005.095855712891',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7005.095855712891',
        '231102144451020': '家具',
        '231102144451025': '海拉尔'
      },
      {
        '10001': '销售额',
        '10002': '1691.2840366363525',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1691.2840366363525',
        '231102144451020': '办公用品',
        '231102144451025': '海拉尔'
      },
      {
        '10001': '销售额',
        '10002': '7783.915866851807',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7783.915866851807',
        '231102144451020': '办公用品',
        '231102144451025': '海林'
      },
      {
        '10001': '销售额',
        '10002': '6377.419891357422',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6377.419891357422',
        '231102144451020': '技术',
        '231102144451025': '海林'
      },
      {
        '10001': '销售额',
        '10002': '177.8000030517578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '177.8000030517578',
        '231102144451020': '家具',
        '231102144451025': '海门'
      },
      {
        '10001': '销售额',
        '10002': '23053.09938812256',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23053.09938812256',
        '231102144451020': '办公用品',
        '231102144451025': '涟源'
      },
      {
        '10001': '销售额',
        '10002': '6047.999984741211',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6047.999984741211',
        '231102144451020': '技术',
        '231102144451025': '涟源'
      },
      {
        '10001': '销售额',
        '10002': '11872.454956054688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11872.454956054688',
        '231102144451020': '家具',
        '231102144451025': '涟源'
      },
      {
        '10001': '销售额',
        '10002': '1921.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1921.5',
        '231102144451020': '家具',
        '231102144451025': '涪陵'
      },
      {
        '10001': '销售额',
        '10002': '2838.751953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2838.751953125',
        '231102144451020': '技术',
        '231102144451025': '涪陵'
      },
      {
        '10001': '销售额',
        '10002': '1256.219970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1256.219970703125',
        '231102144451020': '家具',
        '231102144451025': '淡水'
      },
      {
        '10001': '销售额',
        '10002': '52.91999816894531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '52.91999816894531',
        '231102144451020': '办公用品',
        '231102144451025': '淡水'
      },
      {
        '10001': '销售额',
        '10002': '10554.460205078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10554.460205078125',
        '231102144451020': '技术',
        '231102144451025': '淮北'
      },
      {
        '10001': '销售额',
        '10002': '2777.8798828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2777.8798828125',
        '231102144451020': '家具',
        '231102144451025': '淮北'
      },
      {
        '10001': '销售额',
        '10002': '714.5600051879883',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '714.5600051879883',
        '231102144451020': '办公用品',
        '231102144451025': '淮北'
      },
      {
        '10001': '销售额',
        '10002': '9939.16015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9939.16015625',
        '231102144451020': '技术',
        '231102144451025': '淮南'
      },
      {
        '10001': '销售额',
        '10002': '2082.7799530029297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2082.7799530029297',
        '231102144451020': '家具',
        '231102144451025': '淮南'
      },
      {
        '10001': '销售额',
        '10002': '31004.09239578247',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '31004.09239578247',
        '231102144451020': '办公用品',
        '231102144451025': '淮南'
      },
      {
        '10001': '销售额',
        '10002': '11910.555908203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11910.555908203125',
        '231102144451020': '办公用品',
        '231102144451025': '淮阴'
      },
      {
        '10001': '销售额',
        '10002': '2328.563980102539',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2328.563980102539',
        '231102144451020': '技术',
        '231102144451025': '淮阴'
      },
      {
        '10001': '销售额',
        '10002': '3564.204071044922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3564.204071044922',
        '231102144451020': '家具',
        '231102144451025': '淮阴'
      },
      {
        '10001': '销售额',
        '10002': '87840.22702789307',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '87840.22702789307',
        '231102144451020': '办公用品',
        '231102144451025': '深圳'
      },
      {
        '10001': '销售额',
        '10002': '104206.33935546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '104206.33935546875',
        '231102144451020': '技术',
        '231102144451025': '深圳'
      },
      {
        '10001': '销售额',
        '10002': '98039.77485656738',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '98039.77485656738',
        '231102144451020': '家具',
        '231102144451025': '深圳'
      },
      {
        '10001': '销售额',
        '10002': '6747.43994140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6747.43994140625',
        '231102144451020': '技术',
        '231102144451025': '清远'
      },
      {
        '10001': '销售额',
        '10002': '7247.352294921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7247.352294921875',
        '231102144451020': '家具',
        '231102144451025': '清远'
      },
      {
        '10001': '销售额',
        '10002': '1295.1399993896484',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1295.1399993896484',
        '231102144451020': '办公用品',
        '231102144451025': '清远'
      },
      {
        '10001': '销售额',
        '10002': '5616.827880859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5616.827880859375',
        '231102144451020': '技术',
        '231102144451025': '温岭'
      },
      {
        '10001': '销售额',
        '10002': '4812.024055480957',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4812.024055480957',
        '231102144451020': '家具',
        '231102144451025': '温岭'
      },
      {
        '10001': '销售额',
        '10002': '3187.29598236084',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3187.29598236084',
        '231102144451020': '办公用品',
        '231102144451025': '温岭'
      },
      {
        '10001': '销售额',
        '10002': '15126.496070861816',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15126.496070861816',
        '231102144451020': '办公用品',
        '231102144451025': '温州'
      },
      {
        '10001': '销售额',
        '10002': '12619.600082397461',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12619.600082397461',
        '231102144451020': '家具',
        '231102144451025': '温州'
      },
      {
        '10001': '销售额',
        '10002': '22823.6400680542',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '22823.6400680542',
        '231102144451020': '技术',
        '231102144451025': '温州'
      },
      {
        '10001': '销售额',
        '10002': '22620.248046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '22620.248046875',
        '231102144451020': '家具',
        '231102144451025': '渭南'
      },
      {
        '10001': '销售额',
        '10002': '15449.560363769531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15449.560363769531',
        '231102144451020': '技术',
        '231102144451025': '渭南'
      },
      {
        '10001': '销售额',
        '10002': '26118.819396972656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '26118.819396972656',
        '231102144451020': '办公用品',
        '231102144451025': '渭南'
      },
      {
        '10001': '销售额',
        '10002': '1949.6399841308594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1949.6399841308594',
        '231102144451020': '家具',
        '231102144451025': '湖州'
      },
      {
        '10001': '销售额',
        '10002': '11758.57246017456',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11758.57246017456',
        '231102144451020': '办公用品',
        '231102144451025': '湖州'
      },
      {
        '10001': '销售额',
        '10002': '1128.2040100097656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1128.2040100097656',
        '231102144451020': '技术',
        '231102144451025': '湖州'
      },
      {
        '10001': '销售额',
        '10002': '3616.340057373047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3616.340057373047',
        '231102144451020': '办公用品',
        '231102144451025': '湘乡'
      },
      {
        '10001': '销售额',
        '10002': '1108.800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1108.800048828125',
        '231102144451020': '技术',
        '231102144451025': '湘乡'
      },
      {
        '10001': '销售额',
        '10002': '502.4880065917969',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '502.4880065917969',
        '231102144451020': '家具',
        '231102144451025': '湘乡'
      },
      {
        '10001': '销售额',
        '10002': '2840.7399673461914',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2840.7399673461914',
        '231102144451020': '办公用品',
        '231102144451025': '湘潭'
      },
      {
        '10001': '销售额',
        '10002': '5550.300109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5550.300109863281',
        '231102144451020': '技术',
        '231102144451025': '湘潭'
      },
      {
        '10001': '销售额',
        '10002': '24321.765991210938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24321.765991210938',
        '231102144451020': '家具',
        '231102144451025': '湘潭'
      },
      {
        '10001': '销售额',
        '10002': '10583.579940795898',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10583.579940795898',
        '231102144451020': '家具',
        '231102144451025': '湛江'
      },
      {
        '10001': '销售额',
        '10002': '21869.680152893066',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21869.680152893066',
        '231102144451020': '办公用品',
        '231102144451025': '湛江'
      },
      {
        '10001': '销售额',
        '10002': '17325.42025756836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17325.42025756836',
        '231102144451020': '技术',
        '231102144451025': '湛江'
      },
      {
        '10001': '销售额',
        '10002': '65.37999725341797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '65.37999725341797',
        '231102144451020': '办公用品',
        '231102144451025': '溪美'
      },
      {
        '10001': '销售额',
        '10002': '6343.008056640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6343.008056640625',
        '231102144451020': '家具',
        '231102144451025': '溪美'
      },
      {
        '10001': '销售额',
        '10002': '672.8400268554688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '672.8400268554688',
        '231102144451020': '技术',
        '231102144451025': '溪美'
      },
      {
        '10001': '销售额',
        '10002': '9544.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9544.5',
        '231102144451020': '技术',
        '231102144451025': '滁州'
      },
      {
        '10001': '销售额',
        '10002': '3520.5800170898438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3520.5800170898438',
        '231102144451020': '家具',
        '231102144451025': '滁州'
      },
      {
        '10001': '销售额',
        '10002': '2363.0040283203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2363.0040283203125',
        '231102144451020': '办公用品',
        '231102144451025': '滁州'
      },
      {
        '10001': '销售额',
        '10002': '31491.179779052734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '31491.179779052734',
        '231102144451020': '家具',
        '231102144451025': '滕州'
      },
      {
        '10001': '销售额',
        '10002': '12342.260192871094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12342.260192871094',
        '231102144451020': '技术',
        '231102144451025': '滕州'
      },
      {
        '10001': '销售额',
        '10002': '7663.600044250488',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7663.600044250488',
        '231102144451020': '办公用品',
        '231102144451025': '滕州'
      },
      {
        '10001': '销售额',
        '10002': '6926.97607421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6926.97607421875',
        '231102144451020': '技术',
        '231102144451025': '满洲里'
      },
      {
        '10001': '销售额',
        '10002': '2431.0440063476562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2431.0440063476562',
        '231102144451020': '办公用品',
        '231102144451025': '满洲里'
      },
      {
        '10001': '销售额',
        '10002': '4736.619888305664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4736.619888305664',
        '231102144451020': '办公用品',
        '231102144451025': '滴道'
      },
      {
        '10001': '销售额',
        '10002': '484.3999938964844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '484.3999938964844',
        '231102144451020': '家具',
        '231102144451025': '滴道'
      },
      {
        '10001': '销售额',
        '10002': '740.1800155639648',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '740.1800155639648',
        '231102144451020': '办公用品',
        '231102144451025': '漯河'
      },
      {
        '10001': '销售额',
        '10002': '2209.8720092773438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2209.8720092773438',
        '231102144451020': '家具',
        '231102144451025': '漯河'
      },
      {
        '10001': '销售额',
        '10002': '4278.119903564453',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4278.119903564453',
        '231102144451020': '技术',
        '231102144451025': '漯河'
      },
      {
        '10001': '销售额',
        '10002': '6030.5001220703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6030.5001220703125',
        '231102144451020': '家具',
        '231102144451025': '漳州'
      },
      {
        '10001': '销售额',
        '10002': '843.0800018310547',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '843.0800018310547',
        '231102144451020': '办公用品',
        '231102144451025': '漳州'
      },
      {
        '10001': '销售额',
        '10002': '1275.4000244140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1275.4000244140625',
        '231102144451020': '技术',
        '231102144451025': '漳州'
      },
      {
        '10001': '销售额',
        '10002': '29701.56007385254',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '29701.56007385254',
        '231102144451020': '办公用品',
        '231102144451025': '潍坊'
      },
      {
        '10001': '销售额',
        '10002': '26210.65951538086',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '26210.65951538086',
        '231102144451020': '技术',
        '231102144451025': '潍坊'
      },
      {
        '10001': '销售额',
        '10002': '11591.299926757812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11591.299926757812',
        '231102144451020': '家具',
        '231102144451025': '潍坊'
      },
      {
        '10001': '销售额',
        '10002': '6325.0321044921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6325.0321044921875',
        '231102144451020': '家具',
        '231102144451025': '潮州'
      },
      {
        '10001': '销售额',
        '10002': '24180.10009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24180.10009765625',
        '231102144451020': '技术',
        '231102144451025': '潮州'
      },
      {
        '10001': '销售额',
        '10002': '1885.968002319336',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1885.968002319336',
        '231102144451020': '办公用品',
        '231102144451025': '潮州'
      },
      {
        '10001': '销售额',
        '10002': '6005.35595703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6005.35595703125',
        '231102144451020': '家具',
        '231102144451025': '潼川'
      },
      {
        '10001': '销售额',
        '10002': '6104.195983886719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6104.195983886719',
        '231102144451020': '技术',
        '231102144451025': '潼川'
      },
      {
        '10001': '销售额',
        '10002': '5345.563980102539',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5345.563980102539',
        '231102144451020': '办公用品',
        '231102144451025': '潼川'
      },
      {
        '10001': '销售额',
        '10002': '2743.692108154297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2743.692108154297',
        '231102144451020': '家具',
        '231102144451025': '澄江'
      },
      {
        '10001': '销售额',
        '10002': '5254.031982421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5254.031982421875',
        '231102144451020': '技术',
        '231102144451025': '澄江'
      },
      {
        '10001': '销售额',
        '10002': '819.0279998779297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '819.0279998779297',
        '231102144451020': '办公用品',
        '231102144451025': '澄江'
      },
      {
        '10001': '销售额',
        '10002': '482.7200012207031',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '482.7200012207031',
        '231102144451020': '办公用品',
        '231102144451025': '濉溪'
      },
      {
        '10001': '销售额',
        '10002': '6585.263877868652',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6585.263877868652',
        '231102144451020': '办公用品',
        '231102144451025': '濮阳'
      },
      {
        '10001': '销售额',
        '10002': '3392.7319946289062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3392.7319946289062',
        '231102144451020': '家具',
        '231102144451025': '濮阳'
      },
      {
        '10001': '销售额',
        '10002': '685.719970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '685.719970703125',
        '231102144451020': '技术',
        '231102144451025': '濮阳'
      },
      {
        '10001': '销售额',
        '10002': '28042.700164794922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '28042.700164794922',
        '231102144451020': '技术',
        '231102144451025': '烟台'
      },
      {
        '10001': '销售额',
        '10002': '19655.300048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19655.300048828125',
        '231102144451020': '办公用品',
        '231102144451025': '烟台'
      },
      {
        '10001': '销售额',
        '10002': '12482.680053710938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12482.680053710938',
        '231102144451020': '家具',
        '231102144451025': '烟台'
      },
      {
        '10001': '销售额',
        '10002': '325.0799865722656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '325.0799865722656',
        '231102144451020': '办公用品',
        '231102144451025': '烟筒山'
      },
      {
        '10001': '销售额',
        '10002': '466.4800109863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '466.4800109863281',
        '231102144451020': '家具',
        '231102144451025': '烟筒山'
      },
      {
        '10001': '销售额',
        '10002': '5373.6201171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5373.6201171875',
        '231102144451020': '家具',
        '231102144451025': '焦作'
      },
      {
        '10001': '销售额',
        '10002': '2680.3839797973633',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2680.3839797973633',
        '231102144451020': '办公用品',
        '231102144451025': '焦作'
      },
      {
        '10001': '销售额',
        '10002': '15284.640380859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15284.640380859375',
        '231102144451020': '技术',
        '231102144451025': '焦作'
      },
      {
        '10001': '销售额',
        '10002': '5723.564014434814',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5723.564014434814',
        '231102144451020': '办公用品',
        '231102144451025': '牙克石'
      },
      {
        '10001': '销售额',
        '10002': '2437.6800231933594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2437.6800231933594',
        '231102144451020': '家具',
        '231102144451025': '牙克石'
      },
      {
        '10001': '销售额',
        '10002': '24172.51220703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24172.51220703125',
        '231102144451020': '技术',
        '231102144451025': '牙克石'
      },
      {
        '10001': '销售额',
        '10002': '7173.571998596191',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7173.571998596191',
        '231102144451020': '办公用品',
        '231102144451025': '牡丹江'
      },
      {
        '10001': '销售额',
        '10002': '30384.479736328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '30384.479736328125',
        '231102144451020': '技术',
        '231102144451025': '牡丹江'
      },
      {
        '10001': '销售额',
        '10002': '11855.34033203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11855.34033203125',
        '231102144451020': '家具',
        '231102144451025': '牡丹江'
      },
      {
        '10001': '销售额',
        '10002': '15116.500122070312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15116.500122070312',
        '231102144451020': '技术',
        '231102144451025': '玉林'
      },
      {
        '10001': '销售额',
        '10002': '1997.2399978637695',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1997.2399978637695',
        '231102144451020': '办公用品',
        '231102144451025': '玉林'
      },
      {
        '10001': '销售额',
        '10002': '1482.011962890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1482.011962890625',
        '231102144451020': '家具',
        '231102144451025': '玉林'
      },
      {
        '10001': '销售额',
        '10002': '348.0399913787842',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '348.0399913787842',
        '231102144451020': '办公用品',
        '231102144451025': '玉溪'
      },
      {
        '10001': '销售额',
        '10002': '16677.122009277344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16677.122009277344',
        '231102144451020': '家具',
        '231102144451025': '珠海'
      },
      {
        '10001': '销售额',
        '10002': '24847.172454833984',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24847.172454833984',
        '231102144451020': '办公用品',
        '231102144451025': '珠海'
      },
      {
        '10001': '销售额',
        '10002': '12069.39990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12069.39990234375',
        '231102144451020': '技术',
        '231102144451025': '珠海'
      },
      {
        '10001': '销售额',
        '10002': '2320.6399688720703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2320.6399688720703',
        '231102144451020': '办公用品',
        '231102144451025': '珲春'
      },
      {
        '10001': '销售额',
        '10002': '391.0199890136719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '391.0199890136719',
        '231102144451020': '办公用品',
        '231102144451025': '琼山'
      },
      {
        '10001': '销售额',
        '10002': '334.40399169921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '334.40399169921875',
        '231102144451020': '技术',
        '231102144451025': '瓦房店'
      },
      {
        '10001': '销售额',
        '10002': '141.62399291992188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '141.62399291992188',
        '231102144451020': '家具',
        '231102144451025': '瓦房店'
      },
      {
        '10001': '销售额',
        '10002': '2873.3040313720703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2873.3040313720703',
        '231102144451020': '办公用品',
        '231102144451025': '瓦房店'
      },
      {
        '10001': '销售额',
        '10002': '570.7799911499023',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '570.7799911499023',
        '231102144451020': '办公用品',
        '231102144451025': '甘南'
      },
      {
        '10001': '销售额',
        '10002': '1646.6800537109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1646.6800537109375',
        '231102144451020': '家具',
        '231102144451025': '甘南'
      },
      {
        '10001': '销售额',
        '10002': '2823.800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2823.800048828125',
        '231102144451020': '技术',
        '231102144451025': '甘南'
      },
      {
        '10001': '销售额',
        '10002': '4120.6900634765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4120.6900634765625',
        '231102144451020': '家具',
        '231102144451025': '界首'
      },
      {
        '10001': '销售额',
        '10002': '555.5200042724609',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '555.5200042724609',
        '231102144451020': '办公用品',
        '231102144451025': '界首'
      },
      {
        '10001': '销售额',
        '10002': '11089.680068969727',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11089.680068969727',
        '231102144451020': '办公用品',
        '231102144451025': '登封'
      },
      {
        '10001': '销售额',
        '10002': '7867.64990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7867.64990234375',
        '231102144451020': '家具',
        '231102144451025': '登封'
      },
      {
        '10001': '销售额',
        '10002': '468.7200012207031',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '468.7200012207031',
        '231102144451020': '家具',
        '231102144451025': '白城'
      },
      {
        '10001': '销售额',
        '10002': '696.780029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '696.780029296875',
        '231102144451020': '办公用品',
        '231102144451025': '白城'
      },
      {
        '10001': '销售额',
        '10002': '7081.2001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7081.2001953125',
        '231102144451020': '技术',
        '231102144451025': '白城'
      },
      {
        '10001': '销售额',
        '10002': '2876.719970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2876.719970703125',
        '231102144451020': '技术',
        '231102144451025': '白山'
      },
      {
        '10001': '销售额',
        '10002': '7041.160079956055',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7041.160079956055',
        '231102144451020': '办公用品',
        '231102144451025': '白山'
      },
      {
        '10001': '销售额',
        '10002': '341.0400085449219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '341.0400085449219',
        '231102144451020': '办公用品',
        '231102144451025': '白银'
      },
      {
        '10001': '销售额',
        '10002': '9842.364120483398',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9842.364120483398',
        '231102144451020': '办公用品',
        '231102144451025': '百色'
      },
      {
        '10001': '销售额',
        '10002': '5468.540092468262',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5468.540092468262',
        '231102144451020': '办公用品',
        '231102144451025': '皇岗'
      },
      {
        '10001': '销售额',
        '10002': '12747.83984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12747.83984375',
        '231102144451020': '技术',
        '231102144451025': '皇岗'
      },
      {
        '10001': '销售额',
        '10002': '17315.185668945312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17315.185668945312',
        '231102144451020': '家具',
        '231102144451025': '皇岗'
      },
      {
        '10001': '销售额',
        '10002': '27059.339721679688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '27059.339721679688',
        '231102144451020': '技术',
        '231102144451025': '益阳'
      },
      {
        '10001': '销售额',
        '10002': '7085.259998321533',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7085.259998321533',
        '231102144451020': '办公用品',
        '231102144451025': '益阳'
      },
      {
        '10001': '销售额',
        '10002': '9815.400085449219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9815.400085449219',
        '231102144451020': '家具',
        '231102144451025': '益阳'
      },
      {
        '10001': '销售额',
        '10002': '4256.56000328064',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4256.56000328064',
        '231102144451020': '办公用品',
        '231102144451025': '盐城'
      },
      {
        '10001': '销售额',
        '10002': '7940.01611328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7940.01611328125',
        '231102144451020': '技术',
        '231102144451025': '盐城'
      },
      {
        '10001': '销售额',
        '10002': '20862.408081054688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20862.408081054688',
        '231102144451020': '家具',
        '231102144451025': '盐城'
      },
      {
        '10001': '销售额',
        '10002': '6752.759994506836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6752.759994506836',
        '231102144451020': '家具',
        '231102144451025': '睢城'
      },
      {
        '10001': '销售额',
        '10002': '1829.85595703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1829.85595703125',
        '231102144451020': '技术',
        '231102144451025': '睢城'
      },
      {
        '10001': '销售额',
        '10002': '785.6519870758057',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '785.6519870758057',
        '231102144451020': '办公用品',
        '231102144451025': '睢城'
      },
      {
        '10001': '销售额',
        '10002': '5177.4801025390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5177.4801025390625',
        '231102144451020': '技术',
        '231102144451025': '石嘴山'
      },
      {
        '10001': '销售额',
        '10002': '4886.9521484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4886.9521484375',
        '231102144451020': '家具',
        '231102144451025': '石嘴山'
      },
      {
        '10001': '销售额',
        '10002': '9791.180160522461',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9791.180160522461',
        '231102144451020': '办公用品',
        '231102144451025': '石嘴山'
      },
      {
        '10001': '销售额',
        '10002': '47501.895416259766',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '47501.895416259766',
        '231102144451020': '家具',
        '231102144451025': '石家庄'
      },
      {
        '10001': '销售额',
        '10002': '45450.15982055664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '45450.15982055664',
        '231102144451020': '技术',
        '231102144451025': '石家庄'
      },
      {
        '10001': '销售额',
        '10002': '34605.059982299805',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '34605.059982299805',
        '231102144451020': '办公用品',
        '231102144451025': '石家庄'
      },
      {
        '10001': '销售额',
        '10002': '8438.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8438.5',
        '231102144451020': '技术',
        '231102144451025': '石桥'
      },
      {
        '10001': '销售额',
        '10002': '285.6000061035156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '285.6000061035156',
        '231102144451020': '办公用品',
        '231102144451025': '石桥'
      },
      {
        '10001': '销售额',
        '10002': '2219.9800415039062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2219.9800415039062',
        '231102144451020': '技术',
        '231102144451025': '石河子'
      },
      {
        '10001': '销售额',
        '10002': '2385.4600219726562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2385.4600219726562',
        '231102144451020': '家具',
        '231102144451025': '石河子'
      },
      {
        '10001': '销售额',
        '10002': '6501.880149841309',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6501.880149841309',
        '231102144451020': '办公用品',
        '231102144451025': '石河子'
      },
      {
        '10001': '销售额',
        '10002': '9129.680030822754',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9129.680030822754',
        '231102144451020': '办公用品',
        '231102144451025': '石炭井'
      },
      {
        '10001': '销售额',
        '10002': '1843.3800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1843.3800048828125',
        '231102144451020': '家具',
        '231102144451025': '石炭井'
      },
      {
        '10001': '销售额',
        '10002': '131.32000732421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '131.32000732421875',
        '231102144451020': '办公用品',
        '231102144451025': '石马'
      },
      {
        '10001': '销售额',
        '10002': '7614.879913330078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7614.879913330078',
        '231102144451020': '办公用品',
        '231102144451025': '石龙'
      },
      {
        '10001': '销售额',
        '10002': '4092.06005859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4092.06005859375',
        '231102144451020': '技术',
        '231102144451025': '石龙'
      },
      {
        '10001': '销售额',
        '10002': '623.280029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '623.280029296875',
        '231102144451020': '家具',
        '231102144451025': '石龙'
      },
      {
        '10001': '销售额',
        '10002': '619.9199829101562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '619.9199829101562',
        '231102144451020': '办公用品',
        '231102144451025': '碣石'
      },
      {
        '10001': '销售额',
        '10002': '4962.439910888672',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4962.439910888672',
        '231102144451020': '家具',
        '231102144451025': '磐石'
      },
      {
        '10001': '销售额',
        '10002': '2358.5799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2358.5799560546875',
        '231102144451020': '办公用品',
        '231102144451025': '磐石'
      },
      {
        '10001': '销售额',
        '10002': '8038.239990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8038.239990234375',
        '231102144451020': '技术',
        '231102144451025': '磐石'
      },
      {
        '10001': '销售额',
        '10002': '382.6199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '382.6199951171875',
        '231102144451020': '办公用品',
        '231102144451025': '禄步'
      },
      {
        '10001': '销售额',
        '10002': '21343.280029296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21343.280029296875',
        '231102144451020': '技术',
        '231102144451025': '福州'
      },
      {
        '10001': '销售额',
        '10002': '7270.62007522583',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7270.62007522583',
        '231102144451020': '办公用品',
        '231102144451025': '福州'
      },
      {
        '10001': '销售额',
        '10002': '49895.44012451172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '49895.44012451172',
        '231102144451020': '家具',
        '231102144451025': '福州'
      },
      {
        '10001': '销售额',
        '10002': '4057.620101928711',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4057.620101928711',
        '231102144451020': '办公用品',
        '231102144451025': '禹城'
      },
      {
        '10001': '销售额',
        '10002': '5671.9600830078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5671.9600830078125',
        '231102144451020': '技术',
        '231102144451025': '禹城'
      },
      {
        '10001': '销售额',
        '10002': '4816',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4816',
        '231102144451020': '家具',
        '231102144451025': '禹城'
      },
      {
        '10001': '销售额',
        '10002': '1126.0199890136719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1126.0199890136719',
        '231102144451020': '办公用品',
        '231102144451025': '禹州'
      },
      {
        '10001': '销售额',
        '10002': '7482.160217285156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7482.160217285156',
        '231102144451020': '技术',
        '231102144451025': '禹州'
      },
      {
        '10001': '销售额',
        '10002': '13874.419860839844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13874.419860839844',
        '231102144451020': '办公用品',
        '231102144451025': '秦皇岛'
      },
      {
        '10001': '销售额',
        '10002': '10958.080078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10958.080078125',
        '231102144451020': '技术',
        '231102144451025': '秦皇岛'
      },
      {
        '10001': '销售额',
        '10002': '38161.13049316406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '38161.13049316406',
        '231102144451020': '家具',
        '231102144451025': '秦皇岛'
      },
      {
        '10001': '销售额',
        '10002': '5558.363983154297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5558.363983154297',
        '231102144451020': '办公用品',
        '231102144451025': '绍兴'
      },
      {
        '10001': '销售额',
        '10002': '10901.016052246094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10901.016052246094',
        '231102144451020': '技术',
        '231102144451025': '绍兴'
      },
      {
        '10001': '销售额',
        '10002': '5656.727783203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5656.727783203125',
        '231102144451020': '家具',
        '231102144451025': '绍兴'
      },
      {
        '10001': '销售额',
        '10002': '9572.219818115234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9572.219818115234',
        '231102144451020': '家具',
        '231102144451025': '绥化'
      },
      {
        '10001': '销售额',
        '10002': '2900.10009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2900.10009765625',
        '231102144451020': '技术',
        '231102144451025': '绥化'
      },
      {
        '10001': '销售额',
        '10002': '13343.820053100586',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13343.820053100586',
        '231102144451020': '办公用品',
        '231102144451025': '绥化'
      },
      {
        '10001': '销售额',
        '10002': '1543.0799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1543.0799560546875',
        '231102144451020': '技术',
        '231102144451025': '绥棱'
      },
      {
        '10001': '销售额',
        '10002': '2798.040008544922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2798.040008544922',
        '231102144451020': '办公用品',
        '231102144451025': '绥棱'
      },
      {
        '10001': '销售额',
        '10002': '2116.2400512695312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2116.2400512695312',
        '231102144451020': '办公用品',
        '231102144451025': '绥芬河'
      },
      {
        '10001': '销售额',
        '10002': '5333.49609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5333.49609375',
        '231102144451020': '技术',
        '231102144451025': '绵阳'
      },
      {
        '10001': '销售额',
        '10002': '18855.56428527832',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18855.56428527832',
        '231102144451020': '家具',
        '231102144451025': '绵阳'
      },
      {
        '10001': '销售额',
        '10002': '11849.376071929932',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11849.376071929932',
        '231102144451020': '办公用品',
        '231102144451025': '绵阳'
      },
      {
        '10001': '销售额',
        '10002': '66.63999938964844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '66.63999938964844',
        '231102144451020': '办公用品',
        '231102144451025': '罗城'
      },
      {
        '10001': '销售额',
        '10002': '1923.1800537109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1923.1800537109375',
        '231102144451020': '家具',
        '231102144451025': '罗容'
      },
      {
        '10001': '销售额',
        '10002': '2926.895965576172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2926.895965576172',
        '231102144451020': '技术',
        '231102144451025': '老河口'
      },
      {
        '10001': '销售额',
        '10002': '11604.795928955078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11604.795928955078',
        '231102144451020': '办公用品',
        '231102144451025': '老河口'
      },
      {
        '10001': '销售额',
        '10002': '1564.0799560546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1564.0799560546875',
        '231102144451020': '家具',
        '231102144451025': '老河口'
      },
      {
        '10001': '销售额',
        '10002': '9883.999816894531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9883.999816894531',
        '231102144451020': '办公用品',
        '231102144451025': '耒阳'
      },
      {
        '10001': '销售额',
        '10002': '7972.285797119141',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7972.285797119141',
        '231102144451020': '家具',
        '231102144451025': '耒阳'
      },
      {
        '10001': '销售额',
        '10002': '16674.5604095459',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16674.5604095459',
        '231102144451020': '技术',
        '231102144451025': '耒阳'
      },
      {
        '10001': '销售额',
        '10002': '16381.539916992188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16381.539916992188',
        '231102144451020': '家具',
        '231102144451025': '聊城'
      },
      {
        '10001': '销售额',
        '10002': '18062.100219726562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18062.100219726562',
        '231102144451020': '技术',
        '231102144451025': '聊城'
      },
      {
        '10001': '销售额',
        '10002': '5254.339988708496',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5254.339988708496',
        '231102144451020': '办公用品',
        '231102144451025': '聊城'
      },
      {
        '10001': '销售额',
        '10002': '23057.216079711914',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '23057.216079711914',
        '231102144451020': '办公用品',
        '231102144451025': '肃州'
      },
      {
        '10001': '销售额',
        '10002': '25370.772106170654',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '25370.772106170654',
        '231102144451020': '家具',
        '231102144451025': '肃州'
      },
      {
        '10001': '销售额',
        '10002': '30343.90802001953',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '30343.90802001953',
        '231102144451020': '技术',
        '231102144451025': '肃州'
      },
      {
        '10001': '销售额',
        '10002': '1106.699951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1106.699951171875',
        '231102144451020': '技术',
        '231102144451025': '肇东'
      },
      {
        '10001': '销售额',
        '10002': '1152.760009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1152.760009765625',
        '231102144451020': '家具',
        '231102144451025': '肇东'
      },
      {
        '10001': '销售额',
        '10002': '30744.08380126953',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '30744.08380126953',
        '231102144451020': '家具',
        '231102144451025': '肇庆'
      },
      {
        '10001': '销售额',
        '10002': '20296.864196777344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20296.864196777344',
        '231102144451020': '办公用品',
        '231102144451025': '肇庆'
      },
      {
        '10001': '销售额',
        '10002': '10807.580017089844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10807.580017089844',
        '231102144451020': '技术',
        '231102144451025': '肇庆'
      },
      {
        '10001': '销售额',
        '10002': '6629.279968261719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6629.279968261719',
        '231102144451020': '技术',
        '231102144451025': '肇源'
      },
      {
        '10001': '销售额',
        '10002': '25919.879837036133',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '25919.879837036133',
        '231102144451020': '办公用品',
        '231102144451025': '肇源'
      },
      {
        '10001': '销售额',
        '10002': '7800.379959106445',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7800.379959106445',
        '231102144451020': '办公用品',
        '231102144451025': '胶南'
      },
      {
        '10001': '销售额',
        '10002': '31717.980102539062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '31717.980102539062',
        '231102144451020': '技术',
        '231102144451025': '胶南'
      },
      {
        '10001': '销售额',
        '10002': '17166.239959716797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17166.239959716797',
        '231102144451020': '家具',
        '231102144451025': '胶南'
      },
      {
        '10001': '销售额',
        '10002': '25317.0400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '25317.0400390625',
        '231102144451020': '家具',
        '231102144451025': '胶州'
      },
      {
        '10001': '销售额',
        '10002': '8596',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8596',
        '231102144451020': '技术',
        '231102144451025': '胶州'
      },
      {
        '10001': '销售额',
        '10002': '15383.899784088135',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15383.899784088135',
        '231102144451020': '办公用品',
        '231102144451025': '胶州'
      },
      {
        '10001': '销售额',
        '10002': '5190.5279541015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5190.5279541015625',
        '231102144451020': '家具',
        '231102144451025': '自贡'
      },
      {
        '10001': '销售额',
        '10002': '10510.079833984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10510.079833984375',
        '231102144451020': '技术',
        '231102144451025': '自贡'
      },
      {
        '10001': '销售额',
        '10002': '5980.911796569824',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5980.911796569824',
        '231102144451020': '办公用品',
        '231102144451025': '自贡'
      },
      {
        '10001': '销售额',
        '10002': '706.4400024414062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '706.4400024414062',
        '231102144451020': '办公用品',
        '231102144451025': '舒兰'
      },
      {
        '10001': '销售额',
        '10002': '2869.300048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2869.300048828125',
        '231102144451020': '家具',
        '231102144451025': '舒兰'
      },
      {
        '10001': '销售额',
        '10002': '3319.2598876953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3319.2598876953125',
        '231102144451020': '技术',
        '231102144451025': '舒兰'
      },
      {
        '10001': '销售额',
        '10002': '1924.0199432373047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1924.0199432373047',
        '231102144451020': '办公用品',
        '231102144451025': '良乡'
      },
      {
        '10001': '销售额',
        '10002': '18470.199935913086',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18470.199935913086',
        '231102144451020': '技术',
        '231102144451025': '芜湖'
      },
      {
        '10001': '销售额',
        '10002': '27675.479431152344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '27675.479431152344',
        '231102144451020': '家具',
        '231102144451025': '芜湖'
      },
      {
        '10001': '销售额',
        '10002': '10264.379989624023',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10264.379989624023',
        '231102144451020': '办公用品',
        '231102144451025': '芜湖'
      },
      {
        '10001': '销售额',
        '10002': '846.4680023193359',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '846.4680023193359',
        '231102144451020': '办公用品',
        '231102144451025': '苏家屯'
      },
      {
        '10001': '销售额',
        '10002': '19560.576028823853',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19560.576028823853',
        '231102144451020': '办公用品',
        '231102144451025': '苏州'
      },
      {
        '10001': '销售额',
        '10002': '32967.48013305664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '32967.48013305664',
        '231102144451020': '家具',
        '231102144451025': '苏州'
      },
      {
        '10001': '销售额',
        '10002': '9567.348052978516',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9567.348052978516',
        '231102144451020': '技术',
        '231102144451025': '苏州'
      },
      {
        '10001': '销售额',
        '10002': '583.1840133666992',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '583.1840133666992',
        '231102144451020': '办公用品',
        '231102144451025': '荆州'
      },
      {
        '10001': '销售额',
        '10002': '4035.6959838867188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4035.6959838867188',
        '231102144451020': '技术',
        '231102144451025': '荆州'
      },
      {
        '10001': '销售额',
        '10002': '8386.056030273438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8386.056030273438',
        '231102144451020': '家具',
        '231102144451025': '荆州'
      },
      {
        '10001': '销售额',
        '10002': '1790.0959720611572',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1790.0959720611572',
        '231102144451020': '办公用品',
        '231102144451025': '荆门'
      },
      {
        '10001': '销售额',
        '10002': '12966.492126464844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12966.492126464844',
        '231102144451020': '技术',
        '231102144451025': '荆门'
      },
      {
        '10001': '销售额',
        '10002': '2985.0799713134766',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2985.0799713134766',
        '231102144451020': '办公用品',
        '231102144451025': '荔城'
      },
      {
        '10001': '销售额',
        '10002': '1448.5800170898438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1448.5800170898438',
        '231102144451020': '技术',
        '231102144451025': '荔城'
      },
      {
        '10001': '销售额',
        '10002': '9318.40005493164',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9318.40005493164',
        '231102144451020': '办公用品',
        '231102144451025': '莆田'
      },
      {
        '10001': '销售额',
        '10002': '34223.979583740234',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '34223.979583740234',
        '231102144451020': '技术',
        '231102144451025': '莆田'
      },
      {
        '10001': '销售额',
        '10002': '4665.219970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4665.219970703125',
        '231102144451020': '家具',
        '231102144451025': '莆田'
      },
      {
        '10001': '销售额',
        '10002': '808.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '808.5',
        '231102144451020': '技术',
        '231102144451025': '莎车'
      },
      {
        '10001': '销售额',
        '10002': '14512.400207519531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14512.400207519531',
        '231102144451020': '办公用品',
        '231102144451025': '莎车'
      },
      {
        '10001': '销售额',
        '10002': '1390.6200103759766',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1390.6200103759766',
        '231102144451020': '办公用品',
        '231102144451025': '莘县'
      },
      {
        '10001': '销售额',
        '10002': '2335.6201171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2335.6201171875',
        '231102144451020': '技术',
        '231102144451025': '莘县'
      },
      {
        '10001': '销售额',
        '10002': '10651.479736328125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10651.479736328125',
        '231102144451020': '技术',
        '231102144451025': '莱州'
      },
      {
        '10001': '销售额',
        '10002': '2965.3400268554688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2965.3400268554688',
        '231102144451020': '办公用品',
        '231102144451025': '莱州'
      },
      {
        '10001': '销售额',
        '10002': '8368.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8368.5',
        '231102144451020': '技术',
        '231102144451025': '莱芜'
      },
      {
        '10001': '销售额',
        '10002': '2266.6000213623047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2266.6000213623047',
        '231102144451020': '办公用品',
        '231102144451025': '莱芜'
      },
      {
        '10001': '销售额',
        '10002': '8908.200164794922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8908.200164794922',
        '231102144451020': '家具',
        '231102144451025': '莱芜'
      },
      {
        '10001': '销售额',
        '10002': '4945.080078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4945.080078125',
        '231102144451020': '技术',
        '231102144451025': '莱阳'
      },
      {
        '10001': '销售额',
        '10002': '12693.239852905273',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12693.239852905273',
        '231102144451020': '办公用品',
        '231102144451025': '莱阳'
      },
      {
        '10001': '销售额',
        '10002': '7360.471984863281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7360.471984863281',
        '231102144451020': '家具',
        '231102144451025': '莱阳'
      },
      {
        '10001': '销售额',
        '10002': '12212.48046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12212.48046875',
        '231102144451020': '技术',
        '231102144451025': '菏泽'
      },
      {
        '10001': '销售额',
        '10002': '4921.000022888184',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4921.000022888184',
        '231102144451020': '办公用品',
        '231102144451025': '菏泽'
      },
      {
        '10001': '销售额',
        '10002': '6546.68017578125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6546.68017578125',
        '231102144451020': '家具',
        '231102144451025': '菏泽'
      },
      {
        '10001': '销售额',
        '10002': '15479.660034179688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15479.660034179688',
        '231102144451020': '家具',
        '231102144451025': '萍乡'
      },
      {
        '10001': '销售额',
        '10002': '8715.279907226562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8715.279907226562',
        '231102144451020': '技术',
        '231102144451025': '萍乡'
      },
      {
        '10001': '销售额',
        '10002': '4063.7800903320312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4063.7800903320312',
        '231102144451020': '办公用品',
        '231102144451025': '萍乡'
      },
      {
        '10001': '销售额',
        '10002': '10094.952053070068',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10094.952053070068',
        '231102144451020': '办公用品',
        '231102144451025': '营口'
      },
      {
        '10001': '销售额',
        '10002': '14565.516006469727',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14565.516006469727',
        '231102144451020': '技术',
        '231102144451025': '营口'
      },
      {
        '10001': '销售额',
        '10002': '11043.05990600586',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11043.05990600586',
        '231102144451020': '家具',
        '231102144451025': '营口'
      },
      {
        '10001': '销售额',
        '10002': '3913.419952392578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3913.419952392578',
        '231102144451020': '技术',
        '231102144451025': '蒙阴'
      },
      {
        '10001': '销售额',
        '10002': '13406.679931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13406.679931640625',
        '231102144451020': '家具',
        '231102144451025': '蒙阴'
      },
      {
        '10001': '销售额',
        '10002': '1701.6999893188477',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1701.6999893188477',
        '231102144451020': '办公用品',
        '231102144451025': '蒙阴'
      },
      {
        '10001': '销售额',
        '10002': '1530.14404296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1530.14404296875',
        '231102144451020': '技术',
        '231102144451025': '蒲圻'
      },
      {
        '10001': '销售额',
        '10002': '1476.4679870605469',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1476.4679870605469',
        '231102144451020': '家具',
        '231102144451025': '蒲圻'
      },
      {
        '10001': '销售额',
        '10002': '1608.9640197753906',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1608.9640197753906',
        '231102144451020': '办公用品',
        '231102144451025': '蒲圻'
      },
      {
        '10001': '销售额',
        '10002': '1664.1800079345703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1664.1800079345703',
        '231102144451020': '办公用品',
        '231102144451025': '蒲庙'
      },
      {
        '10001': '销售额',
        '10002': '5082.0001220703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5082.0001220703125',
        '231102144451020': '技术',
        '231102144451025': '蒲庙'
      },
      {
        '10001': '销售额',
        '10002': '5791.337890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5791.337890625',
        '231102144451020': '家具',
        '231102144451025': '蒲庙'
      },
      {
        '10001': '销售额',
        '10002': '4775.679992675781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4775.679992675781',
        '231102144451020': '技术',
        '231102144451025': '蓬莱'
      },
      {
        '10001': '销售额',
        '10002': '7087.499969482422',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7087.499969482422',
        '231102144451020': '办公用品',
        '231102144451025': '蓬莱'
      },
      {
        '10001': '销售额',
        '10002': '281.5679931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '281.5679931640625',
        '231102144451020': '技术',
        '231102144451025': '蔡甸'
      },
      {
        '10001': '销售额',
        '10002': '2090.675968170166',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2090.675968170166',
        '231102144451020': '办公用品',
        '231102144451025': '蔡甸'
      },
      {
        '10001': '销售额',
        '10002': '959.6160278320312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '959.6160278320312',
        '231102144451020': '家具',
        '231102144451025': '虎石台'
      },
      {
        '10001': '销售额',
        '10002': '5791.337890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5791.337890625',
        '231102144451020': '家具',
        '231102144451025': '虎门'
      },
      {
        '10001': '销售额',
        '10002': '1652.56005859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1652.56005859375',
        '231102144451020': '技术',
        '231102144451025': '虢镇'
      },
      {
        '10001': '销售额',
        '10002': '98.41999816894531',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '98.41999816894531',
        '231102144451020': '办公用品',
        '231102144451025': '虢镇'
      },
      {
        '10001': '销售额',
        '10002': '19559.959991455078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19559.959991455078',
        '231102144451020': '技术',
        '231102144451025': '蚌埠'
      },
      {
        '10001': '销售额',
        '10002': '11222.8203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11222.8203125',
        '231102144451020': '家具',
        '231102144451025': '蚌埠'
      },
      {
        '10001': '销售额',
        '10002': '11409.860034942627',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11409.860034942627',
        '231102144451020': '办公用品',
        '231102144451025': '蚌埠'
      },
      {
        '10001': '销售额',
        '10002': '1515.9199829101562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1515.9199829101562',
        '231102144451020': '办公用品',
        '231102144451025': '蛟河'
      },
      {
        '10001': '销售额',
        '10002': '15182.720458984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15182.720458984375',
        '231102144451020': '技术',
        '231102144451025': '蛟河'
      },
      {
        '10001': '销售额',
        '10002': '1721.1600341796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1721.1600341796875',
        '231102144451020': '家具',
        '231102144451025': '蛟河'
      },
      {
        '10001': '销售额',
        '10002': '5234.7401123046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5234.7401123046875',
        '231102144451020': '技术',
        '231102144451025': '衡水'
      },
      {
        '10001': '销售额',
        '10002': '1507.6600036621094',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1507.6600036621094',
        '231102144451020': '办公用品',
        '231102144451025': '衡水'
      },
      {
        '10001': '销售额',
        '10002': '1143.52001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1143.52001953125',
        '231102144451020': '家具',
        '231102144451025': '衡水'
      },
      {
        '10001': '销售额',
        '10002': '22999.787647247314',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '22999.787647247314',
        '231102144451020': '办公用品',
        '231102144451025': '衡阳'
      },
      {
        '10001': '销售额',
        '10002': '5720.904022216797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5720.904022216797',
        '231102144451020': '家具',
        '231102144451025': '衡阳'
      },
      {
        '10001': '销售额',
        '10002': '20525.39990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20525.39990234375',
        '231102144451020': '技术',
        '231102144451025': '衡阳'
      },
      {
        '10001': '销售额',
        '10002': '2122.512008666992',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2122.512008666992',
        '231102144451020': '办公用品',
        '231102144451025': '衢州'
      },
      {
        '10001': '销售额',
        '10002': '185.9759979248047',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '185.9759979248047',
        '231102144451020': '技术',
        '231102144451025': '衢州'
      },
      {
        '10001': '销售额',
        '10002': '1443.7080078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1443.7080078125',
        '231102144451020': '家具',
        '231102144451025': '衢州'
      },
      {
        '10001': '销售额',
        '10002': '11415.36198425293',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11415.36198425293',
        '231102144451020': '家具',
        '231102144451025': '襄城'
      },
      {
        '10001': '销售额',
        '10002': '3289.2719650268555',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3289.2719650268555',
        '231102144451020': '办公用品',
        '231102144451025': '襄城'
      },
      {
        '10001': '销售额',
        '10002': '19299.28005218506',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19299.28005218506',
        '231102144451020': '办公用品',
        '231102144451025': '襄樊'
      },
      {
        '10001': '销售额',
        '10002': '41923.13995361328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '41923.13995361328',
        '231102144451020': '技术',
        '231102144451025': '襄樊'
      },
      {
        '10001': '销售额',
        '10002': '12152.195831298828',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12152.195831298828',
        '231102144451020': '家具',
        '231102144451025': '襄樊'
      },
      {
        '10001': '销售额',
        '10002': '3351.011993408203',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3351.011993408203',
        '231102144451020': '家具',
        '231102144451025': '西丰'
      },
      {
        '10001': '销售额',
        '10002': '146.16000366210938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '146.16000366210938',
        '231102144451020': '办公用品',
        '231102144451025': '西丰'
      },
      {
        '10001': '销售额',
        '10002': '9199.427978515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9199.427978515625',
        '231102144451020': '技术',
        '231102144451025': '西丰'
      },
      {
        '10001': '销售额',
        '10002': '269.3599853515625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '269.3599853515625',
        '231102144451020': '办公用品',
        '231102144451025': '西乡'
      },
      {
        '10001': '销售额',
        '10002': '5030.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5030.47998046875',
        '231102144451020': '技术',
        '231102144451025': '西华'
      },
      {
        '10001': '销售额',
        '10002': '1230.8519897460938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1230.8519897460938',
        '231102144451020': '办公用品',
        '231102144451025': '西华'
      },
      {
        '10001': '销售额',
        '10002': '16289.980072021484',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16289.980072021484',
        '231102144451020': '办公用品',
        '231102144451025': '西宁'
      },
      {
        '10001': '销售额',
        '10002': '24614.099639892578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24614.099639892578',
        '231102144451020': '家具',
        '231102144451025': '西宁'
      },
      {
        '10001': '销售额',
        '10002': '8959.300231933594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8959.300231933594',
        '231102144451020': '技术',
        '231102144451025': '西宁'
      },
      {
        '10001': '销售额',
        '10002': '64227.52006530762',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '64227.52006530762',
        '231102144451020': '技术',
        '231102144451025': '西安'
      },
      {
        '10001': '销售额',
        '10002': '54991.7200012207',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '54991.7200012207',
        '231102144451020': '办公用品',
        '231102144451025': '西安'
      },
      {
        '10001': '销售额',
        '10002': '107460.35972595215',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '107460.35972595215',
        '231102144451020': '家具',
        '231102144451025': '西安'
      },
      {
        '10001': '销售额',
        '10002': '4785.732177734375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4785.732177734375',
        '231102144451020': '家具',
        '231102144451025': '西昌'
      },
      {
        '10001': '销售额',
        '10002': '1893.4159927368164',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1893.4159927368164',
        '231102144451020': '办公用品',
        '231102144451025': '西昌'
      },
      {
        '10001': '销售额',
        '10002': '1800.5120239257812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1800.5120239257812',
        '231102144451020': '办公用品',
        '231102144451025': '让胡路'
      },
      {
        '10001': '销售额',
        '10002': '4789.427932739258',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4789.427932739258',
        '231102144451020': '办公用品',
        '231102144451025': '讷河'
      },
      {
        '10001': '销售额',
        '10002': '3360.2099609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3360.2099609375',
        '231102144451020': '家具',
        '231102144451025': '讷河'
      },
      {
        '10001': '销售额',
        '10002': '17811.640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17811.640625',
        '231102144451020': '技术',
        '231102144451025': '许昌'
      },
      {
        '10001': '销售额',
        '10002': '10347.483596801758',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10347.483596801758',
        '231102144451020': '家具',
        '231102144451025': '许昌'
      },
      {
        '10001': '销售额',
        '10002': '2778.299964904785',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2778.299964904785',
        '231102144451020': '办公用品',
        '231102144451025': '许昌'
      },
      {
        '10001': '销售额',
        '10002': '786.9119873046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '786.9119873046875',
        '231102144451020': '技术',
        '231102144451025': '诸暨'
      },
      {
        '10001': '销售额',
        '10002': '2783.6199493408203',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2783.6199493408203',
        '231102144451020': '办公用品',
        '231102144451025': '诸暨'
      },
      {
        '10001': '销售额',
        '10002': '4524.940002441406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4524.940002441406',
        '231102144451020': '办公用品',
        '231102144451025': '贵溪'
      },
      {
        '10001': '销售额',
        '10002': '3045.840087890625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3045.840087890625',
        '231102144451020': '技术',
        '231102144451025': '贵溪'
      },
      {
        '10001': '销售额',
        '10002': '13458.339935302734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13458.339935302734',
        '231102144451020': '家具',
        '231102144451025': '贵阳'
      },
      {
        '10001': '销售额',
        '10002': '9649.696044921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9649.696044921875',
        '231102144451020': '技术',
        '231102144451025': '贵阳'
      },
      {
        '10001': '销售额',
        '10002': '8493.659885406494',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8493.659885406494',
        '231102144451020': '办公用品',
        '231102144451025': '贵阳'
      },
      {
        '10001': '销售额',
        '10002': '1598.3519897460938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1598.3519897460938',
        '231102144451020': '技术',
        '231102144451025': '赤峰'
      },
      {
        '10001': '销售额',
        '10002': '10219.804191589355',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10219.804191589355',
        '231102144451020': '办公用品',
        '231102144451025': '赤峰'
      },
      {
        '10001': '销售额',
        '10002': '2521.1199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2521.1199951171875',
        '231102144451020': '家具',
        '231102144451025': '辉南'
      },
      {
        '10001': '销售额',
        '10002': '1539.1600189208984',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1539.1600189208984',
        '231102144451020': '办公用品',
        '231102144451025': '辉南'
      },
      {
        '10001': '销售额',
        '10002': '3965.639892578125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3965.639892578125',
        '231102144451020': '办公用品',
        '231102144451025': '辛置'
      },
      {
        '10001': '销售额',
        '10002': '1608.1800537109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1608.1800537109375',
        '231102144451020': '家具',
        '231102144451025': '辛置'
      },
      {
        '10001': '销售额',
        '10002': '922.5999755859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '922.5999755859375',
        '231102144451020': '办公用品',
        '231102144451025': '辛集'
      },
      {
        '10001': '销售额',
        '10002': '2462.8798828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2462.8798828125',
        '231102144451020': '家具',
        '231102144451025': '辛集'
      },
      {
        '10001': '销售额',
        '10002': '1643.4600524902344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1643.4600524902344',
        '231102144451020': '技术',
        '231102144451025': '边庄'
      },
      {
        '10001': '销售额',
        '10002': '1680.699951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1680.699951171875',
        '231102144451020': '办公用品',
        '231102144451025': '边庄'
      },
      {
        '10001': '销售额',
        '10002': '1815.7440795898438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1815.7440795898438',
        '231102144451020': '技术',
        '231102144451025': '辽中'
      },
      {
        '10001': '销售额',
        '10002': '372.03600311279297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '372.03600311279297',
        '231102144451020': '办公用品',
        '231102144451025': '辽中'
      },
      {
        '10001': '销售额',
        '10002': '3795.904006958008',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3795.904006958008',
        '231102144451020': '办公用品',
        '231102144451025': '辽源'
      },
      {
        '10001': '销售额',
        '10002': '16752.959838867188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16752.959838867188',
        '231102144451020': '技术',
        '231102144451025': '辽源'
      },
      {
        '10001': '销售额',
        '10002': '5267.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5267.5',
        '231102144451020': '家具',
        '231102144451025': '辽源'
      },
      {
        '10001': '销售额',
        '10002': '10385.340047836304',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10385.340047836304',
        '231102144451020': '办公用品',
        '231102144451025': '辽阳'
      },
      {
        '10001': '销售额',
        '10002': '6738.816131591797',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6738.816131591797',
        '231102144451020': '技术',
        '231102144451025': '辽阳'
      },
      {
        '10001': '销售额',
        '10002': '8986.739883422852',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8986.739883422852',
        '231102144451020': '家具',
        '231102144451025': '辽阳'
      },
      {
        '10001': '销售额',
        '10002': '8741.60009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8741.60009765625',
        '231102144451020': '技术',
        '231102144451025': '运城'
      },
      {
        '10001': '销售额',
        '10002': '8389.919921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8389.919921875',
        '231102144451020': '办公用品',
        '231102144451025': '运城'
      },
      {
        '10001': '销售额',
        '10002': '12094.145141601562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12094.145141601562',
        '231102144451020': '家具',
        '231102144451025': '运城'
      },
      {
        '10001': '销售额',
        '10002': '2021.8800048828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2021.8800048828125',
        '231102144451020': '技术',
        '231102144451025': '连然'
      },
      {
        '10001': '销售额',
        '10002': '49.70000076293945',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '49.70000076293945',
        '231102144451020': '办公用品',
        '231102144451025': '连然'
      },
      {
        '10001': '销售额',
        '10002': '1182.719970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1182.719970703125',
        '231102144451020': '家具',
        '231102144451025': '连然'
      },
      {
        '10001': '销售额',
        '10002': '1398.0400085449219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1398.0400085449219',
        '231102144451020': '办公用品',
        '231102144451025': '通州'
      },
      {
        '10001': '销售额',
        '10002': '8572.70401096344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8572.70401096344',
        '231102144451020': '办公用品',
        '231102144451025': '通辽'
      },
      {
        '10001': '销售额',
        '10002': '5265.707946777344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5265.707946777344',
        '231102144451020': '家具',
        '231102144451025': '通辽'
      },
      {
        '10001': '销售额',
        '10002': '1665.2159423828125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1665.2159423828125',
        '231102144451020': '技术',
        '231102144451025': '通辽'
      },
      {
        '10001': '销售额',
        '10002': '1900.416015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1900.416015625',
        '231102144451020': '技术',
        '231102144451025': '遂宁'
      },
      {
        '10001': '销售额',
        '10002': '1998.555980682373',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1998.555980682373',
        '231102144451020': '办公用品',
        '231102144451025': '遂宁'
      },
      {
        '10001': '销售额',
        '10002': '2090.0040283203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2090.0040283203125',
        '231102144451020': '家具',
        '231102144451025': '遂宁'
      },
      {
        '10001': '销售额',
        '10002': '9649.080070495605',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9649.080070495605',
        '231102144451020': '办公用品',
        '231102144451025': '遵义'
      },
      {
        '10001': '销售额',
        '10002': '11277.419677734375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11277.419677734375',
        '231102144451020': '家具',
        '231102144451025': '遵义'
      },
      {
        '10001': '销售额',
        '10002': '11753.47607421875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11753.47607421875',
        '231102144451020': '技术',
        '231102144451025': '遵义'
      },
      {
        '10001': '销售额',
        '10002': '10907.120071411133',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10907.120071411133',
        '231102144451020': '技术',
        '231102144451025': '邓州'
      },
      {
        '10001': '销售额',
        '10002': '3230.919952392578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3230.919952392578',
        '231102144451020': '办公用品',
        '231102144451025': '邓州'
      },
      {
        '10001': '销售额',
        '10002': '11245.5',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11245.5',
        '231102144451020': '家具',
        '231102144451025': '邓州'
      },
      {
        '10001': '销售额',
        '10002': '10921.400074005127',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10921.400074005127',
        '231102144451020': '办公用品',
        '231102144451025': '邢台'
      },
      {
        '10001': '销售额',
        '10002': '14311.2197265625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14311.2197265625',
        '231102144451020': '家具',
        '231102144451025': '邢台'
      },
      {
        '10001': '销售额',
        '10002': '31004.259704589844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '31004.259704589844',
        '231102144451020': '技术',
        '231102144451025': '邢台'
      },
      {
        '10001': '销售额',
        '10002': '5578.859909057617',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5578.859909057617',
        '231102144451020': '办公用品',
        '231102144451025': '那曲'
      },
      {
        '10001': '销售额',
        '10002': '15521.7998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15521.7998046875',
        '231102144451020': '技术',
        '231102144451025': '邯郸'
      },
      {
        '10001': '销售额',
        '10002': '31866.169509887695',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '31866.169509887695',
        '231102144451020': '家具',
        '231102144451025': '邯郸'
      },
      {
        '10001': '销售额',
        '10002': '10573.919906616211',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10573.919906616211',
        '231102144451020': '办公用品',
        '231102144451025': '邯郸'
      },
      {
        '10001': '销售额',
        '10002': '9405.171997070312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9405.171997070312',
        '231102144451020': '家具',
        '231102144451025': '邳州'
      },
      {
        '10001': '销售额',
        '10002': '815.8079986572266',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '815.8079986572266',
        '231102144451020': '办公用品',
        '231102144451025': '邳州'
      },
      {
        '10001': '销售额',
        '10002': '2039.4360046386719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2039.4360046386719',
        '231102144451020': '技术',
        '231102144451025': '邳州'
      },
      {
        '10001': '销售额',
        '10002': '7120.679931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7120.679931640625',
        '231102144451020': '家具',
        '231102144451025': '邵武'
      },
      {
        '10001': '销售额',
        '10002': '957.8800010681152',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '957.8800010681152',
        '231102144451020': '办公用品',
        '231102144451025': '邵武'
      },
      {
        '10001': '销售额',
        '10002': '15432.759887695312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15432.759887695312',
        '231102144451020': '技术',
        '231102144451025': '邵武'
      },
      {
        '10001': '销售额',
        '10002': '839.4400024414062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '839.4400024414062',
        '231102144451020': '办公用品',
        '231102144451025': '郑家屯'
      },
      {
        '10001': '销售额',
        '10002': '57568.420166015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '57568.420166015625',
        '231102144451020': '技术',
        '231102144451025': '郑州'
      },
      {
        '10001': '销售额',
        '10002': '42841.65214538574',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '42841.65214538574',
        '231102144451020': '办公用品',
        '231102144451025': '郑州'
      },
      {
        '10001': '销售额',
        '10002': '37946.944412231445',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '37946.944412231445',
        '231102144451020': '家具',
        '231102144451025': '郑州'
      },
      {
        '10001': '销售额',
        '10002': '5520.31201171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5520.31201171875',
        '231102144451020': '家具',
        '231102144451025': '郴州'
      },
      {
        '10001': '销售额',
        '10002': '364.55999755859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '364.55999755859375',
        '231102144451020': '办公用品',
        '231102144451025': '郴州'
      },
      {
        '10001': '销售额',
        '10002': '9998.099914550781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9998.099914550781',
        '231102144451020': '技术',
        '231102144451025': '郸城'
      },
      {
        '10001': '销售额',
        '10002': '3900.0919799804688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3900.0919799804688',
        '231102144451020': '家具',
        '231102144451025': '郸城'
      },
      {
        '10001': '销售额',
        '10002': '3009.719985961914',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3009.719985961914',
        '231102144451020': '办公用品',
        '231102144451025': '郸城'
      },
      {
        '10001': '销售额',
        '10002': '3777.2001037597656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3777.2001037597656',
        '231102144451020': '办公用品',
        '231102144451025': '都匀'
      },
      {
        '10001': '销售额',
        '10002': '4494.419982910156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4494.419982910156',
        '231102144451020': '家具',
        '231102144451025': '都匀'
      },
      {
        '10001': '销售额',
        '10002': '2601.3679161071777',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2601.3679161071777',
        '231102144451020': '办公用品',
        '231102144451025': '鄂州'
      },
      {
        '10001': '销售额',
        '10002': '12013.876037597656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12013.876037597656',
        '231102144451020': '家具',
        '231102144451025': '鄂州'
      },
      {
        '10001': '销售额',
        '10002': '9618.83999633789',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9618.83999633789',
        '231102144451020': '技术',
        '231102144451025': '鄂州'
      },
      {
        '10001': '销售额',
        '10002': '1168.43994140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1168.43994140625',
        '231102144451020': '技术',
        '231102144451025': '鄱阳'
      },
      {
        '10001': '销售额',
        '10002': '1989.9600219726562',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1989.9600219726562',
        '231102144451020': '办公用品',
        '231102144451025': '鄱阳'
      },
      {
        '10001': '销售额',
        '10002': '11158.5595703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11158.5595703125',
        '231102144451020': '家具',
        '231102144451025': '鄱阳'
      },
      {
        '10001': '销售额',
        '10002': '17050.31997680664',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17050.31997680664',
        '231102144451020': '办公用品',
        '231102144451025': '醴陵'
      },
      {
        '10001': '销售额',
        '10002': '5149.6201171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5149.6201171875',
        '231102144451020': '技术',
        '231102144451025': '醴陵'
      },
      {
        '10001': '销售额',
        '10002': '63009.6598777771',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '63009.6598777771',
        '231102144451020': '办公用品',
        '231102144451025': '重庆'
      },
      {
        '10001': '销售额',
        '10002': '101070.6485824585',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '101070.6485824585',
        '231102144451020': '家具',
        '231102144451025': '重庆'
      },
      {
        '10001': '销售额',
        '10002': '111559.47547912598',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '111559.47547912598',
        '231102144451020': '技术',
        '231102144451025': '重庆'
      },
      {
        '10001': '销售额',
        '10002': '3181.751884460449',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3181.751884460449',
        '231102144451020': '办公用品',
        '231102144451025': '金乡'
      },
      {
        '10001': '销售额',
        '10002': '6599.963836669922',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6599.963836669922',
        '231102144451020': '家具',
        '231102144451025': '金华'
      },
      {
        '10001': '销售额',
        '10002': '13529.459716796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13529.459716796875',
        '231102144451020': '技术',
        '231102144451025': '金华'
      },
      {
        '10001': '销售额',
        '10002': '4897.479934692383',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4897.479934692383',
        '231102144451020': '办公用品',
        '231102144451025': '金华'
      },
      {
        '10001': '销售额',
        '10002': '8250.73193359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8250.73193359375',
        '231102144451020': '家具',
        '231102144451025': '金昌'
      },
      {
        '10001': '销售额',
        '10002': '1007.5800170898438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1007.5800170898438',
        '231102144451020': '技术',
        '231102144451025': '金昌'
      },
      {
        '10001': '销售额',
        '10002': '2175.432014465332',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2175.432014465332',
        '231102144451020': '办公用品',
        '231102144451025': '金昌'
      },
      {
        '10001': '销售额',
        '10002': '903.2519683837891',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '903.2519683837891',
        '231102144451020': '办公用品',
        '231102144451025': '金沙'
      },
      {
        '10001': '销售额',
        '10002': '4428.1439208984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4428.1439208984375',
        '231102144451020': '家具',
        '231102144451025': '金沙'
      },
      {
        '10001': '销售额',
        '10002': '560.447998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '560.447998046875',
        '231102144451020': '技术',
        '231102144451025': '金沙'
      },
      {
        '10001': '销售额',
        '10002': '6402.143829345703',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6402.143829345703',
        '231102144451020': '技术',
        '231102144451025': '钟祥'
      },
      {
        '10001': '销售额',
        '10002': '5056.043998718262',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5056.043998718262',
        '231102144451020': '办公用品',
        '231102144451025': '钟祥'
      },
      {
        '10001': '销售额',
        '10002': '13352.080078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13352.080078125',
        '231102144451020': '技术',
        '231102144451025': '钦州'
      },
      {
        '10001': '销售额',
        '10002': '16997.02178955078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16997.02178955078',
        '231102144451020': '家具',
        '231102144451025': '钦州'
      },
      {
        '10001': '销售额',
        '10002': '13231.2604637146',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13231.2604637146',
        '231102144451020': '办公用品',
        '231102144451025': '钦州'
      },
      {
        '10001': '销售额',
        '10002': '3858.4000244140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3858.4000244140625',
        '231102144451020': '技术',
        '231102144451025': '铁力'
      },
      {
        '10001': '销售额',
        '10002': '17473.925415039062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17473.925415039062',
        '231102144451020': '家具',
        '231102144451025': '铁力'
      },
      {
        '10001': '销售额',
        '10002': '1003.5199890136719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1003.5199890136719',
        '231102144451020': '办公用品',
        '231102144451025': '铁力'
      },
      {
        '10001': '销售额',
        '10002': '16586.556030273438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '16586.556030273438',
        '231102144451020': '技术',
        '231102144451025': '铁岭'
      },
      {
        '10001': '销售额',
        '10002': '11499.151977539062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11499.151977539062',
        '231102144451020': '办公用品',
        '231102144451025': '铁岭'
      },
      {
        '10001': '销售额',
        '10002': '552.8880004882812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '552.8880004882812',
        '231102144451020': '家具',
        '231102144451025': '铁岭'
      },
      {
        '10001': '销售额',
        '10002': '549.0800170898438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '549.0800170898438',
        '231102144451020': '家具',
        '231102144451025': '铜仁'
      },
      {
        '10001': '销售额',
        '10002': '58.939998626708984',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '58.939998626708984',
        '231102144451020': '办公用品',
        '231102144451025': '铜仁'
      },
      {
        '10001': '销售额',
        '10002': '4758.0400390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4758.0400390625',
        '231102144451020': '技术',
        '231102144451025': '铜仁'
      },
      {
        '10001': '销售额',
        '10002': '3227.559934616089',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3227.559934616089',
        '231102144451020': '办公用品',
        '231102144451025': '铜川'
      },
      {
        '10001': '销售额',
        '10002': '13908.019897460938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13908.019897460938',
        '231102144451020': '家具',
        '231102144451025': '铜川'
      },
      {
        '10001': '销售额',
        '10002': '2878.260009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2878.260009765625',
        '231102144451020': '技术',
        '231102144451025': '铜川'
      },
      {
        '10001': '销售额',
        '10002': '18466.559936523438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18466.559936523438',
        '231102144451020': '技术',
        '231102144451025': '铜陵'
      },
      {
        '10001': '销售额',
        '10002': '5713.260227203369',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5713.260227203369',
        '231102144451020': '办公用品',
        '231102144451025': '铜陵'
      },
      {
        '10001': '销售额',
        '10002': '9524.059600830078',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9524.059600830078',
        '231102144451020': '家具',
        '231102144451025': '铜陵'
      },
      {
        '10001': '销售额',
        '10002': '15300.739929199219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15300.739929199219',
        '231102144451020': '办公用品',
        '231102144451025': '银川'
      },
      {
        '10001': '销售额',
        '10002': '6949.1800537109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6949.1800537109375',
        '231102144451020': '技术',
        '231102144451025': '银川'
      },
      {
        '10001': '销售额',
        '10002': '5042.408203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5042.408203125',
        '231102144451020': '家具',
        '231102144451025': '银川'
      },
      {
        '10001': '销售额',
        '10002': '1871.52001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1871.52001953125',
        '231102144451020': '技术',
        '231102144451025': '锡林浩特'
      },
      {
        '10001': '销售额',
        '10002': '3817.379951477051',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3817.379951477051',
        '231102144451020': '办公用品',
        '231102144451025': '锡林浩特'
      },
      {
        '10001': '销售额',
        '10002': '799.6799926757812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '799.6799926757812',
        '231102144451020': '家具',
        '231102144451025': '镇江'
      },
      {
        '10001': '销售额',
        '10002': '4906.692108154297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4906.692108154297',
        '231102144451020': '技术',
        '231102144451025': '镇江'
      },
      {
        '10001': '销售额',
        '10002': '6426.672058105469',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6426.672058105469',
        '231102144451020': '办公用品',
        '231102144451025': '镇江'
      },
      {
        '10001': '销售额',
        '10002': '4040.6800537109375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4040.6800537109375',
        '231102144451020': '技术',
        '231102144451025': '镇赉'
      },
      {
        '10001': '销售额',
        '10002': '51673.40594482422',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '51673.40594482422',
        '231102144451020': '家具',
        '231102144451025': '长春'
      },
      {
        '10001': '销售额',
        '10002': '27789.720344543457',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '27789.720344543457',
        '231102144451020': '办公用品',
        '231102144451025': '长春'
      },
      {
        '10001': '销售额',
        '10002': '101338.15954589844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '101338.15954589844',
        '231102144451020': '技术',
        '231102144451025': '长春'
      },
      {
        '10001': '销售额',
        '10002': '28381.640075683594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '28381.640075683594',
        '231102144451020': '技术',
        '231102144451025': '长沙'
      },
      {
        '10001': '销售额',
        '10002': '17242.931732177734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17242.931732177734',
        '231102144451020': '家具',
        '231102144451025': '长沙'
      },
      {
        '10001': '销售额',
        '10002': '43651.272048950195',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '43651.272048950195',
        '231102144451020': '办公用品',
        '231102144451025': '长沙'
      },
      {
        '10001': '销售额',
        '10002': '26834.989624023438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '26834.989624023438',
        '231102144451020': '家具',
        '231102144451025': '长治'
      },
      {
        '10001': '销售额',
        '10002': '4704.979934692383',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4704.979934692383',
        '231102144451020': '办公用品',
        '231102144451025': '长治'
      },
      {
        '10001': '销售额',
        '10002': '452.3399963378906',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '452.3399963378906',
        '231102144451020': '办公用品',
        '231102144451025': '长清'
      },
      {
        '10001': '销售额',
        '10002': '4557.419921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4557.419921875',
        '231102144451020': '家具',
        '231102144451025': '长清'
      },
      {
        '10001': '销售额',
        '10002': '2739.6599731445312',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2739.6599731445312',
        '231102144451020': '技术',
        '231102144451025': '长清'
      },
      {
        '10001': '销售额',
        '10002': '5152.419937133789',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5152.419937133789',
        '231102144451020': '办公用品',
        '231102144451025': '门头沟'
      },
      {
        '10001': '销售额',
        '10002': '4452.419921875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4452.419921875',
        '231102144451020': '技术',
        '231102144451025': '门头沟'
      },
      {
        '10001': '销售额',
        '10002': '3555.7200622558594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3555.7200622558594',
        '231102144451020': '家具',
        '231102144451025': '门头沟'
      },
      {
        '10001': '销售额',
        '10002': '7689.863952636719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7689.863952636719',
        '231102144451020': '技术',
        '231102144451025': '阆中'
      },
      {
        '10001': '销售额',
        '10002': '1476.8319969177246',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1476.8319969177246',
        '231102144451020': '办公用品',
        '231102144451025': '阆中'
      },
      {
        '10001': '销售额',
        '10002': '4654.860000610352',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4654.860000610352',
        '231102144451020': '家具',
        '231102144451025': '阜阳'
      },
      {
        '10001': '销售额',
        '10002': '810.1799926757812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '810.1799926757812',
        '231102144451020': '办公用品',
        '231102144451025': '阜阳'
      },
      {
        '10001': '销售额',
        '10002': '716.239990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '716.239990234375',
        '231102144451020': '办公用品',
        '231102144451025': '阳春'
      },
      {
        '10001': '销售额',
        '10002': '3954.6919860839844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3954.6919860839844',
        '231102144451020': '家具',
        '231102144451025': '阳春'
      },
      {
        '10001': '销售额',
        '10002': '12094.320190429688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12094.320190429688',
        '231102144451020': '家具',
        '231102144451025': '阳江'
      },
      {
        '10001': '销售额',
        '10002': '8676.360084533691',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8676.360084533691',
        '231102144451020': '办公用品',
        '231102144451025': '阳江'
      },
      {
        '10001': '销售额',
        '10002': '11219.740112304688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11219.740112304688',
        '231102144451020': '技术',
        '231102144451025': '阳江'
      },
      {
        '10001': '销售额',
        '10002': '18368.279296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18368.279296875',
        '231102144451020': '家具',
        '231102144451025': '阳泉'
      },
      {
        '10001': '销售额',
        '10002': '830.7599945068359',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '830.7599945068359',
        '231102144451020': '办公用品',
        '231102144451025': '阳泉'
      },
      {
        '10001': '销售额',
        '10002': '6343.260009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6343.260009765625',
        '231102144451020': '技术',
        '231102144451025': '阳泉'
      },
      {
        '10001': '销售额',
        '10002': '4590.60009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4590.60009765625',
        '231102144451020': '家具',
        '231102144451025': '阳谷'
      },
      {
        '10001': '销售额',
        '10002': '4299.120056152344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4299.120056152344',
        '231102144451020': '办公用品',
        '231102144451025': '阳谷'
      },
      {
        '10001': '销售额',
        '10002': '14869.960266113281',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14869.960266113281',
        '231102144451020': '办公用品',
        '231102144451025': '阿克苏'
      },
      {
        '10001': '销售额',
        '10002': '578.3400268554688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '578.3400268554688',
        '231102144451020': '技术',
        '231102144451025': '阿克苏'
      },
      {
        '10001': '销售额',
        '10002': '6363.672119140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6363.672119140625',
        '231102144451020': '家具',
        '231102144451025': '阿克苏'
      },
      {
        '10001': '销售额',
        '10002': '12947.480224609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12947.480224609375',
        '231102144451020': '家具',
        '231102144451025': '阿城'
      },
      {
        '10001': '销售额',
        '10002': '11863.740036010742',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '11863.740036010742',
        '231102144451020': '办公用品',
        '231102144451025': '阿城'
      },
      {
        '10001': '销售额',
        '10002': '4095.1400146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4095.1400146484375',
        '231102144451020': '技术',
        '231102144451025': '阿城'
      },
      {
        '10001': '销售额',
        '10002': '6378.511779785156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6378.511779785156',
        '231102144451020': '家具',
        '231102144451025': '阿里河'
      },
      {
        '10001': '销售额',
        '10002': '168.9800033569336',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '168.9800033569336',
        '231102144451020': '办公用品',
        '231102144451025': '阿里河'
      },
      {
        '10001': '销售额',
        '10002': '4510.435989379883',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4510.435989379883',
        '231102144451020': '办公用品',
        '231102144451025': '随州'
      },
      {
        '10001': '销售额',
        '10002': '2437.4280395507812',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2437.4280395507812',
        '231102144451020': '家具',
        '231102144451025': '随州'
      },
      {
        '10001': '销售额',
        '10002': '12803.279846191406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12803.279846191406',
        '231102144451020': '技术',
        '231102144451025': '随州'
      },
      {
        '10001': '销售额',
        '10002': '376.739990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '376.739990234375',
        '231102144451020': '办公用品',
        '231102144451025': '雄州'
      },
      {
        '10001': '销售额',
        '10002': '15209.740234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15209.740234375',
        '231102144451020': '技术',
        '231102144451025': '雄州'
      },
      {
        '10001': '销售额',
        '10002': '27049.428588867188',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '27049.428588867188',
        '231102144451020': '技术',
        '231102144451025': '集宁'
      },
      {
        '10001': '销售额',
        '10002': '14433.97216796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14433.97216796875',
        '231102144451020': '家具',
        '231102144451025': '集宁'
      },
      {
        '10001': '销售额',
        '10002': '29898.147972106934',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '29898.147972106934',
        '231102144451020': '办公用品',
        '231102144451025': '集宁'
      },
      {
        '10001': '销售额',
        '10002': '720.2999877929688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '720.2999877929688',
        '231102144451020': '家具',
        '231102144451025': '青冈'
      },
      {
        '10001': '销售额',
        '10002': '913.0800170898438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '913.0800170898438',
        '231102144451020': '技术',
        '231102144451025': '青冈'
      },
      {
        '10001': '销售额',
        '10002': '4151.419982910156',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4151.419982910156',
        '231102144451020': '办公用品',
        '231102144451025': '青冈'
      },
      {
        '10001': '销售额',
        '10002': '65894.30409240723',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '65894.30409240723',
        '231102144451020': '家具',
        '231102144451025': '青岛'
      },
      {
        '10001': '销售额',
        '10002': '63538.020153045654',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '63538.020153045654',
        '231102144451020': '办公用品',
        '231102144451025': '青岛'
      },
      {
        '10001': '销售额',
        '10002': '76883.93978881836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '76883.93978881836',
        '231102144451020': '技术',
        '231102144451025': '青岛'
      },
      {
        '10001': '销售额',
        '10002': '1729.9800415039062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1729.9800415039062',
        '231102144451020': '技术',
        '231102144451025': '青州'
      },
      {
        '10001': '销售额',
        '10002': '24774.960250854492',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '24774.960250854492',
        '231102144451020': '办公用品',
        '231102144451025': '青州'
      },
      {
        '10001': '销售额',
        '10002': '17983.448181152344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '17983.448181152344',
        '231102144451020': '家具',
        '231102144451025': '鞍山'
      },
      {
        '10001': '销售额',
        '10002': '13755.979907989502',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13755.979907989502',
        '231102144451020': '办公用品',
        '231102144451025': '鞍山'
      },
      {
        '10001': '销售额',
        '10002': '13323.660354614258',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13323.660354614258',
        '231102144451020': '技术',
        '231102144451025': '鞍山'
      },
      {
        '10001': '销售额',
        '10002': '1854.2999572753906',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1854.2999572753906',
        '231102144451020': '办公用品',
        '231102144451025': '韩城'
      },
      {
        '10001': '销售额',
        '10002': '21515.703945159912',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21515.703945159912',
        '231102144451020': '办公用品',
        '231102144451025': '韶关'
      },
      {
        '10001': '销售额',
        '10002': '9671.199768066406',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '9671.199768066406',
        '231102144451020': '技术',
        '231102144451025': '韶关'
      },
      {
        '10001': '销售额',
        '10002': '19274.093742370605',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19274.093742370605',
        '231102144451020': '家具',
        '231102144451025': '韶关'
      },
      {
        '10001': '销售额',
        '10002': '2521.679931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2521.679931640625',
        '231102144451020': '家具',
        '231102144451025': '顺义'
      },
      {
        '10001': '销售额',
        '10002': '63.70000076293945',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '63.70000076293945',
        '231102144451020': '办公用品',
        '231102144451025': '顺义'
      },
      {
        '10001': '销售额',
        '10002': '6431.4599609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6431.4599609375',
        '231102144451020': '家具',
        '231102144451025': '颍上城关镇'
      },
      {
        '10001': '销售额',
        '10002': '1212.1199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1212.1199951171875',
        '231102144451020': '技术',
        '231102144451025': '颍上城关镇'
      },
      {
        '10001': '销售额',
        '10002': '916.2159843444824',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '916.2159843444824',
        '231102144451020': '办公用品',
        '231102144451025': '颍上城关镇'
      },
      {
        '10001': '销售额',
        '10002': '690.47998046875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '690.47998046875',
        '231102144451020': '办公用品',
        '231102144451025': '马坝'
      },
      {
        '10001': '销售额',
        '10002': '6351.505798339844',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6351.505798339844',
        '231102144451020': '家具',
        '231102144451025': '马坝'
      },
      {
        '10001': '销售额',
        '10002': '504.1399841308594',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '504.1399841308594',
        '231102144451020': '办公用品',
        '231102144451025': '驻马店'
      },
      {
        '10001': '销售额',
        '10002': '5934.179931640625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5934.179931640625',
        '231102144451020': '技术',
        '231102144451025': '驻马店'
      },
      {
        '10001': '销售额',
        '10002': '1949.4720458984375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1949.4720458984375',
        '231102144451020': '家具',
        '231102144451025': '驻马店'
      },
      {
        '10001': '销售额',
        '10002': '1382.9200439453125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1382.9200439453125',
        '231102144451020': '家具',
        '231102144451025': '高密'
      },
      {
        '10001': '销售额',
        '10002': '1358',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1358',
        '231102144451020': '技术',
        '231102144451025': '高密'
      },
      {
        '10001': '销售额',
        '10002': '3516.5199584960938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3516.5199584960938',
        '231102144451020': '办公用品',
        '231102144451025': '高密'
      },
      {
        '10001': '销售额',
        '10002': '258.29998779296875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '258.29998779296875',
        '231102144451020': '技术',
        '231102144451025': '高州'
      },
      {
        '10001': '销售额',
        '10002': '1898.4000244140625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1898.4000244140625',
        '231102144451020': '办公用品',
        '231102144451025': '高州'
      },
      {
        '10001': '销售额',
        '10002': '8712.395965576172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '8712.395965576172',
        '231102144451020': '技术',
        '231102144451025': '高邮'
      },
      {
        '10001': '销售额',
        '10002': '1706.0400085449219',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1706.0400085449219',
        '231102144451020': '家具',
        '231102144451025': '高邮'
      },
      {
        '10001': '销售额',
        '10002': '2723.42000579834',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2723.42000579834',
        '231102144451020': '办公用品',
        '231102144451025': '高邮'
      },
      {
        '10001': '销售额',
        '10002': '288.9599914550781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '288.9599914550781',
        '231102144451020': '办公用品',
        '231102144451025': '鱼洞'
      },
      {
        '10001': '销售额',
        '10002': '12799.079956054688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12799.079956054688',
        '231102144451020': '技术',
        '231102144451025': '鸡东'
      },
      {
        '10001': '销售额',
        '10002': '861.5600280761719',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '861.5600280761719',
        '231102144451020': '办公用品',
        '231102144451025': '鸡东'
      },
      {
        '10001': '销售额',
        '10002': '13707.260009765625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13707.260009765625',
        '231102144451020': '家具',
        '231102144451025': '鸡东'
      },
      {
        '10001': '销售额',
        '10002': '18589.06005859375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '18589.06005859375',
        '231102144451020': '办公用品',
        '231102144451025': '鸡西'
      },
      {
        '10001': '销售额',
        '10002': '7559.7200927734375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7559.7200927734375',
        '231102144451020': '技术',
        '231102144451025': '鸡西'
      },
      {
        '10001': '销售额',
        '10002': '10452.400146484375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '10452.400146484375',
        '231102144451020': '家具',
        '231102144451025': '鸡西'
      },
      {
        '10001': '销售额',
        '10002': '13152.83203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '13152.83203125',
        '231102144451020': '家具',
        '231102144451025': '鹤壁'
      },
      {
        '10001': '销售额',
        '10002': '5215.419990539551',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5215.419990539551',
        '231102144451020': '办公用品',
        '231102144451025': '鹤壁'
      },
      {
        '10001': '销售额',
        '10002': '6147.9600830078125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6147.9600830078125',
        '231102144451020': '技术',
        '231102144451025': '鹤壁'
      },
      {
        '10001': '销售额',
        '10002': '5737.703929901123',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5737.703929901123',
        '231102144451020': '办公用品',
        '231102144451025': '鹤岗'
      },
      {
        '10001': '销售额',
        '10002': '5765.89990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '5765.89990234375',
        '231102144451020': '技术',
        '231102144451025': '鹤岗'
      },
      {
        '10001': '销售额',
        '10002': '21075.46014404297',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21075.46014404297',
        '231102144451020': '家具',
        '231102144451025': '鹤岗'
      },
      {
        '10001': '销售额',
        '10002': '12117.420166015625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '12117.420166015625',
        '231102144451020': '家具',
        '231102144451025': '鹿城'
      },
      {
        '10001': '销售额',
        '10002': '1713.739990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1713.739990234375',
        '231102144451020': '办公用品',
        '231102144451025': '鹿城'
      },
      {
        '10001': '销售额',
        '10002': '4394.4599609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4394.4599609375',
        '231102144451020': '技术',
        '231102144451025': '鹿城'
      },
      {
        '10001': '销售额',
        '10002': '1187.1719970703125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1187.1719970703125',
        '231102144451020': '技术',
        '231102144451025': '麻城'
      },
      {
        '10001': '销售额',
        '10002': '1618.1199951171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1618.1199951171875',
        '231102144451020': '技术',
        '231102144451025': '黄山'
      },
      {
        '10001': '销售额',
        '10002': '3847.4799194335938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3847.4799194335938',
        '231102144451020': '办公用品',
        '231102144451025': '黄山'
      },
      {
        '10001': '销售额',
        '10002': '2724.1201171875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2724.1201171875',
        '231102144451020': '家具',
        '231102144451025': '黄山'
      },
      {
        '10001': '销售额',
        '10002': '1915.4800415039062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1915.4800415039062',
        '231102144451020': '办公用品',
        '231102144451025': '黄岩'
      },
      {
        '10001': '销售额',
        '10002': '2065.89599609375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2065.89599609375',
        '231102144451020': '家具',
        '231102144451025': '黄岩'
      },
      {
        '10001': '销售额',
        '10002': '1603.5039978027344',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1603.5039978027344',
        '231102144451020': '办公用品',
        '231102144451025': '黄州'
      },
      {
        '10001': '销售额',
        '10002': '821.8560180664062',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '821.8560180664062',
        '231102144451020': '家具',
        '231102144451025': '黄州'
      },
      {
        '10001': '销售额',
        '10002': '973.2239990234375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '973.2239990234375',
        '231102144451020': '家具',
        '231102144451025': '黄梅'
      },
      {
        '10001': '销售额',
        '10002': '219.66000366210938',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '219.66000366210938',
        '231102144451020': '办公用品',
        '231102144451025': '黄梅'
      },
      {
        '10001': '销售额',
        '10002': '7960.176025390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7960.176025390625',
        '231102144451020': '技术',
        '231102144451025': '黄梅'
      },
      {
        '10001': '销售额',
        '10002': '19528.991729736328',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19528.991729736328',
        '231102144451020': '技术',
        '231102144451025': '黄石'
      },
      {
        '10001': '销售额',
        '10002': '6474.467926025391',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '6474.467926025391',
        '231102144451020': '办公用品',
        '231102144451025': '黄石'
      },
      {
        '10001': '销售额',
        '10002': '7447.187957763672',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '7447.187957763672',
        '231102144451020': '家具',
        '231102144451025': '黄石'
      },
      {
        '10001': '销售额',
        '10002': '1821.8760070800781',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1821.8760070800781',
        '231102144451020': '办公用品',
        '231102144451025': '黄陂'
      },
      {
        '10001': '销售额',
        '10002': '4052.2440185546875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4052.2440185546875',
        '231102144451020': '办公用品',
        '231102144451025': '黎城'
      },
      {
        '10001': '销售额',
        '10002': '2207.52001953125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2207.52001953125',
        '231102144451020': '家具',
        '231102144451025': '黎城'
      },
      {
        '10001': '销售额',
        '10002': '2597.615966796875',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2597.615966796875',
        '231102144451020': '技术',
        '231102144451025': '黎城'
      },
      {
        '10001': '销售额',
        '10002': '819.8400268554688',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '819.8400268554688',
        '231102144451020': '办公用品',
        '231102144451025': '黑山'
      },
      {
        '10001': '销售额',
        '10002': '15084.580192565918',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '15084.580192565918',
        '231102144451020': '办公用品',
        '231102144451025': '齐齐哈尔'
      },
      {
        '10001': '销售额',
        '10002': '29773.4150390625',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '29773.4150390625',
        '231102144451020': '家具',
        '231102144451025': '齐齐哈尔'
      },
      {
        '10001': '销售额',
        '10002': '20896.8203125',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '20896.8203125',
        '231102144451020': '技术',
        '231102144451025': '齐齐哈尔'
      },
      {
        '10001': '销售额',
        '10002': '355.04000091552734',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '355.04000091552734',
        '231102144451020': '办公用品',
        '231102144451025': '龙井'
      },
      {
        '10001': '销售额',
        '10002': '2549.064010620117',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2549.064010620117',
        '231102144451020': '办公用品',
        '231102144451025': '龙凤'
      },
      {
        '10001': '销售额',
        '10002': '4912.320068359375',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '4912.320068359375',
        '231102144451020': '家具',
        '231102144451025': '龙口'
      },
      {
        '10001': '销售额',
        '10002': '2071.5799865722656',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '2071.5799865722656',
        '231102144451020': '办公用品',
        '231102144451025': '龙口'
      },
      {
        '10001': '销售额',
        '10002': '3333.1200561523438',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '3333.1200561523438',
        '231102144451020': '技术',
        '231102144451025': '龙口'
      },
      {
        '10001': '销售额',
        '10002': '1302.280014038086',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '1302.280014038086',
        '231102144451020': '办公用品',
        '231102144451025': '龙江'
      },
      {
        '10001': '销售额',
        '10002': '14435.26010131836',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '14435.26010131836',
        '231102144451020': '办公用品',
        '231102144451025': '龙泉'
      },
      {
        '10001': '销售额',
        '10002': '19300.399871826172',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '19300.399871826172',
        '231102144451020': '技术',
        '231102144451025': '龙泉'
      },
      {
        '10001': '销售额',
        '10002': '21053.480499267578',
        '10003': '231102144451017',
        '20001': '销售额',
        '231102144451017': '21053.480499267578',
        '231102144451020': '家具',
        '231102144451025': '龙泉'
      }
    ],
    defaultHeaderColWidth: ['auto'],
    indicatorTitle: '',
    autoWrapText: true,
    legends: {
      type: 'discrete',
      visible: true,
      id: 'legend-discrete',
      orient: 'right',
      position: 'start',
      layoutType: 'normal',
      maxCol: 1,
      title: {
        textStyle: {
          fontSize: 12,
          fill: '#6F6F6F'
        }
      },
      layoutLevel: 60,
      item: {
        focus: true,
        focusIconStyle: {
          size: 14
        },
        maxWidth: 371,
        spaceRow: 0,
        spaceCol: 0,
        padding: {
          top: 1,
          bottom: 2,
          left: 3,
          right: 2
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
        padding: {
          left: -18
        },
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
      padding: [0, 0, 16, 16],
      data: [
        {
          label: '销售额',
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
      text: '城市_测试',
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
    defaultRowHeight: 200,
    defaultColWidth: 100,
    defaultHeaderRowHeight: ['auto'],
    hash: '031f3e1818f0e81a397f7b84765acb93'
  };
  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  // tableInstance.onVChartEvent('click', args => {
  //   console.log('listenChart click', args);
  // });
  // tableInstance.onVChartEvent('mouseover', args => {
  //   console.log('listenChart mouseover', args);
  // });
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
