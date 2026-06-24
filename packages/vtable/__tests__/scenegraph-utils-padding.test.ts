import { getQuadProps } from '../src/scenegraph/utils/padding';

describe('getQuadProps', () => {
  test('preserves non-number quad arrays used by border styles', () => {
    const borderColor = ['#E1E4E8', '#E1E4E8', '#E1E4E8', '#E1E4E8'];
    const borderLineDash = [null, [12, 6], null, [12, 6]];

    expect(getQuadProps(borderColor)).toEqual(borderColor);
    expect(getQuadProps(borderLineDash)).toEqual(borderLineDash);
  });

  test('normalizes numeric padding values', () => {
    expect(getQuadProps(8)).toEqual([8, 8, 8, 8]);
    expect(getQuadProps([8.6, 12, 8.6, 12])).toEqual([8.6, 12, 8.6, 12]);
    expect(getQuadProps({ top: 1, right: 2, bottom: 3, left: 4 })).toEqual([1, 2, 3, 4]);
  });
});
