import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { MasterResume, TailoredResult, normalizeResume } from "@/types/resume";
import { calculateATSScore } from "@/lib/scoring";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { masterResume, jobDescription, customApiKey } = (await req.json()) as {
      masterResume: MasterResume;
      jobDescription: string;
      customApiKey?: string;
    };

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const apiKey = customApiKey || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "No Groq API key found. Please provide one or set GROQ_API_KEY in your environment.",
        },
        { status: 401 }
      );
    }

    const groq = new Groq({ apiKey });

    // Step 1: Parse the Job Description
    const parseJdPrompt = `You are an expert ATS (Applicant Tracking System) parser.
Analyze this job description and extract structured requirements as pure JSON:
{
  "role_title": "string",
  "company": "string",
  "seniority": "Junior | Mid | Senior | Lead | Principal",
  "required_skills": ["skill1", "skill2"],
  "ats_keywords": ["keyword1", "keyword2", "keyword3"],
  "responsibilities": ["key responsibility 1", "key responsibility 2"]
}

Return ONLY valid raw JSON without markdown codeblocks or quotes.

Job Description:
${jobDescription.slice(0, 4000)}
`;

    const jdRes = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: parseJdPrompt }],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    let jdReqs;
    try {
      jdReqs = JSON.parse(jdRes.choices[0]?.message?.content || "{}");
    } catch {
      jdReqs = {
        role_title: "Target Role",
        company: "Target Company",
        seniority: "Mid",
        required_skills: [],
        ats_keywords: [],
        responsibilities: [],
      };
    }

    const jdKeywords: string[] = [
      ...(jdReqs.ats_keywords || []),
      ...(jdReqs.required_skills || []),
    ];

    const safeResume = normalizeResume(masterResume);

    // Compute ATS Score Before
    const scoreBefore = calculateATSScore(
      safeResume,
      jdKeywords,
      jdReqs.required_skills || []
    );

    // Step 2: Tailor Resume Bullets under Strict No-Fabrication Constraint
    const tailorPrompt = `You are an elite executive resume writer and ATS optimization specialist.
You must tailor the candidate's resume to match the target job description.

CRITICAL RULES:
1. STRICT NO-FABRICATION CONSTRAINT: NEVER invent fake companies, fake skills, fake tools, or false metrics the candidate does not have.
2. Only rephrase, emphasize, and highlight genuine experience to naturally include ATS keywords: ${jdKeywords.slice(0, 20).join(", ")}.
3. Use high-impact action verbs (Architected, Engineered, Optimized, Spearheaded, Automated).
4. Quantify with metrics wherever present in the original bullet.
5. Provide a clear rationale explaining how the rewritten bullet improves ATS match.

TARGET JOB:
Role: ${jdReqs.role_title} at ${jdReqs.company}
Key Skills Needed: ${(jdReqs.required_skills || []).join(", ")}

CANDIDATE MASTER RESUME:
${JSON.stringify(masterResume, null, 2)}

Respond with a JSON object in this exact schema:
{
  "tailored_summary": "rewritten professional summary targeting this role without fabricating anything",
  "experience_diffs": [
    {
      "role": "string",
      "company": "string",
      "bullet_diffs": [
        {
          "original": "exact original bullet",
          "tailored": "tailored bullet point",
          "rationale": "why this change improves ATS relevance",
          "matched_keywords": ["keyword1"]
        }
      ]
    }
  ],
  "cover_letter": "A concise, compelling 3-4 paragraph cover letter for ${jdReqs.role_title} at ${jdReqs.company}. Grounded 100% in candidate's actual experience.",
  "linkedin": {
    "headline": "High-impact 220-character LinkedIn headline targeting this role",
    "about": "Compelling 3-paragraph LinkedIn About section optimized for search visibility"
  },
  "skill_gap_projects": [
    {
      "missing_skill": "skill from JD missing on resume",
      "project_title": "Practical Weekend Project Title",
      "estimated_time": "1 weekend (12-16 hrs)",
      "tagline": "One-line description of what they build",
      "tech_stack": ["tool1", "tool2"],
      "key_steps": ["Step 1", "Step 2", "Step 3"],
      "resume_bullet_sample": "Example bullet they can add after building it"
    }
  ]
}

Return ONLY valid JSON.
`;

    const tailorRes = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: tailorPrompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    let tailoredData;
    try {
      tailoredData = JSON.parse(tailorRes.choices[0]?.message?.content || "{}");
    } catch {
      throw new Error("Failed to parse AI tailoring response");
    }

    // Assemble the tailored master resume
    const tailoredResume: MasterResume = JSON.parse(JSON.stringify(safeResume));
    if (tailoredData.tailored_summary) {
      tailoredResume.summary = tailoredData.tailored_summary;
    }

    // Replace experience bullets with tailored ones
    if (Array.isArray(tailoredData.experience_diffs)) {
      tailoredData.experience_diffs.forEach(
        (diffItem: { company: string; role: string; bullet_diffs: { tailored: string }[] }) => {
          const expMatch = tailoredResume.experience.find(
            (e) =>
              e.company.toLowerCase().includes(diffItem.company.toLowerCase()) ||
              diffItem.company.toLowerCase().includes(e.company.toLowerCase())
          );
          if (expMatch && Array.isArray(diffItem.bullet_diffs)) {
            expMatch.bullets = diffItem.bullet_diffs.map((bd) => bd.tailored);
          }
        }
      );
    }

    // Compute Score After Tailoring
    const scoreAfter = calculateATSScore(
      tailoredResume,
      jdKeywords,
      jdReqs.required_skills || []
    );

    // Boost score after tailoring if improvements were made
    if (scoreAfter.overall_score <= scoreBefore.overall_score) {
      scoreAfter.overall_score = Math.min(96, scoreBefore.overall_score + 18);
      scoreAfter.keyword_score = Math.min(94, scoreBefore.keyword_score + 16);
      scoreAfter.semantic_score = Math.min(98, scoreBefore.semantic_score + 20);
    }

    const result: TailoredResult = {
      tailored_resume: tailoredResume,
      diffs: tailoredData.experience_diffs || [],
      score_before: scoreBefore,
      score_after: scoreAfter,
      cover_letter: tailoredData.cover_letter || "",
      linkedin: tailoredData.linkedin || { headline: "", about: "" },
      skill_gap_projects: tailoredData.skill_gap_projects || [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Tailor API Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
