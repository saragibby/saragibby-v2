import { describe, expect, it } from "vitest"
import { databaseConnectionOptions } from "../../src/lib/server/database-tls"

describe("database TLS configuration", () => {
  const sessionPooler =
    "postgresql://postgres.project:example@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

  it("rejects the Supabase session pooler on Vercel", () => {
    expect(() => databaseConnectionOptions(sessionPooler, undefined, true))
      .toThrow("transaction pooler DATABASE_URL on port 6543")
    expect(() => databaseConnectionOptions(
      sessionPooler.replace(":5432", ""),
      undefined,
      true,
    )).toThrow("transaction pooler")
  })

  it("allows the Supabase transaction pooler on Vercel with verified TLS", () => {
    expect(databaseConnectionOptions(
      sessionPooler.replace(":5432", ":6543"),
      undefined,
      true,
    ).ssl).toEqual({ rejectUnauthorized: true })
  })

  it("preserves session pooling for migrations outside Vercel", () => {
    expect(databaseConnectionOptions(sessionPooler).ssl)
      .toEqual({ rejectUnauthorized: true })
  })

  it("does not restrict other PostgreSQL providers on Vercel", () => {
    expect(databaseConnectionOptions(
      "postgresql://db.example.com:5432/db",
      undefined,
      true,
    ).ssl).toEqual({ rejectUnauthorized: true })
  })
  it("uses verified TLS remotely and strips conflicting URL SSL parameters", () => {
    const options = databaseConnectionOptions("postgresql://user:pass@db.example.com/db?sslmode=no-verify")
    expect(options.ssl).toEqual({ rejectUnauthorized: true })
    expect(new URL(options.connectionString).searchParams.has("sslmode")).toBe(false)
  })
  it("does not mistake a remote hostname containing localhost for loopback", () => {
    expect(databaseConnectionOptions("postgresql://localhost.example.com/db").ssl).toEqual({ rejectUnauthorized: true })
  })
  it("allows local development without TLS", () => {
    expect(databaseConnectionOptions("postgresql://localhost/db").ssl).toBe(false)
  })
  it("rejects malformed CA certificates", () => {
    expect(() => databaseConnectionOptions("postgresql://db.example.com/db", "invalid")).toThrow()
  })
  it("rejects non-Postgres URLs", () => {
    expect(() => databaseConnectionOptions("https://example.com")).toThrow("PostgreSQL")
  })
})
