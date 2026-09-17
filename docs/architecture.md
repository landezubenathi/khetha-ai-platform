# Architecture

## Product boundary

Khetha AI is a mobile companion for NCAP, not a replacement career database. It adds app-native navigation, offline access, a persistent learner journey, reminders, personalisation and practitioner support around authorised content.

## Components

| Component | Responsibility |
|---|---|
| Expo mobile app | Learner UX, accessibility, local content, offline writes, reminders and sync |
| FastAPI service | Validation, authorisation, catalogue APIs, recommendations, journey orchestration and audit hooks |
| PostgreSQL | Authoritative users, consent, content, assessments, recommendations, journeys and audit data |
| SQLite | Versioned offline catalogue cache, local journey mirror and idempotent sync queue |
| NCAP adapter | Approved API/import boundary; validates versions and checksums before publication |
| OIDC adapter | Approved identity integration; no passwords are stored by the application service |
| Notification adapter | Local reminders first; approved push provider later |

## Trust rules

1. Career, qualification and provider facts must come from an approved content version.
2. Matching is deterministic and returns reason codes plus missing requirements.
3. Generative AI may rephrase approved fields but cannot create eligibility or admission facts.
4. Low-confidence results and learner requests must expose a human-practitioner route.
5. Offline content always displays its version and freshness date.
6. Identity, consent and learner journey records are logically separated.

## Deployment path

- Hackathon: Docker PostgreSQL, FastAPI, Expo development build, demo content.
- Pilot: managed PostgreSQL, containerised API, approved OIDC, NCAP import/API, central logging, encrypted secrets and controlled mobile distribution.
- Production: government-approved hosting, disaster recovery, monitored sync and content pipelines, security testing, POPIA controls and operational support.

