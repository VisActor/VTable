import { SumAggregator } from '../../src/ts-types/dataset/aggregation';

describe('SumAggregator floating point precision', () => {
  it('should sum 0.1 and 0.2 exactly to 0.3', () => {
    const aggregator = new SumAggregator({ key: 'test', field: 'value', isRecord: false });
    aggregator.push({ value: 0.1 });
    aggregator.push({ value: 0.2 });
    expect(aggregator.value()).toBe(0.3);
  });

  it('should subtract correctly', () => {
    const aggregator = new SumAggregator({ key: 'test', field: 'value', isRecord: false });
    aggregator.push({ value: 0.3 });
    aggregator.deleteRecord({ value: 0.1 });
    expect(aggregator.value()).toBe(0.2);
  });
});
