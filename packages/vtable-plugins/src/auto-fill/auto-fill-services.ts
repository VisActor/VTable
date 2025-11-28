/**
 * Copyright 2023-present DreamNum Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { IAutoFillRule } from './types';
import {
  dateRule,
  numberRule,
  extendNumberRule,
  chnNumberRule,
  chnWeek2Rule,
  chnWeek3Rule,
  loopSeriesRule,
  formulaRule,
  otherRule
} from './rules';

export interface IAutoFillService {
  getRules: () => IAutoFillRule[];
  registerRule: (rule: IAutoFillRule) => void;
}

export class AutoFillService implements IAutoFillService {
  private _rules: IAutoFillRule[] = [];

  constructor() {
    this._init();
  }

  private _init() {
    this._rules = [
      formulaRule,
      dateRule,
      numberRule,
      extendNumberRule,
      chnNumberRule,
      chnWeek2Rule,
      chnWeek3Rule,
      loopSeriesRule,
      otherRule
    ].sort((a, b) => b.priority - a.priority);
  }

  registerRule(rule: IAutoFillRule) {
    // if rule.type is used, console error
    if (this._rules.find(r => r.type === rule.type)) {
      throw new Error(`Registry rule failed, type '${rule.type}' already exist!`);
    }
    // insert rules according to the rule.priority, the higher priority will be inserted at the beginning of the array
    const index = this._rules.findIndex(r => r.priority < rule.priority);
    this._rules.splice(index === -1 ? this._rules.length : index, 0, rule);
  }

  getRules() {
    return this._rules;
  }
}
