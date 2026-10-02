import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api.js";

function AutoSaveStatus({ status }) {
  if (!status) return null;
  const colors = { saving: "text-yellow-600", saved: "text-green-600", error: "text-red-500" };
  const texts = { saving: "Saving...", saved: "Saved ✨", error: "Unable to save - Retry" };
  return <span className={`text-sm font-medium ${colors[status]}`}>{texts[status]}</span>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveTimer, setSaveTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/profile").then(r => {
      setProfile(r.data.data);
      setForm(r.data.data || {});
    }).finally(() => setLoading(false));
  }, []);

  const debouncedSave = useCallback((data) => {
    if (saveTimer) clearTimeout(saveTimer);
    setSaveStatus("saving");
    const t = setTimeout(async () => {
      try {
        await api.put("/profile", data);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(null), 3000);
      } catch {
        setSaveStatus("error");
      }
    }, 1500);
    setSaveTimer(t);
  }, [saveTimer]);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    const newForm = { ...form, [field]: val };
    setForm(newForm);
    debouncedSave(newForm);
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-6xl mx-auto">
      {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}
    </div>
  );

  return (
    <>
      <Helmet><title>Profile - CodeFolio Dashboard</title></Helmet>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-surface-500 mt-1">Your public developer identity</p>
          </div>
          <AutoSaveStatus status={saveStatus} />
        </div>

        <div className="space-y-12 pb-12">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="font-semibold text-lg text-surface-900 dark:text-white mb-2">Basic Info</h2>
              <p className="text-sm text-surface-500 leading-relaxed">Set your name, headline, and tell your story. This is the first thing people see when they visit your portfolio.</p>
            </div>
            <div className="md:col-span-2 card p-6 sm:p-8 space-y-6">
              <div>
                <label className="label">Display Name</label>
                <input className="input" value={form.displayName || ""} onChange={handleChange("displayName")} placeholder="Jane Doe" maxLength={150} />
                <p className="text-xs text-surface-400 mt-1.5 text-right">{(form.displayName || "").length}/150</p>
              </div>
              <div>
                <label className="label">Professional Headline</label>
                <input className="input" value={form.headline || ""} onChange={handleChange("headline")} placeholder="Full Stack Developer building scalable web apps" maxLength={200} />
                <p className="text-xs text-surface-400 mt-1.5 text-right">{(form.headline || "").length}/200</p>
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea className="input min-h-[140px] resize-y" value={form.bio || ""} onChange={handleChange("bio")} placeholder="Tell your story. What do you build? What are you passionate about?" maxLength={1000} />
                <p className="text-xs text-surface-400 mt-1.5 text-right">{(form.bio || "").length}/1000</p>
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={form.location || ""} onChange={handleChange("location")} placeholder="San Francisco, CA" maxLength={100} />
              </div>
            </div>
          </div>

          <hr className="border-surface-200 dark:border-surface-800" />

          {/* Section 2: Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="font-semibold text-lg text-surface-900 dark:text-white mb-2">Links & Profiles</h2>
              <p className="text-sm text-surface-500 leading-relaxed">Connect your GitHub, LinkedIn, and personal website to help recruiters find you.</p>
            </div>
            <div className="md:col-span-2 card p-6 sm:p-8 space-y-6">
              <div>
                <label className="label">GitHub Username</label>
                <div className="flex items-center">
                  <span className="px-4 py-3 bg-surface-100 dark:bg-surface-800 border border-r-0 border-surface-200 dark:border-surface-700 rounded-l-xl text-surface-500 text-sm font-medium">github.com/</span>
                  <input className="input rounded-l-none" value={form.githubUsername || ""} onChange={handleChange("githubUsername")} placeholder="your-username" />
                </div>
              </div>
              <div>
                <label className="label">LinkedIn URL</label>
                <input className="input" value={form.linkedinUrl || ""} onChange={handleChange("linkedinUrl")} placeholder="https://linkedin.com/in/yourname" />
              </div>
              <div>
                <label className="label">Personal Website</label>
                <input className="input" value={form.websiteUrl || ""} onChange={handleChange("websiteUrl")} placeholder="https://yoursite.com" />
              </div>
            </div>
          </div>

          <hr className="border-surface-200 dark:border-surface-800" />

          {/* Section 3: Media */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="font-semibold text-lg text-surface-900 dark:text-white mb-2">Media & Documents</h2>
              <p className="text-sm text-surface-500 leading-relaxed">Upload a professional headshot and link your downloadable resume.</p>
            </div>
            <div className="md:col-span-2 card p-6 sm:p-8 space-y-6">
              <div>
                <label className="label">Profile Image URL</label>
                <input className="input" value={form.profileImage || ""} onChange={handleChange("profileImage")} placeholder="https://example.com/photo.jpg" />
                {form.profileImage && (
                  <div className="mt-4 flex items-center gap-4">
                    <img src={form.profileImage} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-surface-200 dark:border-surface-700" onError={e => e.target.style.display = "none"} />
                    <span className="text-xs text-surface-500">Image preview active</span>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Resume URL</label>
                <input className="input" value={form.resumeUrl || ""} onChange={handleChange("resumeUrl")} placeholder="https://drive.google.com/your-resume.pdf" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}