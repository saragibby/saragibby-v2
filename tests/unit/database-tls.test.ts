import { describe, expect, it } from "vitest"
import { databaseConnectionOptions } from "../../src/lib/server/database-tls"

describe("database TLS configuration", () => {
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
