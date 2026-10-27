import { X509Certificate } from "node:crypto"

export function databaseConnectionOptions(connectionString: string, certificate?: string) {
  const url = new URL(connectionString)
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("DATABASE_URL must be a PostgreSQL URL.")
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  for (const key of ["sslmode", "ssl", "sslcert", "sslkey", "sslrootcert"]) {
    url.searchParams.delete(key)
  }
  if (certificate) {
    const parsed = new X509Certificate(certificate)
    if (!parsed.ca || Date.parse(parsed.validTo) <= Date.now()) {
      throw new Error("DATABASE_CA_CERT must be an unexpired CA certificate.")
    }
  }
  return {
    connectionString: url.toString(),
    ssl: local ? false as const : {
      rejectUnauthorized: true,
      ...(certificate ? { ca: certificate } : {}),
    },
  }
}
