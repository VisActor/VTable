import { FormulaEngine } from '../formula-engine';

// 详细调试B2删除逻辑
const engine = new FormulaEngine();
engine.addSheet('Sheet1');

console.log('=== 详细调试B2删除逻辑 ===\n');

// 在C8设置=B2
engine.setCellContent({ sheet: 'Sheet1', row: 7, col: 2 }, '=B2');
console.log('C8设置=B2');

// 让我们手动模拟adjustFormulaReference的逻辑
const formula = '=B2';
const type = 'delete';
const dimension = 'row';
const index = 1; // 删除第2行(0-based)
const count = 1;

console.log(`公式: ${formula}`);
console.log(`删除类型: ${type} ${dimension} 在索引${index}，数量${count}`);

const expression = formula.substring(1);
console.log(`表达式: ${expression}`);

// 匹配B2
const cellRefRegex = /([A-Z]+)([0-9]+)/g;
const match = cellRefRegex.exec(expression);

if (match) {
  const fullMatch = match[0];
  const colLetters = match[1];
  const rowNumber = parseInt(match[2], 10);

  console.log(`找到单元格引用: ${fullMatch}`);
  console.log(`列字母: ${colLetters}`);
  console.log(`行号: ${rowNumber}`);

  const zeroBasedRowNumber = rowNumber - 1;
  console.log(`0-based行号: ${zeroBasedRowNumber}`);

  if (dimension === 'row') {
    console.log(`\n检查删除条件:`);
    console.log(`zeroBasedRowNumber >= index: ${zeroBasedRowNumber} >= ${index} = ${zeroBasedRowNumber >= index}`);

    if (zeroBasedRowNumber >= index) {
      console.log(`进入删除分支`);

      const condition1 = zeroBasedRowNumber > index + count - 1;
      console.log(
        `条件1 - zeroBasedRowNumber > index + count - 1: ${zeroBasedRowNumber} > ${index + count - 1} = ${condition1}`
      );

      if (condition1) {
        console.log(`应该调整行号: ${rowNumber} -> ${rowNumber - count}`);
      } else {
        const condition2 = zeroBasedRowNumber >= index && zeroBasedRowNumber < index + count;
        console.log(`条件2 - zeroBasedRowNumber >= index && zeroBasedRowNumber < index + count:`);
        console.log(`  ${zeroBasedRowNumber} >= ${index} && ${zeroBasedRowNumber} < ${index + count}`);
        console.log(`  = ${zeroBasedRowNumber >= index} && ${zeroBasedRowNumber < index + count}`);
        console.log(`  = ${condition2}`);

        if (condition2) {
          console.log(`应该变成#REF!`);
        }
      }
    }
  }
}

console.log('\n=== 实际测试结果 ===');
engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 1, 1);
console.log('C7结果:', engine.getFormulaString({ sheet: 'Sheet1', row: 6, col: 2 }));
