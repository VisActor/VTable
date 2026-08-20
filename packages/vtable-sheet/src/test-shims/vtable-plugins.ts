export * from '../../../vtable-plugins/src/index';

const { HistoryPlugin } = require('../../../vtable-plugins/src/history');
const { FilterPlugin } = require('../../../vtable-plugins/src/filter');
const { FilterActionType } = require('../../../vtable-plugins/src/filter/types');

export { HistoryPlugin, FilterPlugin, FilterActionType };
