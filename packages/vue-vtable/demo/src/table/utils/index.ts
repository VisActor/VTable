/*
 * @Author: lym
 * @Date: 2025-02-25 09:27:39
 * @LastEditors: lym
 * @LastEditTime: 2025-02-26 19:57:04
 * @Description:
 */

import type { ColumnDefine } from '@visactor/vtable/src';
import { merge } from '@visactor/vutils';

type FieldType = 'id' | 'name' | 'gender' | 'age' | 'birthday' | 'phone' | 'city';
type ColumnDefineMap = {
  [key in FieldType]?: ColumnDefine;
};

/**
 * @description: 生成mock数据
 * @param {number} count
 * @return {*}
 */
export function generateMockData(count: number = 100, extraColumnDefineMap?: ColumnDefineMap) {
  // 基础数据池
  const firstNames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
  const lastNames = ['伟', '芳', '娜', '强', '敏', '静', '杰', '婷', '超', '雪'];
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '西安', '苏州'];

  // 生成随机数据
  const records = Array.from({ length: count }, (_, index) => {
    const gender = Math.random() > 0.5 ? '男' : '女';
    const age = Math.floor(Math.random() * 42) + 18;
    const birthYear = new Date().getFullYear() - age;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    return {
      id: index + 1,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]}${
        lastNames[Math.floor(Math.random() * lastNames.length)]
      }`,
      age: age,
      gender: gender,
      birthday: `${birthYear}-${birthMonth}-${birthDay}`,
      phone: `1${[3, 5, 8][Math.floor(Math.random() * 3)]}${Math.random().toString().slice(2, 11)}`,
      city: cities[Math.floor(Math.random() * cities.length)]
    };
  });

  const rawColumnDefineMap: ColumnDefineMap = {
    id: { field: 'id', title: 'ID', width: 100 },
    name: { field: 'name', title: '姓名', width: 200 },
    gender: { field: 'gender', title: '性别', width: 150 },
    age: { field: 'age', title: '年龄', width: 150 },
    birthday: { field: 'birthday', title: '出生日期', width: 220 },
    phone: { field: 'phone', title: '联系电话', width: 250 },
    city: { field: 'city', title: '城市', width: 200 }
  };
  const columnDefineMap = merge({}, rawColumnDefineMap, extraColumnDefineMap);

  return { records, columns: Object.values(columnDefineMap) as ColumnDefine[] };
}
