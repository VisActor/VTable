import type { BaseTableAPI } from '../../ts-types/base-table';

export function dealPromiseData(dataPromise: Promise<null>, tabel: BaseTableAPI, callback: () => void) {
  dataPromise
    .then(() => {
      callback();
      tabel.scenegraph.updateNextFrame();
    })
    .catch((err: Error) => {
      console.error(err);
    });
}
