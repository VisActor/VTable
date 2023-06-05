// @ts-nocheck
import parse from 'cssfontparser';

export function parseFont(font: string) {
  return parse(font);
}
