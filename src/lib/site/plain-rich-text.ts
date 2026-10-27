export function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        children: [{
          type: 'text',
          version: 1,
          text,
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
        }],
      })),
    },
  }
}
