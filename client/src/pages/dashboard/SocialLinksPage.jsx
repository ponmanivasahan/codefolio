import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { api } from "../../services/api.js";

const PLATFORMS = ["GitHub","LinkedIn","Twitter","YouTube","Dev.to","Medium","Website","Instagram","Dribbble","Other"];

export default function SocialLinksPage() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ platform: "GitHub", url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/social-links").then(r => setLinks(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.post("/social-links", form); setForm(f => ({ ...f, url: "" })); load(); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id) => { await api.delete(`/social-links/${id}`); load(); };

  const platformIcon = (platform) => {
    const icons = {
      GitHub: "🐙", LinkedIn: "💼", Twitter: "🐦", YouTube: "▶️",
      "Dev.to": "👩‍💻", Medium: "📝", Website: "🌐", Instagram: "📷", Dribbble: "🏀", Other: "🔗",
    };
    return icons[platform] || "🔗";
  };

  if (loading) return <div className="space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}</div>;

  return (
    <>
      <Helmet><title>Social Links — CodeFolio Dashboard</title></Helmet>
      <div className="max-w-xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Social Links</h1>
          <p className="text-gray-500 mt-1">Connect your online presence</p>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="font-semibold mb-4">Add a link</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="flex gap-3">
              <select className="input w-40" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
              <input required type="url" className="input flex-1" placeholder="https://..." value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5">
              <PlusIcon className="w-4 h-4" /> Add link
            </button>
          </form>
        </div>

        {links.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-4xl mb-3">🔗</p>
            <h3 className="text-xl font-bold mb-2">No social links yet</h3>
            <p className="text-gray-500">Add your profiles to make it easy for people to connect.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map(l => (
              <div key={l.id} className="card p-4 flex items-center gap-3 group">
                <span className="text-2xl">{platformIcon(l.platform)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{l.platform}</p>
                  <a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:text-primary-700 truncate block">{l.url}</a>
                </div>
                <button onClick={() => handleDelete(l.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

