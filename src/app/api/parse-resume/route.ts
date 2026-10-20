import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import mammoth from "mammoth";
import Groq from "groq-sdk";
import { MasterResume, normalizeResume } from "@/types/resume";

export const maxDuration = 45;

function parseResumeHeuristics(rawText: string, filename: string): MasterResume {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const name = lines[0] || filename.replace(/\.[^/.]+$/, "");
  
  // Extract emails and phones
  const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = rawText.match(/linkedin\.com\/in\/[\w-]+/);
  const githubMatch = rawText.match(/github\.com\/[\w-]+/);

  return normalizeResume({
    contact: {
      name,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      location: "",
      linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : "",
      github: githubMatch ? `https://${githubMatch[0]}` : "",
    },
    summary: lines.slice(1, 4).join(" "),
    skills: {
      languages: [],
      frameworks: [],
      tools_and_platforms: [],
      concepts: [],
    },
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const customApiKey = formData.get("customApiKey") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = file.name || "resume.pdf";
    const extension = filename.split(".").pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (extension === "pdf") {
      try {
        const { text } = await extractText(new Uint8Array(arrayBuffer));
        extractedText = Array.isArray(text) ? text.join("\n") : String(text || "");
      } catch (err: any) {
        console.error("PDF parse error:", err);
        return NextResponse.json(
          { error: "Failed to parse PDF: " + (err?.message || "Unknown error") },
          { status: 422 }
        );
      }
    } else if (extension === "docx") {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || "";
      } catch (err: any) {
        console.error("DOCX parse error:", err);
        return NextResponse.json(
          { error: "Failed to parse DOCX: " + (err?.message || "Unknown error") },
          { status: 422 }
        );
      }
    } else if (extension === "txt" || extension === "md") {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract readable text from the file. Please check if the file is scanned or empty." },
        { status: 422 }
      );
    }

    // Try AI structured extraction with Groq
    const apiKey = customApiKey || process.env.GROQ_API_KEY;
    let parsedResume: MasterResume;

    if (apiKey) {
      try {
        const groq = new Groq({ apiKey });
        const parsePrompt = `You are an expert resume parser.
Extract the candidate's resume information into this EXACT JSON structure:
{
  "contact": {
    "name": "Full Name",
    "email": "email address",
    "phone": "phone number",
    "location": "City, State or Country",
    "linkedin": "linkedin URL",
    "github": "github URL"
  },
  "summary": "Professional summary paragraph",
  "skills": {
    "languages": ["Python", "TypeScript", etc],
    "frameworks": ["React", "Next.js", etc],
    "tools_and_platforms": ["Docker", "Git", "AWS", "PostgreSQL", etc],
    "concepts": ["Microservices", "REST APIs", etc]
  },
  "experience": [
    {
      "id": "exp-1",
      "company": "Company Name",
      "role": "Job Title",
      "location": "Location",
      "dates": "MM/YYYY - MM/YYYY or Present",
      "bullets": ["Bullet 1", "Bullet 2"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "University Name",
      "degree": "Degree and Major",
      "dates": "YYYY or MM/YYYY - MM/YYYY"
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "technologies": ["Tech 1", "Tech 2"],
      "bullets": ["Bullet 1"]
    }
  ]
}

Return ONLY valid JSON without explanation or markdown quotes.

Resume Text:
${extractedText.slice(0, 7000)}
`;

        const response = await groq.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages: [{ role: "user", content: parsePrompt }],
          temperature: 0.1,
          response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content || "{}";
        const rawJson = JSON.parse(content);
        parsedResume = normalizeResume(rawJson);
      } catch (aiErr) {
        console.warn("AI parsing fallback to heuristic:", aiErr);
        parsedResume = parseResumeHeuristics(extractedText, filename);
      }
    } else {
      parsedResume = parseResumeHeuristics(extractedText, filename);
    }

    return NextResponse.json({
      success: true,
      filename,
      extractedTextLength: extractedText.length,
      parsedResume,
      rawText: extractedText,
    });
  } catch (error: any) {
    console.error("Resume parse API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during resume parsing" },
      { status: 500 }
    );
  }
}
