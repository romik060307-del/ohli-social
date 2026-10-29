# PostgreSQL migration reference

`migrations/001_initial_schema.sql` is a normalized PostgreSQL schema for a future hosted OHLI Social backend. It covers accounts/sessions, privacy relations, posts/interactions, stories/views, media metadata, direct/group chat receipts, communities/channels, notifications, and reports.

**It is not connected to the current Android app.** The Java backend still reads/writes JSON files in Android private storage. Do not run this migration expecting the APK to switch automatically to PostgreSQL; a hosted backend/API, data importer, secrets management, and migration tests must be implemented before using it. The schema uses internal UUID user IDs, so migrating from legacy phone-number IDs requires a verified mapping and reconciliation script.
