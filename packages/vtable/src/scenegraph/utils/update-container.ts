import type { Group } from '../graphic/group';

export function updateContainerChildrenX(containerGroup: Group, x: number): number {
  // let x = 0;
  containerGroup.forEachChildrenSkipChild((column: Group, index) => {
    column.setAttribute('x', x);
    x += column.attribute.width;
  });
  return x;
}
