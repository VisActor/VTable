// @ts-nocheck
import { FormulaInputEditor } from '../src/formula/formula-editor';

const createEditor = (formulaInput: HTMLInputElement | null = null) => {
  const editor = new FormulaInputEditor();
  const input = document.createElement('input');
  input.value = 'updated value';

  (editor as any).element = input;
  (editor as any).sheet = {
    formulaUIManager: {
      formulaInput
    },
    formulaManager: {
      cellHighlightManager: {
        highlightFormulaCells: jest.fn(),
        clearHighlights: jest.fn()
      }
    }
  };

  return { editor, input };
};

test('FormulaInputEditor does not throw when formula bar input is unavailable', () => {
  const { editor } = createEditor(null);

  expect(() => (editor as any).handleFormulaInput(new Event('input'))).not.toThrow();
});

test('FormulaInputEditor syncs cell editor input to formula bar when available', () => {
  const formulaInput = document.createElement('input');
  const { editor, input } = createEditor(formulaInput);

  (editor as any).handleFormulaInput(new Event('input'));

  expect(formulaInput.value).toBe(input.value);
});
