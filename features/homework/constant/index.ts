import type { Element, ElementContent, Root } from 'hast';

function childElements(node: Element, tag: string) {
  return node.children.filter(
    (child): child is Element =>
      child.type === 'element' && child.tagName === tag,
  );
}

function textOf(node: ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

function labelTable(table: Element) {
  const [head] = childElements(table, 'thead');
  const [headRow] = head ? childElements(head, 'tr') : [];
  if (!headRow) return;

  const labels = childElements(headRow, 'th').map((cell) =>
    textOf(cell).trim(),
  );

  for (const body of childElements(table, 'tbody')) {
    for (const row of childElements(body, 'tr')) {
      childElements(row, 'td').forEach((cell, index) => {
        cell.properties = {
          ...cell.properties,
          dataLabel: labels[index] ?? '',
        };
      });
    }
  }
}

function walk(node: Root | Element) {
  for (const child of node.children) {
    if (child.type !== 'element') continue;
    if (child.tagName === 'table') labelTable(child);
    else walk(child);
  }
}

// Copies each column header onto its cells as data-label, for stacked mobile tables
export default function rehypeTableLabels() {
  return (tree: Root) => walk(tree);
}
