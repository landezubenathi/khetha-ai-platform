export type ContentSource = {
  version_id: string;
  version_label: string;
  source_name: string;
  source_uri: string | null;
  is_official: boolean;
};

export type Subject = { id: string; code: string; name: string; source?: ContentSource | null };
export type Interest = { id: string; code: string; name: string; source?: ContentSource | null };

export type SubjectRequirement = {
  code: string;
  name: string;
  requirement_type: 'required' | 'recommended';
  minimum_achievement_level: number | null;
};

export type Qualification = {
  id: string;
  code: string;
  title: string;
  nqf_level: number | null;
  description: string | null;
  typical_duration: string | null;
  admission_notes: string | null;
  source: ContentSource;
};

export type Career = {
  id: string;
  code: string;
  name: string;
  summary: string;
  work_environment: string | null;
  subject_requirements: SubjectRequirement[];
  interest_codes: string[];
  qualifications: Qualification[];
  source: ContentSource;
};

export type RecommendationResult = {
  career: Career;
  score: number;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
  missing_requirements: string[];
  practitioner_review_recommended: boolean;
};

export type RecommendationResponse = {
  results: RecommendationResult[];
  algorithm_version: string;
  guidance_notice: string;
  content_source_mode: 'demo' | 'approved';
};

export type JourneyItem = {
  id: string;
  item_type: 'career' | 'qualification' | 'provider' | 'task';
  reference_id: string | null;
  title: string;
  status: 'saved' | 'exploring' | 'planned' | 'completed' | 'removed';
  notes: string | null;
  target_date: string | null;
  source_snapshot: Record<string, unknown>;
  client_updated_at: string;
  created_at?: string;
  updated_at?: string;
};

export type AssessmentOption = {
  id: string;
  label: string;
  value: string;
  scoring_metadata: { interest_codes?: string[] };
};

export type AssessmentQuestion = {
  id: string;
  sequence_number: number;
  prompt: string;
  response_type: string;
  required: boolean;
  options: AssessmentOption[];
};

export type Assessment = {
  id: string;
  code: string;
  version: string;
  title: string;
  assessment_type: string;
  instructions: string | null;
  questions: AssessmentQuestion[];
  source: ContentSource;
};

export type AssessmentAttemptResult = {
  id: string;
  status: string;
  completed_at: string;
  result_summary: {
    interest_codes?: string[];
    interest_scores?: Record<string, number>;
    scoring_method?: string;
    notice?: string;
  };
};
