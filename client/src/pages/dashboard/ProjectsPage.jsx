import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlusIcon, PencilIcon, TrashIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { api } from "../../services/api.js";

const EMPTY_PROJECT = { title: "", description: "", techStack: "", repoUrl: "", liveUrl: "", screenshotUrl: "", featured: false, problem: "", solution: "", impact: "" };

function TechChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium">
      {label}
      {onRemove && <button type="button" onClick={onRemove} className="hover:text-red-500 ml-0.5">Ã—</button>}
    </span>
  );
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_PROJECT);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const techs = form.techStack ? form.techStack.split(",").filter(Boolean) : [];

  const addTech = () => {
    const t = techInput.trim();
    if (t && !techs.includes(t)) setForm(f => ({ ...f, techStack: [...techs, t].join(",") }));
    setTechInput("");
  };
  const removeTech = (t) => setForm(f => ({ ...f, techStack: techs.filter(x => x !== t).join(",") }));

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const check = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await onSave(form); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="label">Project Title *</label><input className="input" required value={form.title} onChange={set("title")} placeholder="My Awesome Project" /></div>
      <div><label className="label">Description</label><textarea className="input min-h-[80px]" value={form.description || ""} onChange={set("description")} placeholder="What does it do?" /></div>
      
      <div>
        <label className="label">Tech Stack</label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {techs.map(t => <TechChip key={t} label={t} onRemove={() => removeTech(t)} />)}
        </div>
        <div className="flex gap-2">
          <input className="input flex-1" value={techInput} onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
            placeholder="React, Node.js, MySQL..." />
          <button type="button" onClick={addTech} className="btn-secondary px-4">Add</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="label">GitHub URL</label><input className="input" value={form.repoUrl || ""} onChange={set("repoUrl")} placeholder="https://github.com/..." /></div>
        <div><label className="label">Live Demo URL</label><input className="input" value={form.liveUrl || ""} onChange={set("liveUrl")} placeholder="https://..." /></div>
      </div>

      <div><label className="label">Screenshot URL</label><input className="input" value={form.screenshotUrl || ""} onChange={set("screenshotUrl")} placeholder="https://..." /></div>

      <div className="card bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3 rounded-xl">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Impact (optional)</h4>
        <div><label className="label text-xs">Problem</label><textarea className="input min-h-[60px] text-sm" value={form.problem || ""} onChange={set("problem")} placeholder="What problem did this solve?" /></div>
        <div><label className="label text-xs">Solution</label><textarea className="input min-h-[60px] text-sm" value={form.solution || ""} onChange={set("solution")} placeholder="How did you solve it?" /></div>
        <div><label className="label text-xs">Impact</label><textarea className="input min-h-[60px] text-sm" value={form.impact || ""} onChange={set("impact")} placeholder="Reduced X by Y%, saved N hours/week..." /></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={check("featured")} className="w-4 h-4 rounded text-primary-600" />
        <span className="text-sm font-medium">Featured project</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Save project"}</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/projects").then(r => setProjects(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (editing) { await api.put(`/projects/${editing.id}`, form); }
    else { await api.post("/projects", form); }
    setShowForm(false); setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  const handleToggleFeatured = async (p) => {
    await api.put(`/projects/${p.id}`, { featured: !p.featured });
    load();
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-6xl mx-auto">
      {[1,2].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
    </div>
  );

  return (
    <>
      <Helmet><title>Projects â€” CodeFolio Dashboard</title></Helmet>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-500 mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} in your portfolio</p>
          </div>
          {!showForm && !editing && (
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> Add project
            </button>
          )}
        </div>

        {(showForm && !editing) && (
          <div className="card p-6 mb-6 animate-slide-up">
            <h2 className="font-bold text-lg mb-5">New Project</h2>
            <ProjectForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {projects.length === 0 && !showForm && (
          <EmptyState 
            icon="ðŸš€" 
            title="No projects yet" 
            description="Your next great build belongs here. Add your first project to start showing off your skills." 
            actionText="Add Project" 
            actionLink="#"
            onAction={(e) => { e.preventDefault(); setShowForm(true); }}
          />
        )}

        {projects.length > 0 && !editing && (
          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.id} className="card overflow-hidden">
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg truncate">{p.title}</h3>
                      {p.featured && <span className="badge bg-yellow-100 text-yellow-700 text-xs">â­ Featured</span>}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{p.description}</p>
                    {p.techStack && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.techStack.split(",").map(t => <TechChip key={t} label={t} />)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleToggleFeatured(p)} title="Toggle featured"
                      className={`p-2 rounded-lg transition-colors ${p.featured ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                      {p.featured ? <StarSolid className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setEditing(p)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {editing && (
          <div className="card p-6 animate-slide-up">
            <h3 className="font-bold text-lg mb-5">Edit Project</h3>
            <ProjectForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
          </div>
        )}
      </div>
    </>
  );
}

function FolderIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v8.25" /></svg>;
}

