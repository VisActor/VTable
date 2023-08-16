/* Adapted from cheetah-grid by yosuke ota
 *url:https://github.com/future-architect/cheetah-grid/blob/master/packages/cheetah-grid/src/js/internal/calc.ts
 *License: https://github.com/future-architect/cheetah-grid/blob/master/LICENSE
 * @license
 */

import { isNil, isNumber, isString } from '@visactor/vutils';
import { array } from './helper';

const TYPE_PAREN = 0;
const TYPE_UNIT = 1;
const TYPE_OPERATOR = 2;
const TYPE_NUMBER = 3;

const NODE_TYPE_UNIT = 10;
const NODE_TYPE_BINARY_EXPRESSION = 11;
const NODE_TYPE_NUMBER = 12;

type Ops = '-' | '+' | '*' | '/';
type ParenToken = {
  value: '(' | ')';
  type: typeof TYPE_PAREN;
};
type UnitToken = {
  unit: string;
  value: number;
  type: typeof TYPE_UNIT;
};
type OpToken = {
  value: Ops;
  type: typeof TYPE_OPERATOR;
};
type NumToken = {
  value: number;
  type: typeof TYPE_NUMBER;
};
type Token = ParenToken | UnitToken | OpToken | NumToken;
type UnitNode = {
  nodeType: typeof NODE_TYPE_UNIT;
  unit: string;
  value: number;
};
type BinaryNode = {
  nodeType: typeof NODE_TYPE_BINARY_EXPRESSION;
  left: Node;
  op: OpToken;
  right: Node;
};
type NumNode = {
  nodeType: typeof NODE_TYPE_NUMBER;
  value: number;
};
type Node = UnitNode | BinaryNode | NumNode;

const TABULATION = 0x09;
const CARRIAGE_RETURN = 0x0d;
const LINE_FEED = 0x0a;
const FORM_FEED = 0x0c;
const SPACE = 0x20;
const PERCENT = 0x25;
const FULL_STOP = 0x2e;
const DIGIT_0 = 0x30;
const DIGIT_9 = 0x39;
const LATIN_CAPITAL_A = 0x41;
const LATIN_CAPITAL_Z = 0x5a;
const LATIN_SMALL_A = 0x61;
const LATIN_SMALL_Z = 0x7a;
function isUpperLetter(cp: number): boolean {
  return cp >= LATIN_CAPITAL_A && cp <= LATIN_CAPITAL_Z;
}
function isLowerLetter(cp: number): boolean {
  return cp >= LATIN_SMALL_A && cp <= LATIN_SMALL_Z;
}
function isLetter(cp: number): boolean {
  return isLowerLetter(cp) || isUpperLetter(cp);
}
function isWhitespace(cp: number): boolean {
  return cp === TABULATION || cp === LINE_FEED || cp === FORM_FEED || cp === CARRIAGE_RETURN || cp === SPACE;
}
function isDigit(cp: number): boolean {
  return cp >= DIGIT_0 && cp <= DIGIT_9;
}
function isDot(cp: number): boolean {
  return cp === FULL_STOP;
}
function isUnit(cp: number): boolean {
  return isLetter(cp) || cp === PERCENT;
}

function createError(calc: string): Error {
  return new Error(`calc parse error: ${calc}`);
}

/**
 * tokenize
 * @param {string} calc calc expression
 * @returns {Array} tokens
 * @private
 */
