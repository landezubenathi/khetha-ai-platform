# Database Design

## Domains

| Domain | Tables |
|---|---|
| Identity and consent | `app_users`, `consent_records`, `learner_profiles` |
| Learner context | `learner_subjects`, `learner_interests` |
| Approved content | `content_versions`, `subjects`, `interests`, `careers`, `qualifications`, `providers` and join tables |
| Assessments | `assessment_definitions`, `assessment_questions`, `assessment_options`, `assessment_attempts`, `assessment_answers` |
| Personalisation | `recommendations` |
| Ongoing journey | `journey_items`, `reminders`, `practitioner_requests` |
| Offline operation | `sync_events` |
| Governance | `audit_events` |

## Core relationships

| Parent | Child or link | Cardinality | Purpose |
|---|---|---:|---|
| `app_users` | `learner_profiles` | 1 : 0..1 | Optional learner context without storing credentials |
| `app_users` | `consent_records` | 1 : many | Append-only evidence per processing purpose and policy version |
| `content_versions` | catalogue tables | 1 : many | Trace every fact to a named content import or release |
| `careers` | `career_subject_requirements` | 1 : many | Required/recommended subjects and optional achievement level |
| `careers` | `career_interests` | many : many | Weighted interest matching |
| `careers` | `career_qualifications` | many : many | Possible, required or specialisation pathways |
| `providers` | `provider_qualifications` | many : many | Delivery mode and application link per provider offering |
| `assessment_definitions` | questions → options | 1 : many | Immutable, versioned questionnaire structure |
| `assessment_attempts` | `assessment_answers` | 1 : many | Learner responses separated from the published definition |
| `app_users` | `recommendations` | 1 : many | Reproducible output with algorithm and input snapshots |
| `app_users` | `journey_items` → `reminders` | 1 : many | Persistent actions and follow-ups |
| `app_users` | `sync_events` | 1 : many | Idempotent processing of offline changes |

## Important decisions

- UUIDs allow safe client-created journey and sync identifiers.
- `content_versions` makes every recommendation reproducible against a known source set.
- Assessment definitions and attempts are separate so updated questionnaires do not rewrite history.
- Recommendations persist input snapshots, algorithm versions, sources and reason codes.
- Soft deletion on journey items supports offline reconciliation.
- `sync_events.event_id` provides idempotency; sending the same event twice does not duplicate work.
- Contact and accessibility fields use JSONB only where requirements are expected to evolve; core relationships remain normalised.

## Integrity and performance

- Foreign keys protect all authoritative relationships; learner-owned rows cascade when a user is deleted.
- Check constraints restrict roles, statuses, assessment types, NQF levels, achievement levels and sync operations.
- Unique constraints stop duplicate content codes, assessment versions, questionnaire ordering and sync events.
- Partial indexes target active journey items and scheduled reminders; user/time indexes support history screens and audit queries.
- `updated_at` triggers provide consistent server timestamps on mutable records.

## Privacy and security boundary

- Authentication credentials are not stored in this database. `external_identity_id` points to the approved identity provider.
- Consent is purpose-specific. A production service must verify active consent before personalisation, notifications or practitioner hand-off.
- The mobile SQLite database stores a minimal journey mirror and catalogue cache; access tokens belong in OS secure storage.
- The API checks resource ownership. Before a pilot, add PostgreSQL row-level security as defence in depth, define retention periods, encrypt backups and exercise delete/export workflows required by the approved POPIA assessment.
- Audit metadata must never contain free-form secrets or unnecessary learner content.

## Local versus production

The migration and seed provide a coherent local/hackathon database. The seed is explicitly non-official. Production still requires an approved NCAP ingestion job, OIDC integration, row-level security, managed backups, monitoring, migration review and retention policy sign-off.

## Migration policy

The initial SQL is suitable for a new local database. After the hackathon, adopt Alembic migrations and never edit an already-deployed migration. Add a new numbered migration instead.

## Reset local data

This removes the local Docker database volume:

```bash
docker compose down -v
docker compose up --build
```

Do not run this against pilot or production infrastructure.
