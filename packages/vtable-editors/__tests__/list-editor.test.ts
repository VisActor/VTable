import { ListEditor } from '../src/list-editor';

describe('ListEditor', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('treats configured option values as text instead of HTML', () => {
    const values = [
      '</option></select><img id="xss-image" src=x onerror=alert(1)>',
      'x" onclick="alert(1)',
      '<svg id="xss-svg" onload=alert(1)>'
    ];
    const container = document.createElement('div');
    document.body.appendChild(container);

    const editor = new ListEditor({ values });
    editor.onStart({
      container,
      value: values[1],
      referencePosition: {
        rect: {
          left: 0,
          top: 0,
          width: 100,
          height: 24
        }
      },
      endEdit: () => undefined,
      table: {},
      col: 0,
      row: 0
    });

    const select = container.querySelector('select');
    expect(select).not.toBeNull();
    if (!select) {
      throw new Error('ListEditor did not create a select element');
    }
    expect(container.querySelector('img#xss-image')).toBeNull();
    expect(container.querySelector('svg#xss-svg')).toBeNull();
    expect(container.querySelectorAll('select')).toHaveLength(1);
    expect(select.options).toHaveLength(values.length);
    expect(Array.from(select.options).map(option => option.textContent)).toEqual(values);
    expect(Array.from(select.options).map(option => option.value)).toEqual(values);
    expect(select.value).toBe(values[1]);
  });
});