function tokenize(calc: string): Token[] {
  const exp = calc.replace(/calc\(/g, '(').trim();

  const tokens: Token[] = [];
  const len = exp.length;
  for (let index = 0; index < len; index++) {
    const c = exp[index];
    const cp = c.charCodeAt(0);
    if (c === '(' || c === ')') {
      tokens.push({ value: c, type: TYPE_PAREN });
    } else if (c === '*' || c === '/') {
      tokens.push({ value: c, type: TYPE_OPERATOR });
    } else if (c === '+' || c === '-') {
      index = parseSign(c, index + 1) - 1;
    } else if (isDigit(cp) || isDot(cp)) {
      index = parseNum(c, index + 1) - 1;
    } else if (isWhitespace(cp)) {
      // skip
    } else {
      throw createError(calc);
    }
  }

  function parseSign(sign: '+' | '-', start: number): number {
    if (start < len) {
      const c = exp[start];
      const cp = c.charCodeAt(0);
      if (isDigit(cp) || isDot(cp)) {
        return parseNum(sign + c, start + 1);
      }
    }
    tokens.push({ value: sign, type: TYPE_OPERATOR });
    return start;
  }
  function parseNum(num: string, start: number): number {
    let index = start;
    for (; index < len; index++) {
      const c = exp[index];
      const cp = c.charCodeAt(0);
      if (isDigit(cp)) {
        num += c;
      } else if (c === '.') {
        if (num.indexOf('.') >= 0) {
          throw createError(calc);
        }
        num += c;
      } else if (isUnit(cp)) {
        return parseUnit(num, c, index + 1);
      } else {
        break;
      }
    }
    if (num === '.') {
      throw createError(calc);
    }
    tokens.push({ value: parseFloat(num), type: TYPE_NUMBER });
    return index;
  }
  function parseUnit(num: string, unit: string, start: number): number {
    let index = start;
    for (; index < len; index++) {
      const c = exp[index];
      const cp = c.charCodeAt(0);
      if (isUnit(cp)) {
        unit += c;
      } else {
        break;
      }
    }
    tokens.push({ value: parseFloat(num), unit, type: TYPE_UNIT });
    return index;
  }
  return tokens;
}

const PRECEDENCE = {
  '*': 3,
  '/': 3,
  '+': 2,
  '-': 2
};

function lex(tokens: Token[], calc: string): Node {
  function buildBinaryExpNode(stack: (Node | OpToken)[]): BinaryNode {
    const right = stack.pop() as Node;
    const op = stack.pop() as OpToken;
    const left = stack.pop() as Node;

    if (!left || !left.nodeType || !op || op.type !== TYPE_OPERATOR || !right || !right.nodeType) {
      throw createError(calc);
    }
    return {
      nodeType: NODE_TYPE_BINARY_EXPRESSION,
      left,
      op,
      right
    };
  }

  const stack: (Node | OpToken)[] = [];

  while (tokens.length) {
    const token = tokens.shift() as Token;
    if (token.type === TYPE_PAREN && token.value === '(') {
      let deep = 0;
      const closeIndex = array.findIndex(tokens, t => {
        if (t.type === TYPE_PAREN && t.value === '(') {
          deep++;
        } else if (t.type === TYPE_PAREN && t.value === ')') {
          if (!deep) {
            return true;
          }
          deep--;
        }
        return false;
      });
      if (closeIndex === -1) {
        throw createError(calc);
      }

      stack.push(lex(tokens.splice(0, closeIndex), calc));
      tokens.shift();
    } else if (token.type === TYPE_OPERATOR) {
      if (stack.length >= 3) {
        const beforeOp = (stack[stack.length - 2] as OpToken).value;
        if (PRECEDENCE[token.value] <= PRECEDENCE[beforeOp]) {
          stack.push(buildBinaryExpNode(stack));
        }
      }
      stack.push(token);
    } else if (token.type === TYPE_UNIT) {
      const { value: num, unit } = token;
      stack.push({
        nodeType: NODE_TYPE_UNIT,
        value: num,
        unit
      });
    } else if (token.type === TYPE_NUMBER) {
      stack.push({
        nodeType: NODE_TYPE_NUMBER,
        value: token.value
      });
    }
  }
  while (stack.length > 1) {
    stack.push(buildBinaryExpNode(stack));
  }
  return stack[0] as Node;
}

function parse(calcStr: string): Node {
  const tokens = tokenize(calcStr);
  return lex(tokens, calcStr);
}

function calcNode(node: Node, context: CalcContext): number {
  if (node.nodeType === NODE_TYPE_BINARY_EXPRESSION) {
    const left = calcNode(node.left, context);
    const right = calcNode(node.right, context);

    switch (node.op.value) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`calc error. unknown operator: ${node.op.value}`);
    }
  } else if (node.nodeType === NODE_TYPE_UNIT) {
    switch (node.unit) {
      case '%':
        return (node.value * context.full) / 100;
      // case 'em':
      //   return node.value * context.em;
      case 'px':
        return node.value;
      default:
        throw new Error(`calc error. unknown unit: ${node.unit}`);
    }
  } else if (node.nodeType === NODE_TYPE_NUMBER) {
    return node.value;
  }
  throw new Error('calc error.');
}

function toPxInternal(value: string, context: CalcContext): number {
  const ast = parse(value);
  return calcNode(ast, context);
}

type CalcContext = {
  full: number;
  // em: number;
};

export function toPx(value: string | number, context: CalcContext): number {
  if (typeof value === 'string') {
    return toPxInternal(value.trim(), context);
  }
  return value - 0;
}

export type IPercent = `${number}%`;

export function couldBeValidNumber(v: any) {
  if (isNil(v)) {
    return false;
  }
  if (isNumber(v)) {
    return true;
  }
  // eslint-disable-next-line no-self-compare
  return +v === +v;
}

export function isPercent(v: any): v is IPercent {
  if (!isString(v)) {
    return false;
  }
  if (!v.endsWith('%')) {
    return false;
  }
  return couldBeValidNumber(v.substring(0, v.length - 1));
}
