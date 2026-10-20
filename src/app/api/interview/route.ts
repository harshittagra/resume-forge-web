import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { MasterResume, InterviewPrepResult } from "@/types/resume";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { masterResume, jobDescription, roleTitle, company, customApiKey } = (await req.json()) as {
      masterResume: MasterResume;
      jobDescription: string;
      roleTitle?: string;
      company?: string;
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
        { error: "No Groq API key found." },
        { status: 401 }
      );
    }

    const groq = new Groq({ apiKey });

    const prompt = `You are an expert interview coach. Based on the job description and candidate's resume below, generate 8-10 likely interview questions the candidate would face.

For each question, provide:
1. A category: "technical", "behavioral", "situational", or "system-design"
2. The question itself
3. Why this question is likely for this role (why_likely)
4. For behavioral questions, provide a STAR framework answer outline using the CANDIDATE'S ACTUAL experience from their resume. Do NOT fabricate experience.
5. 2-3 actionable tips for answering well

CANDIDATE RESUME:
${JSON.stringify(masterResume, null, 2).slice(0, 3000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

Return a JSON object:
{
  "questions": [
    {
      "category": "technical | behavioral | situational | system-design",
      "question": "...",
      "why_likely": "...",
      "star_framework": {
        "situation": "Based on candidate's actual experience...",
        "task": "...",
        "action": "...",
        "result": "..."
      },
      "tips": ["tip1", "tip2"]
    }
  ]
}

Return ONLY valid JSON.`;

    const res = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    let data;
    try {
      data = JSON.parse(res.choices[0]?.message?.content || "{}");
    } catch {
      throw new Error("Failed to parse interview prep response");
    }

    const result: InterviewPrepResult = {
      role_title: roleTitle || "Target Role",
      company: company || "Target Company",
      questions: data.questions || [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Interview API Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
