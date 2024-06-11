import type { CreateDOMParamsType, IGraphic, IStage } from '@visactor/vtable/src/vrender';
import { ReactAttributePlugin, application } from '@visactor/vtable/src/vrender';
import { isNil } from '@visactor/vutils';

export class VTableReactAttributePlugin extends ReactAttributePlugin {
  removeElement(id: string) {
    super.removeElement(id);
    delete this.htmlMap[id];
  }

  renderGraphicHTML(graphic: IGraphic) {
    const { react } = graphic.attribute;
    if (!react) {
      return;
    }
    const stage = graphic.stage;
    if (!stage) {
      return;
    }
    const ReactDOM = stage.params.ReactDOM;
    const { element, container } = react;
    if (!(element && ReactDOM && ReactDOM.createRoot)) {
      return;
    }
    const id = isNil(react.id) ? `${graphic.id ?? graphic._uid}_react` : react.id;

    if (this.htmlMap && this.htmlMap[id] && container && container !== this.htmlMap[id].container) {
      this.removeElement(id);
    }

    if (!this.htmlMap || !this.htmlMap[id]) {
      // createa a wrapper contianer to be the root of react element
      const { wrapContainer, nativeContainer } = this.getWrapContainer(stage, container);

      if (wrapContainer) {
        const root = ReactDOM.createRoot(wrapContainer);
        root.render(element);

        if (!this.htmlMap) {
          this.htmlMap = {};
        }

        this.htmlMap[id] = { root, wrapContainer, nativeContainer, container, renderId: this.renderId };
      }
    } else {
      // update react element
      this.htmlMap[id].root.render(element);
    }

    if (!this.htmlMap || !this.htmlMap[id]) {
      return;
    }

    const { wrapContainer, nativeContainer } = this.htmlMap[id];

    this.updateStyleOfWrapContainer(graphic, stage, wrapContainer, nativeContainer, react);
    this.htmlMap[id].renderId = this.renderId;
  }

  getWrapContainer(stage: IStage, userContainer?: string | HTMLElement | null, domParams?: CreateDOMParamsType) {
    let nativeContainer;
    if (userContainer) {
      if (typeof userContainer === 'string') {
        nativeContainer = application.global.getElementById(userContainer);
      } else {
        nativeContainer = userContainer;
      }
    } else {
      nativeContainer = stage.window.getContainer();
    }
    // 创建wrapGroup
    return {
      wrapContainer: application.global.createDom({ tagName: 'div', parent: nativeContainer, ...domParams }),
      nativeContainer
    };
  }
}
