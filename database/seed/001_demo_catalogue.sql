BEGIN;

INSERT INTO content_versions (
    id, version_label, source_name, source_uri, is_official, published_at, notes
) VALUES (
    '10000000-0000-4000-8000-000000000001',
    'demo-2026-09-17',
    'Khetha AI prototype catalogue',
    NULL,
    FALSE,
    NOW(),
    'Demonstration records only. Replace with authorised DHET/NCAP content.'
) ON CONFLICT (version_label) DO NOTHING;

INSERT INTO app_users (id, external_identity_id, role, preferred_language)
VALUES ('00000000-0000-4000-8000-000000000001', 'demo-learner-001', 'learner', 'en-ZA')
ON CONFLICT (id) DO NOTHING;

INSERT INTO learner_profiles (user_id, age_band, grade_level, province, connectivity_mode, profile_completeness)
VALUES ('00000000-0000-4000-8000-000000000001', '16_17', 'Grade 11', 'Eastern Cape', 'low_data', 40)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO subjects (id, code, name, content_version_id) VALUES
('20000000-0000-4000-8000-000000000001', 'mathematics', 'Mathematics', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000002', 'mathematical-literacy', 'Mathematical Literacy', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000003', 'english', 'English', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000004', 'information-technology', 'Information Technology', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000005', 'physical-sciences', 'Physical Sciences', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000006', 'accounting', 'Accounting', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000007', 'geography', 'Geography', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000008', 'engineering-graphics-design', 'Engineering Graphics and Design', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000009', 'electrical-technology', 'Electrical Technology', '10000000-0000-4000-8000-000000000001'),
('20000000-0000-4000-8000-000000000010', 'life-orientation', 'Life Orientation', '10000000-0000-4000-8000-000000000001')
ON CONFLICT (code) DO NOTHING;

INSERT INTO interests (id, code, name, content_version_id) VALUES
('30000000-0000-4000-8000-000000000001', 'technology', 'Technology', '10000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000002', 'problem-solving', 'Problem solving', '10000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000003', 'data', 'Data', '10000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000004', 'research', 'Research', '10000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000005', 'building', 'Building and creating', '10000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000006', 'helping-people', 'Helping people', '10000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000007', 'communication', 'Communication', '10000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000008', 'hands-on', 'Hands-on work', '10000000-0000-4000-8000-000000000001')
ON CONFLICT (code) DO NOTHING;

INSERT INTO careers (id, code, name, summary, source_reference, content_version_id) VALUES
('40000000-0000-4000-8000-000000000001', 'software-developer', 'Software Developer', 'Designs, builds, tests and maintains software systems and digital services.', 'demo-career-001', '10000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000002', 'data-analyst', 'Data Analyst', 'Uses data, statistics and visualisation to help organisations understand performance and make decisions.', 'demo-career-002', '10000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000003', 'civil-engineer', 'Civil Engineer', 'Plans and supports infrastructure such as roads, water systems, structures and public works.', 'demo-career-003', '10000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000004', 'teacher', 'Teacher', 'Supports learning, development and subject knowledge in schools and other education settings.', 'demo-career-004', '10000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000005', 'electrician', 'Electrician', 'Installs, tests and maintains electrical systems in homes, businesses and industry.', 'demo-career-005', '10000000-0000-4000-8000-000000000001')
ON CONFLICT (code) DO NOTHING;

