import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import PortfolioRenderer from "../templates/PortfolioRenderer.jsx";

const STEPS = ["Identity", "Story", "Skills", "Projects", "Theme", "Finish"];
const POPULAR_SKILLS = ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL", "Next.js", "GraphQL"];

export default function Onboarding() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);

  // Form State
  const [profile, setProfile] = useState({
    displayName: user?.name || "",
    headline: "",
    location: "",
    bio: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState({ name: "", category: "Frontend" });
  const [projects, setProjects] = useState([{
    title: "", description: "", techStack: ""
  }]);
  const [templateId, setTemplateId] = useState(1);

  useEffect(() => {
    api.get("/templates").then(r => {
      setAllTemplates(r.data.data);
      if (r.data.data.length > 0) setTemplateId(r.data.data[0].id);
    });
  }, []);

  if (user?.profile && user.profile.status !== 'DRAFT') {
    return <Navigate to="/dashboard" replace />;
  }

  const addSkill = (name) => {
    if (!skills.find(s => s.name === name)) {
      setSkills([...skills, { name, category: skillInput.category || "Other", proficiency: 80 }]);
    }
  };
  const removeSkill = (name) => setSkills(skills.filter(s => s.name !== name));

  const handleFinish = async () => {
    setLoading(true);
    try {
      await api.put("/profile", { ...profile, templateId, status: "PUBLISHED" });
      if (skills.length > 0) await api.post("/skills/bulk", { skills });
      for (const p of projects) {
        if (p.title) await api.post("/projects", p);
      }
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      alert("Error saving setup");
    } finally {
      setLoading(false);
    }
  };

  // Generate real-time preview data
  const previewData = useMemo(() => {
    return {
      profile: {
        ...profile,
        username: user?.username,
        template: allTemplates.find(t => t.id === templateId) || { slug: 'minimal' },
        themeMode: 'DARK'
      },
      skills: skills,
      projects: projects.filter(p => p.title),
      socialLinks: []
    };
  }, [profile, skills, projects, templateId, allTemplates, user]);

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950 font-sans">
      <Helmet><title>Setup your Developer Identity</title></Helmet>

      {/* LEFT: Interactive Wizard */}
      <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 relative z-10 shadow-premium">
        
        {/* Header */}
        <div className="p-6 border-b border-surface-200 dark:border-surface-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">C</div>
          <span className="font-display font-bold">CodeFolio</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-surface-100 dark:bg-surface-800 w-full relative">
          <div className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-300" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <p className="text-xs font-bold text-primary-500 tracking-widest uppercase mb-2">Step {step + 1} of {STEPS.length}</p>
          
          {/* Step 0: Identity */}
          {step === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black mb-2">Who are you?</h2>
              <p className="text-surface-500 mb-8 text-sm">Let's start with the basics of your developer identity.</p>
              <div className="space-y-5">
                <div><label className="label">Display Name</label><input className="input" value={profile.displayName} onChange={e => setProfile(f => ({ ...f, displayName: e.target.value }))} placeholder="Jane Doe" /></div>
                <div><label className="label">Professional Headline</label><input className="input" value={profile.headline} onChange={e => setProfile(f => ({ ...f, headline: e.target.value }))} placeholder="Full Stack Developer at Acme Inc." /></div>
                <div><label className="label">Location</label><input className="input" value={profile.location} onChange={e => setProfile(f => ({ ...f, location: e.target.value }))} placeholder="San Francisco, CA" /></div>
              </div>
            </div>
          )}

          {/* Step 1: Story */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black mb-2">Your developer story</h2>
              <p className="text-surface-500 mb-6 text-sm">Write a short bio that tells your story. What do you build and why?</p>
              <textarea className="input min-h-[160px] resize-none" value={profile.bio} onChange={e => setProfile(f => ({ ...f, bio: e.target.value }))} placeholder="I'm a full stack developer with a passion for building products that scale. I specialize in React and Node.js..." maxLength={1000} />
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black mb-2">Your Expertise</h2>
              <p className="text-surface-500 mb-6 text-sm">Add the tools and languages you use daily.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {POPULAR_SKILLS.map(s => (
                  <button key={s} type="button" onClick={() => skills.find(x => x.name === s) ? removeSkill(s) : addSkill(s)} className={`badge px-3 py-1.5 cursor-pointer ${skills.find(x => x.name === s) ? 'badge-primary' : 'hover:border-primary-300'}`}>{s}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input className="input flex-1" placeholder="Custom skill..." value={skillInput.name} onChange={e => setSkillInput(f => ({ ...f, name: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (skillInput.name) { addSkill(skillInput.name); setSkillInput(f => ({ ...f, name: "" })); } } }} />
                <button onClick={() => { if(skillInput.name){ addSkill(skillInput.name); setSkillInput(f=>({...f, name:""}))} }} className="btn-secondary">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">{skills.map(s => <span key={s.name} className="badge badge-primary">{s.name}</span>)}</div>
            </div>
          )}

          {/* Step 3: Projects */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black mb-2">Highlight your Projects</h2>
              <p className="text-surface-500 mb-6 text-sm">Add the projects you're most proud of. You can always add more later.</p>
              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                {projects.map((p, index) => (
                  <div key={index} className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/20 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="label mb-0">Project {index + 1}</label>
                      {projects.length > 1 && (
                        <button onClick={() => setProjects(projects.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-600 text-xs font-bold">Remove</button>
                      )}
                    </div>
                    <div><input className="input" value={p.title} onChange={e => { const newP = [...projects]; newP[index].title = e.target.value; setProjects(newP); }} placeholder="E-commerce Platform" /></div>
                    <div><textarea className="input min-h-[60px]" value={p.description} onChange={e => { const newP = [...projects]; newP[index].description = e.target.value; setProjects(newP); }} placeholder="What does it do?" /></div>
                    <div><input className="input" value={p.techStack} onChange={e => { const newP = [...projects]; newP[index].techStack = e.target.value; setProjects(newP); }} placeholder="React, Node.js, Stripe" /></div>
                  </div>
                ))}
                <button onClick={() => setProjects([...projects, { title: "", description: "", techStack: "" }])} className="w-full py-3 rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700 text-surface-500 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors font-bold text-sm">
                  + Add Another Project
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Theme */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black mb-2">Choose a layout</h2>
              <p className="text-surface-500 mb-6 text-sm">Select a starting template. Watch the live preview update instantly!</p>
              <div className="grid grid-cols-1 gap-3">
                {allTemplates.map(t => (
                  <button key={t.id} type="button" onClick={() => setTemplateId(t.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${templateId === t.id ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-surface-200 dark:border-surface-700 hover:border-primary-300"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-surface-900 dark:text-white text-sm">{t.name}</p>
                      {t.isPremium && <span className="badge badge-primary text-[10px]">Pro</span>}
                    </div>
                    <p className="text-xs text-surface-500 leading-relaxed">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Finish */}
          {step === 5 && (
            <div className="animate-fade-in text-center mt-12">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"><RocketLaunchIcon className="w-10 h-10" /></div>
              <h2 className="text-2xl font-black mb-2">Identity Generated</h2>
              <p className="text-surface-500 mb-8 text-sm">Your developer portfolio is ready to go live.</p>
              <div className="bg-surface-100 dark:bg-surface-800 p-4 rounded-xl border border-surface-200 dark:border-surface-700 mb-8">
                <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">Your URL</p>
                <p className="font-mono font-bold text-primary-500">codefolio.dev/{user?.username}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between bg-surface-50 dark:bg-surface-950/50">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="btn-ghost disabled:opacity-0">Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-primary px-8">Next &rarr;</button>
          ) : (
            <button onClick={handleFinish} disabled={loading} className="btn-primary px-8">{loading ? 'Publishing...' : 'Publish Identity'}</button>
          )}
        </div>
      </div>

      {/* RIGHT: Live Interactive Preview */}
      <div className="hidden lg:flex flex-1 bg-surface-100 dark:bg-surface-950 p-8 items-center justify-center overflow-hidden relative">
        <div className="absolute top-4 right-8 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-surface-500 uppercase tracking-widest">Live Preview</span>
        </div>
        
        {/* Scale the preview down to fit the window beautifully */}
        <div className="w-full h-full max-w-4xl max-h-[800px] rounded-2xl overflow-hidden shadow-2xl dark:shadow-premium-dark border border-surface-200 dark:border-surface-800 relative bg-white dark:bg-surface-900 pointer-events-none origin-center" style={{ transform: 'scale(0.85)' }}>
          
          {/* Mac-style window header */}
          <div className="h-10 bg-surface-100 dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 flex items-center px-4 gap-2 absolute top-0 left-0 right-0 z-[100]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </div>
          
          <div className="w-full h-full pt-10 overflow-y-auto no-scrollbar bg-black">
            <PortfolioRenderer data={previewData} />
          </div>
        </div>
      </div>

    </div>
  );
}
