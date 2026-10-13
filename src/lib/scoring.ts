import { MasterResume, ATSMatchScore } from "@/types/resume";

/**
 * Extracts all searchable text tokens and skills from a resume.
 */
export function extractResumeKeywords(resume: MasterResume): string[] {
  const set = new Set<string>();

  // Extract skills
  const skills = resume.skills;
  Object.values(skills).forEach((list) => {
    if (Array.isArray(list)) {
      list.forEach((s) => set.add(s.toLowerCase().trim()));
    }
  });

  // Extract from summary
  if (resume.summary) {
    extractWords(resume.summary).forEach((w) => set.add(w));
  }

  // Extract from experience bullets & roles
  resume.experience.forEach((exp) => {
    extractWords(exp.role).forEach((w) => set.add(w));
    extractWords(exp.company).forEach((w) => set.add(w));
    exp.bullets.forEach((b) => {
      extractWords(b).forEach((w) => set.add(w));
    });
  });

  // Extract from projects
  resume.projects.forEach((proj) => {
    extractWords(proj.name).forEach((w) => set.add(w));
    proj.technologies.forEach((t) => set.add(t.toLowerCase().trim()));
    proj.bullets.forEach((b) => {
      extractWords(b).forEach((w) => set.add(w));
    });
  });

  return Array.from(set).filter((k) => k.length > 1);
}

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#+.\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "have", "been", "will",
  "were", "their", "into", "also", "some", "such", "than", "over", "what", "when",
  "which", "where", "while", "about", "above", "across", "after", "again", "against",
  "using", "used", "role", "work", "team", "year", "years", "well", "both", "each",
]);

/**
 * Computes dual-axis ATS match score between a resume and parsed job keywords.
 */
export function calculateATSScore(
  resume: MasterResume,
  jdKeywords: string[],
  requiredSkills: string[]
): ATSMatchScore {
  if (!jdKeywords.length) {
    return {
      overall_score: 0,
      keyword_score: 0,
      semantic_score: 0,
      matched_keywords: [],
      missing_keywords: [],
      skill_gaps: [],
      summary: "Paste a Job Description to compute your ATS Match Score.",
    };
  }

  const resumeTokens = new Set(extractResumeKeywords(resume));

  const matched: string[] = [];
  const missing: string[] = [];

  // Check JD keywords
  jdKeywords.forEach((kw) => {
    const clean = kw.toLowerCase().trim();
    if (!clean) return;

    let found = false;
    if (resumeTokens.has(clean)) {
      found = true;
    } else {
      // Check partial or compound match (e.g. "next.js" vs "nextjs", "ci/cd")
      for (const token of resumeTokens) {
        if (token.includes(clean) || clean.includes(token)) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      if (!matched.includes(kw)) matched.push(kw);
    } else {
      if (!missing.includes(kw)) missing.push(kw);
    }
  });

  // Check required skills for gaps
  const skillGaps: string[] = [];
  requiredSkills.forEach((skill) => {
    const clean = skill.toLowerCase().trim();
    let found = false;
    for (const token of resumeTokens) {
      if (token.includes(clean) || clean.includes(token)) {
        found = true;
        break;
      }
    }
    if (!found && !skillGaps.includes(skill)) {
      skillGaps.push(skill);
    }
  });

  const totalKeywords = matched.length + missing.length;
  const keywordRatio = totalKeywords > 0 ? matched.length / totalKeywords : 0;
  const keywordScore = Math.round(keywordRatio * 100);

  // Semantic similarity proxy based on skill density and breadth of matches
  const skillMatchRatio =
    requiredSkills.length > 0
      ? (requiredSkills.length - skillGaps.length) / requiredSkills.length
      : keywordRatio;
  const semanticScore = Math.round(
    keywordScore * 0.4 + skillMatchRatio * 60
  );

  const overallScore = Math.min(
    100,
    Math.max(10, Math.round(keywordScore * 0.45 + semanticScore * 0.55))
  );

  let summary = "";
  if (overallScore >= 75) {
    summary = "🔥 High ATS Compatibility! Your resume strongly aligns with this job description.";
  } else if (overallScore >= 50) {
    summary = "⚡ Moderate Match. Key technical terms are present, but tailoring will boost keyword density.";
  } else {
    summary = "⚠️ Low ATS Score. Critical keywords and required tools are missing. Run the Tailor pipeline to align your experience.";
  }

  return {
    overall_score: overallScore,
    keyword_score: keywordScore,
    semantic_score: semanticScore,
    matched_keywords: matched.slice(0, 30),
    missing_keywords: missing.slice(0, 25),
    skill_gaps: skillGaps,
    summary,
  };
}
