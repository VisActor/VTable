import { decodeReactDom } from '../src/scenegraph/component/custom';

(globalThis as { __VERSION__?: string }).__VERSION__ = 'none';

const reactElementType = Symbol.for('react.element');

type TestGraphic = {
  type: string;
  attribute: unknown;
  on: jest.Mock;
  states?: unknown;
  sharedStateDefinitions?: unknown;
};

function createElement(type: (params: { attribute: unknown }) => TestGraphic, props: Record<string, unknown>) {
  return {
    $$typeof: reactElementType,
    type,
    props
  };
}

function createGraphic(type: string) {
  return ({ attribute }: { attribute: unknown }) => ({
    type,
    attribute,
    on: jest.fn()
  });
}

describe('decodeReactDom state config', () => {
  it('passes local states to graphics', () => {
    const states = {
      hover: {
        fill: 'red'
      }
    };

    const graphic = decodeReactDom(
      createElement(createGraphic('text'), {
        attribute: {
          id: 'label',
          name: 'label'
        },
        states
      })
    );

    expect(graphic.states).toBe(states);
  });

  it('passes shared state definitions to group graphics', () => {
    const sharedStateDefinitions = {
      hover: {
        patch: {
          fill: 'red'
        }
      }
    };

    const group = decodeReactDom(
      createElement(createGraphic('group'), {
        attribute: {
          id: 'owner',
          name: 'owner'
        },
        sharedStateDefinitions
      })
    );

    expect(group.sharedStateDefinitions).toBe(sharedStateDefinitions);
  });
});
