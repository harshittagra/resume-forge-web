import { MasterResume, ATSMatchScore, FormatCheck, SectionScore, KeywordHeatmapItem } from "@/types/resume";

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
 * Checks if a keyword exists in a set of tokens (exact or partial match).
 */
function keywordExists(keyword: string, tokens: Set<string>): boolean {
  const clean = keyword.toLowerCase().trim();
  if (tokens.has(clean)) return true;
  for (const token of tokens) {
    if (token.includes(clean) || clean.includes(token)) return true;
  }
  return false;
}

/**
 * Gets which resume section a keyword is found in.
 */
function findKeywordSection(keyword: string, resume: MasterResume): string | undefined {
  const kw = keyword.toLowerCase().trim();

  // Check skills first
  const allSkills = [
    ...resume.skills.languages,
    ...resume.skills.frameworks,
    ...resume.skills.tools_and_platforms,
    ...resume.skills.concepts,
  ].map((s) => s.toLowerCase());
  if (allSkills.some((s) => s.includes(kw) || kw.includes(s))) return "Skills";

  // Check summary
  if (resume.summary.toLowerCase().includes(kw)) return "Summary";

  // Check experience
  for (const exp of resume.experience) {
    const expText = [exp.role, exp.company, ...exp.bullets].join(" ").toLowerCase();
    if (expText.includes(kw)) return `Experience (${exp.company})`;
  }

  // Check projects
  for (const proj of resume.projects) {
    const projText = [proj.name, ...proj.technologies, ...proj.bullets].join(" ").toLowerCase();
    if (projText.includes(kw)) return `Projects (${proj.name})`;
  }

  // Check education
  for (const edu of resume.education) {
    const eduText = [edu.degree, edu.institution, edu.details || ""].join(" ").toLowerCase();
    if (eduText.includes(kw)) return "Education";
  }

  return undefined;
}

/**
 * Computes per-section ATS scores.
 */
function computeSectionScores(
  resume: MasterResume,
  jdKeywords: string[],
  requiredSkills: string[]
): SectionScore[] {
  const results: SectionScore[] = [];

  // 1. Experience Relevance
  const expText = resume.experience
    .flatMap((e) => [e.role, ...e.bullets])
    .join(" ")
    .toLowerCase();
  const expMatches = jdKeywords.filter((kw) => expText.includes(kw.toLowerCase())).length;
  const expScore = jdKeywords.length > 0 ? Math.round((expMatches / jdKeywords.length) * 100) : 0;
  results.push({
    score: Math.min(100, expScore),
    label: "Experience Relevance",
    detail: `${expMatches} of ${jdKeywords.length} JD keywords found in experience section`,
  });

  // 2. Skills Match
  const allSkills = [
    ...resume.skills.languages,
    ...resume.skills.frameworks,
    ...resume.skills.tools_and_platforms,
    ...resume.skills.concepts,
  ].map((s) => s.toLowerCase());
  const skillMatches = requiredSkills.filter((sk) =>
    allSkills.some((s) => s.includes(sk.toLowerCase()) || sk.toLowerCase().includes(s))
  ).length;
  const skillScore = requiredSkills.length > 0
    ? Math.round((skillMatches / requiredSkills.length) * 100)
    : 0;
  results.push({
    score: Math.min(100, skillScore),
    label: "Skills Match",
    detail: `${skillMatches} of ${requiredSkills.length} required skills listed`,
  });

  // 3. Keyword Density
  const fullText = JSON.stringify(resume).toLowerCase();
  const kwMatches = jdKeywords.filter((kw) => fullText.includes(kw.toLowerCase())).length;
  const kwScore = jdKeywords.length > 0 ? Math.round((kwMatches / jdKeywords.length) * 100) : 0;
  results.push({
    score: Math.min(100, kwScore),
    label: "Keyword Coverage",
    detail: `${kwMatches} of ${jdKeywords.length} ATS keywords appear anywhere in resume`,
  });

  // 4. Summary Alignment
  const summaryText = resume.summary.toLowerCase();
  const summaryMatches = jdKeywords.filter((kw) => summaryText.includes(kw.toLowerCase())).length;
  const summaryScore = jdKeywords.length > 0
    ? Math.round((summaryMatches / Math.min(jdKeywords.length, 8)) * 100)
    : 0;
  results.push({
    score: Math.min(100, summaryScore),
    label: "Summary Alignment",
    detail: `${summaryMatches} target keywords reinforced in professional summary`,
  });

  // 5. Projects Relevance
  const projText = resume.projects
    .flatMap((p) => [p.name, ...p.technologies, ...p.bullets])
    .join(" ")
    .toLowerCase();
  const projMatches = jdKeywords.filter((kw) => projText.includes(kw.toLowerCase())).length;
  const projScore = jdKeywords.length > 0 ? Math.round((projMatches / jdKeywords.length) * 100) : 0;
  results.push({
    score: Math.min(100, projScore),
    label: "Projects Relevance",
    detail: `${projMatches} keywords reinforced through project descriptions`,
  });

  return results;
}

