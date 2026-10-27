export function isUniqueConstraintError(error: unknown): boolean {
  let current = error
  for (let depth = 0; depth < 4 && current instanceof Error; depth += 1) {
    if ('code' in current && current.code === '23505') return true
    current = current.cause
  }
  return false
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected backend error.'
}
