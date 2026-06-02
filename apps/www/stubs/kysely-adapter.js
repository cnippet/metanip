// Stub — project uses @better-auth/prisma-adapter; the kysely adapter is never loaded at runtime.
// This file exists only to satisfy Turbopack's static module tracing, which otherwise
// follows better-auth's internal import of @better-auth/kysely-adapter and fails because
// the adapter imports DEFAULT_MIGRATION_LOCK_TABLE / DEFAULT_MIGRATION_TABLE from
// kysely@0.29.x where those constants no longer exist.
export default {};
