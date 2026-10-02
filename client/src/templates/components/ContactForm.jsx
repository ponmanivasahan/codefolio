import React, { useState } from "react";
import { api } from "../../services/api.js";

export default function ContactForm({ username, theme = "light" }) {
  const [form, setForm] = useState({ senderName: "", senderEmail: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));
  const dark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await api.post(`/contact/${username}`, form);
      setSuccess(true);
      setForm({ senderName: "", senderEmail: "", subject: "", message: "" });
    } catch (err) { setError(err.response?.data?.message || "Failed to send. Please try again."); }
    finally { setLoading(false); }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${dark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"}`;

  if (success) return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-bold mb-2">Message sent!</h3>
      <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Thanks for reaching out. I'll get back to you soon.</p>
      <button onClick={() => setSuccess(false)} className="mt-4 text-primary-500 text-sm underline">Send another</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-600"}`}>Name</label>
          <input required className={inputClass} placeholder="Jane Doe" value={form.senderName} onChange={set("senderName")} />
        </div>
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-600"}`}>Email</label>
          <input required type="email" className={inputClass} placeholder="jane@example.com" value={form.senderEmail} onChange={set("senderEmail")} />
        </div>
      </div>
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-600"}`}>Subject</label>
        <input className={inputClass} placeholder="What's this about?" value={form.subject} onChange={set("subject")} />
      </div>
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-600"}`}>Message</label>
        <textarea required className={`${inputClass} min-h-[120px] resize-y`} placeholder="Your message..." value={form.message} onChange={set("message")} />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Sending..." : "Send message →"}
      </button>
    </form>
  );
}
