export function generatePivotDataSource(num: number, colCount: number): number[][] {
  const array = new Array(num);
  for (let i = 0; i < num; i++) {
    const data = new Array(colCount);
    for (let j = 0; j < colCount; j++) {
      data[j] = Math.floor(Math.random() * 120);
    }
    array[i] = data;
  }
  return array;
}
