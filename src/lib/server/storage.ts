function encodedPath(parts: string[]): string {
  const segments = parts.flatMap((part) => part.split('/')).filter(Boolean)
  if (
    segments.length === 0 ||
    segments.some(
      (segment) =>
        segment === '.' ||
        segment === '..' ||
        segment.includes('\\') ||
        segment.includes('\0'),
    )
  ) {
    throw new Error('Storage object path is invalid.')
  }
  return segments.map(encodeURIComponent).join('/')
}

export function privateKitObjectPath(
  filename: string,
  prefix?: string | null,
): string {
  const folder = prefix?.trim().replace(/\/+$/, '') || 'starter-kit-assets'
  if (folder !== 'starter-kit-assets' && !folder.startsWith('starter-kit-assets/')) {
    throw new Error('Starter Kit asset prefix is outside its private storage folder.')
  }
  return encodedPath([folder, filename])
}

export function publicMediaURL(
  storageURL: string,
  bucket: string,
  filename: string,
  prefix?: string | null,
): string {
  const base = new URL(storageURL)
  const path = encodedPath([...(prefix ? [prefix] : []), filename])
  const encodedBucket = encodeURIComponent(bucket)
  return new URL(
    `/storage/v1/object/public/${encodedBucket}/${path}`,
    base,
  ).toString()
}
