import type { Assessment, Interest, Subject } from '@/types/api';

// Offline fallback only. These codes mirror the clearly labelled database demo seed.
export const demoSubjects: Subject[] = [
  ['mathematics', 'Mathematics'],
  ['mathematical-literacy', 'Mathematical Literacy'],
  ['english', 'English'],
  ['information-technology', 'Information Technology'],
  ['physical-sciences', 'Physical Sciences'],
  ['accounting', 'Accounting'],
  ['geography', 'Geography'],
  ['engineering-graphics-design', 'Engineering Graphics and Design'],
  ['electrical-technology', 'Electrical Technology'],
].map(([code, name]) => ({ id: `demo-${code}`, code, name }));

export const demoInterests: Interest[] = [
  ['technology', 'Technology'],
  ['problem-solving', 'Problem solving'],
  ['data', 'Data'],
  ['research', 'Research'],
  ['building', 'Building and creating'],
  ['helping-people', 'Helping people'],
  ['communication', 'Communication'],
  ['hands-on', 'Hands-on work'],
].map(([code, name]) => ({ id: `demo-${code}`, code, name }));

export const demoAssessment: Assessment = {
  id: '70000000-0000-4000-8000-000000000001',
  code: 'demo-interest-explorer',
  version: '0.1',
  title: 'Demonstration Interest Explorer',
  assessment_type: 'interest_explorer',
  instructions: 'Prototype flow only; not a validated psychometric assessment.',
  source: {
    version_id: '10000000-0000-4000-8000-000000000001',
    version_label: 'demo-2026-09-17',
    source_name: 'Khetha AI prototype catalogue',
    source_uri: null,
    is_official: false,
  },
  questions: [
    {
      id: '71000000-0000-4000-8000-000000000001',
      sequence_number: 1,
      prompt: 'Which activity sounds most enjoyable?',
      response_type: 'single_choice',
      required: true,
      options: [
        ['72000000-0000-4000-8000-000000000001', 'Building an app or digital tool', 'build-digital', ['technology', 'building']],
        ['72000000-0000-4000-8000-000000000002', 'Explaining an idea to other people', 'explain-ideas', ['communication', 'helping-people']],
        ['72000000-0000-4000-8000-000000000003', 'Finding patterns in information', 'find-patterns', ['data', 'research']],
      ].map(([id, label, value, interestCodes]) => ({
        id: id as string,
        label: label as string,
        value: value as string,
        scoring_metadata: { interest_codes: interestCodes as string[] },
      })),
    },
    {
      id: '71000000-0000-4000-8000-000000000002',
      sequence_number: 2,
      prompt: 'Which kind of problem would you prefer to solve?',
      response_type: 'single_choice',
      required: true,
      options: [
        ['72000000-0000-4000-8000-000000000004', 'A technical system that is not working', 'technical-system', ['technology', 'problem-solving']],
        ['72000000-0000-4000-8000-000000000005', 'A community that needs support', 'community-support', ['helping-people', 'communication']],
        ['72000000-0000-4000-8000-000000000006', 'A structure or physical system', 'physical-system', ['building', 'hands-on']],
      ].map(([id, label, value, interestCodes]) => ({
        id: id as string,
        label: label as string,
        value: value as string,
        scoring_metadata: { interest_codes: interestCodes as string[] },
      })),
    },
    {
      id: '71000000-0000-4000-8000-000000000003',
      sequence_number: 3,
      prompt: 'Where would you prefer to spend most of your working time?',
      response_type: 'single_choice',
      required: true,
      options: [
        ['72000000-0000-4000-8000-000000000007', 'At a computer or with digital systems', 'digital-work', ['technology', 'data']],
        ['72000000-0000-4000-8000-000000000008', 'With people in a learning or service setting', 'people-work', ['helping-people', 'communication']],
        ['72000000-0000-4000-8000-000000000009', 'On-site, in a workshop or outdoors', 'site-work', ['hands-on', 'building']],
      ].map(([id, label, value, interestCodes]) => ({
        id: id as string,
        label: label as string,
        value: value as string,
        scoring_metadata: { interest_codes: interestCodes as string[] },
      })),
    },
  ],
};
