import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api.js";
import { CheckIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const ACCENTS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#f97316"];

export default function DesignPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isPro = user?.subscription?.plan === "PRO";

  useEffect(() => {
    Promise.all([api.get("/templates"), api.get("/profile")]).then(([t, p]) => {
      setTemplates(t.data.data);
      setProfile(p.data.data);
    });
  }, []);

  const save = async (data) => {
    setSaving(true);
    try {
      const res = await api.put("/profile", data);
      setProfile(res.data.data);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  };

  const templateColors = {
    minimal: "bg-gradient-to-br from-white to-gray-100 border-gray-200",
    terminal: "bg-gradient-to-br from-gray-900 to-black border-gray-700",
    "cyber-grid": "bg-gradient-to-br from-gray-950 to-slate-900 border-cyan-800",
    executive: "bg-gradient-to-br from-slate-700 to-slate-900 border-slate-600",
  };

  if (!profile) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}</div>;

  return (
    <>
      <Helmet><title>Design — CodeFolio Dashboard</title></Helmet>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Design</h1>
            <p className="text-gray-500 mt-1">Choose your portfolio template and theme</p>
          </div>
          {saved && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
          {saving && <span className="text-sm text-yellow-600">Saving...</span>}
        </div>

        {/* Templates */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-5">Template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map(t => {
              const locked = t.isPremium && !isPro;
              const active = profile.templateId === t.id;
              return (
                <div key={t.id}
                  className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${active ? "border-primary-500 ring-2 ring-primary-500/30" : "border-gray-200 dark:border-gray-700 hover:border-primary-300"} ${locked ? "opacity-70" : ""}`}
                  onClick={() => !locked && save({ templateId: t.id })}>
                  <div className={`h-28 ${templateColors[t.slug] || "bg-gray-100"}`}>
                    {locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                          <LockClosedIcon className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs">Pro</span>
                        </div>
                      </div>
                    )}
                    {active && !locked && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.description}</p>
                    {t.isPremium && <span className="badge bg-primary-100 text-primary-700 text-xs mt-1">Pro</span>}
                  </div>
                </div>
              );
            })}
          </div>
          {!isPro && (
            <div className="mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <p className="text-sm text-primary-700 dark:text-primary-400">
                🔒 <strong>Cyber Grid</strong> and <strong>Executive</strong> templates are Pro-only.
                <Link to="/pricing" className="ml-2 underline font-semibold">Upgrade for $9/mo</Link>
              </p>
            </div>
          )}
        </div>

        {/* Theme */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-5">Theme Mode</h2>
          <div className="flex gap-3">
            {[["LIGHT","☀️ Light"],["DARK","🌙 Dark"],["SYSTEM","💻 System"]].map(([val, label]) => (
              <button key={val}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${profile.themeMode === val ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400" : "border-gray-200 dark:border-gray-700 hover:border-primary-300"}`}
                onClick={() => save({ themeMode: val })}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="card p-6">
          <h2 className="font-semibold mb-5">Accent Color</h2>
          <div className="flex gap-3 flex-wrap">
            {ACCENTS.map(color => (
              <button key={color} onClick={() => save({ accentColor: color })}
                className={`w-10 h-10 rounded-full border-4 transition-all ${profile.accentColor === color ? "border-gray-900 dark:border-white scale-110" : "border-transparent hover:scale-105"}`}
                style={{ backgroundColor: color }} title={color} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


