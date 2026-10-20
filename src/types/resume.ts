export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  technologies: string[];
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  dates: string;
  details?: string;
}

export interface TechnicalSkills {
  languages: string[];
  frameworks: string[];
  tools_and_platforms: string[];
  concepts: string[];
}

export interface MasterResume {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  skills: TechnicalSkills;
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: string[];
}

export interface JobDescriptionRequirements {
  role_title: string;
  company: string;
  seniority: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  ats_keywords: string[];
  responsibilities: string[];
}

// Per-section ATS breakdown
export interface SectionScore {
  score: number;
  label: string;
  detail: string;
}

export interface ATSMatchScore {
  overall_score: number;
  keyword_score: number;
  semantic_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  skill_gaps: string[];
  summary: string;
  // Enhanced per-section breakdown
  section_scores?: SectionScore[];
  // Format compliance
  format_checks?: FormatCheck[];
}

// Format compliance checker
export interface FormatCheck {
  rule: string;
  passed: boolean;
  detail: string;
  severity: "critical" | "warning" | "info";
}

// Scan result — quick ATS analysis without tailoring
export interface ScanResult {
  job_title: string;
  company: string;
  seniority: string;
  score: ATSMatchScore;
  jd_requirements: JobDescriptionRequirements;
  keyword_heatmap: KeywordHeatmapItem[];
  readiness_verdict: "strong" | "moderate" | "weak";
  recommendation: string;
  timestamp: string;
}

export interface KeywordHeatmapItem {
  keyword: string;
  found: boolean;
  importance: "critical" | "important" | "nice-to-have";
  where_found?: string; // which section it was found in
}

// Interview preparation
export interface InterviewQuestion {
  category: "technical" | "behavioral" | "situational" | "system-design";
  question: string;
  why_likely: string;
  star_framework?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  tips: string[];
}

export interface InterviewPrepResult {
  role_title: string;
  company: string;
  questions: InterviewQuestion[];
  timestamp: string;
}

export interface BulletDiff {
  original: string;
  tailored: string;
  rationale: string;
  matched_keywords: string[];
}

export interface SkillGapProject {
  missing_skill: string;
  project_title: string;
  estimated_time: string;
  tagline: string;
  tech_stack: string[];
  key_steps: string[];
  resume_bullet_sample: string;
}

export interface TailoredResult {
  tailored_resume: MasterResume;
  diffs: {
    role: string;
    company: string;
    bullet_diffs: BulletDiff[];
  }[];
  score_before: ATSMatchScore;
  score_after: ATSMatchScore;
  cover_letter: string;
  linkedin: {
    headline: string;
    about: string;
  };
  skill_gap_projects: SkillGapProject[];
  timestamp: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  role_title: string;
  company: string;
  score_before: number;
  score_after: number;
  gaps_count: number;
  changes_count: number;
  result: TailoredResult;
}
