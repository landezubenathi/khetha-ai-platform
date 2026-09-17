BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_label VARCHAR(80) NOT NULL UNIQUE,
    source_name VARCHAR(160) NOT NULL,
    source_uri TEXT,
    is_official BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checksum_sha256 VARCHAR(64),
    notes TEXT
);

CREATE TABLE app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_identity_id VARCHAR(255) UNIQUE,
    role VARCHAR(30) NOT NULL DEFAULT 'learner'
        CHECK (role IN ('learner', 'practitioner', 'content_admin', 'auditor', 'system_admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'deleted')),
    preferred_language VARCHAR(16) NOT NULL DEFAULT 'en-ZA',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    purpose VARCHAR(60) NOT NULL
        CHECK (purpose IN ('career_guidance', 'personalisation', 'notifications', 'practitioner_handoff', 'analytics')),
    granted BOOLEAN NOT NULL,
    policy_version VARCHAR(40) NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    withdrawn_at TIMESTAMPTZ,
    capture_channel VARCHAR(30) NOT NULL DEFAULT 'mobile',
    UNIQUE (user_id, purpose, policy_version, captured_at)
);

CREATE TABLE learner_profiles (
    user_id UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
    age_band VARCHAR(20) CHECK (age_band IN ('under_13', '13_15', '16_17', '18_plus', 'not_shared')),
    grade_level VARCHAR(30),
    province VARCHAR(40),
    municipality VARCHAR(120),
    school_type VARCHAR(30),
    connectivity_mode VARCHAR(20) NOT NULL DEFAULT 'low_data'
        CHECK (connectivity_mode IN ('offline_first', 'low_data', 'standard')),
    accessibility_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    career_goal TEXT,
    profile_completeness SMALLINT NOT NULL DEFAULT 0 CHECK (profile_completeness BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    content_version_id UUID REFERENCES content_versions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE learner_subjects (
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    achievement_level SMALLINT CHECK (achievement_level BETWEEN 1 AND 7),
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, subject_id)
);

CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    content_version_id UUID REFERENCES content_versions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE learner_interests (
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES interests(id),
    weight NUMERIC(4,3) NOT NULL DEFAULT 1.0 CHECK (weight BETWEEN 0 AND 1),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, interest_id)
);

CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    summary TEXT NOT NULL,
    work_environment TEXT,
    source_reference VARCHAR(255),
    content_version_id UUID NOT NULL REFERENCES content_versions(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE career_subject_requirements (
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    requirement_type VARCHAR(20) NOT NULL
        CHECK (requirement_type IN ('required', 'recommended')),
    minimum_achievement_level SMALLINT CHECK (minimum_achievement_level BETWEEN 1 AND 7),
    notes TEXT,
    PRIMARY KEY (career_id, subject_id, requirement_type)
);

CREATE TABLE career_interests (
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES interests(id),
    weight NUMERIC(4,3) NOT NULL DEFAULT 1.0 CHECK (weight BETWEEN 0 AND 1),
    PRIMARY KEY (career_id, interest_id)
);

CREATE TABLE qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(220) NOT NULL,
    nqf_level SMALLINT CHECK (nqf_level BETWEEN 1 AND 10),
    description TEXT,
    typical_duration VARCHAR(80),
    admission_notes TEXT,
    source_reference VARCHAR(255),
    content_version_id UUID NOT NULL REFERENCES content_versions(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE career_qualifications (
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    qualification_id UUID NOT NULL REFERENCES qualifications(id) ON DELETE CASCADE,
    relationship_type VARCHAR(30) NOT NULL DEFAULT 'possible_pathway'
        CHECK (relationship_type IN ('required_pathway', 'possible_pathway', 'specialisation')),
    PRIMARY KEY (career_id, qualification_id)
);

CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(220) NOT NULL,
    provider_type VARCHAR(40),
    province VARCHAR(40),
    website_url TEXT,
    contact_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    source_reference VARCHAR(255),
    content_version_id UUID NOT NULL REFERENCES content_versions(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_qualifications (
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    qualification_id UUID NOT NULL REFERENCES qualifications(id) ON DELETE CASCADE,
    delivery_modes JSONB NOT NULL DEFAULT '[]'::jsonb,
    application_url TEXT,
    verified_at TIMESTAMPTZ,
    PRIMARY KEY (provider_id, qualification_id)
);

CREATE TABLE assessment_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL,
    version VARCHAR(40) NOT NULL,
    title VARCHAR(180) NOT NULL,
    assessment_type VARCHAR(30) NOT NULL
        CHECK (assessment_type IN ('career_choice', 'job_fit', 'interest_explorer')),
    instructions TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    content_version_id UUID NOT NULL REFERENCES content_versions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (code, version)
);

CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessment_definitions(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL CHECK (sequence_number > 0),
    prompt TEXT NOT NULL,
    response_type VARCHAR(30) NOT NULL
        CHECK (response_type IN ('single_choice', 'multiple_choice', 'scale', 'free_text')),
    required BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (assessment_id, sequence_number)
);

CREATE TABLE assessment_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL CHECK (sequence_number > 0),
    label TEXT NOT NULL,
    value VARCHAR(100) NOT NULL,
    scoring_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (question_id, sequence_number)
);

CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessment_definitions(id),
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    result_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    client_event_id UUID UNIQUE
);

CREATE TABLE assessment_answers (
    attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES assessment_questions(id),
    answer JSONB NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (attempt_id, question_id)
);

CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id),
    score SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 100),
    confidence VARCHAR(20) NOT NULL CHECK (confidence IN ('low', 'medium', 'high')),
    reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
    missing_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    input_snapshot JSONB NOT NULL,
    algorithm_version VARCHAR(40) NOT NULL,
    content_version_id UUID NOT NULL REFERENCES content_versions(id),
    practitioner_review_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journey_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    item_type VARCHAR(30) NOT NULL
        CHECK (item_type IN ('career', 'qualification', 'provider', 'task')),
    reference_id UUID,
    title VARCHAR(220) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'saved'
        CHECK (status IN ('saved', 'exploring', 'planned', 'completed', 'removed')),
    notes TEXT,
    target_date DATE,
    source_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    client_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE (user_id, item_type, reference_id)
);

CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    journey_item_id UUID REFERENCES journey_items(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    body TEXT,
    scheduled_for TIMESTAMPTZ NOT NULL,
    notification_channel VARCHAR(20) NOT NULL DEFAULT 'local'
        CHECK (notification_channel IN ('local', 'push', 'sms', 'email')),
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'sent', 'cancelled', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE practitioner_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    reason VARCHAR(60) NOT NULL
        CHECK (reason IN ('low_confidence', 'subject_choice', 'career_choice', 'job_fit', 'accessibility', 'other')),
    learner_message TEXT,
    preferred_channel VARCHAR(20) CHECK (preferred_channel IN ('phone', 'email', 'in_app', 'none')),
    status VARCHAR(20) NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'assigned', 'contacted', 'resolved', 'cancelled')),
    assigned_practitioner_id UUID REFERENCES app_users(id),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT
);

CREATE TABLE sync_events (
    event_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    device_id VARCHAR(160) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('upsert', 'delete')),
    payload JSONB NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    client_updated_at TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processing_status VARCHAR(20) NOT NULL DEFAULT 'accepted'
        CHECK (processing_status IN ('accepted', 'applied', 'duplicate', 'rejected')),
    error_message TEXT
);

CREATE TABLE audit_events (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id UUID REFERENCES app_users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(80) NOT NULL,
    resource_id VARCHAR(160),
    outcome VARCHAR(20) NOT NULL DEFAULT 'success'
        CHECK (outcome IN ('success', 'denied', 'failure')),
    request_id VARCHAR(100),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_careers_name ON careers (LOWER(name));
CREATE INDEX idx_qualifications_title ON qualifications (LOWER(title));
CREATE INDEX idx_providers_name ON providers (LOWER(name));
CREATE INDEX idx_recommendations_user_created ON recommendations (user_id, created_at DESC);
CREATE INDEX idx_assessment_attempts_user_started ON assessment_attempts (user_id, started_at DESC);
CREATE INDEX idx_journey_items_user_status ON journey_items (user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_reminders_user_schedule ON reminders (user_id, scheduled_for) WHERE status = 'scheduled';
CREATE INDEX idx_practitioner_requests_status ON practitioner_requests (status, submitted_at);
CREATE INDEX idx_sync_events_user_received ON sync_events (user_id, received_at DESC);
CREATE INDEX idx_audit_events_resource ON audit_events (resource_type, resource_id, occurred_at DESC);

CREATE TRIGGER trg_app_users_updated BEFORE UPDATE ON app_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_learner_profiles_updated BEFORE UPDATE ON learner_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_subjects_updated BEFORE UPDATE ON subjects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_interests_updated BEFORE UPDATE ON interests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_careers_updated BEFORE UPDATE ON careers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_qualifications_updated BEFORE UPDATE ON qualifications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_providers_updated BEFORE UPDATE ON providers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_journey_items_updated BEFORE UPDATE ON journey_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_reminders_updated BEFORE UPDATE ON reminders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
