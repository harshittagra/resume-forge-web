"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Code,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
} from "lucide-react";
import { MasterResume, ExperienceItem, ProjectItem, normalizeResume } from "@/types/resume";

interface ProfileViewProps {
  resume: MasterResume;
  onSave: (updated: MasterResume) => void;
  onLoadSample: () => void;
}

export default function ProfileView({
  resume,
  onSave,
  onLoadSample,
}: ProfileViewProps) {
  const [form, setForm] = useState<MasterResume>(() => normalizeResume(resume));
  const [savedAlert, setSavedAlert] = useState(false);
  const [newSkillCat, setNewSkillCat] = useState<keyof MasterResume["skills"]>("languages");
  const [newSkillText, setNewSkillText] = useState("");

  useEffect(() => {
    if (resume) {
      setForm(normalizeResume(resume));
    }
  }, [resume]);

  const handleSave = () => {
    const normalized = normalizeResume(form);
    onSave(normalized);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const addSkill = () => {
    if (!newSkillText.trim()) return;
    const currentList = form.skills?.[newSkillCat] || [];
    if (!currentList.includes(newSkillText.trim())) {
      setForm({
        ...form,
        skills: {
          ...(form.skills || { languages: [], frameworks: [], tools_and_platforms: [], concepts: [] }),
          [newSkillCat]: [...currentList, newSkillText.trim()],
        },
      });
    }
    setNewSkillText("");
  };

  const removeSkill = (cat: keyof MasterResume["skills"], skill: string) => {
    setForm({
      ...form,
      skills: {
        ...(form.skills || { languages: [], frameworks: [], tools_and_platforms: [], concepts: [] }),
        [cat]: (form.skills?.[cat] || []).filter((s) => s !== skill),
      },
    });
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: "Software Engineer",
      company: "Company Name",
      location: "Location",
      dates: "2023 - Present",
      bullets: ["Led technical design and implementation of key features."],
    };
    setForm({ ...form, experience: [newExp, ...form.experience] });
  };

  const updateExperience = (index: number, updated: ExperienceItem) => {
    const list = [...form.experience];
    list[index] = updated;
    setForm({ ...form, experience: list });
  };

  const removeExperience = (index: number) => {
    setForm({ ...form, experience: form.experience.filter((_, i) => i !== index) });
  };

  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "New Project",
      technologies: ["React", "TypeScript"],
      bullets: ["Developed scalable microservices and interactive dashboards."],
    };
    setForm({ ...form, projects: [newProj, ...form.projects] });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-400" />
            Master Resume Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your single source of truth. The AI will strictly draw from this data without inventing false claims.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onLoadSample}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            Load Sample
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Save className="w-3.5 h-3.5" />
            Save Profile
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4" />
          Master resume profile updated and saved to local storage!
        </div>
      )}

      {/* Contact Info */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
          <User className="w-4 h-4" /> Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={form.contact.name}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, name: e.target.value } })
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Jane Doe"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={form.contact.email}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, email: e.target.value } })
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={form.contact.phone}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={form.contact.location}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, location: e.target.value } })
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">LinkedIn URL</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={form.contact.linkedin}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, linkedin: e.target.value } })
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="linkedin.com/in/janedoe"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">GitHub URL</label>
            <div className="relative">
              <Code className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={form.contact.github}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, github: e.target.value } })
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="github.com/janedoe"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
          Professional Summary
        </h3>
        <textarea
          rows={3}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="w-full p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
          placeholder="Brief professional overview of your career and key strengths..."
        />
      </div>

      {/* Technical Skills */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Technical Skills
        </h3>

        {/* Skill Adder */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <select
            value={newSkillCat}
            onChange={(e) => setNewSkillCat(e.target.value as keyof MasterResume["skills"])}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="languages">Languages</option>
            <option value="frameworks">Frameworks</option>
            <option value="tools_and_platforms">Tools & Platforms</option>
            <option value="concepts">Concepts</option>
          </select>
          <input
            type="text"
            value={newSkillText}
            onChange={(e) => setNewSkillText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder="Add skill (e.g. Next.js, Docker)..."
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
          />
          <button
            onClick={addSkill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {/* Skill Badges by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {(["languages", "frameworks", "tools_and_platforms", "concepts"] as const).map((cat) => (
            <div key={cat} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {cat.replace(/_/g, " ")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {((form.skills && form.skills[cat]) || []).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(cat, skill)}
                      className="hover:text-rose-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Professional Experience
          </h3>
          <button
            onClick={addExperience}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" /> Add Role
          </button>
        </div>

        <div className="space-y-4">
          {form.experience.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, { ...exp, role: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                    placeholder="Role Title"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, { ...exp, company: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-indigo-300 focus:outline-none"
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    value={exp.dates}
                    onChange={(e) => updateExperience(idx, { ...exp, dates: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-400 focus:outline-none"
                    placeholder="Dates (e.g. 2022 - Present)"
                  />
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(idx, { ...exp, location: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-400 focus:outline-none"
                    placeholder="Location"
                  />
                </div>
                <button
                  onClick={() => removeExperience(idx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bullets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Bullet Points:</span>
                {exp.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <span className="text-indigo-400 text-xs">•</span>
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const newBullets = [...exp.bullets];
                        newBullets[bIdx] = e.target.value;
                        updateExperience(idx, { ...exp, bullets: newBullets });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                        updateExperience(idx, { ...exp, bullets: newBullets });
                      }}
                      className="text-slate-600 hover:text-rose-400 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateExperience(idx, {
                      ...exp,
                      bullets: [...exp.bullets, "Added new accomplishment with measurable impact."],
                    });
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium pt-1"
                >
                  + Add Bullet Point
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4" /> Featured Projects
          </h3>
          <button
            onClick={addProject}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>

        <div className="space-y-3">
          {form.projects.map((proj, pIdx) => (
            <div key={proj.id || pIdx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => {
                    const list = [...form.projects];
                    list[pIdx].name = e.target.value;
                    setForm({ ...form, projects: list });
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  placeholder="Project Name"
                />
                <button
                  onClick={() => setForm({ ...form, projects: form.projects.filter((_, i) => i !== pIdx) })}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={(proj.technologies || []).join(", ")}
                onChange={(e) => {
                  const list = [...form.projects];
                  list[pIdx].technologies = e.target.value.split(",").map((s) => s.trim());
                  setForm({ ...form, projects: list });
                }}
                className="w-full px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 focus:outline-none"
                placeholder="Tech stack (e.g. Next.js, Python, PostgreSQL)"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
