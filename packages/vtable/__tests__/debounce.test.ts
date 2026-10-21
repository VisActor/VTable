import { debounce } from '../src/tools/debounce';

jest.mock('@src/vrender', () => ({ vglobal: {} }));

describe('debounce', () => {
  test('waits for the remaining delay after a call during the debounce window', () => {
    let now = 1000;
    const timers: { callback: () => void; delay: number }[] = [];
    const callback = jest.fn();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    jest.spyOn(globalThis, 'setTimeout').mockImplementation((handler, delay) => {
      timers.push({ callback: handler as () => void, delay: delay as number });
      return timers.length as any;
    });

    try {
      const debounced = debounce(callback, 100);
      debounced('first');
      now = 1050;
      debounced('latest');

      now = 1100;
      timers.shift()!.callback();
      expect(callback).not.toHaveBeenCalled();
      expect(timers[0].delay).toBe(50);

      now = 1150;
      timers.shift()!.callback();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('latest');
    } finally {
      jest.restoreAllMocks();
    }
  });
});
