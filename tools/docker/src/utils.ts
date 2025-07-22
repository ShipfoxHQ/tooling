export function makeTagLatest(image: string) {
  const [radix, tag] = image.split(':');
  const [_, ...suffix] = tag.split('-');
  const newTag = ['latest', ...suffix].join('-');
  return `${radix}:${newTag}`;
}
