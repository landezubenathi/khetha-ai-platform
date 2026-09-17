# API contract

Base path: `/api/v1`

Interactive OpenAPI documentation is available at `/docs` while the service is running.

## Authentication

During local development, protected endpoints accept this header:

```text
X-Demo-User-ID: 00000000-0000-4000-8000-000000000001
```

The header is intentionally disabled outside the `development` and `test` environments. Production must replace this adapter with DHET-approved OIDC/JWT validation and derive the user identifier from the verified token.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness response |
| `GET` | `/catalog/subjects` | Active school subjects |
| `GET` | `/catalog/interests` | Active interest categories |
| `GET` | `/catalog/careers` | Searchable, source-labelled careers and pathways |
| `GET` | `/catalog/qualifications` | Searchable qualifications |
| `GET` | `/catalog/providers` | Searchable learning providers |
| `GET` | `/assessments/{code}` | Fetch a published assessment and ordered questions |
| `POST` | `/assessments/{code}/attempts` | Validate answers, score an attempt and store its result |
| `POST` | `/recommendations` | Rank approved careers with an explanation and score components |
| `GET` | `/journey` | Return the authenticated learner's saved actions |
| `PUT` | `/journey/{item_id}` | Create or update a journey action idempotently |
| `DELETE` | `/journey/{item_id}` | Soft-delete a journey action |
| `POST` | `/practitioner-requests` | Request a counsellor/practitioner follow-up |
| `POST` | `/sync` | Accept a client event once using its idempotency key |

## Recommendation request

```json
{
  "subject_codes": ["MATH", "PHYS"],
  "interest_codes": ["TECH", "BUILD"],
  "limit": 5
}
```

The response exposes the matched subjects and interests behind every rank. It is a guidance score, not an admission or eligibility decision.

## Sync contract

Every offline mutation is assigned a client-generated `idempotency_key`. Replaying a successful event returns the stored result instead of creating a duplicate. The server remains authoritative for catalogue content and recommendation records; the mobile database is a cache and pending-operation queue.

## Versioning

The bootstrap response includes a content version. A client should replace its local catalogue transactionally when that version changes and retain unsent user events until the server acknowledges them.
