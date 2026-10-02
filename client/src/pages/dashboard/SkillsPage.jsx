import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { api } from "../../services/api.js";

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"];

function SkillCard({ skill, onDelete }) {
  const colorMap = {
    Frontend: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Backend: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Database: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    DevOps: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    Tools: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    Other: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  };
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 group">
      <span className={`badge text-xs px-2 py-0.5 ${colorMap[skill.category] || colorMap.Other}`}>{skill.category}</span>
      <span className="flex-1 text-sm font-medium">{skill.name}</span>
      <div className="flex items-center gap-2 min-w-[80px]">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${skill.proficiency}%` }} />
        </div>
        <span className="text-xs text-gray-400 w-8 text-right">{skill.proficiency}%</span>
      </div>
      <button onClick={() => onDelete(skill.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400">
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", category: "Frontend", proficiency: 75 });
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/skills").then(r => setSkills(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post("/skills", form);
      setForm(f => ({ ...f, name: "" }));
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/skills/${id}`);
    load();
  };

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catSkills = skills.filter(s => s.category === cat);
    if (catSkills.length) acc[cat] = catSkills;
    return acc;
  }, {});

  if (loading) return <div className="space-y-3 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}</div>;

  return (
    <>
      <Helmet><title>Skills — CodeFolio Dashboard</title></Helmet>
      <div className="max-w-2xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-gray-500 mt-1">{skills.length} skill{skills.length !== 1 ? "s" : ""} added</p>
        </div>

        {/* Add skill form */}
        <div className="card p-6 mb-8">
          <h2 className="font-semibold mb-4">Add a skill</h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input className="input flex-1" required placeholder="e.g., React" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <select className="input sm:w-36" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="flex items-center gap-2 sm:w-36">
              <input type="range" min="0" max="100" step="5" value={form.proficiency} className="flex-1"
                onChange={e => setForm(f => ({ ...f, proficiency: Number(e.target.value) }))} />
              <span className="text-sm text-gray-500 w-8">{form.proficiency}%</span>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5">
              <PlusIcon className="w-4 h-4" /> Add
            </button>
          </form>
        </div>

        {/* Skills grouped */}
        {skills.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-4xl mb-3">🧠</p>
            <h3 className="text-xl font-bold mb-2">No skills yet</h3>
            <p className="text-gray-500">Add your tech stack above to showcase your expertise.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, catSkills]) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{cat}</h3>
                <div className="space-y-2">
                  {catSkills.map(s => <SkillCard key={s.id} skill={s} onDelete={handleDelete} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

