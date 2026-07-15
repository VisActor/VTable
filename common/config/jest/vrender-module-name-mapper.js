function createVRenderModuleNameMapper(nodeModulesRoot = '<rootDir>/node_modules') {
  const visactorRoot = `${nodeModulesRoot}/@visactor`;

  return {
    '^@visactor/vrender/entries/(.*)$': `${visactorRoot}/vrender/cjs/entries/$1.js`,
    '^@visactor/vrender-core/color-string$': `${visactorRoot}/vrender-core/cjs/color-string/index.js`,
    '^@visactor/vrender-core/event/constant$': `${visactorRoot}/vrender-core/cjs/event/public-constant.js`,
    '^@visactor/vrender-core/graphic/builtin-symbol$':
      `${visactorRoot}/vrender-core/cjs/graphic/builtin-symbol.js`,
    '^@visactor/vrender-core/render/draw-interceptor$':
      `${visactorRoot}/vrender-core/cjs/render/contributions/render/draw-interceptor.js`,
    '^@visactor/vrender-core/render/symbol$':
      `${visactorRoot}/vrender-core/cjs/render/contributions/render/symbol.js`,
    '^@visactor/vrender-core/(.*)$': `${visactorRoot}/vrender-core/cjs/$1.js`,
    '^@visactor/vrender-kits/env$': `${visactorRoot}/vrender-kits/cjs/env/index.js`,
    '^@visactor/vrender-kits/event/extension$':
      `${visactorRoot}/vrender-kits/cjs/event/extension/index.js`,
    '^@visactor/vrender-kits/(.*)$': `${visactorRoot}/vrender-kits/cjs/$1.js`,
    '^@visactor/vrender-components/axis$':
      `${visactorRoot}/vrender-components/cjs/axis/index.js`,
    '^@visactor/vrender-components/axis/tick-data$':
      `${visactorRoot}/vrender-components/cjs/axis/tick-data/index.js`,
    '^@visactor/vrender-components/crosshair$':
      `${visactorRoot}/vrender-components/cjs/crosshair/index.js`,
    '^@visactor/vrender-components/label$':
      `${visactorRoot}/vrender-components/cjs/label/index.js`,
    '^@visactor/vrender-components/legend/discrete$':
      `${visactorRoot}/vrender-components/cjs/legend/discrete/index.js`,
    '^@visactor/vrender-components/poptip$':
      `${visactorRoot}/vrender-components/cjs/poptip/index.js`,
    '^@visactor/vrender-components/tag$': `${visactorRoot}/vrender-components/cjs/tag/index.js`,
    '^@visactor/vrender-components/tooltip$':
      `${visactorRoot}/vrender-components/cjs/tooltip/index.js`,
    '^@visactor/vrender-components/util$': `${visactorRoot}/vrender-components/cjs/util/index.js`,
    '^@visactor/vrender-components/(.*)$': `${visactorRoot}/vrender-components/cjs/$1.js`,
    '^@visactor/vrender-animate/component$':
      `${visactorRoot}/vrender-animate/cjs/component/index.js`,
    '^@visactor/vrender-animate/state$': `${visactorRoot}/vrender-animate/cjs/state/index.js`,
    '^@visactor/vrender-animate/(.*)$': `${visactorRoot}/vrender-animate/cjs/$1.js`
  };
}

module.exports = {
  createVRenderModuleNameMapper
};
