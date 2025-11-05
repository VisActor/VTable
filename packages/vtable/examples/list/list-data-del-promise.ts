import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
const generatePersons = i => {
  return {
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1} - ` + Math.round(Math.random() * 100),
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  };
};

/**
 * 模拟接口请求数据
 * @param startIndex 起始索引
 * @param num 数据条数
 * @returns 返回Promise对象
 */
const getRecordsWithAjax = (startIndex: number, num: number): Promise<Record<string, string | number>[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 记录请求的参数，用于调试
      console.log('getRecordsWithAjax', startIndex, num);
      const records: Record<string, string | number>[] = [];
      for (let i = 0; i < num; i++) {
        records.push(generatePersons(startIndex + i));
      }
      resolve(records);
    }, 500);
  });
};

export function createTable() {
  // 记录已删除的记录数
  let deletedCount = 0;

  // 数据缓存对象
  const loadedData: Record<string | number, Promise<Record<string, string | number>[]>> = {};

  // 记录每个批次的实际起始索引和结束索引
  interface BatchInfo {
    key: number;
    startIndex: number;
    endIndex: number;
    length: number;
  }
  const batchInfos: BatchInfo[] = [];

  // 创建数据源
  const dataSource = new VTable.data.CachedDataSource({
    get(index) {
      // 查找index对应的批次
      let batchIndex: number | null = null;
      let relativeIndex = 0;

      // 检查索引是否在已知批次中
      for (const info of batchInfos) {
        if (index >= info.startIndex && index <= info.endIndex) {
          batchIndex = info.key;
          relativeIndex = index - info.startIndex;
          break;
        }
      }

      // 如果没找到对应的批次，创建新的批次
      if (batchIndex === null) {
        // 根据现有批次情况确定新批次的起始索引
        let loadStartIndex = 0;

        if (batchInfos.length > 0) {
          if (index > batchInfos[batchInfos.length - 1].endIndex) {
            // 如果索引大于所有已知批次，从最后一个批次的结束索引+1开始
            loadStartIndex = batchInfos[batchInfos.length - 1].endIndex + 1;
          } else if (index < batchInfos[0].startIndex) {
            // 如果索引小于所有已知批次，从0开始
            loadStartIndex = 0;
          } else {
            // 如果索引在两个批次之间，找到合适的位置
            for (let i = 0; i < batchInfos.length - 1; i++) {
              if (index > batchInfos[i].endIndex && index < batchInfos[i + 1].startIndex) {
                loadStartIndex = batchInfos[i].endIndex + 1;
                break;
              }
            }
          }
        } else {
          // 如果没有任何批次信息，使用默认逻辑
          loadStartIndex = Math.floor(index / 100) * 100;
        }

        batchIndex = loadStartIndex;
        relativeIndex = index - loadStartIndex;

        // 判断是否已请求过？
        if (!loadedData[batchIndex]) {
          const promiseObject = getRecordsWithAjax(loadStartIndex, 100);
          loadedData[batchIndex] = promiseObject;

          // 记录批次信息
          promiseObject
            .then(data => {
              batchInfos.push({
                key: batchIndex as number,
                startIndex: loadStartIndex,
                endIndex: loadStartIndex + data.length - 1, // 最后一个索引，比如0-99
                length: data.length
              });

              // 对批次按startIndex排序
              batchInfos.sort((a, b) => a.startIndex - b.startIndex);
            })
            .catch(err => {
              console.error('加载数据失败:', err);
            });
        }
      }

      return loadedData[batchIndex].then(data => {
        return data[relativeIndex]; // 获取批次数据列表中的index对应数据
      });
    },

    added(index: number, count: number) {
      this.length += count;
    },

    deleted(index: number[]) {
      this.length -= index.length;
    },

    length: 5000 // 所有记录的数量
  });

  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 120
    },
    {
      field: 'email1',
      title: 'email',
      width: 200
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns
  };

  const tableInstance = new VTable.ListTable(option);
  tableInstance.dataSource = dataSource;
  (window as any).tableInstance = tableInstance;

  /**
   * 删除记录后更新loadedData的函数
   */
  async function updateLoadedDataAfterDelete(deletedRowIndexs: number[]): Promise<void> {
    // 对删除的行索引进行排序（从小到大）
    const sortedDeletedRows = [...deletedRowIndexs].sort((a, b) => a - b);
    console.log('删除前的批次信息:', JSON.stringify(batchInfos));
    console.log('删除前的loadedData键:', Object.keys(loadedData));

    if (batchInfos.length === 0) {
      return; // 没有已加载的批次，无需处理
    }

    // 1. 首先，从所有已加载批次中删除记录
    const promises: Promise<void>[] = [];

    for (const batchInfo of batchInfos) {
      // 找出此批次中需要删除的行
      const rowsToDeleteInBatch = sortedDeletedRows.filter(
        rowIndex => rowIndex >= batchInfo.startIndex && rowIndex <= batchInfo.endIndex
      );

      if (rowsToDeleteInBatch.length > 0) {
        // 从实际数据中删除
        const promise = loadedData[batchInfo.key].then(batchData => {
          console.log(`批次${batchInfo.key}删除前长度:`, batchData.length);

          // 从后往前删除，避免索引变化影响
          for (let j = rowsToDeleteInBatch.length - 1; j >= 0; j--) {
            const rowIndex = rowsToDeleteInBatch[j];
            const relativeIndex = rowIndex - batchInfo.startIndex;
            if (relativeIndex >= 0 && relativeIndex < batchData.length) {
              batchData.splice(relativeIndex, 1);
            }
          }

          console.log(`批次${batchInfo.key}删除后长度:`, batchData.length);

          // 更新批次长度和结束索引
          batchInfo.length = batchData.length;
          batchInfo.endIndex = batchInfo.startIndex + batchInfo.length - 1;
        });

        promises.push(promise as unknown as Promise<void>);
      }
    }

    // 等待所有删除操作完成
    await Promise.all(promises);

    // 2. 重新调整批次的起始和结束索引
    for (let i = 1; i < batchInfos.length; i++) {
      const prevBatch = batchInfos[i - 1];
      const currentBatch = batchInfos[i];

      // 当前批次的起始索引应该是前一个批次的结束索引+1
      currentBatch.startIndex = prevBatch.endIndex + 1;
      currentBatch.endIndex = currentBatch.startIndex + currentBatch.length - 1;
    }

    // 3. 重新构建loadedData
    const newLoadedData: Record<string | number, Promise<Record<string, string | number>[]>> = {};

    // 为每个批次获取实际数据并创建新的映射
    for (const batchInfo of batchInfos) {
      const oldKey = batchInfo.key;
      const newKey = batchInfo.startIndex;

      try {
        // 获取批次的实际数据
        const data = await loadedData[oldKey];

        // 保存到新的数据结构中
        newLoadedData[newKey] = Promise.resolve(data);

        // 更新批次的键
        batchInfo.key = newKey;
      } catch (err) {
        console.error(`获取批次${oldKey}数据失败:`, err);
      }
    }

    // 4. 清空旧数据，设置新数据
    // 删除所有旧的键
    Object.keys(loadedData).forEach(key => {
      delete loadedData[key];
    });

    // 设置所有新的键值对
    Object.keys(newLoadedData).forEach(key => {
      loadedData[key] = newLoadedData[key];
    });

    // 输出更新后的信息（用于调试）
    console.log('更新后的批次信息:', JSON.stringify(batchInfos));
    console.log('更新后的loadedData键:', Object.keys(loadedData));
  }

  // 监听删除记录事件
  tableInstance.on(VTable.ListTable.EVENT_TYPE.DELETE_RECORD, (args: Record<string, any>) => {
    const deletedRecordIndexs = args.recordIndexs;
    // 更新删除计数（可用于其他逻辑）
    deletedCount += args.deletedCount;

    // 异步更新loadedData中的数据
    (async () => {
      try {
        await updateLoadedDataAfterDelete(deletedRecordIndexs);
        console.log('删除记录并更新数据完成');
      } catch (err) {
        console.error('更新数据失败:', err);
      }
    })();
  });

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
