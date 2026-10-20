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

/**
 * Normalizes any partial or legacy resume object into a complete, safe MasterResume.
 * Guarantees all skills arrays (including tools_and_platforms) and sub-sections exist.
 */
export function normalizeResume(raw: any): MasterResume {
  if (!raw || typeof raw !== "object") {
    return {
      contact: { name: "", email: "", phone: "", location: "", linkedin: "", github: "" },
      summary: "",
      skills: { languages: [], frameworks: [], tools_and_platforms: [], concepts: [] },
      experience: [],
      education: [],
      projects: [],
      certifications: [],
    };
  }

  const rawSkills = raw.skills && typeof raw.skills === "object" ? raw.skills : {};

  const cleanArray = (val: any): string[] => {
    if (Array.isArray(val)) {
      return val.filter((item) => typeof item === "string" && item.trim()).map((s) => s.trim());
    }
    if (typeof val === "string" && val.trim()) {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  // Collect tools and platforms from tools_and_platforms, tools, cloud, or platforms
  const toolsAndPlatforms: string[] = [
    ...cleanArray(rawSkills.tools_and_platforms),
    ...cleanArray(rawSkills.tools),
    ...cleanArray(rawSkills.cloud),
    ...cleanArray(rawSkills.platforms),
    ...cleanArray(rawSkills.devops),
  ];

  const skills: TechnicalSkills = {
    languages: cleanArray(rawSkills.languages),
    frameworks: cleanArray(rawSkills.frameworks || rawSkills.libraries),
    tools_and_platforms: Array.from(new Set(toolsAndPlatforms)),
    concepts: cleanArray(rawSkills.concepts || rawSkills.methodologies || rawSkills.core_competencies),
  };

  const contact: ContactInfo = {
    name: typeof raw.contact?.name === "string" ? raw.contact.name : "",
    email: typeof raw.contact?.email === "string" ? raw.contact.email : "",
    phone: typeof raw.contact?.phone === "string" ? raw.contact.phone : "",
    location: typeof raw.contact?.location === "string" ? raw.contact.location : "",
    linkedin: typeof raw.contact?.linkedin === "string" ? raw.contact.linkedin : "",
    github: typeof raw.contact?.github === "string" ? raw.contact.github : "",
  };

  const summary = typeof raw.summary === "string" ? raw.summary : "";

  const experience: ExperienceItem[] = Array.isArray(raw.experience)
    ? raw.experience.map((e: any, idx: number) => ({
        id: typeof e?.id === "string" ? e.id : `exp-${idx + 1}`,
        company: typeof e?.company === "string" ? e.company : (e?.employer || "Company"),
        role: typeof e?.role === "string" ? e.role : (e?.title || "Role"),
        location: typeof e?.location === "string" ? e.location : "",
        dates: typeof e?.dates === "string" ? e.dates : (e?.start_date ? `${e.start_date} - ${e.end_date || "Present"}` : ""),
        bullets: Array.isArray(e?.bullets)
          ? e.bullets.filter((b: any) => typeof b === "string")
          : (typeof e?.bullet === "string" ? [e.bullet] : []),
      }))
    : [];

  const education: EducationItem[] = Array.isArray(raw.education)
    ? raw.education.map((ed: any, idx: number) => ({
        id: typeof ed?.id === "string" ? ed.id : `edu-${idx + 1}`,
        institution: typeof ed?.institution === "string" ? ed.institution : (ed?.school || ed?.university || ""),
        degree: typeof ed?.degree === "string" ? ed.degree : "",
        location: typeof ed?.location === "string" ? ed.location : "",
        dates: typeof ed?.dates === "string" ? ed.dates : (ed?.graduation_year ? String(ed.graduation_year) : (ed?.year || "")),
        details: typeof ed?.details === "string" ? ed.details : "",
      }))
    : [];

  const projects: ProjectItem[] = Array.isArray(raw.projects)
    ? raw.projects.map((p: any, idx: number) => ({
        id: typeof p?.id === "string" ? p.id : `proj-${idx + 1}`,
        name: typeof p?.name === "string" ? p.name : (p?.title || `Project ${idx + 1}`),
        technologies: cleanArray(p?.technologies || p?.tech_stack),
        bullets: Array.isArray(p?.bullets)
          ? p.bullets.filter((b: any) => typeof b === "string")
          : (typeof p?.bullet === "string" ? [p.bullet] : []),
      }))
    : [];

  const certifications: string[] = cleanArray(raw.certifications);

  return {
    contact,
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
  };
}

