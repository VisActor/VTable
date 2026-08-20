import type { BaseTableAPI } from '../../ts-types/base-table';

export function dealPromiseData<T>(dataPromise: Promise<T>, tabel: BaseTableAPI, callback: (value: T) => void) {
  dataPromise
    .then(value => {
      callback(value);
      tabel.scenegraph.updateNextFrame();
    })
    .catch((err: Error) => {
      console.error(err);
    });
}