/**
 * Generate keyword heatmap showing which JD keywords are found and where.
 */
export function generateKeywordHeatmap(
  resume: MasterResume,
  jdKeywords: string[],
  requiredSkills: string[],
  niceToHaveSkills?: string[]
): KeywordHeatmapItem[] {
  const niceSet = new Set((niceToHaveSkills || []).map((s) => s.toLowerCase()));
  const reqSet = new Set(requiredSkills.map((s) => s.toLowerCase()));

  return jdKeywords.map((kw) => {
    const found = findKeywordSection(kw, resume);
    const kwLow = kw.toLowerCase();
    let importance: "critical" | "important" | "nice-to-have" = "important";
    if (reqSet.has(kwLow)) importance = "critical";
    else if (niceSet.has(kwLow)) importance = "nice-to-have";

    return {
      keyword: kw,
      found: !!found,
      importance,
      where_found: found,
    };
  });
}

/**
 * Run format compliance checks on a resume.
 */
export function checkResumeFormat(resume: MasterResume): FormatCheck[] {
  const checks: FormatCheck[] = [];

  // 1. Contact info completeness
  const hasName = !!resume.contact.name?.trim();
  const hasEmail = !!resume.contact.email?.trim();
  const hasPhone = !!resume.contact.phone?.trim();
  const hasLocation = !!resume.contact.location?.trim();
  const contactScore = [hasName, hasEmail, hasPhone, hasLocation].filter(Boolean).length;
  checks.push({
    rule: "Complete Contact Information",
    passed: contactScore >= 3,
    detail: contactScore >= 3
      ? `${contactScore}/4 essential contact fields filled`
      : `Only ${contactScore}/4 contact fields filled — ATS needs name, email, phone`,
    severity: contactScore >= 3 ? "info" : "critical",
  });

  // 2. Professional summary present
  checks.push({
    rule: "Professional Summary Present",
    passed: resume.summary.trim().length >= 50,
    detail: resume.summary.trim().length >= 50
      ? "Summary is present and descriptive"
      : "Summary is too short or missing — ATS scanners look for a summary section",
    severity: resume.summary.trim().length >= 50 ? "info" : "warning",
  });

  // 3. Consistent date formatting
  const datePatterns = resume.experience.map((e) => e.dates);
  const hasConsistentDates = datePatterns.every(
    (d) => /\d{4}/.test(d) // At least contains a year
  );
  checks.push({
    rule: "Consistent Date Formatting",
    passed: hasConsistentDates,
    detail: hasConsistentDates
      ? "All experience entries include recognizable dates"
      : "Some dates may not be parsed by ATS — use 'Month Year - Month Year' format",
    severity: hasConsistentDates ? "info" : "warning",
  });

  // 4. Standard section headings present
  const hasSections = {
    experience: resume.experience.length > 0,
    skills: Object.values(resume.skills).some((arr) => arr.length > 0),
    education: resume.education.length > 0,
    projects: resume.projects.length > 0,
  };
  const sectionCount = Object.values(hasSections).filter(Boolean).length;
  checks.push({
    rule: "Standard Resume Sections",
    passed: sectionCount >= 3,
    detail: sectionCount >= 3
      ? `${sectionCount}/4 standard sections present (Experience, Skills, Education, Projects)`
      : `Only ${sectionCount}/4 sections — ATS expects Experience, Skills, Education at minimum`,
    severity: sectionCount >= 3 ? "info" : "critical",
  });

  // 5. No overly long bullets
  const allBullets = [
    ...resume.experience.flatMap((e) => e.bullets),
    ...resume.projects.flatMap((p) => p.bullets),
  ];
  const longBullets = allBullets.filter((b) => b.length > 200).length;
  checks.push({
    rule: "Concise Bullet Points",
    passed: longBullets === 0,
    detail: longBullets === 0
      ? "All bullets are under 200 characters — ideal for ATS readability"
      : `${longBullets} bullet(s) exceed 200 characters — ATS may truncate long text`,
    severity: longBullets === 0 ? "info" : "warning",
  });

  // 6. Action verbs in bullets
  const ACTION_VERBS = new Set([
    "led", "built", "designed", "developed", "implemented", "managed",
    "created", "architected", "engineered", "optimized", "automated",
    "deployed", "integrated", "reduced", "increased", "improved",
    "spearheaded", "orchestrated", "streamlined", "delivered", "launched",
    "configured", "maintained", "migrated", "scaled", "analyzed",
  ]);
  const bulletsWithVerbs = allBullets.filter((b) => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
    return ACTION_VERBS.has(firstWord);
  }).length;
  const verbRatio = allBullets.length > 0 ? bulletsWithVerbs / allBullets.length : 0;
  checks.push({
    rule: "Strong Action Verbs",
    passed: verbRatio >= 0.5,
    detail: verbRatio >= 0.5
      ? `${bulletsWithVerbs}/${allBullets.length} bullets start with strong action verbs`
      : `Only ${bulletsWithVerbs}/${allBullets.length} bullets use action verbs — start with Led, Built, Deployed, etc.`,
    severity: verbRatio >= 0.5 ? "info" : "warning",
  });

  // 7. Quantified achievements
  const quantifiedBullets = allBullets.filter((b) => /\d+[%xX]|\d+\s*(users|customers|requests|%|ms|seconds|minutes|hours|million|billion|thousand|reduction|increase|improvement)/i.test(b)).length;
  const quantRatio = allBullets.length > 0 ? quantifiedBullets / allBullets.length : 0;
  checks.push({
    rule: "Quantified Achievements",
    passed: quantRatio >= 0.3,
    detail: quantRatio >= 0.3
      ? `${quantifiedBullets}/${allBullets.length} bullets include measurable metrics`
      : `Only ${quantifiedBullets}/${allBullets.length} bullets have metrics — add numbers for impact`,
    severity: quantRatio >= 0.3 ? "info" : "warning",
  });

  // 8. Skills list not too sparse
  const totalSkills = Object.values(resume.skills).flat().length;
  checks.push({
    rule: "Adequate Skills List",
    passed: totalSkills >= 8,
    detail: totalSkills >= 8
      ? `${totalSkills} technical skills listed — good coverage for ATS keyword matching`
      : `Only ${totalSkills} skills listed — add more to improve keyword matching`,
    severity: totalSkills >= 8 ? "info" : "critical",
  });

  return checks;
}

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
      section_scores: [],
      format_checks: checkResumeFormat(resume),
    };
  }

  const resumeTokens = new Set(extractResumeKeywords(resume));

  const matched: string[] = [];
  const missing: string[] = [];

  // Check JD keywords
  jdKeywords.forEach((kw) => {
    const clean = kw.toLowerCase().trim();
    if (!clean) return;

    if (keywordExists(clean, resumeTokens)) {
      if (!matched.includes(kw)) matched.push(kw);
    } else {
      if (!missing.includes(kw)) missing.push(kw);
    }
  });

  // Check required skills for gaps
  const skillGaps: string[] = [];
  requiredSkills.forEach((skill) => {
    const clean = skill.toLowerCase().trim();
    if (!keywordExists(clean, resumeTokens) && !skillGaps.includes(skill)) {
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
    summary = "Strong ATS Compatibility — your resume strongly aligns with this job description.";
  } else if (overallScore >= 50) {
    summary = "Moderate Match — key technical terms are present, but tailoring will boost keyword density.";
  } else {
    summary = "Low ATS Score — critical keywords and required tools are missing. Run the Tailor pipeline to align your experience.";
  }

  // Compute per-section scores
  const sectionScores = computeSectionScores(resume, jdKeywords, requiredSkills);

  // Format checks
  const formatChecks = checkResumeFormat(resume);

  return {
    overall_score: overallScore,
    keyword_score: keywordScore,
    semantic_score: semanticScore,
    matched_keywords: matched.slice(0, 30),
    missing_keywords: missing.slice(0, 25),
    skill_gaps: skillGaps,
    summary,
    section_scores: sectionScores,
    format_checks: formatChecks,
  };
}
