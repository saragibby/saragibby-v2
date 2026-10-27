import { loadEnvFile } from 'node:process'

try {
  loadEnvFile()
} catch (error) {
  if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
    throw error
  }
}
