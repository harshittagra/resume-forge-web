import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
} from "docx";
import { MasterResume } from "@/types/resume";

export async function generateDocxResume(resume: MasterResume): Promise<Blob> {
  const contact = resume.contact;
  const contactParts: string[] = [];
  if (contact.email) contactParts.push(contact.email);
  if (contact.phone) contactParts.push(contact.phone);
  if (contact.location) contactParts.push(contact.location);
  if (contact.linkedin) contactParts.push(contact.linkedin);
  if (contact.github) contactParts.push(contact.github);

  const sections: Paragraph[] = [];

  // Name
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: contact.name || "Resume",
          bold: true,
          size: 32, // 16pt
          font: "Calibri",
          color: "1E293B",
        }),
      ],
    })
  );

  // Contact line
  if (contactParts.length) {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: contactParts.join("   |   "),
            size: 19, // 9.5pt
            font: "Calibri",
            color: "64748B",
          }),
        ],
      })
    );
  }

  const addHeading = (title: string) => {
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 80 },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22, // 11pt
            font: "Calibri",
            color: "0F172A",
          }),
        ],
      })
    );
  };

  // Summary
  if (resume.summary) {
    addHeading("Professional Summary");
    sections.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: resume.summary,
            size: 20,
            font: "Calibri",
          }),
        ],
      })
    );
  }

  // Technical Skills
  const skillEntries = Object.entries(resume.skills || {});
  if (skillEntries.some(([, list]) => list && list.length > 0)) {
    addHeading("Technical Skills");
    skillEntries.forEach(([category, list]) => {
      if (list && list.length > 0) {
        sections.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}: `,
                bold: true,
                size: 20,
                font: "Calibri",
              }),
              new TextRun({
                text: list.join(", "),
                size: 20,
                font: "Calibri",
              }),
            ],
          })
        );
      }
    });
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    addHeading("Professional Experience");
    resume.experience.forEach((exp) => {
      sections.push(
        new Paragraph({
          spacing: { before: 140, after: 40 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              size: 21,
              font: "Calibri",
              color: "1E293B",
            }),
            new TextRun({
              text: `  —  ${exp.company}`,
              italics: true,
              size: 20,
              font: "Calibri",
            }),
            new TextRun({
              text: ` (${[exp.location, exp.dates].filter(Boolean).join(", ")})`,
              size: 19,
              font: "Calibri",
              color: "64748B",
            }),
          ],
        })
      );

      exp.bullets.forEach((b) => {
        sections.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: b,
                size: 19,
                font: "Calibri",
              }),
            ],
          })
        );
      });
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    addHeading("Projects");
    resume.projects.forEach((proj) => {
      sections.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 20,
              font: "Calibri",
            }),
            new TextRun({
              text: proj.technologies?.length ? `  |  ${proj.technologies.join(", ")}` : "",
              italics: true,
              size: 19,
              font: "Calibri",
              color: "64748B",
            }),
          ],
        })
      );

      proj.bullets.forEach((b) => {
        sections.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: b,
                size: 19,
                font: "Calibri",
              }),
            ],
          })
        );
      });
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    addHeading("Education");
    resume.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${edu.degree}, ${edu.institution}`,
              bold: true,
              size: 20,
              font: "Calibri",
            }),
            new TextRun({
              text: edu.dates ? ` (${edu.dates})` : "",
              size: 19,
              font: "Calibri",
              color: "64748B",
            }),
          ],
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080, // 0.75 in
              right: 1080,
              bottom: 1080,
              left: 1080,
            },
          },
        },
        children: sections,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