INSERT INTO career_subject_requirements (career_id, subject_id, requirement_type) VALUES
('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'required'),
('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000004', 'recommended'),
('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'required'),
('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000006', 'recommended'),
('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'required'),
('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000005', 'required'),
('40000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000003', 'required'),
('40000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000001', 'required'),
('40000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000009', 'recommended')
ON CONFLICT DO NOTHING;

INSERT INTO career_interests (career_id, interest_id, weight) VALUES
('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 1.0),
('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', 1.0),
('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000003', 1.0),
('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000004', 0.8),
('40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000005', 0.9),
('40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000002', 0.9),
('40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000006', 1.0),
('40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000007', 1.0),
('40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000008', 1.0),
('40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000002', 0.8)
ON CONFLICT DO NOTHING;

INSERT INTO qualifications (
    id, code, title, nqf_level, description, typical_duration, admission_notes, source_reference, content_version_id
) VALUES
('50000000-0000-4000-8000-000000000001', 'demo-dip-software', 'Demonstration Diploma in Software Development', 6, 'Example pathway for prototype testing only.', '3 years', 'Verify all entry requirements through authorised sources.', 'demo-qualification-001', '10000000-0000-4000-8000-000000000001'),
('50000000-0000-4000-8000-000000000002', 'demo-dip-electrical', 'Demonstration Electrical Engineering Pathway', 6, 'Example pathway for prototype testing only.', 'Varies', 'Verify trade and institutional requirements through authorised sources.', 'demo-qualification-002', '10000000-0000-4000-8000-000000000001')
ON CONFLICT (code) DO NOTHING;

INSERT INTO career_qualifications (career_id, qualification_id, relationship_type) VALUES
('40000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'possible_pathway'),
('40000000-0000-4000-8000-000000000005', '50000000-0000-4000-8000-000000000002', 'possible_pathway')
ON CONFLICT DO NOTHING;

INSERT INTO providers (
    id, code, name, provider_type, province, source_reference, content_version_id, contact_details
) VALUES (
    '60000000-0000-4000-8000-000000000001',
    'demo-provider-ec',
    'Demonstration Eastern Cape Learning Provider',
    'prototype_only',
    'Eastern Cape',
    'demo-provider-001',
    '10000000-0000-4000-8000-000000000001',
    '{"notice":"Not a real provider. Replace with authorised NCAP data."}'::jsonb
) ON CONFLICT (code) DO NOTHING;

INSERT INTO provider_qualifications (provider_id, qualification_id, delivery_modes) VALUES
('60000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '["contact"]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO assessment_definitions (
    id, code, version, title, assessment_type, instructions, content_version_id
) VALUES (
    '70000000-0000-4000-8000-000000000001',
    'demo-interest-explorer',
    '0.1',
    'Demonstration Interest Explorer',
    'interest_explorer',
    'Prototype flow only; not a validated psychometric assessment.',
    '10000000-0000-4000-8000-000000000001'
) ON CONFLICT (code, version) DO NOTHING;

INSERT INTO assessment_questions (
    id, assessment_id, sequence_number, prompt, response_type, required
) VALUES
('71000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000001', 1, 'Which activity sounds most enjoyable?', 'single_choice', TRUE),
('71000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000001', 2, 'Which kind of problem would you prefer to solve?', 'single_choice', TRUE),
('71000000-0000-4000-8000-000000000003', '70000000-0000-4000-8000-000000000001', 3, 'Where would you prefer to spend most of your working time?', 'single_choice', TRUE)
ON CONFLICT (assessment_id, sequence_number) DO NOTHING;

INSERT INTO assessment_options (
    id, question_id, sequence_number, label, value, scoring_metadata
) VALUES
('72000000-0000-4000-8000-000000000001', '71000000-0000-4000-8000-000000000001', 1, 'Building an app or digital tool', 'build-digital', '{"interest_codes":["technology","building"]}'::jsonb),
('72000000-0000-4000-8000-000000000002', '71000000-0000-4000-8000-000000000001', 2, 'Explaining an idea to other people', 'explain-ideas', '{"interest_codes":["communication","helping-people"]}'::jsonb),
('72000000-0000-4000-8000-000000000003', '71000000-0000-4000-8000-000000000001', 3, 'Finding patterns in information', 'find-patterns', '{"interest_codes":["data","research"]}'::jsonb),
('72000000-0000-4000-8000-000000000004', '71000000-0000-4000-8000-000000000002', 1, 'A technical system that is not working', 'technical-system', '{"interest_codes":["technology","problem-solving"]}'::jsonb),
('72000000-0000-4000-8000-000000000005', '71000000-0000-4000-8000-000000000002', 2, 'A community that needs support', 'community-support', '{"interest_codes":["helping-people","communication"]}'::jsonb),
('72000000-0000-4000-8000-000000000006', '71000000-0000-4000-8000-000000000002', 3, 'A structure or physical system', 'physical-system', '{"interest_codes":["building","hands-on"]}'::jsonb),
('72000000-0000-4000-8000-000000000007', '71000000-0000-4000-8000-000000000003', 1, 'At a computer or with digital systems', 'digital-work', '{"interest_codes":["technology","data"]}'::jsonb),
('72000000-0000-4000-8000-000000000008', '71000000-0000-4000-8000-000000000003', 2, 'With people in a learning or service setting', 'people-work', '{"interest_codes":["helping-people","communication"]}'::jsonb),
('72000000-0000-4000-8000-000000000009', '71000000-0000-4000-8000-000000000003', 3, 'On-site, in a workshop or outdoors', 'site-work', '{"interest_codes":["hands-on","building"]}'::jsonb)
ON CONFLICT (question_id, sequence_number) DO NOTHING;

COMMIT;
