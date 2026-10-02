import React, { useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Fuse from "fuse.js";

const MagnifyingGlassIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function CommandPalette({ data }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const profile = data?.profile;
  const commands = [
    { label: "View Projects", action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), icon: "🗂" },
    { label: "View Skills", action: () => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }), icon: "🧠" },
    { label: "Contact", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), icon: "📧" },
    ...(profile?.resumeUrl ? [{ label: "Download Resume", action: () => window.open(profile.resumeUrl, "_blank"), icon: "📄" }] : []),
    ...(profile?.githubUsername ? [{ label: "GitHub Profile", action: () => window.open(`https://github.com/${profile.githubUsername}`, "_blank"), icon: "🐙" }] : []),
    ...(profile?.linkedinUrl ? [{ label: "LinkedIn", action: () => window.open(profile.linkedinUrl, "_blank"), icon: "💼" }] : []),
    ...(data?.projects || []).map(p => ({
      label: `Project: ${p.title}`,
      action: () => document.getElementById(`project-${p.id}`)?.scrollIntoView({ behavior: "smooth" }),
      icon: "🔧",
    })),
  ];

  const fuse = new Fuse(commands, { keys: ["label"], threshold: 0.3 });

  useHotkeys("ctrl+k, meta+k", (e) => { e.preventDefault(); setOpen(o => !o); }, { enableOnFormTags: false });

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setResults(commands);
      setSelected(0);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    setResults(query ? fuse.search(query).map(r => r.item) : commands);
    setSelected(0);
  }, [query]);

  const run = (cmd) => { cmd.action(); setOpen(false); };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 bg-gray-900 text-white text-xs font-mono px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-all z-50 flex items-center gap-2 opacity-70 hover:opacity-100"
      title="Open Command Palette (Ctrl+K)">
      ⌘K
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 gap-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm"
            placeholder="Search portfolio..."
            onKeyDown={e => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
              if (e.key === "Enter" && results[selected]) run(results[selected]);
              if (e.key === "Escape") setOpen(false);
            }} />
          <kbd className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">No results found</div>
          ) : results.map((cmd, i) => (
            <button key={cmd.label} onClick={() => run(cmd)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === selected ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>
              <span className="text-lg">{cmd.icon}</span>
              <span className="text-sm font-medium">{cmd.label}</span>
            </button>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex gap-3">
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Enter</kbd> select</span>
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
