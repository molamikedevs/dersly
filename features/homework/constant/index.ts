import { Element, ElementContent, Root } from 'hast';
import { CSSProperties } from 'react';

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

// The light colours, set on the printed sheet itself, so a teacher in dark
// mode still gets dark text on white paper
export const PAPER = {
  '--background': 'oklch(1 0 0)',
  '--foreground': 'oklch(0.26 0.02 165)',
  '--card': 'oklch(1 0 0)',
  '--primary': 'oklch(0.38 0.055 168)',
  '--muted': 'oklch(0.948 0.012 85)',
  '--muted-foreground': 'oklch(0.5 0.013 160)',
  '--warning-subtle': 'oklch(0.935 0.035 72)',
  '--warning-subtle-foreground': 'oklch(0.43 0.1 58)',
  '--border': 'oklch(0.899 0.017 85)',
} as CSSProperties;

// While printing, only the sheet is on the page: the bars, the sidebar and
// the toasts are hidden, so the PDF holds the homework and nothing else
export const PRINT_CSS = `
@page { margin: 18mm 16mm; }
@media print {
  body > :not(#homework-print) { display: none !important; }
  body { background: #fff !important; padding: 0 !important; }
  #homework-print { display: block !important; }
  #homework-print img, #homework-print tr, #homework-print blockquote,
  #homework-print pre { break-inside: avoid; }
  #homework-print h2, #homework-print h3 { break-after: avoid; }
}
`;

// Pictures in the guide load lazily, and a hidden picture never loads. Load
// them all before the dialog opens, or they come out blank in the PDF.
export function loadImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'));

  return Promise.all(
    images.map((image) => {
      image.loading = 'eager';
      return image.decode().catch(() => null);
    }),
  );
}

export function countLabel(count: number) {
  return count === 1 ? '1 homework' : `${count} homework`;
}
