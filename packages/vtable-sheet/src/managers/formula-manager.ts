import type { Sheet } from '../core/Sheet';
import type { CellCoord } from '../ts-types';

/**
 * Cell dependency information
 */
interface CellDependency {
  dependsOn: Set<string>; // Cells this cell depends on
  dependedBy: Set<string>; // Cells that depend on this cell
}

/**
 * Manages formula calculations for the Sheet component
 */
export class FormulaManager {
  private sheet: Sheet;
  private dependencies: Map<string, CellDependency> = new Map();
  private formulaCache: Map<string, any> = new Map();
  private customFunctions: Record<string, Function> = {};

  /**
   * Creates a new FormulaManager instance
   * @param sheet The Sheet instance
   */
  constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.initializeCustomFunctions();

    // Register custom functions from options if provided
    if (sheet.options.formula?.customFunctions) {
      this.registerCustomFunctions(sheet.options.formula.customFunctions);
    }
  }

  /**
   * Initializes default custom functions
   */
  private initializeCustomFunctions(): void {
    // Basic arithmetic functions
    this.customFunctions = {
      SUM: (range: any[]) => range.reduce((a, b) => a + (Number(b) || 0), 0),
      AVERAGE: (range: any[]) => {
        if (range.length === 0) {
          return 0;
        }
        return this.customFunctions.SUM(range) / range.length;
      },
      MIN: (range: any[]) => Math.min(...range.map(v => Number(v) || 0)),
      MAX: (range: any[]) => Math.max(...range.map(v => Number(v) || 0)),
      COUNT: (range: any[]) => range.filter(v => v !== null && v !== undefined && v !== '').length
    };
  }

  /**
   * Registers custom formula functions
   * @param functions Custom functions to register
   */
  registerCustomFunctions(functions: Record<string, Function>): void {
    this.customFunctions = {
      ...this.customFunctions,
      ...functions
    };
  }

  /**
   * Gets the address key for a cell
   * @param row Row index
   * @param col Column index
   */
  private getCellAddressKey(row: number, col: number): string {
    return this.sheet.addressFromCoord(row, col);
  }

  /**
   * Parses a formula string and extracts cell references
   * @param formula Formula string
   * @returns Set of cell addresses the formula depends on
   */
  private parseFormulaDependencies(formula: string): Set<string> {
    const dependencies = new Set<string>();

    // Remove the leading equals sign
    const formulaStr = formula.startsWith('=') ? formula.substring(1) : formula;

    // Match cell references like A1, B2, etc.
    const cellRefRegex = /([A-Z]+[0-9]+)(?![A-Z0-9])/g;
    const cellRefs = formulaStr.match(cellRefRegex) || [];

    // Match range references like A1:C3
    const rangeRefRegex = /([A-Z]+[0-9]+):([A-Z]+[0-9]+)/g;
    const rangeRefs = formulaStr.matchAll(rangeRefRegex);

    // Add individual cell references
    for (const cellRef of cellRefs) {
      dependencies.add(cellRef);
    }

    // Add all cells in ranges
    for (const match of rangeRefs) {
      const startCell = match[1];
      const endCell = match[2];

      const startCoord = this.sheet.coordFromAddress(startCell);
      const endCoord = this.sheet.coordFromAddress(endCell);

      // Normalize range coordinates (make sure start is before end)
      const minRow = Math.min(startCoord.row, endCoord.row);
      const maxRow = Math.max(startCoord.row, endCoord.row);
      const minCol = Math.min(startCoord.col, endCoord.col);
      const maxCol = Math.max(startCoord.col, endCoord.col);

      // Add all cells in the range
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          dependencies.add(this.getCellAddressKey(row, col));
        }
      }
    }

    return dependencies;
  }

  /**
   * Updates cell dependencies based on its formula
   * @param row Row index
   * @param col Column index
   * @param formula Formula string
   */
  updateCellDependencies(row: number, col: number, formula: string): void {
    const cellKey = this.getCellAddressKey(row, col);

    // Get or create the cell dependency info
    let cellDep = this.dependencies.get(cellKey);
    if (!cellDep) {
      cellDep = {
        dependsOn: new Set(),
        dependedBy: new Set()
      };
      this.dependencies.set(cellKey, cellDep);
    }

    // Remove this cell from the dependedBy sets of cells it previously depended on
    for (const dep of cellDep.dependsOn) {
      const depCell = this.dependencies.get(dep);
      if (depCell) {
        depCell.dependedBy.delete(cellKey);
      }
    }

    // Clear the old dependencies
    cellDep.dependsOn.clear();

    if (formula && formula.startsWith('=')) {
      // Parse new dependencies
      const newDeps = this.parseFormulaDependencies(formula);

      // Add new dependencies
      for (const dep of newDeps) {
        cellDep.dependsOn.add(dep);

        // Update the dependedBy set of the dependency
        let depCell = this.dependencies.get(dep);
        if (!depCell) {
          depCell = {
            dependsOn: new Set(),
            dependedBy: new Set()
          };
          this.dependencies.set(dep, depCell);
        }

        depCell.dependedBy.add(cellKey);
      }
    }

    // Clear the formula cache for this cell
    this.formulaCache.delete(cellKey);
  }

  /**
   * Evaluates a cell's formula
   * @param row Row index
   * @param col Column index
   * @returns Evaluated value
   */
  evaluateFormula(row: number, col: number): any {
    const cellKey = this.getCellAddressKey(row, col);

    // Check if the value is already cached
    if (this.formulaCache.has(cellKey)) {
      return this.formulaCache.get(cellKey);
    }

    // Get the cell value
    const cellValue = this.sheet.getCellValue(row, col);

    // If not a formula, return the value as is
    if (typeof cellValue !== 'string' || !cellValue.startsWith('=')) {
      return cellValue;
    }

    // Remove the leading equals sign
    const formula = cellValue.substring(1);

    try {
      // Parse and evaluate the formula
      const result = this.parseAndEvaluate(formula, row, col);

      // Cache the result
      this.formulaCache.set(cellKey, result);

      return result;
    } catch (error) {
      console.error(`Error evaluating formula at ${cellKey}:`, error);
      return `#ERROR: ${error.message}`;
    }
  }

  /**
   * Parses and evaluates a formula
   * @param formula Formula string
   * @param contextRow Row index for context
   * @param contextCol Column index for context
   * @returns Evaluated value
   */
  private parseAndEvaluate(formula: string, contextRow: number, contextCol: number): any {
    // TODO: Implement a proper formula parser
    // This is a simplified implementation for basic formulas

    // Check for function calls like SUM(A1:B3)
    const functionCallRegex = /([A-Z]+)\(([^()]*)\)/g;
    let match;

    while ((match = functionCallRegex.exec(formula)) !== null) {
      const funcName = match[1];
      const argsStr = match[2];

      // Check if the function exists
      if (this.customFunctions[funcName]) {
        // Parse the arguments
        const args = this.parseArguments(argsStr, contextRow, contextCol);

        // Call the function
        const result = this.customFunctions[funcName](args);

        // Replace the function call with the result
        formula = formula.replace(match[0], result.toString());

        // Reset the regex
        functionCallRegex.lastIndex = 0;
      }
    }

    // Replace cell references with their values
    const cellRefRegex = /([A-Z]+[0-9]+)/g;

    formula = formula.replace(cellRefRegex, match => {
      const coord = this.sheet.coordFromAddress(match);
      const value = this.evaluateFormula(coord.row, coord.col);

      // Convert to number if possible
      const numValue = Number(value);
      return isNaN(numValue) ? `"${value}"` : numValue.toString();
    });

    // Evaluate the final expression
    try {
      // Use Function constructor to evaluate the expression
      // This is not safe for untrusted input, but works for simple formulas
      return new Function(`return ${formula}`)();
    } catch (error) {
      throw new Error(`Invalid formula: ${formula}`);
    }
  }

  /**
   * Parses function arguments
   * @param argsStr Arguments string
   * @param contextRow Row index for context
   * @param contextCol Column index for context
   * @returns Parsed arguments
   */
  private parseArguments(argsStr: string, contextRow: number, contextCol: number): any[] {
    // Split by comma, but handle ranges like A1:B3
    const args: any[] = [];

    // Check for range references like A1:B3
    const rangeMatch = argsStr.match(/([A-Z]+[0-9]+):([A-Z]+[0-9]+)/);

    if (rangeMatch) {
      const startCell = rangeMatch[1];
      const endCell = rangeMatch[2];

      const startCoord = this.sheet.coordFromAddress(startCell);
      const endCoord = this.sheet.coordFromAddress(endCell);

      // Normalize range coordinates
      const minRow = Math.min(startCoord.row, endCoord.row);
      const maxRow = Math.max(startCoord.row, endCoord.row);
      const minCol = Math.min(startCoord.col, endCoord.col);
      const maxCol = Math.max(startCoord.col, endCoord.col);

      // Get all values in the range
      const rangeValues = [];

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const value = this.evaluateFormula(row, col);
          rangeValues.push(value);
        }
      }

      return rangeValues;
    }

    // Handle comma-separated arguments
    const argParts = argsStr.split(',');

    for (const part of argParts) {
      const trimmed = part.trim();

      if (!trimmed) {
        continue;
      }

      // Check if it's a cell reference
      const cellMatch = trimmed.match(/^([A-Z]+[0-9]+)$/);

      if (cellMatch) {
        const coord = this.sheet.coordFromAddress(trimmed);
        const value = this.evaluateFormula(coord.row, coord.col);
        args.push(value);
      } else {
        // Try to convert to number
        const numValue = Number(trimmed);
        args.push(isNaN(numValue) ? trimmed : numValue);
      }
    }

    return args;
  }

  /**
   * Recalculates all cells that depend on the changed cell
   * @param row Row index of the changed cell
   * @param col Column index of the changed cell
   */
  recalculateDependencies(row: number, col: number): void {
    const cellKey = this.getCellAddressKey(row, col);

    // Clear the cache for this cell
    this.formulaCache.delete(cellKey);

    // Get cells that depend on this cell
    const cellDep = this.dependencies.get(cellKey);
    if (!cellDep) {
      return;
    }

    // Create a set of cells to recalculate
    const toRecalculate = new Set<string>();

    // Add all dependent cells
    this.addDependentCells(cellKey, toRecalculate);

    // Recalculate all cells
    for (const depKey of toRecalculate) {
      const coord = this.sheet.coordFromAddress(depKey);

      // Clear the cache for this cell
      this.formulaCache.delete(depKey);

      // Re-evaluate the formula
      this.evaluateFormula(coord.row, coord.col);
    }
  }

  /**
   * Recursively adds all cells that depend on the given cell
   * @param cellKey Cell address key
   * @param result Set to add dependent cells to
   */
  private addDependentCells(cellKey: string, result: Set<string>): void {
    const cellDep = this.dependencies.get(cellKey);
    if (!cellDep) {
      return;
    }

    for (const depKey of cellDep.dependedBy) {
      if (!result.has(depKey)) {
        result.add(depKey);
        this.addDependentCells(depKey, result);
      }
    }
  }

  /**
   * Clears the formula cache
   */
  clearCache(): void {
    this.formulaCache.clear();
  }
}
