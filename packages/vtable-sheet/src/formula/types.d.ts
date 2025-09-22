// Type definitions for hot-formula-parser
declare module 'hot-formula-parser' {
  export interface ParseResult {
    result: unknown;
    error?: string;
  }

  export class Parser {
    constructor();

    on(event: 'callCellValue', callback: (cellAddress: string, done: (value: unknown) => void) => void): void;
    on(
      event: 'callRangeValue',
      callback: (startCell: string, endCell: string, done: (values: unknown[][]) => void) => void
    ): void;

    setFunction(name: string, fn: (...params: unknown[]) => unknown): void;
    setVariable(name: string, value: unknown): void;
    getVariable(name: string): unknown;

    parse(formula: string): ParseResult;
  }
}

// Type definitions for @formulajs/formulajs
declare module '@formulajs/formulajs' {
  export function ABS(value: number): number;
  export function ACOS(value: number): number;
  export function AND(...logical: boolean[]): boolean;
  export function ASIN(value: number): number;
  export function ATAN(value: number): number;
  export function AVERAGE(...values: number[]): number;
  export function CEILING(number: number, significance: number): number;
  export function CONCATENATE(...text: string[]): string;
  export function COS(value: number): number;
  export function COUNT(...values: unknown[]): number;
  export function COUNTA(...values: unknown[]): number;
  export function COUNTIF(range: unknown[], criteria: string | number): number;
  export function COUNTIFS(...args: unknown[]): number;
  export function DATE(year: number, month: number, day: number): Date;
  export function DAY(date: Date): number;
  export function FLOOR(number: number, significance: number): number;
  export function IF(logical: boolean, valueIfTrue: unknown, valueIfFalse: unknown): unknown;
  export function IFERROR(value: unknown, valueIfError: unknown): unknown;
  export function INDEX(array: unknown[], row: number, column?: number): unknown;
  export function LEFT(text: string, numChars?: number): string;
  export function LEN(text: string): number;
  export function LOWER(text: string): string;
  export function MATCH(lookupValue: unknown, lookupArray: unknown[], matchType?: number): number;
  export function MAX(...values: number[]): number;
  export function MID(text: string, startNum: number, numChars: number): string;
  export function MIN(...values: number[]): number;
  export function MONTH(date: Date): number;
  export function NOT(logical: boolean): boolean;
  export function NOW(): Date;
  export function OR(...logical: boolean[]): boolean;
  export function RIGHT(text: string, numChars?: number): string;
  export function ROUND(number: number, digits: number): number;
  export function ROUNDDOWN(number: number, digits: number): number;
  export function ROUNDUP(number: number, digits: number): number;
  export function SIN(value: number): number;
  export function SUM(...values: number[]): number;
  export function SUMIF(range: unknown[], criteria: string | number, sumRange?: unknown[]): number;
  export function SUMIFS(sumRange: unknown[], ...criteria: unknown[]): number;
  export function TAN(value: number): number;
  export function TODAY(): Date;
  export function UPPER(text: string): string;
  export function VLOOKUP(
    lookupValue: unknown,
    tableArray: unknown[],
    colIndexNum: number,
    rangeLookup?: boolean
  ): unknown;
  export function YEAR(date: Date): number;
}
