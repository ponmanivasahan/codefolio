import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { GlobeAltIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function DomainPage() {
  const { user } = useAuth();
  const isPro = user?.subscription?.plan === "PRO";
  const [domains, setDomains] = useState([]);
  const [form, setForm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get("/domains").then(r => setDomains(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try { await api.post("/domains", { domain: form }); setForm(""); load(); }
    catch (err) { setError(err.response?.data?.message || "Failed to add domain"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this domain?")) return;
    await api.delete(`/domains/${id}`); load();
  };

  const statusBadge = (status) => {
    const map = { PENDING: "badge bg-yellow-100 text-yellow-700", VERIFIED: "badge bg-green-100 text-green-700", FAILED: "badge bg-red-100 text-red-700" };
    return map[status] || map.PENDING;
  };

  if (loading) return <div className="animate-pulse space-y-4">{[1,2].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}</div>;

  return (
    <>
      <Helmet><title>Custom Domain — CodeFolio Dashboard</title></Helmet>
      <div className="max-w-2xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Custom Domain</h1>
          <p className="text-gray-500 mt-1">Connect your own domain to your portfolio</p>
        </div>

        {!isPro ? (
          <div className="card p-8 text-center">
            <GlobeAltIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Pro Feature</h3>
            <p className="text-gray-500 mb-6">Custom domains are available on the Pro plan. Point john.com to your CodeFolio portfolio.</p>
            <Link to="/pricing" className="btn-primary">Upgrade to Pro — $9/mo</Link>
          </div>
        ) : (
          <>
            <div className="card p-6 mb-6">
              <h2 className="font-semibold mb-4">Add custom domain</h2>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
              <form onSubmit={handleAdd} className="flex gap-3">
                <input className="input flex-1" required placeholder="yourdomain.com" value={form}
                  onChange={e => setForm(e.target.value.toLowerCase().replace(/^https?:\/\//, ""))} />
                <button type="submit" disabled={saving} className="btn-primary px-5">{saving ? "Adding..." : "Add"}</button>
              </form>
            </div>

            <div className="card p-6 mb-6">
              <h3 className="font-semibold mb-3">Setup Instructions</h3>
              <ol className="list-decimal ml-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Add your domain below</li>
                <li>Go to your domain registrar's DNS settings</li>
                <li>Add a <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">CNAME</code> record pointing to <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">codefolio.vercel.app</code></li>
                <li>DNS propagation can take up to 24 hours</li>
              </ol>
            </div>

            {domains.length === 0 ? (
              <div className="card p-10 text-center">
                <GlobeAltIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No domains added yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {domains.map(d => (
                  <div key={d.id} className="card p-5 flex items-center gap-4">
                    <GlobeAltIcon className="w-8 h-8 text-primary-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{d.domain}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={statusBadge(d.verificationStatus)}>{d.verificationStatus}</span>
                        {d.cnameTarget && <span className="text-xs text-gray-400">CNAME → {d.cnameTarget}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(d.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

