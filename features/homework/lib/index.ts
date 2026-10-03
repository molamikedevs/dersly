type UploadedImage = { alt: string; url: string };

export function toAltText(fileName: string) {
  const name = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/[[\]|]/g, '')
    .trim();

  return name || 'picture';
}

export function toVocabularyTable(images: UploadedImage[]) {
  const rows = images.map(
    ({ alt, url }) => `| ![${alt}](${url}) | **${alt}** |  |`,
  );

  return [
    '',
    '',
    '| Picture | Word | Example |',
    '| --- | --- | --- |',
    ...rows,
    '',
    '',
  ].join('\n');
}
