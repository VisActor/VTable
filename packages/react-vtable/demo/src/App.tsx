import listTable from './list-table/list-table';
import listOptionRecord from './list-table/list-option-records';
import listComponent from './list-table/list-component';
import listCustomLayout from './list-table/list-custom-layout';
import listEditor from './list-table/list-table-editor';
import listGroup from './list-table/list-table-group';

import pivotTable from './pivot-table/pivot-table';
import pivotComponent from './pivot-table/pivot-comonent';
import pivotComponentEmptyTip from './pivot-table/pivot-component-empty-tip';

import pivotChart from './pivot-chart/pivot-chart';
import pivotChartComponent from './pivot-chart/pivot-chart-component';
import pivotChartSite from './pivot-chart/pivot-chart-site';

import listTableEvent from './event/list-table';
import eventRebind from './event/event-rebind';

import componentContainer from './component/component-container';

import customLayout from './component/custom-layout';
import customLayoutDom from './component/custom-layout-dom';
import customLayoutDomSite from './component/custom-layout-dom-site';
import customLayoutDomSite1 from './component/custom-layout-dom-site-1';
import customLayoutPivot from './component/custom-layout-pivot';

import userCustomLayoutUpdate from './component/user/custom-layout-update';

import type { ReactNode } from 'react';
import { Component, useEffect, useMemo, useState } from 'react';

declare const globalThis: any;

const demoList = [
  { key: 'listTable', Comp: listTable },
  { key: 'listEditor', Comp: listEditor },
  { key: 'listOptionRecord', Comp: listOptionRecord },
  { key: 'listComponent', Comp: listComponent },
  { key: 'listCustomLayout', Comp: listCustomLayout },
  { key: 'listGroup', Comp: listGroup },
  { key: 'pivotTable', Comp: pivotTable },
  { key: 'pivotComponent', Comp: pivotComponent },
  { key: 'pivotComponentEmptyTip', Comp: pivotComponentEmptyTip },
  { key: 'pivotChart', Comp: pivotChart },
  { key: 'pivotChartComponent', Comp: pivotChartComponent },
  { key: 'pivotChartSite', Comp: pivotChartSite },
  { key: 'listTableEvent', Comp: listTableEvent },
  { key: 'eventRebind', Comp: eventRebind },
  { key: 'componentContainer', Comp: componentContainer },

  { key: 'customLayout', Comp: customLayout },
  { key: 'customLayoutDom', Comp: customLayoutDom },
  { key: 'customLayoutDomSite', Comp: customLayoutDomSite },
  { key: 'customLayoutDomSite1', Comp: customLayoutDomSite1 },
  { key: 'customLayoutPivot', Comp: customLayoutPivot },
  { key: 'userCustomLayoutUpdate', Comp: userCustomLayoutUpdate }
] as const;

const defaultDemoKey = 'componentContainer';

function readDemoKeyFromHash() {
  const g: any = globalThis as any;
  const raw = g?.location?.hash ? g.location.hash.slice(1) : '';
  const key = raw ? decodeURIComponent(raw) : '';
  return demoList.some(d => d.key === key) ? key : defaultDemoKey;
}

class DemoErrorBoundary extends Component<
  { demoKey: string; children: ReactNode },
  { error: unknown | null; message: string | null }
> {
  state = { error: null, message: null };

  static getDerivedStateFromError(error: unknown) {
    return { error, message: (error as any)?.message ?? String(error) };
  }

  componentDidUpdate(prevProps: { demoKey: string }) {
    if (prevProps.demoKey !== this.props.demoKey && this.state.error) {
      this.setState({ error: null, message: null });
    }
  }

  componentDidCatch(error: unknown) {
    const g: any = globalThis as any;
    const list = (g.__demo_errors__ = g.__demo_errors__ || []);
    list.push({ demo: this.props.demoKey, message: (error as any)?.message ?? String(error) });
    if (list.length > 50) {
      list.splice(0, list.length - 50);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <pre id="__demo_error__" style={{ whiteSpace: 'pre-wrap' }}>
          {this.state.message}
        </pre>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [demoKey, setDemoKey] = useState(readDemoKeyFromHash);

  useEffect(() => {
    const g: any = globalThis as any;
    const onHashChange = () => setDemoKey(readDemoKeyFromHash());
    g?.addEventListener?.('hashchange', onHashChange);
    return () => g?.removeEventListener?.('hashchange', onHashChange);
  }, []);

  const demo = useMemo(() => demoList.find(d => d.key === demoKey) ?? demoList[demoList.length - 1], [demoKey]);
  const DemoComp = demo.Comp as any;

  return (
    <div style={{ padding: 12, height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      {/* Demo 内部很多 Table/Container 默认 height: '100%'，父容器如果没给高度会导致 canvas 变成 0 高度，从而截图/页面看起来“空白”。 */}
      {/* 这里固定成占满视口 + flex 剩余空间渲染 demo，保证 React18/React19 两端行为一致。 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
        <div>Demo</div>
        <select
          value={demo.key}
          onChange={e => {
            const next = e.target.value;
            setDemoKey(next);
            const g: any = globalThis as any;
            if (g?.location) {
              g.location.hash = encodeURIComponent(next);
            }
          }}
        >
          {demoList.map(d => (
            <option key={d.key} value={d.key}>
              {d.key}
            </option>
          ))}
        </select>
      </div>
      <h2 id="__demo_title__" style={{ margin: '12px 0', flex: '0 0 auto' }}>
        {demo.key}
      </h2>
      <div style={{ flex: '1 1 auto', minHeight: 0 }}>
        <DemoErrorBoundary demoKey={demo.key}>
          <DemoComp />
        </DemoErrorBoundary>
      </div>
    </div>
  );
}

export default App;
