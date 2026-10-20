import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { MasterResume, ScanResult } from "@/types/resume";
import { calculateATSScore, generateKeywordHeatmap } from "@/lib/scoring";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { masterResume, jobDescription, customApiKey } = (await req.json()) as {
      masterResume: MasterResume;
      jobDescription: string;
      customApiKey?: string;
    };

    if (!jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const apiKey = customApiKey || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "No Groq API key found. Please provide one or set GROQ_API_KEY." },
        { status: 401 }
      );
    }

    const groq = new Groq({ apiKey });

    // Parse JD with the cheaper model
    const parseJdPrompt = `You are an expert ATS (Applicant Tracking System) parser.
Analyze this job description and extract structured requirements as pure JSON:
{
  "role_title": "string",
  "company": "string",
  "seniority": "Junior | Mid | Senior | Lead | Principal",
  "required_skills": ["skill1", "skill2"],
  "nice_to_have_skills": ["skill1", "skill2"],
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
        nice_to_have_skills: [],
        ats_keywords: [],
        responsibilities: [],
      };
    }

    const jdKeywords: string[] = [
      ...(jdReqs.ats_keywords || []),
      ...(jdReqs.required_skills || []),
    ];

    // Compute ATS Score
    const score = calculateATSScore(
      masterResume,
      jdKeywords,
      jdReqs.required_skills || []
    );

    // Generate keyword heatmap
    const keywordHeatmap = generateKeywordHeatmap(
      masterResume,
      jdKeywords,
      jdReqs.required_skills || [],
      jdReqs.nice_to_have_skills || []
    );

    // Determine readiness verdict
    let readiness: "strong" | "moderate" | "weak" = "weak";
    let recommendation = "";
    if (score.overall_score >= 75) {
      readiness = "strong";
      recommendation = "Your resume is already well-aligned with this role. Tailoring will polish keyword density and phrasing for even better ATS performance.";
    } else if (score.overall_score >= 50) {
      readiness = "moderate";
      recommendation = "Good foundation, but several key skills and keywords are missing. Tailoring is recommended to close the gap.";
    } else {
      readiness = "weak";
      recommendation = "Significant gaps exist between your resume and this job description. Consider building missing skills and tailoring your resume substantially.";
    }

    const result: ScanResult = {
      job_title: jdReqs.role_title || "Target Role",
      company: jdReqs.company || "Target Company",
      seniority: jdReqs.seniority || "Mid",
      score,
      jd_requirements: jdReqs,
      keyword_heatmap: keywordHeatmap,
      readiness_verdict: readiness,
      recommendation,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Scan API Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
