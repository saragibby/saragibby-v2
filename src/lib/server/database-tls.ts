import { X509Certificate } from "node:crypto"

export function databaseConnectionOptions(
  connectionString: string,
  certificate?: string,
  onVercel = false,
) {
  const url = new URL(connectionString)
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("DATABASE_URL must be a PostgreSQL URL.")
  }
  if (
    onVercel &&
    url.hostname.endsWith(".pooler.supabase.com") &&
    (url.port || "5432") !== "6543"
  ) {
    throw new Error(
      "Vercel requires the Supabase transaction pooler DATABASE_URL on port 6543. Use DATABASE_POOL_MAX=3. Reserve the session pooler on port 5432 for migrations and maintenance.",
    )
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
